-- 1. JOB CATEGORIES
INSERT INTO `job_categories` (`name`, `description`, `created_at`, `created_by`) VALUES
('Cong nghe thong tin', 'Phan mem, He thong, AI, Data', NOW(), 'system'),
('Marketing', 'Digital Marketing, Content, SEO', NOW(), 'system'),
('Ke toan - Kiem toan', 'Ke toan tong hop, Kiem toan noi bo', NOW(), 'system'),
('Kinh doanh', 'Sales, Business Development', NOW(), 'system'),
('Nhan su', 'Tuyen dung, Dao tao, C&B', NOW(), 'system'),
('Thiet ke', 'UI/UX, Graphic Design', NOW(), 'system'),
('Logistics', 'Quan ly chuoi cung ung, Van tai', NOW(), 'system'),
('Ngon ngu', 'Bien phien dich, Giang day', NOW(), 'system');

-- 2. SKILLS
INSERT INTO `skills` (`name`, `created_at`, `created_by`) VALUES
('Java', NOW(), 'system'),
('Spring Boot', NOW(), 'system'),
('React', NOW(), 'system'),
('Angular', NOW(), 'system'),
('Python', NOW(), 'system'),
('MySQL', NOW(), 'system'),
('PostgreSQL', NOW(), 'system'),
('Docker', NOW(), 'system'),
('Git', NOW(), 'system'),
('TypeScript', NOW(), 'system'),
('Figma', NOW(), 'system'),
('SEO', NOW(), 'system'),
('Communication', NOW(), 'system'),
('Excel', NOW(), 'system'),
('Data Analysis', NOW(), 'system'),
('English', NOW(), 'system'),
('AWS', NOW(), 'system'),
('Photoshop', NOW(), 'system');

-- 3. ROLES
INSERT IGNORE INTO `roles` (`name`, `description`, `is_active`, `created_at`, `created_by`) VALUES
('SUPER_ADMIN', 'Admin full permissions', b'1', NOW(), 'system'),
('HR_MANAGER', 'Doanh nghiep dang tuyen', b'1', NOW(), 'system'),
('CANDIDATE', 'Sinh vien tim viec', b'1', NOW(), 'system');

-- 4. PERMISSIONS
INSERT INTO `permissions` (`name`, `api_path`, `method`, `module`, `created_at`, `created_by`) VALUES
('Create a company', '/api/v1/companies', 'POST', 'COMPANIES', NOW(), 'system'),
('Update a company', '/api/v1/companies', 'PUT', 'COMPANIES', NOW(), 'system'),
('Delete a company', '/api/v1/companies/{id}', 'DELETE', 'COMPANIES', NOW(), 'system'),
('Get a company', '/api/v1/companies/{id}', 'GET', 'COMPANIES', NOW(), 'system'),
('List companies', '/api/v1/companies', 'GET', 'COMPANIES', NOW(), 'system'),
('Create a job', '/api/v1/jobs', 'POST', 'JOBS', NOW(), 'system'),
('Update a job', '/api/v1/jobs', 'PUT', 'JOBS', NOW(), 'system'),
('Delete a job', '/api/v1/jobs/{id}', 'DELETE', 'JOBS', NOW(), 'system'),
('Get a job', '/api/v1/jobs/{id}', 'GET', 'JOBS', NOW(), 'system'),
('List jobs', '/api/v1/jobs', 'GET', 'JOBS', NOW(), 'system'),
('Create application', '/api/v1/applications', 'POST', 'APPLICATIONS', NOW(), 'system'),
('List applications', '/api/v1/applications', 'GET', 'APPLICATIONS', NOW(), 'system'),
('Create a user', '/api/v1/users', 'POST', 'USERS', NOW(), 'system'),
('Update application', '/api/v1/applications', 'PUT', 'APPLICATIONS', NOW(), 'system'),
('Delete application', '/api/v1/applications/{id}', 'DELETE', 'APPLICATIONS', NOW(), 'system'),
('Get applications by user', '/api/v1/applications/by-user', 'GET', 'APPLICATIONS', NOW(), 'system'),
('Create resume', '/api/v1/resumes', 'POST', 'RESUMES', NOW(), 'system'),
('Update resume', '/api/v1/resumes', 'PUT', 'RESUMES', NOW(), 'system'),
('Delete resume', '/api/v1/resumes/{id}', 'DELETE', 'RESUMES', NOW(), 'system'),
('Get resume by id', '/api/v1/resumes/{id}', 'GET', 'RESUMES', NOW(), 'system'),
('List resumes', '/api/v1/resumes', 'GET', 'RESUMES', NOW(), 'system'),
('Get resumes by user', '/api/v1/resumes/by-user', 'GET', 'RESUMES', NOW(), 'system'),
('Upload file', '/api/v1/files', 'POST', 'FILES', NOW(), 'system'),
('Download file', '/api/v1/files', 'GET', 'FILES', NOW(), 'system'),
('List users', '/api/v1/users', 'GET', 'USERS', NOW(), 'system'),
('Get user by id', '/api/v1/users/{id}', 'GET', 'USERS', NOW(), 'system'),
('Update user', '/api/v1/users/{id}', 'PUT', 'USERS', NOW(), 'system'),
('Delete user', '/api/v1/users/{id}', 'DELETE', 'USERS', NOW(), 'system'),
('Change password', '/api/v1/users/change-password', 'PUT', 'USERS', NOW(), 'system'),
('Get account', '/api/v1/auth/account', 'GET', 'AUTH', NOW(), 'system'),
('Create role', '/api/v1/roles', 'POST', 'ROLES', NOW(), 'system'),
('Update role', '/api/v1/roles', 'PUT', 'ROLES', NOW(), 'system'),
('Delete role', '/api/v1/roles/{id}', 'DELETE', 'ROLES', NOW(), 'system'),
('List roles', '/api/v1/roles', 'GET', 'ROLES', NOW(), 'system'),
('Create permission', '/api/v1/permissions', 'POST', 'PERMISSIONS', NOW(), 'system'),
('Update permission', '/api/v1/permissions', 'PUT', 'PERMISSIONS', NOW(), 'system'),
('Delete permission', '/api/v1/permissions/{id}', 'DELETE', 'PERMISSIONS', NOW(), 'system'),
('List permissions', '/api/v1/permissions', 'GET', 'PERMISSIONS', NOW(), 'system'),
('Create skill', '/api/v1/skills', 'POST', 'SKILLS', NOW(), 'system'),
('Update skill', '/api/v1/skills', 'PUT', 'SKILLS', NOW(), 'system'),
('Delete skill', '/api/v1/skills/{id}', 'DELETE', 'SKILLS', NOW(), 'system'),
('List job categories', '/api/v1/job-categories', 'GET', 'JOB_CATEGORIES', NOW(), 'system'),
('Create job category', '/api/v1/job-categories', 'POST', 'JOB_CATEGORIES', NOW(), 'system'),
('Update job category', '/api/v1/job-categories', 'PUT', 'JOB_CATEGORIES', NOW(), 'system'),
('Delete job category', '/api/v1/job-categories/{id}', 'DELETE', 'JOB_CATEGORIES', NOW(), 'system');

-- 5. PERMISSION_ROLE
-- SUPER_ADMIN (role_id=1): ALL permissions
INSERT INTO `permission_role` (`permission_id`, `role_id`) VALUES
(1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),
(11,1),(12,1),(13,1),(14,1),(15,1),(16,1),(17,1),(18,1),(19,1),(20,1),
(21,1),(22,1),(23,1),(24,1),(25,1),(26,1),(27,1),(28,1),(29,1),(30,1),
(31,1),(32,1),(33,1),(34,1),(35,1),(36,1),(37,1),(38,1),(39,1),(40,1),
(41,1),(42,1),(43,1),(44,1),(45,1);

-- HR_MANAGER (role_id=2): Quan ly job, application, xem company, file, resume
INSERT INTO `permission_role` (`permission_id`, `role_id`) VALUES
(4,2),(5,2),                          -- GET company, list companies
(6,2),(7,2),(8,2),(9,2),(10,2),       -- CRUD jobs
(12,2),(14,2),                        -- List applications, update application
(21,2),(22,2),                        -- List resumes, get resume by id
(23,2),(24,2),                        -- Upload/download file
(29,2),(30,2);                        -- Change password, get account

-- CANDIDATE (role_id=3): Ung tuyen, quan ly resume, xem job/company
INSERT INTO `permission_role` (`permission_id`, `role_id`) VALUES
(4,3),(5,3),                          -- GET company, list companies
(9,3),(10,3),                         -- GET job, list jobs
(11,3),(15,3),(16,3),                 -- Create application, delete application, get applications by user
(17,3),(18,3),(19,3),(20,3),(22,3),   -- CRUD resume, get resumes by user
(23,3),(24,3),                        -- Upload/download file
(29,3),(30,3);                        -- Change password, get account

-- 6. COMPANIES
INSERT INTO `companies` (`name`, `address`, `description`, `created_at`, `created_by`) VALUES
('FPT Software', 'Hoa Lac, Ha Noi', 'Cong ty phan mem hang dau VN', NOW(), 'system'),
('VNG Corporation', 'Quan 7, Ho Chi Minh', 'Cong nghe giai tri va AI', NOW(), 'system'),
('Viettel', 'Cau Giay, Ha Noi', 'Tap doan vien thong quan doi', NOW(), 'system'),
('Shopee VN', 'Quan 1, Ho Chi Minh', 'San thuong mai dien tu', NOW(), 'system'),
('Grab VN', 'Quan 10, Ho Chi Minh', 'Sieu ung dung da dich vu', NOW(), 'system'),
('Tiki', 'Tan Binh, Ho Chi Minh', 'Thuong mai dien tu Viet Nam', NOW(), 'system'),
('VinBrain', 'Cau Giay, Ha Noi', 'AI cho y te va do thi thong minh', NOW(), 'system'),
('KMS Technology', 'Tan Binh, Ho Chi Minh', 'Dich vu phan mem', NOW(), 'system');

-- 7. USERS (password = 123456)
INSERT INTO `users` (`name`, `email`, `password`, `date_of_birth`, `gender`, `address`, `is_subscribed`, `is_active`, `created_at`, `created_by`, `company_id`, `role_id`) VALUES
('Super Admin', 'admin@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '1995-01-01', 'MALE', 'Ha Noi', b'0', b'1', NOW(), 'system', NULL, 1),

('HR FPT', 'hr.fpt@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '1990-11-11', 'MALE', 'Ha Noi', b'0', b'1', NOW(), 'system', 1, 2),
('HR VNG', 'hr.vng@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '1992-02-22', 'FEMALE', 'Ho Chi Minh', b'0', b'1', NOW(), 'system', 2, 2),
('HR Viettel', 'hr.viettel@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '1988-08-08', 'MALE', 'Ha Noi', b'0', b'1', NOW(), 'system', 3, 2),
('HR Shopee', 'hr.shopee@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '1995-05-05', 'FEMALE', 'Ho Chi Minh', b'0', b'1', NOW(), 'system', 4, 2),
('HR Grab', 'hr.grab@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '1991-01-01', 'MALE', 'Ho Chi Minh', b'0', b'1', NOW(), 'system', 5, 2),
('HR KMS', 'hr.kms@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '1989-09-09', 'FEMALE', 'Ho Chi Minh', b'0', b'1', NOW(), 'system', 8, 2),

('Nguyen Van A', 'sva@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '2003-01-10', 'MALE', 'Ha Noi', b'1', b'1', NOW(), 'system', NULL, 3),
('Tran Thi B', 'svb@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '2002-05-20', 'FEMALE', 'Ho Chi Minh', b'1', b'1', NOW(), 'system', NULL, 3),
('Le Van C', 'svc@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '2003-08-15', 'MALE', 'Da Nang', b'0', b'1', NOW(), 'system', NULL, 3),
('Pham Thi D', 'svd@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '2001-12-12', 'FEMALE', 'Can Tho', b'1', b'1', NOW(), 'system', NULL, 3),
('Hoang Van E', 'sve@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '2002-03-25', 'MALE', 'Ha Noi', b'1', b'1', NOW(), 'system', NULL, 3),
('Vu Thi F', 'svf@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '2003-07-07', 'FEMALE', 'Hai Phong', b'0', b'1', NOW(), 'system', NULL, 3),
('Bui Van G', 'svg@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '2004-09-09', 'MALE', 'Ho Chi Minh', b'1', b'1', NOW(), 'system', NULL, 3),
('Dang Thi H', 'svh@gmail.com', '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q', '2002-11-11', 'FEMALE', 'Da Nang', b'0', b'1', NOW(), 'system', NULL, 3);


-- 8. USER_SKILLS
INSERT INTO `user_skills` (`user_id`, `skill_id`) VALUES
(8,1), (8,2), (8,6), 
(9,3), (9,10), (9,11), 
(10,5), (10,6), (10,8), 
(11,12), (11,13), (11,16), 
(12,14), (12,15), (12,16), 
(13,1), (13,4), (13,10), 
(14,7), (14,8), (14,9), 
(15,11), (15,18); 

-- 9. JOBS
INSERT INTO `jobs` (
    `name`, `description`, `location`, `active`, `job_type`, 
    `work_mode`, `level`, `quantity`, `salary`, `start_date`, 
    `end_date`, `created_at`, `created_by`, `company_id`, `category_id`
) VALUES
(
    'Java Intern',
    'Thuc tap vien Java Spring Boot',
    'Ha Noi',
    b'1',
    'INTERN',
    'HYBRID',
    'INTERN',
    5,
    5000000.00,
    '2026-06-01',
    '2026-08-31',
    NOW(),
    'system',
    1,
    1
),
(
    'Frontend React Part-time',
    'Lam viec voi React va TypeScript',
    'Ho Chi Minh',
    b'1',
    'PART_TIME',
    'REMOTE',
    'FRESHER',
    3,
    7000000.00,
    '2026-06-10',
    '2026-09-10',
    NOW(),
    'system',
    2,
    1
),
(
    'Backend Java Fulltime',
    'Phat trien he thong Spring Boot',
    'Ha Noi',
    b'1',
    'FULL_TIME',
    'ONSITE',
    'JUNIOR',
    2,
    15000000.00,
    '2026-06-15',
    '2026-12-31',
    NOW(),
    'system',
    1,
    1
),
(
    'Data Analyst Intern',
    'Thuc tap phan tich du lieu voi Python, SQL',
    'Ha Noi',
    b'1',
    'INTERN',
    'ONSITE',
    'INTERN',
    3,
    4000000.00,
    '2026-07-01',
    '2026-09-30',
    NOW(),
    'system',
    3,
    1
),
(
    'UI/UX Designer Fresher',
    'Thiet ke giao dien ung dung web, app',
    'Ho Chi Minh',
    b'1',
    'FULL_TIME',
    'HYBRID',
    'FRESHER',
    1,
    10000000.00,
    '2026-06-01',
    '2026-10-01',
    NOW(),
    'system',
    4,
    6
),
(
    'Marketing Intern',
    'Ho tro len campagin quang cao',
    'Da Nang',
    b'1',
    'INTERN',
    'REMOTE',
    'INTERN',
    2,
    3000000.00,
    '2026-06-01',
    '2026-08-31',
    NOW(),
    'system',
    2,
    2
),
(
    'DevOps Engineer Junior',
    'Quan tri he thong, CI/CD, AWS',
    'Ha Noi',
    b'1',
    'FULL_TIME',
    'ONSITE',
    'JUNIOR',
    1,
    18000000.00,
    '2026-07-01',
    '2026-12-31',
    NOW(),
    'system',
    3,
    1
),
(
    'Tester Intern',
    'Kiem thu phan mem, manual test, auto test co ban',
    'Ho Chi Minh',
    b'1',
    'INTERN',
    'ONSITE',
    'INTERN',
    4,
    4000000.00,
    '2026-08-01',
    '2026-10-31',
    NOW(),
    'system',
    8,
    1
),
(
    'Business Analyst Fresher',
    'Lay yeu cau khach hang, viet tai lieu he thong',
    'Ho Chi Minh',
    b'1',
    'FULL_TIME',
    'HYBRID',
    'FRESHER',
    2,
    12000000.00,
    '2026-06-15',
    '2026-12-31',
    NOW(),
    'system',
    5,
    1
),
(
    'Sales Executive',
    'Tim kiem va cham soc khach hang B2B mang logistics',
    'Ha Noi',
    b'1',
    'FULL_TIME',
    'ONSITE',
    'JUNIOR',
    5,
    15000000.00,
    '2026-06-01',
    '2027-06-01',
    NOW(),
    'system',
    4,
    4
);

-- 10. JOB_SKILL
INSERT INTO `job_skill` (`job_id`, `skill_id`) VALUES
(1,1), (1,2), (1,6),
(2,3), (2,10),
(3,1), (3,2), (3,8),
(4,5), (4,6), (4,15),
(5,11), (5,18),
(6,12), (6,13),
(7,8), (7,9), (7,17),
(8,9), (8,13),
(9,13), (9,16),
(10,13), (10,14);

-- 11. RESUMES
INSERT INTO `resumes` (`title`, `url`, `created_at`, `created_by`, `user_id`) VALUES
('CV Java Intern - Nguyen Van A', 'https://example.com/cv_a_v1.pdf', NOW(), 'sva@gmail.com', 8),
('CV Backend - Nguyen Van A', 'https://example.com/cv_a_v2.pdf', NOW(), 'sva@gmail.com', 8),
('CV Frontend - Tran Thi B', 'https://example.com/cv_b.pdf', NOW(), 'svb@gmail.com', 9),
('CV Data Analyst - Le Van C', 'https://example.com/cv_c.pdf', NOW(), 'svc@gmail.com', 10),
('CV Marketing - Pham Thi D', 'https://example.com/cv_d.pdf', NOW(), 'svd@gmail.com', 11),
('CV Data Science - Hoang Van E', 'https://example.com/cv_e.pdf', NOW(), 'sve@gmail.com', 12),
('CV Angular - Vu Thi F', 'https://example.com/cv_f.pdf', NOW(), 'svf@gmail.com', 13),
('CV System Admin - Bui Van G', 'https://example.com/cv_g.pdf', NOW(), 'svg@gmail.com', 14),
('CV UI/UX - Dang Thi H', 'https://example.com/cv_h.pdf', NOW(), 'svh@gmail.com', 15);

-- 12. APPLICATIONS
INSERT INTO `applications` (`status`, `note`, `created_at`, `created_by`, `job_id`, `resume_id`) VALUES
('PENDING', 'Em rat mong duoc thuc tap tai quy cong ty.', NOW(), 'sva@gmail.com', 1, 1),
('PENDING', 'Em apply vi tri backend.', NOW(), 'sva@gmail.com', 3, 2),
('REVIEWING', 'CV phu hop, se goi pv som.', NOW(), 'svb@gmail.com', 2, 3),
('APPROVED', 'Passed phong van.', NOW(), 'svc@gmail.com', 4, 4),
('REJECTED', 'Chua phu hop dinh huong.', NOW(), 'svd@gmail.com', 6, 5),
('PENDING', 'Mong nhan duoc phan hoi', NOW(), 'sve@gmail.com', 4, 6),
('REVIEWING', 'Dang xem xet profile.', NOW(), 'svf@gmail.com', 2, 7),
('APPROVED', 'Chuan bi offer.', NOW(), 'svg@gmail.com', 7, 8),
('PENDING', 'Em la designer tuong lai.', NOW(), 'svh@gmail.com', 5, 9),
('PENDING', 'Dang ky ung tuyen.', NOW(), 'svd@gmail.com', 10, 5);