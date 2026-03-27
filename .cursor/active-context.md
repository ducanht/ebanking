> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\app.js` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[problem-fix] Fixed null crash in JSON — wraps unsafe operation in error boundary**: -             const s = typeof res.stats === 'string' ? JSON.parse(res.stats) : res.stats;
+             let s = null;
-             renderAdminStats(s);
+             if (res.statsStr) {
-             renderAdminCharts(s);
+                 try { s = JSON.parse(res.statsStr); } catch(e) { console.error("Parse statsStr error", e); }
-             renderAdminTable(s.allData, s.allStaffs);
+             } else {
-         }
+                 s = res.stats;
-     });
+             }
- }
+ 
- 
+             if (!s) {
- function renderAdminStats(s) {
+                 console.error("Dashboard stats is null", res);
-     $('#db-total').text(s.total || 0);
+                 return;
-     $('#db-pending').text(s.pending || 0);
+             }
-     $('#db-approved').text(s.approved || 0);
+ 
-     $('#db-ca-nhan').text(s.caNhan || 0);
+             renderAdminStats(s);
-     $('#db-hkd-count').text(s.hkd || 0);
+             renderAdminCharts(s);
- }
+             renderAdminTable(s.allData || [], s.allStaffs || []);
- 
+         }
- function renderAdminCharts(s) {
+     });
-     if (charts.pie) charts.pie.destroy();
+ }
-     const ctxPie = document.getElementById('chartLoaiHinh').getContext('2d');
+ 
-     charts.pie = new Chart(ctxPie, {
+ function renderAdminStats(s) {
-         type: 'doughnut',
+     $('#db-total').text(s.total || 0);
-         data: {
+     $('#db-pending').text(s.pending || 0);
-             labels: ['Cá nhân', 'Hộ kinh doanh'],
+     $('#db-approved').text(s.approved || 0);
-             datasets: [{
+     $('#db-ca-nhan').text(s.caNhan || 0);
-                 data: [s.loaiHinh['Cá nhân'] || 0, s.loaiHinh['Hộ kinh doanh'] || 0],
+     $('#db-hkd-count').text(s.hkd || 0);
-                 backgroundColor: ['#10b981', '#f59e0b']
+ }
-             }]
+ 
-         },
+ function renderAdminCharts(s) {
-         options: { responsive: true, maintainAspectRatio: false }
+     if (charts.pie) charts.pie.destroy();
-     });
+     const ctxPie = document
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[what-changed] what-changed in app.js**: - const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzf4m3V5P61c3XhU8T0Y4-U0o7B8hE_z6x9_7z6_7z6/exec"; // CẦN CẬP NHẬT URL THỰC TẾ
+ const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyXBMdJO2JmoaarxW9l7mg-l4tyN6BF1U01jaMPQ48xmVOZM9WFWLnOTIc9Wyf1OpFr/exec";

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[problem-fix] Fixed null crash in CORS — hardens HTTP security headers**: -         const response = await fetch(GAS_API_URL, {
+         // Sử dụng text/plain để tránh kích hoạt CORS Preflight (OPTIONS request) mà GAS không hỗ trợ
-             method: "POST",
+         const response = await fetch(GAS_API_URL, {
-             mode: "no-cors", // Quan trọng cho GAS
+             method: "POST",
-             headers: { "Content-Type": "application/json" },
+             headers: {
-             body: JSON.stringify({ action, ...data })
+                 "Content-Type": "text/plain;charset=utf-8"
-         });
+             },
- 
+             body: JSON.stringify({ action: action, data: data })
-         // Với no-cors, chúng ta không đọc được body trực tiếp. 
+         });
-         // Tuy nhiên, chúng ta sẽ sử dụng một trick: GAS sẽ redirect về một URL chứa kết quả nếu cần, 
+ 
-         // hoặc chúng ta dùng JSONP/CORS chuẩn nếu người dùng đã cấu hình.
+         if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
-         // Ở đây, giả định GAS đã được cấu hình CORS chuẩn (trả về Content-Type: application/json).
+         
-         
+         const result = await response.json();
-         // TRICK: Vì fetch no-cors không đọc được response, 
+         
-         // nhưng GAS Web App bản chất là hỗ trợ CORS nếu ta xử lý Option request hoặc dùng Redirect.
+         if (loadingMsg !== 'NONE') hideLoading();
-         // Giải pháp tốt nhất cho Standalone là dùng CORS thực thụ (GAS trả về TextOutput).
+         if (successHandler) successHandler(result);
-         
+         return result;
-         const realResponse = await fetch(GAS_API_URL, {
+ 
-             method: "POST",
+     } catch (error) {
-             body: JSON.stringify({ action, ...data })
+         if (loadingMsg !== 'NONE') hideLoading();
-         });
+         console.error(`API Error [${action}]:`, error);
-         const result = await realResponse.json();
+         // Trình duyệt có thể ném lỗi "Failed to fetch" nếu URL sai hoặc CORS bị chặn
-   
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, AppCache, runAPI, showLoading]
- **[convention] Fixed null crash in NONE — adds runtime type validation before use — confirmed 5x**: -     }, () => btn.prop('disabled', false).html(oldBtn), 'NONE');
+         } else showAlert('Lỗi', res.message, 'error');
- }
+     }, () => btn.prop('disabled', false).html(oldBtn), 'NONE');
- 
+ }
- /**
+ 
-  * STAFF CUSTOMER LOGIC
+ /**
-  */
+  * STAFF CUSTOMER LOGIC
- async function initMyCustomersList() {
+  */
-     if (!AppState.user) return;
+ async function initMyCustomersList() {
-     
+     if (!AppState.user) return;
-     const cached = AppCache.get('myCustomers');
+     
-     if (cached) {
+     const cached = AppCache.get('myCustomers');
-         renderMyCustomersTable(cached.data);
+     if (cached) {
-         return;
+         renderMyCustomersTable(cached.data);
-     }
+         return;
- 
+     }
-     $('#tbMyCustomersBody').html('<tr><td colspan="7" class="text-center py-4"><span class="spinner-border text-primary"></span><br>Đang đồng bộ...</td></tr>');
+ 
-     
+     $('#tbMyCustomersBody').html('<tr><td colspan="7" class="text-center py-4"><span class="spinner-border text-primary"></span><br>Đang đồng bộ...</td></tr>');
-     runAPI('api_getMyCustomers', { email: AppState.user.email }, (res) => {
+     
-         if (res.status === 'success') {
+     runAPI('api_getMyCustomers', { email: AppState.user.email }, (res) => {
-             AppCache.set('myCustomers', res);
+         if (res.status === 'success') {
-             renderMyCustomersTable(res.data || []);
+             AppCache.set('myCustomers', res);
-         } else {
+             renderMyCustomersTable(res.data || []);
-             $('#tbMyCustomersBody').html(`<tr><td colspan="7" class="text-center text-danger py-4">Lỗi: ${res.message}</td></tr>`);
+         } else {
-         }
+             $('#tbMyCustomersBody').html(`<tr><td colspan="7" class="text-center text-danger py-4">Lỗi: ${res.message}</td></tr>`);
-     }, null, 'NONE');
+         }
- }
+     }, null, 'NONE');
- 
+ }
- function renderMyCustomersTable(data) {
+ 
-     const html = data.slice().reverse().map(d
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
