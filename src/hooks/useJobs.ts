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
      if (res?.data?.content) {
        setJobs(res.data.content);
        setTotal(res.data.totalElements);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      // Fallback to mock data for development with filters applied
      let mockJobs = getMockJobs();

      // keyword filter
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        mockJobs = mockJobs.filter(job =>
          job.title.toLowerCase().includes(kw) ||
          job.companyName.toLowerCase().includes(kw)
        );
      }

      // location filter
      if (filters.location && filters.location !== 'OTHER') {
        const locationMap: Record<string, string> = {
          'HANOI': 'Hà Nội',
          'HCMC': 'TP. Hồ Chí Minh',
          'DANANG': 'Đà Nẵng',
        };
        const displayLocation = locationMap[filters.location];
        if (displayLocation) {
          mockJobs = mockJobs.filter(job => job.location === displayLocation);
        }
      }

      // level filter
      if (filters.level) {
        mockJobs = mockJobs.filter(job => job.level === filters.level);
      }

      // workMode filter
      if (filters.workMode) {
        mockJobs = mockJobs.filter(job => job.workMode === filters.workMode);
      }

      setJobs(mockJobs);
      setTotal(mockJobs.length);
      setError(null);

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

// ── Mock data for local development without backend ─────────────────────────
function getMockJobs(): Job[] {
  return [
    {
      id: 1, title: 'Frontend Developer Intern', companyName: 'FPT Software',
      description: 'Phát triển giao diện web hiện đại', requirements: 'React, TypeScript',
      location: 'Hà Nội', salaryMin: 3000000, salaryMax: 5000000,
      level: 'INTERN', workMode: 'HYBRID', category: 'IT_SOFTWARE',
      skills: [{ id: 1, name: 'React' }, { id: 2, name: 'TypeScript' }, { id: 3, name: 'Tailwind CSS' }],
      deadline: '2026-08-01', createdAt: '2026-05-01', isActive: true,
    },
    {
      id: 2, title: 'Backend Developer Intern', companyName: 'VNG Corporation',
      description: 'Xây dựng API RESTful', requirements: 'Java Spring Boot',
      location: 'TP. Hồ Chí Minh', salaryMin: 4000000, salaryMax: 6000000,
      level: 'INTERN', workMode: 'ONSITE', category: 'IT_SOFTWARE',
      skills: [{ id: 4, name: 'Java' }, { id: 5, name: 'Spring Boot' }, { id: 6, name: 'MySQL' }],
      deadline: '2026-07-15', createdAt: '2026-05-02', isActive: true,
    },
    {
      id: 3, title: 'UI/UX Designer Intern', companyName: 'Grab Vietnam',
      description: 'Thiết kế giao diện người dùng', requirements: 'Figma, Adobe XD',
      location: 'TP. Hồ Chí Minh', salaryMin: 3500000, salaryMax: 5000000,
      level: 'INTERN', workMode: 'HYBRID', category: 'DESIGN',
      skills: [{ id: 7, name: 'Figma' }, { id: 8, name: 'Adobe XD' }, { id: 9, name: 'Prototyping' }],
      deadline: '2026-07-30', createdAt: '2026-05-03', isActive: true,
    },
    {
      id: 4, title: 'Marketing Intern', companyName: 'Shopee Vietnam',
      description: 'Hỗ trợ chiến lược marketing số', requirements: 'Google Ads, Facebook Ads',
      location: 'Hà Nội', salaryMin: 2500000, salaryMax: 4000000,
      level: 'INTERN', workMode: 'ONSITE', category: 'MARKETING',
      skills: [{ id: 10, name: 'Google Ads' }, { id: 11, name: 'SEO' }, { id: 12, name: 'Content Marketing' }],
      deadline: '2026-08-10', createdAt: '2026-05-04', isActive: true,
    },
    {
      id: 5, title: 'Data Analyst Intern', companyName: 'Momo',
      description: 'Phân tích dữ liệu kinh doanh', requirements: 'Python, SQL, Power BI',
      location: 'TP. Hồ Chí Minh', salaryMin: 4000000, salaryMax: 7000000,
      level: 'FRESHER', workMode: 'REMOTE', category: 'IT_SOFTWARE',
      skills: [{ id: 13, name: 'Python' }, { id: 14, name: 'SQL' }, { id: 15, name: 'Power BI' }],
      deadline: '2026-08-20', createdAt: '2026-05-05', isActive: true,
    },
    {
      id: 6, title: 'Mobile Developer Intern', companyName: 'Tiki',
      description: 'Phát triển ứng dụng di động React Native', requirements: 'React Native, JavaScript',
      location: 'Đà Nẵng', salaryMin: 3500000, salaryMax: 5500000,
      level: 'INTERN', workMode: 'HYBRID', category: 'IT_SOFTWARE',
      skills: [{ id: 16, name: 'React Native' }, { id: 17, name: 'JavaScript' }, { id: 18, name: 'Redux' }],
      deadline: '2026-07-25', createdAt: '2026-05-06', isActive: true,
    },
    {
      id: 7, title: 'HR Intern', companyName: 'Viettel',
      description: 'Hỗ trợ tuyển dụng và đào tạo', requirements: 'Kỹ năng giao tiếp',
      location: 'Hà Nội', salaryMin: 2000000, salaryMax: 3500000,
      level: 'INTERN', workMode: 'ONSITE', category: 'HUMAN_RESOURCES',
      skills: [{ id: 19, name: 'Recruitment' }, { id: 20, name: 'Communication' }],
      deadline: '2026-08-05', createdAt: '2026-05-07', isActive: true,
    },
    {
      id: 8, title: 'Finance Intern', companyName: 'BIDV',
      description: 'Hỗ trợ phân tích tài chính', requirements: 'Excel, Kế toán cơ bản',
      location: 'Hà Nội', salaryMin: 2500000, salaryMax: 4000000,
      level: 'INTERN', workMode: 'ONSITE', category: 'FINANCE',
      skills: [{ id: 21, name: 'Excel' }, { id: 22, name: 'Financial Analysis' }, { id: 23, name: 'Accounting' }],
      deadline: '2026-08-15', createdAt: '2026-05-08', isActive: true,
    },
    {
      id: 9, title: 'DevOps Intern', companyName: 'CMC Technology',
      description: 'Hỗ trợ vận hành hệ thống CI/CD', requirements: 'Docker, Jenkins, Linux',
      location: 'TP. Hồ Chí Minh', salaryMin: 4500000, salaryMax: 7000000,
      level: 'FRESHER', workMode: 'REMOTE', category: 'IT_SOFTWARE',
      skills: [{ id: 24, name: 'Docker' }, { id: 25, name: 'Kubernetes' }, { id: 26, name: 'Linux' }],
      deadline: '2026-09-01', createdAt: '2026-05-09', isActive: true,
    },
    {
      id: 10, title: 'Content Creator Intern', companyName: 'Lazada Vietnam',
      description: 'Sáng tạo nội dung cho mạng xã hội', requirements: 'Kỹ năng viết, sáng tạo',
      location: 'Hà Nội', salaryMin: 2000000, salaryMax: 3000000,
      level: 'INTERN', workMode: 'HYBRID', category: 'MARKETING',
      skills: [{ id: 27, name: 'Copywriting' }, { id: 28, name: 'Social Media' }, { id: 29, name: 'Canva' }],
      deadline: '2026-07-20', createdAt: '2026-05-10', isActive: true,
    },
    {
      id: 11, title: 'QA Tester Intern', companyName: 'KMS Technology',
      description: 'Kiểm thử phần mềm thủ công và tự động', requirements: 'Testing cơ bản, Selenium',
      location: 'TP. Hồ Chí Minh', salaryMin: 3000000, salaryMax: 5000000,
      level: 'INTERN', workMode: 'ONSITE', category: 'IT_SOFTWARE',
      skills: [{ id: 30, name: 'Manual Testing' }, { id: 31, name: 'Selenium' }, { id: 32, name: 'JIRA' }],
      deadline: '2026-08-25', createdAt: '2026-05-11', isActive: true,
    },
    {
      id: 12, title: 'Sales Intern', companyName: 'Vingroup',
      description: 'Hỗ trợ đội ngũ kinh doanh', requirements: 'Kỹ năng bán hàng, thuyết phục',
      location: 'Hà Nội', salaryMin: 3000000, salaryMax: 5000000,
      level: 'INTERN', workMode: 'ONSITE', category: 'SALES',
      skills: [{ id: 33, name: 'Sales' }, { id: 34, name: 'Negotiation' }, { id: 35, name: 'CRM' }],
      deadline: '2026-08-30', createdAt: '2026-05-12', isActive: true,
    },
  ];
}
