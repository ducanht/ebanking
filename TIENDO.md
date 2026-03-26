# TIẾN ĐỘ THỰC HIỆN DỰ ÁN

## Giai đoạn 1: Chuẩn bị & Thiết kế (Hoàn thành)
- [x] Phân tích yêu cầu nghiệp vụ
- [x] Thiết kế kiến trúc, lên kế hoạch (implementation_plan.md)
- [x] Tạo các file theo dõi tiến độ (TIENDO.md, NOTES.md)

## Giai đoạn 2: Khởi tạo Hạ tầng (Đang thực hiện)
- [x] Tiên quyết: Xây dựng script `Setup.gs` tự động tạo Google Sheets và Google Drive Folder
- [x] Khởi tạo các file cấu hình `Config.gs` và `Database.gs`

## Giai đoạn 3: Phát triển Backend API (Hoàn thành)
- [x] Module `api_auth.gs`: Logic Đăng nhập (AES/SHA-256 nội bộ Cán bộ)
- [x] Module `api_account.gs`: Upload ảnh, ghi batch vào Sheets, kiểm trùng
- [x] Module `api_admin.gs`: Thống kê Dashboard

## Giai đoạn 4: Phát triển Frontend (Giao diện) - Hoàn thành
- [x] `index.html`: Cấu trúc chung SPA & thư viện CDN Bootstrap 5 chuẩn
- [x] `frmLogin.html`: Màn hình Đăng nhập (Glassmorphism)
- [x] `frmMoTaiKhoan.html`: Màn hình Khai báo KH (Upload nhiều ảnh, Flatpickr)
- [x] `frmDashboard.html`: Dashboard Admin (ChartJS, DataTables Responsive, Export Excel)
- [x] `jsApp.html`: JavaScript Logic SPA

## Giai đoạn 5: Tối ưu Nâng cao Xử lý ẢNh (Hoàn thành)
- [x] Tích hợp luồng WebRTC Camera trực tiếp ở Frontend.
- [x] Áp dụng thư viện nén `browser-image-compression` (bắt buộc <500KB).
- [x] Áp dụng AI `OpenCV.js` (Edge detection / Deskew bounding boxes).
- [x] Chuẩn hóa Datetime Pipeline (Frontend DD/MM/YYYY <-> Backend YYYY-MM-DD).

## Giai đoạn 6: Tính năng Quản lý Hồ sơ Cá nhân (Hoàn thành)
- [x] Giao diện (Frontend) danh sách hồ sơ của nhân viên.
- [x] Modal xem chi tiết thông tin và Hình ảnh.
- [x] Backend API Lấy danh sách hồ sơ theo Email cán bộ.
- [x] Backend API Cập nhật/Chỉnh sửa hồ sơ.

## Giai đoạn 7: Kiểm thử và Bàn giao
- [x] Khắc phục lỗi (QA & Hardening System): Sửa Race Condition với LockService, chặn Bypass.
- [x] Lập đề án hoàn thiện hệ thống (`DE_AN_HOAN_THIEN.md`).
- [x] Cập nhật Luật lệ (`GEMINI.md`).
- [ ] Hướng dẫn sử dụng (walkthrough)

## Giai đoạn 8: Chuẩn hóa & Cải tiến lần 2 (Hoàn thành)
- [x] Tích hợp `sessionStorage` chống văng ứng dụng (Login Persistence).
- [x] Ràng buộc Regex cho số CCCD và SĐT (Data Validator).
- [x] Tính năng tải lại dữ liệu ngầm cho Dashboard (UX Optimization).

## Giai đoạn 9: Nâng cấp Analytics & Security (Sprint 2) - Hoàn thành
- [x] Tích hợp Change Password bắt buộc cho tài khoản mặc định `qtdyentho`.
- [x] Tính toán Timeline Analytics GroupBy (Theo Ngày, Theo Tháng) trực tiếp trên Server để tối ưu dung lượng JSON trả về.
- [x] Xây dựng Biểu đồ đường (Line Chart) và Biểu đồ cột (Bar Chart) tốc độ cao bằng `Chart.js`.
- [x] Lưới lọc thời gian DataTables thao tác qua `Flatpickr` (Từ Ngày... Đến Ngày).
- [x] Mở rộng Bảng phong thần Cán bộ ra Toàn Hệ thống, bọc trong Modal Modal kèm Nút Export CSV/Excel Client-side.

## Giai đoạn 10: Sửa lỗi & Chuẩn hóa Form Validation (Sprint 3) - Hoàn thành
- [x] **Xử lý Dữ liệu Ảo (Mock Data):** Sửa lỗi lệch Index Mảng trong `Setup.gs` gây ra tình trạng dữ liệu Tên, Email, CCCD đổ nhầm cột làm App chết đứng không Data.
- [x] **Xử lý số 0 đầu (Leading Zeros):** Sửa lỗi mất số 0 đầu của CCCD, SĐT và Số TK khi lưu vào Google Sheets bằng cách thêm Quote (`'`) ở Backend `api_account.gs`.
- [x] **Mã hóa Giao diện Số Tài khoản:** Thay đổi Input Số Tài khoản thành `InputGroup`, khóa chết tiền tố `3800200` và chỉ yêu cầu nhập 9 số cuối.
- [x] **Xác thực biểu mẫu:** Gắn `checkValidity()` và Bootstrap feedback cho form Mở tài khoản để yêu cầu Regex gắt gao ngay tại Front-End (đổ viền đỏ báo lỗi tức thì).
