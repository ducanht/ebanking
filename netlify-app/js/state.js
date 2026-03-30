/**
 * STATE & CACHE MODULE
 */

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
    user: parsedUser,
    VERSION: "2.1.3-STABLE",
    apiBase: "",
    lastActive: Date.now()
};

const AppCache = {
    data: {},
    timestamp: {},
    TTL: 300000, // 5 phút
    isFresh(key) {
        if (!this.timestamp[key]) return false;
        return (Date.now() - this.timestamp[key]) < this.TTL;
    },
    set(key, val) {
        this.data[key] = val;
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
        this.data = {};
        this.timestamp = {};
    }
};

/**
 * AUTO-LOGOUT SECURITY
 */
const INACTIVITY_LIMIT = 60 * 60 * 1000; // 60 minutes
function checkInactivity() {
    if (AppState.user && (Date.now() - AppState.lastActive > INACTIVITY_LIMIT)) {
        logout();
        showAlert('Hết phiên làm việc', 'Phiên làm việc đã kết thúc do bạn không hoạt động trong 60 phút.', 'warning');
    }
}

$(document).ready(() => {
    $(document).on('click keydown scroll mousedown touchstart', () => AppState.lastActive = Date.now());
    setInterval(checkInactivity, 5 * 60 * 1000);
});
