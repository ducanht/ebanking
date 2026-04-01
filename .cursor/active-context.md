> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\js\registration.js` (Domain: **Generic Logic**)

### 🔴 Generic Logic Gotchas
- **⚠️ GOTCHA: Fixed null crash in DataTable — wraps unsafe operation in error boundary**: -         let html = '';
+         // P1-FIX: Sắp xếp theo thứ hạng giảm dần (tổng hồ sơ cao nhất lên đầu)
-         arr.forEach((st, idx) => {
+         const sorted = [...arr].sort((a, b) => (b.total || 0) - (a.total || 0));
-             html += `<tr><td>${idx+1}</td><td class="fw-bold">${st.name}</td><td>${st.department}</td><td>${st.total}</td><td>${st.caNhan||0}</td><td>${st.hkd||0}</td></tr>`;
+         let html = '';
-         });
+         sorted.forEach((st, idx) => {
-         $('#tblAllStaffs tbody').html(html);
+             let rankBadge = `<span class="fw-bold text-muted">${idx + 1}</span>`;
-         if(dtAllStaffs) try { dtAllStaffs.destroy(); } catch(e){}
+             if (idx === 0) rankBadge = `<i class='bx bxs-trophy text-warning fs-5'></i>`;
-         dtAllStaffs = $('#tblAllStaffs').DataTable({
+             else if (idx === 1) rankBadge = `<i class='bx bxs-medal text-secondary fs-5'></i>`;
-             responsive: true,
+             else if (idx === 2) rankBadge = `<i class='bx bxs-medal fs-5' style="color:#cd7f32"></i>`;
-             dom: "<'row mb-2'<'col-sm-12 col-md-4 d-flex align-items-center justify-content-start'l><'col-sm-12 col-md-4 d-flex align-items-center justify-content-center'B><'col-sm-12 col-md-4 d-flex align-items-center justify-content-end'f>>" +
+             html += `<tr>
-                  "<'row'<'col-sm-12'tr>>" +
+                 <td class="text-center">${rankBadge}</td>
-                  "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
+                 <td class="fw-bold">${st.name}</td>
-             buttons: [{ extend: 'excelHtml5', text: '<i class="bx bxs-file-export"></i> Xuất Excel', className: 'btn btn-sm btn-success shadow-sm' }],
+                 <td class="text-secondary">${st.department || 'N/A'}</td>
-             language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json" }
+                 <td class="fw-bold text-primary">${st.total}</td>
-         });
+                
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [charts, _parseStats, initDashboard, renderAdminStats, renderAdminTopStaff]

### 📐 Generic Logic Conventions & Fixes
- **[problem-fix] Fixed null crash in Canvas**: -             maxSizeMB: 0.8,
+             maxSizeMB: 0.4, // P1-FIX: Giảm từ 0.8 xuống 0.4
-             maxWidthOrHeight: 2048,
+             maxWidthOrHeight: 1280, // P1-FIX: Giảm từ 2048 xuống 1280
-             data[slot.id] = await new Promise(r => {
+             
-                 const reader = new FileReader();
+             // P1-FIX: Tuyệt đối KHÔNG gửi file gốc. Dùng Canvas chặn đứng file lớn.
-                 reader.onload = (e) => r(e.target.result);
+             data[slot.id] = await new Promise(r => {
-                 reader.readAsDataURL(file);
+                 const img = new Image();
-             });
+                 img.onload = () => {
-         }
+                     let w = img.width, h = img.height;
-     }
+                     const maxDim = 1280;
- 
+                     if (w > maxDim || h > maxDim) {
-     updateUIProgress('Đang mã hóa & chuẩn bị gửi máy chủ...', 90);
+                         const ratio = Math.min(maxDim / w, maxDim / h);
-     btn.html('<span class="spinner-border spinner-border-sm"></span> Đang lưu hồ sơ...');
+                         w = Math.round(w * ratio);
-     
+                         h = Math.round(h * ratio);
-     await new Promise(r => setTimeout(r, 400));
+                     }
-     updateUIProgress('Đang gửi dữ liệu & đồng bộ cơ sở dữ liệu...', 95);
+                     const canvas = document.createElement('canvas');
- 
+                     canvas.width = w; canvas.height = h;
-     runAPI('api_submitregistration', data, (res) => {
+                     const ctx = canvas.getContext('2d');
-         btn.prop('disabled', false).html(oldBtn);
+                     ctx.drawImage(img, 0, 0, w, h);
-         if (res.status === 'success') {
+                     r(canvas.toDataURL('image/jpeg', 0.7)); // Nén 70%
-             updateUIProgress('Hồ sơ đã được gửi thành công!', 100);
+                 };
-             progressBar.addClass('bg-success');
+                 img.onerror = () => {
- 
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [initMoTaiKhoanForm, toggleFormFields, handleRegistration, checkDuplicate, loadStaffOpenAccountView]
- **[convention] Fixed null crash in Enter — offloads heavy computation off the main thread — confirmed 4x**: -     const invalidFields = $('#frm-mo-tk .is-invalid');
+     // P2-FIX: Re-trigger duplicate check cho tất cả fields quan trọng nếu chưa được check
-     if (invalidFields.length > 0) {
+     // (Trường hợp user nhập nhanh + Enter mà chưa kịp blur)
-         showAlert('Thông tin chưa khớp', 'Vui lòng kiểm tra lại các trường đang báo đỏ (có thể bị trùng dữ liệu).', 'warning');
+     const fieldsToValidate = ['cccd', 'sdt', 'so_tk'];
-         btn.prop('disabled', false).html(oldBtn);
+     let hasInvalidPattern = false;
-         return;
+     fieldsToValidate.forEach(fieldId => {
-     }
+         const el = document.getElementById(fieldId);
- 
+         if (el && el.value.trim() && !el.checkValidity()) {
-     btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
+             $(el).addClass('is-invalid');
-     progressWrapper.removeClass('initially-hidden').removeClass('d-none').show();
+             hasInvalidPattern = true;
-     progressBar.css('width', '0%');
+         }
-     progressPct.text('0%');
+     });
-     const fileSlots = [
+     if (hasInvalidPattern) {
-         { id: 'img_truoc', label: 'CCCD Trước' },
+         showAlert('Thông tin chưa hợp lệ', 'Vui lòng kiểm tra lại định dạng CCCD (12 số), SĐT (10 số bắt đầu 0), Số TK (9 số).', 'warning');
-         { id: 'img_sau',   label: 'CCCD Sau' },
+         return;
-         { id: 'img_dkkd',  label: 'Giấy phép' },
+     }
-         { id: 'img_qr',    label: 'Mã QR' },
+ 
-         { id: 'img_thuchien', label: 'Ảnh thực hiện' }
+     // Kiểm tra có trường nào đang báo is-invalid (kể cả từ checkDuplicate) không
-     ];
+     const invalidFields = $('#frm-mo-tk .is-invalid');
- 
+     if (invalidFields.length > 0) {
-     const getSafeVal = (id) => ($(`#${id}`).val() || "").trim();
+         showAlert('Thông tin chưa khớp', 'Vui lòng kiểm tra lại các trường đang báo đỏ (có thể bị trùng dữ liệu).', 'warning');
- 
+         invalidFields.first().focus
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [initMoTaiKhoanForm, toggleFormFields, handleRegistration, checkDuplicate, loadStaffOpenAccountView]
- **[convention] Fixed null crash in AppState — offloads heavy computation off the main thread — confirmed 3x**: -         action: "api_submitregistration",
+         email: AppState.user.email,
-         email: AppState.user.email,
+         loai_hinh: $('#loai_hinh').val(),
-         loai_hinh: $('#loai_hinh').val(),
+         ten_kh: getSafeVal('ten_kh'),
-         ten_kh: getSafeVal('ten_kh'),
+         cccd: getSafeVal('cccd'),
-         cccd: getSafeVal('cccd'),
+         dkkd: getSafeVal('dkkd'),
-         dkkd: getSafeVal('dkkd'),
+         sdt: getSafeVal('sdt'),
-         sdt: getSafeVal('sdt'),
+         so_tk: '3800200' + getSafeVal('so_tk'),
-         so_tk: '3800200' + getSafeVal('so_tk'),
+         ten_dang_nhap: getSafeVal('ten_dang_nhap'),
-         ten_dang_nhap: getSafeVal('ten_dang_nhap'),
+         ngay_mo: $('#ngay_mo').val(),
-         ngay_mo: $('#ngay_mo').val(),
+         mat_khau: $('#mat_khau').val() || "",
-         mat_khau: $('#mat_khau').val() || "",
+         is_activated: $('#is_activated').is(':checked')
-         is_activated: $('#is_activated').is(':checked')
+     };
-     };
+ 
- 
+     const filesToProcess = fileSlots.filter(s => document.getElementById(s.id) && document.getElementById(s.id).files[0]);
-     const filesToProcess = fileSlots.filter(s => document.getElementById(s.id) && document.getElementById(s.id).files[0]);
+     const totalSteps = filesToProcess.length + 2; 
-     const totalSteps = filesToProcess.length + 2; 
+     let currentStep = 0;
-     let currentStep = 0;
+ 
- 
+     const updateUIProgress = (msg, pct) => {
-     const updateUIProgress = (msg, pct) => {
+         progressLabel.text(msg);
-         progressLabel.text(msg);
+         progressBar.css('width', `${pct}%`).attr('aria-valuenow', pct);
-         progressBar.css('width', `${pct}%`).attr('aria-valuenow', pct);
+         progressPct.text(`${pct}%`);
-         progressPct.text(`${pct}%`);
+     };
-     };
+ 
- 
+     const compressWithTimeout = (file, slotLabel, ms = 15000) => {
-     const compressWithTimeout = (file, slotLabel, ms = 15000) => {
+       
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [initMoTaiKhoanForm, toggleFormFields, handleRegistration, checkDuplicate, loadStaffOpenAccountView]
- **[what-changed] 🟢 Edited netlify-app/js/registration.js (7 changes, 15min)**: Active editing session on netlify-app/js/registration.js.
7 content changes over 15 minutes.
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
- **[problem-fix] Fixed null crash in Math — wraps unsafe operation in error boundary**: - function finishCropping() {
+ function resizeCanvasIfNeed(srcCanvas, maxDim = 1280) {
-     const mat = imageMatStore[currentInputTargetId];
+     let w = srcCanvas.width;
-     if (!mat || !isCvReady) {
+     let h = srcCanvas.height;
-         skipCropping();
+     if (w > maxDim || h > maxDim) {
-         return;
+         const ratio = Math.min(maxDim / w, maxDim / h);
-     }
+         w = Math.round(w * ratio);
-     try {
+         h = Math.round(h * ratio);
-         const srcPoints = [];
+         const resCanvas = document.createElement('canvas');
-         quadPoints.forEach(p => { srcPoints.push(p.x * mat.cols); srcPoints.push(p.y * mat.rows); });
+         resCanvas.width = w;
-         const w = Math.max(
+         resCanvas.height = h;
-             Math.hypot(srcPoints[4]-srcPoints[6], srcPoints[5]-srcPoints[7]),
+         const ctx = resCanvas.getContext('2d');
-             Math.hypot(srcPoints[2]-srcPoints[0], srcPoints[3]-srcPoints[1])
+         ctx.drawImage(srcCanvas, 0, 0, srcCanvas.width, srcCanvas.height, 0, 0, w, h);
-         );
+         return resCanvas;
-         const h = Math.max(
+     }
-             Math.hypot(srcPoints[2]-srcPoints[4], srcPoints[3]-srcPoints[5]),
+     return srcCanvas;
-             Math.hypot(srcPoints[0]-srcPoints[6], srcPoints[1]-srcPoints[7])
+ }
-         );
+ 
-         if (w < 10 || h < 10) { skipCropping(); return; }
+ function finishCropping() {
- 
+     const mat = imageMatStore[currentInputTargetId];
-         const srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, srcPoints);
+     if (!mat || !isCvReady) {
-         const dstCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, w, 0, w, h, 0, h]);
+         skipCropping();
-         const M = cv.getPerspectiveTransform(srcCoords, dstCoords);
+         return;
-         const warpedMat = new cv.Mat();
+     }
-         cv.warpPerspective(mat, warpedMat, M, new cv.Size(w, h), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
+     try {
-         cons
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [isCvReady, currentInputTargetId, quadPoints, activePointIndex, imageMatStore]
- **[problem-fix] Fixed null crash in DataTable — prevents XSS injection attacks**: -         const isActivated = (d['Trạng thái'] === 'Đã kích hoạt');
+         const rawStatus = (d['Trạng thái'] || d['trang_thai'] || '').toString().trim();
-         const statusDot = `<span class="status-dot ${isActivated ? 'active' : 'inactive'}" title="${d['Trạng thái'] || 'Chưa kích hoạt'}"></span>`;
+         const isActivated = rawStatus.toLowerCase().includes('đã kích hoạt') || rawStatus.toLowerCase().includes('activated');
-         
+         const statusDot = `<span class="status-dot ${isActivated ? 'active' : 'inactive'}" title="${rawStatus || 'Chưa kích hoạt'}"></span>`;
-         // Số TK: GAS trả về field 'Số TK', fallback sang 'Số tài khoản' nếu có
+         
-         const soTk = (d['Số TK'] || d['Số tài khoản'] || '').toString().replace(/^'/, '');
+         // Số TK: GAS trả về field 'Số TK', fallback sang 'Số tài khoản' nếu có
- 
+         const soTk = (d['Số TK'] || d['Số tài khoản'] || '').toString().replace(/^'/, '');
-         return `
+ 
-             <tr data-id="${rowId}" class="clickable-row cursor-pointer flex-center">
+         return `
-                 <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
+             <tr data-id="${rowId}" class="clickable-row cursor-pointer flex-center">
-                 <td class="fw-bold text-dark">${utils_escapeHTML(d['Tên khách hàng'] || '')}</td>
+                 <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
-                 <td class="text-secondary"><small>${utils_escapeHTML(soTk)}</small></td>
+                 <td class="fw-bold text-dark">${utils_escapeHTML(d['Tên khách hàng'] || '')}</td>
-                 <td>${statusDot} <span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'] || 'Cá nhân')}</span></td>
+                 <td class="text-secondary"><small>${utils_escapeHTML(soTk)}</small></td>
-                 <td><small>${utils_escapeHTML(d['Số điện thoại'] || '')}</small
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [charts, _parseStats, initDashboard, renderAdminStats, renderAdminTopStaff]
- **[problem-fix] Fixed null crash in DataTable — prevents XSS injection attacks**: -         const isActivated = (d['Trạng thái'] === 'Đã kích hoạt');
+         const rawStatus = (d['Trạng thái'] || d['trang_thai'] || '').toString().trim();
-         const statusDot = `<span class="status-dot ${isActivated ? 'active' : 'inactive'}" title="${d['Trạng thái'] || 'Chưa kích hoạt'}"></span>`;
+         const isActivated = rawStatus.toLowerCase().includes('đã kích hoạt') || rawStatus.toLowerCase().includes('activated');
-         return `
+         const statusDot = `<span class="status-dot ${isActivated ? 'active' : 'inactive'}" title="${rawStatus || 'Chưa kích hoạt'}"></span>`;
-             <tr data-id="${rowId}" class="clickable-row cursor-pointer">
+         return `
-                 <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
+             <tr data-id="${rowId}" class="clickable-row cursor-pointer">
-                 <td class="fw-bold text-dark">${utils_escapeHTML(d['Tên khách hàng'])}</td>
+                 <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
-                 <td class="text-secondary"><small>${utils_escapeHTML(d['Số TK'] || d['Số tài khoản'] || '')}</small></td>
+                 <td class="fw-bold text-dark">${utils_escapeHTML(d['Tên khách hàng'])}</td>
-                 <td>${statusDot} <span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'])}</span></td>
+                 <td class="text-secondary"><small>${utils_escapeHTML(d['Số TK'] || d['Số tài khoản'] || '')}</small></td>
-                 <td><small>${utils_escapeHTML(d['Số điện thoại'])}</small></td>
+                 <td>${statusDot} <span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'])}</span></td>
-                 <td class="text-end">
+                 <td><small>${utils_escapeHTML(d['Số điện thoại'])}</small></td>
-                     <button class="btn btn-sm btn-outline-primary shadow-sm btn-detail" title="Xem 
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [initMyCustomersList, renderStaffDashboardLocal, updateStaffRankings, staffChartInstance, renderStaffLineChart]
- **[trade-off] trade-off in api.js**: - const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyXBMdJO2JmoaarxW9l7mg-l4tyN6BF1U01jaMPQ48xmVOZM9WFWLnOTIc9Wyf1OpFr/exec";
+ const GAS_API_URL = "https://script.google.com/macros/s/AKfycbwewU3acuzWSY6_HwoVeP3XDJx876QqzDJiZ2_tL8HvsnsYQfTwzXfWiwcpaWm1zGMP/exec";

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, runAPI]
- **[what-changed] what-changed in # Nguyên tắc cốt lõi (Core Principles).ini**: File updated (external): netlify-app/js/# Nguyên tắc cốt lõi (Core Principles).ini

Content summary (12 lines):
# Nguyên tắc cốt lõi (Core Principles)

Dưới đây là các nguyên tắc cốt lõi giúp Agent có thể tự phát triển và học hỏi trong quá trình tương tác:

## 1. Tự Động Học Hỏi & Tiến Hóa (Auto-Evolution)
Mỗi khi Agent trong quá trình chạy, debug, hoặc trò chuyện với User mà phát hiện ra một **quy luật (rule)**, **kinh nghiệm**, hoặc **phương pháp giải quyết vấn đề mới** mang tính chất quan trọng và có khả năng tái sử dụng cho các lần sau:
- Agent **PHẢI** tạm dừng và cảnh báo tới User.
- Agent **
