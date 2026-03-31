> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `api_admin.gs` (Domain: **Generic Logic**)

### 🔴 Generic Logic Gotchas
- **⚠️ GOTCHA: Patched security issue VERSION — prevents XSS injection attacks**: -     VERSION: "2.1.1-PATCHED",
+     VERSION: "2.1.2-STABLE",
- 
+ // --- CẤU HÌNH EVENT DELEGATION: XỬ LÝ CLICK XEM CHI TIẾT ---
- /**
+ $(document).on('click', '.clickable-row', function(e) {
-  * CACHE SYSTEM
+     // Nếu click vào nút Chi tiết hoặc thành phần bên trong nút, dừng lại để tránh trigger 2 lần
-  */
+     if ($(e.target).is('button') || $(e.target).closest('button').length) return;
- const AppCache = {
+     
-     data: {},
+     const id = $(this).attr('data-id') || $(this).data('id');
-     timestamp: {},
+     if (id) openEditCustomerModal(id);
-     TTL: 300000, // 5 phút (tăng từ 3 phút để giảm request lên Vercel)
+ });
-     isFresh(key) {
+ 
-         if (!this.timestamp[key]) return false;
+ // Xử lý riêng khi click trực tiếp vào nút Chi tiết
-         return (Date.now() - this.timestamp[key]) < this.TTL;
+ $(document).on('click', '.btn-detail', function(e) {
-     },
+     e.stopPropagation(); // Ngăn chặn sự kiện lan lên thẻ tr
-     set(key, val) {
+     const id = $(this).closest('tr').attr('data-id') || $(this).closest('tr').data('id');
-         this.data[key] = val;
+     if (id) openEditCustomerModal(id);
-         this.timestamp[key] = Date.now();
+ });
-     },
+ 
-     get(key) {
+ 
-         return this.isFresh(key) ? this.data[key] : null;
+ 
-     },
+ /**
-     clear(key) {
+  * CACHE SYSTEM
-         delete this.data[key];
+  */
-         delete this.timestamp[key];
+ const AppCache = {
-     },
+     data: {},
-     clearAll() {
+     timestamp: {},
-         this.data = {};
+     TTL: 300000, // 5 phút (tăng từ 3 phút để giảm request lên Vercel)
-         this.timestamp = {};
+     isFresh(key) {
-     }
+         if (!this.timestamp[key]) return false;
- };
+         return (Date.now() - this.timestamp[key]) < this.TTL;
- 
+     },
- /**
+     set(key, val) {
-  * CORE API WRAPPER
+         this.data[key] = val;
-  * Hardened with Timeout (30s) and Auto-Retry (Max 2)
+         this.timestamp[key] = Date.now();
-  */
+    
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]

### 📐 Generic Logic Conventions & Fixes
- **[convention] Fixed null crash in JSON — externalizes configuration for environment flexibi... — confirmed 5x**: -       pending: pendingAccounts,
+       activated: activatedCount,
-       approved: approvedAccounts,
+       inactive: inactiveCount,
-       activated: activatedCount,
+       caNhan: caNhanCount,
-       inactive: inactiveCount,
+       hkd: hkdCount,
-       caNhan: caNhanAccounts,
+       loaiHinh: loaiHinhCount,
-       hkd: hkdAccounts,
+       allStaffs: allStaffStats,
-       loaiHinh: loaiHinhCount,
+       topStaffs: topStaffs,
-       allStaffs: allStaffStats,
+       timelineDate: timelineByDate,
-       topStaffs: topStaffs,
+       typeMonth: typeByMonth,
-       timelineDate: timelineByDate,
+       allData: data 
-       typeMonth: typeByMonth,
+     };
-       allData: data 
+ 
-     };
+     return {
- 
+       status: "success",
-     return {
+       statsStr: JSON.stringify(statsPayload) // Serialize thủ công để tránh lỗi mất object của GAS
-       status: "success",
+     };
-       statsStr: JSON.stringify(statsPayload) // Serialize thủ công để tránh lỗi mất object của GAS
+ 
-     };
+   } catch (e) {
- 
+     return { status: "error", message: "Lỗi lấy dữ liệu Admin: " + e.message };
-   } catch (e) {
+   }
-     return { status: "error", message: "Lỗi lấy dữ liệu Admin: " + e.message };
+ }
-   }
+ 
- }
+ /**
- 
+  * Xóa hồ sơ hoặc đổi trạng thái (chỉ Admin)
- /**
+  * Cần truyền đối tượng {id, newStatus}
-  * Xóa hồ sơ hoặc đổi trạng thái (chỉ Admin)
+  */
-  * Cần truyền đối tượng {id, newStatus}
+ function api_adminUpdateStatus(id, newStatus) {
-  */
+   const lock = LockService.getScriptLock();
- function api_adminUpdateStatus(id, newStatus) {
+   try {
-   const lock = LockService.getScriptLock();
+     lock.waitLock(10000);
-   try {
+     const sheet = getSheetByName(CONFIG.SHEET_DATA);
-     lock.waitLock(10000);
+     const data = sheet.getDataRange().getValues();
-     const sheet = getSheetByName(CONFIG.SHEET_DATA);
+     const header = data[0];
-     const data = sheet.getDataRange().getValues();
+     
-     const header = 
… [diff truncated]
- **[convention] Fixed null crash in JSON — externalizes configuration for environment flexibi... — confirmed 3x**: -       caNhan: caNhanAccounts,
+       activated: activatedCount,
-       hkd: hkdAccounts,
+       inactive: inactiveCount,
-       loaiHinh: loaiHinhCount,
+       caNhan: caNhanAccounts,
-       allStaffs: allStaffStats,
+       hkd: hkdAccounts,
-       topStaffs: topStaffs,
+       loaiHinh: loaiHinhCount,
-       timelineDate: timelineByDate,
+       allStaffs: allStaffStats,
-       typeMonth: typeByMonth,
+       topStaffs: topStaffs,
-       allData: data 
+       timelineDate: timelineByDate,
-     };
+       typeMonth: typeByMonth,
- 
+       allData: data 
-     return {
+     };
-       status: "success",
+ 
-       statsStr: JSON.stringify(statsPayload) // Serialize thủ công để tránh lỗi mất object của GAS
+     return {
-     };
+       status: "success",
- 
+       statsStr: JSON.stringify(statsPayload) // Serialize thủ công để tránh lỗi mất object của GAS
-   } catch (e) {
+     };
-     return { status: "error", message: "Lỗi lấy dữ liệu Admin: " + e.message };
+ 
-   }
+   } catch (e) {
- }
+     return { status: "error", message: "Lỗi lấy dữ liệu Admin: " + e.message };
- 
+   }
- /**
+ }
-  * Xóa hồ sơ hoặc đổi trạng thái (chỉ Admin)
+ 
-  * Cần truyền đối tượng {id, newStatus}
+ /**
-  */
+  * Xóa hồ sơ hoặc đổi trạng thái (chỉ Admin)
- function api_adminUpdateStatus(id, newStatus) {
+  * Cần truyền đối tượng {id, newStatus}
-   const lock = LockService.getScriptLock();
+  */
-   try {
+ function api_adminUpdateStatus(id, newStatus) {
-     lock.waitLock(10000);
+   const lock = LockService.getScriptLock();
-     const sheet = getSheetByName(CONFIG.SHEET_DATA);
+   try {
-     const data = sheet.getDataRange().getValues();
+     lock.waitLock(10000);
-     const header = data[0];
+     const sheet = getSheetByName(CONFIG.SHEET_DATA);
-     
+     const data = sheet.getDataRange().getValues();
-     // Ưu tiên cột "ID", sau đó là "Mã GD"
+     const header = data[0];
-     let idIdx = header.indexOf("ID");
+     
-     if (idIdx === -1) idIdx =
… [diff truncated]
- **[what-changed] 🟢 Edited api_admin.gs (10 changes, 6min)**: Active editing session on api_admin.gs.
10 content changes over 6 minutes.
- **[problem-fix] Patched security issue Chart — prevents XSS injection attacks**: -     $('#db-total').text(s.total || 0);
+     $('#admin-total').text(s.total || 0);
-     $('#db-activated').text(s.activated || 0);
+     $('#admin-canhan').text(s.caNhan || 0);
-     $('#db-inactive').text(s.inactive || 0);
+     $('#admin-hkd').text(s.hkd || 0);
-     $('#db-ca-nhan-sub').text(s.caNhan || 0);
+     $('#admin-activated').text(s.activated || 0);
-     $('#db-hkd-sub').text(s.hkd || 0);
+     $('#admin-inactive').text(s.inactive || 0);
-     $('#db-ca-nhan').text(s.caNhan || 0);
+ }
-     $('#db-hkd-count').text(s.hkd || 0);
+ 
- }
+ function renderAdminTopStaff(allStaffs) {
- 
+     if (!allStaffs || allStaffs.length === 0) {
- function renderAdminTopStaff(allStaffs) {
+         $('#db-topstaff').html('<div class="text-center text-muted small p-2">Không có dữ liệu cán bộ.</div>');
-     if (!allStaffs || allStaffs.length === 0) {
+         return;
-         $('#db-topstaff').html('<div class="text-center text-muted small p-2">Không có dữ liệu cán bộ.</div>');
+     }
-         return;
+     const sorted = [...allStaffs].sort((a,b) => (b.total || 0) - (a.total || 0)).slice(0, 5);
-     }
+     let html = '';
-     const sorted = [...allStaffs].sort((a,b) => (b.total || 0) - (a.total || 0)).slice(0, 5);
+     sorted.forEach((st, idx) => {
-     let html = '';
+         let rankColor = 'text-secondary';
-     sorted.forEach((st, idx) => {
+         let trophy = `<span class="fw-bold ms-2">${idx + 1}.</span>`;
-         let rankColor = 'text-secondary';
+         if (idx === 0) { rankColor = 'text-warning'; trophy = `<i class='bx bxs-trophy ms-1 fs-5 text-warning'></i>`; }
-         let trophy = `<span class="fw-bold ms-2">${idx + 1}.</span>`;
+         else if (idx === 1) { rankColor = 'text-secondary'; trophy = `<i class='bx bxs-medal ms-1 fs-5 text-secondary'></i>`; }
-         if (idx === 0) { rankColor = 'text-warning'; trophy = `<i class='bx bxs-trophy ms-1 fs-5 text-warning'></i>`; }
+         else if (idx === 2) { rankColor = 'text-danger'; tr
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[convention] Patched security issue User — prevents XSS injection attacks — confirmed 3x**: -         if (status === 'Đã kích hoạt') {
+         $('#edit_is_activated').prop('checked', status === 'Đã kích hoạt');
-             $('#edit_is_activated').prop('checked', true);
+ 
-         } else {
+         // Bỏ hoàn toàn việc khóa sửa. Mọi User (Staff/Admin) đều có thể sửa hồ sơ.
-             $('#edit_is_activated').prop('checked', false);
+         $('#btnSaveEdit').show();
-         }
+         $('#frmEditCustomer input').prop('readonly', false);
- 
+         $('.modal-title').html(`<i class='bx bxs-edit-alt text-white'></i> Chi tiết & Chỉnh sửa hồ sơ`);
-         const isVerified = (status === 'Đã xác minh' || status === 'Đã kích hoạt');
+         
- 
+         if (status === 'Đã kích hoạt') {
-         // Theo yêu cầu mới, User tự quản lý sửa hồ sơ nên không khóa nút Lưu kể cả khi đã xác minh
+             $('.modal-title').append(` <span class="badge bg-success small"><i class="bx bxs-check-circle"></i> Đã kích hoạt</span>`);
-         if (AppState.user && AppState.user.role === 'Admin') {
+         } else {
-             $('#btnSaveEdit').hide();
+             $('.modal-title').append(` <span class="badge bg-warning text-dark small"><i class="bx bx-time"></i> Chờ kích hoạt</span>`);
-             $('#frmEditCustomer input').prop('readonly', true);
+         }
-             $('#edit_status_alert').removeClass('d-none');
+ 
-             $('.modal-title').html(`<i class='bx bx-search-alt text-white'></i> Chi tiết Hồ sơ <span class="badge bg-info small ms-2">Chế độ xem</span>`);
+         const infoHtml = `<div class="col-12 mb-2">
-         } else {
+                             <div class="p-2 bg-white rounded border d-flex gap-2 shadow-sm align-items-center">
-             $('#btnSaveEdit').show();
+                                 <span class="badge bg-primary">${utils_escapeHTML(loaiHinh)}</span>
-             $('#frmEditCustomer input').prop('readonly', false);
+                                 <span>CCCD: <b>${utils_escapeHTML(cccdVal)}</b></span
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[what-changed] Updated 1 database schema**: -     // Mọi hồ sơ mới mặc định là "Chưa kích hoạt" theo yêu cầu mới
+     // Mọi hồ sơ mới mặc định là "Chưa kích hoạt", trừ khi người dùng tích chọn "Kích hoạt hồ sơ ngay"
-     const trangThai = "Chưa kích hoạt";
+     const trangThai = formData.is_activated ? "Đã kích hoạt" : "Chưa kích hoạt";
-     // Giữ nguyên trạng thái hiện tại hoặc cập nhật theo tính toán mới (không dùng Đã xác minh tự động)
+     // Cập nhật trạng thái kích hoạt từ ô tích chọn của User
-     const row = data[rowIndex];
+     if (colTrangThai !== -1) {
-     const haveId    = !!(row[colLh] === "Cá nhân" ? row[colCccd] : row[colDkkd]);
+       data[rowIndex][colTrangThai] = updateData.is_activated ? "Đã kích hoạt" : "Chưa kích hoạt";
-     const haveSdt   = !!(row[colSdt]);
+     }
-     const haveTk    = !!(row[colSoTk] && row[colSoTk].toString().length >= 9);
+     
-     const haveImg   = !!(row[colImg]);
+     // Giữ nguyên trạng thái hiện tại hoặc cập nhật theo tính toán mới (không dùng Đã xác minh tự động)
-     const newStatus = (haveId && haveSdt && haveTk && haveImg) ? "Chờ duyệt" : "Chưa hoàn thành";
+     const row = data[rowIndex];
-     data[rowIndex][colTrangThai] = newStatus;
+     const haveId    = !!(row[colLh] === "Cá nhân" ? row[colCccd] : row[colDkkd]);
- 
+     const haveSdt   = !!(row[colSdt]);
-     // Batch Update 1 row using setValues
+     const haveTk    = !!(row[colSoTk] && row[colSoTk].toString().length >= 9);
-     sheet.getRange(rowIndex + 1, 1, 1, data[rowIndex].length).setValues([data[rowIndex]]);
+     const haveImg   = !!(row[colImg]);
-     SpreadsheetApp.flush(); 
+     const newStatus = (haveId && haveSdt && haveTk && haveImg) ? "Chờ duyệt" : "Chưa hoàn thành";
- 
+     data[rowIndex][colTrangThai] = newStatus;
-     return { 
+ 
-       status: "success", 
+     // Batch Update 1 row using setValues
-       message: newStatus === "Chờ duyệt" ? "Cập nhật thành công! Hồ sơ đang ở trạng thái Chờ duyệt." : "Đã lưu điều chỉnh. Hồ sơ vẫn ở trạng thái Chưa ho
… [diff truncated]
- **[what-changed] 🟢 Edited app.js (12 changes, 125min)**: Active editing session on app.js.
12 content changes over 125 minutes.
- **[convention] Patched security issue Theo — prevents XSS injection attacks — confirmed 5x**: -         const trangThai = row['Trạng thái'] || 'Chưa hoàn thành';
+         // Theo yêu cầu mới, User tự quản lý sửa hồ sơ nên không khóa nút Lưu kể cả khi đã xác minh
-         const isVerified = (trangThai === 'Đã xác minh');
+         if (AppState.user && AppState.user.role === 'Admin') {
- 
+             $('#btnSaveEdit').hide();
-         // Theo yêu cầu mới, User tự quản lý sửa hồ sơ nên không khóa nút Lưu kể cả khi đã xác minh
+             $('#frmEditCustomer input').prop('readonly', true);
-         if (AppState.user && AppState.user.role === 'Admin') {
+             $('#edit_status_alert').removeClass('d-none');
-             $('#btnSaveEdit').hide();
+             $('.modal-title').html(`<i class='bx bx-search-alt text-white'></i> Chi tiết Hồ sơ <span class="badge bg-info small ms-2">Chế độ xem</span>`);
-             $('#frmEditCustomer input').prop('readonly', true);
+         } else {
-             $('#edit_status_alert').removeClass('d-none');
+             $('#btnSaveEdit').show();
-             $('.modal-title').html(`<i class='bx bx-search-alt text-white'></i> Chi tiết Hồ sơ <span class="badge bg-info small ms-2">Chế độ xem</span>`);
+             $('#frmEditCustomer input').prop('readonly', false);
-         } else {
+             $('#edit_status_alert').addClass('d-none');
-             $('#btnSaveEdit').show();
+             
-             $('#frmEditCustomer input').prop('readonly', false);
+             if (isVerified) {
-             $('#edit_status_alert').addClass('d-none');
+                 $('.modal-title').html(`<i class='bx bxs-check-shield text-success'></i> Chi tiết Hồ sơ <span class="badge bg-success small ms-2">Đã xác minh</span>`);
-             
+             } else {
-             if (isVerified) {
+                 $('.modal-title').html(`<i class='bx bxs-edit-alt text-white'></i> Chỉnh sửa Hồ sơ`);
-                 $('.modal-title').html(`<i class='bx bxs-check-shield text-success'></i> Chi tiết Hồ sơ <span class="badge bg-
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [GAS_API_URL, AppState, INACTIVITY_LIMIT, checkInactivity, on('click keydown scroll mousedown touchstart') callback]
- **[what-changed] what-changed in vercel.json**: -     { "source": "/(.*)", "destination": "/index.html" }
+     { "source": "/(app\\.js|style\\.css|logo\\.png)", "destination": "/netlify-app/$1" },
-   ]
+     { "source": "/(.*)", "destination": "/netlify-app/index.html" }
- }
+   ]
- 
+ }
+ 

📌 IDE AST Context: Modified symbols likely include [version, name, cleanUrls, rewrites]
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
- **[what-changed] what-changed in style.css**: File updated (external): style.css

Content summary (212 lines):
:root {
    --emerald: #10b981;
    --emerald-dark: #059669;
    --slate: #64748b;
    --amber: #f59e0b;
}

body {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    margin: 0;
    padding: 0;
}

.glass-card {
    background: rgba(255, 255, 255, 0.85);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 1rem;
- **[convention] Patched security issue CCCD — adds runtime type validation before use — confirmed 4x**: - function checkDuplicateAccount(cccd, dkkd, sdt, loaiHinh) {
+ function checkDuplicateAccount(cccd, dkkd, sdt, loaiHinh, excludeId) {
-     // Chỉ báo trùng nếu CÙNG loại hình dịch vụ (Cá nhân vs Cá nhân, HKD vs HKD)
+     
-     if (row["Loại hình dịch vụ"] === loaiHinh) {
+     // Nếu có excludeId, bỏ qua dòng hiện tại (đang chỉnh sửa)
-       if (cccd && cccd !== "" && row["Số CCCD"] == cccd) return { isDup: true, msg: "Trùng Số CCCD/CMND với giao dịch trước đó của cùng loại hình khách hàng." };
+     if (excludeId && row["ID"] && row["ID"].toString().replace(/^'/, '') === excludeId.toString().replace(/^'/, '')) {
-       if (dkkd && dkkd !== "" && row["Số DKKD"] == dkkd) return { isDup: true, msg: "Trùng Số Giấy phép ĐKKD với giao dịch trước đó của cùng loại hình khách hàng." };
+       continue;
-       if (sdt && sdt !== "" && row["Số điện thoại"] == sdt) return { isDup: true, msg: "Trùng Số điện thoại giao dịch trước đó của cùng loại hình khách hàng." };
+     }
-     }
+ 
-   }
+     // Chỉ báo trùng nếu CÙNG loại hình dịch vụ (Cá nhân vs Cá nhân, HKD vs HKD)
-   return { isDup: false };
+     if (row["Loại hình dịch vụ"] === loaiHinh) {
- }
+       if (cccd && cccd !== "" && row["Số CCCD"] == cccd) return { isDup: true, msg: "Trùng Số CCCD/CMND với giao dịch trước đó của cùng loại hình khách hàng." };
- 
+       if (dkkd && dkkd !== "" && row["Số DKKD"] == dkkd) return { isDup: true, msg: "Trùng Số Giấy phép ĐKKD với giao dịch trước đó của cùng loại hình khách hàng." };
- /**
+       if (sdt && sdt !== "" && row["Số điện thoại"] == sdt) return { isDup: true, msg: "Trùng Số điện thoại giao dịch trước đó của cùng loại hình khách hàng." };
-  * API Kiểm tra trùng lặp thời gian thực cho Frontend (CCCD, DKKD, SDT)
+     }
-  */
+   }
- function api_validateDuplicate(field, value, loaiHinh) {
+   return { isDup: false };
-   if (typeof field === 'object' && field !== null) {
+ }
-     value = field.value;
+ 
-     loaiHinh = field.loaiHinh;
+ /**
-     field = f
… [diff truncated]
- **[what-changed] what-changed in .gitignore**: - 
+ 
+ .vercel
+ 
- **[convention] what-changed in index.html — confirmed 6x**: -     <script src="app.js?v=2.2.0"></script>
+     <script src="app.js?v=2.1.1"></script>

📌 IDE AST Context: Modified symbols likely include [html]
