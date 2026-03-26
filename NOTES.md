# NHẬT KÝ ĐIỀU CHỈNH VÀ XỬ LÝ LỖI

*Dành cho việc ghi nhớ các thay đổi kiến trúc hoặc lỗi phát sinh trong quá trình phát triển.*

## [2026-03-23] Khởi tạo Hệ thống
- Quyết định phân tách các API thành các file xử lý riêng biệt (Auth, Account, Admin) thay vì gộp chung để dễ bảo trì về sau.
- Sẽ tạo một script `Setup.gs` để tự động khởi tạo Google Sheets (Database) và thư mục Google Drive lưu ảnh, vì người dùng chưa cung cấp sẵn ID. Đảm bảo cấu trúc đồng bộ.
- [23:00] Hoàn tất triển khai Module Xử lý ảnh (Auto-Processing) với OpenCV.js (nhận diện viền Deskew), Browser Image Compression (< 500KB), và tích hợp luồng Capture HTML5 WebRTC Video trực tiếp thay thế Input File thủ công.
- [23:10] Cập nhật luồng xử lý Ngày tháng (Date Pipeline): Front-end hiển thị kiểu Việt Nam (DD/MM/YYYY) nhưng Back-end tự động parse và map vào Sheets dưới dạng Quốc tế (YYYY-MM-DD) & Object Date thuần để đảm bảo không gãy hệ thống. Đồng thời cập nhật `GEMINI.md` để trở thành standard rule.
- [23:30] Chạy Thực tra QA & System Hardening. Sửa lỗi nghiêm trọng thiếu LockService dẫn đến việc bị ghi đè dữ liệu (Race condition). Đã bổ sung `LockService.getScriptLock()` vào tất cả các nghiệp vụ ghi/sửa. Bổ sung chặt chẽ bảo mật Server-side chặn việc sửa đổi hồ sơ "Đã xác minh". Đã xuất Đề án `DE_AN_HOAN_THIEN.md`.
- [23:45] Hoàn tất Chu kỳ Cải tiến lần 2 (Continuous Improvement Cycle 2). Tích hợp `sessionStorage`, validate Regex thẻ (CCCD & SĐT), và thiết kế "Làm mới dữ liệu ngầm" cho Dashboard. Khởi tạo `walkthrough.md` bàn giao.
- [23:50] Khắc phục cấu trúc Phân quyền (Role Authorization). Thêm trường `Quyền hạn` vào `Staff_List` và chuyển logic điều hướng từ Phòng ban sang Quyền hạn (`Admin` / `User`). Bổ sung script migration `migrateAddingRole()`. Nghiệp vụ End-to-End được bàn giao cho User do môi trường giả lập hỏng Trình duyệt.
- [23:55] Khắc phục toàn bộ các Cảnh báo nghiêm trọng từ IDE (Linter): Bổ sung `aria-label` và `title` cho các thẻ Select, File Input, Button Icons (A11y Accessibility) trong `frmMoTaiKhoan.html`. Bổ sung tiền tố Safari `-webkit-backdrop-filter` vào CSS Glassmorphism trong `index.html`.
