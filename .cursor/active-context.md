> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\js\customer.js` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[what-changed] what-changed in customer.js**: - });
+ 
- 
+     // Sửa lỗi: Lắng nghe sự kiện submit của form để ngăn trang bị reload
- window.loadStaffMyCustomersView = () => { showView('view-my-customers'); initMyCustomersList(); };
+     $(document).on('submit', '#frmEditCustomer', handleEditCustomer);
- window.openEditCustomerModal = openEditCustomerModal;
+ });
+ window.loadStaffMyCustomersView = () => { showView('view-my-customers'); initMyCustomersList(); };
+ window.openEditCustomerModal = openEditCustomerModal;
+ 

📌 IDE AST Context: Modified symbols likely include [initMyCustomersList, renderStaffDashboardLocal, updateStaffRankings, staffChartInstance, renderStaffLineChart]
- **[problem-fix] problem-fix in customer.js**: -                 $('#modalEditCustomer').modal('hide');
+                 const mEl = document.getElementById('modalEditCustomer');
-                 if (AppState.user && AppState.user.role !== 'Admin') {
+                 if (mEl) bootstrap.Modal.getOrCreateInstance(mEl).hide();
-                     initMyCustomersList();
+                 if (AppState.user && AppState.user.role !== 'Admin') {
-                 } else if (AppState.user && AppState.user.role === 'Admin') {
+                     initMyCustomersList();
-                     if (typeof initDashboard === 'function') initDashboard();
+                 } else if (AppState.user && AppState.user.role === 'Admin') {
-                 }
+                     if (typeof initDashboard === 'function') initDashboard();
-             });
+                 }
-         } else {
+             });
-             showAlert('Lỗi', (res && res.message) ? res.message : 'Không thể cập nhật hồ sơ. Vui lòng thử lại.', 'error');
+         } else {
-         }
+             showAlert('Lỗi', (res && res.message) ? res.message : 'Không thể cập nhật hồ sơ. Vui lòng thử lại.', 'error');
-     }, () => {
+         }
-         btn.prop('disabled', false).html(oldHtml);
+     }, () => {
-     }, 'Đang lưu hồ sơ...');
+         btn.prop('disabled', false).html(oldHtml);
- }
+     }, 'Đang lưu hồ sơ...');
- 
+ }
- // Cấu hình event delegation xử lý xem chi tiết
+ 
- $(document).ready(() => {
+ // Cấu hình event delegation xử lý xem chi tiết
-     $(document).on('click', '.clickable-row', function(e) {
+ $(document).ready(() => {
-         if ($(e.target).is('button') || $(e.target).closest('button').length) return;
+     $(document).on('click', '.clickable-row', function(e) {
-         const id = $(this).attr('data-id') || $(this).data('id');
+         if ($(e.target).is('button') || $(e.target).closest('button').length) return;
-         if (id) openEditCustomerModal(id);
+         const id = $(this).attr('data-id') || $(this).data('
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [initMyCustomersList, renderStaffDashboardLocal, updateStaffRankings, staffChartInstance, renderStaffLineChart]
- **[problem-fix] Fixed null crash in CCCD — offloads heavy computation off the main thread**: -         $('#dkkd, #img_dkkd, #ten_dang_nhap').prop('required', true);
+         $('#dkkd, #img_dkkd').prop('required', true); // Chỉ dkkd là bắt bắt buộc cho HKD
-         $('#dkkd, #img_dkkd, #ten_dang_nhap').prop('required', false);
+         $('#dkkd, #img_dkkd').prop('required', false);
-     btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
+     const invalidFields = $('#frm-mo-tk .is-invalid');
-     progressWrapper.removeClass('initially-hidden').removeClass('d-none').show();
+     if (invalidFields.length > 0) {
-     progressBar.css('width', '0%');
+         showAlert('Thông tin chưa khớp', 'Vui lòng kiểm tra lại các trường đang báo đỏ (có thể bị trùng dữ liệu).', 'warning');
-     progressPct.text('0%');
+         btn.prop('disabled', false).html(oldBtn);
- 
+         return;
-     const fileSlots = [
+     }
-         { id: 'img_truoc', label: 'CCCD Trước' },
+ 
-         { id: 'img_sau',   label: 'CCCD Sau' },
+     btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
-         { id: 'img_dkkd',  label: 'Giấy phép' },
+     progressWrapper.removeClass('initially-hidden').removeClass('d-none').show();
-         { id: 'img_qr',    label: 'Mã QR' },
+     progressBar.css('width', '0%');
-         { id: 'img_thuchien', label: 'Ảnh thực hiện' }
+     progressPct.text('0%');
-     ];
+ 
- 
+     const fileSlots = [
-     const getSafeVal = (id) => ($(`#${id}`).val() || "").trim();
+         { id: 'img_truoc', label: 'CCCD Trước' },
- 
+         { id: 'img_sau',   label: 'CCCD Sau' },
-     const data = {
+         { id: 'img_dkkd',  label: 'Giấy phép' },
-         action: "api_submitregistration",
+         { id: 'img_qr',    label: 'Mã QR' },
-         email: AppState.user.email,
+         { id: 'img_thuchien', label: 'Ảnh thực hiện' }
-         loai_hinh: $('#loai_hinh').val(),
+     ];
-         ten_kh: getSafeVal('ten_kh'),
+ 
-         cccd: getSa
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [initMoTaiKhoanForm, toggleFormFields, handleRegistration, checkDuplicate, loadStaffOpenAccountView]
- **[what-changed] what-changed in registration.js**: -             useWebWorker: true,
+             useWebWorker: false,

📌 IDE AST Context: Modified symbols likely include [initMoTaiKhoanForm, toggleFormFields, handleRegistration, checkDuplicate, loadStaffOpenAccountView]
- **[convention] Fixed null crash in AppState — offloads heavy computation off the main thread — confirmed 3x**: -     const targets = $('#div_dkkd, #div_img_dkkd, #div_ten_dang_nhap');
+     const targets = $('#div_dkkd, #div_img_dkkd, #div_ten_dang_nhap, #div_mat_khau');
-         $('#dkkd, #img_dkkd').prop('required', true);
+         $('#dkkd, #img_dkkd, #ten_dang_nhap').prop('required', true);
-         $('#dkkd, #img_dkkd').prop('required', false);
+         $('#dkkd, #img_dkkd, #ten_dang_nhap').prop('required', false);
-     const data = {
+     const getSafeVal = (id) => ($(`#${id}`).val() || "").trim();
-         action: "api_submitregistration",
+ 
-         email: AppState.user.email,
+     const data = {
-         loai_hinh: $('#loai_hinh').val(),
+         action: "api_submitregistration",
-         ten_kh: $('#ten_kh').val().trim(),
+         email: AppState.user.email,
-         cccd: $('#cccd').val().trim(),
+         loai_hinh: $('#loai_hinh').val(),
-         dkkd: $('#dkkd').val().trim(),
+         ten_kh: getSafeVal('ten_kh'),
-         sdt: $('#sdt').val().trim(),
+         cccd: getSafeVal('cccd'),
-         so_tk: '3800200' + $('#so_tk').val().trim(),
+         dkkd: getSafeVal('dkkd'),
-         ten_dang_nhap: $('#ten_dang_nhap').val().trim(),
+         sdt: getSafeVal('sdt'),
-         ngay_mo: $('#ngay_mo').val(),
+         so_tk: '3800200' + getSafeVal('so_tk'),
-         mat_khau: $('#mat_khau').val() || ""
+         ten_dang_nhap: getSafeVal('ten_dang_nhap'),
-     };
+         ngay_mo: $('#ngay_mo').val(),
- 
+         mat_khau: $('#mat_khau').val() || ""
-     const filesToProcess = fileSlots.filter(s => document.getElementById(s.id) && document.getElementById(s.id).files[0]);
+     };
-     const totalSteps = filesToProcess.length + 2; 
+ 
-     let currentStep = 0;
+     const filesToProcess = fileSlots.filter(s => document.getElementById(s.id) && document.getElementById(s.id).files[0]);
- 
+     const totalSteps = filesToProcess.length + 2; 
-     const updateUIProgress = (msg, pct) => {
+     let currentStep = 0;
-         progressLabel.text(
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [initMoTaiKhoanForm, toggleFormFields, handleRegistration, checkDuplicate, loadStaffOpenAccountView]
- **[what-changed] Replaced auth Modal**: -             $('#modalChangePassword').modal('hide');
+             const modalEl = document.getElementById('modalChangePassword');
-             handleLoginSuccess(false);
+             if (modalEl) bootstrap.Modal.getOrCreateInstance(modalEl).hide();
-         } else {
+             handleLoginSuccess(false);
-             showAlert('Lỗi', res.message, 'error');
+         } else {
-         }
+             showAlert('Lỗi', res.message, 'error');
-     });
+         }
- }
+     });
- 
+ }
- // Global exposure
+ 
- window.logout = logout;
+ // Global exposure
- window.openChangePasswordModal = openChangePasswordModal;
+ window.logout = logout;
- 
+ window.openChangePasswordModal = openChangePasswordModal;
+ 

📌 IDE AST Context: Modified symbols likely include [handleLogin, handleLoginSuccess, logout, openChangePasswordModal, handleChangePassword]
- **[convention] Fixed null crash in CCCD — offloads heavy computation off the main thread — confirmed 7x**: -     $('#div_dkkd, #div_img_dkkd, #div_ten_dang_nhap').toggle(isHKD);
+     const targets = $('#div_dkkd, #div_img_dkkd, #div_ten_dang_nhap');
-     $('#dkkd, #img_dkkd').prop('required', isHKD);
+     
- }
+     if (isHKD) {
- 
+         targets.hide().removeClass('initially-hidden').fadeIn(400);
- async function handleRegistration(e) {
+         $('#dkkd, #img_dkkd').prop('required', true);
-     e.preventDefault();
+         $('#dkkd').addClass('border-primary shadow-sm');
-     const btn = $('#btnSubmitAccount');
+     } else {
-     const oldBtn = btn.html();
+         targets.fadeOut(300);
-     
+         $('#dkkd, #img_dkkd').prop('required', false);
-     const progressWrapper = $('#compress-progress-wrapper');
+         $('#dkkd').removeClass('border-primary shadow-sm');
-     const progressBar = $('#compress-progress-bar');
+     }
-     const progressLabel = $('#compress-progress-label');
+ }
-     const progressPct = $('#compress-progress-pct');
+ 
- 
+ async function handleRegistration(e) {
-     btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
+     e.preventDefault();
-     progressWrapper.removeClass('initially-hidden').removeClass('d-none').show();
+     const btn = $('#btnSubmitAccount');
-     progressBar.css('width', '0%');
+     const oldBtn = btn.html();
-     progressPct.text('0%');
+     
- 
+     const progressWrapper = $('#compress-progress-wrapper');
-     const fileSlots = [
+     const progressBar = $('#compress-progress-bar');
-         { id: 'img_truoc', label: 'CCCD Trước' },
+     const progressLabel = $('#compress-progress-label');
-         { id: 'img_sau',   label: 'CCCD Sau' },
+     const progressPct = $('#compress-progress-pct');
-         { id: 'img_dkkd',  label: 'Giấy phép' },
+ 
-         { id: 'img_qr',    label: 'Mã QR' },
+     btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
-         { id: 'img_thuchien', l
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [initMoTaiKhoanForm, toggleFormFields, handleRegistration, checkDuplicate, loadStaffOpenAccountView]
- **[what-changed] 🟢 Edited netlify-app/js/api.js (5 changes, 143min)**: Active editing session on netlify-app/js/api.js.
5 content changes over 143 minutes.
- **[decision] decision in registration.js**: -     const compressWithTimeout = (file, slotLabel, ms = 10000) => {
+     const compressWithTimeout = (file, slotLabel, ms = 25000) => {
-         const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1200, useWebWorker: true };
+         const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1200, useWebWorker: false };

📌 IDE AST Context: Modified symbols likely include [initMoTaiKhoanForm, toggleFormFields, handleRegistration, checkDuplicate, loadStaffOpenAccountView]
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
- **[what-changed] 🟢 Edited app.js (12 changes, 125min)**: Active editing session on app.js.
12 content changes over 125 minutes.
- **[problem-fix] Patched security issue Theo — prevents XSS injection attacks**: -         const trangThai = row['Trạng thái'] || 'Chưa hoàn thành';
+         const status = row['Trạng thái'] || '';
-         const isVerified = (trangThai === 'Đã xác minh');
+         if (status === 'Đã kích hoạt') {
- 
+             $('#edit_is_activated').prop('checked', true);
-         // Theo yêu cầu mới, User tự quản lý sửa hồ sơ nên không khóa nút Lưu kể cả khi đã xác minh
+         } else {
-         if (AppState.user && AppState.user.role === 'Admin') {
+             $('#edit_is_activated').prop('checked', false);
-             $('#btnSaveEdit').hide();
+         }
-             $('#frmEditCustomer input').prop('readonly', true);
+ 
-             $('#edit_status_alert').removeClass('d-none');
+         const isVerified = (status === 'Đã xác minh' || status === 'Đã kích hoạt');
-             $('.modal-title').html(`<i class='bx bx-search-alt text-white'></i> Chi tiết Hồ sơ <span class="badge bg-info small ms-2">Chế độ xem</span>`);
+ 
-         } else {
+         // Theo yêu cầu mới, User tự quản lý sửa hồ sơ nên không khóa nút Lưu kể cả khi đã xác minh
-             $('#btnSaveEdit').show();
+         if (AppState.user && AppState.user.role === 'Admin') {
-             $('#frmEditCustomer input').prop('readonly', false);
+             $('#btnSaveEdit').hide();
-             $('#edit_status_alert').addClass('d-none');
+             $('#frmEditCustomer input').prop('readonly', true);
-             
+             $('#edit_status_alert').removeClass('d-none');
-             if (isVerified) {
+             $('.modal-title').html(`<i class='bx bx-search-alt text-white'></i> Chi tiết Hồ sơ <span class="badge bg-info small ms-2">Chế độ xem</span>`);
-                 $('.modal-title').html(`<i class='bx bxs-check-shield text-success'></i> Chi tiết Hồ sơ <span class="badge bg-success small ms-2">Đã xác minh</span>`);
+         } else {
-             } else {
+             $('#btnSaveEdit').show();
-                 $('.modal-title').html(`<i class='bx bxs-edit-a
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[problem-fix] Patched security issue Chart — prevents XSS injection attacks**: -     $('#db-ca-nhan-sub').text(s.caNhan || 0);
+     $('#db-activated').text(s.activated || 0);
-     $('#db-hkd-sub').text(s.hkd || 0);
+     $('#db-inactive').text(s.inactive || 0);
-     $('#db-ca-nhan').text(s.caNhan || 0);
+     $('#db-ca-nhan-sub').text(s.caNhan || 0);
-     $('#db-hkd-count').text(s.hkd || 0);
+     $('#db-hkd-sub').text(s.hkd || 0);
- }
+     $('#db-ca-nhan').text(s.caNhan || 0);
- 
+     $('#db-hkd-count').text(s.hkd || 0);
- function renderAdminTopStaff(allStaffs) {
+ }
-     if (!allStaffs || allStaffs.length === 0) {
+ 
-         $('#db-topstaff').html('<div class="text-center text-muted small p-2">Không có dữ liệu cán bộ.</div>');
+ function renderAdminTopStaff(allStaffs) {
-         return;
+     if (!allStaffs || allStaffs.length === 0) {
-     }
+         $('#db-topstaff').html('<div class="text-center text-muted small p-2">Không có dữ liệu cán bộ.</div>');
-     const sorted = [...allStaffs].sort((a,b) => (b.total || 0) - (a.total || 0)).slice(0, 5);
+         return;
-     let html = '';
+     }
-     sorted.forEach((st, idx) => {
+     const sorted = [...allStaffs].sort((a,b) => (b.total || 0) - (a.total || 0)).slice(0, 5);
-         let rankColor = 'text-secondary';
+     let html = '';
-         let trophy = `<span class="fw-bold ms-2">${idx + 1}.</span>`;
+     sorted.forEach((st, idx) => {
-         if (idx === 0) { rankColor = 'text-warning'; trophy = `<i class='bx bxs-trophy ms-1 fs-5 text-warning'></i>`; }
+         let rankColor = 'text-secondary';
-         else if (idx === 1) { rankColor = 'text-secondary'; trophy = `<i class='bx bxs-medal ms-1 fs-5 text-secondary'></i>`; }
+         let trophy = `<span class="fw-bold ms-2">${idx + 1}.</span>`;
-         else if (idx === 2) { rankColor = 'text-danger'; trophy = `<i class='bx bxs-medal ms-1 fs-5 text-danger'></i>`; }
+         if (idx === 0) { rankColor = 'text-warning'; trophy = `<i class='bx bxs-trophy ms-1 fs-5 text-warning'></i>`; }
-         
+         else if (idx 
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Patched security issue Theo — prevents XSS injection attacks — confirmed 5x**: -         const trangThai = row['Trạng thái'] || 'Chưa hoàn thành';
+         // Theo yêu cầu mới, User tự quản lý sửa hồ sơ nên không khóa nút Lưu kể cả khi đã xác minh
-         const isVerified = (trangThai === 'Đã xác minh');
+         if (AppState.user && AppState.user.role === 'Admin') {
- 
+             $('#btnSaveEdit').hide();
-         // Theo yêu cầu mới, User tự quản lý sửa hồ sơ nên không khóa nút Lưu kể cả khi đã xác minh
+             $('#frmEditCustomer input').prop('readonly', true);
-         if (AppState.user && AppState.user.role === 'Admin') {
+             $('#edit_status_alert').removeClass('d-none');
-             $('#btnSaveEdit').hide();
+             $('.modal-title').html(`<i class='bx bx-search-alt text-white'></i> Chi tiết Hồ sơ <span class="badge bg-info small ms-2">Chế độ xem</span>`);
-             $('#frmEditCustomer input').prop('readonly', true);
+         } else {
-             $('#edit_status_alert').removeClass('d-none');
+             $('#btnSaveEdit').show();
-             $('.modal-title').html(`<i class='bx bx-search-alt text-white'></i> Chi tiết Hồ sơ <span class="badge bg-info small ms-2">Chế độ xem</span>`);
+             $('#frmEditCustomer input').prop('readonly', false);
-         } else {
+             $('#edit_status_alert').addClass('d-none');
-             $('#btnSaveEdit').show();
+             
-             $('#frmEditCustomer input').prop('readonly', false);
+             if (isVerified) {
-             $('#edit_status_alert').addClass('d-none');
+                 $('.modal-title').html(`<i class='bx bxs-check-shield text-success'></i> Chi tiết Hồ sơ <span class="badge bg-success small ms-2">Đã xác minh</span>`);
-             
+             } else {
-             if (isVerified) {
+                 $('.modal-title').html(`<i class='bx bxs-edit-alt text-white'></i> Chỉnh sửa Hồ sơ`);
-                 $('.modal-title').html(`<i class='bx bxs-check-shield text-success'></i> Chi tiết Hồ sơ <span class="badge bg-
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
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
