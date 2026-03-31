> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\app.js` (Domain: **Generic Logic**)

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
- **[what-changed] what-changed in index.html**: -                             <input type="text" class="form-control text-uppercase border-primary shadow-sm" id="dkkd" placeholder="NHẬP SỐ ĐKKD (BẮT BUỘC VỚI HKD)">
+                             <input type="text" class="form-control text-uppercase border-primary shadow-sm" id="dkkd" placeholder="NHẬP SỐ ĐKKD (BẮT BUỘC VỚI HKD)" onblur="checkDuplicate(this)">

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] Replaced auth Modules — confirmed 3x**: -     <!-- Modules (v2.1.4-STABLE) -->
+     <!-- Modules (v2.1.8-PATCH) -->
-     <script src="js/utils.js?v=2.1.5"></script>
+     <script src="js/utils.js?v=2.1.8-patch"></script>
-     <script src="js/api.js?v=2.1.5"></script>
+     <script src="js/api.js?v=2.1.8-patch"></script>
-     <script src="js/state.js?v=2.1.5"></script>
+     <script src="js/state.js?v=2.1.8-patch"></script>
-     <script src="js/auth.js?v=2.1.5"></script>
+     <script src="js/auth.js?v=2.1.8-patch"></script>
-     <script src="js/camera.js?v=2.1.5"></script>
+     <script src="js/camera.js?v=2.1.8-patch"></script>
-     <script src="js/registration.js?v=2.1.5"></script>
+     <script src="js/registration.js?v=2.1.8-patch"></script>
-     <script src="js/customer.js?v=2.1.5"></script>
+     <script src="js/customer.js?v=2.1.8-patch"></script>
-     <script src="js/dashboard.js?v=2.1.5"></script>
+     <script src="js/dashboard.js?v=2.1.8-patch"></script>
-     <script src="app.js?v=2.1.5"></script>
+     <script src="app.js?v=2.1.8-patch"></script>

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] what-changed in index.html — confirmed 3x**: -                     <h5 class="fw-bold text-primary mb-2">QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ</h5>
+                     <h5 class="fw-bold mb-1" style="color: var(--primary-color);">QUỸ TÍN DỤNG NHÂN DÂN <br>YÊN THỌ</h5>

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth Theo — adds runtime type validation before use**: -                     <h3 class="fw-bold text-primary">QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ</h3>
+                     <h5 class="fw-bold text-primary mb-2">QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ</h5>
-                     <p class="text-muted small">Hệ Thống Quản Lý</p>
+                     <div class="login-badge shadow-sm">Hệ Thống Quản Lý Chỉ Tiêu Mở Tài Khoản</div>
-                 </div>            <p class="text-secondary small">Hệ thống QL Chỉ tiêu Mở Tài khoản</p>
+                 </div>
-                 <div class="col-12 col-md-3">
+                 <div class="col-6 col-md-3">
-                     <div class="glass-card p-3 border-start border-primary border-4 h-100 d-flex flex-column justify-content-center shadow-sm">
+                     <div class="glass-card p-3 border-start border-primary border-4 h-100 shadow-sm">
-                         <p class="text-muted mb-1 fw-semibold small text-uppercase">TỔNG TÀI KHOẢN</p>
+                         <div class="d-flex align-items-center gap-2 mb-2">
-                         <h3 class="fw-bold text-primary mb-0" id="db-total">0</h3>
+                             <div class="icon-box-sm bg-primary-subtle text-primary"><i class="bx bx-collection"></i></div>
-                         <small class="text-secondary mt-1"><span id="db-ca-nhan-sub" class="fw-bold text-info">0</span> Cá nhân | <span id="db-hkd-sub" class="fw-bold text-warning">0</span> Hộ KD</small>
+                             <h6 class="text-muted mb-0 small text-uppercase">TỔNG HỒ SƠ</h6>
-                     </div>
+                         </div>
-                 </div>
+                         <h3 class="fw-bold text-primary mb-0" id="db-total">0</h3>
-                 <div class="col-12 col-md-3">
+                     </div>
-                     <div class="glass-card p-3 border-start border-success border-4 h-100 d-flex flex-column justify-content-center shadow-sm">
+                 </div>
-                         <p class="text-muted mb-1 f
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth NGAY — adds runtime type validation before use**: -                         <button type="submit" class="btn btn-primary btn-lg px-5 shadow-sm d-flex align-items-center mx-auto gap-2" id="btnSubmitAccount">
+                         <div class="mb-3 d-flex justify-content-center">
-                             <i class='bx bx-send'></i> Gửi Hồ Sơ
+                             <div class="form-check form-switch bg-light p-2 px-4 rounded-pill border shadow-sm">
-                         </button>
+                                 <input class="form-check-input ms-0 me-2" type="checkbox" id="is_activated" style="width: 2.5em; height: 1.25em;">
-                         <small class="d-block mt-2 text-muted">* Mọi ảnh tải lên sẽ tự động đi qua thuật toán Crop &amp; Compress tối ưu dung lượng (&lt; 500KB).</small>
+                                 <label class="form-check-label fw-bold text-success" for="is_activated">KÍCH HOẠT HỒ SƠ NGAY</label>
-                     </div>
+                             </div>
-                 </form>
+                         </div>
-             </div>
+                         <button type="submit" class="btn btn-primary btn-lg px-5 shadow-sm d-flex align-items-center mx-auto gap-2" id="btnSubmitAccount">
-         </section>
+                             <i class='bx bx-send'></i> Gửi Hồ Sơ
- 
+                         </button>
-         <!-- VIEW: HỒ SƠ CỦA TÔI (STAFF) -->
+                         <small class="d-block mt-2 text-muted">* Mọi ảnh tải lên sẽ tự động đi qua thuật toán Crop &amp; Compress tối ưu dung lượng (&lt; 500KB).</small>
-         <section id="view-my-customers" class="view-section d-none">
+                     </div>
-              <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
+                 </form>
-                 <h4 class="fw-bold text-primary mb-0"><i class='bx bx-list-ul'></i> Hồ Sơ Của Tôi</h4>
+             </div>
-                 <div class="d-flex gap-2 align-items-center">
+         </section>
-       
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
