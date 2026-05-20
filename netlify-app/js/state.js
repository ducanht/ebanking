/**
 * STATE & CACHE MODULE
 * v3.1 — Sprint 3: Đồng bộ TTL phiên Client ↔ Server
 *
 * Server (Main.gs): CacheService TTL = 21600s (6 tiếng)
 * Client (state.js): Kiểm tra đồng thời:
 *   1. Absolute expiry: Phiên hết hạn sau đúng 6 tiếng kể từ lúc login
 *   2. Inactivity timeout: Logout nếu không hoạt động quá 60 phút
 */

// ─── Hằng số đồng bộ với Server ────────────────────────────────────────────────
const SESSION_TTL_MS       = 21600 * 1000;  // 6 tiếng — khớp TTL token trong Main.gs
const INACTIVITY_LIMIT_MS  = 60 * 60 * 1000; // 60 phút không hoạt động → logout
const SESSION_EXPIRES_KEY  = 'APP_SESSION_EXPIRES_AT'; // localStorage key

// ─── Khởi tạo AppState ─────────────────────────────────────────────────────────
let parsedUser = null;
try {
    const rawUser = localStorage.getItem('HOKINHDOANH_SESSION');
    if (rawUser && rawUser !== 'undefined' && rawUser !== 'null') {
        parsedUser = JSON.parse(rawUser);
    }
} catch (e) {
    console.warn("Dữ liệu phiên làm việc bị hỏng, đang tự động khôi phục...");
    localStorage.removeItem('HOKINHDOANH_SESSION');
}

const AppState = {
    user      : parsedUser,
    VERSION   : "3.1.0-Sprint3",
    apiBase   : "",
    lastActive: Date.now()
};

// ─── AppCache (Browser-side cache — TTL 5 phút) ────────────────────────────────
const AppCache = {
    data     : {},
    timestamp: {},
    TTL      : 300000, // 5 phút
    isFresh(key) {
        if (!this.timestamp[key]) return false;
        return (Date.now() - this.timestamp[key]) < this.TTL;
    },
    set(key, val) {
        this.data[key]      = val;
        this.timestamp[key] = Date.now();
    },
    get(key) {
        return this.isFresh(key) ? this.data[key] : null;
    },
    clear(key) {
        delete this.data[key];
        delete this.timestamp[key];
    },
    clearAll() {
        this.data      = {};
        this.timestamp = {};
    }
};

// ─── Session Helpers ────────────────────────────────────────────────────────────

/**
 * Ghi thời điểm hết hạn phiên vào localStorage khi login thành công.
 * Gọi hàm này ngay sau saveSession() trong auth.js.
 * Đảm bảo Client biết chính xác khi nào Token Server hết hạn (6h).
 */
function markSessionStart() {
    const expiresAt = Date.now() + SESSION_TTL_MS;
    localStorage.setItem(SESSION_EXPIRES_KEY, String(expiresAt));
    console.info('[State] Phiên mới: hết hạn lúc', new Date(expiresAt).toLocaleTimeString('vi-VN'));
}

/**
 * Trả về true nếu phiên đã vượt quá absolute TTL (6h kể từ lúc login).
 * Độc lập với inactivity — đảm bảo Client đồng bộ với Server CacheService.
 */
function isSessionExpiredAbsolute() {
    const expiresAt = parseInt(localStorage.getItem(SESSION_EXPIRES_KEY) || '0', 10);
    if (!expiresAt) return false; // Chưa có dữ liệu → để Server kiểm tra
    return Date.now() > expiresAt;
}

// ─── Auto-Logout Security ───────────────────────────────────────────────────────

/**
 * Sprint 3: Kiểm tra 2 điều kiện logout đồng thời:
 *   1. Absolute expiry (6h) — đồng bộ với server token TTL
 *   2. Inactivity timeout (60 phút không thao tác)
 * Chạy mỗi 5 phút qua setInterval.
 */
function checkInactivity() {
    if (!AppState.user) return;

    // Điều kiện 1: Absolute expiry (Client ↔ Server sync)
    if (isSessionExpiredAbsolute()) {
        if (typeof logout === 'function') logout();
        if (typeof showAlert === 'function') {
            showAlert('Phiên hết hạn', 'Phiên làm việc đã hết hạn (6 tiếng). Vui lòng đăng nhập lại.', 'warning');
        }
        return;
    }

    // Điều kiện 2: Inactivity timeout
    const idleMs = Date.now() - AppState.lastActive;
    if (idleMs > INACTIVITY_LIMIT_MS) {
        if (typeof logout === 'function') logout();
        if (typeof showAlert === 'function') {
            showAlert('Hết phiên làm việc', 'Phiên làm việc đã kết thúc do không hoạt động trong 60 phút.', 'warning');
        }
    }
}

$(document).ready(() => {
    // Reset inactivity timer khi có tương tác
    $(document).on('click keydown scroll mousedown touchstart', () => {
        AppState.lastActive = Date.now();
    });

    // Kiểm tra mỗi 5 phút
    setInterval(checkInactivity, 5 * 60 * 1000);

    // Sprint 3: Kiểm tra absolute expiry ngay khi load trang
    // (ngăn dùng phiên cũ từ tab trước đã hết hạn server-side)
    if (AppState.user && isSessionExpiredAbsolute()) {
        console.warn('[State] Token đã hết hạn (absolute TTL 6h). Logout...');
        if (typeof logout === 'function') {
            setTimeout(logout, 500); // Delay nhỏ để DOM kịp ready
        }
    }
});
