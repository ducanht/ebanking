/**
 * MÃ NGUỒN FRONTEND CHÍNH (Đã được Module hóa)
 * Quản lý khởi tạo trang và các hàm lắng nghe sự kiện tổng thể
 */

$(document).ready(() => {
    // 1. Phục hồi session nếu có
    if (AppState.user) {
        handleLoginSuccess(true);
    } else {
        localStorage.clear();
        sessionStorage.clear();
        AppCache.clearAll();
        hideLoading(); // Ẩn spinner khi đã tải xong và ở dạng đăng xuất
        showView('view-login');
        if (typeof onOpenCvReady === 'function') setTimeout(onOpenCvReady, 500);
    }

    // 2. Gán sự kiện cơ bản UI
    $('#frmLogin').on('submit', handleLogin);
    $('#btnChangePwd').on('click', openChangePasswordModal);
    $('#frmChangePassword').on('submit', handleChangePassword);
    $('#btnLogoutDetail, #btnLogoutMobile, #btnLogoutAdmin').on('click', logout);

    // 3. Prevent form submits default behaviour for dynamically generated forms
    $(document).on('submit', 'form', function(e) {
        if (!this.id && !this.className) e.preventDefault();
    });

    // 4. Modal Event Listeners
    $(document).on('show.bs.modal', '.modal', function() {
        $('body').addClass('modal-open');
    });
    
    $(document).on('hidden.bs.modal', '.modal', function() {
        if ($('.modal.show').length === 0) $('body').removeClass('modal-open');
    });

    // 5. Cấp lại quyền loading off khi có phím bấm cứng (esc) xử lý bị treo form bootstrap
    window.addEventListener('keydown', function(event) {
        if(event.key === 'Escape') {
            $('.modal').modal('hide');
        }
    });
});
