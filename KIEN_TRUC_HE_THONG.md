# Kiến Trúc Hệ Thống: Ebanking Quỹ TDND Yên Thọ

> [!IMPORTANT]
> Đây là tài liệu cốt lõi (Blueprint) ghi nhận quy trình, kiến trúc, cấu trúc cơ sở dữ liệu và bảo mật của Ứng dụng Quản lý Khách hàng / Mở tài khoản Ebanking. Tài liệu này cần được trích xuất và tham chiếu trước khi thực hiện bất cứ cập nhật, bảo trì nào.
> 
> Hệ thống được vận hành tự động qua **Vercel/Netlify (Frontend)** kết nối tới **Google Apps Script (Backend API)**.

## 1. Kiến Trúc Tổng Quyết (Architecture)

### 1.1 Khái quát (SPA Architecture)
Ứng dụng được xây dựng theo mô hình **Single Page Application (SPA)**:
- **Frontend (Ứng dụng biên dịch qua Vercel)**: Xây dựng bằng Thuần HTML, CSS (Bootstrap 5), JS (ES6+ JQuery) ở mục `netlify-app/`.
- **Backend (Serverless API)**: Sử dụng Google Apps Script (GAS) làm nền tảng xử lý dữ liệu và lưu trữ vào Google Drive / Sheets.
- **Micro-database**: Google Sheets.

### 1.2 Giao tiếp Dữ liệu (Networking & Protocol)
- Tương tác qua **chuẩn REST-like API (doPost)** trả về JSON từ GAS.
- Frontend sử dụng hàm Wrapper API tự tạo (`runAPI`) với cơ chế:
  - Timeout: `35000` ms (35s) cho thao tác phức tạp như Base64 Upload Ảnh.
  - AbortController giúp ngắt tiến trình nếu sập mạng.
  - Chống SPAM: Tự khóa nút bấm (`disabled`), hiện Overlay Spinner ngay khi Request bắn đi.

---

## 2. Phân Quyền Hệ Thống (RBAC - Role Based Access Control)

Ứng dụng chia rõ 2 nhóm người dùng:

### Mức 1: `User / Staff` (Cán bộ tín dụng) 
VD: `qtdyentho.thaobui@gmail.com`
- **Quyền hạn**:
  - Tạo mới hồ sơ (Cá nhân, Hộ kinh doanh).
  - Sử dụng Camera thiết bị / OpenCV.js để chụp và làm phẳng tài liệu.
  - Sửa đổi các hồ sơ đã tạo nếu có sai sót.
  - **Quyền quan trọng:** Được phép check ô "Kích hoạt hồ sơ ngay".
  - Xem Dashboard cá nhân: Chấm điểm thi đua, tiến độ số hồ sơ đã thực hiện, và thứ tự xếp hạng tại Quỹ.

### Mức 2: `Admin` (Giám sát / Ban Lãnh đạo)
VD: `ducanht@gmail.com`
- **Quyền hạn**:
  - Truy cập **Dashboard Tổng Quan** (Hiển thị biểu đồ phân bổ loại hình, tiến độ tổng, và top 5 Cán bộ suất xắc).
  - Có cái nhìn bao quát về cả hệ thống. Kiểm tra tệp hồ sơ do mọi nhân viên nộp.
  - **Hạn chế cố ý (Read-Only Mode):** Admin KHÔNG có nút lưu hoặc hộp kiểm (CheckBox) kích hoạt. Admin trong Pop-up Edit sẽ bị ẩn nút (hide) và mọi Input bị làm mờ (disabled), đóng vai trò xem & thẩm định.

---

## 3. Quy Trình / Luồng Nghiệp Vụ (Business Logic Flow)

### 3.1 Luồng Mở Hồ Sơ Mới
1. Máy khách nhận thông tin form (Số điện thoại, CCCD, Loại hình...).
2. JavaScript `checkDuplicate()` Validation chặn các thao tác tạo bị lặp dữ liệu `CCCD` / `Điện thoại / ĐKKD` của nhau. 
3. **Trình xử lý Hình ảnh (Image Processing):** 
   - Camera lấy ảnh. `OpenCV.js` kích hoạt xử lý Crop & Cân phẳng. 
   - `browser-image-compression` thực hiện nén file (với `useWebWorker: false` để tránh lỗi Memory Main thread).
4. Package ảnh dưới dạng Base64 và Submit xuống Apps Script (API: `api_submitAccountForm`).
5. Apps Script upload ảnh Base64 lên Google Drive, lấy Link ID.
6. Apps Script kích hoạt hàm `insertRecordToSheet` và khóa file bằng `LockService.waitLock(10000)` để ngăn trùng lặp (Race condition). Ghi xuống Sheet -> Giải phóng Lock.

### 3.2 Luồng Render Caching & API
- **AppCache**: Quản lý Local Data cho Admin/Staff Dashboard (`TTL: 300,000ms = 5 phút`). Khi mở lại Dashboard mà chưa quá 5 phút vòng đời, App sẽ tự load RAM đệm mà không chọc tải (Ping) tốn băng thông xuống Apps Script, lách hạn chế ngầm (Quota Limit) 6-phút/ngày của Google.
- Nếu load dữ liệu mới, App kích API `api_getAdminDashboardData` / `api_getmycustomers` lấy chuỗi JSON đã Stringify từ phía Backend.

---

## 4. Cấu trúc Database (Google Sheets Data Mapping)
Toàn bộ logic bảng tính được khóa cứng vào hệ tuần tự Column:
- **0**: ID (UUID)
- **1**: Thời gian Khai báo
- **2**: Email Cán bộ tải lên
- **3**: Tên Khách Hàng
- **4**: Số CCCD
- **5**: Số GP ĐKKD
- **6**: Số Điện Khoại
- **7**: Loại hình (Cá nhân / Hộ kinh doanh)
- **8**: Ngày Cấp
- **9**: Số TK
- **10**: Tên đăng nhập (Ebanking)
- **11**: Mật khẩu khởi tạo
- **12 .. 16**: URL Ảnh thẻ các loại
- **17**: Trạng thái (`Đã kích hoạt` / `Chưa kích hoạt`)

---

## 5. Cấu trúc Mã nguồn Frontend (Netlify Vercel Env)

| Thư mục / File | Mô tả |
| :--- | :--- |
| `index.html` | UI Entry point, giao diện một trang với cơ chế Swap View ẩn/hiện. Load CDN libs. |
| `js/app.js` | Core Initialization (Init AppState, Event Delegation tĩnh, Interceptor Timeout). |
| `js/camera.js` | Hàm Scanner OpenCV: Nhận diện cạnh giấy bằng thuật tóan contour area. |
| `js/customer.js` | Chứa Modal Load Form Hồ Sơ, Logic phân quyền ẩn nút Admin, quyền Staff. |
| `js/dashboard.js` | Phân tích Chart.js và DataTables tính tổng Data. Đổ API vào DataTables. |
| `js/registration.js` | Quản lý form submission mở Tk (Chứa module nén ảnh Compression). |

---

## 6. Luồng CI/CD (Triển khai & Cập Nhật Lên Máy Chủ)

1. Khi lập trình viên thực thi sửa đổi Local tại Desktop (Window).
2. Thực thi chuỗi lệnh `git status`, `git add .`, `git commit -m "fix errors"`, `git push`.
3. Webhook của nền tảng **Vercel/Netlify** sẽ tự động Trigger:
   - Git Fetch code mới nhất về từ nhánh mặc định.
   - Quét Build tĩnh với các File Frontend.
   - Deploy bản update lên Domain chính: [qtd-ebanking.vercel.app](https://qtd-ebanking.vercel.app/).

*(Tham khảo tệp lệnh Commit/Push ở log trao đổi bên dưới để tự Cập Nhật App ngay lập tức)*.
