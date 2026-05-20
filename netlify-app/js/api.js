/**
 * API MODULE
 * v3.0 Sprint 1 Security Hardening
 * - Auto-inject _token vào MỌI request (trừ login)
 * - Intercept TOKEN_EXPIRED → tự động logout
 * - Hardened với Timeout (35s) và Auto-Retry (Max 2)
 */

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbya5cID4D6Yp49psRWd6KPF9kiUjnOhLXeGf9j3419Vw2YPsdiZlM_b4nCsfSG3ZGq9/exec";

// ─── Token Management ──────────────────────────────────────────────────────────

/** Lưu session: token và thông tin user vào localStorage */
function saveSession(token, userObj) {
    if (token) localStorage.setItem('APP_SESSION_TOKEN', token);
    if (userObj) localStorage.setItem('HOKINHDOANH_SESSION', JSON.stringify(userObj));
}

/** Lấy token hiện tại từ localStorage */
function getSessionToken() {
    return localStorage.getItem('APP_SESSION_TOKEN') || '';
}

/** Xử lý khi token hết hạn — logout tự động */
function handleTokenExpired() {
    localStorage.clear();
    sessionStorage.clear();
    if (typeof AppCache !== 'undefined') AppCache.clearAll();
    if (typeof AppState !== 'undefined') AppState.user = null;
    // Thông báo nhẹ nhàng (không dùng Swal để tránh lỗi khi Swal chưa load)
    const msg = 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.';
    if (typeof Swal !== 'undefined') {
        Swal.fire({ icon: 'warning', title: 'Hết phiên', text: msg, timer: 3000, showConfirmButton: false })
            .then(() => { window.location.href = window.location.pathname + '?v=' + Date.now(); });
    } else {
        alert(msg);
        window.location.href = window.location.pathname + '?v=' + Date.now();
    }
}

// ─── Core runAPI ───────────────────────────────────────────────────────────────

/**
 * Gọi GAS Backend API
 * v3.0: Tự động inject _token vào data. Không bao giờ tin data.email từ client.
 *
 * @param {string} action          - Tên action (khớp Main.gs apiHandlers)
 * @param {object} data            - Dữ liệu gửi lên (không cần tự thêm token)
 * @param {function} successHandler
 * @param {function} errorHandler
 * @param {string} loadingMsg      - Thông điệp loading ('NONE' để tắt)
 * @param {number} retryCount      - Nội bộ, không truyền từ ngoài
 */
async function runAPI(action, data = {}, successHandler, errorHandler, loadingMsg = 'Đang xử lý...', retryCount = 0) {
    if (loadingMsg !== 'NONE' && retryCount === 0) showLoading(loadingMsg);

    // ── Auto-inject _token vào MỌI request (trừ login) ──────────────────────
    const isLoginAction = (action === 'api_login');
    const payload = Object.assign({}, data);
    if (!isLoginAction) {
        payload._token = getSessionToken();
    }
    // ────────────────────────────────────────────────────────────────────────

    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 35000); // 35s timeout

    try {
        const response = await fetch(GAS_API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action: action, data: payload }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        let result;
        const textRes = await response.text();
        try {
            result = JSON.parse(textRes);
        } catch (e) {
            console.error("Lỗi phân tích JSON từ Server. Phản hồi thô:", textRes.substring(0, 200));
            throw new Error('Dữ liệu trả về bị rác (Không phải JSON). Vui lòng thử đổi mạng Wi-Fi khác.');
        }

        // ── Intercept TOKEN_EXPIRED ── ────────────────────────────────────────
        if (result && result.message === 'TOKEN_EXPIRED') {
            if (loadingMsg !== 'NONE') hideLoading();
            handleTokenExpired();
            return; // Dừng luồng, không gọi successHandler/errorHandler
        }
        // ─────────────────────────────────────────────────────────────────────

        if (loadingMsg !== 'NONE') hideLoading();
        if (successHandler) successHandler(result);
        return result;

    } catch (error) {
        clearTimeout(timeoutId);

        // Auto-retry khi timeout hoặc mất mạng (tối đa 2 lần)
        if (retryCount < 2 && (error.name === 'AbortError' || error.message === 'Failed to fetch')) {
            console.warn(`API Retry [${action}] attempt ${retryCount + 1}...`);
            return runAPI(action, data, successHandler, errorHandler, loadingMsg, retryCount + 1);
        }

        if (loadingMsg !== 'NONE') hideLoading();
        console.error(`API Error [${action}]:`, error);

        let errorMsg = error.message;
        if (error.name === 'AbortError')              errorMsg = 'Yêu cầu quá hạn (35s). Vui lòng thử lại.';
        else if (error.message === 'Failed to fetch') errorMsg = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng.';

        if (errorHandler) errorHandler(error);
        else showAlert('Lỗi kết nối', errorMsg, 'error');
    }
}

// ─── APIClient (Promise-based wrapper) ────────────────────────────────────────

/**
 * APIClient — Promise-based wrapper cho runAPI
 * Dùng cho các module cần .then()/.catch() thay vì callback
 *
 * Tính năng:
 *  - _token được auto-inject bởi runAPI (không cần inject thủ công ở đây nữa)
 *  - email backward-compat: vẫn inject email để các hàm backend cũ hoạt động
 *  - Trả về Promise: resolve(result) khi thành công, reject(error) khi lỗi
 *  - Không hiển thị alert mặc định — caller tự xử lý .catch()
 */
const APIClient = {
    /**
     * @param {string} action
     * @param {object} payload
     * @returns {Promise<object>}
     */
    call: function(action, payload = {}) {
        // Backward-compat: inject email để các hàm cũ vẫn đọc được data.email
        if (typeof AppState !== 'undefined' && AppState.user && AppState.user.email && !payload.email) {
            payload = Object.assign({}, payload, { email: AppState.user.email });
        }

        return new Promise((resolve, reject) => {
            runAPI(
                action,
                payload,
                (result) => resolve(result),
                (error)  => reject(error),
                'NONE'
            );
        });
    }
};
