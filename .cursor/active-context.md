> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\index.html` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[what-changed] what-changed in index.html**: -                             <i class='bx bx-cloud-upload'></i> Gửi Hồ Sơ &amp; Nén Tự Động
+                             <i class='bx bx-send'></i> Gửi Hồ Sơ

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] what-changed in index.html**: -                             <p class="text-muted small mb-1">Phiên bản: v2.1.0</p>
+                             <p class="text-muted small mb-1">Phiên bản: v2.1.2-STABLE</p>

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] what-changed in index.html**: -     <script src="app.js"></script>
+     <script src="app.js?v=2.1.2"></script>

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth Cache — adds runtime type validation before use**: -     <!-- Pre-load styles -->
+     <!-- Cache Control -->
-     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
+     <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
-     <link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
+     <meta http-equiv="Pragma" content="no-cache">
-     <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
+     <meta http-equiv="Expires" content="0">
-     <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
+ 
-     <link href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap5.min.css" rel="stylesheet">
+     <!-- Pre-load styles -->
-     <link href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.bootstrap5.min.css" rel="stylesheet">
+     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
-     <link href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" rel="stylesheet">
+     <link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
-     <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet">
+     <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
-     <link href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" rel="stylesheet">
+     <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
-     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
+     <link href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap5.min.css" rel="stylesheet">
-     <link href="style.css" rel="stylesheet">
+     <link href="https:
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] Strengthened types Admin — adds runtime type validation before use**: -                         <div class="row g-3">
+                         <div id="edit_status_alert" class="alert alert-warning d-none py-2 mb-3 small shadow-sm">
-                             <div class="col-md-6"><label class="form-label">Tên Khách Hàng</label><input type="text" class="form-control" id="edit_ten_kh" required></div>
+                             <i class='bx bx-lock-alt me-1'></i> <strong>Chỉ xem:</strong> Hồ sơ đã xác minh. Liên hệ Admin để sửa.
-                             <div class="col-md-6"><label class="form-label">Số điện thoại</label><input type="tel" class="form-control" id="edit_sdt" required></div>
+                         </div>
-                             <div class="col-md-6"><label class="form-label">Ngày mở</label><input type="text" class="form-control js-datepicker-edit" id="edit_ngay_mo" required></div>
+                         <div class="row g-3">
-                             <div class="col-md-6">
+                             <div class="col-md-6"><label class="form-label fw-semibold">Tên Khách Hàng</label><input type="text" class="form-control text-uppercase" id="edit_ten_kh" required></div>
-                                 <label class="form-label">Số Tài khoản</label>
+                             <div class="col-md-6"><label class="form-label fw-semibold">Số điện thoại</label><input type="tel" class="form-control" id="edit_sdt" required></div>
-                                 <div class="input-group">
+                             <div class="col-md-6" id="edit_cccd_group"><label class="form-label fw-semibold">Số CCCD (12 số)</label><input type="text" class="form-control" id="edit_cccd" maxlength="12"></div>
-                                     <span class="input-group-text">3800200</span>
+                             <div class="col-md-6" id="edit_dkkd_group" style="display:none;"><label class="form-label fw-semibold">Số Giấy phép ĐKKD</label><input type="text" class="form-control" id="edit_dkkd"></div>
-     
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] what-changed in index.html — confirmed 3x**: -                     <button class="btn btn-outline-secondary btn-sm d-none d-sm-flex align-items-center gap-1 shadow-sm" onclick="$('#modalChangePassword').modal('show')">
+                     <button class="btn btn-outline-secondary btn-sm d-none d-sm-flex align-items-center gap-1 shadow-sm" onclick="openChangePasswordModal()">
-                     <button class="btn btn-outline-secondary btn-sm d-none d-sm-flex align-items-center gap-1 bg-white shadow-sm" onclick="$('#modalChangePassword').modal('show')">
+                     <button class="btn btn-outline-secondary btn-sm d-none d-sm-flex align-items-center gap-1 bg-white shadow-sm" onclick="openChangePasswordModal()">

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth EMAIL — adds runtime type validation before use**: -                                         <th>Họ TÊN</th>
+                                         <th>HỌ TÊN</th>
-                                         <th>SỐ ĐKKD</th>
+                                         <th class="d-none">EMAIL CB</th>
-                                         <th>SỐ CCCD</th>
+                                         <th>CÁN BỘ</th>
-                                         <th>SỐ ĐIỆN THOẠI</th>
+                                         <th class="text-end">CHI TIẾT</th>
-                                         <th>TÊN ĐN</th>
+                                     </tr>
-                                         <th>MK</th>
+                                 </thead>
-                                         <th>TÊN CÁN BỘ</th>
+                                 <tbody></tbody>
-                                         <th>CÁN BỘ</th>
+                             </table>
-                                         <th class="text-end">THAO TÁC</th>
+                         </div>
-                                     </tr>
+                     </div>
-                                 </thead>
+                 </div>
-                                 <tbody></tbody>
+                 <div class="col-12 col-xl-4 d-flex flex-column gap-4">
-                             </table>
+                     <div class="glass-card p-4">
-                         </div>
+                         <h6 class="fw-bold mb-3 text-secondary text-uppercase d-flex justify-content-between align-items-center">
-                     </div>
+                             <span>Top 5 Cán Bộ</span>
-                 </div>
+                             <button class="btn btn-sm btn-outline-primary" onclick="showAllStaffModal()">Chi tiết</button>
-                 <div class="col-12 col-xl-4 d-flex flex-column gap-4">
+                         </h6>
-                     <div class="glass-card p-4">
+                         <div id="db-topstaff" class="d-flex f
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth THAO — adds runtime type validation before use**: -                                         <th>TRẠNG THÁI</th>
+                                         <th class="text-end">THAO TÁC</th>
-                                         <th class="text-end">THAO TÁC</th>
+                                     </tr>
-                                     </tr>
+                                 </thead>
-                                 </thead>
+                                 <tbody></tbody>
-                                 <tbody></tbody>
+                             </table>
-                             </table>
+                         </div>
-                         </div>
+                     </div>
-                     </div>
+                 </div>
-                 </div>
+                 <div class="col-12 col-xl-4 d-flex flex-column gap-4">
-                 <div class="col-12 col-xl-4 d-flex flex-column gap-4">
+                     <div class="glass-card p-4">
-                     <div class="glass-card p-4">
+                         <h6 class="fw-bold mb-3 text-secondary text-uppercase d-flex justify-content-between align-items-center">
-                         <h6 class="fw-bold mb-3 text-secondary text-uppercase d-flex justify-content-between align-items-center">
+                             <span>Top 5 Cán Bộ</span>
-                             <span>Top 5 Cán Bộ</span>
+                             <button class="btn btn-sm btn-outline-primary" onclick="showAllStaffModal()">Chi tiết</button>
-                             <button class="btn btn-sm btn-outline-primary" onclick="showAllStaffModal()">Chi tiết</button>
+                         </h6>
-                         </h6>
+                         <div id="db-topstaff" class="d-flex flex-column gap-2"></div>
-                         <div id="db-topstaff" class="d-flex flex-column gap-2"></div>
+                     </div>
-                     </div>
+                     <div class="glass-card p-4">
-                     <div class="g
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
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
