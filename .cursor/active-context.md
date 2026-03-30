> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `netlify-app\app.js` (Domain: **Generic Logic**)

### 📐 Generic Logic Conventions & Fixes
- **[problem-fix] Patched security issue CCCD — prevents XSS injection attacks**: -         let dDate = row['Ngày mở TK'] || row['Thời điểm nhập'] || '';
+         const loaiHinh = row['Loại hình dịch vụ'] || 'Cá nhân';
-         if (dDate) {
+         const cccdVal = (row['Số CCCD'] || '').toString().replace(/^'/, '');
-             const rawD = new Date(dDate);
+         const dkkdVal = (row['Số DKKD'] || '').toString().replace(/^'/, '');
-             if (!isNaN(rawD)) {
+         
-                 const formatted = String(rawD.getDate()).padStart(2, '0') + '/' + String(rawD.getMonth() + 1).padStart(2, '0') + '/' + rawD.getFullYear();
+         $('#edit_cccd').val(cccdVal);
-                 if ($('#edit_ngay_mo')[0]._flatpickr) {
+         $('#edit_dkkd').val(dkkdVal);
-                     $('#edit_ngay_mo')[0]._flatpickr.setDate(rawD);
+         
-                 } else {
+         if (loaiHinh === 'Hộ kinh doanh') {
-                     $('#edit_ngay_mo').val(formatted);
+             $('#edit_dkkd_group').show();
-                 }
+         } else {
-             } else {
+             $('#edit_dkkd_group').hide();
-                 $('#edit_ngay_mo').val(dDate);
+         }
-             }
+ 
-         }
+         let dDate = row['Ngày mở TK'] || row['Thời điểm nhập'] || '';
-         
+         if (dDate) {
-         let stk = (row['Số TK'] || row['Số tài khoản'] || '').toString().replace(/^'/, '');
+             const rawD = new Date(dDate);
-         if (stk.length > 7 && stk.startsWith('3800200')) stk = stk.substring(7);
+             if (!isNaN(rawD)) {
-         $('#edit_so_tk').val(stk);
+                 const formatted = String(rawD.getDate()).padStart(2, '0') + '/' + String(rawD.getMonth() + 1).padStart(2, '0') + '/' + rawD.getFullYear();
- 
+                 if ($('#edit_ngay_mo')[0]._flatpickr) {
-         const loaiHinh = row['Loại hình dịch vụ'] || 'Cá nhân';
+                     $('#edit_ngay_mo')[0]._flatpickr.setDate(rawD);
-         const cccdVal = (row['Số CCCD'] || '').toString().replace(/^'/, '');
+            
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[problem-fix] Patched security issue Last — prevents XSS injection attacks**: -         $('#staffDash-rank').text('Chưa có dữ liệu');
+         $('#staffDash-rank').html('<small class="text-muted">Chưa có dữ liệu</small>');
-     if (rankIndex >= 0 && me) {
+     if (rankIndex >= 0 && me && (me.total > 0 || staffs.length > 0)) {
-         $('#staffDash-rank').text(`#${rank} / ${staffs.length}`);
+         let rankHtml = `#${rank} <small class="text-muted" style="font-size:0.6em">/ ${staffs.length}</small>`;
-         // Find person immediately above
+         // Thêm icon vinh danh cho Top 3
-         if (rank > 1) {
+         if (rank === 1) {
-             const aboveMe = staffs[rankIndex - 1];
+             rankHtml = `<i class='bx bxs-trophy text-warning'></i> ${rankHtml}`;
-             const diff = (aboveMe.total || 0) - (me.total || 0);
+         } else if (rank === 2) {
-             $('#staffDash-aboveRankInfo').html(`<i class='bx bx-trending-up'></i> Người xếp trên: <b>${(aboveMe.total || 0)}</b> hồ sơ (cần thêm ${diff})`);
+             rankHtml = `<i class='bx bxs-medal text-secondary'></i> ${rankHtml}`;
-         } else {
+         } else if (rank === 3) {
-             $('#staffDash-aboveRankInfo').html(`<i class='bx bxs-check-circle text-success'></i> Đang dẫn đầu hệ thống!`);
+             rankHtml = `<i class='bx bxs-medal' style="color: #cd7f32;"></i> ${rankHtml}`;
-     } else {
+         
-         $('#staffDash-rank').text('Chưa xếp hạng');
+         $('#staffDash-rank').html(rankHtml);
-         $('#staffDash-aboveRankInfo').text('Cần tối thiểu 1 hồ sơ để xếp hạng.');
+         
-     }
+         // Thông tin người xếp trên
- 
+         if (rank > 1) {
-     if (staffs.length > 0) {
+             const aboveMe = staffs[rankIndex - 1];
-         let top1 = staffs[0];
+             const diff = (aboveMe.total || 0) - (me.total || 0);
-         $('#staffDash-top1Name').text(top1.name || top1.email);
+             $('#staffDash-aboveRankInfo').html(`
-         $('#staffDash-top1Count').text(`${top1.total || 0} hồ sơ`);
+    
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Patched security issue DataTable — prevents XSS injection attacks — confirmed 3x**: -         if(dtAllStaffs) try { dtAllStafffunction openEditCustomerModal(id) {
+         if(dtAllStaffs) try { dtAllStaffs.destroy(); } catch(e){}
-     try {
+         dtAllStaffs = $('#tblAllStaffs').DataTable({
-         if (!id) return;
+             responsive: true,
-         let row = null;
+             dom: "<'row mb-2'<'col-sm-12 col-md-4 d-flex align-items-center justify-content-start'l><'col-sm-12 col-md-4 d-flex align-items-center justify-content-center'B><'col-sm-12 col-md-4 d-flex align-items-center justify-content-end'f>>" +
-         const sourceData = (AppState.user && AppState.user.role === 'Admin') ? (window._adminAllData || []) : ((AppCache.get('myCustomers') || {}).data || []);
+                  "<'row'<'col-sm-12'tr>>" +
-         
+                  "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
-         const rowIdStr = String(id).trim().replace(/^'/, '');
+             buttons: [{ extend: 'excelHtml5', text: '<i class="bx bxs-file-export"></i> Xuất Excel', className: 'btn btn-sm btn-success shadow-sm' }],
-         for (let i = 0; i < sourceData.length; i++) {
+             language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json" }
-             const currentId = String(sourceData[i]['ID'] || sourceData[i]['Mã GD'] || '').trim().replace(/^'/, '');
+         });
-             if (currentId === rowIdStr) {
+         $('#modalAllStaff').modal('show');
-                 row = sourceData[i];
+     } catch(e) { console.error(e); }
-                 break;
+ }
-             }
+ 
-         }
+ // --- CUSTOMER & IMAGE MODAL ---
- 
+ function openEditCustomerModal(id) {
-         if (!row) {
+     try {
-             console.warn("No row found with ID:", id);
+         if (!id) return;
-             showAlert('Lỗi', 'Không tìm thấy thông tin hồ sơ khách hàng. Vui lòng thử lại.', 'error');
+         let row = null;
-             return;
+         const sourceData = (AppState.user && AppState.user.role === 'Admin') ? 
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Patched security issue Date — prevents XSS injection attacks — confirmed 3x**: -             return;
+             showAlert('Lỗi', 'Không tìm thấy thông tin hồ sơ khách hàng. Vui lòng thử lại.', 'error');
-         }
+             return;
- 
+         }
-         $('#edit_id').val(id);
+ 
-         $('#edit_ten_kh').val(row['Tên khách hàng'] || '');
+         // Khởi tạo datepicker cho modal chỉnh sửa nếu chưa có
-         $('#edit_sdt').val((row['Số điện thoại'] || '').toString().replace(/^'/, ''));
+         if (typeof flatpickr !== 'undefined') {
-         
+             const fpEl = document.querySelector('.js-datepicker-edit');
-         let dDate = row['Ngày mở TK'] || row['Thời điểm nhập'] || '';
+             if (fpEl && !fpEl._flatpickr) {
-         if (dDate) {
+                 flatpickr(fpEl, {
-             const rawD = new Date(dDate);
+                     dateFormat: "d/m/Y",
-             if (!isNaN(rawD)) {
+                     altInput: true,
-                 dDate = String(rawD.getDate()).padStart(2, '0') + '/' + String(rawD.getMonth() + 1).padStart(2, '0') + '/' + rawD.getFullYear();
+                     altFormat: "d/m/Y",
-             }
+                     allowInput: true
-         }
+                 });
-         $('#edit_ngay_mo').val(dDate);
+             }
-         
+         }
-         let stk = (row['Số TK'] || row['Số tài khoản'] || '').toString().replace(/^'/, '');
+ 
-         if (stk.length > 7 && stk.startsWith('3800200')) stk = stk.substring(7);
+         $('#edit_id').val(id);
-         $('#edit_so_tk').val(stk);
+         $('#edit_ten_kh').val(row['Tên khách hàng'] || '');
- 
+         $('#edit_sdt').val((row['Số điện thoại'] || '').toString().replace(/^'/, ''));
-         if (AppState.user && AppState.user.role === 'Admin') {
+         
-             $('#btnSaveEdit').hide();
+         let dDate = row['Ngày mở TK'] || row['Thời điểm nhập'] || '';
-             $('#frmEditCustomer input').prop('readonly', true);
+         if (dDate) {
-         } else {
+             const rawD = new Date(dDate);
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[what-changed] 🟢 Edited netlify-app/app.js (6 changes, 1min)**: Active editing session on netlify-app/app.js.
6 content changes over 1 minutes.
- **[convention] what-changed in app.js — confirmed 4x**: -     VERSION: "2.1.0-AUDITED",
+     VERSION: "2.1.1-PATCHED",

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Patched security issue Initialize — prevents XSS injection attacks — confirmed 3x**: - 
+     toggleFormFields(); // Initialize field visibility on load
-     // Map camera inputs -> corresponding file inputs
+ 
-     const camMap = {
+     // Map camera inputs -> corresponding file inputs
-         'cam_truoc': 'img_truoc',
+     const camMap = {
-         'cam_sau':   'img_sau',
+         'cam_truoc': 'img_truoc',
-         'cam_dkkd':  'img_dkkd',
+         'cam_sau':   'img_sau',
-         'cam_qr':    'img_qr',
+         'cam_dkkd':  'img_dkkd',
-         'cam_thuchien': 'img_thuchien'
+         'cam_qr':    'img_qr',
-     };
+         'cam_thuchien': 'img_thuchien'
- 
+     };
-     const triggerProcessing = async (file, targetId) => {
+ 
-         if (!file) return;
+     const triggerProcessing = async (file, targetId) => {
-         showLoading('Phan tich anh...');
+         if (!file) return;
-         try {
+         showLoading('Phan tich anh...');
-             const processed = await processImageWithAI(file);
+         try {
-             startCroppingFlow(processed, targetId);
+             const processed = await processImageWithAI(file);
-         } catch(e) {
+             startCroppingFlow(processed, targetId);
-             startCroppingFlow(file, targetId);
+         } catch(e) {
-         } finally {
+             startCroppingFlow(file, targetId);
-             hideLoading();
+         } finally {
-         }
+             hideLoading();
-     };
+         }
- 
+     };
-     // File (gallery) inputs
+ 
-     const uploadIds = ['img_truoc', 'img_sau', 'img_dkkd', 'img_qr', 'img_thuchien'];
+     // File (gallery) inputs
-     uploadIds.forEach(id => {
+     const uploadIds = ['img_truoc', 'img_sau', 'img_dkkd', 'img_qr', 'img_thuchien'];
-         $(`#${id}`).off('change').on('change', async function() {
+     uploadIds.forEach(id => {
-             if (this.files && this.files[0]) {
+         $(`#${id}`).off('change').on('change', async function() {
-                 await triggerProcessing(this.files[0], id);
+             
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[decision] decision in app.js**: -             $('#staffDash-aboveRankInfo').html(`<i class='bx bx-trending-up'></i> Người xếp trên: <b>${aboveMe.total || 0}</b> hồ sơ (cần thêm ${diff})`);
+             $('#staffDash-aboveRankInfo').html(`<i class='bx bx-trending-up'></i> Người xếp trên: <b>${(aboveMe.total || 0)}</b> hồ sơ (cần thêm ${diff})`);

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[discovery] discovery in app.js**: -                 <td class="fw-bold">${d['Tên khách hàng']}</td>
+                 <td class="fw-bold">${utils_escapeHTML(d['Tên khách hàng'])}</td>
-                 <td><small>${d['Số CCCD']}</small></td>
+                 <td><small>${utils_escapeHTML(d['Số CCCD'])}</small></td>
-                 <td><small>${d['Số GP ĐKKD'] || ''}</small></td>
+                 <td><small>${utils_escapeHTML(d['Số GP ĐKKD'] || '')}</small></td>
-                 <td><span class="badge bg-light text-dark border">${d['Loại hình dịch vụ']}</span></td>
+                 <td><span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'])}</span></td>
-                 <td><small>${d['Số điện thoại']}</small></td>
+                 <td><small>${utils_escapeHTML(d['Số điện thoại'])}</small></td>
-                 <td>${AppState.user ? AppState.user.name : (d['Cán bộ thực hiện'] || '')}</td>
+                 <td>${AppState.user ? utils_escapeHTML(AppState.user.name) : utils_escapeHTML(d['Cán bộ thực hiện'] || '')}</td>
-                 <td><small>${d['Ngày mở TK'] || d['Ngày mở'] || ''}</small></td>
+                 <td><small>${utils_escapeHTML(d['Ngày mở TK'] || d['Ngày mở'] || '')}</small></td>
-                 <td><small>${d['Số TK'] || d['Số tài khoản'] || ''}</small></td>
+                 <td><small>${utils_escapeHTML(d['Số TK'] || d['Số tài khoản'] || '')}</small></td>

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Fixed null crash in Excel — wraps unsafe operation in error boundary — confirmed 5x**: -         dom: "<'row mb-2'<'col-sm-12 col-md-3'l><'col-sm-12 col-md-5'f><'col-sm-12 col-md-4 text-end'B>>" +
+         lengthMenu: [10, 25, 50, 100],
-              "<'row'<'col-sm-12'tr>>" +
+         pageLength: 25,
-              "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
+         dom: "<'row mb-2'<'col-sm-12 col-md-3'l><'col-sm-12 col-md-5'f><'col-sm-12 col-md-4 text-end'B>>" +
-         buttons: [{
+              "<'row'<'col-sm-12'tr>>" +
-             extend: 'excelHtml5',
+              "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
-             text: '<i class="bx bxs-file-export"></i> Xuất Excel',
+         buttons: [{
-             className: 'btn btn-sm btn-success shadow-sm',
+             extend: 'excelHtml5',
-             exportOptions: {
+             text: '<i class="bx bxs-file-export"></i> Xuất Excel',
-                 // Xuất tất cả cột bao gồm cột ẩn (email, STK, CCCD, ...)
+             className: 'btn btn-sm btn-success shadow-sm',
-                 columns: ':all',
+             exportOptions: {
-                 format: {
+                 // Xuất tất cả cột bao gồm cột ẩn (email, STK, CCCD, ...)
-                     header: function(data, col) {
+                 columns: ':all',
-                         // Ẩn cột email khỏi header xuất
+                 format: {
-                         const hdrs = ['Thời gian', 'Họ Tên', 'Loại Hình', 'Số TK', 'Email CB', 'Cán Bộ', 'Thao tác'];
+                     header: function(data, col) {
-                         return hdrs[col] || data;
+                         // Ẩn cột email khỏi header xuất
-                     }
+                         const hdrs = ['Thời gian', 'Họ Tên', 'Loại Hình', 'Số TK', 'Email CB', 'Cán Bộ', 'Thao tác'];
-                 }
+                         return hdrs[col] || data;
-             },
+                     }
-             title: 'Bao_Cao_KH_YenTho_' + new Date().toISOString().slice(0,10)
+                 }
-      
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Fixed null crash in Find — wraps unsafe operation in error boundary — confirmed 3x**: -     if(!adminData || !adminData.allStaffs) return;
+     if(!adminData || !adminData.allStaffs) {
-     
+         $('#staffDash-rank').text('Chưa có dữ liệu');
-     let staffs = adminData.allStaffs;
+         return;
-     let rank = staffs.findIndex(s => s.email === email) + 1;
+     }
-     let me = staffs.find(s => s.email === email);
+     
-     
+     let staffs = adminData.allStaffs;
-     if (rank > 0) {
+     let rankIndex = staffs.findIndex(s => s.email === email);
-         $('#staffDash-rank').text(`#${rank} / ${staffs.length}`);
+     let me = staffs.find(s => s.email === email);
-         
+     
-         // Find person immediately above
+     if (rankIndex >= 0 && me) {
-         if (rank > 1) {
+         let rank = rankIndex + 1;
-             const aboveMe = staffs[rank - 2];
+         $('#staffDash-rank').text(`#${rank} / ${staffs.length}`);
-             const diff = (aboveMe.total || 0) - (me.total || 0);
+         
-             $('#staffDash-aboveRankInfo').html(`<i class='bx bx-trending-up'></i> Người xếp trên: <b>${aboveMe.total}</b> hồ sơ (cần thêm ${diff})`);
+         // Find person immediately above
-         } else {
+         if (rank > 1) {
-             $('#staffDash-aboveRankInfo').html(`<i class='bx bxs-check-circle text-success'></i> Đang dẫn đầu hệ thống!`);
+             const aboveMe = staffs[rankIndex - 1];
-         }
+             const diff = (aboveMe.total || 0) - (me.total || 0);
-     } else {
+             $('#staffDash-aboveRankInfo').html(`<i class='bx bx-trending-up'></i> Người xếp trên: <b>${aboveMe.total || 0}</b> hồ sơ (cần thêm ${diff})`);
-         $('#staffDash-rank').text('Chưa xếp hạng');
+         } else {
-         $('#staffDash-aboveRankInfo').text('Cần tối thiểu 1 hồ sơ để xếp hạng.');
+             $('#staffDash-aboveRankInfo').html(`<i class='bx bxs-check-circle text-success'></i> Đang dẫn đầu hệ thống!`);
-     }
+         }
- 
+     } else {
-     if (staffs.length > 0) {
+         $('#staffDash-r
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Patched security issue VERSION — offloads heavy computation off the main thread — confirmed 3x**: -     VERSION: "2.0.0-HIFI",
+     VERSION: "2.1.0-AUDITED",
-     apiBase: "" // Sẽ được cập nhật từ URL triển khai
+     apiBase: "",
- };
+     lastActive: Date.now()
- 
+ };
- /**
+ 
-  * CACHE SYSTEM
+ /**
-  */
+  * AUTO-LOGOUT SECURITY
- const AppCache = {
+  */
-     data: {},
+ const INACTIVITY_LIMIT = 60 * 60 * 1000; // 60 minutes
-     timestamp: {},
+ function checkInactivity() {
-     TTL: 180000, 
+     if (AppState.user && (Date.now() - AppState.lastActive > INACTIVITY_LIMIT)) {
-     isFresh(key) {
+         logout();
-         if (!this.timestamp[key]) return false;
+         showAlert('Hết phiên làm việc', 'Phiên làm việc đã kết thúc do bạn không hoạt động trong 60 phút.', 'warning');
-         return (Date.now() - this.timestamp[key]) < this.TTL;
+     }
-     },
+ }
-     set(key, val) {
+ $(document).on('click keydown scroll mousedown touchstart', () => AppState.lastActive = Date.now());
-         this.data[key] = val;
+ setInterval(checkInactivity, 5 * 60 * 1000);
-         this.timestamp[key] = Date.now();
+ 
-     },
+ 
-     get(key) {
+ /**
-         return this.isFresh(key) ? this.data[key] : null;
+  * CACHE SYSTEM
-     },
+  */
-     clear(key) {
+ const AppCache = {
-         delete this.data[key];
+     data: {},
-         delete this.timestamp[key];
+     timestamp: {},
-     },
+     TTL: 180000, 
-     clearAll() {
+     isFresh(key) {
-         this.data = {};
+         if (!this.timestamp[key]) return false;
-         this.timestamp = {};
+         return (Date.now() - this.timestamp[key]) < this.TTL;
-     }
+     },
- };
+     set(key, val) {
- 
+         this.data[key] = val;
- /**
+         this.timestamp[key] = Date.now();
-  * CORE API WRAPPER
+     },
-  * Hardened with Timeout (30s) and Auto-Retry (Max 2)
+     get(key) {
-  */
+         return this.isFresh(key) ? this.data[key] : null;
- async function runAPI(action, data = {}, successHandler, errorHandler, loadingMsg = 'Đang xử lý...', retryCount = 0) {
+     },
-     i
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Fixed null crash in Last — wraps unsafe operation in error boundary — confirmed 3x**: -     // Sap xep giam dan theo tong ho so, giong voi thu tu xep hang that su
+     let staffs = adminData.allStaffs;
-     const staffs = [...adminData.allStaffs].sort((a, b) => (b.total || 0) - (a.total || 0));
+     let rank = staffs.findIndex(s => s.email === email) + 1;
-     const rank = staffs.findIndex(s => s.email === email) + 1;
+     let me = staffs.find(s => s.email === email);
-     const me = staffs.find(s => s.email === email);
+     
-     
+     if (rank > 0) {
-     if (rank > 0) {
+         $('#staffDash-rank').text(`#${rank} / ${staffs.length}`);
-         $('#staffDash-rank').text(`#${rank} / ${staffs.length}`);
+     } else {
-     } else {
+         $('#staffDash-rank').text('Chưa xếp hạng');
-         $('#staffDash-rank').text('Chưa xếp hạng');
+     }
-     }
+ 
- 
+     if (staffs.length > 0) {
-     // Hien thi Top 1
+         let top1 = staffs[0];
-     if (staffs.length > 0) {
+         $('#staffDash-top1Name').text(top1.name || top1.email);
-         let top1 = staffs[0];
+         $('#staffDash-top1Count').text(`${top1.total} hồ sơ`);
-         $('#staffDash-top1Name').text(top1.name || top1.email);
+     }
-         $('#staffDash-top1Count').text(`${top1.total} hồ sơ`);
+ }
-     }
+ 
- 
+ let staffChartInstance = null;
-     // Hien thi nguoi xep hang ngay tren minh (khong lo ten, chi so luong)
+ function renderStaffLineChart(timeline) {
-     const aboveCard = $('#staffDash-above');
+     const ctx = document.getElementById('chartStaffMonthly');
-     if (rank > 1) {
+     if (!ctx) return;
-         const above = staffs[rank - 2]; // rank-1 la chi so, -1 nua la vi tri tren
+     
-         aboveCard.closest('.dash-card-above').removeClass('d-none');
+     // Last 30 days calculation
-         aboveCard.html(
+     let labels = [];
-             `<div class="text-muted mb-1" style="font-size:11px;">Ngay tr\u00ean b\u1ea1n (h\u1ea1ng #${rank - 1}):</div>` +
+     let counts = [];
-             `<span class="fw-bold text-warning fs-5">
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
