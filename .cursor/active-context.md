> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\app.js` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[problem-fix] Patched security issue VERSION — offloads heavy computation off the main thread**: -     VERSION: "2.0.0-HIFI",
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
- **[problem-fix] Patched security issue Hardened — offloads heavy computation off the main thread**: -  */
+  * Hardened with Timeout (30s) and Auto-Retry (Max 2)
- async function runAPI(action, data = {}, successHandler, errorHandler, loadingMsg = 'Đang xử lý...') {
+  */
-     if (loadingMsg !== 'NONE') showLoading(loadingMsg);
+ async function runAPI(action, data = {}, successHandler, errorHandler, loadingMsg = 'Đang xử lý...', retryCount = 0) {
- 
+     if (loadingMsg !== 'NONE' && retryCount === 0) showLoading(loadingMsg);
-     try {
+ 
-         // Sử dụng text/plain để tránh kích hoạt CORS Preflight (OPTIONS request) mà GAS không hỗ trợ
+     const controller = new AbortController();
-         const response = await fetch(GAS_API_URL, {
+     const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout
-             method: "POST",
+ 
-             headers: {
+     try {
-                 "Content-Type": "text/plain;charset=utf-8"
+         const response = await fetch(GAS_API_URL, {
-             },
+             method: "POST",
-             body: JSON.stringify({ action: action, data: data })
+             headers: {
-         });
+                 "Content-Type": "text/plain;charset=utf-8"
- 
+             },
-         if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
+             body: JSON.stringify({ action: action, data: data }),
-         
+             signal: controller.signal
-         const result = await response.json();
+         });
-         
+ 
-         if (loadingMsg !== 'NONE') hideLoading();
+         clearTimeout(timeoutId);
-         if (successHandler) successHandler(result);
+ 
-         return result;
+         if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
- 
+         
-     } catch (error) {
+         const result = await response.json();
-         if (loadingMsg !== 'NONE') hideLoading();
+         
-         console.error(`API Error [${action}]:`, error);
+         if (loadingMsg !== 'NONE') hideLoading();
-         
+         if (successHandler) successHandler(result
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[what-changed] Added session cookies authentication**: -     const btn = $('#btnSubmitChangePwd');
+     btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
-     const oldHtml = btn.html();
+     
-     btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
+     // Hash passwords for security
-     
+     const oldH = CryptoJS.SHA256(oldP).toString();
-     runAPI('api_changepassword', {
+     const newH = CryptoJS.SHA256(newP).toString();
-         email: AppState.user.email,
+ 
-         oldHashed: CryptoJS.SHA256(oldP).toString(),
+     runAPI('api_changepassword', {
-         newHashed: CryptoJS.SHA256(newP).toString()
+         email: AppState.user.email,
-     }, (res) => {
+         oldHashed: oldH,
-         btn.prop('disabled', false).html(oldHtml);
+         newHashed: newH
-         if (res.status === 'success') {
+     }, (res) => {
-             showAlert('Thành công', 'Đổi mật khẩu thành công! Vui lòng truy cập hệ thống.', 'success');
+         btn.prop('disabled', false).html(oldHtml);
-             $('#modalChangePassword').modal('hide');
+ 
-             handleLoginSuccess(false);
+         if (res.status === 'success') {
-         } else {
+             showAlert('Thành công', 'Đổi mật khẩu thành công! Vui lòng truy cập hệ thống.', 'success');
-             showAlert('Lỗi', res.message, 'error');
+             $('#modalChangePassword').modal('hide');
-         }
+             handleLoginSuccess(false);
-     });
+         } else {
- }
+             showAlert('Lỗi', res.message, 'error');
- 
+         }
- /**
+     });
-  * Xử lý Lưu thay đổi Hồ sơ Khách hàng
+ }
-  */
+ 
- function handleEditCustomer(e) {
+ /**
-     e.preventDefault(); // Ngăn reload trang khi submit form
+  * Xử lý Lưu thay đổi Hồ sơ Khách hàng
- 
+  */
-     const id = $('#edit_id').val();
+ function handleEditCustomer(e) {
-     if (!id) {
+     e.preventDefault(); // Ngăn reload trang khi submit form
-         showAlert('Lỗi', 
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[problem-fix] Fixed null crash in Elements — offloads heavy computation off the main thread**: -     btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang nén ảnh...');
+     
- 
+     // UI Elements
-     progressWrapper.show();
+     const progressLabel = $('#compress-progress-label');
- 
+     const progressPct = $('#compress-progress-pct');
-     const fileSlots = [
+ 
-         { id: 'img_truoc', label: 'CCCD Trước' },
+     btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
-         { id: 'img_sau', label: 'CCCD Sau' },
+     progressWrapper.show();
-         { id: 'img_dkkd', label: 'Giấy phép' },
+     progressBar.css('width', '0%');
-         { id: 'img_qr', label: 'Mã QR' },
+     progressPct.text('0%');
-         { id: 'img_thuchien', label: 'Ảnh thực hiện' }
+ 
-     ];
+     const fileSlots = [
- 
+         { id: 'img_truoc', label: 'CCCD Trước' },
-     const data = {
+         { id: 'img_sau',   label: 'CCCD Sau' },
-         action: "api_submitregistration",
+         { id: 'img_dkkd',  label: 'Giấy phép' },
-         email: AppState.user.email,
+         { id: 'img_qr',    label: 'Mã QR' },
-         loai_hinh: $('#loai_hinh').val(),
+         { id: 'img_thuchien', label: 'Ảnh thực hiện' }
-         ten_kh: $('#ten_kh').val().trim(),
+     ];
-         cccd: $('#cccd').val().trim(),
+ 
-         dkkd: $('#dkkd').val().trim(),
+     const data = {
-         sdt: $('#sdt').val().trim(),
+         action: "api_submitregistration",
-         so_tk: '3800200' + $('#so_tk').val().trim(),
+         email: AppState.user.email,
-         ten_dang_nhap: $('#ten_dang_nhap').val().trim(),
+         loai_hinh: $('#loai_hinh').val(),
-         ngay_mo: $('#ngay_mo').val(),
+         ten_kh: $('#ten_kh').val().trim(),
-         mat_khau: $('#mat_khau').val() || ""
+         cccd: $('#cccd').val().trim(),
-     };
+         dkkd: $('#dkkd').val().trim(),
- 
+         sdt: $('#sdt').val().trim(),
-     let done = 0;
+         so_tk: '3800200' + $('#so_tk').val().trim
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[problem-fix] Fixed null crash in Find — wraps unsafe operation in error boundary**: -     } else {
+         
-         $('#staffDash-rank').text('Chưa xếp hạng');
+         // Find person immediately above
-     }
+         if (rank > 1) {
- 
+             const aboveMe = staffs[rank - 2];
-     if (staffs.length > 0) {
+             const diff = (aboveMe.total || 0) - (me.total || 0);
-         let top1 = staffs[0];
+             $('#staffDash-aboveRankInfo').html(`<i class='bx bx-trending-up'></i> Người xếp trên: <b>${aboveMe.total}</b> hồ sơ (cần thêm ${diff})`);
-         $('#staffDash-top1Name').text(top1.name || top1.email);
+         } else {
-         $('#staffDash-top1Count').text(`${top1.total} hồ sơ`);
+             $('#staffDash-aboveRankInfo').html(`<i class='bx bxs-check-circle text-success'></i> Đang dẫn đầu hệ thống!`);
-     }
+         }
- }
+     } else {
- 
+         $('#staffDash-rank').text('Chưa xếp hạng');
- let staffChartInstance = null;
+         $('#staffDash-aboveRankInfo').text('Cần tối thiểu 1 hồ sơ để xếp hạng.');
- function renderStaffLineChart(timeline) {
+     }
-     const ctx = document.getElementById('chartStaffMonthly');
+ 
-     if (!ctx) return;
+     if (staffs.length > 0) {
-     
+         let top1 = staffs[0];
-     // Last 30 days calculation
+         $('#staffDash-top1Name').text(top1.name || top1.email);
-     let labels = [];
+         $('#staffDash-top1Count').text(`${top1.total} hồ sơ`);
-     let counts = [];
+     }
-     let d = new Date();
+ }
-     for (let i = 29; i >= 0; i--) {
+ 
-         let tmp = new Date(d);
+ 
-         tmp.setDate(tmp.getDate() - i);
+ let staffChartInstance = null;
-         let sDate = `${String(tmp.getDate()).padStart(2,"0")}/${String(tmp.getMonth()+1).padStart(2,"0")}`;
+ function renderStaffLineChart(timeline) {
-         labels.push(sDate);
+     const ctx = document.getElementById('chartStaffMonthly');
-         counts.push(timeline[sDate] || 0);
+     if (!ctx) return;
-     }
+     
- 
+     // Last 30 days calculation
-     if (staffChartInstance) staffChar
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
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
- **[what-changed] Replaced auth Logo — adds runtime type validation before use**: -                         <img src="logo.png" class="app-logo" alt="Logo" style="height: 32px; width: 32px; object-fit: contain;">
+                         <img src="logo.png" class="app-logo" alt="Logo Quỹ Yên Thọ" title="Logo Quỹ Yên Thọ">
-                     <p class="text-muted mb-0 small mt-1">Xin chào, <span id="user-name-display-user" class="fw-bold text-dark"></span>!</p>
+ 
-                 </div>
+                     <p class="text-muted mb-0 small mt-1">Xin chào, <span id="user-name-display-user" class="fw-bold text-dark"></span>!</p>
-                 <div class="d-flex gap-2">
+                 </div>
-                     <button class="btn btn-outline-secondary btn-sm d-none d-sm-flex align-items-center gap-1 shadow-sm" onclick="$('#modalChangePassword').modal('show')">
+                 <div class="d-flex gap-2">
-                         <i class='bx bx-lock-open-alt fs-5'></i> <span class="d-none d-sm-inline">Đổi Pass</span>
+                     <button class="btn btn-outline-secondary btn-sm d-none d-sm-flex align-items-center gap-1 shadow-sm" onclick="$('#modalChangePassword').modal('show')">
-                     </button>
+                         <i class='bx bx-lock-open-alt fs-5'></i> <span class="d-none d-sm-inline">Đổi Pass</span>
-                     <button class="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 shadow-sm" onclick="logout()">
+                     </button>
-                         <i class='bx bx-log-out fs-5'></i> <span class="d-none d-sm-inline">Thoát</span>
+                     <button class="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 shadow-sm" onclick="logout()">
-                     </button>
+                         <i class='bx bx-log-out fs-5'></i> <span class="d-none d-sm-inline">Thoát</span>
-                 </div>
+                     </button>
-             </div>
+                 </div>
-             <div class="glass-card p-3 p-md-4 mb-4">
+             </div>
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Updated schema Premium**: - .select-auto-width { width: auto !important; }
+ 
- .chart-container-monthly { position: relative; height: 240px; }
+ .app-logo {
- canvas.canvas-responsive { max-width: 100%; height: auto; }
+     height: 32px;
- .quad-handle { cursor: move; stroke-width: 2; }
+     width: 32px;
- 
+     object-fit: contain;
- /* Premium Depth Enhancements */
+ }
- .glass-card {
+ .select-auto-width { width: auto !important; }
-     background: rgba(255, 255, 255, 0.8) !important;
+ .chart-container-monthly { position: relative; height: 240px; }
-     -webkit-backdrop-filter: blur(12px) !important;
+ canvas.canvas-responsive { max-width: 100%; height: auto; }
-     backdrop-filter: blur(12px) !important;
+ .quad-handle { cursor: move; stroke-width: 2; }
-     border: 1px solid rgba(255, 255, 255, 0.3) !important;
+ 
-     box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02) !important;
+ /* Premium Depth Enhancements */
- }
+ .glass-card {
- 
+     background: rgba(255, 255, 255, 0.8) !important;
- 
+     -webkit-backdrop-filter: blur(12px) !important;
- .btn-primary {
+     backdrop-filter: blur(12px) !important;
-     background-color: var(--emerald);
+     border: 1px solid rgba(255, 255, 255, 0.3) !important;
-     border-color: var(--emerald);
+     box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02) !important;
-     box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
+ }
- }
+ 
- .btn-primary:hover {
+ .btn-primary {
-     background-color: var(--emerald-dark);
+     background-color: var(--emerald);
-     border-color: var(--emerald-dark);
+     border-color: var(--emerald);
-     transform: translateY(-1px);
+     box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
-     box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3);
+ }
- }
+ 
- 
+ .btn-primary:hover {
- 
+     background-color: var(--emerald-dark);
+     border-color: var(--emerald-dark);
+     transform: translateY(-1px);
+     box-shadow: 0 6px 15px rgba(16, 1
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [:root, body, .glass-card, .glass-card:hover, #global-spinner]
- **[convention] convention in index.html**: -                             <input type="text" class="form-control text-uppercase" id="ten_kh" required>
+                             <input type="text" class="form-control text-uppercase" id="ten_kh" placeholder="NHẬP HỌ TÊN" title="Vui lòng nhập họ và tên khách hàng" required>
-                             <input type="text" class="form-control" id="cccd" pattern="[0-9]{12}" maxlength="12" title="Căn cước công dân bắt buộc đúng 12 chữ số" required onblur="checkDuplicate(this)">
+                             <input type="text" class="form-control" id="cccd" placeholder="12 số CCCD" pattern="[0-9]{12}" maxlength="12" title="Căn cước công dân bắt buộc đúng 12 chữ số" required onblur="checkDuplicate(this)">
-                             <input type="text" class="form-control text-uppercase" id="dkkd" onblur="checkDuplicate(this)">
+                             <input type="text" class="form-control text-uppercase" id="dkkd" placeholder="SỐ ĐKKD" title="Nhập số đăng ký kinh doanh" onblur="checkDuplicate(this)">
-                             <input type="tel" class="form-control" id="sdt" pattern="0[0-9]{9}" maxlength="10" title="Số điện thoại phải bắt đầu bằng 0 và đủ 10 chữ số" required onblur="checkDuplicate(this)">
+                             <input type="tel" class="form-control" id="sdt" placeholder="0xxxxxxxxx" pattern="0[0-9]{9}" maxlength="10" title="Số điện thoại phải bắt đầu bằng 0 và đủ 10 chữ số" required onblur="checkDuplicate(this)">
-                                 <input class="form-control" type="file" id="img_truoc" accept="image/*" required>
+                                 <input class="form-control" type="file" id="img_truoc" accept="image/*" title="Chọn ảnh mặt trước CCCD" required>
-                                 <input class="form-control" type="file" id="img_sau" accept="image/*" required>
+                                 <input class="form-control" type="file" id="img_sau" accept="image/*" title="Chọn ảnh mặt sau CCCD" required>
-   
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth CCCD — adds runtime type validation before use**: -                         <div class="chart-container-pie" style="height: 200px;"><canvas id="chartLoaiHinh"></canvas></div>
+                         <div class="chart-container-pie"><canvas id="chartLoaiHinh"></canvas></div>
-                             <label class="form-label fw-semibold">Loại hình</label>
+                             <label for="loai_hinh" class="form-label fw-semibold">Loại hình</label>
-                                 <option value="Cá nhân">Cá nhân</option>
+ 
-                                 <option value="Hộ kinh doanh">Hộ kinh doanh</option>
+                                 <option value="Cá nhân">Cá nhân</option>
-                             </select>
+                                 <option value="Hộ kinh doanh">Hộ kinh doanh</option>
-                         </div>
+                             </select>
-                         <div class="col-md-6">
+                         </div>
-                             <label class="form-label fw-semibold">Họ và Tên Khách/HKD</label>
+                         <div class="col-md-6">
-                             <input type="text" class="form-control text-uppercase" id="ten_kh" required>
+                             <label for="ten_kh" class="form-label fw-semibold">Họ và Tên Khách/HKD</label>
-                         </div>
+                             <input type="text" class="form-control text-uppercase" id="ten_kh" required>
-                         <div class="col-md-6">
+                         </div>
-                             <label class="form-label fw-semibold">Số CCCD (12 số)</label>
+ 
-                             <input type="text" class="form-control" id="cccd" pattern="[0-9]{12}" maxlength="12" title="Căn cước công dân bắt buộc đúng 12 chữ số" required onblur="checkDuplicate(this)">
+                         <div class="col-md-6">
-                             <div class="invalid-feedback">Căn cước công dân bắt buộc đúng 12 chữ số.</div>
+                     
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
