> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\index.html` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[convention] Strengthened types Scripts — adds runtime type validation before use**: -     <script>
+     <!-- Scripts -->
-         var Module = {
+     <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
-             onRuntimeInitialized: function() { if (typeof onOpenCvReady === 'function') onOpenCvReady(); }
+     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
-         };
+     <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.10.8/dist/sweetalert2.all.min.js"></script>
-     </script>
+     <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
-     <script src="https://docs.opencv.org/4.8.0/opencv.js" async></script>
+     <script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
-     
+     <script src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js"></script>
-     <script src="app.js"></script>
+     <script src="https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js"></script>
- </body>
+     <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"></script>
- </html>
+     <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"></script>
- 
+     <script>
+         var Module = {
+             onRuntimeInitialized: function() { if (typeof onOpenCvReady === 'function') onOpenCvReady(); }
+         };
+     </script>
+     <script src="https://docs.opencv.org/4.8.0/opencv.js" async></script>
+     
+     <script src="app.js"></script>
+ </body>
+ </html>
+ 

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] Strengthened types Module — adds runtime type validation before use**: -     <!-- Scripts -->
+     <script>
-     <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
+         var Module = {
-     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
+             onRuntimeInitialized: function() { if (typeof onOpenCvReady === 'function') onOpenCvReady(); }
-     <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.10.8/dist/sweetalert2.all.min.js"></script>
+         };
-     <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
+     </script>
-     <script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
+     <script src="https://docs.opencv.org/4.8.0/opencv.js" async></script>
-     <script src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js"></script>
+     
-     <script src="https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js"></script>
+     <script src="app.js"></script>
-     <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"></script>
+ </body>
-     <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"></script>
+ </html>
-     <script src="https://docs.opencv.org/4.8.0/opencv.js" async></script>
+ 
-     
-     <script src="app.js"></script>
- </body>
- </html>
- 

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] Fixed null crash in HACK — hardens HTTP security headers — confirmed 3x**: -         // Lưu ý: GAS Web App khi gọi từ domain khác thường gặp vấn đề CORS.
+         // HACK: Dùng 'text/plain' để trình duyệt KHÔNG gửi OPTIONS request (CORS Preflight)
-         // Sử dụng 'text/plain' là trick để trình duyệt không gửi OPTIONS request.
+         // GAS doPost vẫn nhận chuỗi JSON này qua e.postData.contents
-             header: { 'Content-Type': 'text/plain;charset=utf-8' },
+             mode: 'cors',
-         const result = await response.json();
+         // Lưu ý: GAS thường redirect (302). Fetch với 'follow' sẽ tự xử lý.
-         
+         const result = await response.json();
-         if (loadingMsg !== 'NONE') hideLoading();
+         
- 
+         if (loadingMsg !== 'NONE') hideLoading();
-         if (result.status === 'success') {
+ 
-             if (successCallback) successCallback(result);
+         if (result.status === 'success') {
-         } else {
+             if (successCallback) successCallback(result);
-             showAlert('Lỗi', result.message || 'Xử lý thất bại', 'error');
+         } else {
-             if (errorCallback) errorCallback(result);
+             showAlert('Lỗi', result.message || 'Xử lý thất bại', 'error');
-         }
+             if (errorCallback) errorCallback(result);
-     } catch (err) {
+         }
-         if (loadingMsg !== 'NONE') hideLoading();
+     } catch (err) {
-         console.error("API Call Failed:", err);
+         if (loadingMsg !== 'NONE') hideLoading();
-         // Do GAS redirection, sometimes fetch fails even if it works. 
+         console.error("API Call Failed:", err);
-         // We will improve the Backend to handle this better in Phase 3 if needed.
+         
-         showAlert('Lỗi Kết Nối', 'Không thể kết nối với Máy chủ Google. Vui lòng kiểm tra internet.', 'error');
+         // Handle possible silent success (where GAS executes but response is opaque due to CORS/Redirect)
-         if (errorCallback) errorCallback(err);
+         if (action === 'api_submit
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [CONFIG, AppState, AppCache, fetchAPI, runAPI]
- **[problem-fix] problem-fix in index.html**: -     <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
+     <script src="https://code.jquery.com/jquery-3.7.1.min.js" onerror="alert('Không thể tải jQuery từ CDN. Vui lòng kiểm tra internet!')"></script>
-     <script src="app.js"></script>
+     <script src="app.js?v=2"></script>

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] Strengthened types Scripts**: -                         </div>
+                             <div class="col-md-6">
-                         <h6 class="fw-bold text-secondary mt-4 mb-3 border-bottom pb-2">Chứng từ đính kèm</h6>
+                                 <label class="form-label">Tên đăng nhập <small class="text-muted">(nếu có)</small></label>
-                         <div class="row g-3" id="edit_images_container"></div>
+                                 <input type="text" class="form-control" id="edit_ten_dang_nhap">
-                         <div class="mt-4 text-end">
+                             </div>
-                             <button type="button" class="btn btn-secondary px-4 me-2" data-bs-dismiss="modal">Đóng</button>
+                         </div>
-                             <button type="submit" class="btn btn-success px-4" id="btnSaveEdit">Lưu thay đổi</button>
+                         <h6 class="fw-bold text-secondary mt-4 mb-3 border-bottom pb-2">Chứng từ đính kèm</h6>
-                         </div>
+                         <div class="row g-3" id="edit_images_container"></div>
-                     </form>
+                         <div class="mt-4 text-end">
-                 </div>
+                             <button type="button" class="btn btn-secondary px-4 me-2" data-bs-dismiss="modal">Đóng</button>
-             </div>
+                             <button type="submit" class="btn btn-success px-4" id="btnSaveEdit">Lưu thay đổi</button>
-         </div>
+                         </div>
-     </div>
+                     </form>
- 
+                 </div>
-     <nav class="navbar fixed-bottom bg-white border-top shadow-sm initially-hidden" id="staffBottomNav">
+             </div>
-       <div class="container-fluid d-flex justify-content-around p-1">
+         </div>
-         <a href="#" class="nav-link text-center px-4 text-primary fw-bold" id="navOpenAccount" onclick="loadStaffOpenAccountView()">
+     </div>
-           <i class='bx bx-user-plus
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth Loading**: -     </style>
+         .select-auto-width { width: auto !important; }
- </head>
+         .chart-container-monthly { position: relative; height: 240px; }
- <body>
+     </style>
-     <div id="global-spinner">
+ </head>
-         <div class="spinner-border text-success spinner-lg" role="status"></div>
+ <body>
-         <h5 class="mt-3 fw-bold text-secondary">Đang khởi tạo hệ thống...</h5>
+     <div id="global-spinner">
-     </div>
+         <div class="spinner-border text-success spinner-lg" role="status"></div>
- 
+         <h5 class="mt-3 fw-bold text-secondary">Đang khởi tạo hệ thống...</h5>
-     <div id="app-container" class="container py-4 mb-5">
+     </div>
-         <script>console.log("Loading frmLogin...");</script>
+ 
-         <div id="view-login" class="view-item"><?!= include('frmLogin'); ?></div>
+     <div id="app-container" class="container py-4 mb-5">
-         <div id="view-mo-tai-khoan" class="view-item view-item-hidden"><?!= include('frmMoTaiKhoan'); ?></div>
+         <script>console.log("Loading frmLogin...");</script>
-         <script>console.log("Loading frmMyCustomers...");</script>
+         <div id="view-login" class="view-item"><?!= include('frmLogin'); ?></div>
-         <div id="view-my-customers" class="view-item view-item-hidden"><?!= include('frmMyCustomers'); ?></div>
+         <div id="view-mo-tai-khoan" class="view-item view-item-hidden"><?!= include('frmMoTaiKhoan'); ?></div>
-         <script>console.log("Loading frmDashboard...");</script>
+         <script>console.log("Loading frmMyCustomers...");</script>
-         <div id="view-dashboard" class="view-item view-item-hidden"><?!= include('frmDashboard'); ?></div>
+         <div id="view-my-customers" class="view-item view-item-hidden"><?!= include('frmMyCustomers'); ?></div>
-         <script>console.log("All templates included.");</script>
+         <script>console.log("Loading frmDashboard...");</script>
-     </div>
+         <div id="view-dashboard" class="view-ite
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth Loading**: -     </style>
+         .view-item-hidden { display: none; }
- </head>
+         .progress-bar-zero { width: 0%; }
- <body>
+     </style>
-     <div id="global-spinner">
+ </head>
-         <div class="spinner-border text-success spinner-lg" role="status"></div>
+ <body>
-         <h5 class="mt-3 fw-bold text-secondary">Đang khởi tạo hệ thống...</h5>
+     <div id="global-spinner">
-     </div>
+         <div class="spinner-border text-success spinner-lg" role="status"></div>
- 
+         <h5 class="mt-3 fw-bold text-secondary">Đang khởi tạo hệ thống...</h5>
-     <div id="app-container" class="container py-4 mb-5">
+     </div>
-         <script>console.log("Loading frmLogin...");</script>
+ 
-         <div id="view-login" class="view-item"><?!= include('frmLogin'); ?></div>
+     <div id="app-container" class="container py-4 mb-5">
-         <div id="view-mo-tai-khoan" class="view-item" style="display: none;"><?!= include('frmMoTaiKhoan'); ?></div>
+         <script>console.log("Loading frmLogin...");</script>
-         <script>console.log("Loading frmMyCustomers...");</script>
+         <div id="view-login" class="view-item"><?!= include('frmLogin'); ?></div>
-         <div id="view-my-customers" class="view-item" style="display: none;"><?!= include('frmMyCustomers'); ?></div>
+         <div id="view-mo-tai-khoan" class="view-item view-item-hidden"><?!= include('frmMoTaiKhoan'); ?></div>
-         <script>console.log("Loading frmDashboard...");</script>
+         <script>console.log("Loading frmMyCustomers...");</script>
-         <div id="view-dashboard" class="view-item" style="display: none;"><?!= include('frmDashboard'); ?></div>
+         <div id="view-my-customers" class="view-item view-item-hidden"><?!= include('frmMyCustomers'); ?></div>
-         <script>console.log("All templates included.");</script>
+         <script>console.log("Loading frmDashboard...");</script>
-     </div>
+         <div id="view-dashboard" class="view-item view-item-hidden"><?
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] Replaced auth Loading — confirmed 3x**: -     </style>
+         .compress-progress-track { height: 10px; border-radius: 5px; }
- </head>
+     </style>
- <body>
+ </head>
-     <div id="global-spinner">
+ <body>
-         <div class="spinner-border text-success spinner-lg" role="status"></div>
+     <div id="global-spinner">
-         <h5 class="mt-3 fw-bold text-secondary">Đang khởi tạo hệ thống...</h5>
+         <div class="spinner-border text-success spinner-lg" role="status"></div>
-     </div>
+         <h5 class="mt-3 fw-bold text-secondary">Đang khởi tạo hệ thống...</h5>
- 
+     </div>
-     <div id="app-container" class="container py-4 mb-5">
+ 
-         <script>console.log("Loading frmLogin...");</script>
+     <div id="app-container" class="container py-4 mb-5">
-         <div id="view-login" class="view-item"><?!= include('frmLogin'); ?></div>
+         <script>console.log("Loading frmLogin...");</script>
-         <div id="view-mo-tai-khoan" class="view-item" style="display: none;"><?!= include('frmMoTaiKhoan'); ?></div>
+         <div id="view-login" class="view-item"><?!= include('frmLogin'); ?></div>
-         <script>console.log("Loading frmMyCustomers...");</script>
+         <div id="view-mo-tai-khoan" class="view-item" style="display: none;"><?!= include('frmMoTaiKhoan'); ?></div>
-         <div id="view-my-customers" class="view-item" style="display: none;"><?!= include('frmMyCustomers'); ?></div>
+         <script>console.log("Loading frmMyCustomers...");</script>
-         <script>console.log("Loading frmDashboard...");</script>
+         <div id="view-my-customers" class="view-item" style="display: none;"><?!= include('frmMyCustomers'); ?></div>
-         <div id="view-dashboard" class="view-item" style="display: none;"><?!= include('frmDashboard'); ?></div>
+         <script>console.log("Loading frmDashboard...");</script>
-         <script>console.log("All templates included.");</script>
+         <div id="view-dashboard" class="view-item" style="display: none;"><?!= include('f
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth Khung**: -         div#preact-border-shadow-host {
+         div#preact-border-shadow-host { display: none; }
-           display: none;
+         /* Khung xem trước ảnh cố định - ảnh nằm gọn trong khung */
-         }
+         .img-preview-box {
-     </style>
+             width: 100%;
- </head>
+             height: 120px;
- <body>
+             border: 2px dashed #10b981;
-     <div id="global-spinner">
+             border-radius: 0.5rem;
-         <div class="spinner-border text-success spinner-lg" role="status"></div>
+             overflow: hidden;
-         <h5 class="mt-3 fw-bold text-secondary">Đang khởi tạo hệ thống...</h5>
+             background: #f8fafc;
-     </div>
+             display: flex;
- 
+             align-items: center;
-     <div id="app-container" class="container py-4 mb-5">
+             justify-content: center;
-         <script>console.log("Loading frmLogin...");</script>
+         }
-         <div id="view-login" class="view-item"><?!= include('frmLogin'); ?></div>
+         .img-preview-inner {
-         <div id="view-mo-tai-khoan" class="view-item" style="display: none;"><?!= include('frmMoTaiKhoan'); ?></div>
+             width: 100%;
-         <script>console.log("Loading frmMyCustomers...");</script>
+             height: 100%;
-         <div id="view-my-customers" class="view-item" style="display: none;"><?!= include('frmMyCustomers'); ?></div>
+             object-fit: contain;
-         <script>console.log("Loading frmDashboard...");</script>
+             display: block;
-         <div id="view-dashboard" class="view-item" style="display: none;"><?!= include('frmDashboard'); ?></div>
+         }
-         <script>console.log("All templates included.");</script>
+         /* Khung ảnh trong modal chi tiết */
-     </div>
+         .img-detail-box {
- 
+             width: 100%;
-     <!-- Modals (Bản đầy đủ) -->
+             height: 130px;
-     <div class="modal fade" id="modalChangePassword" tabindex="-1" aria-hidden="true" da
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[convention] what-changed in index.html — confirmed 3x**: -                                     <span class="input-group-text">380200</span>
+                                     <span class="input-group-text">3800200</span>

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth Inter**: -     <!-- Thư viện JS CDN 
+     <!-- Thư viện JS CDN -->
-     -->
+ 
- 
+     <style>
-     <style>
+         :root { --emerald: #10b981; --emerald-dark: #059669; --slate: #64748b; --amber: #f59e0b; }
-         :root {
+         body { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); min-height: 100vh; font-family: 'Inter', sans-serif; color: #1e293b; margin: 0; padding: 0; }
-             --emerald: #10b981;
+         .glass-card { background: rgba(255, 255, 255, 0.8); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transition: transform 0.2s; }
-             --emerald-dark: #059669;
+         #global-spinner { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.9); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; }
-             --slate: #64748b;
+         .initially-hidden { display: none !important; }
-             --amber: #f59e0b;
+         .handle-interaction { pointer-events: auto; cursor: move; }
-         }
+         .chart-container-pie { height: 250px; position: relative; }
- 
+         .mw-150px { max-width: 150px; }
-         body {
+         div#preact-border-shadow-host {
-             background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
+           display: none;
-             min-height: 100vh;
+         }
-             font-family: 'Inter', sans-serif;
+     </style>
-             color: #1e293b;
+ </head>
-             margin: 0;
+ <body>
-             padding: 0;
+     <div id="global-spinner">
-         }
+         <div class="spinner-border text-success spinner-lg" role="status"></div>
- 
+         <h5 class="mt-3 fw-bold text-secondary">Đang khởi tạo hệ thống...</h5>
-         .glass-card {
+     </div>
-             background: rgba(255, 255, 255, 0.8);
+ 
-             -webkit-backdrop-filter: b
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] 🟢 Edited index.html (102 changes, 3min)**: Active editing session on index.html.
102 content changes over 3 minutes.
- **[what-changed] Replaced auth GLOBAL**: - <html>
+ <html lang="vi">
- <head>
+ 
-     <meta charset="UTF-8">
+ <head>
-     <title>BASELINE TEST</title>
+     <meta charset="UTF-8">
- </head>
+     <meta name="viewport" content="width=device-width, initial-scale=1.0">
- <body>
+     <title>Hệ Thống Quản Lý Chỉ Tiêu Mở Tài Khoản - Yên Thọ</title>
-     <h1>HELLO WORLD - ISOLATION TEST</h1>
+ 
-         console.log("BASELINE TEST: Script is running.");
+         /**
-         window.onerror = function(msg, url, line, col, error) {
+          * GLOBAL ERROR HANDLER - V1.4.3
-             console.log("BASELINE ERROR:", msg, "at", line, ":", col);
+          * Bẫy mọi lỗi JS ngay khi load trang, bao gồm cả lỗi Syntax/Parse
-             return false;
+          */
-         };
+         window.onerror = function (msg, url, lineNo, columnNo, error) {
-     </script>
+             var errorMsg = "⚠️ HỆ THỐNG GẶP LỖI\n\n" +
- </body>
+                 "Nội dung: " + msg + "\n" +
- </html>
+                 "Tệp: " + (url ? url.split('/').pop() : 'inline') + "\n" +
+                 "Dòng: " + lineNo + " : " + columnNo;
+ 
+             if (error && error.stack) {
+                 errorMsg += "\n\nStack Trace: " + error.stack;
+             }
+ 
+             console.error("[CRITICAL SYSTEM ERROR]", error || msg);
+             alert(errorMsg);
+ 
+             // Tắt spinner nếu đang xoay
+             var spinner = document.getElementById('global-spinner');
+             if (spinner) spinner.style.display = 'none';
+ 
+             return false;
+         };
+         // Fallback OpenCV early
+         window.onOpenCvReady = function () { console.log("OpenCV script loaded (Success)."); };
+     </script>
+ 
+     <!-- Thư viện CSS CDN -->
+     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
+     <link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
+     <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth BASELINE**: - <html lang="vi">
+ <html>
-     <meta name="viewport" content="width=device-width, initial-scale=1.0">
+     <title>BASELINE TEST</title>
-     <title>Hệ Thống Quản Lý Chỉ Tiêu Mở Tài Khoản - Yên Thọ</title>
+ </head>
- 
+ <body>
-     <script>
+     <h1>HELLO WORLD - ISOLATION TEST</h1>
-         /**
+     <script>
-          * GLOBAL ERROR HANDLER - V1.4.3
+         console.log("BASELINE TEST: Script is running.");
-          * Bẫy mọi lỗi JS ngay khi load trang, bao gồm cả lỗi Syntax/Parse
+         window.onerror = function(msg, url, line, col, error) {
-          */
+             console.log("BASELINE ERROR:", msg, "at", line, ":", col);
-         window.onerror = function(msg, url, lineNo, columnNo, error) {
+             return false;
-             var errorMsg = "⚠️ HỆ THỐNG GẶP LỖI\n\n" +
+         };
-                           "Nội dung: " + msg + "\n" +
+     </script>
-                           "Tệp: " + (url ? url.split('/').pop() : 'inline') + "\n" +
+ </body>
-                           "Dòng: " + lineNo + " : " + columnNo;
+ </html>
-             
-             if (error && error.stack) {
-                 errorMsg += "\n\nStack Trace: " + error.stack;
-             }
-             
-             console.error("[CRITICAL SYSTEM ERROR]", error || msg);
-             alert(errorMsg);
-             
-             // Tắt spinner nếu đang xoay
-             var spinner = document.getElementById('global-spinner');
-             if (spinner) spinner.style.display = 'none';
-             
-             return false;
-         };
-         // Fallback OpenCV early
-         window.onOpenCvReady = function() { console.log("OpenCV script loaded (Success)."); };
-     </script>
- 
-     <!-- Thư viện CSS CDN -->
-     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
-     <link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
-     <link href="https://cdn.jsdelivr.
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
- **[what-changed] Replaced auth MrSaints**: -     <!-- Thư viện JS CDN -->
+     <!-- Thư viện JS CDN 
-     <script src="https://cdn.jsdelivr.net/gh/MrSaints/pdfmake-vietnamese-vfs/vfs_fonts.js"></script>
+     <script src="https://cdn.jsdelivr.gh/MrSaints/pdfmake-vietnamese-vfs/vfs_fonts.js"></script>
- 
+     -->
-     <style>
+ 
-         :root { --emerald: #10b981; --emerald-dark: #059669; --slate: #64748b; --amber: #f59e0b; }
+     <style>
-         body { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); min-height: 100vh; font-family: 'Inter', sans-serif; color: #1e293b; margin: 0; padding: 0; }
+         :root { --emerald: #10b981; --emerald-dark: #059669; --slate: #64748b; --amber: #f59e0b; }
-         .glass-card { background: rgba(255, 255, 255, 0.8); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transition: transform 0.2s; }
+         body { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); min-height: 100vh; font-family: 'Inter', sans-serif; color: #1e293b; margin: 0; padding: 0; }
-         #global-spinner { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.9); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; }
+         .glass-card { background: rgba(255, 255, 255, 0.8); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transition: transform 0.2s; }
-         .initially-hidden { display: none !important; }
+         #global-spinner { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.9); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; }
-         .handle-interaction { pointer-events: auto; cursor: move; }
+         .initially-
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
