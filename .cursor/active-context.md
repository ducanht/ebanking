> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\index.html` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[what-changed] Replaced auth Crop — adds runtime type validation before use**: -                         <div class="progress" style="height: 10px;"><div class="progress-bar progress-bar-striped progress-bar-animated bg-success" id="compress-progress-bar" style="width: 0%"></div></div>
+                         <div class="d-flex justify-content-between mb-1">
-                     </div>
+                             <small class="text-secondary fw-bold" id="compress-progress-label">Đang nén ảnh...</small>
- 
+                             <small class="text-primary fw-bold" id="compress-progress-pct">0%</small>
-                     <div class="mt-4 pt-3 text-center border-top">
+                         </div>
-                         <button type="submit" class="btn btn-primary btn-lg px-5 shadow-sm d-flex align-items-center mx-auto gap-2" id="btnSubmitAccount">
+                         <div class="progress" style="height: 10px;"><div class="progress-bar progress-bar-striped progress-bar-animated bg-success" id="compress-progress-bar" style="width: 0%"></div></div>
-                             <i class='bx bx-cloud-upload'></i> Gửi Hồ Sơ &amp; Nén Tự Động
+                     </div>
-                         </button>
+ 
-                         <small class="d-block mt-2 text-muted">* Mọi ảnh tải lên sẽ tự động đi qua thuật toán Crop &amp; Compress tối ưu dung lượng (&lt; 500KB).</small>
+ 
-                     </div>
+                     <div class="mt-4 pt-3 text-center border-top">
-                 </form>
+                         <button type="submit" class="btn btn-primary btn-lg px-5 shadow-sm d-flex align-items-center mx-auto gap-2" id="btnSubmitAccount">
-             </div>
+                             <i class='bx bx-cloud-upload'></i> Gửi Hồ Sơ &amp; Nén Tự Động
-         </section>
+                         </button>
- 
+                         <small class="d-block mt-2 text-muted">* Mọi ảnh tải lên sẽ tự động đi qua thuật toán Crop &amp; Compress tối ưu dung lượng (&lt; 500KB).</small>
-         <!-- VIEW: HỒ SƠ CỦ
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
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
