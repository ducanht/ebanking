# Kiến Trúc Hệ Thống: Ebanking Quỹ TDND Yên Thọ

> [!IMPORTANT]
> Đây là tài liệu cốt lõi (Blueprint) ghi nhận quy trình, kiến trúc, cấu trúc cơ sở dữ liệu và bảo mật của Ứng dụng Quản lý Khách hàng / Mở tài khoản Ebanking. Tài liệu này cần được trích xuất và tham chiếu trước khi thực hiện bất cứ cập nhật, bảo trì nào.
> 
> Hệ thống được vận hành tự động qua **Vercel (Frontend)** kết nối tới **Google Apps Script (Backend API)**.

---

## 1. Kiến Trúc Tổng Quan (Architecture)

### 1.1 Khái quát (SPA Architecture)
Ứng dụng được xây dựng theo mô hình **Single Page Application (SPA)**:
- **Frontend (Deploy Vercel)**: Xây dựng bằng Thuần HTML, CSS (Bootstrap 5), JS (ES6+ jQuery) ở mục `netlify-app/`.
- **Backend (Serverless API)**: Sử dụng Google Apps Script (GAS) làm nền tảng xử lý dữ liệu và lưu trữ vào Google Drive / Sheets.
- **Micro-database**: Google Sheets (2 bảng: `DATA` + `STAFFS`).
- **URL Production**: [qtd-ebanking.vercel.app](https://qtd-ebanking.vercel.app/)

### 1.2 Giao tiếp Dữ liệu (Networking & Protocol)
- Tương tác qua **chuẩn REST-like API (doPost)** trả về JSON từ GAS.
- Frontend sử dụng hàm Wrapper API tự tạo (`runAPI`) trong `js/api.js` với cơ chế:
  - Timeout: `35000` ms (35s) cho thao tác phức tạp như Base64 Upload Ảnh.
  - AbortController giúp ngắt tiến trình nếu sập mạng.
  - Chống SPAM: Tự khóa nút bấm (`disabled`), hiện Overlay Spinner ngay khi Request bắn đi.
- **Giao thức JSON**: Mọi response đều chuẩn `{ status: "success"|"error", data|message }`.

---

## 2. Phân Quyền Hệ Thống (RBAC - Role Based Access Control)

Ứng dụng chia rõ 2 nhóm người dùng:

### Mức 1: `User / Staff` (Cán bộ tín dụng)
Ví dụ: `qtdyentho.thaobui@gmail.com`
- **Quyền hạn**:
  - Tạo mới hồ sơ khách hàng (Cá nhân, Hộ kinh doanh).
  - Sử dụng Camera / OpenCV.js để chụp và làm phẳng tài liệu.
  - Sửa đổi các hồ sơ **do chính mình tạo**.
  - **Quyền kích hoạt:** Được phép bật toggle "Kích hoạt hồ sơ".
  - Xem Dashboard cá nhân: Tiến độ, xếp hạng, chấm điểm thi đua.

### Mức 2: `Admin` (Giám sát / Ban Lãnh đạo)
Ví dụ: `ducanht@gmail.com`
- **Quyền hạn**:
  - Dashboard Tổng Quan: Biểu đồ phân bổ loại hình, top 5 Cán bộ xuất sắc, bảng lịch sử toàn hệ thống.
  - **Read-Only Mode (Bắt buộc):** Admin xem chi tiết hồ sơ nhưng KHÔNG thể sửa. Mọi `<input>` bị `disabled`, nút Lưu bị ẩn, toggle Kích hoạt bị ẩn.

---

## 3. Luồng Nghiệp Vụ (Business Logic Flow)

### 3.1 Luồng Mở Hồ Sơ Mới
1. Cán bộ nhập thông tin form (Tên, SĐT, CCCD, Loại hình...).
2. **Frontend `checkDuplicate()`:** Kiểm tra trùng **CCCD/SĐT trong cùng Loại hình** (Cá nhân riêng, HKD riêng) ngay khi nhập xong (`onblur`).
3. **Xử lý ảnh:** Camera → OpenCV.js Crop & Cân phẳng → `browser-image-compression` nén (dùng `useWebWorker: false`).
4. **Package ảnh:** Dưới dạng Base64 → Submit `api_submitAccountForm`.
5. **GAS Upload:** Tải Base64 lên Google Drive → lấy Link ID.
6. **GAS Database Sync (18 Cột):** Ghi hồ sơ vào Sheet với `LockService.waitLock(10000)` → `SpreadsheetApp.flush()`.
   - **Thứ tự Cột (A -> R):** ID, Thời điểm, Cán bộ, Tên KH, CCCD, DKKD, SĐT, Loại hình, Ngày mở, Số TK (CIF), Tên đăng nhập, Mật khẩu, Ảnh CCCD Trước, Ảnh CCCD Sau, Ảnh GP DKKD, Ảnh QR, Ảnh Thực Hiện, Trạng thái.

### 3.2 Luồng Caching & Hiệu Suất
- **AppCache** (JavaScript in-memory): TTL `300,000ms = 5 phút`.
  - Admin: Key `adminDashboard` — lưu toàn bộ `statsPayload`.
  - Staff: Key `myDashboard` — lưu dữ liệu cá nhân.
- Khi cache hết hạn hoặc dữ liệu mới được ghi → `AppCache.clear()` invalidate → gọi lại API.
- **Fallback Stats (v2.1.8+):** Nếu GAS backend cũ không trả về `activated/inactive` trong `statsPayload`, frontend tự tính từ `allData`:
  ```js
  if (s && s.allData && s.total > 0 && ((s.activated || 0) + (s.inactive || 0)) < s.total) {
      s.activated = s.allData.filter(d => d['Trạng thái'] === 'Đã kích hoạt').length;
      s.inactive  = s.total - s.activated;
  }
  ```

### 3.3 Luồng Kích Hoạt Hồ Sơ (Staff)
1. Staff mở Modal Chi Tiết → bật toggle "KÍCH HOẠT HỒ SƠ".
2. Frontend gọi `api_updatecustomer` với payload bao gồm `trang_thai: "Đã kích hoạt"`.
3. GAS `api_updateMyCustomer`:
   - Tìm hồ sơ theo ID.
   - ~~Chặn sửa nếu "Đã xác minh"~~ (Đã bỏ từ v2.1.8).
   - Cập nhật cột `Trạng thái` → `SpreadsheetApp.flush()`.
4. Frontend nhận success → cập nhật badge trạng thái ngay lập tức + invalidate cache.

---

## 4. Cấu trúc Database (Google Sheets Data Mapping)

### Bảng `DATA` (Hồ sơ khách hàng)
| Cột | Tên Header | Loại |
|-----|-----------|------|
| 0 | ID | UUID (string) |
| 1 | Thời điểm nhập | Date → ISO String |
| 2 | Cán bộ thực hiện | Email string |
| 3 | Tên khách hàng | String (UPPERCASE) |
| 4 | Số CCCD | String (có prefix `'`) |
| 5 | Số GP ĐKKD | String |
| 6 | Số điện thoại | String (có prefix `'`) |
| 7 | Loại hình dịch vụ | `Cá nhân` / `Hộ kinh doanh` |
| 8 | Ngày cấp | Date |
| 9 | Số TK | String — Format: `3800200` + 9 digits (có prefix `'`) |
| 10 | Tên đăng nhập | String |
| 11 | Mật khẩu | String |
| 12-16 | URL ảnh CCCD (Trước/Sau/QR/Thực hiện/Ký tên) | URL Google Drive |
| 17 | Trạng thái | `Đã kích hoạt` / `Chưa kích hoạt` |

> [!WARNING]
> **Prefix `'` trong Sheets:** Các cột CCCD, SĐT, Số TK được lưu với dấu nháy đơn `'` đứng đầu để Google Sheets không tự convert thành Number. Frontend phải dùng `.replace(/^'/, '')` khi hiển thị.

### Bảng `STAFFS` (Cán bộ)
| Cột | Tên Header |
|-----|-----------|
| Email | Email đăng nhập |
| Họ tên | Tên đầy đủ |
| Role | `Admin` / `Staff` |
| Bộ phận | Tên phòng ban |

---

## 5. Cấu trúc Mã Nguồn Frontend

| Thư mục / File | Mô tả |
| :--- | :--- |
| `netlify-app/index.html` | UI Entry point, SPA một trang, load CDN libs với cache-busting `?v=2.1.8-patch` |
| `netlify-app/js/app.js` | Core: khởi tạo `AppState`, Event Delegation, điều hướng view |
| `netlify-app/js/api.js` | Wrapper `runAPI()` — giao tiếp GAS, timeout, loading overlay |
| `netlify-app/js/camera.js` | Scanner OpenCV.js: nhận diện cạnh giấy bằng contour area |
| `netlify-app/js/customer.js` | Modal Chi tiết & Chỉnh sửa, phân quyền Admin/Staff |
| `netlify-app/js/dashboard.js` | Dashboard Admin & Staff: Chart.js, DataTables, Stats rendering |
| `netlify-app/js/registration.js` | Form mở TK: nén ảnh, validate, submit |

### Cấu trúc Mã Nguồn Backend (GAS)

| File `.gs` | Mô tả |
| :--- | :--- |
| `Main.gs` | Entry point `doPost()`, routing action |
| `Config.gs` | Hằng số: SPREADSHEET_ID, tên Sheet |
| `Database.gs` | `getSheetDataAsObjects()`, `insertRecordToSheet()` — Batch Ops |
| `api_account.gs` | `api_submitAccountForm`, `api_getMyCustomers`, `api_updateMyCustomer` |
| `api_admin.gs` | `api_getAdminDashboardData`, `api_getMyRanking`, `api_adminUpdateStatus` |
| `api_auth.gs` | `api_login` — xác thực, kiểm tra Role |

---

## 6. Luồng CI/CD (Triển khai)

### Frontend (Tự động)
```powershell
git add . && git commit -m "Fix: mô tả" && git push
# → Vercel auto-build & deploy (~30-60 giây)
```

### Backend GAS (2 bước — BẮT BUỘC)
```powershell
# Bước 1: Upload code mới vào GAS Editor
clasp push --force

# Bước 2: Re-deploy Web App (BẮT BUỘC để URL /exec dùng code mới)
clasp deployments                    # Xem danh sách deployment IDs
clasp deploy -i <DEPLOYMENT_ID>      # Cập nhật deployment hiện có
```

> [!CAUTION]
> `clasp push` **CHƯA ĐỦ**! Phải chạy thêm `clasp deploy -i <ID>` để Production URL (`/exec`) dùng code mới. Nếu bỏ qua bước này, Frontend sẽ vẫn gọi code GAS cũ.

---

## 7. Lịch Sử Phiên Bản

| Phiên bản | Thay đổi |
|-----------|---------|
| v2.1.6-STABLE | Phiên bản ổn định đầu tiên |
| v2.1.8-PATCH | Fix Dashboard IDs, Số TK field, Fallback Stats, Remove activation lock |
| v2.1.8 (hiện tại) | Staff có thể kích hoạt hồ sơ sau khi re-deploy GAS |
