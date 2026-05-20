# TIẾN ĐỘ THỰC HIỆN

- [x] Cập nhật URL API mới nhất vào `api.js` (Vercel/Netlify)
- [x] Sửa Frontend: Kiểm trùng ngay khi nhập (onblur) + Gửi kèm Loại hình
- [x] Sửa Backend: `api_validateDuplicate` lọc theo Loại hình
- [x] Đồng bộ 18 cột dữ liệu trong `api_submitAccountForm`
- [x] Đồng bộ 18 cột dữ liệu trong `api_updateMyCustomer` 
- [x] Cập nhật `KIEN_TRUC_HE_THONG.md`
- [x] Đẩy code lên GAS và kiểm tra toàn diện
- [x] KHÔI PHỤC tính năng hiển thị Dashboard và gửi form checkbox Cấp Mã QR & Loa trên `index.html` và `app.js` (Bản monolith)
- [ ] TODO (Session kế tiếp): Port đầy đủ phần giao diện Mã QR và Loa (bao gồm thẻ Admin Dashboard, checkbox form mở tài khoản, checkbox form edit hồ sơ) sáng nhánh `netlify-app` (Sửa `netlify-app/index.html` và tập hợp `netlify-app/js/*.js`)

*Note: Khi mở lại dự án, chú ý tiếp tục thực hiện công việc ở file `netlify-app/index.html` đoạn thêm thẻ hiển thị thống kê, và các file xử lý form (*`registration.js`*, *`customer.js`*).*
