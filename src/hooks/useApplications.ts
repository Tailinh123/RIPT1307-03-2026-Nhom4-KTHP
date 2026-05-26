import { useState, useEffect, useCallback } from 'react';
import { applicationApi, type BackendApplication } from '@/api/applicationApi';
import type { Application, ApplicationStatus } from '@/types/application';

interface StatusCounts {
  total: number;
  PENDING: number;
  REVIEWING: number;
  APPROVED: number;
  REJECTED: number;
}

interface UseApplicationsReturn {
  applications: Application[];
  total: number;
  loading: boolean;
  error: string | null;
  statusFilter: ApplicationStatus | 'ALL';
  setStatusFilter: (s: ApplicationStatus | 'ALL') => void;
  searchKeyword: string;
  setSearchKeyword: (k: string) => void;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  statusCounts: StatusCounts;
  refetch: () => void;
}

// Map backend Application → frontend Application
function mapBackendApplication(app: BackendApplication): Application {
  return {
    id: app.id,
    jobId: app.job?.id ?? 0,
    jobTitle: app.job?.name ?? '(Không rõ vị trí)',
    companyName: app.job?.company?.name ?? '(Không rõ công ty)',
    resumeId: app.resume?.id ?? 0,
    resumeName: app.resume?.title ?? app.resume?.url ?? 'CV',
    status: (app.status ?? 'PENDING') as ApplicationStatus,
    rejectNote: app.note ?? undefined,
    appliedAt: app.createdAt,
    updatedAt: app.updatedAt,
  };
}

export function useApplications(): UseApplicationsReturn {
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await applicationApi.getMyApplications();
      setAllApplications(raw.map(mapBackendApplication));
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Lỗi kết nối';
      setError(`Không thể tải danh sách đơn ứng tuyển: ${msg}`);
      setAllApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // ── Status counts (always from ALL data) ──
  const statusCounts: StatusCounts = {
    total: allApplications.length,
    PENDING: allApplications.filter((a) => a.status === 'PENDING').length,
    REVIEWING: allApplications.filter((a) => a.status === 'REVIEWING').length,
    APPROVED: allApplications.filter((a) => a.status === 'APPROVED').length,
    REJECTED: allApplications.filter((a) => a.status === 'REJECTED').length,
  };

  // ── Filtering ──
  const filtered = allApplications.filter((app) => {
    const matchStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const kw = searchKeyword.toLowerCase();
    const matchKeyword =
      !kw ||
      app.jobTitle.toLowerCase().includes(kw) ||
      app.companyName.toLowerCase().includes(kw);
    return matchStatus && matchKeyword;
  });

  // ── Paginate ──
  const startIdx = (page - 1) * pageSize;
  const paginated = filtered.slice(startIdx, startIdx + pageSize);

  return {
    applications: paginated,
    total: filtered.length,
    loading,
    error,
    statusFilter,
    setStatusFilter: (s) => { setStatusFilter(s); setPage(1); },
    searchKeyword,
    setSearchKeyword: (k) => { setSearchKeyword(k); setPage(1); },
    page,
    setPage,
    pageSize,
    statusCounts,
    refetch: fetchApplications,
  };
}

