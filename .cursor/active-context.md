> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\app.js` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[problem-fix] Fixed null crash in AppState — wraps unsafe operation in error boundary**: -     runAPI('api_getMyCustomers', { email: AppState.user.email }, (res) => {
+     runAPI('api_getmycustomers', { email: AppState.user.email }, (res) => {
-         } else {
+             renderStaffDashboardLocal(res.data || []);
-             $('#tbMyCustomersBody').html(`<tr><td colspan="7" class="text-center text-danger py-4">Lỗi: ${res.message}</td></tr>`);
+             
-         }
+             // Fetch rankings silently
-     }, null, 'NONE');
+             runAPI('api_getadmindashboarddata', {}, (adminRes) => {
- }
+                 if (adminRes.status === 'success') {
- 
+                     updateStaffRankings(adminRes.data, AppState.user.email);
- function renderMyCustomersTable(data) {
+                 }
-     const html = data.sort((a,b) => (new Date(b['Thời điểm nhập']) || 0) - (new Date(a['Thời điểm nhập']) || 0)).map(d => {
+             }, null, 'NONE');
-         const statusColor = d['Trạng thái'] === 'Đã xác minh' ? 'text-success' : 'text-warning';
+         } else {
-         return `
+             $('#tbMyCustomersBody').html(`<tr><td colspan="7" class="text-center text-danger py-4">Lỗi: ${res.message}</td></tr>`);
-             <tr onclick="openEditCustomerModal('${d.ID || d['Mã GD']}')" class="cursor-pointer">
+         }
-                 <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
+     }, null, 'NONE');
-                 <td class="fw-bold">${d['Tên khách hàng']}</td>
+ }
-                 <td><small>${d['Số CCCD']}</small></td>
+ 
-                 <td><small>${d['Số GP ĐKKD'] || ''}</small></td>
+ function renderStaffDashboardLocal(data) {
-                 <td><span class="badge bg-light text-dark border">${d['Loại hình dịch vụ']}</span></td>
+     let caNhan = 0, hkd = 0;
-                 <td><small>${d['Số điện thoại']}</small></td>
+     let timeline = {};
-                 <td>${AppState.user ? AppState.user.name : (d['Cán bộ thực hiện'] || '')}</td>
+ 
-                 <td><butto
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[problem-fix] Fixed null crash in NONE — offloads heavy computation off the main thread**: - function utils_formatVN(val, type = 'date') {
+ function checkDuplicate(input) {
-     if (!val) return 'N/A';
+     const val = input.value.trim();
-     const dateObj = new Date(val);
+     if (!val) {
-     if (isNaN(dateObj)) return val;
+         $(input).removeClass('is-invalid');
-     const d = ('0' + dateObj.getDate()).slice(-2);
+         input.setCustomValidity('');
-     const m = ('0' + (dateObj.getMonth() + 1)).slice(-2);
+         return;
-     const y = dateObj.getFullYear();
+     }
-     if (type === 'datetime') {
+     
-         const hh = ('0' + dateObj.getHours()).slice(-2);
+     if (!input.checkValidity()) {
-         const mm = ('0' + dateObj.getMinutes()).slice(-2);
+         $(input).addClass('is-invalid');
-         return `${hh}:${mm} ${d}/${m}/${y}`;
+         return;
-     return `${d}/${m}/${y}`;
+ 
- }
+     runAPI('api_validateduplicate', { field: input.id, value: val }, (res) => {
- 
+         if (res && res.isDup) {
- /**
+             input.setCustomValidity(res.msg || 'Giá trị này đã tồn tại!');
-  * OPENCV & IMAGE PROCESSING (PORTED)
+             $(input).addClass('is-invalid');
-  */
+             if ($(input).siblings('.invalid-feedback').length) {
- let isCvReady = false;
+                 $(input).siblings('.invalid-feedback').text(res.msg || 'Giá trị này đã tồn tại!');
- let currentInputTargetId = null;
+             }
- let quadPoints = [ {x:0.1, y:0.1}, {x:0.9, y:0.1}, {x:0.9, y:0.9}, {x:0.1, y:0.9} ];
+         } else {
- let activePointIndex = -1;
+             input.setCustomValidity('');
- let imageMatStore = {};
+             $(input).removeClass('is-invalid');
- 
+             if (input.id === 'cccd') $(input).siblings('.invalid-feedback').text('Căn cước công dân bắt buộc đúng 12 chữ số.');
- function onOpenCvReady() {
+             else if (input.id === 'sdt') $(input).siblings('.invalid-feedback').text('SĐT bắt buộc bắt đầu bằng 0 và đủ 10 chữ số.');
-     isCvReady = true;
+             else if (input.id === 
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[what-changed] what-changed in app.js**: -                 <td class="fw-bold">${d['Tên khách hàng']}<br><small class="text-secondary fw-normal">${d['Số điện thoại']}</small></td>
+                 <td class="fw-bold">${d['Tên khách hàng']}</td>
-                 <td><span class="${statusColor} fw-bold"><i class="bx bxs-circle"></i> ${d['Trạng thái']}</span></td>
+                 <td><small>${d['Số điện thoại']}</small></td>

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[what-changed] Added session cookies authentication**: - });
+     $('#frmEditCustomer').on('submit', handleEditCustomer);
- 
+ });
- function handleLogin(e) {
+ 
-     e.preventDefault();
+ function handleLogin(e) {
-     const email = $('#loginEmail').val().trim();
+     e.preventDefault();
-     const pwd = $('#loginPassword').val();
+     const email = $('#loginEmail').val().trim();
-     const hashedPwd = CryptoJS.SHA256(pwd).toString();
+     const pwd = $('#loginPassword').val();
- 
+     const hashedPwd = CryptoJS.SHA256(pwd).toString();
-     runAPI('api_login', { email, [REDACTED] }, (res) => {
+ 
-         if (res.status === 'success') {
+     runAPI('api_login', { email, [REDACTED] }, (res) => {
-             AppState.user = res.user;
+         if (res.status === 'success') {
-             localStorage.setItem('HOKINHDOANH_SESSION', JSON.stringify(res.user));
+             AppState.user = res.user;
-             if (res.requirePasswordChange) {
+             localStorage.setItem('HOKINHDOANH_SESSION', JSON.stringify(res.user));
-                 $('#modalChangePassword').modal('show');
+             if (res.requirePasswordChange) {
-                 $('#pwdAlertForce').removeClass('initially-hidden').show();
+                 $('#modalChangePassword').modal('show');
-                 $('#modalChangePassword .btn-close').hide();
+                 $('#pwdAlertForce').removeClass('initially-hidden').show();
-                 $('#modalChangePassword').attr('data-bs-keyboard', 'false');
+                 $('#modalChangePassword .btn-close').hide();
-                 hideLoading();
+                 $('#modalChangePassword').attr('data-bs-keyboard', 'false');
-             } else {
+                 hideLoading();
-                 handleLoginSuccess(false);
+             } else {
-             }
+                 handleLoginSuccess(false);
-         } else showAlert('Lỗi', res.message, 'error');
+             }
-     });
+         } else showAlert('Lỗi', res.message, 'error');
- }
+     });
- 
+
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[what-changed] Added session cookies authentication**: - });
+     $('#frmChangePassword').on('submit', handleChangePassword);
- 
+ });
- function handleLogin(e) {
+ 
-     e.preventDefault();
+ function handleLogin(e) {
-     const email = $('#loginEmail').val().trim();
+     e.preventDefault();
-     const pwd = $('#loginPassword').val();
+     const email = $('#loginEmail').val().trim();
-     const hashedPwd = CryptoJS.SHA256(pwd).toString();
+     const pwd = $('#loginPassword').val();
- 
+     const hashedPwd = CryptoJS.SHA256(pwd).toString();
-     runAPI('api_login', { email, [REDACTED] }, (res) => {
+ 
-         if (res.status === 'success') {
+     runAPI('api_login', { email, [REDACTED] }, (res) => {
-             AppState.user = res.user;
+         if (res.status === 'success') {
-             localStorage.setItem('HOKINHDOANH_SESSION', JSON.stringify(res.user));
+             AppState.user = res.user;
-             handleLoginSuccess(false);
+             localStorage.setItem('HOKINHDOANH_SESSION', JSON.stringify(res.user));
-         } else showAlert('Lỗi', res.message, 'error');
+             if (res.requirePasswordChange) {
-     });
+                 $('#modalChangePassword').modal('show');
- }
+                 $('#pwdAlertForce').removeClass('initially-hidden').show();
- 
+                 $('#modalChangePassword .btn-close').hide();
- function handleLoginSuccess(silent) {
+                 $('#modalChangePassword').attr('data-bs-keyboard', 'false');
-     hideLoading();
+                 hideLoading();
-     const userName = AppState.user.fullName || AppState.user.name || AppState.user.email;
+             } else {
-     if (!silent) showAlert('Thành công', `Chào mừng ${userName}!`, 'success');
+                 handleLoginSuccess(false);
-     
+             }
-     $('#user-name-display-admin').text(userName);
+         } else showAlert('Lỗi', res.message, 'error');
-     $('#user-name-display-user').text(userName);
+     });
-     
+ }
-     if (AppState.user.role === 'Admin') {

… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[what-changed] what-changed in app.js**: -         action: "api_submitAccountForm",
+         action: "api_submitregistration",
-     runAPI('api_submitAccountForm', data, (res) => {
+     runAPI('api_submitregistration', data, (res) => {

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
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
- **[what-changed] Replaced auth Pass — adds runtime type validation before use**: -                     <button class="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 shadow-sm" onclick="logout()">
+                     <button class="btn btn-outline-secondary btn-sm d-none d-sm-flex align-items-center gap-1 shadow-sm" onclick="$('#modalChangePassword').modal('show')">
-                         <i class='bx bx-log-out fs-5'></i> <span class="d-none d-sm-inline">Thoát</span>
+                         <i class='bx bx-lock-open-alt fs-5'></i> <span class="d-none d-sm-inline">Đổi Pass</span>
-                 </div>
+                     <button class="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 shadow-sm" onclick="logout()">
-             </div>
+                         <i class='bx bx-log-out fs-5'></i> <span class="d-none d-sm-inline">Thoát</span>
-             <div class="glass-card p-3 p-md-4 mb-4">
+                     </button>
-                 <form id="frm-mo-tk">
+                 </div>
-                     <h5 class="fw-bold border-bottom pb-2 mb-3 text-secondary"><span class="badge bg-primary rounded-circle">A</span> Thông tin định danh</h5>
+             </div>
-                     <div class="row g-3">
+             <div class="glass-card p-3 p-md-4 mb-4">
-                         <div class="col-md-6">
+                 <form id="frm-mo-tk">
-                             <label class="form-label fw-semibold">Loại hình</label>
+                     <h5 class="fw-bold border-bottom pb-2 mb-3 text-secondary"><span class="badge bg-primary rounded-circle">A</span> Thông tin định danh</h5>
-                             <select class="form-select" id="loai_hinh" onchange="toggleFormFields()">
+                     <div class="row g-3">
-                                 <option value="Cá nhân">Cá nhân</option>
+                         <div class="col-md-6">
-                                 <option value="Hộ kinh doanh">Hộ kinh doanh</option>
+                             <label class="form-label fw-semi
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
