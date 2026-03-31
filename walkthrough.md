# WALKTHROUGH: NÂNG CẤP HỆ THỐNG KIỂM TRÙNG & ĐỒNG BỘ 18 CỘT

## 1. Đồng bộ hóa API & Dữ liệu
- Cập nhật URL GAS vào `api.js` để kết nối Backend-Frontend.
- Sửa mapping 18 cột trong `api_account.gs`:
  ```javascript
  // Đảm bảo ghi đủ các trường
  const rowData = [newId, timestamp, email, ten_kh, ...urlQR, urlThucHien, trangThai];
  ```

## 2. Logic Kiểm trùng thông minh (Loại hình)
- Chuyển từ kiểm tra toàn cục sang kiểm tra theo phạm vi `Loại hình dịch vụ`.
- Tình huống: Khách hàng A dùng CCCD `123` mở "Cá nhân" -> OK. Sau đó mở "Hộ kinh doanh" với cùng số `123` -> Vẫn cho phép.

## 3. Cải thiện UX
- Thêm `onblur` vào ô DKKD.
- Thêm `invalid-feedback` cho DKKD trong `registration.js`.

## 4. Tài liệu kiến trúc
- Cập nhật `KIEN_TRUC_HE_THONG.md` với danh sách 18 cột định danh.

---
**Lưu ý:** Sau khi bạn chạy lệnh `clasp push` và `clasp deploy`, hệ thống sẽ hoạt động chính xác theo yêu cầu mới.
