> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `app.js` (Domain: **Generic Logic**)

### 🔴 Generic Logic Gotchas
- **⚠️ GOTCHA: Patched security issue VERSION — prevents XSS injection attacks**: -     VERSION: "2.1.1-PATCHED",
+     VERSION: "2.1.2-STABLE",
- 
+ // --- CẤU HÌNH EVENT DELEGATION: XỬ LÝ CLICK XEM CHI TIẾT ---
- /**
+ $(document).on('click', '.clickable-row', function(e) {
-  * CACHE SYSTEM
+     // Nếu click vào nút Chi tiết hoặc thành phần bên trong nút, dừng lại để tránh trigger 2 lần
-  */
+     if ($(e.target).is('button') || $(e.target).closest('button').length) return;
- const AppCache = {
+     
-     data: {},
+     const id = $(this).attr('data-id') || $(this).data('id');
-     timestamp: {},
+     if (id) openEditCustomerModal(id);
-     TTL: 300000, // 5 phút (tăng từ 3 phút để giảm request lên Vercel)
+ });
-     isFresh(key) {
+ 
-         if (!this.timestamp[key]) return false;
+ // Xử lý riêng khi click trực tiếp vào nút Chi tiết
-         return (Date.now() - this.timestamp[key]) < this.TTL;
+ $(document).on('click', '.btn-detail', function(e) {
-     },
+     e.stopPropagation(); // Ngăn chặn sự kiện lan lên thẻ tr
-     set(key, val) {
+     const id = $(this).closest('tr').attr('data-id') || $(this).closest('tr').data('id');
-         this.data[key] = val;
+     if (id) openEditCustomerModal(id);
-         this.timestamp[key] = Date.now();
+ });
-     },
+ 
-     get(key) {
+ 
-         return this.isFresh(key) ? this.data[key] : null;
+ 
-     },
+ /**
-     clear(key) {
+  * CACHE SYSTEM
-         delete this.data[key];
+  */
-         delete this.timestamp[key];
+ const AppCache = {
-     },
+     data: {},
-     clearAll() {
+     timestamp: {},
-         this.data = {};
+     TTL: 300000, // 5 phút (tăng từ 3 phút để giảm request lên Vercel)
-         this.timestamp = {};
+     isFresh(key) {
-     }
+         if (!this.timestamp[key]) return false;
- };
+         return (Date.now() - this.timestamp[key]) < this.TTL;
- 
+     },
- /**
+     set(key, val) {
-  * CORE API WRAPPER
+         this.data[key] = val;
-  * Hardened with Timeout (30s) and Auto-Retry (Max 2)
+         this.timestamp[key] = Date.now();
-  */
+    
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]

### 📐 Generic Logic Conventions & Fixes
- **[problem-fix] Patched security issue CORS — prevents XSS injection attacks**: -         const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1200, useWebWorker: true };
+         const options = { 
-         return Promise.race([
+             maxSizeMB: 0.4, 
-             imageCompression(file, options),
+             maxWidthOrHeight: 1200, 
-             new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), ms))
+             useWebWorker: false, // Tắt web worker để tránh lỗi CORS/treo
-         ]);
+             onProgress: (pct) => {
-     };
+                 const currentPct = Math.round(pct);
- 
+                 updateUIProgress(`Đang tối ưu ${slotLabel} (${currentPct}%)...`, Math.round(((currentStep - 1) / totalSteps) * 100 + (currentPct / totalSteps)));
-     updateUIProgress('Bắt đầu quy trình xử lý hồ sơ...', 5);
+             }
- 
+         };
-     for (const slot of filesToProcess) {
+         return Promise.race([
-         currentStep++;
+             imageCompression(file, options),
-         // FIX: Dung slot.id thay vi slot.inputId
+             new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), ms))
-         const fileInput = document.getElementById(slot.id);
+         ]);
-         const file = fileInput ? fileInput.files[0] : null;
+     };
-         updateUIProgress(`Đang tối ưu ${slot.label} (${currentStep}/${filesToProcess.length})...`, Math.round((currentStep / totalSteps) * 100));
+     updateUIProgress('Bắt đầu quy trình xử lý hồ sơ...', 5);
-         if (!file) {
+     for (const slot of filesToProcess) {
-             console.warn(`Không tìm thấy file cho ${slot.label}`);
+         currentStep++;
-             continue;
+         // FIX: Dung slot.id thay vi slot.inputId
-         }
+         const fileInput = document.getElementById(slot.id);
- 
+         const file = fileInput ? fileInput.files[0] : null;
-         try {
+ 
-             const compressed = await compressWithTimeout(file, slot.label);
+         updateUIProgress(`Đang tối ưu ${slot.label} (${currentS
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] what-changed in app.js — confirmed 7x**: -     VERSION: "2.2.0-STABLE",
+     VERSION: "2.1.1-PATCHED",
-                    + (loaiHinh !== 'Cá nhân' ? getImgHtml(row['URL GP DKKD'] || '', 'GP ĐKKD') : '')
+                    + (loaiHinh !== 'Cá nhân' ? getImgHtml(row['URL GP DKKD'] || row['URL DKKD'] || '', 'GP ĐKKD') : '')
-                    + getImgHtml(row['URL QR'] || '', 'QR TK')
+                    + getImgHtml(row['URL QR'] || row['URL Mã QR'] || '', 'QR TK')
-                    + getImgHtml(row['URL Ảnh Thực Hiện'] || '', 'Ảnh GD');
+                    + getImgHtml(row['URL Ảnh Thực Hiện'] || row['URL Thực Hiện'] || '', 'Ảnh GD');

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[what-changed] what-changed in vercel.json**: -     { "source": "/(.*)", "destination": "/index.html" }
+     { "source": "/(app\\.js|style\\.css|logo\\.png)", "destination": "/netlify-app/$1" },
-   ]
+     { "source": "/(.*)", "destination": "/netlify-app/index.html" }
- }
+   ]
- 
+ }
+ 

📌 IDE AST Context: Modified symbols likely include [version, name, cleanUrls, rewrites]
- **[what-changed] Replaced auth Cache — adds runtime type validation before use**: -     <!-- Pre-load styles -->
+     <!-- Cache Control -->
-     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
+     <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
-     <link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
+     <meta http-equiv="Pragma" content="no-cache">
-     <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
+     <meta http-equiv="Expires" content="0">
-     <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
+ 
-     <link href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap5.min.css" rel="stylesheet">
+     <!-- Pre-load styles -->
-     <link href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.bootstrap5.min.css" rel="stylesheet">
+     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
-     <link href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" rel="stylesheet">
+     <link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
-     <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet">
+     <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
-     <link href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" rel="stylesheet">
+     <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
-     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
+     <link href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap5.min.css" rel="stylesheet">
-     <link href="style.css" rel="stylesheet">
+     <link href="https:
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] what-changed in style.css**: File updated (external): style.css

Content summary (212 lines):
:root {
    --emerald: #10b981;
    --emerald-dark: #059669;
    --slate: #64748b;
    --amber: #f59e0b;
}

body {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    margin: 0;
    padding: 0;
}

.glass-card {
    background: rgba(255, 255, 255, 0.85);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 1rem;
- **[convention] Patched security issue CCCD — adds runtime type validation before use — confirmed 4x**: - function checkDuplicateAccount(cccd, dkkd, sdt, loaiHinh) {
+ function checkDuplicateAccount(cccd, dkkd, sdt, loaiHinh, excludeId) {
-     // Chỉ báo trùng nếu CÙNG loại hình dịch vụ (Cá nhân vs Cá nhân, HKD vs HKD)
+     
-     if (row["Loại hình dịch vụ"] === loaiHinh) {
+     // Nếu có excludeId, bỏ qua dòng hiện tại (đang chỉnh sửa)
-       if (cccd && cccd !== "" && row["Số CCCD"] == cccd) return { isDup: true, msg: "Trùng Số CCCD/CMND với giao dịch trước đó của cùng loại hình khách hàng." };
+     if (excludeId && row["ID"] && row["ID"].toString().replace(/^'/, '') === excludeId.toString().replace(/^'/, '')) {
-       if (dkkd && dkkd !== "" && row["Số DKKD"] == dkkd) return { isDup: true, msg: "Trùng Số Giấy phép ĐKKD với giao dịch trước đó của cùng loại hình khách hàng." };
+       continue;
-       if (sdt && sdt !== "" && row["Số điện thoại"] == sdt) return { isDup: true, msg: "Trùng Số điện thoại giao dịch trước đó của cùng loại hình khách hàng." };
+     }
-     }
+ 
-   }
+     // Chỉ báo trùng nếu CÙNG loại hình dịch vụ (Cá nhân vs Cá nhân, HKD vs HKD)
-   return { isDup: false };
+     if (row["Loại hình dịch vụ"] === loaiHinh) {
- }
+       if (cccd && cccd !== "" && row["Số CCCD"] == cccd) return { isDup: true, msg: "Trùng Số CCCD/CMND với giao dịch trước đó của cùng loại hình khách hàng." };
- 
+       if (dkkd && dkkd !== "" && row["Số DKKD"] == dkkd) return { isDup: true, msg: "Trùng Số Giấy phép ĐKKD với giao dịch trước đó của cùng loại hình khách hàng." };
- /**
+       if (sdt && sdt !== "" && row["Số điện thoại"] == sdt) return { isDup: true, msg: "Trùng Số điện thoại giao dịch trước đó của cùng loại hình khách hàng." };
-  * API Kiểm tra trùng lặp thời gian thực cho Frontend (CCCD, DKKD, SDT)
+     }
-  */
+   }
- function api_validateDuplicate(field, value, loaiHinh) {
+   return { isDup: false };
-   if (typeof field === 'object' && field !== null) {
+ }
-     value = field.value;
+ 
-     loaiHinh = field.loaiHinh;
+ /**
-     field = f
… [diff truncated]
- **[what-changed] what-changed in .gitignore**: - 
+ 
+ .vercel
+ 
- **[what-changed] 🟢 Edited api_admin.gs (10 changes, 6min)**: Active editing session on api_admin.gs.
10 content changes over 6 minutes.
- **[convention] what-changed in index.html — confirmed 6x**: -     <script src="app.js?v=2.2.0"></script>
+     <script src="app.js?v=2.1.1"></script>

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] Fixed null crash in Array — wraps unsafe operation in error boundary — confirmed 3x**: -         if(!val) return;
+         var lh = $('#loai_hinh').val(); // Lấy loại hình hiện tại
-         google.script.run
+         if(!val) return;
-             .withSuccessHandler(function(res) {
+         google.script.run
-                 if(res && res.isDup) {
+             .withSuccessHandler(function(res) {
-                     input.setCustomValidity('Giá trị này đã tồn tại!');
+                 if(res && res.isDup) {
-                     $(input).addClass('is-invalid');
+                     input.setCustomValidity(res.msg || 'Giá trị này đã tồn tại!');
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
+             .api_validateDuplicate(input.id, val, lh);
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
-             $('#div_dkkd').hide(300);
+         } else {
-             $('#div_img_dkkd').hide(300);
+             $('#div_dkkd').hide(300);
-             $('
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [div.d-flex.justify-content-between.align-items-center.mb-4, div.glass-card.p-3.p-md-4.mb-4, div#cropModal.modal.fade, script]
- **[what-changed] Replaced auth Inter — adds runtime type validation before use**: - 
+ <head>
- <head>
+     <meta charset="UTF-8">
-     <meta charset="UTF-8">
+     <meta name="viewport" content="width=device-width, initial-scale=1.0">
-     <meta name="viewport" content="width=device-width, initial-scale=1.0">
+     <title>Hệ Thống Quản Lý Chỉ Tiêu Mở Tài Khoản - Yên Thọ</title>
-     <title>Hệ Thống Quản Lý Chỉ Tiêu Mở Tài Khoản - Yên Thọ</title>
+ 
- 
+     <!-- Pre-load styles -->
-     <script>
+     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
-         /**
+     <link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
-          * GLOBAL ERROR HANDLER - V1.4.3
+     <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
-          * Bẫy mọi lỗi JS ngay khi load trang, bao gồm cả lỗi Syntax/Parse
+     <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
-          */
+     <link href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap5.min.css" rel="stylesheet">
-         window.onerror = function (msg, url, lineNo, columnNo, error) {
+     <link href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.bootstrap5.min.css" rel="stylesheet">
-             var errorMsg = "⚠️ HỆ THỐNG GẶP LỖI\n\n" +
+     <link href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" rel="stylesheet">
-                 "Nội dung: " + msg + "\n" +
+     <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet">
-                 "Tệp: " + (url ? url.split('/').pop() : 'inline') + "\n" +
+     <link href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" rel="stylesheet">
-                 "Dòng: " + lineNo + " : " + columnNo;
+     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
- 

… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] what-changed in .gitignore**: + # Legacy / POC (Local only)
+ frm*.html
+ jsApp.html
+ index.html
+ netlify-poc/
+ .agent/
+ .agents/
+ .brainsync/
+ .cursor/
+ 
- **[what-changed] Replaced auth Prevent**: -     $('#frmLogin').on('submit', handleLogin);
+     $('#frm-login').on('submit', handleLogin);
-     $('#btnChangePwd').on('click', openChangePasswordModal);
+     $('#frmChangePassword').on('submit', handleChangePassword);
-     $('#frmChangePassword').on('submit', handleChangePassword);
+ 
-     $('#btnLogoutDetail, #btnLogoutMobile, #btnLogoutAdmin').on('click', logout);
+     // 3. Prevent form submits default behaviour for dynamically generated forms
- 
+     $(document).on('submit', 'form', function(e) {
-     // 3. Prevent form submits default behaviour for dynamically generated forms
+         if (!this.id && !this.className) e.preventDefault();
-     $(document).on('submit', 'form', function(e) {
+     });
-         if (!this.id && !this.className) e.preventDefault();
+ 
-     });
+     // 4. Modal Event Listeners
- 
+     $(document).on('show.bs.modal', '.modal', function() {
-     // 4. Modal Event Listeners
+         $('body').addClass('modal-open');
-     $(document).on('show.bs.modal', '.modal', function() {
+     });
-         $('body').addClass('modal-open');
+     
-     });
+     $(document).on('hidden.bs.modal', '.modal', function() {
-     
+         if ($('.modal.show').length === 0) $('body').removeClass('modal-open');
-     $(document).on('hidden.bs.modal', '.modal', function() {
+     });
-         if ($('.modal.show').length === 0) $('body').removeClass('modal-open');
+ 
-     });
+     // 5. Cấp lại quyền loading off khi có phím bấm cứng (esc) xử lý bị treo form bootstrap
- 
+     window.addEventListener('keydown', function(event) {
-     // 5. Cấp lại quyền loading off khi có phím bấm cứng (esc) xử lý bị treo form bootstrap
+         if(event.key === 'Escape') {
-     window.addEventListener('keydown', function(event) {
+             $('.modal').modal('hide');
-         if(event.key === 'Escape') {
+         }
-             $('.modal').modal('hide');
+     });
-         }
+ });
-     });
+ 
- });
- 

📌 IDE AST Context: Modified symbols likely include [ready() callback]
- **[what-changed] Replaced auth Prevent — adds runtime type validation before use**: -         showView('view-login');
+         hideLoading(); // Ẩn spinner khi đã tải xong và ở dạng đăng xuất
-         if (typeof onOpenCvReady === 'function') setTimeout(onOpenCvReady, 500);
+         showView('view-login');
-     }
+         if (typeof onOpenCvReady === 'function') setTimeout(onOpenCvReady, 500);
- 
+     }
-     // 2. Gán sự kiện cơ bản UI
+ 
-     $('#frmLogin').on('submit', handleLogin);
+     // 2. Gán sự kiện cơ bản UI
-     $('#btnChangePwd').on('click', openChangePasswordModal);
+     $('#frmLogin').on('submit', handleLogin);
-     $('#frmChangePassword').on('submit', handleChangePassword);
+     $('#btnChangePwd').on('click', openChangePasswordModal);
-     $('#btnLogoutDetail, #btnLogoutMobile, #btnLogoutAdmin').on('click', logout);
+     $('#frmChangePassword').on('submit', handleChangePassword);
- 
+     $('#btnLogoutDetail, #btnLogoutMobile, #btnLogoutAdmin').on('click', logout);
-     // 3. Prevent form submits default behaviour for dynamically generated forms
+ 
-     $(document).on('submit', 'form', function(e) {
+     // 3. Prevent form submits default behaviour for dynamically generated forms
-         if (!this.id && !this.className) e.preventDefault();
+     $(document).on('submit', 'form', function(e) {
-     });
+         if (!this.id && !this.className) e.preventDefault();
- 
+     });
-     // 4. Modal Event Listeners
+ 
-     $(document).on('show.bs.modal', '.modal', function() {
+     // 4. Modal Event Listeners
-         $('body').addClass('modal-open');
+     $(document).on('show.bs.modal', '.modal', function() {
-     });
+         $('body').addClass('modal-open');
-     
+     });
-     $(document).on('hidden.bs.modal', '.modal', function() {
+     
-         if ($('.modal.show').length === 0) $('body').removeClass('modal-open');
+     $(document).on('hidden.bs.modal', '.modal', function() {
-     });
+         if ($('.modal.show').length === 0) $('body').removeClass('modal-open');
- 
+     });
-     // 5. Cấp lại quyề
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [ready() callback]
