> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\app.js` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[problem-fix] Fixed null crash in NETLIFY — hardens HTTP security headers**: -  * NETLIFY APP ENGINE - V2.0
+  * NETLIFY HIGH-FIDELITY APP ENGINE (app.js)
-  * Decoupled Frontend logic for HoKinhDoanh System
+  * Phiên bản nâng cấp: Hỗ trợ OpenCV, Nén ảnh tự động, Dashboard và DataTables chuyên nghiệp.
-  */
+  * Hệ thống giao tiếp với GAS Backend qua API JSON (doPost).
- 
+  */
- const CONFIG = {
+ 
-     // URL của Google Apps Script Web App (doPost)
+ const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzf4m3V5P61c3XhU8T0Y4-U0o7B8hE_z6x9_7z6_7z6/exec"; // CẦN CẬP NHẬT URL THỰC TẾ
-     API_URL: "https://script.google.com/macros/s/AKfycbyXBMdJO2JmoaarxW9l7mg-l4tyN6BF1U01jaMPQ48xmVOZM9WFWLnOTIc9Wyf1OpFr/exec",
+ 
-     VERSION: "2.0.0-netlify",
+ const AppState = {
-     CACHE_TTL: 180000 // 3 minutes
+     user: JSON.parse(localStorage.getItem('HOKINHDOANH_SESSION')) || null,
- };
+     VERSION: "2.0.0-HIFI",
- 
+     apiBase: "" // Sẽ được cập nhật từ URL triển khai
- const AppState = {
+ };
-     user: null,
+ 
-     isInitialLoad: true
+ /**
- };
+  * CACHE SYSTEM
- 
+  */
-     set(key, val) {
+     TTL: 180000, 
-         this.data[key] = val;
+     isFresh(key) {
-         this.timestamp[key] = Date.now();
+         if (!this.timestamp[key]) return false;
-     },
+         return (Date.now() - this.timestamp[key]) < this.TTL;
-     get(key) {
+     },
-         if (!this.timestamp[key] || (Date.now() - this.timestamp[key]) > CONFIG.CACHE_TTL) return null;
+     set(key, val) {
-         return this.data[key];
+         this.data[key] = val;
-     },
+         this.timestamp[key] = Date.now();
-     clear(key) {
+     },
-         delete this.data[key];
+     get(key) {
-         delete this.timestamp[key];
+         return this.isFresh(key) ? this.data[key] : null;
-     clearAll() {
+     clear(key) {
-         this.data = {};
+         delete this.data[key];
-         this.timestamp = {};
+         delete this.timestamp[key];
-     }
+     },
- };
+     clearAll() {
- 
+         this.data = {};
- /**
+         this.timest
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
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
- **[convention] Replaced auth Inter — adds runtime type validation before use — confirmed 3x**: -     <div id="global-spinner">
+     <style>
-         <div class="spinner-border text-success spinner-lg" role="status"></div>
+         :root { --emerald: #10b981; --emerald-dark: #059669; --slate: #64748b; --amber: #f59e0b; }
-         <h5 class="mt-3 fw-bold text-secondary">Đang kết nối hệ thống...</h5>
+         body { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); min-height: 100vh; font-family: 'Inter', sans-serif; color: #1e293b; margin: 0; padding: 0; }
-     </div>
+         .glass-card { background: rgba(255, 255, 255, 0.8); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transition: transform 0.2s; }
- 
+         #global-spinner { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.9); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; }
-     <div id="app-container" class="container py-4 mb-5">
+         .handle-interaction { pointer-events: auto; cursor: move; }
-         <!-- VIEW: LOGIN -->
+         .chart-container-pie { height: 250px; position: relative; }
-         <section id="view-login" class="view-section">
+         .mw-150px { max-width: 150px; }
-             <div class="container d-flex justify-content-center align-items-center min-vh-80">
+         div#preact-border-shadow-host { display: none; }
-                 <div class="col-12 col-md-6 col-lg-4">
+         .img-preview-box { width: 100%; height: 120px; border: 2px dashed #10b981; border-radius: 0.5rem; overflow: hidden; background: #f8fafc; display: flex; align-items: center; justify-content: center; }
-                     <div class="card p-4 p-md-5 border-0 shadow-lg rounded-4 login-card-layout glass-card">
+         .img-preview-inner { width: 100%; height: 100%; object-fit: contain; display: block; }
-                         <div class="text-
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [html]
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
- **[discovery] discovery in app.js**: - const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyI_L8zO9X9H5S4_vB-pGZ4C8jH5XhZxG-R7q_6G/exec"; 
+ const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyXBMdJO2JmoaarxW9l7mg-l4tyN6BF1U01jaMPQ48xmVOZM9WFWLnOTIc9Wyf1OpFr/exec"; 

📌 IDE AST Context: Modified symbols likely include [APPS_SCRIPT_URL, fetchAPI, utils_formatDate, getStatusBadge, initMyCustomersList]
