/**
 * STAFF CUSTOMER LOGIC
 * Version: 2.3.0 — Sprint 2 (Header Mapping, XSS Fix)
 */
console.log("DEBUG: customer.js loading...");

/**
 * Sprint 2 – Fix XSS: Escape HTML trước khi chèn vào innerHTML.
 * Dùng cho mọi giá trị từ server trước khi gọn vào .html() của jQuery.
 */
function escHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// EXPORTS TO WINDOW (Define early to avoid ReferenceError if script fails later)
window.loadStaffMyCustomersView = function() {
    console.log("NAV: Switching to My Customers view...");
    if (typeof showView === 'function') {
        showView('view-my-customers');
    } else {
        console.error("CRITICAL: showView is not defined!");
        $('.view-section').addClass('d-none');
        $('#view-my-customers').removeClass('d-none');
    }
    
    if (typeof updateBottomNavActive === 'function') {
        updateBottomNavActive('navMyCustomers');
    }
    initMyCustomersList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
window.openEditCustomerModal = function(id) { openEditCustomerModal(id); };
window.previewNetlifyEditImage = function(input, previewId) { previewNetlifyEditImage(input, previewId); };

async function initMyCustomersList() {
    console.log("DEBUG: initMyCustomersList called");
    if (!AppState.user) return;

    const cached = AppCache.get('myCustomers');
    if (cached) {
        renderMyCustomersTable(cached.data);
        renderStaffDashboardLocal(cached.data || []);
        const cachedAdmin = AppCache.get('adminDashboard');
        if (cachedAdmin) {
            updateStaffRankings(cachedAdmin, AppState.user.email);
        } else {
            runAPI('api_getAdminDashboardData', { email: AppState.user.email }, (adminRes) => {
                if (adminRes.status === 'success') {
                    const s = _parseStats(adminRes);
                    AppCache.set('adminDashboard', s);
                    updateStaffRankings(s, AppState.user.email);
                }
            }, null, 'NONE');
        }
        return;
    }

    $('#tbMyCustomersBody').html('<tr><td colspan="7" class="text-center py-4"><span class="spinner-border text-primary"></span><br>Đang đồng bộ...</td></tr>');

    runAPI('api_getmycustomers', { email: AppState.user.email }, (res) => {
        if (res.status === 'success') {
            AppCache.set('myCustomers', res);
            renderMyCustomersTable(res.data || []);
            renderStaffDashboardLocal(res.data || []);

            const cachedAdmin = AppCache.get('adminDashboard');
            if (cachedAdmin) {
                updateStaffRankings(cachedAdmin, AppState.user.email);
            } else {
                runAPI('api_getAdminDashboardData', { email: AppState.user.email }, (adminRes) => {
                    if (adminRes.status === 'success') {
                        const s = _parseStats(adminRes);
                        AppCache.set('adminDashboard', s);
                        updateStaffRankings(s, AppState.user.email);
                    }
                }, null, 'NONE');
            }
        } else {
            // Sprint 2 Fix XSS: escape message trước khi chèn vào HTML
            $('#tbMyCustomersBody').html(`<tr><td colspan="7" class="text-center text-danger py-4">Lỗi: ${escHtml(res.message)}</td></tr>`);
        }
    }, null, 'NONE');
}

function renderStaffDashboardLocal(data) {
    let caNhan = 0, hkd = 0, total = 0;
    let activated = 0, inactive = 0;
    let thanhVien = 0, ngoaiThanhVien = 0;
    let qrCount = 0, loaCount = 0;
    let timeline = {};

    const trueVals = ['true', 'có', 'x', '1', 'yes', 'đã cấp'];

    data.forEach(d => {
        total++;
        if (d['Loại hình dịch vụ'] === 'Cá nhân') caNhan++;
        else if (d['Loại hình dịch vụ'] === 'Hộ kinh doanh') hkd++;

        const status = d['Trạng thái'] || '';
        if (status === 'Đã kích hoạt') activated++;
        else inactive++;

        const dt = d['Đối tượng'] || d['doi_tuong'] || 'Ngoài thành viên';
        if (dt === 'Thành viên') thanhVien++;
        else ngoaiThanhVien++;

        // Đếm QR và Loa
        const qrVal  = String(d['Cung cấp Mã QR'] || d['Có QR'] || d['co_qr'] || '').trim().toLowerCase();
        const loaVal = String(d['Cung cấp Loa']   || d['Có Loa'] || d['co_loa'] || '').trim().toLowerCase();
        if (trueVals.includes(qrVal)) qrCount++;
        if (trueVals.includes(loaVal)) loaCount++;

        let rawDate = new Date(d["Thời điểm nhập"]);
        if (!isNaN(rawDate)) {
            let mm = String(rawDate.getMonth() + 1).padStart(2, "0");
            let dd = String(rawDate.getDate()).padStart(2, "0");
            let strDate = `${dd}/${mm}`;
            timeline[strDate] = (timeline[strDate] || 0) + 1;
        }
    });

    $('#staffDash-total').text(total);
    $('#staffDash-canhan').text(caNhan);
    $('#staffDash-hkd').text(hkd);
    $('#staffDash-activated').text(activated);
    $('#staffDash-inactive').text(inactive);
    $('#staffDash-thanhvien').text(thanhVien);
    $('#staffDash-ngoaithanhvien').text(ngoaiThanhVien);
    $('#staffDash-qr').text(qrCount);
    $('#staffDash-loa').text(loaCount);

    // Update progress bars
    const t = total || 1;
    const cnPct = Math.round(caNhan / t * 100);
    const hkdPct = 100 - cnPct;
    $('#staffDash-prog-canhan').css('width', cnPct + '%').attr('aria-valuenow', cnPct);
    $('#staffDash-prog-hkd').css('width', hkdPct + '%').attr('aria-valuenow', hkdPct);

    const tvPct = Math.round(thanhVien / t * 100);
    $('#staffDash-prog-thanhvien').css('width', tvPct + '%').attr('aria-valuenow', tvPct);
    $('#staffDash-prog-ngoai').css('width', (100 - tvPct) + '%').attr('aria-valuenow', 100 - tvPct);

    renderStaffLineChart(timeline);
}

function updateStaffRankings(adminData, email) {
    if (!adminData || !adminData.allStaffs) {
        $('#staffDash-rank').html('<small class="text-muted">Chưa có dữ liệu</small>');
        return;
    }

    let staffs = adminData.allStaffs;
    let rankIndex = staffs.findIndex(s => s.email === email);
    let me = staffs.find(s => s.email === email);

    if (rankIndex >= 0 && me && (me.total > 0 || staffs.length > 0)) {
        let rank = rankIndex + 1;
        let rankHtml = `#${rank} <small class="text-muted" style="font-size:0.6em">/ ${staffs.length}</small>`;

        if (rank === 1) {
            rankHtml = `<i class='bx bxs-trophy text-warning'></i> ${rankHtml}`;
        } else if (rank === 2) {
            rankHtml = `<i class='bx bxs-medal text-secondary'></i> ${rankHtml}`;
        } else if (rank === 3) {
            rankHtml = `<i class='bx bxs-medal' style="color: #cd7f32;"></i> ${rankHtml}`;
        }

        $('#staffDash-rank').html(rankHtml);

        if (rank > 1) {
            const aboveMe = staffs[rankIndex - 1];
            const diff = (aboveMe.total || 0) - (me.total || 0);
            $('#staffDash-aboveRankInfo').html(`
                <div class="mt-1 p-1 px-2 rounded-pill bg-info-subtle text-info border border-info-subtle" style="font-size: 0.85rem;">
                    <i class='bx bx-up-arrow-alt'></i> <b>${aboveMe.name || 'Cán bộ'}</b> (${aboveMe.total}): cần <b>+${diff}</b>
                </div>
            `);
        } else {
            $('#staffDash-aboveRankInfo').html(`
                <div class="mt-1 p-1 px-2 rounded-pill bg-success-subtle text-success border border-success-subtle" style="font-size: 0.85rem;">
                    <i class='bx bxs-crown'></i> Đang dẫn đầu hệ thống!
                </div>
            `);
        }
    } else {
        $('#staffDash-rank').html('<small class="text-muted" style="font-size:0.6em">Chưa xếp hạng</small>');
        $('#staffDash-aboveRankInfo').html(`
            <div class="mt-1 p-1 px-2 rounded-pill bg-light text-secondary border" style="font-size: 0.85rem;">
                Hãy mở hồ sơ đầu tiên!
            </div>
        `);
    }

    if (staffs.length > 0 && staffs[0].total > 0) {
        let top1 = staffs[0];
        $('#staffDash-top1Name').text(top1.name || top1.email);
        $('#staffDash-top1Count').text(`${top1.total || 0} hồ sơ`);
    } else {
        $('#staffDash-top1Name').text('--');
        $('#staffDash-top1Count').text('0 hồ sơ');
    }
}

let staffChartInstance = null;
function renderStaffLineChart(timeline) {
    const ctx = document.getElementById('chartStaffMonthly');
    if (!ctx) return;

    let labels = [];
    let counts = [];
    let d = new Date();
    for (let i = 29; i >= 0; i--) {
        let tmp = new Date(d);
        tmp.setDate(tmp.getDate() - i);
        let sDate = `${String(tmp.getDate()).padStart(2, "0")}/${String(tmp.getMonth() + 1).padStart(2, "0")}`;
        labels.push(sDate);
        counts.push(timeline[sDate] || 0);
    }

    if (staffChartInstance) staffChartInstance.destroy();

    staffChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Hồ sơ mở',
                data: counts,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } }
            }
        }
    });
}

function renderMyCustomersTable(data) {
    // Lưu raw data để smart search và export dùng được
    window._myCustomers = data;

    const html = data.sort((a, b) => (new Date(b['Thời điểm nhập']) || 0) - (new Date(a['Thời điểm nhập']) || 0)).map(d => {
        const rowId = (d.ID || d['Mã GD'] || '').toString().replace(/^'/, '');
        const rawStatus = (d['Trạng thái'] || d['trang_thai'] || '').toString().trim();
        const isActivated = rawStatus.toLowerCase().includes('đã kích hoạt') || rawStatus.toLowerCase().includes('activated');
        const statusDot = `<span class="status-dot ${isActivated ? 'active' : 'inactive'}" title="${rawStatus || 'Chưa kích hoạt'}"></span>`;

        // Badge QR và Loa — tên cột thực trong Sheet: 'Cung cấp Mã QR' và 'Cung cấp Loa'
        const trueVals = ['true', 'có', 'x', '1', 'yes', 'đã cấp'];
        const hasQR  = trueVals.includes(String(d['Cung cấp Mã QR'] || d['Có QR'] || d['co_qr'] || '').trim().toLowerCase());
        const hasLoa = trueVals.includes(String(d['Cung cấp Loa']   || d['Có Loa'] || d['co_loa'] || '').trim().toLowerCase());
        const qrBadge  = hasQR  ? `<span class="badge ms-1" style="background:rgba(16,185,129,0.12);color:#10b981;border:1px solid #10b981" title="Đã cấp QR"><i class="bx bx-qr-alt"></i></span>` : '';
        const loaBadge = hasLoa ? `<span class="badge ms-1" style="background:rgba(139,92,246,0.12);color:#8b5cf6;border:1px solid #8b5cf6" title="Đã cấp Loa"><i class="bx bx-volume-full"></i></span>` : '';

        const searchStr = utils_buildSearchIndex(d);
        return `
            <tr data-id="${rowId}" data-search="${searchStr}" class="clickable-row cursor-pointer">
                <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
                <td class="fw-bold text-dark">
                    ${utils_escapeHTML(d['Tên khách hàng'])}
                    ${d['Loại hình dịch vụ'] === 'Hộ kinh doanh' && d['Tên hộ kinh doanh']
                        ? `<br><small class="text-primary fw-semibold" title="Tên HKD"><i class="bx bx-store-alt"></i> ${utils_escapeHTML(d['Tên hộ kinh doanh'])}</small>`
                        : ''}
                    ${qrBadge}${loaBadge}
                </td>
                <td class="text-secondary"><small>${utils_escapeHTML(d['Số TK'] || d['Số tài khoản'] || '')}</small></td>
                <td>${statusDot} <span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'])}</span></td>
                <td><span class="badge ${d['Đối tượng'] === 'Thành viên' || d['doi_tuong'] === 'Thành viên' ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-secondary-subtle text-secondary border border-secondary-subtle'}">${utils_escapeHTML(d['Đối tượng'] || d['doi_tuong'] || 'Ngoài thành viên')}</span></td>
                <td><small>${utils_escapeHTML(d['Số điện thoại'])}</small></td>
                <td class="text-end" style="white-space: nowrap;">
                    <button class="btn btn-sm btn-outline-primary shadow-sm btn-detail" title="Xem chi tiết">
                        <i class="bx bx-search-alt"></i>
                    </button>
                    ${d['URL Hồ Sơ Scan']
                ? `<a href="${d['URL Hồ Sơ Scan']}" target="_blank" class="btn btn-sm btn-outline-success shadow-sm" title="Xem bản Scan (PDF)"><i class="bx bx-file-find"></i></a>`
                : `<button class="btn btn-sm btn-outline-warning shadow-sm btn-upload-scan" title="Tải lên bản Scan (PDF)" data-id="${rowId}" data-name="${utils_escapeHTML(d['Tên khách hàng'])}">
                            <i class="bx bx-upload"></i>
                           </button>`
            }
                </td>
            </tr>
        `;
    }).join('');


    $('#tbMyCustomersBody').html(html || '<tr><td colspan="7" class="text-center text-muted py-4">Chưa có hồ sơ nào.</td></tr>');

    try {
        if ($.fn.DataTable.isDataTable('#tblMyCustomers')) {
            $('#tblMyCustomers').DataTable().destroy();
        }

        if (data.length > 0) {
            console.log("DEBUG: Initializing DataTable with", data.length, "records");
            const dtStaff = $('#tblMyCustomers').DataTable({
                responsive: true,
                order: [[0, 'desc']],
                lengthMenu: [10, 25, 50, 100],
                pageLength: 25,
                dom: "<'row mb-2'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4 text-center'B><'col-sm-12 col-md-4'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                buttons: [
                    {
                        text: '<i class="bx bxs-file-export"></i> Xuất Excel',
                        className: 'btn btn-sm btn-success shadow-sm',
                        action: function(e, dt, node, config) {
                            utils_exportFullExcel(dt, window._myCustomers || [], 'HoSo_CaNhan_YenTho_');
                        }
                    }
                ],
                language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json" },
                search: { caseInsensitive: false, smart: false, regex: false },
                columnDefs: [
                    { targets: [6], orderable: false, searchable: false }
                ],
                initComplete: function() {
                    const dtApi = this.api();
                    const $searchInput = $('#tblMyCustomers_wrapper input[type="search"]');
                    $searchInput.off('.DT');
                    $searchInput.on('keyup input', function() {
                        dtApi.settings()[0]._customSmartSearchQuery = this.value;
                        dtApi.draw();
                    });
                }
            });

            utils_registerSmartSearch(
                'tblMyCustomers',
                window._myCustomers,
                d => String(d['ID'] || d['Mã GD'] || '').replace(/^'*/, '').trim()
            );
        }
    } catch (dtErr) {
        console.error("CRITICAL ERROR: DataTable initialization failed:", dtErr);
    }
}

function openEditCustomerModal(id) {
    try {
        if (!id) return;

        const rowIdStr = String(id).trim().replace(/^[']*/, '');
        let row = null;
        let sourceData = [];

        if (AppState.user && AppState.user.role === 'Admin') {
            sourceData = window._adminAllData || [];
        } else {
            const cache = AppCache.get('myCustomers');
            sourceData = (cache && Array.isArray(cache.data)) ? cache.data : [];
        }

        // Tìm kiếm chính xác hơn
        row = sourceData.find(d => {
            const currentId = String(d['ID'] || d['Mã GD'] || '').trim().replace(/^[']*/, '');
            return currentId === rowIdStr;
        });

        if (!row) {
            console.error("DEBUG: Không tìm thấy ID:", rowIdStr, "trong", sourceData.length, "bản ghi.");
            showAlert('Lỗi', 'Không tìm thấy hồ sơ. Vui lòng tải lại trang.', 'error');
            return;
        }

        // Khởi tạo flatpickr cho TẤT CẢ trường ngày trong form edit
        // dateFormat: 'Y-m-d' → giá trị lưu trong input là YYYY-MM-DD (chuẩn ISO, gửi đúng lên backend)
        // altInput + altFormat: 'd/m/Y' → hiển thị DD/MM/YYYY thân thiện với người dùng VN
        if (typeof flatpickr !== 'undefined') {
            const fpEls = document.querySelectorAll('.js-datepicker-edit');
            fpEls.forEach(fpEl => {
                if (!fpEl._flatpickr) {
                    flatpickr(fpEl, {
                        dateFormat : 'Y-m-d',   // Giá trị thực (YYYY-MM-DD) — gửi lên backend
                        altInput   : true,       // Hiển thị input phụ cho người dùng
                        altFormat  : 'd/m/Y',   // Format VN (DD/MM/YYYY) — chỉ dùng để hiển thị
                        allowInput : false       // Chỉ cho phép chọn từ lịch, tránh nhập sai format
                    });
                }
            });
        }

        $('#edit_id').val(id);
        $('#edit_ten_kh').val(row['Tên khách hàng'] || '');
        $('#edit_sdt').val((row['Số điện thoại'] || '').toString().replace(/^'/, ''));

        const loaiHinh = row['Loại hình dịch vụ'] || 'Cá nhân';
        const cccdVal = (row['Số CCCD'] || '').toString().replace(/^'/, '');
        const dkkdVal = (row['Số DKKD'] || '').toString().replace(/^'/, '');

        $('#edit_cccd').val(cccdVal);
        $('#edit_dkkd').val(dkkdVal);

        // BỔ SUNG: Nơi cấp CCCD và Email KH
        $('#edit_noi_cap_cccd').val(row['Nơi cấp CCCD'] || '');
        $('#edit_email_kh').val(row['Email KH'] || '');

        $('#edit_dia_chi').val(row['Địa chỉ'] || '');
        $('#edit_dia_chi_kd').val(row['Địa chỉ KD'] || '');

        // ─── Helper nội bộ: Điền ngày vào field flatpickr hoặc input thường ───
        // Luôn gán theo chuẩn YYYY-MM-DD (flatpickr dateFormat: 'Y-m-d')
        // altInput sẽ tự hiển thị dạng DD/MM/YYYY cho người dùng
        const _setEditDate = (inputId, rawDateVal) => {
            const el = document.getElementById(inputId);
            if (!el) return;
            if (!rawDateVal) {
                if (el._flatpickr) el._flatpickr.clear();
                else el.value = '';
                return;
            }
            const d = new Date(rawDateVal);
            if (!isNaN(d)) {
                if (el._flatpickr) {
                    el._flatpickr.setDate(d, false); // false = không trigger onChange
                } else {
                    // Fallback: gán ISO string YYYY-MM-DD (không gán DD/MM/YYYY)
                    const iso = d.getFullYear() + '-'
                        + String(d.getMonth() + 1).padStart(2, '0') + '-'
                        + String(d.getDate()).padStart(2, '0');
                    el.value = iso;
                }
            } else {
                // Chuỗi không parse được: giữ nguyên (để backend tự xử lý)
                if (el._flatpickr) el._flatpickr.clear();
                else el.value = rawDateVal;
            }
        };

        _setEditDate('edit_ngay_cap_cccd', row['Ngày cấp CCCD']);
        _setEditDate('edit_ngay_het_han',  row['Ngày hết hạn']);
        _setEditDate('edit_ngay_sinh',     row['Ngày sinh']);
        _setEditDate('edit_ngay_mo',       row['Ngày mở TK'] || row['Thời điểm nhập']);

        $('#edit_nganh_nghe').val(row['Ngành nghề KD'] || '');

        if (loaiHinh === 'Hộ kinh doanh') {
            $('#edit_dkkd_group').show();
            $('#edit_dia_chi_kd_group').show();
            $('#edit_ten_hkd_group').show();
            // Populate tên HKD
            $('#edit_ten_hkd').val(row['Tên hộ kinh doanh'] || '');
        } else {
            $('#edit_dkkd_group').hide();
            $('#edit_dia_chi_kd_group').hide();
            $('#edit_ten_hkd_group').hide();
            $('#edit_ten_hkd').val('');
        }

        let stk = (row['Số TK'] || row['Số tài khoản'] || '').toString().replace(/^'/, '');
        if (stk.length > 6 && stk.startsWith('380020')) stk = stk.substring(6);
        $('#edit_so_tk').val(stk);

        $('#edit_ten_dang_nhap').val((row['Tên đăng nhập'] || '').toString().replace(/^'/, ''));
        $('#edit_mat_khau').val(row['Mật khẩu'] || '');

        const status = row['Trạng thái'] || '';
        $('#edit_is_activated').prop('checked', status === 'Đã kích hoạt');

        // Đối tượng: điền vào select (không còn dùng checkbox is_member)
        // → Được xử lý bên dưới qua #edit_doi_tuong

        // QR và Loa (đọc đúng tên cột trong Sheet)
        const trueValsEdit = ['true', 'có', 'x', '1', 'yes', 'đã cấp'];
        const qrRaw  = String(row['Cung cấp Mã QR'] || row['Có QR'] || row['co_qr'] || '').trim().toLowerCase();
        const loaRaw = String(row['Cung cấp Loa']   || row['Có Loa'] || row['co_loa'] || '').trim().toLowerCase();
        $('#edit_co_qr').prop('checked', trueValsEdit.includes(qrRaw));
        $('#edit_co_loa').prop('checked', trueValsEdit.includes(loaRaw));

        // Đối tượng: điền vào select (không còn dùng checkbox edit_is_member)
        const doiTuongVal = row['Đối tượng'] || row['doi_tuong'] || 'Ngoài thành viên';
        $('#edit_doi_tuong').val(doiTuongVal);

        // P1-FIX: Tiêu đề modal đúng nghiệp vụ
        const statusBadge = (status === 'Đã kích hoạt')
            ? `<span class="badge bg-success small ms-2"><i class="bx bxs-check-circle"></i> Đã kích hoạt</span>`
            : `<span class="badge bg-warning text-dark small ms-2"><i class="bx bx-time"></i> Chờ kích hoạt</span>`;

        if (AppState.user && AppState.user.role === 'Admin') {
            $('#btnSaveEdit').hide();
            $('#frmEditCustomer input').prop('readonly', true);
            $('#frmEditCustomer select, #frmEditCustomer input[type="checkbox"]').prop('disabled', true);
            $('#modalEditCustomer .modal-title').html(
                `<i class='bx bx-info-circle text-white'></i> Chi Tiết Hồ Sơ Mở Tài Khoản ${statusBadge}`
            );
        } else {
            $('#btnSaveEdit').show();
            $('#frmEditCustomer input').prop('readonly', false);
            $('#frmEditCustomer select, #frmEditCustomer input[type="checkbox"]').prop('disabled', false);
            $('#modalEditCustomer .modal-title').html(
                `<i class='bx bxs-edit-alt text-white'></i> Chỉnh Sửa Hồ Sơ Mở Tài Khoản ${statusBadge}`
            );
        }

        const infoHtml = `<div class="col-12 mb-2">
                            <div class="p-2 bg-white rounded border d-flex gap-2 shadow-sm align-items-center">
                                <span class="badge bg-primary">${utils_escapeHTML(loaiHinh)}</span>
                                <span>CCCD: <b>${utils_escapeHTML(cccdVal)}</b></span>
                                ${status === 'Đã kích hoạt' ? '<span class="ms-auto badge rounded-pill bg-success-subtle text-success border border-success-subtle"><i class="bx bxs-check-circle"></i> Đã kích hoạt</span>' : ''}
                            </div>
                         </div>`;

        const getImgHtml = (url, label) => {
            if (!url || typeof url !== 'string' || url.trim() === '') return '';
            let safeUrl = url.trim();
            if (safeUrl.indexOf('drive.google.com') > -1) {
                let fileId = "";
                if (safeUrl.indexOf('/d/') > -1) fileId = safeUrl.split('/d/')[1].split('/')[0];
                else if (safeUrl.indexOf('id=') > -1) fileId = safeUrl.split('id=')[1].split('&')[0];
                if (fileId) safeUrl = 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w800';
            }

            return `<div class="col-4">
                        <a href="${url}" target="_blank" title="Xem ảnh gốc" class="text-decoration-none">
                            <div class="img-detail-box position-relative overflow-hidden rounded-3 border shadow-sm">
                                <img src="${safeUrl}" class="img-detail-inner w-100 h-100" style="object-fit: cover; min-height: 100px;" alt="${label}" onerror="this.src='https://placehold.co/400x300?text=Ảnh+lỗi'">
                                <div class="img-overlay d-flex align-items-center justify-content-center">
                                    <i class='bx bx-zoom-in text-white fs-2'></i>
                                </div>
                            </div>
                            <small class="d-block text-center mt-1 text-secondary fw-medium">${label}</small>
                        </a>
                    </div>`;
        };

        // ===== KHU VỰC ẢNH: Render preview hiện có + input upload mới =====
        // Logic:
        //   - Chưa có ảnh: badge đỏ "Thiếu" + khung trống + input file hiện ngay
        //   - Đã có ảnh:   thumbnail to + badge xanh + nút "Thay thế" thu gọn
        //                  (nhấn "Thay thế" mới hiện input file, thumbnail vẫn hiển thị)
        const renderSlot = (fieldKey, label, existingUrl, skipIfCaNhan) => {
            if (skipIfCaNhan && loaiHinh === 'Cá nhân') return '';

            // Tạo thumbnail URL từ Drive link
            let thumbUrl = '';
            if (existingUrl) {
                const u = existingUrl.trim();
                if (u.indexOf('/d/') > -1) {
                    const fid = u.split('/d/')[1].split('/')[0];
                    thumbUrl = `https://drive.google.com/thumbnail?id=${fid}&sz=w400`;
                } else if (u.indexOf('id=') > -1) {
                    const fid = u.split('id=')[1].split('&')[0];
                    thumbUrl = `https://drive.google.com/thumbnail?id=${fid}&sz=w400`;
                } else if (u.startsWith('http')) {
                    thumbUrl = u;
                }
            }
            const hasImg = (thumbUrl !== '');

            if (hasImg) {
                // ── CÓ ẢNH: thumbnail chiếm toàn slot, nút "Thay thế" toggle input ──
                return `<div class="col-12 col-sm-6 col-md-4">
                    <div class="p-2 bg-white rounded-3 border h-100 d-flex flex-column">
                        <p class="fw-semibold small mb-1 text-secondary">${label}</p>
                        <span class="badge bg-success mb-2 align-self-start">
                            <i class="bx bx-check-circle me-1"></i>Đã có ảnh
                        </span>
                        <!-- Thumbnail — click để xem full -->
                        <a href="${existingUrl}" target="_blank" class="d-block mb-2">
                            <img src="${thumbUrl}"
                                 class="img-fluid rounded border w-100"
                                 style="max-height:120px;object-fit:cover;cursor:zoom-in"
                                 onerror="this.closest('a').replaceWith('<div class=\'text-muted small p-2 border rounded bg-light\'>Không tải được ảnh</div>')"
                                 alt="${label}">
                        </a>
                        <!-- Nút thay thế: toggle input file -->
                        <button type="button"
                                class="btn btn-outline-secondary btn-sm mt-auto"
                                onclick="this.nextElementSibling.classList.toggle('d-none');this.classList.toggle('active')">
                            <i class="bx bx-refresh me-1"></i>Thay thế ảnh
                        </button>
                        <div class="d-none mt-2">
                            <input type="file" class="form-control form-control-sm"
                                   id="edit_file_${fieldKey}" data-field="${fieldKey}"
                                   accept="image/*"
                                   onchange="previewNetlifyEditImage(this, 'prev_${fieldKey}')">
                            <div id="prev_${fieldKey}" class="mt-1"></div>
                        </div>
                    </div>
                </div>`;
            } else {
                // ── CHƯA CÓ ẢNH: badge đỏ + khung trống + input file hiện ngay ──
                return `<div class="col-12 col-sm-6 col-md-4">
                    <div class="p-2 bg-white rounded-3 border border-danger h-100 d-flex flex-column">
                        <p class="fw-semibold small mb-1 text-secondary">${label}</p>
                        <span class="badge bg-danger mb-2 align-self-start">
                            <i class="bx bx-error-alt me-1"></i>Thiếu ảnh
                        </span>
                        <!-- Khung trống gợi ý chọn ảnh -->
                        <div class="border rounded d-flex flex-column align-items-center justify-content-center bg-light mb-2 flex-grow-1"
                             style="min-height:80px;">
                            <i class="bx bx-image-add text-muted" style="font-size:2rem;opacity:.5"></i>
                            <small class="text-muted mt-1">Chưa có ảnh</small>
                        </div>
                        <!-- Input file hiện ngay -->
                        <input type="file" class="form-control form-control-sm mt-auto"
                               id="edit_file_${fieldKey}" data-field="${fieldKey}"
                               accept="image/*"
                               onchange="previewNetlifyEditImage(this, 'prev_${fieldKey}')">
                        <div id="prev_${fieldKey}" class="mt-1"></div>
                    </div>
                </div>`;
            }
        };

        const slotsHtml =
            renderSlot('img_truoc',    'CCCD Mặt trước',  row['URL CCCD Trước']       || row['URL Ảnh Mặt Trước'] || '', false) +
            renderSlot('img_sau',      'CCCD Mặt sau',    row['URL CCCD Sau']         || row['URL Ảnh Mặt Sau']   || '', false) +
            renderSlot('img_dkkd',     'GP Đăng ký KD',   row['URL GP DKKD']          || row['URL DKKD']           || '', true)  +
            renderSlot('img_qr',       'Mã QR Tài khoản', row['URL QR']               || row['URL Mã QR']          || '', false) +
            renderSlot('img_thuchien', 'Ảnh Thực Hiện GD', row['URL Ảnh Thực Hiện']   || row['URL Thực Hiện']      || '', false);

        $('#edit_images_container').html(`<div class="row g-3">${slotsHtml}</div>`);

        const modalEl = document.getElementById('modalEditCustomer');
        if (!modalEl) {
            console.error("DEBUG: Không tìm thấy element modalEditCustomer");
            return;
        }

        // ─── Bind real-time duplicate check cho modal chỉnh sửa ───
        // Dùng hàm riêng checkDuplicateEdit() luôn kèm excludeId = ID hồ sơ đang sửa
        // để tránh false-positive "trùng với chính mình"
        const editDupFields = ['edit_cccd', 'edit_dkkd', 'edit_sdt', 'edit_so_tk'];
        editDupFields.forEach(fieldId => {
            const el = document.getElementById(fieldId);
            if (el) {
                // Xóa event cũ trước để tránh duplicate binding
                el.removeEventListener('blur', el._dupCheckHandler);
                el._dupCheckHandler = function() {
                    checkDuplicateEdit(this, loaiHinh);
                };
                el.addEventListener('blur', el._dupCheckHandler);
            }
        });

        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    } catch (err) { console.error(err); }
}

// ========================================================
// KIỂM TRA TRÙNG LẶP CHO MODAL CHỈNH SỬA
// (Khác checkDuplicate của registration.js: luôn kèm excludeId)
// ========================================================
/**
 * Kiểm tra trùng real-time trong modal chỉnh sửa.
 * @param {HTMLElement} input - Trường input đang kiểm tra (edit_cccd, edit_sdt, ...)
 * @param {string} loaiHinh  - Loại hình dịch vụ của hồ sơ đang sửa
 */
function checkDuplicateEdit(input, loaiHinh) {
    if (!input || !input.value) {
        $(input).removeClass('is-invalid');
        return;
    }
    const val = input.value.trim();
    if (!val) {
        $(input).removeClass('is-invalid');
        input.setCustomValidity('');
        return;
    }

    // Lấy ID hồ sơ đang sửa để loại trừ khỏi kết quả tìm kiếm
    const excludeId = $('#edit_id').val() || null;

    // Map field ID → tên field backend
    const fieldMap = {
        'edit_cccd'  : 'cccd',
        'edit_dkkd'  : 'dkkd',
        'edit_sdt'   : 'sdt',
        'edit_so_tk' : 'so_tk'
    };
    const fieldName = fieldMap[input.id];
    if (!fieldName) return;

    runAPI('api_validateduplicate', {
        field    : fieldName,
        value    : val,
        loaiHinh : loaiHinh,
        excludeId: excludeId   // ← Điểm khác biệt then chốt
    }, (res) => {
        if (res && res.isDup) {
            input.setCustomValidity(res.msg || 'Giá trị này đã tồn tại!');
            $(input).addClass('is-invalid');
            // Hiện thông báo trong invalid-feedback nếu có
            const $feedback = $(input).siblings('.invalid-feedback');
            if ($feedback.length) $feedback.text(res.msg || 'Giá trị này đã tồn tại!');
        } else {
            input.setCustomValidity('');
            $(input).removeClass('is-invalid');
        }
    }, null, 'NONE');
}

// ========================================================
// Xử LÝ SUBMIT FORM CHỈNH SỪ HỒ SƠ (delegate từ dòng 942)
// ========================================================
async function handleEditCustomer(e) {
    e.preventDefault();
    const id = $('#edit_id').val();
    if (!id) {
        showAlert('Lỗi', 'Không tìm thấy mã hồ sơ để cập nhật.', 'error');
        return;
    }

    const btn = $('#btnSaveEdit');
    const oldHtml = btn.html();
    btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang lưu...');

    const sdtVal = $('#edit_sdt').val().trim();
    if (sdtVal && !/^0\d{9}$/.test(sdtVal)) {
        showAlert('Lỗi', 'Số điện thoại phải bắt đầu bằng 0 và đủ 10 chữ số.', 'warning');
        btn.prop('disabled', false).html(oldHtml);
        return;
    }

    // Helper đọc giá trị ngày từ flatpickr: ưu tiên input gốc (YYYY-MM-DD)
    // Khi flatpickr dùng altInput, $('#id').val() trả về giá trị của altInput (DD/MM/YYYY)
    // Phải đọc từ input gốc (ẩn) thông qua el._flatpickr.input.value
    const _getISODate = (inputId) => {
        const el = document.getElementById(inputId);
        if (!el) return '';
        if (el._flatpickr) return el._flatpickr.input.value || ''; // input gốc luôn là YYYY-MM-DD
        return el.value || '';
    };

    const payload = {
        id            : id,
        email         : AppState.user ? AppState.user.email : '',
        ten_kh        : $('#edit_ten_kh').val().trim().toUpperCase(),
        sdt           : sdtVal,
        cccd          : $('#edit_cccd').val().trim(),
        dkkd          : $('#edit_dkkd').val().trim(),
        // Các trường ngày ĐỀU đọc từ flatpickr.input.value → YYYY-MM-DD chuẩn ISO
        ngay_mo       : _getISODate('edit_ngay_mo'),
        ngay_cap_cccd : _getISODate('edit_ngay_cap_cccd'),
        ngay_het_han  : _getISODate('edit_ngay_het_han'),
        ngay_sinh     : _getISODate('edit_ngay_sinh'),
        so_tk         : ($('#edit_so_tk').val().trim() ? '380020' + $('#edit_so_tk').val().trim() : ''),
        ten_dang_nhap : $('#edit_ten_dang_nhap').val().trim(),
        mat_khau      : $('#edit_mat_khau').val().trim(),
        is_activated  : $('#edit_is_activated').is(':checked'),
        co_qr         : $('#edit_co_qr').is(':checked'),
        co_loa        : $('#edit_co_loa').is(':checked'),
        dia_chi       : $('#edit_dia_chi').val().trim(),
        dia_chi_kd    : $('#edit_dia_chi_kd').val().trim(),
        nganh_nghe    : $('#edit_nganh_nghe').val().trim(),
        ten_hkd       : $('#edit_ten_hkd').val().trim().toUpperCase(),
        noi_cap_cccd  : $('#edit_noi_cap_cccd').val().trim(),
        doi_tuong     : $('#edit_doi_tuong').val() || 'Ngoài thành viên',
        email_kh      : $('#edit_email_kh').val().trim()
    };

    // Đọc ảnh base64 nếu người dùng có chọn upload ảnh mới
    const fileKeys = ['img_truoc', 'img_sau', 'img_dkkd', 'img_qr', 'img_thuchien'];
    for (const key of fileKeys) {
        const fileInput = document.getElementById('edit_file_' + key);
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            try {
                if (typeof readFileAsBase64 === 'function') {
                    payload[key] = await readFileAsBase64(fileInput.files[0], 500);
                } else {
                    payload[key] = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(fileInput.files[0]);
                    });
                }
            } catch (err) {
                showAlert('Lỗi', 'Lỗi khi xử lý ảnh mới: ' + err.message, 'error');
                btn.prop('disabled', false).html(oldHtml);
                return;
            }
        }
    }

    runAPI('api_updatecustomer', payload, (res) => {
        btn.prop('disabled', false).html(oldHtml);
        if (res && res.status === 'success') {
            // =============================================
            // OPTIMISTIC UI UPDATE — Cập nhật DOM ngay lập tức
            // Không cần chờ SweetAlert đóng hay round-trip API thứ 2
            // =============================================
            const newStatus = payload.is_activated ? 'Đã kích hoạt' : 'Chưa kích hoạt';
            const newDotClass = payload.is_activated ? 'active' : 'inactive';
            const newDoiTuong = payload.doi_tuong; // 'Thành viên' hoặc 'Ngoài thành viên'
            const rowId = String(payload.id).trim().replace(/^[']*/, '');

            // 1. Cập nhật ngay chấm tròn (Trạng thái) và Badge (Đối tượng) trong bảng HTML
            const $row = $(`tr[data-id="${rowId}"]`);
            if ($row.length) {
                // Cập nhật chấm tròn trạng thái
                $row.find('.status-dot')
                    .removeClass('active inactive')
                    .addClass(newDotClass)
                    .attr('title', newStatus);

                // Cập nhật Badge Đối tượng (Cột index 4)
                const isMember = newDoiTuong === 'Thành viên';
                const badgeClass = isMember ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-secondary-subtle text-secondary border border-secondary-subtle';
                $row.find('td:nth-child(5) .badge')
                    .removeClass('bg-primary-subtle text-primary bg-secondary-subtle text-secondary border border-primary-subtle border-secondary-subtle')
                    .addClass(badgeClass)
                    .text(newDoiTuong);
            }

            // 2. Cập nhật in-memory cache Staff
            const staffCache = AppCache.get('myCustomers');
            if (staffCache && Array.isArray(staffCache.data)) {
                const rec = staffCache.data.find(d =>
                    String(d['ID'] || d['Mã GD'] || '').replace(/^[']*/, '') === rowId
                );
                if (rec) {
                    rec['Trạng thái'] = newStatus;
                    rec['trang_thai'] = newStatus;
                    rec['Đối tượng'] = newDoiTuong;
                    rec['doi_tuong'] = newDoiTuong;
                }
            }

            // 3. Cập nhật in-memory _adminAllData
            if (window._adminAllData && Array.isArray(window._adminAllData)) {
                const rec = window._adminAllData.find(d =>
                    String(d['ID'] || d['Mã GD'] || '').replace(/^[']*/, '') === rowId
                );
                if (rec) {
                    rec['Trạng thái'] = newStatus;
                    rec['trang_thai'] = newStatus;
                    rec['Đối tượng'] = newDoiTuong;
                    rec['doi_tuong'] = newDoiTuong;
                }
            }

            // 4. Clear cache server-side để lần load sau lấy data mới
            AppCache.clear('myCustomers');
            AppCache.clear('adminDashboard');
            // _adminAllData GIỮ LẠI (đã patch) để modal mở lại vẫn đúng trạng thái
            // Sẽ invalidate khi đóng modal và chuyển view

            // 5. Hiện thông báo thành công + đóng modal sau khi xác nhận
            Swal.fire({
                title: 'Lưu thành công!',
                text: `Hồ sơ đã được cập nhật — Trạng thái: ${newStatus}`,
                icon: 'success',
                confirmButtonColor: '#10b981',
                confirmButtonText: 'Đóng',
                timer: 2500,
                timerProgressBar: true
            }).then(() => {
                const mEl = document.getElementById('modalEditCustomer');
                if (mEl) bootstrap.Modal.getOrCreateInstance(mEl).hide();
                // Reload ngầm sau khi đóng modal để đồng bộ hoàn toàn với server
                window._adminAllData = null;
                if (AppState.user && AppState.user.role !== 'Admin') {
                    initMyCustomersList();
                } else if (AppState.user && AppState.user.role === 'Admin') {
                    if (typeof loadAdminData === 'function') loadAdminData();
                }
            });
        } else {
            showAlert('Lỗi', (res && res.message) ? res.message : 'Không thể cập nhật hồ sơ. Vui lòng thử lại.', 'error');
        }
    }, () => {
        btn.prop('disabled', false).html(oldHtml);
        showAlert('Lỗi kết nối', 'Không thể lưu hồ sơ. Vui lòng thử lại.', 'error');
    }, 'Đang lưu hồ sơ...');
}

// Cấu hình event delegation xử lý xem chi tiết
$(document).ready(() => {
    $(document).on('click', '.clickable-row', function (e) {
        if ($(e.target).is('button') || $(e.target).closest('button').length) return;
        const id = $(this).attr('data-id') || $(this).data('id');
        if (id) openEditCustomerModal(id);
    });

    $(document).on('click', '.btn-detail', function (e) {
        e.stopPropagation();
        const id = $(this).closest('tr').attr('data-id') || $(this).closest('tr').data('id');
        if (id) openEditCustomerModal(id);
    });

    $(document).on('click', '.btn-upload-scan', function (e) {
        e.stopPropagation();
        const id = $(this).attr('data-id');
        const name = $(this).attr('data-name') || '';
        if (!id) return;

        let $input = $('#hiddenScanInput');
        if ($input.length === 0) {
            $input = $('<input type="file" id="hiddenScanInput" accept=".pdf" style="display:none">');
            $('body').append($input);

            $input.on('change', async function () {
                const file = this.files[0];
                if (!file) return;

                if (file.type !== 'application/pdf') {
                    showAlert('File không hợp lệ', 'Vui lòng chọn file định dạng PDF.', 'warning');
                    return;
                }
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    showAlert('File quá lớn', 'Kích thước file tối đa là 10MB.', 'warning');
                    return;
                }

                const currentId = $(this).data('target-id');
                const targetBtn = $(`.btn-upload-scan[data-id="${currentId}"]`);
                const oldHtml = targetBtn.html();

                try {
                    targetBtn.prop('disabled', true).html('<i class="bx bx-loader-alt bx-spin"></i>');

                    const base64Data = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = error => reject(error);
                    });

                    runAPI('api_uploadScanProfile', {
                        customerId: currentId,
                        base64Data: base64Data
                    }, (res) => {
                        targetBtn.prop('disabled', false).html(oldHtml);
                        this.value = ''; // Reset input

                        if (res.status === 'success') {
                            Swal.fire({
                                icon: 'success',
                                title: 'Thành công',
                                text: 'Tải lên bản Scan thành công!',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            // Optmistic UI Update
                            const newUrl = res.data.url;
                            const td = targetBtn.closest('td');
                            targetBtn.remove();
                            td.append(`<a href="${newUrl}" target="_blank" class="btn btn-sm btn-outline-success shadow-sm" title="Xem bản Scan (PDF)"><i class="bx bx-file-find"></i></a>`);

                            // Update cache so row refresh keeps it
                            const staffCache = AppCache.get('myCustomers');
                            if (staffCache && Array.isArray(staffCache.data)) {
                                const rec = staffCache.data.find(d => String(d['ID'] || d['Mã GD'] || '').replace(/^[']*/, '') === currentId);
                                if (rec) rec['URL Hồ Sơ Scan'] = newUrl;
                            }
                            if (window._adminAllData && Array.isArray(window._adminAllData)) {
                                const rec = window._adminAllData.find(d => String(d['ID'] || d['Mã GD'] || '').replace(/^[']*/, '') === currentId);
                                if (rec) rec['URL Hồ Sơ Scan'] = newUrl;
                            }
                        } else {
                            showAlert('Lỗi', res.message || 'Không thể tải lên bản scan', 'error');
                        }
                    }, null, 'NONE'); // Silence the global loading overlay, use button spinner
                } catch (err) {
                    targetBtn.prop('disabled', false).html(oldHtml);
                    showAlert('Lỗi', 'Lỗi khi xử lý file.', 'error');
                }
            });
        }
        $input.data('target-id', id);
        $input.data('target-name', name);
        $input.click();
    });

    // Sửa lỗi: Lắng nghe sự kiện submit của form để ngăn trang bị reload
    $(document).on('submit', '#frmEditCustomer', handleEditCustomer);
});


// ===== HÀM HỖ TRỢ: Preview ảnh mới trong slot upload (Netlify) =====
function previewNetlifyEditImage(input, previewId) {
    const prevEl = document.getElementById(previewId);
    if (!prevEl) return;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            prevEl.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded border mt-1" style="max-height:80px;object-fit:cover;width:100%;" alt="Preview">`;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        prevEl.innerHTML = '';
    }
}

console.log("DEBUG: customer.js loaded successfully.");
