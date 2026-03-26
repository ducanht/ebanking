# ĐỀ ÁN CHỈNH SỬA HOÀN THIỆN & BẢO MẬT HỆ THỐNG
**Phiên bản:** 1.0 - Giai đoạn Hardening System & QA

## I. TÌNH TRẠNG HIỆN TẠI VÀ RỦI RO (Security & Concurrency Risks)

Trong quá trình đóng vai trò Chuyên gia Kiểm thử (Tester) và Đánh giá mã nguồn (Reviewer), tôi phát hiện ra 3 cụm rủi ro cực kỳ nghiêm trọng trong hệ thống hiện tại, có thể ảnh hưởng đến **tính chính xác 100% số liệu** mà mục tiêu đã đề ra.

1. **Rủi ro Ghi đè Dữ liệu (Race Conditions - Concurrency):** 
   - Hàm `insertRecordToSheet` hiện đo số dòng `getLastRow()` và `setValues()`. Nếu 2 cán bộ bấm gửi hồ sơ cùng một phần tư giây (mili-giây), cả hai luồng sẽ đọc ra cùng một `lastRow`. Kết quả là người bấm sau sẽ ghi đè đứt biến mất hồ sơ của người bấm trước.
   - **Mức độ:** Rất Nghiêm Trọng (Critical).

2. **Rủi ro Vượt quyền (Bypass Client Security):** 
   - Ở máy trạm (Client), Nhân viên bị khóa nút sửa nếu hồ sơ là `"Đã xác minh"`. Nhưng một hacker nội bộ hoàn toàn có thể dùng *Chrome DevTools* xóa thuộc tính `disabled` hoặc trực tiếp bắn Fetch API gọi thẳng hàm `api_updateMyCustomer` trên server để sửa thông tin sau khi Admin đã duyệt. Server hiện tại tin tưởng 100% Client.
   - **Mức độ:** Cực Kỳ Nghiêm Trọng (Critical) đối với khối Tài chính - Ngân hàng.

3. **Rủi ro Cache Trễ (Data Sync Lag):**
   - Khi ghi 1 loạt dữ liệu bằng Batch Ops, Google Sheets đôi khi không cập nhật ngay DOM của bảng tính. Nếu Admin tải trang sau < 1 giây, có thể không thấy dòng vừa ghi.

## II. GIẢI PHÁP & KẾ HOẠCH TRIỂN KHAI (Action Plan)

Dựa trên nguyên tắc "Bảo mật tuyệt đối và Chính xác 100%", tôi lập kế hoạch chỉnh sửa tức thì như sau:

**1. Tích hợp LockService (Khóa Giao dịch Độc quyền):**
- Bọc toàn bộ các hàm ghi nhận dữ liệu (`insertRecordToSheet`, `api_updateMyCustomer`, `api_adminUpdateStatus`) vào trong `LockService.getScriptLock()`. 
- Cấu hình thời gian khóa `waitLock(10000)` (Chờ tối đa 10s). Quá trình ghi sẽ diễn ra tuần tự như xếp hàng ở quầy thu ngân, chống 100% tình trạng ghi đè.

**2. Xác thực Bảo mật Chéo tại Server (Server-Side Hardening):**
- Cập nhật hàm `api_updateMyCustomer`: Mở file lên kiểm tra cột trạng thái. Nếu trạng thái đúng bằng `Đã xác minh`, server bắt lỗi (throw error), tuyệt đối không cho ghi đè thông tin. Đóng băng quyền sửa dữ liệu gốc.
- Cập nhật `api_submitAccountForm`: Kiểm tra dữ liệu đầu vào (Ví dụ Loại hình Cá nhân mà để trống thẻ CCCD -> Quăng lỗi).

**3. Ép buộc Flush Buffer (Clear Cache GS):**
- Ngay sau hàm `.setValues()`, bắt buộc gọi thêm `SpreadsheetApp.flush()` để đẩy toàn bộ thay đổi lưu thẳng vào đĩa cứng của DataCenter Google, giúp Admin thấy cập nhật tức thì.

## III. BÀI HỌC VÀ CẬP NHẬT LUẬT LỆ (Rules Enforcement)
- Bài học này yêu cầu thay đổi vĩnh viễn cấu trúc tư duy của System AI khi lập trình backend cho hệ thống này.
- **Rule được thêm vào GEMINI.md:** Mọi tương tác GHI/SỬA vào Google Sheets phải có Bẫy khóa `LockService` và `SpreadsheetApp.flush()`.

---

## IV. QUY TRÌNH BAO QUÁT: CHU KỲ CẢI TIẾN LẦN 2 (Continuous Improvement)
Đóng vai trò như một **Đa chuyên gia**, sau khi hệ thống cốt lõi đã chạy mượt mà, tôi tiếp tục phân tích và đề xuất 3 nâng cấp trọng điểm tiếp theo để tạo ra một siêu ứng dụng (Super-App) hoàn mĩ nhất:

1. **Phân tích Trải nghiệm Người dùng (UX Specialist):** 
   - Nhân viên khi thao tác ngoài đường nếu vô tình vuốt tải lại trang (Pull-to-refresh) sẽ bị mất phiên đăng nhập và phải gõ lại mật khẩu. 
   - **Đề xuất:** Tích hợp `sessionStorage` mã hóa tạm thời để giữ phiên đăng nhập, nhưng tự hủy khi đóng Tab (bảo mật tuyệt đối).

2. **Gia cố Dữ liệu Đầu vào (Data Validator Specialist):**
   - Hiện tại số điện thoại và CCCD có thể nhập chữ hoặc có độ dài không chuẩn xác. 
   - **Đề xuất:** Cài đặt chuẩn hóa (Regex): CCCD bắt buộc đúng 12 chữ số, SĐT đúng 10 chữ số (bắt đầu bằng 0). Bẫy lỗi ngay trên màn hình thiết bị để tiết kiệm băng thông mạng.

3. **Tiện ích Quản trị (Admin Power User):**
   - Dashboard của HĐQT mỗi lần muốn xem báo cáo mới nhất phải bấm F5 (Tải lại toàn bộ trang web), dẫn đến thời gian chờ lâu.
- **Đề xuất:** Xây dựng tính năng "Làm mới dữ liệu ngầm" (Ajax Refresh Button) không gây chớp màn hình, tích hợp trên Header của Dashboard.

## V. CHU KỲ NÂNG CẤP SPRINT 2 (Analytics & Data Security)

Bên cạnh luồng Nghiệp vụ chính, tôi đã tiến hành Sprint Nâng cấp thứ 2 tập trung vào việc Biến Dữ liệu Khô Khan thành **Biểu Đồ Trực Quan (Analytics)** và **Siết chặt Cơ chế Đăng nhập**:

1. **Phân hệ Đổi Mật Khẩu (Security First):**
    - Nhận thấy việc cấp tài khoản mật khẩu mặc định (Ví dụ `qtdyentho`) cho nhân sự có nguy cơ bị lộ và xâm nhập chéo.
    - Xây dựng lớp bảo mật **Force Password Change**: Nếu mã Hash khớp với Pass mặc định, Modal Cảnh Báo sẽ khóa cứng màn hình không cho truy cập vào luồng Nghiệp vụ. Nhân viên bắt buộc phải đổi sang Mật khẩu cá nhân (Min 6 ký tự).
    - Data cập nhật bằng `LockService` an toàn, mã hóa liên kết `CryptoJS` dưới máy Client, tuyệt đối không truyền Pass thô qua mạng.

2. **Công cụ Data Analytics (Tốc độ & Trực quan):**
    - Hệ thống được trang bị **`Chart.js`** để vẽ các biểu đồ Xu hướng (Line/Bar Chart) theo Ngày và Tháng Real-time.
    - **Tối ưu Server-side:** Thay vì tải dồn hàng ngàn dòng Ngày Tháng lên Trình duyệt, Server (`api_admin`, `api_account`) tự chạy thuật toán *Group By Timeline* bóp dung lượng dữ liệu mảng xuống mức tối đa. 

3. **Công cụ Trích Xuất Báo Cáo:**
    - Cài đặt `DataTables Buttons HTML5` giúp Admin kết xuất thẳng dữ liệu Top Cán Bộ toàn Quỹ ra **File Excel/CSV** ngay trên RAM máy tính (Client-side) trong vòng chưa tới 1 giây, bỏ qua Limit Timeout 6 phút của nền tảng Apps Script.
    - Hệ thống tích hợp Thanh Lọc Ngày (`Flatpickr Range`) nhảy số tức thời nhờ API `ext.search.push()` của DataTables.
