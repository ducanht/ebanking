> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\app.js` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
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
- **[convention] Strengthened types Kinh — adds runtime type validation before use**: -                     </div>
+                         <p class="mb-0 small text-secondary mt-1" id="staffDash-aboveRankInfo"></p>
-                 </div>
+                     </div>
-                 <div class="col-6 col-md-3">
+ 
-                     <div class="glass-card p-3 text-center border-start border-4 border-primary h-100 shadow-sm align-content-center">
+                 </div>
-                         <h6 class="text-muted mb-1 small text-uppercase">Cá nhân</h6>
+                 <div class="col-6 col-md-3">
-                         <h3 class="fw-bold text-primary mb-0" id="staffDash-canhan">--</h3>
+                     <div class="glass-card p-3 text-center border-start border-4 border-primary h-100 shadow-sm align-content-center">
-                     </div>
+                         <h6 class="text-muted mb-1 small text-uppercase">Cá nhân</h6>
-                 </div>
+                         <h3 class="fw-bold text-primary mb-0" id="staffDash-canhan">--</h3>
-                 <div class="col-6 col-md-3">
+                     </div>
-                     <div class="glass-card p-3 text-center border-start border-4 border-warning h-100 shadow-sm align-content-center">
+                 </div>
-                         <h6 class="text-muted mb-1 small text-uppercase">Kinh doanh</h6>
+                 <div class="col-6 col-md-3">
-                         <h3 class="fw-bold text-warning mb-0" id="staffDash-hkd">--</h3>
+                     <div class="glass-card p-3 text-center border-start border-4 border-warning h-100 shadow-sm align-content-center">
-                     </div>
+                         <h6 class="text-muted mb-1 small text-uppercase">Kinh doanh</h6>
-                 </div>
+                         <h3 class="fw-bold text-warning mb-0" id="staffDash-hkd">--</h3>
-                 <div class="col-6 col-md-3">
+                     </div>
-                     <div class="glass-card p-2 text-center bg-white border border-d
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] Strengthened types GIAN — adds runtime type validation before use**: -             <!-- Nguoi xep hang ngay tren -->
+             <div class="glass-card p-3 mb-4">
-             <div class="row g-3 mb-4 dash-card-above d-none">
+                 <h6 class="fw-bold mb-3 text-secondary text-uppercase"><i class='bx bx-trending-up'></i> Tiến độ cá nhân (30 ngày)</h6>
-                 <div class="col-12">
+                 <div class="chart-container-monthly"><canvas id="chartStaffMonthly"></canvas></div>
-                     <div class="glass-card p-3 border-start border-4 border-warning shadow-sm">
+             </div>
-                         <h6 class="text-muted mb-2 small text-uppercase"><i class='bx bx-up-arrow-alt text-warning'></i> Người ngay trên bạn</h6>
+             
-                         <div id="staffDash-above" class="text-center py-1">
+             <div class="glass-card p-3 p-md-4">
-                             <span class="spinner-border spinner-border-sm text-warning"></span>
+                 <div class="table-responsive">
-                         </div>
+                     <table id="tblMyCustomers" class="table table-hover dt-responsive nowrap w-100 align-middle">
-                     </div>
+                         <thead><tr><th>THỜI GIAN</th><th>Họ TÊN</th><th>CCCD</th><th>SỐ ĐKKD</th><th>LOẠI HÌNH</th><th>SỐ ĐIỆN THOẠI</th><th>TÊN CÁN BỘ</th><th>NGÀY MỞ TK</th><th>SỐ TÀI KHOẢN</th><th>TRẠNG THÁI</th><th class="text-end">XEM</th></tr></thead>
-                 </div>
+                         <tbody id="tbMyCustomersBody"></tbody>
-             </div>
+                     </table>
- 
+                 </div>
-             <div class="glass-card p-3 mb-4">
+             </div>
-                 <h6 class="fw-bold mb-3 text-secondary text-uppercase"><i class='bx bx-trending-up'></i> Tiến độ cá nhân (30 ngày)</h6>
+         </section>
-                 <div class="chart-container-monthly"><canvas id="chartStaffMonthly"></canvas></div>
+     </div>
-             </div>
+ 
-             
+     <!-- Mod
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] Strengthened types Nguoi — adds runtime type validation before use**: -             <div class="glass-card p-3 mb-4">
+             <!-- Nguoi xep hang ngay tren -->
-                 <h6 class="fw-bold mb-3 text-secondary text-uppercase"><i class='bx bx-trending-up'></i> Tiến độ cá nhân (30 ngày)</h6>
+             <div class="row g-3 mb-4 dash-card-above d-none">
-                 <div class="chart-container-monthly"><canvas id="chartStaffMonthly"></canvas></div>
+                 <div class="col-12">
-             </div>
+                     <div class="glass-card p-3 border-start border-4 border-warning shadow-sm">
-             
+                         <h6 class="text-muted mb-2 small text-uppercase"><i class='bx bx-up-arrow-alt text-warning'></i> Người ngay trên bạn</h6>
-             <div class="glass-card p-3 p-md-4">
+                         <div id="staffDash-above" class="text-center py-1">
-                 <div class="table-responsive">
+                             <span class="spinner-border spinner-border-sm text-warning"></span>
-                     <table id="tblMyCustomers" class="table table-hover dt-responsive nowrap w-100 align-middle">
+                         </div>
-                         <thead><tr><th>THỜI GIAN</th><th>Họ TÊN</th><th>CCCD</th><th>SỐ ĐKKD</th><th>LOẠI HÌNH</th><th>SỐ ĐIỆN THOẠI</th><th>TÊN CÁN BỘ</th><th>NGÀY MỞ TK</th><th>SỐ TÀI KHOẢN</th><th>TRẠNG THÁI</th><th class="text-end">XEM</th></tr></thead>
+                     </div>
-                         <tbody id="tbMyCustomersBody"></tbody>
+                 </div>
-                     </table>
+             </div>
-                 </div>
+ 
-             </div>
+             <div class="glass-card p-3 mb-4">
-         </section>
+                 <h6 class="fw-bold mb-3 text-secondary text-uppercase"><i class='bx bx-trending-up'></i> Tiến độ cá nhân (30 ngày)</h6>
-     </div>
+                 <div class="chart-container-monthly"><canvas id="chartStaffMonthly"></canvas></div>
- 
+             </div>
-     <!-- Modals -->
+      
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] Strengthened types Modal — adds runtime type validation before use**: -     <!-- Các Modal khác từ bản gốc -->
+     <!-- Modal Camera Live --  >
-     <div class="modal fade" id="modalChangePassword" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
+     <div class="modal fade" id="cameraModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
-         <div class="modal-dialog modal-dialog-centered">
+         <div class="modal-dialog modal-lg modal-dialog-centered">
-             <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
+             <div class="modal-content bg-dark text-white border-0 rounded-4 overflow-hidden">
-                 <div class="modal-header bg-primary text-white border-0">
+                 <div class="modal-header border-0 py-2 px-3">
-                     <h5 class="modal-title fw-bold"><i class='bx bx-lock-open-alt'></i> Đổi Mật Khẩu</h5>
+                     <h6 class="modal-title fw-bold"><i class='bx bx-camera'></i> Chụp Ảnh Trực Tiếp</h6>
-                     <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
+                     <div class="ms-auto d-flex gap-2">
-                 </div>
+                         <button type="button" class="btn btn-sm btn-outline-light" id="btnSwitchCamera" onclick="switchCamera()" title="Đổi camera">
-                 <div class="modal-body p-4">
+                             <i class='bx bx-refresh'></i>
-                     <form id="frmChangePassword">
+                         </button>
-                         <div id="pwdAlertForce" class="alert alert-warning initially-hidden">Đối mật khẩu để tiếp tục.</div>
+                         <button type="button" class="btn-close btn-close-white" id="btnCloseCameraModal"></button>
-                         <div class="mb-3"><label class="form-label">Mật khẩu cũ</label><input type="password" class="form-control" id="pwdOld" required></div>
+                     </div>
-                         <div class="mb-3"><label class="form-
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth CCCD — adds runtime type validation before use**: -                                 <input type="file" id="cam_truoc" accept="image/*" capture="environment" class="d-none">
+                                 <button type="button" class="btn btn-outline-primary" onclick="openCamera('img_truoc')" title="Chụp ảnh"><i class='bx bx-camera'></i></button>
-                                 <label for="cam_truoc" class="btn btn-outline-primary"><i class='bx bx-camera'></i></label>
+                             </div>
-                             </div>
+                             <div id="preview_img_truoc" class="mt-2 initially-hidden img-preview-box"><img src="" class="img-preview-inner"></div>
-                             <div id="preview_img_truoc" class="mt-2 initially-hidden img-preview-box"><img src="" class="img-preview-inner"></div>
+                         </div>
-                         </div>
+                         <div class="col-md-6">
-                         <div class="col-md-6">
+                             <label class="form-label fw-semibold">CCCD Mặt sau</label>
-                             <label class="form-label fw-semibold">CCCD Mặt sau</label>
+                             <div class="input-group">
-                             <div class="input-group">
+                                 <input class="form-control" type="file" id="img_sau" accept="image/*" required>
-                                 <input class="form-control" type="file" id="img_sau" accept="image/*" required>
+                                 <button type="button" class="btn btn-outline-primary" onclick="openCamera('img_sau')" title="Chụp ảnh"><i class='bx bx-camera'></i></button>
-                                 <input type="file" id="cam_sau" accept="image/*" capture="environment" class="d-none">
+                             </div>
-                                 <label for="cam_sau" class="btn btn-outline-primary"><i class='bx bx-camera'></i></label>
+                             <div id="preview_img_sau" class="
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth THAO — adds runtime type validation before use**: -                                         <th>TÊN ĐN</th>
+                                         <th>SỐ ĐIỆN THOẠI</th>
-                                         <th>MK</th>
+                                         <th>TÊN ĐN</th>
-                                         <th>TÊN CÁN BỘ</th>
+                                         <th>MK</th>
-                                         <th>CÁN BỘ</th>
+                                         <th>TÊN CÁN BỘ</th>
-                                         <th>TRẠNG THÁI</th>
+                                         <th>CÁN BỘ</th>
-                                         <th class="text-end">THAO TÁC</th>
+                                         <th>TRẠNG THÁI</th>
-                                     </tr>
+                                         <th class="text-end">THAO TÁC</th>
-                                 </thead>
+                                     </tr>
-                                 <tbody></tbody>
+                                 </thead>
-                             </table>
+                                 <tbody></tbody>
-                         </div>
+                             </table>
-                     </div>
+                         </div>
-                 </div>
+                     </div>
-                 <div class="col-12 col-xl-4 d-flex flex-column gap-4">
+                 </div>
-                     <div class="glass-card p-4">
+                 <div class="col-12 col-xl-4 d-flex flex-column gap-4">
-                         <h6 class="fw-bold mb-3 text-secondary text-uppercase d-flex justify-content-between align-items-center">
+                     <div class="glass-card p-4">
-                             <span>Top 5 Cán Bộ</span>
+                         <h6 class="fw-bold mb-3 text-secondary text-uppercase d-flex justify-content-between align-items-center">
-                             <button class="btn btn-sm btn-outline-primary" onclick="showAllStaffM
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] what-changed in index.html**: -                         <thead><tr><th>THỜI GIAN</th><th>Họ TÊN</th><th>CCCD</th><th>SỐ ĐKKD</th><th>LOẠI HÌNH</th><th>SỐ ĐIỆN THOẠI</th><th>TÊN CÁN BỘ</th><th class="text-end">XEM</th></tr></thead>
+                         <thead><tr><th>THỜI GIAN</th><th>Họ TÊN</th><th>CCCD</th><th>SỐ ĐKKD</th><th>LOẠI HÌNH</th><th>SỐ ĐIỆN THOẠI</th><th>TÊN CÁN BỘ</th><th>NGÀY MỞ TK</th><th>SỐ TÀI KHOẢN</th><th>TRẠNG THÁI</th><th class="text-end">XEM</th></tr></thead>

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] 🟢 Edited netlify-app/index.html (6 changes, 3min)**: Active editing session on netlify-app/index.html.
6 content changes over 3 minutes.
