/**
 * UTILS MODULE
 * Các hàm tiện ích dùng chung
 */

function showLoading(msg = 'Đang tải...') {
    $('#global-spinner h5').text(msg);
    $('#global-spinner').css('display', 'flex');
}

function hideLoading() {
    $('#global-spinner').hide();
}

function showView(viewId) {
    $('.view-section').addClass('d-none');
    $(`#${viewId}`).removeClass('d-none');
}

function showAlert(title, text, icon) {
    Swal.fire({ title, text, icon, confirmButtonColor: '#10b981' });
}

function utils_formatVN(val, type = 'date') {
    if (!val) return 'N/A';
    const dateObj = new Date(val);
    if (isNaN(dateObj)) return val;
    const d = ('0' + dateObj.getDate()).slice(-2);
    const m = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const y = dateObj.getFullYear();
    if (type === 'datetime') {
        const hh = ('0' + dateObj.getHours()).slice(-2);
        const mm = ('0' + dateObj.getMinutes()).slice(-2);
        return `${hh}:${mm} ${d}/${m}/${y}`;
    }
    return `${d}/${m}/${y}`;
}

function utils_escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
