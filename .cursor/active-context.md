> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `KIEN_TRUC_HE_THONG.md` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[what-changed] Replaced auth Frontend — externalizes configuration for environment flexibility**: - 2. Frontend `checkDuplicate()` gọi `api_checkDuplicate` — kiểm tra trùng **CCCD/SĐT trong cùng Loại hình** (Cá nhân riêng, HKD riêng).
+ 2. **Frontend `checkDuplicate()`:** Kiểm tra trùng **CCCD/SĐT trong cùng Loại hình** (Cá nhân riêng, HKD riêng) ngay khi nhập xong (`onblur`).
- 4. Package ảnh dưới dạng Base64 → Submit `api_submitAccountForm`.
+ 4. **Package ảnh:** Dưới dạng Base64 → Submit `api_submitAccountForm`.
- 5. GAS upload ảnh Base64 lên Google Drive → lấy Link ID.
+ 5. **GAS Upload:** Tải Base64 lên Google Drive → lấy Link ID.
- 6. GAS ghi hồ sơ vào Sheet với `LockService.waitLock(10000)` → `SpreadsheetApp.flush()`.
+ 6. **GAS Database Sync (18 Cột):** Ghi hồ sơ vào Sheet với `LockService.waitLock(10000)` → `SpreadsheetApp.flush()`.
- 
+    - **Thứ tự Cột (A -> R):** ID, Thời điểm, Cán bộ, Tên KH, CCCD, DKKD, SĐT, Loại hình, Ngày mở, Số TK (CIF), Tên đăng nhập, Mật khẩu, Ảnh CCCD Trước, Ảnh CCCD Sau, Ảnh GP DKKD, Ảnh QR, Ảnh Thực Hiện, Trạng thái.
- ### 3.2 Luồng Caching & Hiệu Suất
+ 
- - **AppCache** (JavaScript in-memory): TTL `300,000ms = 5 phút`.
+ ### 3.2 Luồng Caching & Hiệu Suất
-   - Admin: Key `adminDashboard` — lưu toàn bộ `statsPayload`.
+ - **AppCache** (JavaScript in-memory): TTL `300,000ms = 5 phút`.
-   - Staff: Key `myDashboard` — lưu dữ liệu cá nhân.
+   - Admin: Key `adminDashboard` — lưu toàn bộ `statsPayload`.
- - Khi cache hết hạn hoặc dữ liệu mới được ghi → `AppCache.clear()` invalidate → gọi lại API.
+   - Staff: Key `myDashboard` — lưu dữ liệu cá nhân.
- - **Fallback Stats (v2.1.8+):** Nếu GAS backend cũ không trả về `activated/inactive` trong `statsPayload`, frontend tự tính từ `allData`:
+ - Khi cache hết hạn hoặc dữ liệu mới được ghi → `AppCache.clear()` invalidate → gọi lại API.
-   ```js
+ - **Fallback Stats (v2.1.8+):** Nếu GAS backend cũ không trả về `activated/inactive` trong `statsPayload`, frontend tự tính từ `allData`:
-   if (s && s.allData && s.total > 0 && ((s.activated || 0) + (s.inactive || 0)) < s.total) {
+   `
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [# Kiến Trúc Hệ Thống: Ebanking Quỹ TDND Yên Thọ]
- **[decision] Optimized Vercel — offloads heavy computation off the main thread**: - > Hệ thống được vận hành tự động qua **Vercel/Netlify (Frontend)** kết nối tới **Google Apps Script (Backend API)**.
+ > Hệ thống được vận hành tự động qua **Vercel (Frontend)** kết nối tới **Google Apps Script (Backend API)**.
- ## 1. Kiến Trúc Tổng Quyết (Architecture)
+ ---
- ### 1.1 Khái quát (SPA Architecture)
+ ## 1. Kiến Trúc Tổng Quan (Architecture)
- Ứng dụng được xây dựng theo mô hình **Single Page Application (SPA)**:
+ 
- - **Frontend (Ứng dụng biên dịch qua Vercel)**: Xây dựng bằng Thuần HTML, CSS (Bootstrap 5), JS (ES6+ JQuery) ở mục `netlify-app/`.
+ ### 1.1 Khái quát (SPA Architecture)
- - **Backend (Serverless API)**: Sử dụng Google Apps Script (GAS) làm nền tảng xử lý dữ liệu và lưu trữ vào Google Drive / Sheets.
+ Ứng dụng được xây dựng theo mô hình **Single Page Application (SPA)**:
- - **Micro-database**: Google Sheets.
+ - **Frontend (Deploy Vercel)**: Xây dựng bằng Thuần HTML, CSS (Bootstrap 5), JS (ES6+ jQuery) ở mục `netlify-app/`.
- 
+ - **Backend (Serverless API)**: Sử dụng Google Apps Script (GAS) làm nền tảng xử lý dữ liệu và lưu trữ vào Google Drive / Sheets.
- ### 1.2 Giao tiếp Dữ liệu (Networking & Protocol)
+ - **Micro-database**: Google Sheets (2 bảng: `DATA` + `STAFFS`).
- - Tương tác qua **chuẩn REST-like API (doPost)** trả về JSON từ GAS.
+ - **URL Production**: [qtd-ebanking.vercel.app](https://qtd-ebanking.vercel.app/)
- - Frontend sử dụng hàm Wrapper API tự tạo (`runAPI`) với cơ chế:
+ 
-   - Timeout: `35000` ms (35s) cho thao tác phức tạp như Base64 Upload Ảnh.
+ ### 1.2 Giao tiếp Dữ liệu (Networking & Protocol)
-   - AbortController giúp ngắt tiến trình nếu sập mạng.
+ - Tương tác qua **chuẩn REST-like API (doPost)** trả về JSON từ GAS.
-   - Chống SPAM: Tự khóa nút bấm (`disabled`), hiện Overlay Spinner ngay khi Request bắn đi.
+ - Frontend sử dụng hàm Wrapper API tự tạo (`runAPI`) trong `js/api.js` với cơ chế:
- 
+   - Timeout: `35000` ms (35s) cho thao tác phức tạp như Base64 Upload Ảnh.
- ---
+   - AbortController giúp
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [# Kiến Trúc Hệ Thống: Ebanking Quỹ TDND Yên Thọ]
- **[what-changed] 🟢 Edited KIEN_TRUC_HE_THONG.md (5 changes, 16min)**: Active editing session on KIEN_TRUC_HE_THONG.md.
5 content changes over 16 minutes.
- **[problem-fix] Fixed null crash in CCCD — cleans up event listeners to prevent memory leaks**: - 
+         $('#edit_mat_khau').val(row['Mật khẩu'] || '');
-         if (AppState.user && AppState.user.role === 'Admin') {
+         
-             $('#btnSaveEdit').hide();
+         // Khởi tạo trạng thái kích hoạt
-             $('#frmEditCustomer input').prop('readonly', true);
+         var isActivated = (row['Trạng thái'] === 'Đã kích hoạt');
-             var fp = document.getElementById('edit_ngay_mo')._flatpickr;
+         $('#edit_is_activated').prop('checked', isActivated);
-             if(fp) {
+         
-                 var fpWrapper = fp.input.nextSibling;
+         // Hiện trường CCCD
-                 if(fpWrapper) fpWrapper.disabled = true;
+         var cccdVal = (row['Số CCCD'] || '').toString().replace(/^'/, '');
-                 fp.input.disabled = true;
+         var dkkdVal = (row['Số DKKD'] || '').toString().replace(/^'/, '');
-             }
+         var loaiHinh = row['Loại hình dịch vụ'] || 'Cá nhân';
-         } else {
+         
-             $('#btnSaveEdit').show();
+         if ($('#edit_cccd').length) $('#edit_cccd').val(cccdVal);
-             $('#frmEditCustomer input').prop('readonly', false);
+         if ($('#edit_dkkd').length) $('#edit_dkkd').val(dkkdVal);
-             $('#edit_id').prop('readonly', true); // Keep ID readonly
+         
-             var fp2 = document.getElementById('edit_ngay_mo')._flatpickr;
+         // Hiện trường DKKD nếu là Hộ kinh doanh
-             if(fp2) {
+         if (loaiHinh === 'Hộ kinh doanh') {
-                 var fpWrapper2 = fp2.input.nextSibling;
+             $('#edit_dkkd_group, #edit_login_group, #edit_pass_group').show();
-                 if(fpWrapper2) fpWrapper2.disabled = false;
+         } else {
-                 fp2.input.disabled = false;
+             $('#edit_dkkd_group, #edit_login_group, #edit_pass_group').hide();
-             }
+         }
-         }
+ 
- 
+         if (AppState.user && AppState.user.role === 'Admin') {
- 
+             $('#btnSaveEdit').hide
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [script]
- **[what-changed] Replaced auth Admin — adds runtime type validation before use**: -                         <div id="edit_status_alert" class="alert alert-warning d-none py-2 mb-3 small shadow-sm">
+                         <div id="edit_status_alert" class="alert alert-warning d-none py-2 mb-3 small shadow-sm" style="display:none !important;">
-                         <h6 class="fw-bold text-secondary mt-4 mb-3 border-bottom pb-2">Chứng từ đính kèm</h6>
+         <!-- Thêm trường ẩn cho Admin view -->
-                         <div class="row g-3" id="edit_images_container"></div>
+                         <div class="col-md-12 mt-3" id="edit_activate_group">
-                         <div class="mt-4 text-end">
+                             <div class="form-check form-switch d-flex align-items-center gap-3 p-3 bg-white rounded-3 border shadow-sm">
-                             <button type="button" class="btn btn-secondary px-4 me-2 rounded-pill" data-bs-dismiss="modal">Đóng</button>
+                                 <input class="form-check-input" type="checkbox" id="edit_is_activated" role="switch" style="width:3rem;height:1.5rem;">
-                             <button type="submit" class="btn btn-success px-4 rounded-pill shadow-sm" id="btnSaveEdit">Lưu thay đổi</button>
+                                 <label class="form-check-label fw-bold text-dark" for="edit_is_activated">
-                         </div>
+                                     <i class='bx bx-power-off text-success'></i> KÍCH HOẠT HỒ SƠ
-                     </form>
+                                 </label>
-                 </div>
+                             </div>
-             </div>
+                         </div>
-         </div>
+                         <div class="col-md-6 initially-hidden" id="edit_login_group">
-     </div>
+                             <label class="form-label fw-semibold">Tên đăng nhập</label>
- 
+                             <input type="text" class="form-control" id="edit_ten_dang_nhap" placeholder="Tên đăng nhập">
-     <!-- Modal Xe
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Updated schema Vercel**: - - [ ] Cập nhật URL API mới nhất vào `api.js` (Vercel/Netlify)
+ - [x] Cập nhật URL API mới nhất vào `api.js` (Vercel/Netlify)
- - [ ] Sửa Frontend: Kiểm trùng ngay khi nhập (onblur) + Gửi kèm Loại hình
+ - [x] Sửa Frontend: Kiểm trùng ngay khi nhập (onblur) + Gửi kèm Loại hình
- - [ ] Sửa Backend: `api_validateDuplicate` lọc theo Loại hình
+ - [x] Sửa Backend: `api_validateDuplicate` lọc theo Loại hình
- - [ ] Đồng bộ 18 cột dữ liệu trong `api_submitAccountForm`
+ - [x] Đồng bộ 18 cột dữ liệu trong `api_submitAccountForm`
- - [ ] Đồng bộ 18 cột dữ liệu trong `api_updateMyCustomer` 
+ - [x] Đồng bộ 18 cột dữ liệu trong `api_updateMyCustomer` 
- - [ ] Cập nhật `KIEN_TRUC_HE_THONG.md`
+ - [x] Cập nhật `KIEN_TRUC_HE_THONG.md`
- - [ ] Đẩy code lên GAS và kiểm tra toàn diện
+ - [x] Đẩy code lên GAS và kiểm tra toàn diện

📌 IDE AST Context: Modified symbols likely include [# TIẾN ĐỘ THỰC HIỆN]
- **[problem-fix] Patched security issue String — adds runtime type validation before use**: -   
+   else if (field === "so_tk") colName = "Số TK";
-   if (!colName) return { isDup: false };
+   
-   
+   if (!colName) return { isDup: false };
-   // Tìm kiếm theo cả cột giá trị và loại hình dịch vụ
+   
-   const found = data.find(row => 
+   // LUÔN LUÔN lọc theo Loại hình dịch vụ
-     (row[colName] == value || row[colName] == "'" + value) && 
+   const found = data.find(row => 
-     row["Loại hình dịch vụ"] === loaiHinh
+     (String(row[colName]).replace(/^'/, '') === String(value).replace(/^'/, '')) && 
-   );
+     String(row["Loại hình dịch vụ"]) === String(loaiHinh)
-   
+   );
-   if (found) {
+   
-     return { 
+   if (found) {
-       isDup: true, 
+     return { 
-       msg: `Cảnh báo: ${colName} [${value}] đã tồn tại cho loại hình [${loaiHinh}] (Khách hàng: ${found["Tên khách hàng"]}).` 
+       isDup: true, 
-     };
+       msg: `Cảnh báo: ${colName} [${value}] đã tồn tại trong danh sách [${loaiHinh}]. (Khách hàng: ${found["Tên khách hàng"]})` 
-   }
+     };
-   return { isDup: false };
+   }
- }
+   return { isDup: false };
- 
+ }
- /**
+ 
-  * Xử lý Submit Form mở tài khoản (API chính)
+ /**
-  */
+  * Xử lý Submit Form mở tài khoản (API chính)
- function api_submitAccountForm(formData) {
+  */
-   try {
+ function api_submitAccountForm(formData) {
-     // 0. Server-side Validation Mới (Security Hardening)
+   try {
-     // Tên khách hàng: Chuyển hoa, xóa khoảng trắng thừa, xóa mã độc HTML
+     // 0. Server-side Validation Mới (Security Hardening)
-     formData.ten_kh = (formData.ten_kh || "").replace(/<[^>]*>?/gm, '').trim().toUpperCase();
+     // Tên khách hàng: Chuyển hoa, xóa khoảng trắng thừa, xóa mã độc HTML
-     
+     formData.ten_kh = (formData.ten_kh || "").replace(/<[^>]*>?/gm, '').trim().toUpperCase();
-     // Validate CCCD: Phải đúng 12 số nếu có nhập
+     
-     if (formData.cccd) {
+     // Validate CCCD: Phải đúng 12 số nếu có nhập
-       formData.cccd = formData.cccd.trim();
+     if (formData.cccd) {
-     
… [diff truncated]
- **[what-changed] Updated column database schema**: - # TASK LOG — Ebanking QTD Yên Thọ
+ # TIẾN ĐỘ THỰC HIỆN
- > Lần cập nhật cuối: 2026-03-31 | Phiên bản: v2.1.8
+ 
- 
+ - [ ] Cập nhật URL API mới nhất vào `api.js` (Vercel/Netlify)
- ---
+ - [ ] Sửa Frontend: Kiểm trùng ngay khi nhập (onblur) + Gửi kèm Loại hình
- 
+ - [ ] Sửa Backend: `api_validateDuplicate` lọc theo Loại hình
- ## ✅ ĐÃ HOÀN THÀNH
+ - [ ] Đồng bộ 18 cột dữ liệu trong `api_submitAccountForm`
- 
+ - [ ] Đồng bộ 18 cột dữ liệu trong `api_updateMyCustomer` 
- ### [BUG-001] Dashboard Admin: Cá nhân/Hộ KD hiển thị số 0
+ - [ ] Cập nhật `KIEN_TRUC_HE_THONG.md`
- - **Nguyên nhân:** `renderAdminStats()` trong `dashboard.js` dùng sai ID HTML: `#db-ca-nhan`, `#db-hkd-count` — nhưng HTML thực tế có `id="db-canhan"` và `id="db-hkd"` (không có dấu gạch giữa).
+ - [ ] Đẩy code lên GAS và kiểm tra toàn diện
- - **Fix:** Sửa lại IDs + thêm cập nhật progress bar (`#db-prog-canhan`, `#db-prog-hkd`).
+ 
- - **File:** `netlify-app/js/dashboard.js` — hàm `renderAdminStats()`
- - **Commit:** `f265b2a` – "Fix Admin Readonly permission, Dashboard table column rendering..."
- - **Đã verify:** ✅ Admin Dashboard hiển thị đúng: Tổng 153, KH 75, CKH 78, CN 116, HKD 37
- 
- ---
- 
- ### [BUG-002] Bảng Lịch Sử Mở Mới (Admin): Cột "Số Tài Khoản" trống
- - **Nguyên nhân:** `renderAdminTable()` dùng `d['Số tài khoản']` nhưng GAS trả về field là `d['Số TK']` theo header thực tế trong Google Sheets.
- - **Fix:** Sửa thành `d['Số TK'] || d['Số tài khoản'] || ''` để fallback an toàn.
- - **File:** `netlify-app/js/dashboard.js` — hàm `renderAdminTable()`
- - **Commit:** `f265b2a`
- - **Đã verify:** ✅ Cột Số Tài Khoản hiển thị đầy đủ (VD: `3800200287895453`)
- 
- ---
- 
- ### [BUG-003] Dashboard Admin: Đã Kích Hoạt / Chưa Kích Hoạt = 0
- - **Nguyên nhân:** GAS backend phiên bản cũ (chưa được re-deploy) không có trường `activated` và `inactive` trong `statsPayload`. Frontend nhận được `undefined || 0 = 0`.
- - **Fix:** Thêm fallback trong `initDashboard()`: nếu `(activated + inactive) < t
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [# TIẾN ĐỘ THỰC HIỆN]
- **[what-changed] Updated schema BACKEND — evolves the database schema to support new requirements**: - # Ignore specific other files
+ # === PHÂN TÁCH GAS BACKEND vs NETLIFY FRONTEND ===
- .git/**
+ # Các file .js dưới đây là FRONTEND (Netlify) — KHÔNG push lên GAS
- node_modules/**
+ # GAS chỉ dùng file .gs — jQuery ($) không tồn tại trong GAS server context
- README.md
+ app.js
- MIGRATION_PLAN.md
+ 
- DANHGIA.md
+ # Ignore binary and style files (GAS không dùng)
- KINH_NGHIEM.md
+ style.css
- task.md
+ logo.png
- implementation_plan.md
+ *.png
- walkthrough.md
+ *.jpg
- netlify.toml
+ *.jpeg
- vercel.json
+ 
- .agent/**
+ # Ignore tài liệu và config Netlify/Vercel
- .agent-mem/**
+ .git/**
- .agents/**
+ node_modules/**
- .brainsync/**
+ README.md
- .cursor/**
+ MIGRATION_PLAN.md
- .vscode/**
+ DANHGIA.md
- .windsurfrules
+ KINH_NGHIEM.md
- AGENT.md
+ KINHNGHIEM.md
- CLAUDE.md
+ BAOCAO_KIEMTRA_TOANDIEN.md
- MOTA.md
+ task.md
- TIENDO.md
+ TASK.md
- NOTES.md
+ KIEN_TRUC_HE_THONG.md
- DE_AN_HOAN_THIEN.md
+ implementation_plan.md
- DANHGIA.md
+ walkthrough.md
- KINH_NGHIEM.md
+ netlify.toml
- MIGRATION_PLAN.md
+ vercel.json
- 
+ .agent/**
+ .agent-mem/**
+ .agents/**
+ .brainsync/**
+ .cursor/**
+ .vscode/**
+ .vercel/**
+ .windsurfrules
+ AGENT.md
+ CLAUDE.md
+ MOTA.md
+ TIENDO.md
+ NOTES.md
+ DE_AN_HOAN_THIEN.md
+ 
- **[what-changed] Added session cookies authentication**: -     user: JSON.parse(localStorage.getItem('HOKINHDOANH_SESSION')) || null,
+     user: (typeof localStorage !== 'undefined') ? (JSON.parse(localStorage.getItem('HOKINHDOANH_SESSION')) || null) : null,

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[what-changed] what-changed in api_admin.gs**: -     let inactiveCount   = data.filter(d => d["Trạng thái"] === "Chưa kích hoạt" || d["Trạng thái"] === "Chưa hoàn thành").length;
+     let inactiveCount   = data.filter(d => d["Trạng thái"] !== "Đã kích hoạt").length;
- **[convention] Patched security issue Staff — prevents XSS injection attacks — confirmed 3x**: -         // Bỏ hoàn toàn việc khóa sửa. Mọi User (Staff/Admin) đều có thể sửa hồ sơ.
+         // Phân quyền: Mật khẩu và chỉnh sửa chỉ khả dụng cho Staff
-         $('#btnSaveEdit').show();
+         if (AppState.user && AppState.user.role === 'Admin') {
-         $('#frmEditCustomer input').prop('readonly', false);
+             $('#btnSaveEdit').hide();
-         $('.modal-title').html(`<i class='bx bxs-edit-alt text-white'></i> Chi tiết & Chỉnh sửa hồ sơ`);
+             $('#frmEditCustomer input').prop('readonly', true);
-         
+             $('#frmEditCustomer select, #frmEditCustomer input[type="checkbox"]').prop('disabled', true);
-         if (status === 'Đã kích hoạt') {
+             $('.modal-title').html(`<i class='bx bx-info-circle text-white'></i> Chi tiết hồ sơ khách hàng`);
-             $('.modal-title').append(` <span class="badge bg-success small"><i class="bx bxs-check-circle"></i> Đã kích hoạt</span>`);
+         } else {
-         } else {
+             $('#btnSaveEdit').show();
-             $('.modal-title').append(` <span class="badge bg-warning text-dark small"><i class="bx bx-time"></i> Chờ kích hoạt</span>`);
+             $('#frmEditCustomer input').prop('readonly', false);
-         }
+             $('#frmEditCustomer select, #frmEditCustomer input[type="checkbox"]').prop('disabled', false);
- 
+             $('.modal-title').html(`<i class='bx bxs-edit-alt text-white'></i> Chi tiết & Chỉnh sửa hồ sơ`);
-         const infoHtml = `<div class="col-12 mb-2">
+         }
-                             <div class="p-2 bg-white rounded border d-flex gap-2 shadow-sm align-items-center">
+ 
-                                 <span class="badge bg-primary">${utils_escapeHTML(loaiHinh)}</span>
+         if (status === 'Đã kích hoạt') {
-                                 <span>CCCD: <b>${utils_escapeHTML(cccdVal)}</b></span>
+             $('.modal-title').append(` <span class="badge bg-success small"><i class="bx bxs-check-circle"></i> Đã kíc
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[what-changed] 🟢 Edited api_admin.gs (6 changes, 124min)**: Active editing session on api_admin.gs.
6 content changes over 124 minutes.
- **[convention] Updated 1 database schema — confirmed 3x**: -     
+ 
-     // Giữ nguyên trạng thái hiện tại hoặc cập nhật theo tính toán mới (không dùng Đã xác minh tự động)
+     // Batch Update 1 row using setValues
-     const row = data[rowIndex];
+     sheet.getRange(rowIndex + 1, 1, 1, data[rowIndex].length).setValues([data[rowIndex]]);
-     const haveId    = !!(row[colLh] === "Cá nhân" ? row[colCccd] : row[colDkkd]);
+     SpreadsheetApp.flush(); 
-     const haveSdt   = !!(row[colSdt]);
+ 
-     const haveTk    = !!(row[colSoTk] && row[colSoTk].toString().length >= 9);
+     return { 
-     const haveImg   = !!(row[colImg]);
+       status: "success", 
-     const newStatus = (haveId && haveSdt && haveTk && haveImg) ? "Chờ duyệt" : "Chưa hoàn thành";
+       message: "Cập nhật thành công!"
-     data[rowIndex][colTrangThai] = newStatus;
+     };
-     // Batch Update 1 row using setValues
+   } catch (e) {
-     sheet.getRange(rowIndex + 1, 1, 1, data[rowIndex].length).setValues([data[rowIndex]]);
+     return { status: "error", message: "Lỗi Server Update: " + e.message };
-     SpreadsheetApp.flush(); 
+   } finally {
- 
+     lock.releaseLock();
-     return { 
+   }
-       status: "success", 
+ }
-       message: newStatus === "Chờ duyệt" ? "Cập nhật thành công! Hồ sơ đang ở trạng thái Chờ duyệt." : "Đã lưu điều chỉnh. Hồ sơ vẫn ở trạng thái Chưa hoàn thành." 
+ 
-     };
+ 
- 
-   } catch (e) {
-     return { status: "error", message: "Lỗi Server Update: " + e.message };
-   } finally {
-     lock.releaseLock();
-   }
- }
- 
- 
- **[convention] Fixed null crash in JSON — externalizes configuration for environment flexibi... — confirmed 5x**: -       pending: pendingAccounts,
+       activated: activatedCount,
-       approved: approvedAccounts,
+       inactive: inactiveCount,
-       activated: activatedCount,
+       caNhan: caNhanCount,
-       inactive: inactiveCount,
+       hkd: hkdCount,
-       caNhan: caNhanAccounts,
+       loaiHinh: loaiHinhCount,
-       hkd: hkdAccounts,
+       allStaffs: allStaffStats,
-       loaiHinh: loaiHinhCount,
+       topStaffs: topStaffs,
-       allStaffs: allStaffStats,
+       timelineDate: timelineByDate,
-       topStaffs: topStaffs,
+       typeMonth: typeByMonth,
-       timelineDate: timelineByDate,
+       allData: data 
-       typeMonth: typeByMonth,
+     };
-       allData: data 
+ 
-     };
+     return {
- 
+       status: "success",
-     return {
+       statsStr: JSON.stringify(statsPayload) // Serialize thủ công để tránh lỗi mất object của GAS
-       status: "success",
+     };
-       statsStr: JSON.stringify(statsPayload) // Serialize thủ công để tránh lỗi mất object của GAS
+ 
-     };
+   } catch (e) {
- 
+     return { status: "error", message: "Lỗi lấy dữ liệu Admin: " + e.message };
-   } catch (e) {
+   }
-     return { status: "error", message: "Lỗi lấy dữ liệu Admin: " + e.message };
+ }
-   }
+ 
- }
+ /**
- 
+  * Xóa hồ sơ hoặc đổi trạng thái (chỉ Admin)
- /**
+  * Cần truyền đối tượng {id, newStatus}
-  * Xóa hồ sơ hoặc đổi trạng thái (chỉ Admin)
+  */
-  * Cần truyền đối tượng {id, newStatus}
+ function api_adminUpdateStatus(id, newStatus) {
-  */
+   const lock = LockService.getScriptLock();
- function api_adminUpdateStatus(id, newStatus) {
+   try {
-   const lock = LockService.getScriptLock();
+     lock.waitLock(10000);
-   try {
+     const sheet = getSheetByName(CONFIG.SHEET_DATA);
-     lock.waitLock(10000);
+     const data = sheet.getDataRange().getValues();
-     const sheet = getSheetByName(CONFIG.SHEET_DATA);
+     const header = data[0];
-     const data = sheet.getDataRange().getValues();
+     
-     const header = 
… [diff truncated]
