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
- **[problem-fix] Patched security issue Chuy — prevents XSS injection attacks**: -         let row = null;
+         
-         const sourceData = (AppState.user && AppState.user.role === 'Admin') ? (window._adminAllData || []) : ((AppCache.get('myCustomers') || {}).data || []);
+         // Làm sạch ID: Chuyển về string, trim và bỏ dấu nháy đơn prefix (') thường gặp ở Google Sheets
-         
+         const rowIdStr = String(id).trim().replace(/^'/, '');
-         const rowIdStr = String(id).trim().replace(/^'/, '');
+         
-         for (let i = 0; i < sourceData.length; i++) {
+         let row = null;
-             const currentId = String(sourceData[i]['ID'] || sourceData[i]['Mã GD'] || '').trim().replace(/^'/, '');
+         let sourceData = [];
-             if (currentId === rowIdStr) {
+ 
-                 row = sourceData[i];
+         if (AppState.user && AppState.user.role === 'Admin') {
-                 break;
+             sourceData = window._adminAllData || [];
-             }
+         } else {
-         }
+             const cache = AppCache.get('myCustomers');
- 
+             sourceData = (cache && Array.isArray(cache.data)) ? cache.data : [];
-         if (!row) {
+         }
-             console.warn("No row found with ID:", id);
+         
-             showAlert('Lỗi', 'Không tìm thấy thông tin hồ sơ khách hàng. Vui lòng thử lại.', 'error');
+         // Tìm kiếm dòng tương ứng
-             return;
+         for (let i = 0; i < sourceData.length; i++) {
-         }
+             const currentId = String(sourceData[i]['ID'] || sourceData[i]['Mã GD'] || '').trim().replace(/^'/, '');
- 
+             if (currentId === rowIdStr) {
-         // Khởi tạo datepicker cho modal chỉnh sửa nếu chưa có
+                 row = sourceData[i];
-         if (typeof flatpickr !== 'undefined') {
+                 break;
-             const fpEl = document.querySelector('.js-datepicker-edit');
+             }
-             if (fpEl && !fpEl._flatpickr) {
+         }
-                 flatpickr(fpEl, {
+ 
-                     dateFo
… [diff truncated]

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
- **[problem-fix] Patched security issue CCCD — prevents XSS injection attacks**: -         return `
+         const rowId = (d.ID || d['Mã GD'] || '').toString().replace(/^'/, '');
-             <tr onclick="openEditCustomerModal('${d.ID || d['Mã GD']}')" class="cursor-pointer">
+         return `
-                 <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
+             <tr data-id="${rowId}" class="clickable-row cursor-pointer">
-                 <td class="fw-bold">${utils_escapeHTML(d['Tên khách hàng'])}</td>
+                 <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
-                 <td><small>${utils_escapeHTML(d['Số CCCD'])}</small></td>
+                 <td class="fw-bold">${utils_escapeHTML(d['Tên khách hàng'])}</td>
-                 <td><small>${utils_escapeHTML(d['Số GP ĐKKD'] || '')}</small></td>
+                 <td><small>${utils_escapeHTML(d['Số CCCD'])}</small></td>
-                 <td><span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'])}</span></td>
+                 <td><small>${utils_escapeHTML(d['Số GP ĐKKD'] || '')}</small></td>
-                 <td><small>${utils_escapeHTML(d['Số điện thoại'])}</small></td>
+                 <td><span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'])}</span></td>
-                 <td>${AppState.user ? utils_escapeHTML(AppState.user.name) : utils_escapeHTML(d['Cán bộ thực hiện'] || '')}</td>
+                 <td><small>${utils_escapeHTML(d['Số điện thoại'])}</small></td>
-                 <td><small>${utils_escapeHTML(d['Ngày mở TK'] || d['Ngày mở'] || '')}</small></td>
+                 <td>${AppState.user ? utils_escapeHTML(AppState.user.name) : utils_escapeHTML(d['Cán bộ thực hiện'] || '')}</td>
-                 <td><small>${utils_escapeHTML(d['Số TK'] || d['Số tài khoản'] || '')}</small></td>
+                 <td><small>${utils_escapeHTML(d['Ngày mở TK'] || d['Ngày mở'] || '')}</small></td>
-                 <td cl
… [diff truncated]

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
- **[what-changed] 🟢 Edited netlify-app/app.js (6 changes, 1min)**: Active editing session on netlify-app/app.js.
6 content changes over 1 minutes.
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
- **[convention] Fixed null crash in Find — wraps unsafe operation in error boundary — confirmed 3x**: -     if(!adminData || !adminData.allStaffs) return;
+     if(!adminData || !adminData.allStaffs) {
-     
+         $('#staffDash-rank').text('Chưa có dữ liệu');
-     let staffs = adminData.allStaffs;
+         return;
-     let rank = staffs.findIndex(s => s.email === email) + 1;
+     }
-     let me = staffs.find(s => s.email === email);
+     
-     
+     let staffs = adminData.allStaffs;
-     if (rank > 0) {
+     let rankIndex = staffs.findIndex(s => s.email === email);
-         $('#staffDash-rank').text(`#${rank} / ${staffs.length}`);
+     let me = staffs.find(s => s.email === email);
-         
+     
-         // Find person immediately above
+     if (rankIndex >= 0 && me) {
-         if (rank > 1) {
+         let rank = rankIndex + 1;
-             const aboveMe = staffs[rank - 2];
+         $('#staffDash-rank').text(`#${rank} / ${staffs.length}`);
-             const diff = (aboveMe.total || 0) - (me.total || 0);
+         
-             $('#staffDash-aboveRankInfo').html(`<i class='bx bx-trending-up'></i> Người xếp trên: <b>${aboveMe.total}</b> hồ sơ (cần thêm ${diff})`);
+         // Find person immediately above
-         } else {
+         if (rank > 1) {
-             $('#staffDash-aboveRankInfo').html(`<i class='bx bxs-check-circle text-success'></i> Đang dẫn đầu hệ thống!`);
+             const aboveMe = staffs[rankIndex - 1];
-         }
+             const diff = (aboveMe.total || 0) - (me.total || 0);
-     } else {
+             $('#staffDash-aboveRankInfo').html(`<i class='bx bx-trending-up'></i> Người xếp trên: <b>${aboveMe.total || 0}</b> hồ sơ (cần thêm ${diff})`);
-         $('#staffDash-rank').text('Chưa xếp hạng');
+         } else {
-         $('#staffDash-aboveRankInfo').text('Cần tối thiểu 1 hồ sơ để xếp hạng.');
+             $('#staffDash-aboveRankInfo').html(`<i class='bx bxs-check-circle text-success'></i> Đang dẫn đầu hệ thống!`);
-     }
+         }
- 
+     } else {
-     if (staffs.length > 0) {
+         $('#staffDash-r
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
