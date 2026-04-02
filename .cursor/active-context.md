> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `api_admin.gs` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[convention] Fixed null crash in Kinh — filters out falsy/null values explicitly — confirmed 3x**: -     data.forEach(d => {
+     });
-       let lh = d["Loại hình dịch vụ"];
+     
-       if(lh) {
+     // Tổng hợp đối tượng (Thành viên / Ngoài thành viên)
-         loaiHinhCount[lh] = (loaiHinhCount[lh] || 0) + 1;
+     let doiTuongCount = {"Thành viên": 0, "Ngoài thành viên": 0};
-       }
+     data.forEach(d => {
-     });
+       let dt = d["Đối tượng"] || "Ngoài thành viên";
- 
+       if (dt === "Thành viên") doiTuongCount["Thành viên"]++;
-     // Thống kê nhân viên xuất sắc — phân loại Cá nhân / Kinh doanh
+       else doiTuongCount["Ngoài thành viên"]++;
-     let staffCount = {};
+     });
-     data.forEach(d => {
+ 
-       let e = d["Cán bộ thực hiện"];
+     // Thống kê nhân viên xuất sắc — phân loại Cá nhân / Kinh doanh
-       let lh = d["Loại hình dịch vụ"];
+     let staffCount = {};
-       if(e) {
+     data.forEach(d => {
-         if (!staffCount[e]) staffCount[e] = { total: 0, caNhan: 0, hkd: 0 };
+       let e = d["Cán bộ thực hiện"];
-         staffCount[e].total++;
+       let lh = d["Loại hình dịch vụ"];
-         if (lh === "Cá nhân") staffCount[e].caNhan++;
+       if(e) {
-         else if (lh === "Hộ kinh doanh") staffCount[e].hkd++;
+         if (!staffCount[e]) staffCount[e] = { total: 0, caNhan: 0, hkd: 0 };
-       }
+         staffCount[e].total++;
-     });
+         if (lh === "Cá nhân") staffCount[e].caNhan++;
- 
+         else if (lh === "Hộ kinh doanh") staffCount[e].hkd++;
-     let allStaffStats = staffs.map(s => {
+       }
-       let email = s["Email"];
+     });
-       let stats = staffCount[email] || { total: 0, caNhan: 0, hkd: 0 };
+ 
-       return {
+     let allStaffStats = staffs.map(s => {
-         email: email,
+       let email = s["Email"];
-         name: s["Họ tên"],
+       let stats = staffCount[email] || { total: 0, caNhan: 0, hkd: 0 };
-         department: s["Bộ phận"] || "",
+       return {
-         total: stats.total,
+         email: email,
-         caNhan: stats.caNhan,
+         name: s
… [diff truncated]
- **[what-changed] what-changed in api_admin.gs**: -     let inactiveCount   = data.filter(d => d["Trạng thái"] === "Chưa kích hoạt" || d["Trạng thái"] === "Chưa hoàn thành").length;
+     let inactiveCount   = data.filter(d => d["Trạng thái"] !== "Đã kích hoạt").length;
- **[what-changed] 🟢 Edited api_admin.gs (6 changes, 124min)**: Active editing session on api_admin.gs.
6 content changes over 124 minutes.
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
- **[convention] Fixed null crash in JSON — externalizes configuration for environment flexibi... — confirmed 3x**: -       caNhan: caNhanAccounts,
+       activated: activatedCount,
-       hkd: hkdAccounts,
+       inactive: inactiveCount,
-       loaiHinh: loaiHinhCount,
+       caNhan: caNhanAccounts,
-       allStaffs: allStaffStats,
+       hkd: hkdAccounts,
-       topStaffs: topStaffs,
+       loaiHinh: loaiHinhCount,
-       timelineDate: timelineByDate,
+       allStaffs: allStaffStats,
-       typeMonth: typeByMonth,
+       topStaffs: topStaffs,
-       allData: data 
+       timelineDate: timelineByDate,
-     };
+       typeMonth: typeByMonth,
- 
+       allData: data 
-     return {
+     };
-       status: "success",
+ 
-       statsStr: JSON.stringify(statsPayload) // Serialize thủ công để tránh lỗi mất object của GAS
+     return {
-     };
+       status: "success",
- 
+       statsStr: JSON.stringify(statsPayload) // Serialize thủ công để tránh lỗi mất object của GAS
-   } catch (e) {
+     };
-     return { status: "error", message: "Lỗi lấy dữ liệu Admin: " + e.message };
+ 
-   }
+   } catch (e) {
- }
+     return { status: "error", message: "Lỗi lấy dữ liệu Admin: " + e.message };
- 
+   }
- /**
+ }
-  * Xóa hồ sơ hoặc đổi trạng thái (chỉ Admin)
+ 
-  * Cần truyền đối tượng {id, newStatus}
+ /**
-  */
+  * Xóa hồ sơ hoặc đổi trạng thái (chỉ Admin)
- function api_adminUpdateStatus(id, newStatus) {
+  * Cần truyền đối tượng {id, newStatus}
-   const lock = LockService.getScriptLock();
+  */
-   try {
+ function api_adminUpdateStatus(id, newStatus) {
-     lock.waitLock(10000);
+   const lock = LockService.getScriptLock();
-     const sheet = getSheetByName(CONFIG.SHEET_DATA);
+   try {
-     const data = sheet.getDataRange().getValues();
+     lock.waitLock(10000);
-     const header = data[0];
+     const sheet = getSheetByName(CONFIG.SHEET_DATA);
-     
+     const data = sheet.getDataRange().getValues();
-     // Ưu tiên cột "ID", sau đó là "Mã GD"
+     const header = data[0];
-     let idIdx = header.indexOf("ID");
+     
-     if (idIdx === -1) idIdx =
… [diff truncated]
- **[what-changed] 🟢 Edited KIEN_TRUC_HE_THONG.md (5 changes, 154min)**: Active editing session on KIEN_TRUC_HE_THONG.md.
5 content changes over 154 minutes.
- **[decision] Optimized Ebanking — hardens HTTP security headers**: - # Kiến Trúc Hệ Thống: Ebanking Quỹ TDND Yên Thọ
+ # Kiến Trúc Hệ Thống: Ebanking Quỹ TDND Yên Thọ
- 
+ 
- > [!IMPORTANT]
+ > [!IMPORTANT]
- > Đây là tài liệu cốt lõi **(Blueprint)** ghi nhận toàn bộ kiến trúc, quy trình CI/CD, cấu trúc CSDL và bảo mật của hệ thống Quản lý Chỉ Tiêu Mở Tài Khoản Ebanking. **Phải đọc trước khi thực hiện bất kỳ thay đổi nào.**
+ > Đây là tài liệu cốt lõi **(Blueprint)** ghi nhận toàn bộ kiến trúc, quy trình CI/CD, cấu trúc CSDL và bảo mật của hệ thống Quản lý Chỉ Tiêu Mở Tài Khoản Ebanking. **Phải đọc trước khi thực hiện bất kỳ thay đổi nào.**
- >
+ >
- > Hệ thống chạy hoàn toàn tự động: **GitHub → Vercel/Netlify (Frontend)** kết nối với **Google Apps Script (Backend API)**.
+ > Hệ thống chạy hoàn toàn tự động: **GitHub → Vercel/Netlify (Frontend)** kết nối với **Google Apps Script (Backend API)**.
- 
+ 
- ---
+ ---
- 
+ 
- ## 1. Kiến Trúc Tổng Quan (Architecture)
+ ## 1. Kiến Trúc Tổng Quan (Architecture)
- 
+ 
- ### 1.1 Mô hình SPA (Single Page Application)
+ ### 1.1 Mô hình SPA (Single Page Application)
- 
+ 
- ```
+ ```
- ┌──────────────────────────────────────────────────────────────┐
+ ┌──────────────────────────────────────────────────────────────┐
- │                    GITHUB REPOSITORY                          │
+ │                    GITHUB REPOSITORY                          │
- │               github.com/ducanht/ebanking                    │
+ │               github.com/ducanht/ebanking                    │
- └──────────────────┬──────────────────────────────┬───────────┘
+ └──────────────────┬──────────────────────────────┬───────────┘
-                    │ git push (auto trigger)        │ git push
+                    │ git push (auto trigger)        │ git push
-                    ▼                               ▼
+                    ▼                               ▼
- ┌──────────────────────────┐      ┌────────────────────────────┐
+ ┌──────────────────────────┐      ┌────────────────────────────
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [# Kiến Trúc Hệ Thống: Ebanking Quỹ TDND Yên Thọ]
- **[what-changed] Updated schema KINH**: + ---
+ 
+ ## 11. BÀI HỌC KINH NGHIỆM & QUY TẮC DỰ ÁN MỚI (SYSTEM RULES)
+ 
+ Nếu khởi tạo một dự án WebApp vận hành theo kiến trúc Serverless (Frontend tự do + Google Apps Script Backend), BẮT BUỘC phải áp dụng bộ quy tắc (RULES) sau đây vào System Prompt cho AI để tránh các lỗi chí mạng đã được giải quyết:
+ 
+ ### 11.1 Giới hạn của Hệ sinh thái Google (GAS)
+ - **LockService chống Race-Condition:** Mọi thao tác GHI/SỬA (Insert/Update) dữ liệu bắt buộc phải bọc trong `LockService.getScriptLock().waitLock(15000)` và kết thúc bằng `SpreadsheetApp.flush()`. Nếu không, nhiều user submit cùng lúc sẽ chép đè dữ liệu lên nhau.
+ - **Micro-database Performance (Batch Ops):** Tuyệt đối cấm dùng vòng lặp thiết lập `.appendRow()` hay `.setValue()`. Mọi thao tác phải đọc nguyên cục mảng 2 chiều bằng `.getValues()`, xử lý trên RAM, sau đó đẩy ngược lại bằng `.setValues()` trong 1 lần gọi API duy nhất.
+ - **Lưu trữ số:** Để Google Sheets không tự format các số điện thoại/số TK làm mất số 0 ở đầu, trước khi ghi phải tự chèn dấu nháy đơn trước chuỗi (Ví dụ: `"'0987654321"`).
+ 
+ ### 11.2 Giao diện và API Call
+ - **Lỗi Bút Toán Kép (Double-click):** 100% các nút "Lưu/Submit" thao tác ghi dữ liệu đều phải bị `.prop('disabled', true)` ngay ở mili-giây đầu tiên khi user click và hiện Spinner (VD: Đang lưu...).
+ - **Giảm tải Payload bằng Native Compression:** Kích thước tải trọng qua AppScript có giới hạn chặt chẽ/thời gian Timeout ngắn. Ảnh trước khi mã hoá Base64 phải chạy qua `browser-image-compression` để ép xuống dưới `1MB`.
+ 
+ ### 11.3 Tương thích Phần Cứng: Camera vs Mobile
+ - **Lỗi Lớp Phủ Màn Hình (Screen Overlay):** Cấm gọi WebRTC (`navigator.mediaDevices.getUserMedia`) trên Mobile Devices, đặc biệt là Android do hệ điều hành hay chặn cấp quyền trình duyệt khi có bong bóng chat.
+ - **Rule Xử Lý Camera:** Viết code lọc theo User-Agent: Nếu `isMobile`, bypass hoàn toàn WebRTC bằng cách dùng `Native Camera Picker`: `<input type="file" capture="environment">`. Laptop/PC 
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [# Kiến Trúc Hệ Thống: Ebanking Quỹ TDND Yên Thọ]
- **[decision] Optimized Blueprint — hardens HTTP security headers**: - > Đây là tài liệu cốt lõi (Blueprint) ghi nhận quy trình, kiến trúc, cấu trúc cơ sở dữ liệu và bảo mật của Ứng dụng Quản lý Khách hàng / Mở tài khoản Ebanking. Tài liệu này cần được trích xuất và tham chiếu trước khi thực hiện bất cứ cập nhật, bảo trì nào.
+ > Đây là tài liệu cốt lõi **(Blueprint)** ghi nhận toàn bộ kiến trúc, quy trình CI/CD, cấu trúc CSDL và bảo mật của hệ thống Quản lý Chỉ Tiêu Mở Tài Khoản Ebanking. **Phải đọc trước khi thực hiện bất kỳ thay đổi nào.**
- > 
+ >
- > Hệ thống được vận hành tự động qua **Vercel (Frontend)** kết nối tới **Google Apps Script (Backend API)**.
+ > Hệ thống chạy hoàn toàn tự động: **GitHub → Vercel/Netlify (Frontend)** kết nối với **Google Apps Script (Backend API)**.
- ### 1.1 Khái quát (SPA Architecture)
+ ### 1.1 Mô hình SPA (Single Page Application)
- Ứng dụng được xây dựng theo mô hình **Single Page Application (SPA)**:
+ 
- - **Frontend (Deploy Vercel)**: Xây dựng bằng Thuần HTML, CSS (Bootstrap 5), JS (ES6+ jQuery) ở mục `netlify-app/`.
+ ```
- - **Backend (Serverless API)**: Sử dụng Google Apps Script (GAS) làm nền tảng xử lý dữ liệu và lưu trữ vào Google Drive / Sheets.
+ ┌──────────────────────────────────────────────────────────────┐
- - **Micro-database**: Google Sheets (2 bảng: `DATA` + `STAFFS`).
+ │                    GITHUB REPOSITORY                          │
- - **URL Production**: [qtd-ebanking.vercel.app](https://qtd-ebanking.vercel.app/)
+ │               github.com/ducanht/ebanking                    │
- 
+ └──────────────────┬──────────────────────────────┬───────────┘
- ### 1.2 Giao tiếp Dữ liệu (Networking & Protocol)
+                    │ git push (auto trigger)        │ git push
- - Tương tác qua **chuẩn REST-like API (doPost)** trả về JSON từ GAS.
+                    ▼                               ▼
- - Frontend sử dụng hàm Wrapper API tự tạo (`runAPI`) trong `js/api.js` với cơ chế:
+ ┌──────────────────────────┐      ┌────────────────────────────┐
-   - Timeout: `35000` ms (35s) cho th
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [# Kiến Trúc Hệ Thống: Ebanking Quỹ TDND Yên Thọ]
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
