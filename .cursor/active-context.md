> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\js\customer.js` (Domain: **Generic Logic**)

### 🔴 Generic Logic Gotchas
- **⚠️ GOTCHA: Added session cookies authentication — adds runtime type validation before use**: -  * NETLIFY HIGH-FIDELITY APP ENGINE (app.js)
+  * MÃ NGUỒN FRONTEND CHÍNH (Đã được Module hóa)
-  * Phiên bản nâng cấp: Hỗ trợ OpenCV, Nén ảnh tự động, Dashboard và DataTables chuyên nghiệp.
+  * Quản lý khởi tạo trang và các hàm lắng nghe sự kiện tổng thể
-  * Hệ thống giao tiếp với GAS Backend qua API JSON (doPost).
+  */
-  */
+ 
- 
+ $(document).ready(() => {
- const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyXBMdJO2JmoaarxW9l7mg-l4tyN6BF1U01jaMPQ48xmVOZM9WFWLnOTIc9Wyf1OpFr/exec";
+     // 1. Phục hồi session nếu có
- 
+     if (AppState.user) {
- const AppState = {
+         handleLoginSuccess(true);
-     user: JSON.parse(localStorage.getItem('HOKINHDOANH_SESSION')) || null,
+     } else {
-     VERSION: "2.1.2-STABLE",
+         localStorage.clear();
-     apiBase: "",
+         sessionStorage.clear();
-     lastActive: Date.now()
+         AppCache.clearAll();
- };
+         showView('view-login');
- 
+         if (typeof onOpenCvReady === 'function') setTimeout(onOpenCvReady, 500);
- /**
+     }
-  * AUTO-LOGOUT SECURITY
+ 
-  */
+     // 2. Gán sự kiện cơ bản UI
- const INACTIVITY_LIMIT = 60 * 60 * 1000; // 60 minutes
+     $('#frmLogin').on('submit', handleLogin);
- function checkInactivity() {
+     $('#btnChangePwd').on('click', openChangePasswordModal);
-     if (AppState.user && (Date.now() - AppState.lastActive > INACTIVITY_LIMIT)) {
+     $('#frmChangePassword').on('submit', handleChangePassword);
-         logout();
+     $('#btnLogoutDetail, #btnLogoutMobile, #btnLogoutAdmin').on('click', logout);
-         showAlert('Hết phiên làm việc', 'Phiên làm việc đã kết thúc do bạn không hoạt động trong 60 phút.', 'warning');
+ 
-     }
+     // 3. Prevent form submits default behaviour for dynamically generated forms
- }
+     $(document).on('submit', 'form', function(e) {
- $(document).on('click keydown scroll mousedown touchstart', () => AppState.lastActive = Date.now());
+         if (!this.id && !this.className) e.preventDefault();
- s
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [ready() callback]
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
- **⚠️ GOTCHA: Patched security issue EVENT — prevents XSS injection attacks**: - 
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
+     },
- async function runAPI(action, data = {}, successHandler, 
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]

### 📐 Generic Logic Conventions & Fixes
- **[problem-fix] Fixed null crash in Must**: -                 progressWrapper.fadeOut();
+                 progressWrapper.addClass('initially-hidden').addClass('d-none').hide();
-         // Must use $.fn.DataTable (capital D) for extending type search properly
+         const dtExt = $.fn.dataTable.ext;
-         const dtExt = $.fn.DataTable.ext;
+         if (dtExt && dtExt.type && dtExt.type.search) {
-         if (dtExt && dtExt.type && dtExt.type.search) {
+             dtExt.type.search.string = function(data) {
-             dtExt.type.search.string = function(data) {
+                 if (data === null || data === undefined) return '';
-                 if (!data) return '';
+                 let searchData = data;
-                 if (typeof data !== 'string') return data.toString();
+                 if (typeof data !== 'string') searchData = data.toString();
-                 return data
+                 return searchData

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] 🟢 Edited netlify-app/app.js (5 changes, 29min) — confirmed 3x**: Active editing session on netlify-app/app.js.
5 content changes over 29 minutes.
- **[problem-fix] Patched security issue NONE — prevents XSS injection attacks**: -     progressWrapper.show();
+     progressWrapper.removeClass('initially-hidden').removeClass('d-none').show();
-             progressWrapper.hide();
+             progressWrapper.addClass('initially-hidden').hide();
- 
+ function checkDuplicate(input) {
- /**
+     if (!input || !input.value) return;
-  * STAFF CUSTOMER LOGIC
+     const val = input.value.trim();
-  */
+     const lh = $('#loai_hinh').val(); // Lấy loại hình hiện tại
- async function initMyCustomersList() {
+     if (!val) {
-     if (!AppState.user) return;
+         $(input).removeClass('is-invalid');
-     
+         input.setCustomValidity('');
-     const cached = AppCache.get('myCustomers');
+         return;
-     if (cached) {
+     }
-         renderMyCustomersTable(cached.data);
+     
-         renderStaffDashboardLocal(cached.data || []);
+     if (!input.checkValidity()) {
-         // Dùng cache admin nếu có, không thì mới fetch
+         $(input).addClass('is-invalid');
-         const cachedAdmin = AppCache.get('adminDashboard');
+         return;
-         if (cachedAdmin) {
+     }
-             updateStaffRankings(cachedAdmin, AppState.user.email);
+ 
-         } else {
+     runAPI('api_validateduplicate', { field: input.id, value: val, loaiHinh: lh }, (res) => {
-             runAPI('api_getAdminDashboardData', { email: AppState.user.email }, (adminRes) => {
+         if (res && res.isDup) {
-                 if (adminRes.status === 'success') {
+             input.setCustomValidity(res.msg || 'Giá trị này đã tồn tại cùng loại hình!');
-                     const s = _parseStats(adminRes);
+             $(input).addClass('is-invalid');
-                     AppCache.set('adminDashboard', s);
+             if ($(input).siblings('.invalid-feedback').length) {
-                     updateStaffRankings(s, AppState.user.email);
+                 $(input).siblings('.invalid-feedback').text(res.msg || 'Giá trị này đã tồn tại cùng loại hình!');
-                 }
+             }
-  
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Patched security issue Normalization — prevents XSS injection attacks — confirmed 3x**: -             <tr data-id="${rowId}" class="clickable-row cursor-pointer">
+             <tr data-id="${rowId}" class="clickable-row cursor-pointer" onclick="openEditCustomerModal('${rowId}')">
-                 <td class="text-end"><button class="btn btn-sm btn-outline-primary shadow-sm btn-detail"><i class="bx bx-search-alt"></i> Chi tiết</button></td>
+                 <td class="text-end"><button class="btn btn-sm btn-outline-primary shadow-sm btn-detail" onclick="openEditCustomerModal('${rowId}'); event.stopPropagation();"><i class="bx bx-search-alt"></i> Chi tiết</button></td>
-             <tr data-id="${rowId}" class="clickable-row cursor-pointer" style="cursor:pointer">
+             <tr data-id="${rowId}" class="clickable-row cursor-pointer" style="cursor:pointer" onclick="openEditCustomerModal('${rowId}')">
-                 <td class="text-end"><button class="btn btn-sm btn-outline-primary px-2 btn-detail"><i class="bx bx-info-circle"></i></button></td>
+                 <td class="text-end"><button class="btn btn-sm btn-outline-primary px-2 btn-detail" onclick="openEditCustomerModal('${rowId}'); event.stopPropagation();"><i class="bx bx-info-circle"></i></button></td>
-     if (!AppState.user) {
+     // Normalization logic for DataTables Vietnamese Search
-         showView('view-login');
+     if (typeof $.fn.dataTable !== 'undefined' && $.fn.dataTable.ext && $.fn.dataTable.ext.type) {
-         hideLoading();
+         $.fn.dataTable.ext.type.search.string = function(data) {
-     } else {
+             if (!data) return '';
-         handleLoginSuccess(true);
+             if (typeof data !== 'string') return data;
-     }
+             return data
- 
+                 .replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a')
-     $('#frm-login').on('submit', handleLogin);
+                 .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, 'e')
-     $('#frmChangePassword').on('submit', handleChangePassword);
+                 .replace(/i|í|ì|ỉ|ĩ|ị/g, 'i')
-     $('#fr
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[what-changed] Replaced auth Date — prevents XSS injection attacks**: -     localStorage.removeItem('HOKINHDOANH_SESSION');
+     localStorage.clear();
-     sessionStorage.removeItem('HOKINHDOANH_SESSION');
+     sessionStorage.clear();
-     $('#frm-login')[0].reset();
+     
-     window.location.reload();
+     // Ép trình duyệt tải lại trang và bỏ qua cache bằng cách thêm tham số timestamp ngẫu nhiên
- }
+     window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
- 
+ }
- function utils_escapeHTML(str) {
+ 
-     if (!str) return '';
+ function utils_escapeHTML(str) {
-     return String(str)
+     if (!str) return '';
-         .replace(/&/g, "&amp;")
+     return String(str)
-         .replace(/</g, "&lt;")
+         .replace(/&/g, "&amp;")
-         .replace(/>/g, "&gt;")
+         .replace(/</g, "&lt;")
-         .replace(/"/g, "&quot;")
+         .replace(/>/g, "&gt;")
-         .replace(/'/g, "&#039;");
+         .replace(/"/g, "&quot;")
- }
+         .replace(/'/g, "&#039;");
- 
+ }
- window.onOpenCvReady = onOpenCvReady;
+ 
- window.loadStaffOpenAccountView = () => showView('view-mo-tai-khoan');
+ window.onOpenCvReady = onOpenCvReady;
- window.loadStaffMyCustomersView = () => { showView('view-my-customers'); initMyCustomersList(); };
+ window.loadStaffOpenAccountView = () => showView('view-mo-tai-khoan');
- window.logout = logout;
+ window.loadStaffMyCustomersView = () => { showView('view-my-customers'); initMyCustomersList(); };
- window.finishCropping = finishCropping;
+ window.logout = logout;
- window.openChangePasswordModal = () => {
+ window.finishCropping = finishCropping;
-     $('#pwdAlertForce').hide();
+ window.openChangePasswordModal = () => {
-     $('#modalChangePassword .btn-close').show();
+     $('#pwdAlertForce').hide();
-     $('#modalChangePassword').attr('data-bs-keyboard', 'true');
+     $('#modalChangePassword .btn-close').show();
-     $('#frmChangePassword')[0].reset();
+     $('#modalChangePassword').attr('data-bs-keyboard', 'true');
-     $('#modalChangeP
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[what-changed] what-changed in app.js**: -     VERSION: "2.1.1-PATCHED",
+     VERSION: "2.1.2-STABLE",

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[trade-off] trade-off in app.js**: -         const rowId      = (d['ID'] || d['Mã GD'] || '').toString().trim();
+         const rowId      = (d['ID'] || d['Mã GD'] || '').toString().trim().replace(/^'/, '');
-             <tr onclick="openEditCustomerModal('${rowId}')" class="cursor-pointer" style="cursor:pointer">
+             <tr data-id="${rowId}" class="clickable-row cursor-pointer" style="cursor:pointer">
-                 <td class="text-end"><button class="btn btn-sm btn-outline-primary px-2" onclick="event.stopPropagation();openEditCustomerModal('${rowId}')"><i class="bx bx-info-circle"></i></button></td>
+                 <td class="text-end"><button class="btn btn-sm btn-outline-primary px-2 btn-detail"><i class="bx bx-info-circle"></i></button></td>
-         search: { caseInsensitive: true, smart: true, searchDelay: 400 },
+         search: { caseInsensitive: true, smart: true }, // Bỏ searchDelay để đạt "tức thời"

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
- **[convention] Patched security issue DataTable — prevents XSS injection attacks — confirmed 3x**: -         if(dtAllStaffs) try { dtAllStafffunction openEditCustomerModal(id) {
+         if(dtAllStaffs) try { dtAllStaffs.destroy(); } catch(e){}
-     try {
+         dtAllStaffs = $('#tblAllStaffs').DataTable({
-         if (!id) return;
+             responsive: true,
-         let row = null;
+             dom: "<'row mb-2'<'col-sm-12 col-md-4 d-flex align-items-center justify-content-start'l><'col-sm-12 col-md-4 d-flex align-items-center justify-content-center'B><'col-sm-12 col-md-4 d-flex align-items-center justify-content-end'f>>" +
-         const sourceData = (AppState.user && AppState.user.role === 'Admin') ? (window._adminAllData || []) : ((AppCache.get('myCustomers') || {}).data || []);
+                  "<'row'<'col-sm-12'tr>>" +
-         
+                  "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
-         const rowIdStr = String(id).trim().replace(/^'/, '');
+             buttons: [{ extend: 'excelHtml5', text: '<i class="bx bxs-file-export"></i> Xuất Excel', className: 'btn btn-sm btn-success shadow-sm' }],
-         for (let i = 0; i < sourceData.length; i++) {
+             language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json" }
-             const currentId = String(sourceData[i]['ID'] || sourceData[i]['Mã GD'] || '').trim().replace(/^'/, '');
+         });
-             if (currentId === rowIdStr) {
+         $('#modalAllStaff').modal('show');
-                 row = sourceData[i];
+     } catch(e) { console.error(e); }
-                 break;
+ }
-             }
+ 
-         }
+ // --- CUSTOMER & IMAGE MODAL ---
- 
+ function openEditCustomerModal(id) {
-         if (!row) {
+     try {
-             console.warn("No row found with ID:", id);
+         if (!id) return;
-             showAlert('Lỗi', 'Không tìm thấy thông tin hồ sơ khách hàng. Vui lòng thử lại.', 'error');
+         let row = null;
-             return;
+         const sourceData = (AppState.user && AppState.user.role === 'Admin') ? 
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Patched security issue Date — prevents XSS injection attacks — confirmed 3x**: -             return;
+             showAlert('Lỗi', 'Không tìm thấy thông tin hồ sơ khách hàng. Vui lòng thử lại.', 'error');
-         }
+             return;
- 
+         }
-         $('#edit_id').val(id);
+ 
-         $('#edit_ten_kh').val(row['Tên khách hàng'] || '');
+         // Khởi tạo datepicker cho modal chỉnh sửa nếu chưa có
-         $('#edit_sdt').val((row['Số điện thoại'] || '').toString().replace(/^'/, ''));
+         if (typeof flatpickr !== 'undefined') {
-         
+             const fpEl = document.querySelector('.js-datepicker-edit');
-         let dDate = row['Ngày mở TK'] || row['Thời điểm nhập'] || '';
+             if (fpEl && !fpEl._flatpickr) {
-         if (dDate) {
+                 flatpickr(fpEl, {
-             const rawD = new Date(dDate);
+                     dateFormat: "d/m/Y",
-             if (!isNaN(rawD)) {
+                     altInput: true,
-                 dDate = String(rawD.getDate()).padStart(2, '0') + '/' + String(rawD.getMonth() + 1).padStart(2, '0') + '/' + rawD.getFullYear();
+                     altFormat: "d/m/Y",
-             }
+                     allowInput: true
-         }
+                 });
-         $('#edit_ngay_mo').val(dDate);
+             }
-         
+         }
-         let stk = (row['Số TK'] || row['Số tài khoản'] || '').toString().replace(/^'/, '');
+ 
-         if (stk.length > 7 && stk.startsWith('3800200')) stk = stk.substring(7);
+         $('#edit_id').val(id);
-         $('#edit_so_tk').val(stk);
+         $('#edit_ten_kh').val(row['Tên khách hàng'] || '');
- 
+         $('#edit_sdt').val((row['Số điện thoại'] || '').toString().replace(/^'/, ''));
-         if (AppState.user && AppState.user.role === 'Admin') {
+         
-             $('#btnSaveEdit').hide();
+         let dDate = row['Ngày mở TK'] || row['Thời điểm nhập'] || '';
-             $('#frmEditCustomer input').prop('readonly', true);
+         if (dDate) {
-         } else {
+             const rawD = new Date(dDate);
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] what-changed in app.js — confirmed 4x**: -     VERSION: "2.1.0-AUDITED",
+     VERSION: "2.1.1-PATCHED",

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Patched security issue Initialize — prevents XSS injection attacks — confirmed 3x**: - 
+     toggleFormFields(); // Initialize field visibility on load
-     // Map camera inputs -> corresponding file inputs
+ 
-     const camMap = {
+     // Map camera inputs -> corresponding file inputs
-         'cam_truoc': 'img_truoc',
+     const camMap = {
-         'cam_sau':   'img_sau',
+         'cam_truoc': 'img_truoc',
-         'cam_dkkd':  'img_dkkd',
+         'cam_sau':   'img_sau',
-         'cam_qr':    'img_qr',
+         'cam_dkkd':  'img_dkkd',
-         'cam_thuchien': 'img_thuchien'
+         'cam_qr':    'img_qr',
-     };
+         'cam_thuchien': 'img_thuchien'
- 
+     };
-     const triggerProcessing = async (file, targetId) => {
+ 
-         if (!file) return;
+     const triggerProcessing = async (file, targetId) => {
-         showLoading('Phan tich anh...');
+         if (!file) return;
-         try {
+         showLoading('Phan tich anh...');
-             const processed = await processImageWithAI(file);
+         try {
-             startCroppingFlow(processed, targetId);
+             const processed = await processImageWithAI(file);
-         } catch(e) {
+             startCroppingFlow(processed, targetId);
-             startCroppingFlow(file, targetId);
+         } catch(e) {
-         } finally {
+             startCroppingFlow(file, targetId);
-             hideLoading();
+         } finally {
-         }
+             hideLoading();
-     };
+         }
- 
+     };
-     // File (gallery) inputs
+ 
-     const uploadIds = ['img_truoc', 'img_sau', 'img_dkkd', 'img_qr', 'img_thuchien'];
+     // File (gallery) inputs
-     uploadIds.forEach(id => {
+     const uploadIds = ['img_truoc', 'img_sau', 'img_dkkd', 'img_qr', 'img_thuchien'];
-         $(`#${id}`).off('change').on('change', async function() {
+     uploadIds.forEach(id => {
-             if (this.files && this.files[0]) {
+         $(`#${id}`).off('change').on('change', async function() {
-                 await triggerProcessing(this.files[0], id);
+             
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
