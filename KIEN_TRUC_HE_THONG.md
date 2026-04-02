# Kiến Trúc Hệ Thống: Ebanking Quỹ TDND Yên Thọ

> [!IMPORTANT]
> Đây là tài liệu cốt lõi **(Blueprint)** ghi nhận toàn bộ kiến trúc, quy trình CI/CD, cấu trúc CSDL và bảo mật của hệ thống Quản lý Chỉ Tiêu Mở Tài Khoản Ebanking. **Phải đọc trước khi thực hiện bất kỳ thay đổi nào.**
>
> Hệ thống chạy hoàn toàn tự động: **GitHub → Vercel/Netlify (Frontend)** kết nối với **Google Apps Script (Backend API)**.

---

## 1. Kiến Trúc Tổng Quan (Architecture)

### 1.1 Mô hình SPA (Single Page Application)

```
┌──────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                          │
│               github.com/ducanht/ebanking                    │
└──────────────────┬──────────────────────────────┬───────────┘
                   │ git push (auto trigger)        │ git push
                   ▼                               ▼
┌──────────────────────────┐      ┌────────────────────────────┐
│  VERCEL (Primary)        │      │  NETLIFY (Secondary)        │
│  qtd-ebanking.vercel.app │      │  (Backup / Mirror)          │
│  Auto-deploy ~30-60s     │      │  Auto-deploy ~30-60s        │
└──────────────────────────┘      └────────────────────────────┘
                   │                               │
                   └──────────────┬────────────────┘
                                  │ HTTPS fetch (doPost)
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│         GOOGLE APPS SCRIPT (Serverless Backend)              │
│  URL: script.google.com/macros/s/{ID}/exec                   │
│  Runtime: V8 · Max execution: 6 phút/request                │
└─────────────────────────────┬───────────────────────────────┘
                              │ Sheets API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         GOOGLE SHEETS (Micro-Database)                       │
│  Sheet DATA     → 18 cột hồ sơ khách hàng                    │
│  Sheet STAFFS   → Danh sách cán bộ + phân quyền             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 URL & Thông tin vận hành

| Hạng mục | Thông tin |
|----------|-----------|
| **Repository Git** | `github.com/ducanht/ebanking` |
| **URL Production (Vercel - chính)** | `https://qtd-ebanking.vercel.app/` |
| **URL Backup (Netlify - phụ)** | Deploy từ cùng repo, cấu hình song song |
| **GAS API Endpoint** | `https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec` |
| **Thư mục Frontend** | `/netlify-app/` trong repo |

### 1.3 Giao tiếp Dữ liệu (Networking & Protocol)
- **REST-like API (doPost)**: Frontend gọi GAS qua `fetch()` với method POST.
- **Wrapper `runAPI()`** trong `js/api.js`:
  - Timeout: `35,000 ms` (35s) — đủ cho upload Base64 ảnh lớn.
  - `AbortController` ngắt kết nối nếu mạng sập.
  - Chống SPAM: Tự khóa nút (`disabled`) + Overlay Spinner ngay khi request bắn đi.
- **Chuẩn response JSON**: Mọi response đều là `{ status: "success"|"error", data|message }`.

---

## 2. CI/CD Pipeline — Triển Khai Tự Động

> [!IMPORTANT]
> Hệ thống dùng **GitHub làm nguồn sự thật duy nhất**. Cả Vercel và Netlify đều kết nối trực tiếp với repository `ducanht/ebanking` và tự động deploy khi có commit mới trên branch `main`.

### 2.1 Frontend Pipeline (Tự động — Không cần làm thêm gì)

```
[Sửa code cục bộ]
      ↓
git add . && git commit -m "Fix: mô tả ngắn gọn"
      ↓
git push origin main
      ↓ (Webhook tự động kích hoạt)
 ┌────────────┐     ┌──────────────┐
 │  Vercel    │     │   Netlify    │
 │ ~30-60 giây│     │ ~30-60 giây  │
 │ Auto-build │     │ Auto-build   │
 │ & deploy   │     │ & deploy     │
 └────────────┘     └──────────────┘
```

**Quy tắc commit message chuẩn:**
```bash
# Sửa lỗi (bug fix)
git commit -m "Fix(P0): Dashboard không cập nhật sau kích hoạt hồ sơ"

# Tính năng mới
git commit -m "Feat: Bổ sung export Excel bảng xếp hạng thi đua"

# Cải thiện UI/UX  
git commit -m "UI: Cập nhật tiêu đề modal đúng nghiệp vụ v2.1.9"

# Cập nhật tài liệu
git commit -m "Docs: Cập nhật KIEN_TRUC_HE_THONG.md"
```

### 2.2 Cache-busting — Buộc trình duyệt tải file mới

Khi deploy version mới, **bắt buộc** cập nhật version string trong `index.html`:

```html
<!-- index.html — cuối file, trước </body> -->
<!-- Modules (v2.1.9-FIX) -->
<script src="js/registration.js?v=2.1.9-fix"></script>
<script src="js/customer.js?v=2.1.9-fix"></script>
<script src="js/dashboard.js?v=2.1.9-fix"></script>
<script src="app.js?v=2.1.9-fix"></script>
```
> Thay đổi `?v=` mỗi khi deploy để trình duyệt không dùng cache cũ.

### 2.3 Backend GAS (Thủ công — 2 bước BẮT BUỘC)

```bash
# Bước 1: Đẩy code mới lên GAS Editor
clasp push --force

# Bước 2: Re-deploy Web App (bắt buộc để /exec dùng code mới)
clasp deployments                     # Xem danh sách DEPLOYMENT_ID
clasp deploy -i <DEPLOYMENT_ID>       # Cập nhật deployment hiện có
```

> [!CAUTION]
> **`clasp push` CHƯA ĐỦ!** Phải chạy thêm `clasp deploy -i <ID>` thì URL Production `/exec` mới dùng code mới. Nếu bỏ qua bước này, Frontend sẽ vẫn gọi code GAS cũ — đây là nguyên nhân phổ biến nhất của các lỗi sau khi "đã sửa backend".

---

## 3. Phân Quyền Hệ Thống (RBAC)

Ứng dụng chia rõ 2 nhóm người dùng:

### Mức 1: `Staff` (Cán bộ tín dụng)
Ví dụ: `qtdyentho.thaobui@gmail.com`

| Quyền | Chi tiết |
|-------|----------|
| ✅ Tạo hồ sơ mới | Cả Cá nhân và Hộ kinh doanh |
| ✅ Sửa hồ sơ | Chỉ hồ sơ do chính mình tạo |
| ✅ Kích hoạt hồ sơ | Bật toggle "Kích hoạt" trong modal Chỉnh sửa |
| ✅ Dashboard cá nhân | Tiến độ, xếp hạng, chấm điểm thi đua |
| ✅ Xem hồ sơ của mình | Danh sách + chi tiết |
| ❌ Xem toàn bộ hệ thống | Chỉ Admin |
| ❌ Sửa hồ sơ người khác | Bị chặn ở backend |

### Mức 2: `Admin` (Giám sát / Ban Lãnh đạo)
Ví dụ: `ducanht@gmail.com`

| Quyền | Chi tiết |
|-------|----------|
| ✅ Dashboard tổng quan | Biểu đồ, top 5, lịch sử toàn hệ thống |
| ✅ Bảng xếp hạng thi đua | Tất cả cán bộ, sắp theo tổng hồ sơ |
| ✅ Xem chi tiết hồ sơ | Nhưng Read-Only tuyệt đối |
| ✅ Export Excel | Báo cáo toàn bộ + xếp hạng cán bộ |
| ❌ Sửa bất kỳ hồ sơ nào | `<input>` bị `disabled`, nút Lưu bị ẩn |
| ❌ Kích hoạt hồ sơ | Toggle bị ẩn khi Admin xem |

---

## 4. Luồng Nghiệp Vụ (Business Logic Flow)

### 4.1 Luồng Mở Hồ Sơ Mới
1. Cán bộ nhập thông tin form (Tên, SĐT, CCCD, Loại hình...).
2. **Frontend `checkDuplicate()`:** Kiểm tra trùng CCCD/SĐT **trong cùng Loại hình** (Cá nhân riêng, HKD riêng) ngay khi `onblur`. Hiện `is-invalid` nếu trùng.
3. **Pre-submit validation (v2.1.9+):** Trước khi submit, kiểm tra lại định dạng + `is-invalid` cho toàn bộ form. Focus vào trường lỗi đầu tiên nếu có.
4. **Xử lý ảnh:** Camera → OpenCV.js Crop & Cân phẳng → `browser-image-compression` nén (dùng `useWebWorker: false`, timeout 15s/ảnh).
5. **Package ảnh:** Dưới dạng Base64 → Submit `api_submitregistration`.
6. **GAS Upload:** Decode Base64 → Upload lên Google Drive → Lấy Link ID.
7. **GAS Database Sync (18 Cột):** Ghi hồ sơ vào Sheet với `LockService.waitLock(10000)` → `SpreadsheetApp.flush()`.

**Thứ tự 18 Cột (A → R):**
| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ID | Thời điểm | Cán bộ | Tên KH | CCCD | DKKD | SĐT | Loại hình | Ngày mở | Số TK | Tên ĐN | Mật khẩu | Ảnh CCCD Trước | Ảnh CCCD Sau | Ảnh GP DKKD | Ảnh QR | Ảnh Thực Hiện | Trạng thái |

### 4.2 Luồng Kích Hoạt Hồ Sơ (Staff)
1. Staff mở Modal **"Chỉnh Sửa Hồ Sơ Mở Tài Khoản [badge Chờ/Đã kích hoạt]"** → bật toggle.
2. Frontend gọi `api_updatecustomer` với `trang_thai: "Đã kích hoạt"`.
3. GAS cập nhật cột `Trạng thái` → `SpreadsheetApp.flush()`.
4. Frontend nhận success → **Xóa cache `myCustomers` + `adminDashboard` + reset `window._adminAllData = null`** → gọi lại `initMyCustomersList()` hoặc `loadAdminData()`.

> [!WARNING]
> **Cache double-invalidation (v2.1.9-FIX):** Bắt buộc clear cả `AppCache.clear('adminDashboard')` và `window._adminAllData = null`. Nếu chỉ clear `myCustomers`, Admin Dashboard sẽ hiển thị số liệu cũ.

### 4.3 Luồng Caching & Hiệu Suất
- **AppCache** (JavaScript in-memory): TTL `300,000ms = 5 phút`.
  - Admin: Key `adminDashboard` — lưu toàn bộ `statsPayload`.
  - Staff: Key `myCustomers` / `myDashboard` — lưu dữ liệu cá nhân.
- **Fallback Stats (v2.1.8+):** Nếu GAS cũ không trả về `activated/inactive`, frontend tự tính từ `allData`:
  ```js
  if (s?.allData?.length > 0 && (s.activated + s.inactive) < s.total) {
      s.activated = s.allData.filter(d => d['Trạng thái'] === 'Đã kích hoạt').length;
      s.inactive  = s.total - s.activated;
  }
  ```

---

## 5. Cấu Trúc Cơ Sở Dữ Liệu (Google Sheets)

### Bảng `DATA` (Hồ sơ khách hàng — 18 cột)

| Cột | Header | Kiểu dữ liệu | Ghi chú |
|-----|--------|--------------|---------|
| A (0) | ID | UUID string | Auto-gen |
| B (1) | Thời điểm nhập | ISO DateTime | `new Date().toISOString()` |
| C (2) | Cán bộ thực hiện | Email string | Từ session |
| D (3) | Tên khách hàng | String (UPPERCASE) | |
| E (4) | Số CCCD | `'` + 12 số | Prefix `'` chặn auto-number |
| F (5) | Số GP ĐKKD | String | HKD only |
| G (6) | Số điện thoại | `'` + 10 số | Prefix `'` |
| H (7) | Loại hình dịch vụ | `Cá nhân` / `Hộ kinh doanh` | |
| I (8) | Ngày cấp | Date object | |
| J (9) | Số TK (CIF) | `'3800200` + 9 số | Format cố định |
| K (10) | Tên đăng nhập | String | |
| L (11) | Mật khẩu | String | Lưu plaintext (yêu cầu nghiệp vụ) |
| M-Q (12-16) | URL ảnh | Google Drive URL | CCCD Trước/Sau, GP, QR, Thực hiện |
| R (17) | Trạng thái | `Đã kích hoạt` / `Chưa kích hoạt` | |

> [!WARNING]
> **Prefix `'` trong Sheets:** Các cột CCCD, SĐT, Số TK phải lưu với dấu nháy đơn `'` để Sheets không auto-convert sang Number. Frontend hiển thị phải dùng `.replace(/^'/, '')`.

### Bảng `STAFFS` (Danh sách cán bộ)

| Header | Kiểu | Ghi chú |
|--------|------|---------|
| Email | String | Key đăng nhập duy nhất |
| Họ tên | String | Hiển thị trên Dashboard |
| Role | `Admin` \| `Staff` | Kiểm soát RBAC toàn hệ thống |
| Bộ phận | String | Tên phòng ban / tổ |

---

## 6. Cấu Trúc Mã Nguồn

### 6.1 Frontend (`/netlify-app/`)

| File | Mô tả | Version thay đổi gần nhất |
|------|-------|--------------------------|
| `index.html` | SPA entry point, load CDN libs, cache-busting `?v=` | v2.1.9-FIX |
| `app.js` | Khởi tạo `AppState`, Event Delegation, điều hướng view | v2.1.8 |
| `js/api.js` | `runAPI()` — giao tiếp GAS, timeout 35s, overlay spinner | v2.1.8 |
| `js/auth.js` | Login/Logout, session management, SHA-256 hash | v2.1.8 |
| `js/camera.js` | Scanner OpenCV.js: nhận diện cạnh giấy bằng contour area | v2.1.8 |
| `js/registration.js` | Form mở TK: nén ảnh, validate, **pre-submit check** | **v2.1.9-FIX** |
| `js/customer.js` | Modal Chỉnh sửa: phân quyền, **cache dual-invalidation** | **v2.1.9-FIX** |
| `js/dashboard.js` | Dashboard Admin & Staff, Chart.js, **export Excel fix** | **v2.1.9-FIX** |
| `style.css` | Design system, glassmorphism, animations | v2.1.6 |

### 6.2 Backend GAS

| File `.gs` | Mô tả |
|-----------|-------|
| `Main.gs` | Entry `doPost()`, routing action theo `switch(action)` |
| `Config.gs` | Hằng số: `SPREADSHEET_ID`, tên Sheet, CORS headers |
| `Database.gs` | `getSheetDataAsObjects()`, `insertRecordToSheet()` — Batch Ops |
| `api_account.gs` | `api_submitregistration`, `api_getmycustomers`, `api_updatecustomer` |
| `api_admin.gs` | `api_getadmindashboard`, `api_getmyranking` |
| `api_auth.gs` | `api_login` — xác thực email + hash, trả về Role |

---

## 7. Chuẩn Xuất Excel (Export)

> [!NOTE]
> Quy tắc export Excel được chuẩn hoá từ v2.1.9-FIX. Luôn dùng `exportOptions.columns` để chỉ định chính xác cột cần export, tránh xuất HTML raw của cột nút bấm.

### 7.1 Bảng Hồ Sơ Cá Nhân (Staff — `customer.js`)
- **Bảng có 6 cột dữ liệu:** STT, Tên KH, Số TK, Loại hình, SĐT, Trạng thái + 1 cột nút **Xem** (col 5).
- **Export:** `columns: [0, 1, 2, 3, 4]` — Bỏ cột 5 (nút Xem).
- **Tên file:** `HoSo_CaNhan_YenTho_YYYY-MM-DD.xlsx`

### 7.2 Bảng Lịch Sử Toàn Hệ Thống (Admin — `dashboard.js`)
- **Bảng có 7 cột:** Thời gian, Họ Tên, Số TK, Loại Hình, SĐT, Cán Bộ + 1 cột nút **Chi tiết** (col 6).
- **Export:** `columns: [0, 1, 2, 3, 4, 5]` — Bỏ cột 6 (nút Chi tiết).
- **Tên file:** `BaoCao_MoTK_YenTho_YYYY-MM-DD.xlsx`

### 7.3 Bảng Xếp Hạng Thi Đua (Admin — `dashboard.js`)
- **Bảng có 6 cột:** Hạng, Họ tên, Bộ phận, Tổng, Cá nhân, HKD.
- **Export:** `columns: [0, 1, 2, 3, 4, 5]` — Export đủ.
- **Tên file:** `XepHang_ThiDua_YenTho_YYYY-MM-DD.xlsx`

---

## 8. Tiêu Đề Modal (Modal Titles — Chuẩn Nghiệp Vụ)

| Modal | Tiêu đề đúng | Icon |
|-------|-------------|------|
| Đổi mật khẩu | **Đổi Mật Khẩu Đăng Nhập** | `bx-lock-open-alt` |
| Chi tiết hồ sơ (Admin) | **Chi Tiết Hồ Sơ Mở Tài Khoản** + badge trạng thái | `bx-info-circle` |
| Chỉnh sửa hồ sơ (Staff) | **Chỉnh Sửa Hồ Sơ Mở Tài Khoản** + badge trạng thái | `bxs-edit-alt` |
| Bảng xếp hạng all-staff | **Bảng Xếp Hạng Thi Đua Mở Tài Khoản** | `bxs-trophy` |

Badge trạng thái hiển thị động:
- ✅ `Đã kích hoạt` → `badge bg-success`
- ⏳ `Chưa kích hoạt` → `badge bg-warning text-dark`

---

## 9. Lịch Sử Phiên Bản

| Phiên bản | Ngày | Thay đổi chính |
|-----------|------|----------------|
| v2.1.6-STABLE | 2026-03 | Phiên bản ổn định đầu tiên sau refactor |
| v2.1.8-PATCH | 2026-03-30 | Fix Dashboard IDs, Số TK field, Fallback Stats |
| v2.1.8 | 2026-03-31 | Staff được kích hoạt hồ sơ sau re-deploy GAS, fix RBAC |
| **v2.1.9-FIX** | **2026-04-01** | **P0: Cache dual-invalidation Admin Dashboard sau kích hoạt. P0: Fix export Excel columns (bỏ cột nút HTML). P1: Tiêu đề modal đúng nghiệp vụ (4 modal). P1: Bảng xếp hạng thi đua có huy hiệu vàng/bạc/đồng. P2: Pre-submit validation form mở TK.** |

---

## 10. Các Lỗi Phổ Biến & Cách Xử Lý

| Triệu chứng | Nguyên nhân | Cách xử lý |
|-------------|-------------|------------|
| Dashboard Admin không cập nhật sau kích hoạt | `adminDashboard` cache chưa được clear | Đảm bảo clear cả `AppCache.clear('adminDashboard')` + `window._adminAllData = null` |
| Export Excel có HTML (chữ `<button>`) | `columns: ':all'` xuất cả cột nút | Dùng `columns: [0,1,2,3,4,5]` chỉ định cụ thể |
| GAS backend không dùng code mới | Chỉ `clasp push`, quên `clasp deploy` | Luôn chạy `clasp deploy -i <ID>` sau push |
| Trình duyệt vẫn tải JS cũ | Cache trình duyệt | Cập nhật `?v=` trong tất cả `<script src>` |
| Form submit dù có lỗi trùng | `checkDuplicate` async chưa kịp chạy | `handleRegistration` giờ check `is-invalid` trước khi submit |
| `localStorage is not defined` | Code GAS cố đọc `localStorage` | Tất cả session phải ở frontend JS, không ở GAS |

---

## 11. BÀI HỌC KINH NGHIỆM & QUY TẮC DỰ ÁN MỚI (SYSTEM RULES)

Nếu khởi tạo một dự án WebApp vận hành theo kiến trúc Serverless (Frontend tự do + Google Apps Script Backend), BẮT BUỘC phải áp dụng bộ quy tắc (RULES) sau đây vào System Prompt cho AI để tránh các lỗi chí mạng đã được giải quyết:

### 11.1 Giới hạn của Hệ sinh thái Google (GAS)
- **LockService chống Race-Condition:** Mọi thao tác GHI/SỬA (Insert/Update) dữ liệu bắt buộc phải bọc trong `LockService.getScriptLock().waitLock(15000)` và kết thúc bằng `SpreadsheetApp.flush()`. Nếu không, nhiều user submit cùng lúc sẽ chép đè dữ liệu lên nhau.
- **Micro-database Performance (Batch Ops):** Tuyệt đối cấm dùng vòng lặp thiết lập `.appendRow()` hay `.setValue()`. Mọi thao tác phải đọc nguyên cục mảng 2 chiều bằng `.getValues()`, xử lý trên RAM, sau đó đẩy ngược lại bằng `.setValues()` trong 1 lần gọi API duy nhất.
- **Lưu trữ số:** Để Google Sheets không tự format các số điện thoại/số TK làm mất số 0 ở đầu, trước khi ghi phải tự chèn dấu nháy đơn trước chuỗi (Ví dụ: `"'0987654321"`).

### 11.2 Giao diện và API Call
- **Lỗi Bút Toán Kép (Double-click):** 100% các nút "Lưu/Submit" thao tác ghi dữ liệu đều phải bị `.prop('disabled', true)` ngay ở mili-giây đầu tiên khi user click và hiện Spinner (VD: Đang lưu...).
- **Giảm tải Payload bằng Native Compression:** Kích thước tải trọng qua AppScript có giới hạn chặt chẽ/thời gian Timeout ngắn. Ảnh trước khi mã hoá Base64 phải chạy qua `browser-image-compression` để ép xuống dưới `1MB`.

### 11.3 Tương thích Phần Cứng: Camera vs Mobile
- **Lỗi Lớp Phủ Màn Hình (Screen Overlay):** Cấm gọi WebRTC (`navigator.mediaDevices.getUserMedia`) trên Mobile Devices, đặc biệt là Android do hệ điều hành hay chặn cấp quyền trình duyệt khi có bong bóng chat.
- **Rule Xử Lý Camera:** Viết code lọc theo User-Agent: Nếu `isMobile`, bypass hoàn toàn WebRTC bằng cách dùng `Native Camera Picker`: `<input type="file" capture="environment">`. Laptop/PC thì dùng WebRTC bình thường.

### 11.4 Computer Vision - Tunning OpenCV.js
- Khi xây dựng một clone của *CamScanner* chạy client-side, thẻ nhựa ép plastic rất dễ tạo dải lóa sáng (Glare) gây cắt đứt nét Canny Edge khiến thuật toán dò hình 4 góc vỡ nát. Bắt buộc dùng `cv.dilate` (Làm phình viền) trước khi tìm góc.
- **Rule tìm Hình tứ giác:** `cv.approxPolyDP` rất kém khi gặp góc CCCD bo tròn. Thay vào đó, sau khi lấy được khối viền lớn nhất, dùng Thuật toán **Cực trị Toạ độ** để tìm 4 đỉnh (Top-Left: Min $(X+Y)$, Bottom-Right: Max $(X+Y)$, Top-Right: Max $(X-Y)$, Bottom-Left: Min $(X-Y)$). Nó đảm bảo ôm chặt đối tượng 99%.
