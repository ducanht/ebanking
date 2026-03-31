> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\js\# Nguyên tắc cốt lõi (Core Principles).ini` (Domain: **Config/Infrastructure**)

### 📐 Config/Infrastructure Conventions & Fixes
- **[what-changed] what-changed in # Nguyên tắc cốt lõi (Core Principles).ini**: File updated (external): netlify-app/js/# Nguyên tắc cốt lõi (Core Principles).ini

Content summary (12 lines):
# Nguyên tắc cốt lõi (Core Principles)

Dưới đây là các nguyên tắc cốt lõi giúp Agent có thể tự phát triển và học hỏi trong quá trình tương tác:

## 1. Tự Động Học Hỏi & Tiến Hóa (Auto-Evolution)
Mỗi khi Agent trong quá trình chạy, debug, hoặc trò chuyện với User mà phát hiện ra một **quy luật (rule)**, **kinh nghiệm**, hoặc **phương pháp giải quyết vấn đề mới** mang tính chất quan trọng và có khả năng tái sử dụng cho các lần sau:
- Agent **PHẢI** tạm dừng và cảnh báo tới User.
- Agent **
- **[problem-fix] Fixed null crash in HTML — prevents XSS injection attacks**: -     $('#db-total').text(s.total || 0);
+     const total    = s.total || 0;
-     $('#db-ca-nhan-sub').text(s.caNhan || 0);
+     const caNhan   = s.caNhan || 0;
-     $('#db-hkd-sub').text(s.hkd || 0);
+     const hkd      = s.hkd || 0;
-     $('#db-ca-nhan').text(s.caNhan || 0);
+ 
-     $('#db-hkd-count').text(s.hkd || 0);
+     // Cập nhật số liệu KPI cards — IDs phải khớp chính xác với index.html
-     $('#db-activated').text(s.activated || 0);
+     $('#db-total').text(total);
-     $('#db-inactive').text(s.inactive || 0);
+     $('#db-activated').text(s.activated || 0);
- }
+     $('#db-inactive').text(s.inactive || 0);
- 
+     $('#db-canhan').text(caNhan);   // ID trong HTML là db-canhan (không có dấu gạch)
- function renderAdminTopStaff(allStaffs) {
+     $('#db-hkd').text(hkd);         // ID trong HTML là db-hkd
-     if (!allStaffs || allStaffs.length === 0) {
+ 
-         $('#db-topstaff').html('<div class="text-center text-muted small p-2">Không có dữ liệu cán bộ.</div>');
+     // Cập nhật thanh tiến trình phân bổ loại hình
-         return;
+     const pct = total > 0 ? Math.round(caNhan / total * 100) : 50;
-     }
+     $('#db-prog-canhan').css('width', pct + '%').attr('aria-valuenow', pct);
-     const sorted = [...allStaffs].sort((a,b) => (b.total || 0) - (a.total || 0)).slice(0, 5);
+     $('#db-prog-hkd').css('width', (100 - pct) + '%').attr('aria-valuenow', 100 - pct);
-     let html = '';
+ }
-     sorted.forEach((st, idx) => {
+ 
-         let rankColor = 'text-secondary';
+ function renderAdminTopStaff(allStaffs) {
-         let trophy = `<span class="fw-bold ms-2">${idx + 1}.</span>`;
+     if (!allStaffs || allStaffs.length === 0) {
-         if (idx === 0) { rankColor = 'text-warning'; trophy = `<i class='bx bxs-trophy ms-1 fs-5 text-warning'></i>`; }
+         $('#db-topstaff').html('<div class="text-center text-muted small p-2">Không có dữ liệu cán bộ.</div>');
-         else if (idx === 1) { rankColor = 'text-secondary'; trophy = `<
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [charts, _parseStats, initDashboard, renderAdminStats, renderAdminTopStaff]
- **[convention] Fixed null crash in DataTable — prevents XSS injection attacks — confirmed 3x**: -                 <td>${statusDot} <span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'] || 'Cá nhân')}</span></td>
+                 <td class="text-secondary"><small>${utils_escapeHTML((d['Số tài khoản'] || '').toString().replace(/^'/, ''))}</small></td>
-                 <td class="text-secondary"><small>${utils_escapeHTML((d['Số tài khoản'] || '').toString().replace(/^'/, ''))}</small></td>
+                 <td>${statusDot} <span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'] || 'Cá nhân')}</span></td>
-                 <td><small>${utils_escapeHTML(staffName)}</small></td>
+                 <td><small>${utils_escapeHTML(d['Số điện thoại'] || '')}</small></td>
-                 <td class="text-end">
+                 <td><small>${utils_escapeHTML(staffName)}</small></td>
-                     <button class="btn btn-sm btn-outline-primary px-2 btn-detail" title="Chi tiết">
+                 <td class="text-end">
-                         <i class="bx bx-search-alt"></i>
+                     <button class="btn btn-sm btn-outline-primary px-2 btn-detail" title="Chi tiết">
-                     </button>
+                         <i class="bx bx-search-alt"></i>
-                 </td>
+                     </button>
-             </tr>`;
+                 </td>
-     }).join('');
+             </tr>`;
- 
+     }).join('');
-     $('#tblKH tbody').html(html);
+ 
- 
+     $('#tblKH tbody').html(html);
-     const selStaff = $('#filterStaffAdmin');
+ 
-     if (selStaff.find('option').length <= 1 && allStaffs.length > 0) {
+     const selStaff = $('#filterStaffAdmin');
-         allStaffs.sort((a,b) => (a.name||'').localeCompare(b.name||'')).forEach(st => {
+     if (selStaff.find('option').length <= 1 && allStaffs.length > 0) {
-             selStaff.append(`<option value="${st.email}">${st.name}</option>`);
+         allStaffs.sort((a,b) => (a.name||'').localeCompare(b.name||'')).forEach(st => {

… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [charts, _parseStats, initDashboard, renderAdminStats, renderAdminTopStaff]
- **[what-changed] 🟢 Edited netlify-app/js/registration.js (7 changes, 15min)**: Active editing session on netlify-app/js/registration.js.
7 content changes over 15 minutes.
- **[what-changed] what-changed in customer.js**: -                                 ${isVerified ? '<span class="ms-auto badge rounded-pill bg-success-subtle text-success border border-success-subtle"><i class="bx bxs-check-circle"></i> Đã duyệt</span>' : ''}
+                                 ${status === 'Đã kích hoạt' ? '<span class="ms-auto badge rounded-pill bg-success-subtle text-success border border-success-subtle"><i class="bx bxs-check-circle"></i> Đã kích hoạt</span>' : ''}

📌 IDE AST Context: Modified symbols likely include [initMyCustomersList, renderStaffDashboardLocal, updateStaffRankings, staffChartInstance, renderStaffLineChart]
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
