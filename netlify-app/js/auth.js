/**
 * AUTH MODULe
 */

function handleLogin(e) {
    e.preventDefault();
    const email = $('#loginEmail').val().trim();
    const pwd = $('#loginPassword').val();
    const hashedPwd = CryptoJS.SHA256(pwd).toString();

    runAPI('api_login', { email, password: hashedPwd }, (res) => {
        if (res.status === 'success') {
            AppState.user = res.user;
            localStorage.setItem('HOKINHDOANH_SESSION', JSON.stringify(res.user));
            if (res.requirePasswordChange) {
                const modalEl = document.getElementById('modalChangePassword');
                if (modalEl) {
                    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                    modal.show();
                    $('#pwdAlertForce').removeClass('initially-hidden').show();
                    $('#modalChangePassword .btn-close').hide();
                    $('#modalChangePassword').attr('data-bs-keyboard', 'false');
                }
                hideLoading();
            } else {
                handleLoginSuccess(false);
            }
        } else showAlert('Lỗi', res.message, 'error');
    });
}

function handleLoginSuccess(silent) {
    hideLoading();
    const userName = AppState.user.fullName || AppState.user.name || AppState.user.email;
    if (!silent) showAlert('Thành công', `Chào mừng ${userName}!`, 'success');
    
    $('#user-name-display-admin').text(userName);
    $('#user-name-display-user').text(userName);
    
    if (AppState.user.role === 'Admin') {
        $('#staffBottomNav').addClass('d-none');
        showView('view-dashboard');
        if (typeof initDashboard === 'function') initDashboard();
    } else {
        $('#staffBottomNav').removeClass('d-none');
        showView('view-mo-tai-khoan');
        if (typeof initMoTaiKhoanForm === 'function') initMoTaiKhoanForm();
    }
}

function logout() {
    localStorage.clear();
    sessionStorage.clear();
    AppCache.clearAll();
    AppState.user = null;
    
    // Ép trình duyệt tải lại trang và bỏ qua cache bằng cách thêm tham số timestamp ngẫu nhiên
    window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
}

function openChangePasswordModal() {
    const modalEl = document.getElementById('modalChangePassword');
    if (!modalEl) return;
    
    $('#pwdOld').val('');
    $('#pwdNew').val('');
    $('#pwdNewConfirm').val('');
    $('#pwdAlertForce').hide();
    $('#modalChangePassword .btn-close').show();
    $('#modalChangePassword').attr('data-bs-keyboard', 'true');
    $('#frmChangePassword')[0]?.reset();
    
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

function handleChangePassword(e) {
    e.preventDefault();
    if (!AppState.user) return;
    
    const oldP = $('#pwdOld').val();
    const newP = $('#pwdNew').val();
    const newPc = $('#pwdNewConfirm').val();

    if (!oldP || !newP) {
        showAlert('Lỗi', 'Vui lòng nhập đầy đủ mật khẩu cũ và mới.', 'warning');
        return;
    }
    
    if (newP !== newPc) {
        showAlert('Lỗi', 'Mật khẩu mới không khớp!', 'warning');
        return;
    }

    if (newP.length < 6) {
        showAlert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự.', 'warning');
        return;
    }

    const btn = $('#btnSubmitChangePwd');
    const oldHtml = btn.html();
    btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
    
    // Hash passwords for security
    const oldH = CryptoJS.SHA256(oldP).toString();
    const newH = CryptoJS.SHA256(newP).toString();

    runAPI('api_changepassword', {
        email: AppState.user.email,
        oldHashed: oldH,
        newHashed: newH
    }, (res) => {
        btn.prop('disabled', false).html(oldHtml);

        if (res.status === 'success') {
            showAlert('Thành công', 'Đổi mật khẩu thành công! Vui lòng truy cập hệ thống.', 'success');
            $('#modalChangePassword').modal('hide');
            handleLoginSuccess(false);
        } else {
            showAlert('Lỗi', res.message, 'error');
        }
    });
}

// Global exposure
window.logout = logout;
window.openChangePasswordModal = openChangePasswordModal;
