# BÁO CÁO KIỂM TRA TOÀN DIỆN VÀ LỘ TRÌNH TỐI ƯU HỆ THỐNG
**Dự án:** Quản lý Chỉ tiêu Mở tài khoản - Quỹ TDND Yên Thọ
**Môi trường:** Google Apps Script (Backend) & Vercel/Netlify SPA (Frontend)
**Thời gian đánh giá:** 30/03/2026

---

## 1. ĐÁNH GIÁ HIỆN TRẠNG KIẾN TRÚC TỔNG THỂ

Hệ thống đã trải qua quá trình chuyển đổi quan trọng: Tách từ mô hình Monolith (HTML nhúng trong GAS) sang kiến trúc **SPA (Single Page Application)** chạy độc lập trên Vercel/Netlify. Kiến trúc này mang lại lợi ích lớn về UI/UX và tốc độ tải trang, nhưng đòi hỏi sự nhất quán tuyệt đối trong giao tiếp API.

### 1.1. Frontend (Netlify-App / Vercel)
- **Điểm sáng:** 
  - Giao diện Premium, sử dụng Bootstrap 5, SweetAlert2, DataTables hiển thị phân trang chuyên nghiệp.
  - Tích hợp thành công OpenCV và Compressor để cắt/nén ảnh phía Client, giảm mạnh chi phí băng thông và quota 6 phút của GAS.
  - Sử dụng Token/Session (LocalStorage) thay vì Cache cứng giúp tăng tính bảo mật.
- **Rủi ro rình rập cần chú ý:**
  - **Single Point of Failure tại `app.js`:** Với hơn 1800 lines code, mọi rủi ro về JS Syntax (`TypeError`) đều có thể đánh sập toàn bộ luồng chạy của hệ thống như lỗi DataTables vừa qua. (Chỉ một lỗi nhỏ ở $(document).ready đã chặn đứng toàn bộ form đăng ký, nút bấm và hiển thị modal).
  - **Memory Leak OpenCV:** Việc load và xử lý ảnh (ma trận cv.Mat) qua WebAssembly có rủi ro tràn RAM trên các thiết bị Mobile cấu hình yếu nếu người dùng chup/tải ảnh quá nhiều lần liên tiếp không xử lý dispose memory đúng cách.

### 1.2. Backend (Google Apps Script)
- **Điểm sáng:**
  - Logic LockService đa tầng: Chống trùng đơn cực tốt. (Ngăn chặn việc double-click nhân bản hồ sơ).
  - Phương thức đọc/ghi mảng (Batch Process): Không sử dụng `setValue()` trong vòng lặp, cải thiện đáng kể tốc độ ghi và ngăn time-out vượt rào.
  - Bảo mật mã băm `SHA256` qua `CryptoJS` được đồng bộ thông suốt giữa Frontend & Backend.
- **Rủi ro rình rập cần chú ý:**
  - **Timeout doPost:** Nếu file tải lên quá nặng (> 10MB) và kết nối mạng chập chờn, luồng xử lý Payload Base64 có thể vượt quá giới hạn 6 phút của Google Apps Script dẫn đến lỗi "Vượt quá thời gian thực thi tối đa".
  - **Quản lý source code:** Kho lưu trữ đang chứa hỗn hợp cả file .html cũ (code của Monolith GAS cũ) và codebase mới. Dễ gây nhầm lẫn nếu nhiều lập trình viên cùng tham gia.

---

## 2. CÁC TỒN ĐẠI ĐÃ PHÁT HIỆN & KHẮC PHỤC TRONG PHIÊN BẢN v2.1.2-STABLE

| Phân hệ             | Vấn đề / Bug phát hiện                                                                                                                                                             | Mức độ     | Trạng thái hiện tại |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------|
| **Khởi tạo UI**     | Bắt lỗi biến dị khi gọi `$.fn.DataTable.ext` sai chính tả (chữ D hoa) làm JS Engine halting. Form, Dropdown, Modal và Script liên kết hoàn toàn bị đình trệ dẫn tới "Trắng băng". | **CRITICAL** | ✅ Đã Sửa (`$.fn.dataTable.ext`) |
| **Báo trùng Lặp**   | Thiếu hàm giao tiếp `checkDuplicate()` onBlur trên UI bản SPA, khiến Input không báo đỏ trực tiếp ngay khi nhập.                                                              | **HIGH**   | ✅ Khôi phục và bổ sung params báo trùng theo Loại hình (Cá nhân / HKD). |
| **Progress Bar**    | CSS conflict giữa jQuery `.show()`/`.hide()` và Bootstrap class tĩnh `!important` ẩn. Thanh "%" bị kẹt 0%.                                                                        | **MEDIUM** | ✅ Remove inline tags và setup lại toggle class |
| **DataTables Auth** | Ký tự tiếng Việt có dấu làm nghẽn bộ lọc mặc định trên danh sách Khách hàng.                                                                                                    | **MEDIUM** | ✅ Inject bộ lọc chuỗi VN về dạng không dấu trên RAM trước khi lookup |
| **Form Đăng nhập**  | Cửa sổ Modal Đổi Mật Khẩu (Force Reset) không hiện tuân thủ Bootstrap Modal Back-drop. Gây kẹt hệ thống.                                                                            | **HIGH**   | ✅ Tinh chỉnh lại Z-index và Cấu hình Script trigger |

---

## 3. LỘ TRÌNH KHUYẾN NGHỊ (ROADMAP) VÀ GIẢI PHÁP TƯƠNG LAI

### Giai đoạn 1: Refactoring Frontend (Làm sạch & An toàn hoá `app.js`)
**Vấn đề:** Không nên nhồi nhét mọi logic (API calls, OpenCV handling, DataTables Init, Auth) vào 1 file `app.js` quá đồ sộ. 
**Thực thi:** 
1. Tiến hành module hoá. Tại thư mục `netlify-app`, bóc tách các file JS con theo công năng:
   - `api-service.js`: Quản lý 100% việc gọi backend `runAPI`, cấu hình endpoints, intercept requests.
   - `camera-service.js`: Chứa hàm của OpenCV và `browser-image-compression` để quản lý độc lập tiến trình bộ nhớ.
   - `ui-components.js`: Tách rời logic xử lý DataTable, Modals, SweetAlert2.

### Giai đoạn 2: Trình Dọn Dẹp Mã Nguồn Backend (GAS Codebase Clean)
**Vấn đề:** Tính hỗn tạp giữa file Local (Vercel) và File Remote (Google Apps Script). Hệ thống đang tồn tại rất nhiều file .html thừa như `frmMoTaiKhoan.html`, `jsApp.html` nằm xen kẽ ở Root mà không được sử dụng ở Frontend Vercel (chỉ được dùng như Code rác từ Version 1).
**Thực thi:** 
1. Backup toàn bộ codebase cũ ở Root vào 1 thư mục `/legacy`.
2. Tạo tệp tin cấu hình `.claspignore` chặt chẽ, ngăn cản việc Push các file Frontend (từ `/netlify-app`) lấn át file Backend (`.gs`) khi dùng clasp.
3. Đồng nhất chỉ 1 nguồn duy nhất (SSOT) chứa Giao diện người dùng là thư mục `netlify-app`.

### Giai đoạn 3: Giám sát Hệ thống (Monitoring) & Bẫy lỗi
**Vấn đề:** Nếu App Script báo lỗi, người dùng bị tịt (không biết do mạng mình hay do hệ thống).
**Thực thi:** 
1. Viết một hàm tích hợp Webhook qua **Telegram Bot**. Bất cứ khi nào GAS gặp lỗi Timeout / Duplicate Database / Error Parse, GAS sẽ tự Catch Error và bắn tin nhắn cảnh báo với định dạng: `[ERROR-LOG] Timeout khi user A gửi ảnh` thẳng tới Nhóm IT nội bộ.
2. Xử lý triệt để việc Fallback của ảnh (nếu nén ảnh thất bại vì Timeout -> thử gửi size nhỏ thay vì Base64 thô to đùng).

---
**Kết luận:** Hệ thống Ebanking (Netlify/Vercel) phiên bản `v2.1.2-STABLE` hiện tại đã hoàn thiện độ cứng về logic nghiệp vụ và hoàn toàn có thể sử dụng Live/Production cho toàn thể Cán bộ nhân viên vào lúc này. Mọi thay đổi về Roadmap chỉ là sự cải tiến cấu trúc vòng lặp cho chặng đường nâng cấp phần mềm về sau.
