> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `vercel.json` (Domain: **Config/Infrastructure**)

### 📐 Config/Infrastructure Conventions & Fixes
- **[what-changed] Updated schema Ignore — evolves the database schema to support new requirements**: - # Ignore all files in the netlify-poc folder
+ # Ignore all files in the netlify-poc and netlify-app folders
- # Ignore specific other files
+ netlify-app/**
- .git/**
+ 
- node_modules/**
+ # Ignore specific other files
- README.md
+ .git/**
- MIGRATION_PLAN.md
+ node_modules/**
- DANHGIA.md
+ README.md
- KINH_NGHIEM.md
+ MIGRATION_PLAN.md
- task.md
+ DANHGIA.md
- implementation_plan.md
+ KINH_NGHIEM.md
- walkthrough.md
+ task.md
- 
+ implementation_plan.md
+ walkthrough.md
+ 
- **[convention] Fixed null crash in HtmlService — confirmed 3x**: -   try {
+   return HtmlService.createTemplateFromFile('index')
-     var template = HtmlService.createTemplateFromFile('index').evaluate();
+     .evaluate()
-     return template
+     .setTitle('Hệ thống Quản lý Chỉ tiêu Mở tài khoản - Yên Thọ')
-       .setTitle('Hệ thống Quản lý Mở Tài khoản - Yên Thọ')
+     .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
-       .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
+     .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
-       .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
+ }
-   } catch (e) {
+ 
-     Logger.log("doGet Error: " + e.message);
+ function include(filename) {
-     return HtmlService.createHtmlOutput("⚠️ LỖI HỆ THỐNG: " + e.message);
+   return HtmlService.createHtmlOutputFromFile(filename).getContent();
-   }
+ }
- }
+ 
- 
+ /** 
- function doPost(e) {
+  * API ROUTER cho Netlify (Bản PoC)
-   var result = { status: "error", message: "Unknown error" };
+  * Hỗ trợ các yêu cầu Fetch từ bên ngoài
-   try {
+  */
-     // 1. Phân giải payload từ Netlify (luôn gửi dạng JSON string)
+ function doPost(e) {
-     var postData = JSON.parse(e.postData.contents);
+   var result = { status: "error", message: "Unknown error" };
-     var action = postData.action;
+   try {
-     var data = postData.data || {};
+     var postData = JSON.parse(e.postData.contents);
- 
+     var action = postData.action;
-     // 2. Định tuyến API (API Routing)
+     var data = postData.data || {};
-     if (action === "api_getMyCustomers") {
+ 
-       result = api_getMyCustomers(data);
+     if (action === "api_getMyCustomers") {
-     } 
+       result = api_getMyCustomers(data);
-     else if (action === "api_getAdminDashboardData") {
+     } 
-        result = api_getAdminDashboardData(); // Hàm này không cần tham số
+     else if (action === "api_getAdminDashboardData") {
-     }
+        result = api_getAdminDashboardData(
… [diff truncated]
- **[what-changed] Replaced auth CHUY — externalizes configuration for environment flexibility**: - Lỗi Nghiêm Trọng (Critical Bugs)
+ # ĐÁNH GIÁ CHUYÊN SÂU & TỔNG KẾT HỆ THỐNG
- 1. Memory Leak — OpenCV Mat không được giải phóng đúng cách
+ ## Quản Lý Quỹ Tín Dụng Nhân Dân Yên Thọ - Hộ Kinh Doanh
- Trong processImageWithAI, nếu maxContour là null nhưng code vẫn gọi maxContour.delete() → crash. Ngược lại, nếu flow rẽ nhánh sớm (throw), các Mat trung gian sẽ không được dọn.
+ 
- javascript// ❌ HIỆN TẠI: Không có finally block, leak khi throw
+ **Chuyên gia hệ thống:** Antigravity AI  
- } catch(e) {
+ **Cập nhật lần cuối:** 27/03/2026  
-     console.error("OpenCV processing error:", e);
+ **Trạng thái dự án:** Sản xuất (Production-Ready)
-     resolve(source); // Các Mat src, dst, contours... vẫn còn trong memory
+ 
- }
+ ---
- // ✅ ĐỀ XUẤT: Dùng try/finally để đảm bảo cleanup
+ ### 1. KIẾN TRÚC TỔNG QUAN (ARCHITECTURE)
- async function processImageWithAI(source) {
+ Hệ thống vận hành bằng kiến trúc **Serverless Single Page Application (SPA)** hoàn toàn trên hạ tầng Google:
-     return new Promise((resolve, reject) => {
+ - **Ngôn ngữ cốt lõi:** Google Apps Script (ES6+ Backend), HTML/CSS/JS thuần (ES5/ES6 Frontend).
-         if (!isCvReady || !window.cv) return resolve(source);
+ - **Cơ sở dữ liệu:** Google Sheets (Hoạt động như một NoSQL Document Store).
-         
+ - **Lưu trữ tệp:** Google Drive API.
-         const img = new Image();
+ - **Micro-libraries:** Sự kết hợp hoàn hảo của Bootstrap 5 (Giao diện lưới), DataTables (Xử lý bảng khối lượng lớn), Chart.js (Dashboard), OpenCV.js (Xử lý ảnh bằng AI client-side), Flatpickr (Lịch), SweetAlert2 (Thông báo).
-         img.onload = function() {
+ 
-             let src = null, dst = null, contours = null, 
+ ---
-                 hierarchy = null, maxContour = null;
+ 
-             try {
+ ### 2. ĐÁNH GIÁ KỸ THUẬT (TECHNICAL AUDIT)
-                 src = cv.imread(img);
+ 
-                 dst = new cv.Mat();
+ #### A. Kiến trúc Bảo Mật (Security Architecture)
-                 // ... xử lý ...
+ - **Hash
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [# ĐÁNH GIÁ CHUYÊN SÂU & TỔNG KẾT HỆ THỐNG]
- **[convention] 🟢 Edited frmDashboard.html (8 changes, 11min) — confirmed 3x**: Active editing session on frmDashboard.html.
8 content changes over 11 minutes.
- **[convention] Fixed null crash in JSON — wraps unsafe operation in error boundary — confirmed 6x**: -                 AppCache.set('adminData', res.stats);
+                 try { res.stats = JSON.parse(res.statsStr); } catch(e) { console.error("Parse stats err", e); }
-                 adminRawData = res.stats.allStaffs || [];
+                 AppCache.set('adminData', res.stats);
-                 renderDashboard(res.stats);
+                 adminRawData = res.stats.allStaffs || [];
-             }
+                 renderDashboard(res.stats);
-         }, null, 'Đang tải dữ liệu...');
+             }
-     }
+         }, null, 'Đang tải dữ liệu...');
- 
+     }
-     function loadAdminDataSilent() {
+ 
-         var btn = $('#btnRefreshAdmin');
+     function loadAdminDataSilent() {
-         var old = btn.html();
+         var btn = $('#btnRefreshAdmin');
-         btn.prop('disabled', true).html('<i class="bx bx-loader-circle bx-spin"></i> Loading...');
+         var old = btn.html();
-         runAPI('api_getAdminDashboardData', [], function(res) {
+         btn.prop('disabled', true).html('<i class="bx bx-loader-circle bx-spin"></i> Loading...');
-             btn.prop('disabled', false).html(old);
+         runAPI('api_getAdminDashboardData', [], function(res) {
-             if(res.status === 'success') {
+             btn.prop('disabled', false).html(old);
-                 AppCache.set('adminData', res.stats);
+             if(res.status === 'success') {
-                 adminRawData = res.stats.allStaffs || [];
+                 try { res.stats = JSON.parse(res.statsStr); } catch(e) { console.error("Parse stats err", e); }
-                 renderDashboard(res.stats);
+                 AppCache.set('adminData', res.stats);
-             }
+                 adminRawData = res.stats.allStaffs || [];
-         }, function() { btn.prop('disabled', false).html(old); }, null);
+                 renderDashboard(res.stats);
-     }
+             }
- 
+         }, function() { btn.prop('disabled', false).html(old); }, null);
-     function renderDashboard(s)
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [div.d-flex.justify-content-between.align-items-center.mb-4.flex-wrap.gap-2, div.row.g-3.mb-4, div.row.g-4.mb-4, div.row.g-4, script]
- **[what-changed] Replaced auth START**: - <!-- START: Admin Dashboard -->
+ 
- <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
-     <div>
-         <h4 class="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
-             <i class='bx bxs-dashboard text-accent'></i> Bảng Điều Khiển Quản Trị
-         </h4>
-         <p class="text-muted mb-0 small">Theo dõi tiến độ KPIs toàn hệ thống theo thời gian thực.</p>
-     </div>
-     <div class="d-flex gap-2">
-         <button class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 shadow-sm px-3" onclick="openChangePasswordModal()">
-             <i class='bx bx-lock-open-alt fs-5'></i> <span class="d-none d-sm-inline fw-semibold">Đổi Pass</span>
-         </button>
-         <button id="btnRefreshAdmin" class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 shadow-sm px-3" onclick="loadAdminDataSilent()">
-             <i class='bx bx-refresh fs-5'></i> <span class="d-none d-sm-inline fw-semibold">Làm mới Data</span>
-         </button>
-         <button class="btn btn-danger btn-sm d-flex align-items-center gap-1 shadow-sm" onclick="logout()">
-             <i class='bx bx-log-out fs-5'></i> <span class="d-none d-sm-inline">Thoát</span>
-         </button>
-     </div>
- </div>
- 
- <!-- Thống kê KPIs -->
- <div class="row g-3 mb-4">
-     <div class="col-12 col-sm-6 col-xl-3">
-         <div class="glass-card p-3 border-start border-primary border-4 h-100 d-flex flex-column justify-content-center">
-             <p class="text-muted mb-1 fw-semibold small text-uppercase">TỔNG TÀI KHOẢN</p>
-             <h2 class="fw-bold text-primary mb-0" id="db-total">0</h2>
-             <small class="text-danger mt-1"><i class='bx bx-error-circle'></i> <span id="db-pending">0</span> chưa hoàn thành</small>
-         </div>
-     </div>
-     <div class="col-12 col-sm-6 col-xl-3">
-         <div class="glass-card p-3 border-start border-success border-4 h-100 d-flex flex-column justify-conte
… [diff truncated]
- **[what-changed] Replaced auth START**: - <!-- START: Admin Dashboard -->
+ 
- <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
-     <div>
-         <h4 class="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
-             <i class='bx bxs-dashboard text-accent'></i> Bảng Điều Khiển Quản Trị
-         </h4>
-         <p class="text-muted mb-0 small">Theo dõi tiến độ KPIs toàn hệ thống theo thời gian thực.</p>
-     </div>
-     <div class="d-flex gap-2">
-         <button class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 shadow-sm px-3" onclick="openChangePasswordModal()">
-             <i class='bx bx-lock-open-alt fs-5'></i> <span class="d-none d-sm-inline fw-semibold">Đổi Pass</span>
-         </button>
-         <button id="btnRefreshAdmin" class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 shadow-sm px-3" onclick="loadAdminDataSilent()">
-             <i class='bx bx-refresh fs-5'></i> <span class="d-none d-sm-inline fw-semibold">Làm mới Data</span>
-         </button>
-         <button class="btn btn-danger btn-sm d-flex align-items-center gap-1 shadow-sm" onclick="logout()">
-             <i class='bx bx-log-out fs-5'></i> <span class="d-none d-sm-inline">Thoát</span>
-         </button>
-     </div>
- </div>
- 
- <!-- Thống kê KPIs -->
- <div class="row g-3 mb-4">
-     <div class="col-12 col-sm-6 col-xl-3">
-         <div class="glass-card p-3 border-start border-primary border-4 h-100 d-flex flex-column justify-content-center">
-             <p class="text-muted mb-1 fw-semibold small text-uppercase">TỔNG TÀI KHOẢN</p>
-             <h2 class="fw-bold text-primary mb-0" id="db-total">0</h2>
-             <small class="text-danger mt-1"><i class='bx bx-error-circle'></i> <span id="db-pending">0</span> chưa hoàn thành</small>
-         </div>
-     </div>
-     <div class="col-12 col-sm-6 col-xl-3">
-         <div class="glass-card p-3 border-start border-success border-4 h-100 d-flex flex-column justify-conte
… [diff truncated]
- **[convention] what-changed in frmDashboard.html — confirmed 3x**: File updated (external): frmDashboard.html

Content summary (485 lines):
<!-- START: Admin Dashboard -->
<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
    <div>
        <h4 class="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
            <i class='bx bxs-dashboard text-accent'></i> Bảng Điều Khiển Quản Trị
        </h4>
        <p class="text-muted mb-0 small">Theo dõi tiến độ KPIs toàn hệ thống theo thời gian thực.</p>
    </div>
    <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary btn-s
- **[decision] decision in frmDashboard.html**: -                 var dkkd = (d['Số ĐKKD'] || d['Số GP ĐKKD'] || '').toString().replace(/^'/, '');
+                 var dkkd = (d['Số DKKD'] || d['Số ĐKKD'] || d['Số GP ĐKKD'] || '').toString().replace(/^'/, '');
-             if ($('#filterStaffAdmin option').length <= 1) {
+             // Xây dựng dropdown lọc Người dùng từ dữ liệu thực tế (luôn reset thường xuyên)
-                 var staffSet = [];
+             $('#filterStaffAdmin').find('option:not(:first)').remove();
-                 (s.allData || []).forEach(function(d){
+             var staffSet = [];
-                     var email = d['Cán bộ thực hiện'];
+             (s.allData || []).forEach(function(d){
-                     if(email && staffSet.indexOf(email) === -1) staffSet.push(email);
+                 var email = d['Cán bộ thực hiện'];
-                 });
+                 if(email && staffSet.indexOf(email) === -1) staffSet.push(email);
-                 staffSet.forEach(function(email){
+             });
-                     $('#filterStaffAdmin').append('<option value="' + email + '">' + (staffMap[email] || email) + '</option>');
+             staffSet.forEach(function(email){
-                 });
+                 $('#filterStaffAdmin').append('<option value="' + email + '">' + (staffMap[email] || email) + '</option>');
-             }
+             });

📌 IDE AST Context: Modified symbols likely include [div.d-flex.justify-content-between.align-items-center.mb-4.flex-wrap.gap-2, div.row.g-3.mb-4, div.row.g-4.mb-4, div.row.g-4, script]
- **[what-changed] 🟢 Edited frmMoTaiKhoan.html (5 changes, 11min)**: Active editing session on frmMoTaiKhoan.html.
5 content changes over 11 minutes.
- **[what-changed] Updated schema AppCache**: -                             $('.initially-hidden').addClass('initially-hidden').hide();
+                             // ẩn đúng các div điều kiện, KHÔNG ẩn menu #staffBottomNav
-                             AppCache.clear('myCustomers');
+                             $('#div_dkkd, #div_img_dkkd, #div_ten_dang_nhap').hide();
-                             initMyCustomersList();
+                             // Xóa sạch preview ảnh
-                         } else {
+                             ['truoc','sau','dkkd','qr','thuchien'].forEach(function(k) {
-                             showAlert('Lỗi', res.message, 'error');
+                                 $('#preview_img_' + k).find('img').attr('src','');
-                         }
+                                 $('#preview_img_' + k).hide();
-                     })
+                                 var ci = document.getElementById('cam_' + k);
-                     .withFailureHandler(function(err) {
+                                 if (ci) ci.value = '';
-                         btn.prop('disabled', false).html(btnOriginalHtml);
+                             });
-                         progressWrapper.hide();
+                             AppCache.clear('myCustomers');
-                         showAlert('Lỗi Hệ thống', 'Không thể kết nối Server. Vui lòng thử lại.', 'error');
+                             initMyCustomersList();
-                     })
+                         } else {
-                     .api_submitAccountForm(data);
+                             showAlert('Lỗi', res.message, 'error');
-                 return;
+                         }
-             }
+                     })
-             
+                     .withFailureHandler(function(err) {
-             var slot = fileSlots[index];
+                         btn.prop('disabled', false).html(btnOriginalHtml);
-             var inp = document.getElementById(slot.id);
+                         progressWrapper.hide();
-       
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [div.d-flex.justify-content-between.align-items-center.mb-4, div.glass-card.p-3.p-md-4.mb-4, div#cropModal.modal.fade, script]
- **[convention] Fixed null crash in Array — wraps unsafe operation in error boundary — confirmed 5x**: - 
+     }
-     var moTaiKhoan_checkDuplicateRealtime = function(input) {
+ 
-         var val = input.value.trim();
+     var moTaiKhoan_checkDuplicateRealtime = function(input) {
-         if(!val) return;
+         var val = input.value.trim();
-         google.script.run
+         if(!val) return;
-             .withSuccessHandler(function(res) {
+         google.script.run
-                 if(res && res.isDup) {
+             .withSuccessHandler(function(res) {
-                     input.setCustomValidity('Giá trị này đã tồn tại!');
+                 if(res && res.isDup) {
-                     $(input).addClass('is-invalid');
+                     input.setCustomValidity('Giá trị này đã tồn tại!');
-                 } else {
+                     $(input).addClass('is-invalid');
-                     input.setCustomValidity('');
+                 } else {
-                     $(input).removeClass('is-invalid');
+                     input.setCustomValidity('');
-                 }
+                     $(input).removeClass('is-invalid');
-             })
+                 }
-             .api_validateDuplicate(input.id, val);
+             })
-     };
+             .api_validateDuplicate(input.id, val);
- 
+     };
-     function toggleFormFields() {
+ 
-         var loai = $('#loai_hinh').val();
+     function toggleFormFields() {
-         if(loai === 'Hộ kinh doanh') {
+         var loai = $('#loai_hinh').val();
-             $('#div_dkkd').show(300);
+         if(loai === 'Hộ kinh doanh') {
-             $('#div_img_dkkd').show(300);
+             $('#div_dkkd').show(300);
-             $('#div_ten_dang_nhap').show(300);
+             $('#div_img_dkkd').show(300);
-             $('#dkkd').prop('required', true);
+             $('#div_ten_dang_nhap').show(300);
-             $('#img_dkkd').prop('required', true);
+             $('#dkkd').prop('required', true);
-         } else {
+             $('#img_dkkd').prop('required', true);
-             $('#div
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [div.d-flex.justify-content-between.align-items-center.mb-4, div.glass-card.p-3.p-md-4.mb-4, div#cropModal.modal.fade, script]
- **[what-changed] 🟢 Edited Setup.gs (8 changes, 2min)**: Active editing session on Setup.gs.
8 content changes over 2 minutes.
- **[what-changed] what-changed in api_account.gs**: -       trangThai,
+       urlThucHien,  // Ảnh thực hiện mở tài khoản
-       urlThucHien   // Ảnh thực hiện mở tài khoản
+       trangThai
- **[what-changed] 🟢 Edited api_account.gs (11 changes, 2min)**: Active editing session on api_account.gs.
11 content changes over 2 minutes.
