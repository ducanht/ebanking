# Cẩm nang Kỹ thuật & Chỉ dẫn Vận hành Hệ thống HoKinhDoanh

> [!IMPORTANT]
> Tài liệu này tổng hợp toàn bộ các quy chuẩn kỹ thuật, cấu trúc lập trình và hướng dẫn vận hành để đảm bảo hệ thống **HoKinhDoanh** hoạt động trơn tru, bảo mật và hiệu suất cao trên nền tảng Google Apps Script (GAS).

---

## 1. KIẾN TRÚC GIAO TIẾP DỮ LIỆU (API PATTERN)

Hệ thống tuân thủ mô hình **API Gateway** tập trung để quản lý mọi request từ Frontend lên Backend.

### 1.1 Luồng Request chuẩn
1.  **Frontend**: Sử dụng duy nhất hàm `AppManager.callApi(action, payload)`.
    *   Tự động đính kèm `sessionToken` và `ClientIP`.
    *   Chống nhấn đúp (Double-click prevention) cho các tác vụ ghi dữ liệu.
2.  **Backend (Main.gs)**: Hàm `doApiRequest(action, payload)` đóng vai trò điều phối.
    *   Kiểm tra tính hợp lệ của Token (ngoại trừ hàm `login`).
    *   Phân phối đến các Service tương ứng (`Service_Staff`, `Service_Profile`, v.v.).
    *   **Bắt lỗi (Try-catch)**: Mọi lỗi được catch và trả về dưới dạng JSON `{status: 'error', message: '...'}`.

### 1.2 Quy tắc Batch Operations (Bắt buộc)
Để tránh lỗi vượt quá quota thời gian (6 phút) và số lượng yêu cầu của Google:
*   **KHÔNG** dùng `getValue()`, `setValue()`, `appendRow()` trong vòng lặp.
*   **LUÔN LUÔN** đọc mảng lớn (`getValues()`), xử lý trên RAM, sau đó ghi hàng loạt (`setValues()`).

---

## 2. BẢO MẬT & QUẢN LÝ TRUY CẬP (RBAC)

### 2.1 Cơ chế Đăng nhập & Session
*   **Mật khẩu**: Tuyệt đối không gửi mật khẩu thuần. Frontend thực hiện băm **SHA-256** trước khi gửi lên.
*   **Session**: Token được lưu trong `ScriptCache` với thời hạn 12 giờ. Khi người dùng thao tác, token được kiểm tra lại ở Backend.
*   **Phân quyền (Role-Based Access Control)**:
    *   `Admin`: Có quyền truy cập menu "Tạo Form", xem Dashboard tổng thể, quản lý danh sách nhân sự.
    *   `User (Staff)`: Chỉ xem và quản lý hồ sơ do mình tạo ra.

### 2.2 Bảo mật dữ liệu trên Drive
*   Mọi thư mục ảnh và file PDF được cấu hình quyền truy cập hạn chế.
*   Hệ thống sử dụng tài khoản Service (chính là tài khoản chủ GAS) để ghi file, người dùng cuối không cần quyền trực tiếp trên folder Drive.

---

## 3. TỐI ƯU HIỆU SUẤT & CACHE

Hệ thống sử dụng **Cache 2 lớp** để tăng tốc độ phản hồi:
1.  **Layer 1 (In-Memory)**: Lưu trữ dữ liệu trong một lần thực thi script (biến global `_executionCache`).
2.  **Layer 2 (ScriptCache)**: Lưu trữ dữ liệu dưới dạng JSON (nén) trong 12 giờ để giảm số lần đọc file Google Sheets.

> [!TIP]
> Khi có thao tác Ghi/Sửa/Xóa, hệ thống tự động gọi hàm xóa Cache tương ứng để đảm bảo dữ liệu hiển thị luôn mới nhất.

---

## 4. QUY CHUẨN DỮ LIỆU & THỜI GIAN

| Tầng xử lý | Định dạng Thời gian | Lưu ý |
| :--- | :--- | :--- |
| **Frontend hiển thị** | `DD/MM/YYYY` | Thân thiện với người dùng Việt Nam. |
| **Nhập liệu (Flatpickr)** | `altInput: true` | Hiển thị VN, nhưng giá trị gửi đi là `YYYY-MM-DD`. |
| **Backend & Database** | `YYYY-MM-DD` / ISO | Đảm bảo việc sắp xếp (Sort) và truy vấn chính xác. |
| **Tiền tệ** | `AutoNumeric` | Định dạng `1.000.000 đ` trên UI, gửi về Backend là kiểu `Number`. |

---

## 5. XỬ LÝ HÌNH ĐẢNG & OCR (CÔNG NGHỆ LÕI)

Để hệ thống vận hành mượt mà trên Mobile:
1.  **Nén ảnh tại Client**: Trước khi upload, ảnh được canvas nén xuống chất lượng ~0.7 (dung lượng < 1MB).
2.  **OpenCV.js**: Sử dụng để tìm cạnh (Edge Detection) và cắt phẳng ảnh CCCD. Điều này giúp tăng độ chính xác khi nhúng ảnh vào file PDF hồ sơ.
3.  **Base64**: Ảnh được truyền lên Backend dưới dạng chuỗi Base64 để tránh các lỗi phân quyền phức tạp của Drive API khi upload trực tiếp.

---

## 6. HƯỚNG DẪN BẢO TRÌ & XỬ LÝ LỖI (TROUBLESHOOTING)

### 6.1 Các lỗi thường gặp
*   **Lỗi 401 (Unauthorized)**: Thường do Session hết hạn. Hệ thống sẽ tự động chuyển hướng về trang Login.
*   **Lỗi Timeout (6 minutes)**: Xảy ra khi xử lý MailMerge quá nhiều hồ sơ cùng lúc. Giải pháp: Chia nhỏ danh sách hoặc tối ưu file Template (giảm dung lượng ảnh mẫu).
*   **Lỗi Race Condition**: Khi 2 người cùng sửa 1 dòng dữ liệu. Hệ thống sử dụng `LockService.getScriptLock()` để đảm bảo chỉ 1 người được ghi tại một thời điểm.

### 6.2 Quy trình Migration (Cập nhật DB)
Khi cần thêm cột mới vào Sheet `Data_MoTaiKhoan`:
1.  Cập nhật danh sách Header trong file `Setup.gs`.
2.  Chạy hàm `runMigration()` từ trình chỉnh sửa Script (GAS Editor).
3.  Hệ thống sẽ tự động chèn thêm cột mà không làm mất dữ liệu cũ.

---

## 7. CHỈ DẪN VẬN HÀNH CHO QUẢN TRỊ VIÊN

1.  **Quản lý Template**: Luôn kiểm tra các từ khóa Placeholder (ví dụ `{{TenKH}}`) trong file Google Docs phải khớp chính xác với định nghĩa trong code.
2.  **Kiểm soát dung lượng**: Google Drive có giới hạn 15GB (tài khoản miễn phí). Cần định kỳ lưu trữ hồ sơ cũ ra ngoài hoặc xóa bỏ ảnh tạm nếu bộ nhớ đầy.
3.  **Monitor Logs**: Sử dụng `Logger.log()` hoặc bảng `System_Logs` (nếu có) để theo dõi các hoạt động bất thường của nhân viên.

---
*Tài liệu được cập nhật lần cuối vào: 24/03/2025*
*Người soạn thảo: Antigravity AI - Hệ thống Quản lý HoKinhDoanh*
