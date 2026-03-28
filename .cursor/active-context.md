> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\app.js` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[problem-fix] Patched security issue Initialize — prevents XSS injection attacks**: - 
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
- **[problem-fix] Patched security issue AppState — prevents XSS injection attacks**: -     runAPI('api_getAdminDashboardData', {}, (res) => {
+     runAPI('api_getAdminDashboardData', { email: AppState.user.email }, (res) => {
-                 <td class="fw-bold text-dark">${d['Tên khách hàng'] || ''}</td>
+                 <td class="fw-bold text-dark">${utils_escapeHTML(d['Tên khách hàng'] || '')}</td>
-                 <td><span class="badge bg-light text-dark border">${d['Loại hình dịch vụ'] || 'Cá nhân'}</span></td>
+                 <td><span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'] || 'Cá nhân')}</span></td>
-                 <td class="text-secondary"><small>${(d['Số tài khoản'] || '').toString().replace(/^'/, '')}</small></td>
+                 <td class="text-secondary"><small>${utils_escapeHTML((d['Số tài khoản'] || '').toString().replace(/^'/, ''))}</small></td>
-                 <td class="d-none">${staffEmail}</td>
+                 <td class="d-none">${utils_escapeHTML(staffEmail)}</td>
-                 <td><small>${staffName}</small></td>
+                 <td><small>${utils_escapeHTML(staffName)}</small></td>
-         $('#edit_images_container').html(infoHtml + imgsBlock);
+         // Sanitize data before injection
-         $('#modalEditCustomer').modal('show');
+         const safeInfoHtml = `<div class="col-12 mb-2"><div class="p-2 bg-white rounded border d-flex gap-2 shadow-sm">
-     } catch(err) { console.error(err); }
+                            <span class="badge bg-primary">${utils_escapeHTML(loaiHinh)}</span>
- }
+                            <span>CCCD: <b>${utils_escapeHTML(cccdVal)}</b></span></div></div>`;
- 
+         $('#edit_images_container').html(safeInfoHtml + imgsBlock);
- /**
+         $('#modalEditCustomer').modal('show');
-  * APP INITIALIZATION
+     } catch(err) { console.error(err); }
-  */
+ }
- $(document).ready(() => {
+ 
-     if (!AppState.user) {
+ 
-         showView('view-login');
+ /**
-         hideLoading();
+  * APP INITIALIZATION
-     } else {
+  *
… [diff truncated]

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
- **[what-changed] what-changed in app.js**: -     const btn = $('#btnSaveChangePwd');
+     const btn = $('#btnSubmitChangePwd');

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[what-changed] what-changed in app.js**: -             runAPI('api_getadmindashboarddata', {}, (adminRes) => {
+             runAPI('api_getAdminDashboardData', {}, (adminRes) => {
- 
+ window.openEditCustomerModal = openEditCustomerModal;
+ 

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
- **[convention] Patched security issue VERSION — offloads heavy computation off the main thread — confirmed 3x**: -     VERSION: "2.0.0-HIFI",
+     VERSION: "2.1.0-AUDITED",
-     apiBase: "" // Sẽ được cập nhật từ URL triển khai
+     apiBase: "",
- };
+     lastActive: Date.now()
- 
+ };
- /**
+ 
-  * CACHE SYSTEM
+ /**
-  */
+  * AUTO-LOGOUT SECURITY
- const AppCache = {
+  */
-     data: {},
+ const INACTIVITY_LIMIT = 60 * 60 * 1000; // 60 minutes
-     timestamp: {},
+ function checkInactivity() {
-     TTL: 180000, 
+     if (AppState.user && (Date.now() - AppState.lastActive > INACTIVITY_LIMIT)) {
-     isFresh(key) {
+         logout();
-         if (!this.timestamp[key]) return false;
+         showAlert('Hết phiên làm việc', 'Phiên làm việc đã kết thúc do bạn không hoạt động trong 60 phút.', 'warning');
-         return (Date.now() - this.timestamp[key]) < this.TTL;
+     }
-     },
+ }
-     set(key, val) {
+ $(document).on('click keydown scroll mousedown touchstart', () => AppState.lastActive = Date.now());
-         this.data[key] = val;
+ setInterval(checkInactivity, 5 * 60 * 1000);
-         this.timestamp[key] = Date.now();
+ 
-     },
+ 
-     get(key) {
+ /**
-         return this.isFresh(key) ? this.data[key] : null;
+  * CACHE SYSTEM
-     },
+  */
-     clear(key) {
+ const AppCache = {
-         delete this.data[key];
+     data: {},
-         delete this.timestamp[key];
+     timestamp: {},
-     },
+     TTL: 180000, 
-     clearAll() {
+     isFresh(key) {
-         this.data = {};
+         if (!this.timestamp[key]) return false;
-         this.timestamp = {};
+         return (Date.now() - this.timestamp[key]) < this.TTL;
-     }
+     },
- };
+     set(key, val) {
- 
+         this.data[key] = val;
- /**
+         this.timestamp[key] = Date.now();
-  * CORE API WRAPPER
+     },
-  * Hardened with Timeout (30s) and Auto-Retry (Max 2)
+     get(key) {
-  */
+         return this.isFresh(key) ? this.data[key] : null;
- async function runAPI(action, data = {}, successHandler, errorHandler, loadingMsg = 'Đang xử lý...', retryCount = 0) {
+     },
-     i
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Fixed null crash in Last — wraps unsafe operation in error boundary — confirmed 3x**: -     // Sap xep giam dan theo tong ho so, giong voi thu tu xep hang that su
+     let staffs = adminData.allStaffs;
-     const staffs = [...adminData.allStaffs].sort((a, b) => (b.total || 0) - (a.total || 0));
+     let rank = staffs.findIndex(s => s.email === email) + 1;
-     const rank = staffs.findIndex(s => s.email === email) + 1;
+     let me = staffs.find(s => s.email === email);
-     const me = staffs.find(s => s.email === email);
+     
-     
+     if (rank > 0) {
-     if (rank > 0) {
+         $('#staffDash-rank').text(`#${rank} / ${staffs.length}`);
-         $('#staffDash-rank').text(`#${rank} / ${staffs.length}`);
+     } else {
-     } else {
+         $('#staffDash-rank').text('Chưa xếp hạng');
-         $('#staffDash-rank').text('Chưa xếp hạng');
+     }
-     }
+ 
- 
+     if (staffs.length > 0) {
-     // Hien thi Top 1
+         let top1 = staffs[0];
-     if (staffs.length > 0) {
+         $('#staffDash-top1Name').text(top1.name || top1.email);
-         let top1 = staffs[0];
+         $('#staffDash-top1Count').text(`${top1.total} hồ sơ`);
-         $('#staffDash-top1Name').text(top1.name || top1.email);
+     }
-         $('#staffDash-top1Count').text(`${top1.total} hồ sơ`);
+ }
-     }
+ 
- 
+ let staffChartInstance = null;
-     // Hien thi nguoi xep hang ngay tren minh (khong lo ten, chi so luong)
+ function renderStaffLineChart(timeline) {
-     const aboveCard = $('#staffDash-above');
+     const ctx = document.getElementById('chartStaffMonthly');
-     if (rank > 1) {
+     if (!ctx) return;
-         const above = staffs[rank - 2]; // rank-1 la chi so, -1 nua la vi tri tren
+     
-         aboveCard.closest('.dash-card-above').removeClass('d-none');
+     // Last 30 days calculation
-         aboveCard.html(
+     let labels = [];
-             `<div class="text-muted mb-1" style="font-size:11px;">Ngay tr\u00ean b\u1ea1n (h\u1ea1ng #${rank - 1}):</div>` +
+     let counts = [];
-             `<span class="fw-bold text-warning fs-5">
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[what-changed] 🟢 Edited netlify-app/app.js (15 changes, 41min)**: Active editing session on netlify-app/app.js.
15 content changes over 41 minutes.
- **[convention] Fixed null crash in OPENCV — offloads heavy computation off the main thread — confirmed 3x**: -  * OPENCV & IMAGE PROCESSING (PORTED)
+  * OPENCV & IMAGE PROCESSING
-  */
+  * Hardened version based on GAS production frmMoTaiKhoan.html.
- let isCvReady = false;
+  */
- let currentInputTargetId = null;
+ let isCvReady = false;
- let quadPoints = [ {x:0.1, y:0.1}, {x:0.9, y:0.1}, {x:0.9, y:0.9}, {x:0.1, y:0.9} ];
+ let currentInputTargetId = null;
- let activePointIndex = -1;
+ let quadPoints = [ {x:0.1, y:0.1}, {x:0.9, y:0.1}, {x:0.9, y:0.9}, {x:0.1, y:0.9} ];
- let imageMatStore = {};
+ let activePointIndex = -1;
- 
+ let imageMatStore = {}; // Map: targetId -> cv.Mat (image)
- function onOpenCvReady() {
+ 
-     isCvReady = true;
+ function onOpenCvReady() {
-     console.log("OpenCV.js matches production version & logic ready.");
+     isCvReady = true;
-     // Un-disable any camera buttons if they were disabled
+     console.log('OpenCV.js ready (Netlify).');
-     $('.btn-outline-primary i.bx-camera, .btn-outline-primary i.bx-qr-scan').closest('.btn').prop('disabled', false).removeClass('disabled');
+ }
- }
+ 
- 
+ /**
- function processImageWithAI(source) {
+  * Giai phong tat ca Mat con ton dong trong imageMatStore
-     return new Promise((resolve) => {
+  */
-         if (!isCvReady || !window.cv) return resolve(source);
+ function _cleanupAllMats() {
-         const img = new Image();
+     Object.keys(imageMatStore).forEach(key => {
-         img.onload = () => {
+         try { imageMatStore[key].delete(); } catch(e) {}
-             let src, dst, contours, hierarchy, maxContour;
+         delete imageMatStore[key];
-             try {
+     });
-                 src = cv.imread(img);
+ }
-                 dst = new cv.Mat();
+ 
-                 cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
+ /**
-                 cv.GaussianBlur(dst, dst, new cv.Size(5, 5), 0);
+  * Giai phong Mat cho 1 targetId cu the
-                 cv.Canny(dst, dst, 75, 200, 3, false);
+  */
-                 contours = new cv.MatVector();
+ function _cleanupMat(targetId) {

… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[convention] Added session cookies authentication — confirmed 3x**: - function handleLoginSuccess(silent) {
+ /**
-     hideLoading();
+  * Xử lý Lưu thay đổi Hồ sơ Khách hàng
-     const userName = AppState.user.fullName || AppState.user.name || AppState.user.email;
+  */
-     if (!silent) showAlert('Thành công', `Chào mừng ${userName}!`, 'success');
+ function handleEditCustomer(e) {
-     
+     e.preventDefault(); // Ngăn reload trang khi submit form
-     $('#user-name-display-admin').text(userName);
+ 
-     $('#user-name-display-user').text(userName);
+     const id = $('#edit_id').val();
-     
+     if (!id) {
-     if (AppState.user.role === 'Admin') {
+         showAlert('Lỗi', 'Không tìm thấy mã hồ sơ để cập nhật.', 'error');
-         $('#staffBottomNav').addClass('d-none');
+         return;
-         showView('view-dashboard');
+     }
-         initDashboard();
+ 
-     } else {
+     const btn = $('#btnSaveEdit');
-         $('#staffBottomNav').removeClass('d-none');
+     const oldHtml = btn.html();
-         showView('view-mo-tai-khoan');
+     btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang lưu...');
-         initMoTaiKhoanForm();
+ 
-     }
+     const sdtVal = $('#edit_sdt').val().trim();
- }
+     if (sdtVal && !/^0\d{9}$/.test(sdtVal)) {
- 
+         showAlert('Lỗi', 'Số điện thoại phải bắt đầu bằng 0 và đủ 10 chữ số.', 'warning');
- function logout() {
+         btn.prop('disabled', false).html(oldHtml);
-     localStorage.removeItem('HOKINHDOANH_SESSION');
+         return;
-     sessionStorage.removeItem('HOKINHDOANH_SESSION');
+     }
-     AppCache.clearAll();
+ 
-     AppState.user = null;
+     const payload = {
-     $('#frm-login')[0].reset();
+         id: id,
-     window.location.reload();
+         email: AppState.user ? AppState.user.email : '',
- }
+         ten_kh:    $('#edit_ten_kh').val().trim().toUpperCase(),
- 
+         sdt:       sdtVal,
- window.onOpenCvReady = onOpenCvReady;
+         ngay_mo:   $('#edit_ngay_mo').val(),
- window.loadStaf
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[convention] what-changed in app.js — confirmed 3x**: -             { targets: [3, 4, 5, 6, 7, 8, 9, 11], visible: false },
+             { targets: [3, 4, 5, 6, 7, 8, 9], visible: false },

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[convention] Fixed null crash in AppState — confirmed 4x**: -         let row = null;
+         let sourceData = (AppState.user && AppState.user.role === 'Admin') ? (window._adminAllData || []) : ((AppCache.get('myCustomers') || {}).data || []);
-         let sourceData = (AppState.user && AppState.user.role === 'Admin') ? (window._adminAllData || []) : (AppCache.get('myCustomers') || []);
+         for (let i = 0; i < sourceData.length; i++) {
-         
+             if (String(sourceData[i]['ID'] || sourceData[i]['Mã GD']).trim() === String(id).trim()) {
-         for (let i = 0; i < sourceData.length; i++) {
+                 row = sourceData[i];
-             if (String(sourceData[i]['ID'] || sourceData[i]['Mã GD']).trim() === String(id).trim()) {
+                 break;
-                 row = sourceData[i];
+             }
-                 break;
+         }
-             }
+         if (!row) return;
-         }
+ 
-         if (!row) return;
+         $('#edit_id').val(id);
- 
+         $('#edit_ten_kh').val(row['Tên khách hàng'] || '');
-         $('#edit_id').val(id);
+         $('#edit_sdt').val((row['Số điện thoại'] || '').toString().replace(/^'/, ''));
-         $('#edit_ten_kh').val(row['Tên khách hàng'] || '');
+         
-         $('#edit_sdt').val((row['Số điện thoại'] || '').toString().replace(/^'/, ''));
+         let dDate = row['Ngày mở TK'] || row['Thời điểm nhập'] || '';
-         
+         if (dDate) {
-         let dDate = row['Ngày mở TK'] || row['Thời điểm nhập'] || '';
+             const rawD = new Date(dDate);
-         if (dDate) {
+             if (!isNaN(rawD)) {
-             const rawD = new Date(dDate);
+                 dDate = String(rawD.getDate()).padStart(2, '0') + '/' + String(rawD.getMonth() + 1).padStart(2, '0') + '/' + rawD.getFullYear();
-             if (!isNaN(rawD)) {
+             }
-                 dDate = String(rawD.getDate()).padStart(2, '0') + '/' + String(rawD.getMonth() + 1).padStart(2, '0') + '/' + rawD.getFullYear();
+         }
-             }
+         $('#ed
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
