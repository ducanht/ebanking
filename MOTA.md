# MÔ TẢ HỆ THỐNG QUẢN LÝ CHỈ TIÊU MỞ TÀI KHOẢN VÀ PHÁT TRIỂN THÀNH VIÊN

## 1. Yêu cầu & Mục tiêu
- **Quản trị tập trung:** Hệ thống hóa toàn bộ dữ liệu KH mới vào một CSDL duy nhất.
- **Kiểm soát rủi ro:** Ngăn chặn tuyệt đối việc trùng lặp dữ liệu (định danh bằng CCCD/DKKD/SĐT).
- **Tạo động lực thi đua:** Công khai thứ hạng cán bộ thời gian thực để tạo động lực hoàn thành chỉ tiêu.
- **Lưu trữ số hóa:** Lưu trữ hồ sơ hình ảnh CCCD, GPKD vào lưu trữ đám mây.

## 2. Các Tính năng Chính yếu
**Tính năng Nâng cao (Auto-Processing):**
- **Camera trực tiếp:** Tích hợp WebRTC gọi Camera ngay trên giao diện giúp thao tác nhanh.
- **AI Auto-Crop & Deskew:** Sử dụng OpenCV.js định vị giấy tờ và căn chỉnh khung thẻ tự động.
- **Nén & Tối ưu hóa:** Sử dụng `browser-image-compression` nén ảnh xuống dưới mức 500KB/file ngay trên bộ nhớ trình duyệt, tiết kiệm băng thông mạng 4G khi đi thị trường.

**Phân hệ Quản trị (Admin Dashboard):**
- Theo dõi các chỉ số tổng quan (Tổng hồ sơ, Hồ sơ chờ duyệt, Đã xác minh).
- Biểu đồ phân bổ loại hình dịch vụ theo cấu trúc Chart.js.
- Bảng xếp hạng Top 5 Cán bộ xuất sắc của Quỹ.
- Bảng Grid dữ liệu chi tiết cho phép xem tất cả chi tiết ảnh, khả năng lọc tự do và kết xuất thành File Excel nhanh chóng.
- Cấp quyền/Khóa tài khoản nhân sự từ file cấu hình Database tĩnh.

**Phân hệ Báo cáo & Thống kê (Analytics):**
- Biểu đồ Xu hướng (Line) & Phân bổ (Bar) Real-time với `Chart.js` cấp độ Admin và User.
- Bộ lọc dữ liệu khoảng thời gian siêu tốc bằng Custom Search DataTables.
- Mở rộng chức năng Bảng phong thần Toàn Hệ thống kèm công cụ Xuất Excel / CSV nội bộ trực tiếp tại Client.

## 3. Kiến trúc Giải pháp & Công nghệ
- **Môi trường chạy Backend:** Xây dựng Serverless qua Google Apps Script (`.gs`) để tương tác 100% dựa vào hạ tầng bảo mật Google.
- **Micro-Services Architecture:** Hệ thống chia cắt thành File Cấu hình (`Config.gs`), Hàm CSDL (`Database.gs`), Logic Xử lý (`api_account`, `api_admin`, `api_auth`) giúp dễ dàng bảo trì về sau.
- **Frontend Container:** Giao diện điều hướng ẩn/hiện DIV trên 1 file nền tảng kết hợp các thư viện CDN:
  - `Bootstrap 5`: Xây dựng kết cấu lưới 12 cột Responsive.
  - `Boxicons`: Hệ icon đồng bộ mượt mà.
  - `SweetAlert2`: Module cảnh báo Popup tinh tế.
  - `DataTables`: Xử lý bảng dữ liệu, tìm kiếm đa luồng.
  - `CryptoJS`: Băm mật khẩu tại vòng bảo vệ lớp 1 trước khi gửi cho máy chủ.
  - Ngoài ra: Flatpickr, AutoNumeric, jQuery...

## 4. Cấu trúc Dữ liệu (Database Schema) & Quy chuẩn Dữ liệu
Hệ thống sử dụng **Google Sheets** làm cơ sở dữ liệu và **Google Drive** làm kho lưu ảnh tĩnh (Blob storage):

- **Bảo mật và Đồng bộ (Concurrency):** 100% các thao tác Ghi/Sửa file phải bọc trong `LockService.getScriptLock().waitLock(10000)` để ngăn ngừa Race Conditions (Ghi đè dữ liệu khi nhiều người sửa cùng lúc). Xả đệm bằng `SpreadsheetApp.flush()`.
- **Chuẩn hóa Ngày tháng (Time-sync):** Toàn bộ giao diện người dùng hiển thị chuẩn Việt Nam (DD/MM/YYYY). Toàn bộ Database lưu trữ định dạng chuẩn quốc tế (YYYY-MM-DD) hoặc mốc chuỗi thời gian nguyên thủy (Timestamp Object) để ngăn chặn tuyệt đối lỗi lọc/so sánh gây sập hệ thống.

- **Sheet `Data_MoTaiKhoan` (Dữ liệu giao dịch hạch toán chính):**
  - Khóa chính tự sinh (UUID), Thời điểm nhập Timestamp.
  - Cán bộ thực thi (Identity Email), Tên KH, Số CCCD, Số DKKD, Số điện thoại.
  - Phân luồng đối tượng dịch vụ (Cá nhân / Hộ KD).
  - Ngày mở Core-banking hiện thực, Số TK, Mật khẩu nội bộ.
  - Liên kết Drive URL (Mặt trước/sau CCCD, GP DKKD).
  - Trạng thái kiểm soát định danh.

- **Sheet `Staff_List` (Bảng Nhân sự & Phân quyền):**
  - Email (Khóa chính), Họ tên, Bộ phận.
  - Mật khẩu (dưới dạng chuỗi băm Base SHA-256).
  - Chỉ tiêu KPI cá nhân.
  - Trạng thái cấp phép (Hoạt động / Khóa).

*(Tài liệu chuyên môn này được đồng bộ vận hành cùng với file `TIENDO.md` và `NOTES.md` ở cấp phát triển)*
