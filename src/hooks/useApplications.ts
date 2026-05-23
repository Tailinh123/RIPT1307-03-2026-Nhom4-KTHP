import { useState, useEffect, useCallback } from 'react';
import { applicationApi } from '@/api/applicationApi';
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
      const res = await applicationApi.getMyApplications();
      setAllApplications(res.data.data);
    } catch {
      setError('Không thể tải danh sách đơn ứng tuyển. Đang hiển thị dữ liệu mẫu.');
      setAllApplications(getMockApplications());
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

// ── Mock data for local development without backend ──────────────────────
function getMockApplications(): Application[] {
  return [
    {
      id: 1,
      jobId: 1,
      jobTitle: 'Frontend Developer Intern',
      companyName: 'FPT Software',
      resumeId: 1,
      resumeName: 'CV_NguyenVanA.pdf',
      status: 'APPROVED',
      appliedAt: '2026-04-01T09:48:00Z',
      updatedAt: '2026-04-05T14:00:00Z',
    },
    {
      id: 2,
      jobId: 2,
      jobTitle: 'Backend Developer Intern',
      companyName: 'VNG Corporation',
      resumeId: 1,
      resumeName: 'CV_NguyenVanA.pdf',
      status: 'PENDING',
      appliedAt: '2026-04-01T09:12:00Z',
      updatedAt: '2026-04-01T09:12:00Z',
    },
    {
      id: 3,
      jobId: 3,
      jobTitle: 'UI/UX Designer Intern',
      companyName: 'Grab Vietnam',
      resumeId: 2,
      resumeName: 'CV_Design_Portfolio.pdf',
      status: 'REVIEWING',
      appliedAt: '2026-04-02T10:30:00Z',
      updatedAt: '2026-04-04T08:15:00Z',
    },
    {
      id: 4,
      jobId: 4,
      jobTitle: 'Marketing Intern',
      companyName: 'Shopee Vietnam',
      resumeId: 1,
      resumeName: 'CV_NguyenVanA.pdf',
      status: 'REJECTED',
      rejectNote: 'Hồ sơ chưa đáp ứng yêu cầu về kinh nghiệm thực tế trong lĩnh vực Digital Marketing. Vui lòng bổ sung thêm dự án cá nhân hoặc chứng chỉ liên quan.',
      appliedAt: '2026-04-01T09:18:00Z',
      updatedAt: '2026-04-06T16:45:00Z',
    },
    {
      id: 5,
      jobId: 5,
      jobTitle: 'Data Analyst Intern',
      companyName: 'Momo',
      resumeId: 3,
      resumeName: 'CV_DataScience.pdf',
      status: 'PENDING',
      appliedAt: '2026-04-03T14:22:00Z',
      updatedAt: '2026-04-03T14:22:00Z',
    },
    {
      id: 6,
      jobId: 6,
      jobTitle: 'Mobile Developer Intern',
      companyName: 'Tiki',
      resumeId: 1,
      resumeName: 'CV_NguyenVanA.pdf',
      status: 'REVIEWING',
      appliedAt: '2026-04-02T16:00:00Z',
      updatedAt: '2026-04-05T09:30:00Z',
    },
    {
      id: 7,
      jobId: 7,
      jobTitle: 'HR Intern',
      companyName: 'Viettel',
      resumeId: 1,
      resumeName: 'CV_NguyenVanA.pdf',
      status: 'APPROVED',
      appliedAt: '2026-04-01T09:28:00Z',
      updatedAt: '2026-04-07T11:00:00Z',
    },
    {
      id: 8,
      jobId: 8,
      jobTitle: 'Finance Intern',
      companyName: 'BIDV',
      resumeId: 4,
      resumeName: 'CV_Finance.pdf',
      status: 'REJECTED',
      rejectNote: 'Vị trí đã tuyển đủ số lượng. Chúng tôi sẽ liên hệ lại nếu có vị trí phù hợp trong tương lai.',
      appliedAt: '2026-04-04T08:45:00Z',
      updatedAt: '2026-04-08T10:20:00Z',
    },
    {
      id: 9,
      jobId: 9,
      jobTitle: 'DevOps Intern',
      companyName: 'CMC Technology',
      resumeId: 1,
      resumeName: 'CV_NguyenVanA.pdf',
      status: 'PENDING',
      appliedAt: '2026-04-05T11:10:00Z',
      updatedAt: '2026-04-05T11:10:00Z',
    },
    {
      id: 10,
      jobId: 10,
      jobTitle: 'Content Creator Intern',
      companyName: 'Lazada Vietnam',
      resumeId: 2,
      resumeName: 'CV_Design_Portfolio.pdf',
      status: 'REVIEWING',
      appliedAt: '2026-04-06T09:00:00Z',
      updatedAt: '2026-04-08T14:30:00Z',
    },
    {
      id: 11,
      jobId: 11,
      jobTitle: 'QA Tester Intern',
      companyName: 'KMS Technology',
      resumeId: 1,
      resumeName: 'CV_NguyenVanA.pdf',
      status: 'APPROVED',
      appliedAt: '2026-04-03T15:30:00Z',
      updatedAt: '2026-04-09T10:00:00Z',
    },
    {
      id: 12,
      jobId: 12,
      jobTitle: 'Sales Intern',
      companyName: 'Vingroup',
      resumeId: 1,
      resumeName: 'CV_NguyenVanA.pdf',
      status: 'PENDING',
      appliedAt: '2026-04-07T13:45:00Z',
      updatedAt: '2026-04-07T13:45:00Z',
    },
  ];
}
