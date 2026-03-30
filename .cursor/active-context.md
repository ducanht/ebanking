> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\app.js` (Domain: **Generic Logic**)

### 🔴 Generic Logic Gotchas
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
- **[decision] decision in app.js**: -             $('#staffDash-aboveRankInfo').html(`<i class='bx bx-trending-up'></i> Người xếp trên: <b>${aboveMe.total || 0}</b> hồ sơ (cần thêm ${diff})`);
+             $('#staffDash-aboveRankInfo').html(`<i class='bx bx-trending-up'></i> Người xếp trên: <b>${(aboveMe.total || 0)}</b> hồ sơ (cần thêm ${diff})`);

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[discovery] discovery in app.js**: -                 <td class="fw-bold">${d['Tên khách hàng']}</td>
+                 <td class="fw-bold">${utils_escapeHTML(d['Tên khách hàng'])}</td>
-                 <td><small>${d['Số CCCD']}</small></td>
+                 <td><small>${utils_escapeHTML(d['Số CCCD'])}</small></td>
-                 <td><small>${d['Số GP ĐKKD'] || ''}</small></td>
+                 <td><small>${utils_escapeHTML(d['Số GP ĐKKD'] || '')}</small></td>
-                 <td><span class="badge bg-light text-dark border">${d['Loại hình dịch vụ']}</span></td>
+                 <td><span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'])}</span></td>
-                 <td><small>${d['Số điện thoại']}</small></td>
+                 <td><small>${utils_escapeHTML(d['Số điện thoại'])}</small></td>
-                 <td>${AppState.user ? AppState.user.name : (d['Cán bộ thực hiện'] || '')}</td>
+                 <td>${AppState.user ? utils_escapeHTML(AppState.user.name) : utils_escapeHTML(d['Cán bộ thực hiện'] || '')}</td>
-                 <td><small>${d['Ngày mở TK'] || d['Ngày mở'] || ''}</small></td>
+                 <td><small>${utils_escapeHTML(d['Ngày mở TK'] || d['Ngày mở'] || '')}</small></td>
-                 <td><small>${d['Số TK'] || d['Số tài khoản'] || ''}</small></td>
+                 <td><small>${utils_escapeHTML(d['Số TK'] || d['Số tài khoản'] || '')}</small></td>

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Fixed null crash in Excel — wraps unsafe operation in error boundary — confirmed 5x**: -         dom: "<'row mb-2'<'col-sm-12 col-md-3'l><'col-sm-12 col-md-5'f><'col-sm-12 col-md-4 text-end'B>>" +
+         lengthMenu: [10, 25, 50, 100],
-              "<'row'<'col-sm-12'tr>>" +
+         pageLength: 25,
-              "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
+         dom: "<'row mb-2'<'col-sm-12 col-md-3'l><'col-sm-12 col-md-5'f><'col-sm-12 col-md-4 text-end'B>>" +
-         buttons: [{
+              "<'row'<'col-sm-12'tr>>" +
-             extend: 'excelHtml5',
+              "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
-             text: '<i class="bx bxs-file-export"></i> Xuất Excel',
+         buttons: [{
-             className: 'btn btn-sm btn-success shadow-sm',
+             extend: 'excelHtml5',
-             exportOptions: {
+             text: '<i class="bx bxs-file-export"></i> Xuất Excel',
-                 // Xuất tất cả cột bao gồm cột ẩn (email, STK, CCCD, ...)
+             className: 'btn btn-sm btn-success shadow-sm',
-                 columns: ':all',
+             exportOptions: {
-                 format: {
+                 // Xuất tất cả cột bao gồm cột ẩn (email, STK, CCCD, ...)
-                     header: function(data, col) {
+                 columns: ':all',
-                         // Ẩn cột email khỏi header xuất
+                 format: {
-                         const hdrs = ['Thời gian', 'Họ Tên', 'Loại Hình', 'Số TK', 'Email CB', 'Cán Bộ', 'Thao tác'];
+                     header: function(data, col) {
-                         return hdrs[col] || data;
+                         // Ẩn cột email khỏi header xuất
-                     }
+                         const hdrs = ['Thời gian', 'Họ Tên', 'Loại Hình', 'Số TK', 'Email CB', 'Cán Bộ', 'Thao tác'];
-                 }
+                         return hdrs[col] || data;
-             },
+                     }
-             title: 'Bao_Cao_KH_YenTho_' + new Date().toISOString().slice(0,10)
+                 }
-      
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
