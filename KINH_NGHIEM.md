# KINH NGHIỆM THỰC CHIẾN & CÁC BÀI HỌC KỸ THUẬT SÂU ĐƯỢC ĐÚC KẾT
**(Lessons Learned & Deep Technical Expertise)**

Tài liệu này tổng hợp kho tàng tri thức kỹ thuật thô trong suốt vòng đời dự án Hệ thống Hộ Kinh Doanh, đặc biệt là các vấn đề liên quan đến giới hạn nền tảng Google Apps Script (GAS) và Web Mobile.

---

### 1. Cuộc chiến với Serialization trong `google.script.run` (The Silent Data Drop)

**Vấn đề:** 
Hàng loạt lỗi kì lạ nảy sinh ở Frontend (bảng DataTables trống không, Combobox bị thiếu dữ liệu) dù Backend không hề báo lỗi `Exception`. Khi kiểm tra `res.stats` từ Frontend, mảng `allData` bị biến mất hoàn toàn (`undefined`).

**Nguyên nhân gốc (Root Cause):** 
`google.script.run` sử dụng một bộ tuần tự hóa (serializer) nội bộ của Google cực kì nghiêm ngặt và chứa nhiều bug im lặng. 
- Nó không thể serialize **Đối tượng Date** của JavaScript.
- Nó sẽ **lặng lẽ xóa toàn bộ Object/Array** nếu bên trong có chứa phần tử `undefined` hoặc hàm (function). 
- Nó cấm các cấu trúc vòng lặp (Circular Dependencies).

**Cách giải quyết triệt để (The Golden Rule):**
TUYỆT ĐỐI KHÔNG ỷ lại vào bộ tự động ép kiểu của Google Apps Script đối với các cấu trúc phức tạp. 
Phương pháp "viên đạn bạc" đã áp dụng: 
Chủ động sử dụng `JSON.stringify()` tại Backend ở dòng cuối cùng trước khi trả về `return { statsStr: JSON.stringify(payload) }`, sau đó `JSON.parse` ở Frontend. Điều này giúp gói toàn bộ dữ liệu thành một chuỗi văn bản an toàn 100%, bảo toàn nguyên vẹn ngay cả khi có Date, NaN hay mảng thưa.

---

### 2. Sự cố Quyền truy cập Camera trên Mobile Browser (iFrame Restriction)

**Vấn đề:** 
Tính năng `getUserMedia` hoạt động tốt trên Laptop (Chrome/Edge) nhưng bị chặn (NotAllowedError hoặc OverconstrainedError) trên thiết bị di động (Safari iOS).

**Nguyên nhân gốc:** 
Google Apps Script Web App luôn render toàn bộ ứng dụng của bạn bên trong một `<iframe>` do chính Google cung cấp (sandbox domain `script.googleusercontent.com`). Trình duyệt Mobile chặn quyền mở trực tiếp luồng Video liên tục từ bên trong một iFrame chéo miền (Cross-origin iFrame) vì lý do bảo mật. Một nút bấm có sự kiện `click()` kích hoạt bằng JS (`input.trigger('click')`) được đánh giá là "hành vi tự động, không minh bạch", dẫn tới việc trình duyệt cấm bật Camera.

**Cách giải quyết tinh tế (The Label Hack):**
Loại bỏ hoàn toàn JavaScript trong việc kích hoạt Camera.
Áp dụng cơ chế **Native Input Capture** của HTML5:
`html
<input type="file" id="cam_truoc" accept="image/*" capture="environment" class="d-none">
<label for="cam_truoc"><i class='bx bx-camera'></i></label>
`
Bằng cách ẩn `<input>` đi và dùng thẻ `<label>` làm giao diện nút bấm, người dùng chạm vào màn hình là một thao tác click quang học nội bộ (Native Click) trực tiếp vào `<input>`. Thiết bị ngay lập tức đánh thức Camera hệ thống, hoàn toàn vượt mặt mọi hạn chế bảo mật của iFrame. Cực kỳ nuột nà và mượt mà.

---

### 3. Cơn Mộng Du của OpenCV Mảng Byte (Memory Leak Crash)

**Vấn đề:**
iOS Safari thi thoảng bị văng trang bộ nhớ (Crash, Load lại trang trắng) sau khi Crop khoảng 3-4 tấm ảnh liên tiếp trong một phiên làm việc.

**Nguyên nhân gốc:**
OpenCV.js được dịch từ C++ sang WebAssembly (WASM). Khi bạn gọi `let src = cv.imread(img)`, OpenCV cấp phát bộ nhớ RAM trên Heap của WebAssembly. Trình thu gom rác (Garbage Collector) của JavaScript **CỰC KỲ KÉM** trong việc nhận điểm dọn dẹp các đối tượng được cấp phát bộ nhớ WASM. Hệ quả là RAM bị phình to (Leak) lên 1-2GB chỉ sau vài lần crop, khiến hệ điều hành đóng băng tab để tự bảo vệ.

**Cách giải quyết (Memory Management C++ in JS):**
Luôn phải đối xử với OpenCV.js giống hệt ngôn ngữ C++. Bắt buộc phải có luồng giải phóng bộ nhớ bằng tay bằng lệnh `.delete()` trong khối `finally { ... }` đối với các con trỏ OpenCV:
``javascript
try {
   let src = cv.imread(...);
   let dst = new cv.Mat();
} finally {
   if (src) src.delete();
   if (dst) dst.delete();
}
``
Sau khi bổ sung chiến lược tự hủy này, WebApp dùng lượng RAM dẹt ổn định xung quanh 150MB, không bao giờ bị tràn nữa.

---

### 4. Triết lý Sync Data Giữa Frontend Bảng Tính & Hệ Thống (LockService)

**Vấn đề:** 
Hai cán bộ ấn Lưu hồ sơ cùng một giây nhưng chỉ một bộ được đẩy vào Sheet, bộ còn lại bị ghi đè lên dòng của bộ kia. Hoặc giao diện cập nhật trạng thái "Đã xác minh" bên Cán Bộ A, nhưng Cán Bộ B cập nhật cùng lúc bị mất data.

**Nguyên nhân:**
Cơ chế "Read-Modify-Write" của Google Sheets quá rủi ro (Race Condition). Google Sheets không phải là Relational Database tĩnh có Transaction Lock mặc định.

**Giải pháp Vàng (LockService Pattern):**
Phủ toàn bộ các tính năng Ghi nội dung vào DB trong khối `LockService`. 
```javascript
const lock = LockService.getScriptLock();
if (lock.tryLock(10000)) {
   try {
      // 1. Get values 
      // 2. Modify values in memory array
      // 3. Set values back
      SpreadsheetApp.flush(); // QUAN TRỌNG: Cưỡng ép ghi thẳng xuống ổ đĩa, bỏ qua cache của Google!
   } finally {
      lock.releaseLock();
   }
}
```
Nhờ `Flush()`, dòng dữ liệu được neo chặt xuống Sheet ngay lập tức, báo hiệu thao tác Hoàn thành tuyệt đối an toàn.

---

*Tài liệu đúc kết này là tài sản kỹ thuật cao cấp, đảm bảo vòng đời dự án và mở đường cho việc xây dựng nhiều hệ thống Google Apps Script quy mô Doanh nghiệp lớn sau này.*
