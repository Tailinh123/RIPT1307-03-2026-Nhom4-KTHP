-- 1. JOB CATEGORIES
INSERT INTO `job_categories`
(`name`, `description`, `created_at`, `created_by`)
VALUES
('Cong nghe thong tin', 'Phan mem, He thong, AI, Data', NOW(), 'system'),
('Marketing', 'Digital Marketing, Content, SEO', NOW(), 'system'),
('Ke toan - Kiem toan', 'Ke toan tong hop, Kiem toan noi bo', NOW(), 'system'),
('Kinh doanh', 'Sales, Business Development', NOW(), 'system'),
('Nhan su', 'Tuyen dung, Dao tao, C&B', NOW(), 'system');



-- 2. SKILLS
INSERT INTO `skills`
(`name`, `created_at`, `created_by`)
VALUES
('Java', NOW(), 'system'),
('Spring Boot', NOW(), 'system'),
('React', NOW(), 'system'),
('Angular', NOW(), 'system'),
('Python', NOW(), 'system'),
('MySQL', NOW(), 'system'),
('PostgreSQL', NOW(), 'system'),
('Docker', NOW(), 'system'),
('Git', NOW(), 'system'),
('TypeScript', NOW(), 'system');



-- 3. ROLES
INSERT INTO `roles`
(`name`, `description`, `is_active`, `created_at`, `created_by`)
VALUES
('SUPER_ADMIN', 'Admin full permissions', b'1', NOW(), 'system'),
('HR_MANAGER', 'Doanh nghiep dang tuyen', b'1', NOW(), 'system'),
('STUDENT', 'Sinh vien tim viec', b'1', NOW(), 'system');



-- 4. PERMISSIONS
INSERT INTO `permissions`
(`name`, `api_path`, `method`, `module`, `created_at`, `created_by`)
VALUES
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

('Create a user', '/api/v1/users', 'POST', 'USERS', NOW(), 'system');



-- 5. PERMISSION_ROLE
INSERT INTO `permission_role`
(`permission_id`, `role_id`)
VALUES
(1,1),(2,1),(3,1),(4,1),(5,1),
(6,1),(7,1),(8,1),(9,1),(10,1),
(11,1),(12,1),(13,1);



-- 6. COMPANIES
INSERT INTO `companies`
(`name`, `address`, `description`, `created_at`, `created_by`)
VALUES
('FPT Software', 'Hoa Lac, Ha Noi', 'Cong ty phan mem hang dau VN', NOW(), 'system'),
('VNG Corporation', 'Quan 7, Ho Chi Minh', 'Cong nghe giai tri va AI', NOW(), 'system');



-- 7. USERS
-- password = 123456
INSERT INTO `users`
(
    `name`,
    `email`,
    `password`,
    `date_of_birth`,
    `gender`,
    `address`,
    `is_subscribed`,
    `is_active`,
    `created_at`,
    `created_by`,
    `company_id`,
    `role_id`
)
VALUES
(
    'Super Admin',
    'admin@gmail.com',
    '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q',
    '1995-01-01',
    'MALE',
    'Ha Noi',
    b'0',
    b'1',
    NOW(),
    'system',
    NULL,
    1
),
(
    'Nguyen Van A',
    'sva@gmail.com',
    '$2a$10$OkbuP02xo3MTGF.Px2XUkesiOy/nWQ8Pb3K16icdTIkqoACLwvS4q',
    '2003-01-10',
    'MALE',
    'Ha Noi',
    b'1',
    b'1',
    NOW(),
    'system',
    NULL,
    3
);



-- 8. USER_SKILLS
INSERT INTO `user_skills`
(`user_id`, `skill_id`)
VALUES
(2,1),
(2,2);



-- 9. JOBS
INSERT INTO `jobs`
(
    `name`,
    `description`,
    `location`,
    `active`,
    `job_type`,
    `work_mode`,
    `level`,
    `quantity`,
    `salary`,
    `start_date`,
    `end_date`,
    `created_at`,
    `created_by`,
    `company_id`,
    `category_id`
)
VALUES
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
);



-- 10. JOB_SKILL
INSERT INTO `job_skill`
(`job_id`, `skill_id`)
VALUES
(1,1),
(1,2),
(1,6),

(2,3),
(2,10),

(3,1),
(3,2),
(3,8);