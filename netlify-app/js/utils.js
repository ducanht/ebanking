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
    if (!val || val === 'N/A' || val === '--') return 'N/A';
    
    let dateObj = new Date(val);
    
    // Nếu parse thất bại (NaN), thử parse định dạng DD/MM/YYYY thủ công
    if (isNaN(dateObj.getTime()) && typeof val === 'string') {
        const parts = val.split(/[\/\-]/);
        if (parts.length === 3) {
            // Giả định DD/MM/YYYY hoặc YYYY/MM/DD
            if (parts[0].length === 4) { // YYYY/MM/DD
                dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
            } else if (parts[2].length === 4) { // DD/MM/YYYY
                dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
            }
        }
    }

    if (isNaN(dateObj.getTime())) return val;

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

/**
 * Utils — Namespace cho các hàm tiện ích UI dùng chung
 */
const Utils = {
    /**
     * Quản lý trạng thái loading của một nút bấm
     * Chống: người dùng nhấn nhiều lần (double-submit)
     * @param {jQuery} $btn       - Đối tượng nút jQuery
     * @param {boolean} isLoading - true = bật loading, false = khôi phục
     * @param {string} loadingText - Text hiển thị khi đang loading
     */
    buttonLoading: function($btn, isLoading, loadingText) {
        if (isLoading) {
            // Lưu lại nội dung gốc để khôi phục
            $btn.data('original-html', $btn.html());
            $btn.prop('disabled', true)
                .html(`<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> ${loadingText}`);
        } else {
            // Khôi phục nội dung gốc
            const original = $btn.data('original-html') || loadingText;
            $btn.prop('disabled', false).html(original);
        }
    }
};

/**
 * Xuất Excel đầy đủ dữ liệu từ DataTables hiện tại và raw data
 * Bỏ qua ảnh và các link URL không cần thiết
 */
function utils_exportFullExcel(dtInstance, fullDataArray, filePrefix) {
    if (typeof XLSX === 'undefined') {
        Swal.fire('Lỗi', 'Thư viện xuất Excel chưa được tải. Vui lòng tải lại trang.', 'error');
        return;
    }

    try {
        Swal.fire({
            title: 'Đang tạo Excel...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        // Lấy tất cả các dòng ĐANG ĐƯỢC LỌC (đã filter, search, không phân biệt trang)
        const nodes = dtInstance.rows({ search: 'applied' }).nodes();
        const filteredIds = Array.from(nodes).map(row => $(row).attr('data-id'));

        // Cột cần bỏ qua
        const excludeKeys = [
            'URL CCCD Trước', 'URL CCCD Sau', 'URL GP DKKD', 'URL QR', 
            'URL Ảnh Thực Hiện', 'URL Hồ Sơ Scan', 'ID', 'Mã GD'
        ];

        const exportData = [];
        
        fullDataArray.forEach(d => {
            const id = (d.ID || d['Mã GD'] || '').toString().replace(/^[']*/, '');
            if (filteredIds.includes(id)) {
                const cleanObj = {};
                for (let k in d) {
                    if (excludeKeys.includes(k)) continue;
                    if (k.toLowerCase().includes('url')) continue; // Bỏ qua bất kỳ cột nào chứa 'url'
                    
                    let val = d[k];
                    // Chỉnh sửa hiển thị value
                    if (val && typeof val === 'string' && val.match && val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                        val = utils_formatVN(val, 'datetime');
                    } else if (k === 'Số TK' || k === 'Số điện thoại' || k === 'Số CCCD' || k === 'Số DKKD' || k === 'Số tài khoản') {
                        val = (val || '').toString().replace(/^[']*/, '');
                    }
                    cleanObj[k] = val;
                }
                exportData.push(cleanObj);
            }
        });

        if (exportData.length === 0) {
            Swal.fire('Thông báo', 'Không có dữ liệu để xuất hoặc dữ liệu đã bị ẩn.', 'info');
            return;
        }

        const ws = XLSX.utils.json_to_sheet(exportData);
        // Style Header in đậm
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_col(C) + "1";
            if (!ws[address]) continue;
            ws[address].s = { font: { bold: true } };
        }

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");
        
        const fn = filePrefix + new Date().toISOString().slice(0, 10) + ".xlsx";
        XLSX.writeFile(wb, fn);

        Swal.close();
    } catch (e) {
        console.error('Export Excel failed:', e);
        Swal.fire('Lỗi', 'Có lỗi khi xuất Excel: ' + e.message, 'error');
    }
}

/**
 * _parseStats — Dùng chung cho dashboard.js và customer.js
 * Trích xuất object thống kê từ response GAS API.
 * GAS cũ trả về statsStr (JSON string), GAS mới trả về stats (object trực tiếp).
 * Đặt ở utils.js để load trước, không phụ thuộc thứ tự script.
 * @param {object} res - Response object từ GAS API
 * @returns {object|null} - Stats object hoặc null nếu không có
 */
function _parseStats(res) {
    if (!res) return null;
    let s = null;
    if (res.statsStr) {
        try { s = JSON.parse(res.statsStr); } catch(e) { console.error('Parse statsStr error', e); }
    }
    if (!s) s = res.stats || null;
    return s;
}

// ================================================================
// SMART SEARCH — Tìm kiếm thông minh đa trường, không dấu tiếng Việt
// ================================================================

/**
 * Chuẩn hóa chuỗi: bỏ dấu, lowercase, strip khoảng trắng thừa
 * "Nguyễn Văn Anh" → "nguyen van anh"
 */
function utils_normalizeVN(str) {
    if (!str) return '';
    return String(str)
        .normalize('NFD')                         // Tách ký tự + dấu thành 2 codepoint
        .replace(/[\u0300-\u036f]/g, '')          // Xóa các dấu (accent marks)
        .replace(/đ/g, 'd').replace(/Đ/g, 'd')   // Riêng đ/Đ không tách được bằng NFD
        .toLowerCase()
        .trim();
}

/**
 * Tạo chuỗi tìm kiếm tổng hợp từ 1 object bản ghi khách hàng.
 * Gộp: Tên KH + Tên HKD + SĐT + CCCD + DKKD + Số TK (+ Tên cán bộ nếu có)
 * → chuẩn hóa không dấu, lowercase
 */
function utils_buildSearchIndex(d) {
    const parts = [
        d['Tên khách hàng']      || '',
        d['Tên hộ kinh doanh']   || '',
        d['Số điện thoại']       || '',
        d['Số CCCD']             || '',
        d['Số DKKD']             || '',
        d['Số TK']               || d['Số tài khoản'] || '',
        d['Tên cán bộ']          || '',  // Cho Admin view
    ];
    return utils_normalizeVN(parts.join(' ').replace(/\s+/g, ' '));
}

/**
 * Đăng ký DataTables custom search plugin.
 * ✅ Chiến lược: Đọc data-search attribute từ nTr DOM — đáng tin cậy 100%,
 *    không phụ thuộc vào thứ tự sort/paging của DataTables.
 *
 * @param {string}   tableId      - ID bảng HTML (không có #)
 * @param {Array}    rawDataArray - (Không dùng nữa, giữ signature backward compat)
 * @param {Function} getRowId     - (Không dùng nữa, giữ signature backward compat)
 */
function utils_registerSmartSearch(tableId, rawDataArray, getRowId) {
    // Loại bỏ filter cũ của bảng này (tránh duplicate khi reload data)
    $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(
        fn => fn._smartSearchTable !== tableId
    );

    const filterFn = function(settings, data, dataIndex) {
        if (settings.nTable.id !== tableId) return true;

        // Lấy query từ DataTable search state hoặc custom property
        const query = (settings._customSmartSearchQuery !== undefined ? settings._customSmartSearchQuery : (settings.oPreviousSearch && settings.oPreviousSearch.sSearch || '')).trim();
        if (!query) return true;

        const terms = utils_normalizeVN(query).split(/\s+/).filter(Boolean);
        if (!terms.length) return true;

        // ✅ Đọc data-search attribute từ DOM row (nTr)
        const nTr = settings.aoData[dataIndex] && settings.aoData[dataIndex].nTr;
        if (nTr) {
            const searchStr = nTr.getAttribute('data-search') || '';
            if (searchStr) {
                return terms.every(t => searchStr.includes(t));
            }
        }

        // Fallback: tìm trong text cells (nếu nTr chưa render)
        const cellText = utils_normalizeVN(data.join(' '));
        return terms.every(t => cellText.includes(t));
    };

    filterFn._smartSearchTable = tableId;
    $.fn.dataTable.ext.search.push(filterFn);
    // Hook search input được xử lý trong initComplete của từng DataTable
}
