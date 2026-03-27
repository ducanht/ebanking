> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\app.js` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[problem-fix] Fixed null crash in CAMERA — offloads heavy computation off the main thread**: -  * REGISTRATION LOGIC
+  * CAMERA MODULE (getUserMedia Flow)
-  */
+  * - Dung cho Netlify (HTTPS), ho tro ca mobile va desktop.
- function initMoTaiKhoanForm() {
+  * - Fallback an toan sang file picker neu browser khong ho tro hoac user tu choi quyen.
-     flatpickr(".js-datepicker", { dateFormat: "Y-m-d", altInput: true, altFormat: "d/m/Y", defaultDate: "today" });
+  */
-     
+ let _cameraStream = null;         // MediaStream hien tai
-     $('#frm-mo-tk').off('submit').on('submit', handleRegistration);
+ let _cameraFacing = 'environment'; // 'environment' = camera sau (mac dinh cho chup chung tu)
-     $('#loai_hinh').on('change', toggleFormFields);
+ let _cameraTargetId = null;        // ID input file se nhan anh sau khi chup
- 
+ let _galleryInput = null;          // input[type=file] an dung de fallback gallery
-     // Map camera inputs -> corresponding file inputs
+ 
-     const camMap = {
+ /**
-         'cam_truoc': 'img_truoc',
+  * Mo modal camera hoac fallback sang gallery neu getUserMedia khong kha dung
-         'cam_sau':   'img_sau',
+  */
-         'cam_dkkd':  'img_dkkd',
+ async function openCamera(targetId) {
-         'cam_qr':    'img_qr',
+     _cameraTargetId = targetId;
-         'cam_thuchien': 'img_thuchien'
+     _cameraFacing = 'environment'; // always start with back camera
-     };
+ 
- 
+     // Kiem tra browser ho tro getUserMedia va dang chay tren HTTPS / localhost
-     const triggerProcessing = async (file, targetId) => {
+     const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
-         if (!file) return;
+     if (!isSecure || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
-         showLoading('Phan tich anh...');
+         // Fallback: mo file picker truc tiep
-         try {
+         _openFilePicker(targetId);
-             const processed = await processImageWithAI(file);
+         return;
-             startCroppingFlow(processed, targetId);
+     }
-         } c
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
- **[convention] Strengthened types Kinh — adds runtime type validation before use**: -             <div class="glass-card p-3 p-md-4">
+             <div class="row g-3 mb-4" id="staff-dashboard-cards">
-                 <div class="table-responsive">
+                 <div class="col-6 col-md-3">
-                     <table id="tblMyCustomers" class="table table-hover dt-responsive nowrap w-100 align-middle">
+                     <div class="glass-card p-3 text-center border-start border-4 border-success h-100 shadow-sm align-content-center">
-                         <thead><tr><th>THỜI GIAN</th><th>Họ TÊN</th><th>CCCD</th><th>SỐ ĐKKD</th><th>LOẠI HÌNH</th><th>SỐ ĐIỆN THOẠI</th><th>TÊN CÁN BỘ</th><th class="text-end">XEM</th></tr></thead>
+                         <h6 class="text-muted mb-1 small text-uppercase">Hạng của tôi</h6>
-                         <tbody id="tbMyCustomersBody"></tbody>
+                         <h3 class="fw-bold text-success mb-0" id="staffDash-rank"><i class='bx bx-loader-alt bx-spin'></i></h3>
-                     </table>
+                     </div>
-             </div>
+                 <div class="col-6 col-md-3">
-         </section>
+                     <div class="glass-card p-3 text-center border-start border-4 border-primary h-100 shadow-sm align-content-center">
-     </div>
+                         <h6 class="text-muted mb-1 small text-uppercase">Cá nhân</h6>
- 
+                         <h3 class="fw-bold text-primary mb-0" id="staffDash-canhan">--</h3>
-     <!-- Modals -->
+                     </div>
-     <!-- Modal Cắt Ảnh (Cropper) -->
+                 </div>
-     <div class="modal fade" id="cropModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
+                 <div class="col-6 col-md-3">
-         <div class="modal-dialog modal-lg modal-dialog-centered">
+                     <div class="glass-card p-3 text-center border-start border-4 border-warning h-100 shadow-sm align-content-center">
-             <div class="modal-content glass-card d-flex flex-column" style="max-height
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth CCCD — adds runtime type validation before use**: -                             <input type="text" class="form-control" id="cccd" maxlength="12" required>
+                             <input type="text" class="form-control" id="cccd" pattern="[0-9]{12}" maxlength="12" title="Căn cước công dân bắt buộc đúng 12 chữ số" required onblur="checkDuplicate(this)">
-                         </div>
+                             <div class="invalid-feedback">Căn cước công dân bắt buộc đúng 12 chữ số.</div>
-                         <div class="col-md-6 initially-hidden" id="div_dkkd">
+                         </div>
-                             <label class="form-label fw-semibold">Số ĐKKD</label>
+                         <div class="col-md-6 initially-hidden" id="div_dkkd">
-                             <input type="text" class="form-control text-uppercase" id="dkkd">
+                             <label class="form-label fw-semibold">Số ĐKKD</label>
-                         </div>
+                             <input type="text" class="form-control text-uppercase" id="dkkd" onblur="checkDuplicate(this)">
-                         <div class="col-md-6">
+                         </div>
-                             <label class="form-label fw-semibold">Số điện thoại</label>
+                         <div class="col-md-6">
-                             <input type="tel" class="form-control" id="sdt" required>
+                             <label class="form-label fw-semibold">Số điện thoại</label>
-                         </div>
+                             <input type="tel" class="form-control" id="sdt" pattern="0[0-9]{9}" maxlength="10" title="Số điện thoại phải bắt đầu bằng 0 và đủ 10 chữ số" required onblur="checkDuplicate(this)">
-                     </div>
+                             <div class="invalid-feedback">SĐT bắt buộc bắt đầu bằng 0 và đủ 10 chữ số.</div>
-                     
+                         </div>
-                     <h5 class="fw-bold border-bottom pb-2 mt-4 mb-3 text-secondary"><span c
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] what-changed in index.html**: -                         <thead><tr><th>THỜI GIAN</th><th>Họ TÊN</th><th>CCCD</th><th>SỐ ĐKKD</th><th>LOẠI HÌNH</th><th>TRẠNG THÁI</th><th>TÊN CÁN BỘ</th><th class="text-end">XEM</th></tr></thead>
+                         <thead><tr><th>THỜI GIAN</th><th>Họ TÊN</th><th>CCCD</th><th>SỐ ĐKKD</th><th>LOẠI HÌNH</th><th>SỐ ĐIỆN THOẠI</th><th>TÊN CÁN BỘ</th><th class="text-end">XEM</th></tr></thead>

📌 IDE AST Context: Modified symbols likely include [html]
- **[decision] decision in style.css**: - }
+     padding-bottom: 80px;
- 
+ }
- @keyframes fadeIn {
+ 
-     from { opacity: 0; transform: translateY(10px); }
+ @keyframes fadeIn {
-     to { opacity: 1; transform: translateY(0); }
+     from { opacity: 0; transform: translateY(10px); }
- }
+     to { opacity: 1; transform: translateY(0); }
- 
+ }
- /* Image Preview Styles */
+ 
- .img-preview-box {
+ /* Image Preview Styles */
-     width: 100%;
+ .img-preview-box {
-     height: 140px;
+     width: 100%;
-     border: 2px dashed var(--emerald);
+     height: 140px;
-     border-radius: 0.75rem;
+     border: 2px dashed var(--emerald);
-     overflow: hidden;
+     border-radius: 0.75rem;
-     background: #f8fafc;
+     overflow: hidden;
-     display: flex;
+     background: #f8fafc;
-     align-items: center;
+     display: flex;
-     justify-content: center;
+     align-items: center;
-     margin-top: 10px;
+     justify-content: center;
- }
+     margin-top: 10px;
- 
+ }
- .img-preview-inner {
+ 
-     width: 100%;
+ .img-preview-inner {
-     height: 100%;
+     width: 100%;
-     object-fit: contain;
+     height: 100%;
- }
+     object-fit: contain;
- 
+ }
- .img-detail-box {
+ 
-     width: 100%;
+ .img-detail-box {
-     height: 130px;
+     width: 100%;
-     border-radius: 0.5rem;
+     height: 130px;
-     overflow: hidden;
+     border-radius: 0.5rem;
-     background: #f1f5f9;
+     overflow: hidden;
-     display: flex;
+     background: #f1f5f9;
-     align-items: center;
+     display: flex;
-     justify-content: center;
+     align-items: center;
-     border: 1px solid #e2e8f0;
+     justify-content: center;
- }
+     border: 1px solid #e2e8f0;
- 
+ }
- .img-detail-inner {
+ 
-     width: 100%;
+ .img-detail-inner {
-     height: 100%;
+     width: 100%;
-     object-fit: contain;
+     height: 100%;
-     transition: transform 0.2s;
+     object-fit: contain;
- }
+     transition: transform 0.2s;
- 
+ }
- .img-detail-inner:hover {
+ 
-     transform: scale(1.05);
+ .img-detail-in
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [:root, body, .glass-card, .glass-card:hover, #global-spinner]
