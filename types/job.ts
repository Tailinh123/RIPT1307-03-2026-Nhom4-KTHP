// Enums cho các trường Select
export enum JobLevel {
  INTERN = "INTERN",
  FRESHER = "FRESHER",
  JUNIOR = "JUNIOR",
  MIDDLE = "MIDDLE",
  SENIOR = "SENIOR",
}

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  INTERN = "INTERN",
}

export enum WorkMode {
  ONSITE = "ONSITE",
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
}

export enum JobStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
  CLOSED = "CLOSED",
}

// Interface cho Job
export interface Job {
  id: string;
  name: string;
  description: string;
  companyName: string;
  salary: number;
  serviceFee: number;
  level: JobLevel;
  jobType: JobType;
  workMode: WorkMode;
  skills: string[];
  jobCategory: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

// Interface cho Form data
export interface JobFormData {
  name: string;
  description: string;
  salary: number;
  level: JobLevel;
  jobType: JobType;
  workMode: WorkMode;
  skills: string[];
  jobCategory: string;
}

// Interface cho Filter
export interface JobFilter {
  name?: string;
  companyName?: string;
  status?: JobStatus;
}

// Options cho các dropdown
export const skillOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "react", label: "React" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "golang", label: "Go" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "sql", label: "SQL" },
  { value: "mongodb", label: "MongoDB" },
  { value: "docker", label: "Docker" },
  { value: "kubernetes", label: "Kubernetes" },
  { value: "aws", label: "AWS" },
];

export const jobCategoryOptions = [
  { value: "software-engineering", label: "Software Engineering" },
  { value: "data-science", label: "Data Science" },
  { value: "devops", label: "DevOps" },
  { value: "design", label: "UI/UX Design" },
  { value: "product-management", label: "Product Management" },
  { value: "qa-testing", label: "QA/Testing" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "cybersecurity", label: "Cybersecurity" },
];

// Label maps cho hiển thị
export const levelLabels: Record<JobLevel, string> = {
  [JobLevel.INTERN]: "Intern",
  [JobLevel.FRESHER]: "Fresher",
  [JobLevel.JUNIOR]: "Junior",
  [JobLevel.MIDDLE]: "Middle",
  [JobLevel.SENIOR]: "Senior",
};

export const jobTypeLabels: Record<JobType, string> = {
  [JobType.FULL_TIME]: "Full-time",
  [JobType.PART_TIME]: "Part-time",
  [JobType.INTERN]: "Internship",
};

export const workModeLabels: Record<WorkMode, string> = {
  [WorkMode.ONSITE]: "Onsite",
  [WorkMode.REMOTE]: "Remote",
  [WorkMode.HYBRID]: "Hybrid",
};

export const statusLabels: Record<JobStatus, string> = {
  [JobStatus.ACTIVE]: "Đang tuyển",
  [JobStatus.INACTIVE]: "Tạm dừng",
  [JobStatus.PENDING]: "Chờ duyệt",
  [JobStatus.CLOSED]: "Đã đóng",
};

export const statusColors: Record<JobStatus, string> = {
  [JobStatus.ACTIVE]: "green",
  [JobStatus.INACTIVE]: "orange",
  [JobStatus.PENDING]: "blue",
  [JobStatus.CLOSED]: "red",
};
