> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `frmMoTaiKhoan.html` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[what-changed] what-changed in frmMoTaiKhoan.html**: -                     <input type="file" id="cam_truoc" accept="image/*" capture="environment" class="d-none">
+                     <input type="file" id="cam_truoc" accept="image/*" class="d-none">
-                     <input type="file" id="cam_sau" accept="image/*" capture="environment" class="d-none">
+                     <input type="file" id="cam_sau" accept="image/*" class="d-none">
-                     <input type="file" id="cam_dkkd" accept="image/*" capture="environment" class="d-none">
+                     <input type="file" id="cam_dkkd" accept="image/*" class="d-none">
-                     <input type="file" id="cam_qr" accept="image/*" capture="environment" class="d-none">
+                     <input type="file" id="cam_qr" accept="image/*" class="d-none">
-                     <input type="file" id="cam_thuchien" accept="image/*" capture="environment" class="d-none">
+                     <input type="file" id="cam_thuchien" accept="image/*" class="d-none">

📌 IDE AST Context: Modified symbols likely include [div.d-flex.justify-content-between.align-items-center.mb-4, div.glass-card.p-3.p-md-4.mb-4, div#cropModal.modal.fade, script]
- **[convention] what-changed in index.html — confirmed 3x**: -                                 <div class="input-group input-group-sm" style="width: auto;">
+                                 <div class="input-group input-group-sm w-auto">
-                                 <div class="input-group input-group-sm" style="width: auto;">
+                                 <div class="input-group input-group-sm w-auto">

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth Logo**: -                     <div id="login-box" class="glass-card p-4 mx-auto w-100 shadow-lg" style="max-width: 400px; border-top: 4px solid var(--bs-primary);">
+                     <div id="login-box" class="glass-card p-4 mx-auto w-100 shadow-lg">
-                     <img src="logo.png" class="app-logo mb-3" alt="Logo" style="height: 64px; object-fit: contain;">
+                     <img src="logo.png" class="app-logo-large mb-3" alt="Logo Quỹ Yên Thọ" title="Logo Quỹ Yên Thọ">
-                         <img src="logo.png" class="app-logo" alt="Logo" style="height: 32px; width: 32px; object-fit: contain;">
+                         <img src="logo.png" class="app-logo" alt="Logo Quỹ Yên Thọ" title="Logo Quỹ Yên Thọ">
-                             <select id="filterYearChart" class="form-select form-select-sm" style="width: auto;"></select>
+                             <select id="filterYearChart" class="form-select form-select-sm w-auto" title="Chọn năm xem biểu đồ"></select>
-                         <div class="chart-container-monthly" style="height: 240px; position: relative;">
+                         <div class="chart-container-monthly-dashboard">
-                                     <input type="text" id="filterFromDate" class="form-control border-start-0 ps-0" placeholder="Từ ngày" style="width: 100px;">
+                                     <input type="text" id="filterFromDate" class="form-control border-start-0 ps-0 w-100px" placeholder="Từ ngày" title="Lọc từ ngày">
-                                     <input type="text" id="filterToDate" class="form-control border-start-0 ps-0" placeholder="Đến ngày" style="width: 100px;">
+                                     <input type="text" id="filterToDate" class="form-control border-start-0 ps-0 w-100px" placeholder="Đến ngày" title="Lọc đến ngày">
-                                 <select id="filterStaffAdmin" class="form-select form-select-sm" style="width: auto;"><option value="">Tất cả cán bộ</option></se
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
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
- **[convention] Replaced auth CCCD — adds runtime type validation before use — confirmed 3x**: -                         <div class="chart-container-pie" style="height: 200px;"><canvas id="chartLoaiHinh"></canvas></div>
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
- **[what-changed] Replaced auth VIEW — adds runtime type validation before use**: -     <style>
+ 
-         :root { --emerald: #10b981; --emerald-dark: #059669; --slate: #64748b; --amber: #f59e0b; }
+     <div id="global-spinner">
-         body { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); min-height: 100vh; font-family: 'Inter', sans-serif; color: #1e293b; margin: 0; padding: 0; }
+         <div class="spinner-border text-success spinner-lg" role="status"></div>
-         .glass-card { background: rgba(255, 255, 255, 0.8); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transition: transform 0.2s; }
+         <h5 class="mt-3 fw-bold text-secondary">Đang kết nối hệ thống...</h5>
-         #global-spinner { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.9); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; }
+     </div>
-         .handle-interaction { pointer-events: auto; cursor: move; }
+ 
-         .chart-container-pie { height: 250px; position: relative; }
+     <div id="app-container" class="container py-4 mb-5">
-         .mw-150px { max-width: 150px; }
+         <!-- VIEW: LOGIN -->
-         div#preact-border-shadow-host { display: none; }
+         <section id="view-login" class="view-section">
-         .img-preview-box { width: 100%; height: 120px; border: 2px dashed #10b981; border-radius: 0.5rem; overflow: hidden; background: #f8fafc; display: flex; align-items: center; justify-content: center; }
+             <div class="container d-flex justify-content-center align-items-center min-vh-80">
-         .img-preview-inner { width: 100%; height: 100%; object-fit: contain; display: block; }
+                 <div class="col-12 col-md-6 col-lg-4">
-         .img-detail-box { width: 100%; height: 130px; border-radius: 0.5rem; overflow: hidden; background: #f1f5f9; display: flex; align-items: cent
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
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
