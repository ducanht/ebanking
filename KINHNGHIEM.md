# CẨM NANG KINH NGHIỆM TRIỂN KHAI HỆ THỐNG: NETLIFY/VERCEL + GITHUB + GOOGLE APPS SCRIPT (GAS)

Tài liệu này tổng hợp chi tiết toàn bộ các vấn đề cốt lõi, kỹ thuật đã giải quyết và kinh nghiệm thực tiễn trong quá trình chuyển đổi kiến trúc hệ thống từ nguyên khối (Monolithic GAS) sang kiến trúc tách rời mã nguồn (Decoupled SPA) chạy trên nền tảng Serverless (Netlify/Vercel). Tài liệu phục vụ như một cuốn sổ tay vô giá cho các dự án tương lai.

## 1. MÔ HÌNH KIẾN TRÚC TỔNG THỂ VÀ TƯ DUY TÁCH RỜI (DECOUPLING)

### 1.1 Khái niệm
- **Frontend (Giao diện Client-Side):** Đặt trên Netlify hoặc Vercel, quản lý mã nguồn qua GitHub. Nơi chứa toàn bộ Shell HTML, CSS chuẩn, JS tĩnh. Ưu điểm: Khách hàng truy cập load cực kỳ nhanh nhờ sức mạnh CDN toàn cầu.
- **Backend (API + Database):** Google Apps Script đóng vai trò là RESTful API Server, sử dụng điểm cuối `doPost` để xử lý Webhook/Request từ Frontend và điều khiển Google Sheets (Database) / Google Drive (Storage).

### 1.2 Lợi ích đột phá
- Thay vì bị khóa chặt bởi giao diện chậm chạp và khung iframe của Google. Kiến trúc mới cho phép tích hợp các thư viện UI JS hiện đại một cách mạnh mẽ (VD: OpenCV.js cắt ảnh AI, Chart.js vẽ biểu đồ thời gian thực, DataTables xuất Excel hàng chục ngàn dòng chuẩn ngân hàng).
- Trải nghiệm người dùng tương đương Native App với cơ chế SPA (Single Page Application) - chuyển đổi màn hình (View) tức thì không cần tải lại trang.

---

## 2. NHỮNG KỸ THUẬT VÀ GIẢI PHÁP SỐNG CÒN

### 2.1 Cú lừa CORS (Cross-Origin Resource Sharing) của Google
- **Vấn đề:** Khi gọi API từ Host khác (Netlify) sang GAS, trình duyệt tự gửi một request kiểm tra `OPTIONS` (CORS Preflight). GAS mặc định **KHÔNG HỖ TRỢ HTTP OPTIONS**, dẫn đến trả về mã lỗi 405 (Method Not Allowed) hoặc bị trình duyệt chặn hoàn toàn cuộc gọi.
- **Giải pháp:** 
  - Tại lệnh `fetch` trên Client, **KHÔNG BAO GIỜ** gửi `Content-Type: application/json`.
  - **BẮT BUỘC** gửi Header `Content-Type: text/plain;charset=utf-8`. Trình duyệt sẽ phân loại đây là "Simple Request" và lách qua bước Preflight `OPTIONS`.
  - Khắc phục tại Backend GAS: Vẫn dùng chuỗi JSON gửi đi nhưng trên GAS phải parse thủ công bằng: `JSON.parse(e.postData.contents)`.

### 2.2 Lỗi Màn Hình Trắng (Blank Screen) Sau Khi Khởi Tạo SPA
- **Vấn đề:** Các Element HTML trong DOM chưa kịp Render, nhưng JavaScript đã gọi lệnh thao tác (như DataTables `.DataTable()` hoặc Chart `.getContext()`). Sinh lỗi `TypeError: Cannot read properties of null` rồi treo cứng tiến trình (Silently Fail).
- **Giải pháp:** 
  - Quản lý đồng bộ: Gắn các tệp Script vào `<head>` với thẻ `defer` HOẶC đặt tại cuối file HTML (trước `</body>`).
  - Toàn bộ lời gọi ban đầu phải được bọc trong sự kiện `$(document).ready()` hoặc `DOMContentLoaded`.
  - Thêm hệ thống Loading Spinner chặn 100% tương tác cho đến khi Frontend và Backend bắt tay nhau thành công.

### 2.3 Bảo mật phiên người dùng (Session Security in SPA)
- **Vấn đề:** Không có Session Server-Side như mô hình cũ. Rủi ro lộ dữ liệu hoặc tạo bút toán kép nếu nhiều cán bộ dùng chung 1 máy tính. Đăng xuất không triệt để dẫn đến giữ phiên làm việc của người trước.
- **Giải pháp (Hardened Logout & Token Flow):**
  - Thông tin đăng nhập bọc dạng Token băm (SHA256) lưu vào `localStorage` HOẶC `sessionStorage`.
  - Nút **Đăng xuất** phải gọi một hàm dọn dẹp quy mô lớn: 
    1. Xóa `localStorage`, xóa `sessionStorage`.
    2. Reset mọi biến lưu trữ trung gian/cache (`AppCache`).
    3. Trả trắng Form Đăng nhập `document.getElementById('frm-login').reset()`.
    4. Cú chốt: Gọi lệnh tải lại cứng `window.location.reload()` để ép trình duyệt dọn RAM và bộ nhớ tĩnh.

### 2.4 Chiến Lược Chống Quá Tải GAS (OOM - Out of Memory)
- **Vấn đề:** Hạn mức thời gian thực thi (Quota) của GAS là 6 phút/lệnh. RAM cực kỳ hạn chế. Nếu bắt Backend nhận nhiều ảnh thô 10MB cùng lúc để nén và ghi vào Drive, nó sẽ Sụp Đổ hoặc Báo Timeout.
- **Giải pháp (Chuyển Giao Công Việc):**
  - **Client-Side Compute:** Đưa toàn bộ tài nguyên nặng xuống thiết bị của người dùng (Điện thoại/Máy tính).
  - Sử dụng **OpenCV.js** (Máy học) trên trình duyệt để tự động nhận dạng khuôn hình CCCD/Giấy tờ (Quad-Detection) thay vì bắt Server mò góc.
  - Sử dụng **Canvas API** kết hợp thuật toán tỷ lệ (Aspect Ratio) ép nén ảnh từ 10MB xuống ~300KB (định dạng JPEG `0.7`) ngay trên trình duyệt trước khi đóng gói gửi đi.
  - **Bơm Tuần Tự:** Thay vì gửi lệnh tải 4 file ảnh cùng lúc, lập trình hàm đệ quy (Recursive/Async-Await) tải từng ảnh một lên Google Drive. Trả về từng ID tương ứng rồi mới Submit Form cuối cùng.

### 2.5 Lỗi Race Conditions (Ghi Đè Kép Dữ Liệu)
- **Vấn đề:** Trong mô hình Async phân tán, 2 nhân viên cùng nhấn "Lưu data" vào bảng Spreadsheet ở cùng một tích tắc. Thường dẫn tới kết quả: Dữ liệu ghi thiếu, hoặc dữ liệu người sau ghi đè lên hàng người trước.
- **Giải pháp (LockService Bắt Buộc):**
  - Backend GAS khi tiếp nhận mã lệnh ghi (`appendRow` hay `setValues`) phải bắt đầu bằng lệnh khoá: `const lock = LockService.getScriptLock(); lock.waitLock(15000);`
  - Hoàn tất mọi phép tính toán thay đổi ô, phải chốt lệnh: `SpreadsheetApp.flush()`. Chỉ khi hàm `flush()` thực thi xong, Spreadsheet mới đồng bộ vật lý từ RAM xuống ổ đĩa tính toán.
  - Cuối cùng mới Release: `lock.releaseLock()`. Hoàn hảo ngăn ngừa 100% các Race Conditions.

### 2.6 Khắc Phục Mảng DOM Trong Quản Lý Big Data
- **Vấn đề:** Việc gọi `sheet.getValue()` hay `sheet.getRange(x,y).setValue()` nếu đặt vào trong vòng lặp (`for`, `while`) là phương pháp tự sát trên GAS, làm tốn hằng chục phút cho 1.000 dòng.
- **Giải pháp:**
  - LUÔN LUÔN đọc hàng loạt (Batch Ops): `const data = sheet.getDataRange().getValues()`.
  - Phân tích và sửa đổi dữ liệu qua Mảng Arrays trong RAM máy chủ (Sử dụng hàm `.map()`, `.filter()`).
  - Cuối cùng đẩy một mảng 2D hoàn chỉnh ngược xuống một lúc: `sheet.getRange(...).setValues(newData)`.

---

## 3. QUY TRÌNH QUẢN LÝ DỰ ÁN & TRIỂN KHAI LIÊN TỤC (CI/CD)

Các dự án tiếp theo nếu muốn Scale Up (Mở rộng) sẽ đi theo luồng Quy Chuẩn (SOP) này:

1. **Khởi Trị Backend Mới:**
   - Tạo Project Google Apps Script mới. Viết `doPost(e)` Router. Code chuẩn hóa phân rã thành các tệp Controller (VD: `api_auth.gs`, `api_customer.gs`).
   - Sử dụng **PropertiesService** của GAS lưu Hard-Coded (Folder ID, Sheet ID). Không bao giờ nhét khóa bí mật trực tiếp vào code.
   - Nhấn **Deploy As Web App** -> Cấp quyền "Anyone". (Chú ý: Mỗi lần Dev Backend thì dùng phiên bản "Test Deployment", lúc hoàn thiện lên mạn thì Deploy "New Version").

2. **Dọn Kho Github & `.gitignore`:**
   - Tại Local (Máy lập trình), tạo `.claspignore` (để chặn đẩy Frontend lên GAS) và `.gitignore` (để chặn đẩy Backend `.gs` lên GitHub).
   - Backend chỉ sống trên Cụm máy chủ Google. Mã Frontend đẩy lên GitHub. Không được lai vãng chéo.

3. **Auto-Deploy Với Netlify / Vercel:**
   - Link Github Repository vào Netlify hoặc Vercel.
   - Trỏ "Publish Directory" đến bộ mã tĩnh (VD `netlify-app`).
   - Mỗi lần máy thiết kế Local muốn Update tính năng: `git add .` -> `git commit -m "Update tính năng X"` -> `git push`.
   - Vercel/Netlify sẽ mất khoảng 15 giây Build, cập nhật hệ thống cho hàng ngàn người dùng mà không có Downtime.

---

## 4. TỔNG KẾT

Mô hình **Severless Client (Netlify) + JSON API Backend (Google Apps Script)** là thiết kế tối ưu nhất cho các doanh nghiệp, tổ chức vừa và nhỏ có ngân sách máy chủ = 0 VNĐ nhưng cần trải nghiệm Enterprise mượt mà, chuyên nghiệp.

Những kinh nghiệm trong tài liệu này (như xử lý cấu hình CORS, khóa dữ liệu Lock Service, nén ảnh bằng trình duyệt) chính là cốt lõi để Hệ thống không bị đổ vỡ khi tải mạnh. Bất cứ dự án nào trong tương lai áp dụng phương pháp này sẽ rút ngắn thời gian phát triển đi 70% và khắc phục dứt điểm mọi cơn ác mộng về quản trị máy chủ.
