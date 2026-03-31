> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\index.html` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[what-changed] Replaced auth Modules**: -     <!-- Modules (v2.1.4-STABLE) -->
+     <!-- Modules (v2.1.8-PATCH) -->
-     <script src="js/utils.js?v=2.1.5"></script>
+     <script src="js/utils.js?v=2.1.8-patch"></script>
-     <script src="js/api.js?v=2.1.5"></script>
+     <script src="js/api.js?v=2.1.8-patch"></script>
-     <script src="js/state.js?v=2.1.5"></script>
+     <script src="js/state.js?v=2.1.8-patch"></script>
-     <script src="js/auth.js?v=2.1.5"></script>
+     <script src="js/auth.js?v=2.1.8-patch"></script>
-     <script src="js/camera.js?v=2.1.5"></script>
+     <script src="js/camera.js?v=2.1.8-patch"></script>
-     <script src="js/registration.js?v=2.1.5"></script>
+     <script src="js/registration.js?v=2.1.8-patch"></script>
-     <script src="js/customer.js?v=2.1.5"></script>
+     <script src="js/customer.js?v=2.1.8-patch"></script>
-     <script src="js/dashboard.js?v=2.1.5"></script>
+     <script src="js/dashboard.js?v=2.1.8-patch"></script>
-     <script src="app.js?v=2.1.5"></script>
+     <script src="app.js?v=2.1.8-patch"></script>

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] what-changed in index.html**: -                     <h5 class="fw-bold text-primary mb-2">QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ</h5>
+                     <h5 class="fw-bold mb-1" style="color: var(--primary-color);">QUỸ TÍN DỤNG NHÂN DÂN <br>YÊN THỌ</h5>

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth Theo — adds runtime type validation before use**: -                     <h3 class="fw-bold text-primary">QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ</h3>
+                     <h5 class="fw-bold text-primary mb-2">QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ</h5>
-                     <p class="text-muted small">Hệ Thống Quản Lý</p>
+                     <div class="login-badge shadow-sm">Hệ Thống Quản Lý Chỉ Tiêu Mở Tài Khoản</div>
-                 </div>            <p class="text-secondary small">Hệ thống QL Chỉ tiêu Mở Tài khoản</p>
+                 </div>
-                 <div class="col-12 col-md-3">
+                 <div class="col-6 col-md-3">
-                     <div class="glass-card p-3 border-start border-primary border-4 h-100 d-flex flex-column justify-content-center shadow-sm">
+                     <div class="glass-card p-3 border-start border-primary border-4 h-100 shadow-sm">
-                         <p class="text-muted mb-1 fw-semibold small text-uppercase">TỔNG TÀI KHOẢN</p>
+                         <div class="d-flex align-items-center gap-2 mb-2">
-                         <h3 class="fw-bold text-primary mb-0" id="db-total">0</h3>
+                             <div class="icon-box-sm bg-primary-subtle text-primary"><i class="bx bx-collection"></i></div>
-                         <small class="text-secondary mt-1"><span id="db-ca-nhan-sub" class="fw-bold text-info">0</span> Cá nhân | <span id="db-hkd-sub" class="fw-bold text-warning">0</span> Hộ KD</small>
+                             <h6 class="text-muted mb-0 small text-uppercase">TỔNG HỒ SƠ</h6>
-                     </div>
+                         </div>
-                 </div>
+                         <h3 class="fw-bold text-primary mb-0" id="db-total">0</h3>
-                 <div class="col-12 col-md-3">
+                     </div>
-                     <div class="glass-card p-3 border-start border-success border-4 h-100 d-flex flex-column justify-content-center shadow-sm">
+                 </div>
-                         <p class="text-muted mb-1 f
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth NGAY — adds runtime type validation before use**: -                         <button type="submit" class="btn btn-primary btn-lg px-5 shadow-sm d-flex align-items-center mx-auto gap-2" id="btnSubmitAccount">
+                         <div class="mb-3 d-flex justify-content-center">
-                             <i class='bx bx-send'></i> Gửi Hồ Sơ
+                             <div class="form-check form-switch bg-light p-2 px-4 rounded-pill border shadow-sm">
-                         </button>
+                                 <input class="form-check-input ms-0 me-2" type="checkbox" id="is_activated" style="width: 2.5em; height: 1.25em;">
-                         <small class="d-block mt-2 text-muted">* Mọi ảnh tải lên sẽ tự động đi qua thuật toán Crop &amp; Compress tối ưu dung lượng (&lt; 500KB).</small>
+                                 <label class="form-check-label fw-bold text-success" for="is_activated">KÍCH HOẠT HỒ SƠ NGAY</label>
-                     </div>
+                             </div>
-                 </form>
+                         </div>
-             </div>
+                         <button type="submit" class="btn btn-primary btn-lg px-5 shadow-sm d-flex align-items-center mx-auto gap-2" id="btnSubmitAccount">
-         </section>
+                             <i class='bx bx-send'></i> Gửi Hồ Sơ
- 
+                         </button>
-         <!-- VIEW: HỒ SƠ CỦA TÔI (STAFF) -->
+                         <small class="d-block mt-2 text-muted">* Mọi ảnh tải lên sẽ tự động đi qua thuật toán Crop &amp; Compress tối ưu dung lượng (&lt; 500KB).</small>
-         <section id="view-my-customers" class="view-section d-none">
+                     </div>
-              <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
+                 </form>
-                 <h4 class="fw-bold text-primary mb-0"><i class='bx bx-list-ul'></i> Hồ Sơ Của Tôi</h4>
+             </div>
-                 <div class="d-flex gap-2 align-items-center">
+         </section>
-       
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth Placeholder — adds runtime type validation before use**: -                 <div class="col-12 col-md-4">
+                 <div class="col-12 col-md-3">
-                     <div class="glass-card p-3 border-start border-primary border-4 h-100 d-flex flex-column justify-content-center">
+                     <div class="glass-card p-3 border-start border-primary border-4 h-100 d-flex flex-column justify-content-center shadow-sm">
-                         <h2 class="fw-bold text-primary mb-0" id="db-total">0</h2>
+                         <h3 class="fw-bold text-primary mb-0" id="db-total">0</h3>
-                 <div class="col-12 col-md-4">
+                 <div class="col-12 col-md-3">
-                     <div class="glass-card p-3 border-start border-info border-4 h-100 d-flex flex-column justify-content-center">
+                     <div class="glass-card p-3 border-start border-success border-4 h-100 d-flex flex-column justify-content-center shadow-sm">
-                         <p class="text-muted mb-1 fw-semibold small text-uppercase">TK CÁ NHÂN</p>
+                         <p class="text-muted mb-1 fw-semibold small text-uppercase">ĐÃ KÍCH HOẠT</p>
-                         <h2 class="fw-bold text-info mb-0" id="db-ca-nhan">0</h2>
+                         <h3 class="fw-bold text-success mb-0" id="db-activated">0</h3>
-                 <div class="col-12 col-md-4">
+                 <div class="col-12 col-md-3">
-                     <div class="glass-card p-3 border-start border-warning border-4 h-100 d-flex flex-column justify-content-center">
+                     <div class="glass-card p-3 border-start border-warning border-4 h-100 d-flex flex-column justify-content-center shadow-sm">
-                         <p class="text-muted mb-1 fw-semibold small text-uppercase">TK HỘ KINH DOANH</p>
+                         <p class="text-muted mb-1 fw-semibold small text-uppercase">CHƯA KÍCH HOẠT</p>
-                         <h2 class="fw-bold text-warning mb-0" id="db-hkd-count">0</h2>
+                    
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth GIAN — adds runtime type validation before use**: -                     <div class="glass-card p-3 text-center border-start border-4 border-success h-100 shadow-sm align-content-center">
+                     <div class="glass-card p-3 text-center border-start border-4 border-primary h-100 shadow-sm align-content-center">
-                         <h6 class="text-muted mb-1 small text-uppercase">Hạng của tôi</h6>
+                         <h6 class="text-muted mb-1 small text-uppercase">Tổng hồ sơ</h6>
-                         <h3 class="fw-bold text-success mb-0" id="staffDash-rank"><i class='bx bx-loader-alt bx-spin'></i></h3>
+                         <h3 class="fw-bold text-primary mb-0" id="staffDash-total"><i class='bx bx-loader-alt bx-spin'></i></h3>
-                         <p class="mb-0 small text-secondary mt-1" id="staffDash-aboveRankInfo"></p>
+                     </div>
-                     </div>
+                 </div>
- 
+                 <div class="col-6 col-md-3">
-                 </div>
+                     <div class="glass-card p-3 text-center border-start border-4 border-success h-100 shadow-sm align-content-center">
-                 <div class="col-6 col-md-3">
+                         <h6 class="text-muted mb-1 small text-uppercase">Đã kích hoạt</h6>
-                     <div class="glass-card p-3 text-center border-start border-4 border-primary h-100 shadow-sm align-content-center">
+                         <h3 class="fw-bold text-success mb-0" id="staffDash-activated">0</h3>
-                         <h6 class="text-muted mb-1 small text-uppercase">Cá nhân</h6>
+                     </div>
-                         <h3 class="fw-bold text-primary mb-0" id="staffDash-canhan">--</h3>
+                 </div>
-                     </div>
+                 <div class="col-6 col-md-3">
-                 </div>
+                     <div class="glass-card p-3 text-center border-start border-4 border-warning h-100 shadow-sm align-content-center">
-                 <div class="col-6 c
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth Modal — adds runtime type validation before use**: -                             <label for="ten_dang_nhap" class="form-label fw-bold text-primary"><i class="bx bx-user"></i> Tên Đăng Nhập Website (HKD)</label>
+                             <label for="ten_dang_nhap" class="form-label fw-bold text-primary"><i class="bx bx-user"></i> (Tên đăng nhập)</label>
-                             <label for="mat_khau" class="form-label fw-bold text-primary"><i class="bx bx-key"></i> Mật khẩu mặc định</label>
+                             <label for="mat_khau" class="form-label fw-bold text-primary"><i class="bx bx-key"></i> Mật khẩu khởi tạo</label>
-                         </div>
+                             <div class="col-md-6"><label class="form-label fw-semibold">(Tên đăng nhập)</label><input type="text" class="form-control" id="edit_ten_dang_nhap"></div>
-                         <h6 class="fw-bold text-secondary mt-4 mb-3 border-bottom pb-2">Chứng từ đính kèm</h6>
+                             <div class="col-md-6"><label class="form-label fw-semibold">Mật khẩu khởi tạo</label><input type="text" class="form-control" id="edit_mat_khau"></div>
-                         <div class="row g-3" id="edit_images_container"></div>
+                         </div>
-                         <div class="mt-4 text-end">
+                         <h6 class="fw-bold text-secondary mt-4 mb-3 border-bottom pb-2">Chứng từ đính kèm</h6>
-                             <button type="button" class="btn btn-secondary px-4 me-2 rounded-pill" data-bs-dismiss="modal">Đóng</button>
+                         <div class="row g-3" id="edit_images_container"></div>
-                             <button type="submit" class="btn btn-success px-4 rounded-pill shadow-sm" id="btnSaveEdit">Lưu thay đổi</button>
+                         <div class="mt-4 text-end">
-                         </div>
+                             <button type="button" class="btn btn-secondary px-4 me-2 rounded-pill" data-bs-dismiss="modal">Đóng</button>
-                     <
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] 🟢 Edited netlify-app/index.html (5 changes, 925min)**: Active editing session on netlify-app/index.html.
5 content changes over 925 minutes.
- **[what-changed] Replaced auth TDND — adds runtime type validation before use**: -                             <p class="text-muted small mb-1">Phiên bản: v2.1.5-STABLE</p>
+                             <p class="mb-0 text-white-50 small">Quỹ TDND Yên Thọ &copy; 2026. Phiên bản hệ thống v2.1.6-STABLE</p>
-                         <div class="col-md-6">
+                         <div class="col-md-6 initially-hidden" id="div_ten_dang_nhap">
-                             <label for="sdt" class="form-label fw-semibold">Số điện thoại</label>
+                             <label for="ten_dang_nhap" class="form-label fw-bold text-primary"><i class="bx bx-user"></i> Tên Đăng Nhập Website (HKD)</label>
-                             <input type="tel" class="form-control" id="sdt" placeholder="0xxxxxxxxx" pattern="0[0-9]{9}" maxlength="10" title="Số điện thoại phải bắt đầu bằng 0 và đủ 10 chữ số" required onblur="checkDuplicate(this)">
+                             <input type="text" class="form-control border-primary shadow-sm" id="ten_dang_nhap" placeholder="Ví dụ: cuahangtest">
- 
+                         </div>
-                             <div class="invalid-feedback">SĐT bắt buộc bắt đầu bằng 0 và đủ 10 chữ số.</div>
+ 
-                         </div>
+                         <div class="col-md-6 initially-hidden" id="div_mat_khau">
-                     </div>
+                             <label for="mat_khau" class="form-label fw-bold text-primary"><i class="bx bx-key"></i> Mật khẩu mặc định</label>
-                     
+                             <input type="text" class="form-control border-primary shadow-sm" id="mat_khau" placeholder="Qtd@2003" value="Qtd@2003">
-                     <h5 class="fw-bold border-bottom pb-2 mt-4 mb-3 text-secondary"><span class="badge bg-primary rounded-circle">B</span> Thông tin Tài khoản</h5>
+                         </div>
-                     <div class="row g-3">
+ 
-                             <label for="so_tk" class="form-label fw-semibold">Số CIF (16 số)</label>
+                             <
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth STABLE**: -     <link href="style.css?v=2.1.4" rel="stylesheet">
+     <link href="style.css?v=2.1.5" rel="stylesheet">
-                             <p class="text-muted small mb-1">Phiên bản: v2.1.4-STABLE</p>
+                             <p class="text-muted small mb-1">Phiên bản: v2.1.5-STABLE</p>
-     <script src="js/utils.js?v=2.1.4"></script>
+     <script src="js/utils.js?v=2.1.5"></script>
-     <script src="js/api.js?v=2.1.4"></script>
+     <script src="js/api.js?v=2.1.5"></script>
-     <script src="js/state.js?v=2.1.4"></script>
+     <script src="js/state.js?v=2.1.5"></script>
-     <script src="js/auth.js?v=2.1.4"></script>
+     <script src="js/auth.js?v=2.1.5"></script>
-     <script src="js/camera.js?v=2.1.4"></script>
+     <script src="js/camera.js?v=2.1.5"></script>
-     <script src="js/registration.js?v=2.1.4"></script>
+     <script src="js/registration.js?v=2.1.5"></script>
-     <script src="js/customer.js?v=2.1.4"></script>
+     <script src="js/customer.js?v=2.1.5"></script>
-     <script src="js/dashboard.js?v=2.1.4"></script>
+     <script src="js/dashboard.js?v=2.1.5"></script>
-     <script src="app.js?v=2.1.4"></script>
+     <script src="app.js?v=2.1.5"></script>

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] what-changed in index.html**: -     <!-- Modal Camera Live --  >
+     <!-- Modal Camera Live -->

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] what-changed in index.html**: -     <link href="style.css?v=2.1.2" rel="stylesheet">
+     <link href="style.css?v=2.1.4" rel="stylesheet">
-                             <p class="text-muted small mb-1">Phiên bản: v2.1.2-STABLE</p>
+                             <p class="text-muted small mb-1">Phiên bản: v2.1.4-STABLE</p>

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth Modules**: -     <!-- Modules (v2.1.3-STABLE) -->
+     <!-- Modules (v2.1.4-STABLE) -->
-     <script src="js/utils.js?v=2.1.3"></script>
+     <script src="js/utils.js?v=2.1.4"></script>
-     <script src="js/api.js?v=2.1.3"></script>
+     <script src="js/api.js?v=2.1.4"></script>
-     <script src="js/state.js?v=2.1.3"></script>
+     <script src="js/state.js?v=2.1.4"></script>
-     <script src="js/auth.js?v=2.1.3"></script>
+     <script src="js/auth.js?v=2.1.4"></script>
-     <script src="js/camera.js?v=2.1.3"></script>
+     <script src="js/camera.js?v=2.1.4"></script>
-     <script src="js/registration.js?v=2.1.3"></script>
+     <script src="js/registration.js?v=2.1.4"></script>
-     <script src="js/customer.js?v=2.1.3"></script>
+     <script src="js/customer.js?v=2.1.4"></script>
-     <script src="js/dashboard.js?v=2.1.3"></script>
+     <script src="js/dashboard.js?v=2.1.4"></script>
-     <script src="app.js?v=2.1.3"></script>
+     <script src="app.js?v=2.1.4"></script>

📌 IDE AST Context: Modified symbols likely include [html]
- **[decision] decision in index.html**: -                             <table id="tblKH" class="table table-hover dt-responsive nowrap w-100 align-middle">
+                             <table id="tblKH" class="table table-hover table-borderless align-middle dt-responsive nowrap w-100">
-                             <label for="dkkd" class="form-label fw-semibold">Số ĐKKD</label>
+                             <label for="dkkd" class="form-label fw-bold text-primary"><i class="bx bx-certification"></i> Số Giấy Phép ĐKKD</label>
-                             <input type="text" class="form-control text-uppercase" id="dkkd" placeholder="SỐ ĐKKD" title="Nhập số đăng ký kinh doanh" onblur="checkDuplicate(this)">
+                             <input type="text" class="form-control text-uppercase border-primary shadow-sm" id="dkkd" placeholder="NHẬP SỐ ĐKKD (BẮT BUỘC VỚI HKD)">

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth Modules**: -     <script src="app.js?v=2.1.2"></script>
+ 
- </body>
+     <!-- Modules (v2.1.3-STABLE) -->
- </html>
+     <script src="js/utils.js?v=2.1.3"></script>
- 
+     <script src="js/api.js?v=2.1.3"></script>
+     <script src="js/state.js?v=2.1.3"></script>
+     <script src="js/auth.js?v=2.1.3"></script>
+     <script src="js/camera.js?v=2.1.3"></script>
+     <script src="js/registration.js?v=2.1.3"></script>
+     <script src="js/customer.js?v=2.1.3"></script>
+     <script src="js/dashboard.js?v=2.1.3"></script>
+     
+     <script src="app.js?v=2.1.3"></script>
+ </body>
+ </html>
+ 

📌 IDE AST Context: Modified symbols likely include [html]
