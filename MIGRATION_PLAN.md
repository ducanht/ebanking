# KẾ HOẠCH CHUYỂN ĐỔI KIẾN TRÚC: NETLIFY + GOOGLE SHEETS
**(Migration Plan: High-Performance Serverless Architecture)**

Lộ trình này nhằm mục đích tách biệt Giao diện (Frontend) khỏi Google Apps Script để nâng cao tốc độ, tính chuyên nghiệp và khả năng can thiệp sâu vào phần cứng (Camera).

---

## 1. MÔ HÌNH KIẾN TRÚC MỤC TIÊU (TARGET ARCHITECTURE)

- **Frontend:** Hosted trên **Netlify** (Toàn bộ HTML, CSS, JS, Assets).
- **Backend API:** **Google Apps Script (GAS)** Web App (Làm nhiệm vụ xử lý logic và ghi DB).
- **Database:** **Google Sheets** (Giữ nguyên hiện tại).
- **Authentication:** Token-based (Lưu tại LocalStorage).

---

## 2. LỘ TRÌNH TRIỂN KHAI (IMPLEMENTATION STEPS)

### GIAI ĐOẠN 1: TÁCH BIỆT FRONTEND (DECOUPLING)
1. **Trích xuất mã:** 
   - Tách `index.html` thành `index.html` lẻ.
   - Trích xuất toàn bộ `<style>` trong các file `.html` vào `assets/css/main.css`.
   - Trích xuất toàn bộ `<script>` vào `assets/js/app.js`.
2. **Refactor Cổng giao tiếp:**
   - Xây dựng hàm `fetchAPI(action, data)` thay thế cho `google.script.run`.
   - Hàm này sẽ dùng phương thức `POST` gửi tới đường dẫn Web App của GAS.

### GIAI ĐOẠN 2: XÂY DỰNG API ROUTER (BACKEND)
1. **Cấu hình `doPost(e)`:**
   - Viết một hàm điều phối (Router) tại Backend để nhận tham số `action` (ví dụ: `login`, `submitForm`, `getDashboard`).
   - Phân luồng yêu cầu tới các hàm `api_*.gs` tương ứng.
2. **Xử lý CORS (Bắt buộc):**
   - Đảm bảo phản hồi từ GAS luôn kèm theo Header cho phép Netlify truy cập.
   - Trả về dữ liệu dưới dạng `ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON)`.

### GIAI ĐOẠN 3: BẢO MẬT & XÁC THỰC
1. **Cơ chế Token:**
   - Khi đăng nhập thành công, Backend trả về một chuỗi `sessionToken` ngẫu nhiên.
   - Frontend lưu Token này. Mọi yêu cầu sau đó (Lưu hồ sơ, Xem Dashboard) đều phải đính kèm Token này để Backend xác minh danh tính.
2. **Bảo mật Endpoint:**
   - Thiết lập một `API_KEY` bí mật giữa Netlify và GAS để ngăn chặn bên thứ 3 gọi lén API của Quỹ.

### GIAI ĐOẠN 4: NÂNG CẤP UX/UI (NETLIFY ADVANTAGES)
1. **Tích hợp PWA (Progressive Web App):**
   - Tạo file `manifest.json` và `service-worker.js`.
   - Cho phép Cán bộ "Cài đặt" ứng dụng vào màn hình chính điện thoại, hoạt động như app bản địa.
2. **Native Camera Live-feed:**
   - Sử dụng thư viện `Html5-QRCode` hoặc `Instascan`.
   - Cán bộ thấy khung quét trực tiếp, máy tự nhận diện CCCD/GPKD và chụp tự động khi đúng khung hình.

### GIAI ĐOẠN 5: TRIỂN KHAI & KIỂM THỬ (DEPLOYMENT)
1. **GitHub Sync:** Đưa code lên GitHub để Netlify tự động cập nhật mỗi khi có thay đổi (Auto-deployment).
2. **Testing:** Chạy song song 1 tuần để đảm bảo tính ổn định của API.
3. **Switch:** Chuyển toàn bộ Cán bộ sang đường dẫn mới.

---

## 3. ĐÁNH GIÁ LỢI ÍCH SAU KHI HOÀN THÀNH

| Chỉ số | Kiến trúc cũ (GAS) | Kiến trúc mới (Netlify) |
| :--- | :--- | :--- |
| **Tốc độ load trang** | 3 - 5 giây | **< 1 giây** |
| **Độ trễ Camera** | Cao (Do iFrame) | **Cực thấp (Native)** |
| **Trải nghiệm offline** | Không thể | **Có thể (PWA Cache)** |
| **SEO & Thương hiệu** | Không có | **Có (Custom Domain)** |
| **Bảo trì** | Khó (GAS Editor hạn chế) | **Dễ (Dùng VS Code + Git)** |

---
**Ghi chú:** Đây là kế hoạch nâng cấp mang tính chuyên nghiệp hóa cao. Nếu Quỹ quyết định thực hiện, chúng ta sẽ bắt đầu từ Giai đoạn 1 ngay lập tức.

**Người lập kế hoạch:** *Antigravity AI – Chuyên gia giải pháp Cloud*
