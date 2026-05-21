import { useState, useEffect, useCallback } from 'react';
import { jobApi } from '@/api/jobApi';
import type { Job, JobFilterParams } from '@/types/job';

interface UseJobsReturn {
  jobs: Job[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: JobFilterParams;
  setFilters: (filters: JobFilterParams) => void;
  page: number;
  setPage: (page: number) => void;
  refetch: () => void;
}

export function useJobs(initialFilters: JobFilterParams = {}): UseJobsReturn {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilterParams>(initialFilters);
  const [page, setPage] = useState(1);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobApi.getJobs({ ...filters, page: page - 1, size: 12 });
      const { content, totalElements } = res.data.data;
      setJobs(content);
      setTotal(totalElements);
    } catch {
      setError('Không thể tải danh sách việc làm. Vui lòng thử lại sau.');
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    async function run() {
      await fetchJobs();
    }
    run();
  }, [fetchJobs]);

  const handleSetFilters = (newFilters: JobFilterParams) => {
    setFilters(newFilters);
    setPage(1);
  };

  return { jobs, total, loading, error, filters, setFilters: handleSetFilters, page, setPage, refetch: fetchJobs };
}
