# Dự án InternMatching

## 1. Giới thiệu dự án
InternMatching là một hệ thống website kết nối việc làm, hỗ trợ tương tác trực tiếp giữa ứng viên (đặc biệt là sinh viên/người tìm việc) và các doanh nghiệp tuyển dụng. Hệ thống phân chia rõ ràng các nhóm người dùng gồm Quản trị viên (Admin), Nhà tuyển dụng (HR) và Ứng viên (Candidate), giúp chuẩn hóa quy trình đăng tin, nộp hồ sơ và quản lý tuyển dụng.

## 2. Công nghệ sử dụng
- Frontend: ReactJS
- Backend: Spring Boot
- Database: MySQL
- API document/test: Swagger
- Deploy: Frontend triển khai trên Netlify, Backend API hoạt động trên máy chủ VPS riêng.

## 3. Chức năng chính
- Chức năng chung: Đăng ký tài khoản, đăng nhập, phân quyền theo vai trò.
- Candidate: Xem danh sách việc làm, xem chi tiết việc làm, nộp hồ sơ ứng tuyển, theo dõi lịch sử ứng tuyển.
- HR: Đăng tin tuyển dụng mới, quản lý tin tuyển dụng của công ty, xem danh sách hồ sơ ứng viên, cập nhật trạng thái ứng tuyển (Chấp nhận/Từ chối).
- Admin: Quản lý danh sách người dùng, quản lý danh sách công ty, quản lý dữ liệu hệ thống (kỹ năng, ngành nghề).

## 4. Cấu trúc thư mục
- `backend/`: Chứa mã nguồn backend Spring Boot.
- `frontend/`: Chứa mã nguồn frontend ReactJS.

## 5. Link triển khai
- Frontend: https://internmatching.netlify.app/
- Swagger API: http://188.166.219.104:8081/swagger-ui/index.html

## 6. Phân công công việc và nhánh GitHub
| Thành viên | Mã sinh viên | Nhánh phụ trách | Nội dung chính |
|---|---|---|---|
| Nguyễn Tài Linh (Nhóm trưởng) | B24DCCC178 | feature/linh-backend | Backend, API, cơ sở dữ liệu, phân quyền, Admin, deploy, báo cáo |
| Phạm Hoàng Ngân | B24DCCC214 | feature/fe-job | Giao diện Job/Candidate |
| Lữ Trọng Đại | B24DCCC045 | feature/fe-profile | Giao diện HR, kiểm thử/debug |
| Phạm Đức Duy | B24DCCC096 | feature/fe-auth | Giao diện đăng nhập, đăng ký |



## 7. Hướng dẫn chạy dự án local

### Chạy Backend (Spring Boot)
Di chuyển vào thư mục backend và chạy ứng dụng thông qua Gradle wrapper:
```
cd backend
./gradlew bootRun
```

### Chạy Frontend (ReactJS/Vite)
Mở một terminal mới, di chuyển vào thư mục frontend để cài đặt và chạy:
```
cd frontend
npm install
npm run dev
```

### Chạy bằng Docker (Tùy chọn)
Hệ thống cũng hỗ trợ cấu hình chạy backend và database tự động thông qua Docker. Tại thư mục gốc của dự án, chạy lệnh:
```
docker-compose up -d
```

## 8. Ghi chú
- Dự án được thực hiện phục vụ đồ án kết thúc học phần Thực hành Lập trình Web.
- Một số thông tin cấu hình như database, tài khoản hoặc biến môi trường có thể cần điều chỉnh theo môi trường chạy local để ứng dụng có thể hoạt động chính xác.
