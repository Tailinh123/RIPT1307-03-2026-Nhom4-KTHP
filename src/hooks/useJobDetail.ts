import { useState, useEffect } from 'react';
import type { Job } from '@/types/job';
import { jobApi } from '@/api/jobApi';

export interface JobDetail extends Job {
  benefits: string;
  headcount: number;
  companyDescription: string;
  companyWebsite?: string;
  companySize?: string;
  companyIndustry?: string;
}

// ── Rich mock data ─────────────────────────────────────────────────────────
const MOCK_JOB_DETAILS: JobDetail[] = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    companyName: 'FPT Software',
    description:
      '- Tham gia phát triển Frontend (ReactJS/NextJS) và Backend (NodeJS/NestJS) cho các dự án thực tế.\n' +
      '- Hỗ trợ xây dựng, phát triển Frontend theo quy trình phát triển phần mềm chuẩn công nghiệp.\n' +
      '- Viết, kiểm thử và tối ưu mã nguồn theo quy trình phát triển phần mềm Agile.\n' +
      '- Học hỏi và thực hành quy trình phát triển Agile/Scrum trong dự án thực tế.\n' +
      '- Tham gia cùng đội ngũ kỹ sư trong việc nghiên cứu, đề xuất và áp dụng công nghệ mới.\n' +
      '- Hỗ trợ xử lý lỗi (debug), bảo trì và tối ưu hiệu năng hệ thống.\n' +
      '- Tham gia các buổi đào tạo nội bộ, review code và thảo luận kỹ thuật cùng team.',
    requirements:
      '- Sinh viên năm 3–4 hoặc mới tốt nghiệp các ngành: Công nghệ thông tin, Khoa học máy tính, Kỹ thuật phần mềm hoặc các ngành liên quan.\n' +
      '- Có kiến thức cơ bản về ReactJS, NodeJS, ExpressJS hoặc MongoDB.\n' +
      '- Hiểu biết về RESTful API, HTML/CSS/JavaScript, Git.\n' +
      '- Có tư duy logic, khả năng học hỏi nhanh và tinh thần trách nhiệm cao.\n' +
      '- Chủ động, cầu tiến và sẵn sàng thử thách trong môi trường startup.\n' +
      '- Ưu tiên ứng viên có dự án cá nhân, sản phẩm demo hoặc hiểu biết về UI/UX, Figma, Blockchain hoặc AI.',
    benefits:
      '- Mức lương thực tập hấp dẫn: 3,000,000 – 5,000,000 VNĐ/tháng.\n' +
      '- Được mentor 1-1 bởi senior developer có kinh nghiệm.\n' +
      '- Môi trường làm việc trẻ trung, năng động, sáng tạo.\n' +
      '- Cơ hội nhận offer full-time sau khi hoàn thành thực tập.\n' +
      '- Tham gia các sự kiện nội bộ, team building và hackathon.\n' +
      '- Được cấp laptop và các công cụ làm việc cần thiết.',
    location: 'Hà Nội',
    salaryMin: 3000000,
    salaryMax: 5000000,
    level: 'INTERN',
    workMode: 'HYBRID',
    category: 'IT_SOFTWARE',
    skills: [
      { id: 1, name: 'React' },
      { id: 2, name: 'TypeScript' },
      { id: 3, name: 'NodeJS' },
      { id: 4, name: 'Git' },
    ],
    deadline: '2026-08-01',
    createdAt: '2026-06-01',
    isActive: true,
    headcount: 5,
    companyDescription:
      'FPT Software là công ty phần mềm hàng đầu Việt Nam với hơn 20,000 nhân viên trên toàn cầu, cung cấp các giải pháp công nghệ cho khách hàng tại hơn 30 quốc gia.',
    companyWebsite: 'https://www.fpt-software.com',
    companySize: '10,000+ nhân viên',
    companyIndustry: 'Công nghệ thông tin',
  },
  {
    id: 2,
    title: 'Backend Developer Intern',
    companyName: 'VNG Corporation',
    description:
      '- Xây dựng và duy trì các API RESTful phục vụ hàng triệu người dùng.\n' +
      '- Tham gia thiết kế cơ sở dữ liệu và tối ưu truy vấn SQL/NoSQL.\n' +
      '- Viết unit test và integration test đảm bảo chất lượng code.\n' +
      '- Hỗ trợ team senior trong việc review code và cải tiến kiến trúc hệ thống.\n' +
      '- Tham gia các buổi daily standup và sprint planning theo mô hình Agile.\n' +
      '- Nghiên cứu và đề xuất các giải pháp công nghệ mới để cải thiện hiệu suất.',
    requirements:
      '- Sinh viên năm 3–4 ngành Công nghệ thông tin hoặc các ngành liên quan.\n' +
      '- Thành thạo Java hoặc Python, có kiến thức về Spring Boot hoặc Django.\n' +
      '- Hiểu biết về cơ sở dữ liệu SQL (MySQL, PostgreSQL) và NoSQL (Redis, MongoDB).\n' +
      '- Nắm vững nguyên lý OOP, Design Patterns cơ bản.\n' +
      '- Có kinh nghiệm sử dụng Git, Docker là một lợi thế.\n' +
      '- Tiếng Anh đọc hiểu tài liệu kỹ thuật.',
    benefits:
      '- Lương thực tập: 4,000,000 – 6,000,000 VNĐ/tháng.\n' +
      '- Làm việc với hệ thống quy mô lớn, triệu người dùng.\n' +
      '- Được đào tạo bởi các kỹ sư giàu kinh nghiệm.\n' +
      '- Cơ hội làm việc tại các sản phẩm nổi tiếng: Zalo, ZaloPay.\n' +
      '- Phụ cấp ăn trưa và xe đưa đón.',
    location: 'TP. Hồ Chí Minh',
    salaryMin: 4000000,
    salaryMax: 6000000,
    level: 'INTERN',
    workMode: 'ONSITE',
    category: 'IT_SOFTWARE',
    skills: [
      { id: 4, name: 'Java' },
      { id: 5, name: 'Spring Boot' },
      { id: 6, name: 'MySQL' },
      { id: 7, name: 'Docker' },
    ],
    deadline: '2026-07-15',
    createdAt: '2026-06-02',
    isActive: true,
    headcount: 8,
    companyDescription:
      'VNG Corporation là tập đoàn công nghệ hàng đầu Việt Nam, sở hữu các sản phẩm nổi tiếng như Zalo, ZaloPay với hàng triệu người dùng mỗi ngày.',
    companyWebsite: 'https://www.vng.com.vn',
    companySize: '5,000+ nhân viên',
    companyIndustry: 'Công nghệ & Viễn thông',
  },
  {
    id: 3,
    title: 'UI/UX Designer Intern',
    companyName: 'Grab Vietnam',
    description:
      '- Thiết kế giao diện người dùng cho ứng dụng mobile và web theo chuẩn Material Design.\n' +
      '- Tạo wireframe, prototype và mockup sản phẩm bằng Figma.\n' +
      '- Phối hợp chặt chẽ với team Product Manager và Developer để đảm bảo tính khả thi.\n' +
      '- Thực hiện nghiên cứu người dùng và phân tích UX để cải thiện trải nghiệm.\n' +
      '- Tham gia design review và nhận feedback từ senior designer.\n' +
      '- Xây dựng và duy trì Design System cho sản phẩm.',
    requirements:
      '- Sinh viên năm 3–4 các ngành Thiết kế Đồ họa, Thiết kế Mỹ thuật số, Công nghệ thông tin.\n' +
      '- Thành thạo Figma; biết Adobe XD, Sketch là lợi thế.\n' +
      '- Có portfolio thể hiện kỹ năng thiết kế UI/UX.\n' +
      '- Hiểu biết cơ bản về HTML/CSS.\n' +
      '- Tư duy sáng tạo, chú ý đến chi tiết và có khiếu thẩm mỹ tốt.\n' +
      '- Giao tiếp tiếng Anh cơ bản.',
    benefits:
      '- Lương thực tập: 3,500,000 – 5,000,000 VNĐ/tháng.\n' +
      '- Được làm việc với sản phẩm có hàng triệu người dùng tại Đông Nam Á.\n' +
      '- Môi trường đa văn hóa, năng động.\n' +
      '- Voucher Grab hàng tháng.\n' +
      '- Cơ hội phát triển sự nghiệp quốc tế.',
    location: 'TP. Hồ Chí Minh',
    salaryMin: 3500000,
    salaryMax: 5000000,
    level: 'INTERN',
    workMode: 'HYBRID',
    category: 'DESIGN',
    skills: [
      { id: 7, name: 'Figma' },
      { id: 8, name: 'Adobe XD' },
      { id: 9, name: 'Prototyping' },
      { id: 10, name: 'UI/UX' },
    ],
    deadline: '2026-07-30',
    createdAt: '2026-06-03',
    isActive: true,
    headcount: 3,
    companyDescription:
      'Grab là siêu ứng dụng hàng đầu Đông Nam Á, cung cấp dịch vụ gọi xe, giao đồ ăn, thanh toán số cho hơn 600 triệu người dùng tại 8 quốc gia.',
    companyWebsite: 'https://www.grab.com',
    companySize: '8,000+ nhân viên',
    companyIndustry: 'Công nghệ & Logistics',
  },
];

// ── Fallback generator for any ID not in the list ─────────────────────────
function generateMockDetail(id: number): JobDetail {
  return {
    id,
    title: 'Thực Tập Sinh Full Stack Developer',
    companyName: 'CÔNG TY CỔ PHẦN SMARTOSC',
    description:
      '- Tham gia phát triển các sản phẩm công nghệ của Medoo trong lĩnh vực EdTech và Blockchain.\n' +
      '- Hỗ trợ xây dựng, phát triển Frontend (ReactJS/NextJS) và Backend (NodeJS/NestJS).\n' +
      '- Viết, kiểm thử và tối ưu mã nguồn theo quy trình phát triển phần mềm.\n' +
      '- Học hỏi và thực hành quy trình phát triển Agile/Scrum trong dự án thực tế.\n' +
      '- Tham gia cùng đội ngũ kỹ sư trong việc nghiên cứu, đề xuất và áp dụng công nghệ mới.\n' +
      '- Hỗ trợ xử lý lỗi (debug), bảo trì và tối ưu hiệu năng hệ thống.\n' +
      '- Tham gia các buổi đào tạo nội bộ, review code và thảo luận kỹ thuật cùng team.',
    requirements:
      '- Sinh viên năm 3–4 hoặc mới tốt nghiệp các ngành: Công nghệ thông tin, Khoa học máy tính, Kỹ thuật phần mềm hoặc các ngành liên quan.\n' +
      '- Có kiến thức cơ bản về ReactJS, NodeJS, ExpressJS hoặc MongoDB.\n' +
      '- Hiểu biết về RESTful API, HTML/CSS/JavaScript, Git.\n' +
      '- Có tư duy logic, khả năng học hỏi nhanh và tinh thần trách nhiệm cao.\n' +
      '- Chủ động, cầu tiến và sẵn sàng thử thách trong môi trường startup.\n' +
      '- Ưu tiên ứng viên có dự án cá nhân, sản phẩm demo hoặc hiểu biết về UI/UX, Figma, Blockchain hoặc AI.',
    benefits:
      '- Mức lương thực tập hấp dẫn theo năng lực.\n' +
      '- Làm việc trong môi trường chuyên nghiệp, hiện đại.\n' +
      '- Được đào tạo và phát triển kỹ năng chuyên môn.\n' +
      '- Cơ hội trở thành nhân viên chính thức sau thực tập.\n' +
      '- Team building, du lịch hàng năm cùng công ty.',
    location: 'Hà Nội',
    salaryMin: 20000000,
    salaryMax: 25000000,
    level: 'INTERN',
    workMode: 'HYBRID',
    category: 'IT_SOFTWARE',
    skills: [
      { id: 1, name: 'Java' },
      { id: 2, name: 'Spring Boot' },
    ],
    deadline: '2026-04-30',
    createdAt: '2026-03-01',
    isActive: true,
    headcount: 10,
    companyDescription:
      'SmartOSC là công ty công nghệ hàng đầu trong lĩnh vực thương mại điện tử và chuyển đổi số tại Đông Nam Á, phục vụ hàng trăm khách hàng toàn cầu.',
    companyWebsite: 'https://smartosc.com',
    companySize: '500–1,000 nhân viên',
    companyIndustry: 'Công nghệ thông tin',
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────
interface UseJobDetailReturn {
  job: JobDetail | null;
  loading: boolean;
  error: string | null;
}

export function useJobDetail(id: string | undefined): UseJobDetailReturn {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setJob(null);

    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      setError('ID công việc không hợp lệ.');
      setLoading(false);
      return;
    }

    // Try to fetch from API
    jobApi
      .getJobById(numId)
      .then((res) => {
        setJob(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching job detail:', err);
        // Fallback to mock data on error
        const found = MOCK_JOB_DETAILS.find((j) => j.id === numId);
        if (found) {
          setJob(found);
          setError(null);
        } else {
          setJob(generateMockDetail(numId));
          setError(null);
        }
        setLoading(false);
      });
  }, [id]);

  return { job, loading, error };
}
