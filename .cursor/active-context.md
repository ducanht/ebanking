> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\index.html` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[what-changed] Replaced auth GIAN — adds runtime type validation before use**: -                         <div class="d-flex justify-content-between mt-1" style="font-size: 0.65rem;">
+                         <div class="d-flex justify-content-between mt-1 mb-2" style="font-size: 0.65rem;">
-                     </div>
+                         <div class="progress" style="height: 4px;">
-                 </div>
+                             <div id="staffDash-prog-thanhvien" class="progress-bar bg-primary" role="progressbar" style="width: 50%"></div>
-                 <div class="col-6 col-md-3">
+                             <div id="staffDash-prog-ngoai" class="progress-bar bg-secondary" role="progressbar" style="width: 50%"></div>
-                     <div class="glass-card p-3 border-start border-4 border-success h-100 shadow-sm d-flex flex-column justify-content-center">
+                         </div>
-                         <div class="d-flex align-items-center gap-2 mb-1">
+                         <div class="d-flex justify-content-between mt-1" style="font-size: 0.65rem;">
-                             <div class="icon-box-sm bg-success-subtle text-success"><i class="bx bx-check-circle"></i></div>
+                             <span>Thành viên: <b id="staffDash-thanhvien">0</b></span>
-                             <h6 class="text-muted mb-0 small text-uppercase fw-bold">ĐÃ KÍCH HOẠT</h6>
+                             <span>Ngoài TV: <b id="staffDash-ngoaithanhvien">0</b></span>
-                         <h3 class="fw-bold text-success mb-0" id="staffDash-activated">0</h3>
+                     </div>
-                     </div>
+                 </div>
-                 </div>
+                 <div class="col-6 col-md-3">
-                 <div class="col-6 col-md-3">
+                     <div class="glass-card p-3 border-start border-4 border-success h-100 shadow-sm d-flex flex-column justify-content-center">
-                     <div class="glass-card p-3 border-start border-4 border-warning h-100 s
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] what-changed in index.html**: -                     <h4 class="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
+                     <h4 class="fw-bold text-primary mt-0 mb-0 d-flex align-items-center gap-2">
-                     <p class="text-muted mb-0 small mt-1">Xin chào, <span id="user-name-display-admin" class="fw-bold text-dark"></span>! Theo dõi tiến độ KPIs toàn hệ thống theo thời gian thực.</p>
+                     <p class="text-muted mb-0 small mt-0">Xin chào, <span id="user-name-display-admin" class="fw-bold text-dark"></span>! Theo dõi tiến độ KPIs toàn hệ thống theo thời gian thực.</p>

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] what-changed in index.html**: -     <div id="app-container" class="container py-4 mb-5">
+     <div id="app-container" class="container pt-1 pt-md-2 pb-5">

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] Replaced auth VIEW — adds runtime type validation before use — confirmed 3x**: -                                         <th>SỐ ĐIỆN THOẠI</th>
+                                         <th>ĐỐI TƯỢNG</th>
-                                         <th>CÁN BỘ</th>
+                                         <th>SỐ ĐIỆN THOẠI</th>
-                                         <th class="text-end">CHI TIẾT</th>
+                                         <th>CÁN BỘ</th>
-                                     </tr>
+                                         <th class="text-end">CHI TIẾT</th>
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
-                             <button class="btn btn-sm btn-outline-primary" onclick="showAllStaffModal()">Chi tiết</button>
+                             <span>Top 5 Cán Bộ</span>
-                         </h6>
+                             <button class="btn btn-sm btn-outline-primary" onclick="showAllStaffModal()">Chi tiết</button>
-                         <div id="db-topstaff" class="d-flex flex-column g
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] what-changed in index.html — confirmed 3x**: -                         <thead><tr><th>THỜI GIAN</th><th>HỌ TÊN</th><th>SỐ TÀI KHOẢN</th><th>LOẠI HÌNH</th><th>SỐ ĐIỆN THOẠI</th><th class="text-end">XEM</th></tr></thead>
+                         <thead><tr><th>THỜI GIAN</th><th>HỌ TÊN</th><th>SỐ TÀI KHOẢN</th><th>LOẠI HÌNH</th><th>ĐỐI TƯỢNG</th><th>SỐ ĐIỆN THOẠI</th><th class="text-end">XEM</th></tr></thead>

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth Email — adds runtime type validation before use**: - <<<<<<< HEAD
+                                     <input type="email" class="form-control border-start-0 ps-0" id="loginEmail" placeholder="Nhập Email" required>
-                                     <input type="email" class="form-control border-start-0 ps-0" id="loginEmail" placeholder="Nhập Email" required>
+                                 </div>
- =======
+                             </div>
-                                     <input type="email" class="form-control border-start-0 ps-0" id="loginEmail" placeholder="nhập email" required>
+                             <div class="mb-4">
- >>>>>>> 3620f29 (Fix(P0): Nâng cấp thuật toán Camera (OpenCV) trên Mobile và cập nhật tài liệu Kiến trúc)
+                                 <label for="loginPassword" class="form-label fw-semibold text-secondary">Mật khẩu (<span class="text-danger">*</span>)</label>
-                                 </div>
+                                 <div class="input-group">
-                             </div>
+                                     <span class="input-group-text bg-white border-end-0"><i class='bx bx-lock-alt text-muted'></i></span>
-                             <div class="mb-4">
+                                     <input type="password" class="form-control border-start-0 ps-0" id="loginPassword" placeholder="••••••••" required>
-                                 <label for="loginPassword" class="form-label fw-semibold text-secondary">Mật khẩu (<span class="text-danger">*</span>)</label>
+                                 </div>
-                                 <div class="input-group">
+                             </div>
-                                     <span class="input-group-text bg-white border-end-0"><i class='bx bx-lock-alt text-muted'></i></span>
+                             <button type="submit" class="btn btn-primary w-100 py-2 fs-5 d-flex align-items-center justify-content-center gap-2">
-                                     <
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth DOCTYPE — adds runtime type validation before use**: - <!DOCTYPE html>
+ <!DOCTYPE html>
- <html lang="vi">
+ <html lang="vi">
- <head>
+ <head>
-     <meta charset="UTF-8">
+     <meta charset="UTF-8">
-     <meta name="viewport" content="width=device-width, initial-scale=1.0">
+     <meta name="viewport" content="width=device-width, initial-scale=1.0">
-     <title>Hệ Thống Quản Lý Chỉ Tiêu Mở Tài Khoản - Yên Thọ</title>
+     <title>Hệ Thống Quản Lý Chỉ Tiêu Mở Tài Khoản - Yên Thọ</title>
- 
+ 
-     <!-- Cache Control -->
+     <!-- Cache Control -->
-     <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
+     <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
-     <meta http-equiv="Pragma" content="no-cache">
+     <meta http-equiv="Pragma" content="no-cache">
-     <meta http-equiv="Expires" content="0">
+     <meta http-equiv="Expires" content="0">
- 
+ 
-     <!-- Pre-load styles -->
+     <!-- Pre-load styles -->
-     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
+     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
-     <link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
+     <link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
-     <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
+     <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
-     <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
+     <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
-     <link href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap5.min.css" rel="stylesheet">
+     <link href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.boo
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth index**: -                                     <input type="email" class="form-control border-start-0 ps-0" id="loginEmail" placeholder="nhập email" required>
+                                     <input type="email" class="form-control border-start-0 ps-0" id="loginEmail" placeholder="Nhập email" required>

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth index**: -                                     <input type="email" class="form-control border-start-0 ps-0" id="loginEmail" placeholder="abc.nguyen@yentho.com" required>
+                                     <input type="email" class="form-control border-start-0 ps-0" id="loginEmail" placeholder="nhập email" required>

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] Replaced auth TDND — confirmed 3x**: -                             <p class="mb-0 text-white-50 small">Quỹ TDND Yên Thọ &copy; 2026. Phiên bản hệ thống v2.1.9-FIX</p>
+                             <p class="mb-0 text-white-50 small">Quỹ TDND Yên Thọ &copy; 2026. Phiên bản hệ thống v2.2.0-HOTFIX</p>
-     <!-- Modules (v2.1.9-FIX) -->
+     <!-- Modules (v2.2.0-HOTFIX) -->
-     <script src="js/utils.js?v=2.1.9-fix"></script>
+     <script src="js/utils.js?v=2.2.0-hotfix"></script>
-     <script src="js/api.js?v=2.1.9-fix"></script>
+     <script src="js/api.js?v=2.2.0-hotfix"></script>
-     <script src="js/state.js?v=2.1.9-fix"></script>
+     <script src="js/state.js?v=2.2.0-hotfix"></script>
-     <script src="js/auth.js?v=2.1.9-fix"></script>
+     <script src="js/auth.js?v=2.2.0-hotfix"></script>
-     <script src="js/camera.js?v=2.1.9-fix"></script>
+     <script src="js/camera.js?v=2.2.0-hotfix"></script>
-     <script src="js/registration.js?v=2.1.9-fix"></script>
+     <script src="js/registration.js?v=2.2.0-hotfix"></script>
-     <script src="js/customer.js?v=2.1.9-fix"></script>
+     <script src="js/customer.js?v=2.2.0-hotfix"></script>
-     <script src="js/dashboard.js?v=2.1.9-fix"></script>
+     <script src="js/dashboard.js?v=2.2.0-hotfix"></script>
-     <script src="app.js?v=2.1.9-fix"></script>
+     <script src="app.js?v=2.2.0-hotfix"></script>

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] Replaced auth Modules — confirmed 3x**: -     <!-- Modules (v2.1.4-STABLE) -->
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
- **[convention] what-changed in index.html — confirmed 3x**: -                     <h5 class="fw-bold text-primary mb-2">QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ</h5>
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
