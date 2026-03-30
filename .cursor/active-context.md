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
- **[problem-fix] Fixed null crash in DataTable — prevents XSS injection attacks**: -             <tr data-id="${rowId}" class="clickable-row cursor-pointer" onclick="openEditCustomerModal('${rowId}')">
+             <tr data-id="${rowId}" class="clickable-row cursor-pointer">
-                 <td class="text-end"><button class="btn btn-sm btn-outline-primary shadow-sm btn-detail" onclick="openEditCustomerModal('${rowId}'); event.stopPropagation();"><i class="bx bx-search-alt"></i> Chi tiết</button></td>
+                 <td class="text-end">
-             </tr>
+                     <button class="btn btn-sm btn-outline-primary shadow-sm btn-detail" title="Xem chi tiết">
-         `;
+                         <i class="bx bx-search-alt"></i> <span class="d-none d-sm-inline">Chi tiết</span>
-     }).join('');
+                     </button>
- 
+                 </td>
-     $('#tbMyCustomersBody').html(html || '<tr><td colspan="7" class="text-center text-muted py-4">Chưa có hồ sơ nào.</td></tr>');
+             </tr>
-     
+         `;
-     if ($.fn.DataTable.isDataTable('#tblMyCustomers')) $('#tblMyCustomers').DataTable().destroy();
+     }).join('');
-     
+ 
-     if (data.length > 0) {
+     $('#tbMyCustomersBody').html(html || '<tr><td colspan="7" class="text-center text-muted py-4">Chưa có hồ sơ nào.</td></tr>');
-         $('#tblMyCustomers').DataTable({
+     
-             responsive: true,
+     if ($.fn.DataTable.isDataTable('#tblMyCustomers')) $('#tblMyCustomers').DataTable().destroy();
-             order: [[0, 'desc']],
+     
-             lengthMenu: [10, 25, 50, 100],
+     if (data.length > 0) {
-             pageLength: 25,
+         $('#tblMyCustomers').DataTable({
-             dom: "<'row mb-2'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4 text-center'B><'col-sm-12 col-md-4'f>>" +
+             responsive: true,
-                  "<'row'<'col-sm-12'tr>>" +
+             order: [[0, 'desc']],
-                  "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
+             lengthMenu: [10, 25, 50, 100],
-        
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [initMyCustomersList, renderStaffDashboardLocal, updateStaffRankings, staffChartInstance, renderStaffLineChart]
- **[what-changed] 🟢 Edited netlify-app/js/api.js (5 changes, 143min)**: Active editing session on netlify-app/js/api.js.
5 content changes over 143 minutes.
- **[decision] decision in registration.js**: -     const compressWithTimeout = (file, slotLabel, ms = 10000) => {
+     const compressWithTimeout = (file, slotLabel, ms = 25000) => {
-         const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1200, useWebWorker: true };
+         const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1200, useWebWorker: false };

📌 IDE AST Context: Modified symbols likely include [initMoTaiKhoanForm, toggleFormFields, handleRegistration, checkDuplicate, loadStaffOpenAccountView]
- **[problem-fix] Fixed null crash in JSON**: - const AppState = {
+ let parsedUser = null;
-     user: JSON.parse(localStorage.getItem('HOKINHDOANH_SESSION')) || null,
+ try {
-     VERSION: "2.1.2-STABLE",
+     const rawUser = localStorage.getItem('HOKINHDOANH_SESSION');
-     apiBase: "",
+     if (rawUser && rawUser !== 'undefined' && rawUser !== 'null') {
-     lastActive: Date.now()
+         parsedUser = JSON.parse(rawUser);
- };
+     }
- 
+ } catch (e) {
- const AppCache = {
+     console.warn("Dữ liệu phiên làm việc bị hỏng, đang tự động khôi phục...");
-     data: {},
+     localStorage.removeItem('HOKINHDOANH_SESSION');
-     timestamp: {},
+ }
-     TTL: 300000, // 5 phút
+ 
-     isFresh(key) {
+ const AppState = {
-         if (!this.timestamp[key]) return false;
+     user: parsedUser,
-         return (Date.now() - this.timestamp[key]) < this.TTL;
+     VERSION: "2.1.3-STABLE",
-     },
+     apiBase: "",
-     set(key, val) {
+     lastActive: Date.now()
-         this.data[key] = val;
+ };
-         this.timestamp[key] = Date.now();
+ 
-     },
+ const AppCache = {
-     get(key) {
+     data: {},
-         return this.isFresh(key) ? this.data[key] : null;
+     timestamp: {},
-     },
+     TTL: 300000, // 5 phút
-     clear(key) {
+     isFresh(key) {
-         delete this.data[key];
+         if (!this.timestamp[key]) return false;
-         delete this.timestamp[key];
+         return (Date.now() - this.timestamp[key]) < this.TTL;
-     clearAll() {
+     set(key, val) {
-         this.data = {};
+         this.data[key] = val;
-         this.timestamp = {};
+         this.timestamp[key] = Date.now();
-     }
+     },
- };
+     get(key) {
- 
+         return this.isFresh(key) ? this.data[key] : null;
- /**
+     },
-  * AUTO-LOGOUT SECURITY
+     clear(key) {
-  */
+         delete this.data[key];
- const INACTIVITY_LIMIT = 60 * 60 * 1000; // 60 minutes
+         delete this.timestamp[key];
- function checkInactivity() {
+     },
-     if (AppState.user && (Date.now() - AppState.lastAct
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [AppState, AppCache, INACTIVITY_LIMIT, checkInactivity, ready() callback]
- **[convention] Fixed null crash in Object — offloads heavy computation off the main thread — confirmed 4x**: -     flatpickr(".js-datepicker", { dateFormat: "Y-m-d", altInput: true, altFormat: "d/m/Y", defaultDate: "today" });
+     const fpEls = document.querySelectorAll('.js-datepicker');
-     
+     fpEls.forEach(el => {
-     $('#frm-mo-tk').off('submit').on('submit', handleRegistration);
+         if (!el._flatpickr) {
-     $('#loai_hinh').on('change', toggleFormFields);
+             flatpickr(el, { dateFormat: "Y-m-d", altInput: true, altFormat: "d/m/Y", defaultDate: "today" });
-     toggleFormFields(); 
+         }
- 
+     });
-     const camMap = {
+     
-         'cam_truoc': 'img_truoc',
+     $('#frm-mo-tk').off('submit').on('submit', handleRegistration);
-         'cam_sau':   'img_sau',
+     $('#loai_hinh').on('change', toggleFormFields);
-         'cam_dkkd':  'img_dkkd',
+     toggleFormFields(); 
-         'cam_qr':    'img_qr',
+ 
-         'cam_thuchien': 'img_thuchien'
+     const camMap = {
-     };
+         'cam_truoc': 'img_truoc',
- 
+         'cam_sau':   'img_sau',
-     const triggerProcessing = async (file, targetId) => {
+         'cam_dkkd':  'img_dkkd',
-         if (!file) return;
+         'cam_qr':    'img_qr',
-         showLoading('Phân tích ảnh...');
+         'cam_thuchien': 'img_thuchien'
-         try {
+     };
-             const processed = await processImageWithAI(file);
+ 
-             startCroppingFlow(processed, targetId);
+     const triggerProcessing = async (file, targetId) => {
-         } catch(e) {
+         if (!file) return;
-             startCroppingFlow(file, targetId);
+         showLoading('Phân tích ảnh...');
-         } finally {
+         try {
-             hideLoading();
+             const processed = await processImageWithAI(file);
-         }
+             startCroppingFlow(processed, targetId);
-     };
+         } catch(e) {
- 
+             startCroppingFlow(file, targetId);
-     const uploadIds = ['img_truoc', 'img_sau', 'img_dkkd', 'img_qr', 'img_thuchien'];
+         } finally {
-     upload
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [initMoTaiKhoanForm, toggleFormFields, handleRegistration, checkDuplicate, loadStaffOpenAccountView]
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
