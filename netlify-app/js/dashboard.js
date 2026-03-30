/**
 * DASHBOARD & ADMIN LOGIC
 */
let charts = {};

function _parseStats(res) {
    if (!res) return null;
    let s = null;
    if (res.statsStr) {
        try { s = JSON.parse(res.statsStr); } catch(e) { console.error('Parse statsStr error', e); }
    }
    if (!s) s = res.stats || null;
    return s;
}

async function initDashboard() {
    function _renderAll(s) {
        if (!s) { console.error("Dashboard stats is null"); return; }
        renderAdminStats(s);
        renderAdminCharts(s);
        renderMonthlyChart(s.allData || []);
        renderAdminTable(s.allData || [], s.allStaffs || []);
        renderAdminTopStaff(s.allStaffs || []);
        if (typeof flatpickr !== 'undefined') {
            flatpickr('#filterFromDate', { altInput: true, altFormat: 'd/m/Y', dateFormat: 'Y-m-d' });
            flatpickr('#filterToDate', { altInput: true, altFormat: 'd/m/Y', dateFormat: 'Y-m-d' });
        }
    }

    const cachedDash = AppCache.get('adminDashboard');
    if (cachedDash) {
        _renderAll(cachedDash);
        return;
    }

    runAPI('api_getAdminDashboardData', { email: AppState.user.email }, (res) => {
        if (res.status === 'success') {
            const s = _parseStats(res);
            AppCache.set('adminDashboard', s);
            _renderAll(s);
        }
    });
}

function renderAdminStats(s) {
    $('#db-total').text(s.total || 0);
    $('#db-ca-nhan-sub').text(s.caNhan || 0);
    $('#db-hkd-sub').text(s.hkd || 0);
    $('#db-ca-nhan').text(s.caNhan || 0);
    $('#db-hkd-count').text(s.hkd || 0);
}

function renderAdminTopStaff(allStaffs) {
    if (!allStaffs || allStaffs.length === 0) {
        $('#db-topstaff').html('<div class="text-center text-muted small p-2">Không có dữ liệu cán bộ.</div>');
        return;
    }
    const sorted = [...allStaffs].sort((a,b) => (b.total || 0) - (a.total || 0)).slice(0, 5);
    let html = '';
    sorted.forEach((st, idx) => {
        let rankColor = 'text-secondary';
        let trophy = `<span class="fw-bold ms-2">${idx + 1}.</span>`;
        if (idx === 0) { rankColor = 'text-warning'; trophy = `<i class='bx bxs-trophy ms-1 fs-5 text-warning'></i>`; }
        else if (idx === 1) { rankColor = 'text-secondary'; trophy = `<i class='bx bxs-medal ms-1 fs-5 text-secondary'></i>`; }
        else if (idx === 2) { rankColor = 'text-danger'; trophy = `<i class='bx bxs-medal ms-1 fs-5 text-danger'></i>`; }
        
        html += `
            <div class="d-flex align-items-center justify-content-between p-2 rounded-3 border bg-light shadow-sm">
                <div class="d-flex align-items-center gap-2">
                    <div class="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center" style="width:35px;height:35px">
                        ${trophy}
                    </div>
                    <div>
                        <p class="mb-0 fw-bold small text-dark text-truncate" style="max-width:150px;" title="${st.name}">${st.name}</p>
                        <small class="text-muted" style="font-size:11px;">${st.department || 'Phòng ban'}</small>
                    </div>
                </div>
                <div class="text-end">
                    <h5 class="mb-0 fw-bold text-primary">${st.total}</h5>
                    <small class="text-muted" style="font-size:10px;">Hồ sơ</small>
                </div>
            </div>
        `;
    });
    $('#db-topstaff').html(html);
}

function renderAdminCharts(s) {
    if (charts.pie) charts.pie.destroy();
    const ctxPie = document.getElementById('chartLoaiHinh').getContext('2d');
    charts.pie = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Cá nhân', 'Hộ kinh doanh'],
            datasets: [{
                data: [s.loaiHinh['Cá nhân'] || 0, s.loaiHinh['Hộ kinh doanh'] || 0],
                backgroundColor: ['#10b981', '#f59e0b']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function renderAdminTable(allData, allStaffs) {
    if ($.fn.DataTable.isDataTable('#tblKH')) {
        $('#tblKH').DataTable().destroy();
    }

    window._adminAllData = allData.sort((a,b) => (new Date(b['Thời điểm nhập'])||0) - (new Date(a['Thời điểm nhập'])||0));
    window._adminRawStaffs = allStaffs;

    const staffMap = {};
    allStaffs.forEach(st => staffMap[st.email] = st.name);

    const html = window._adminAllData.map(d => {
        const staffEmail = (d['Cán bộ thực hiện'] || '').toString().trim();
        const staffName  = staffMap[staffEmail] || staffEmail;
        const rowId      = (d['ID'] || d['Mã GD'] || '').toString().trim().replace(/^[']*/, '');
        return `
            <tr data-id="${rowId}" class="clickable-row cursor-pointer">
                <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
                <td class="fw-bold text-dark">${utils_escapeHTML(d['Tên khách hàng'] || '')}</td>
                <td><span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'] || 'Cá nhân')}</span></td>
                <td class="text-secondary"><small>${utils_escapeHTML((d['Số tài khoản'] || '').toString().replace(/^'/, ''))}</small></td>
                <td class="d-none">${utils_escapeHTML(staffEmail)}</td>
                <td><small>${utils_escapeHTML(staffName)}</small></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary px-2 btn-detail" title="Chi tiết">
                        <i class="bx bx-info-circle"></i>
                    </button>
                </td>
            </tr>`;
    }).join('');

    $('#tblKH tbody').html(html);

    const selStaff = $('#filterStaffAdmin');
    if (selStaff.find('option').length <= 1 && allStaffs.length > 0) {
        allStaffs.sort((a,b) => (a.name||'').localeCompare(b.name||'')).forEach(st => {
            selStaff.append(`<option value="${st.email}">${st.name}</option>`);
        });
    }

    const dtAdmin = $('#tblKH').DataTable({
        responsive: true,
        order: [[0, 'desc']],
        lengthMenu: [10, 25, 50, 100],
        pageLength: 25,
        dom: "<'row mb-2'<'col-sm-12 col-md-3'l><'col-sm-12 col-md-5'f><'col-sm-12 col-md-4 text-end'B>>" +
             "<'row'<'col-sm-12'tr>>" +
             "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: [{
            extend: 'excelHtml5',
            text: '<i class="bx bxs-file-export"></i> Xuất Excel',
            className: 'btn btn-sm btn-success shadow-sm',
            exportOptions: {
                columns: ':all',
                format: {
                    header: function(data, col) {
                        const hdrs = ['Thời gian', 'Họ Tên', 'Loại Hình', 'Số TK', 'Email CB', 'Cán Bộ', 'Thao tác'];
                        return hdrs[col] || data;
                    }
                }
            },
            title: 'Bao_Cao_KH_YenTho_' + new Date().toISOString().slice(0,10)
        }],
        language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json" },
        search: { caseInsensitive: true, smart: true },
        columnDefs: [
            { targets: [4], visible: false, searchable: true },   
            { targets: [6], orderable: false, searchable: false }  
        ]
    });

    window._dtAdmin = dtAdmin;

    $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(fn => fn._tblKH !== true);
    const dateFilter = function(settings, data, dataIndex) {
        if (settings.nTable.id !== 'tblKH') return true;
        const minVal = $('#filterFromDate').val();
        const maxVal = $('#filterToDate').val();
        const raw = window._adminAllData[dataIndex]?.['Thời điểm nhập'];
        if (!raw) return true;
        const rowDate = new Date(raw).toISOString().slice(0,10);
        if (minVal && rowDate < minVal) return false;
        if (maxVal && rowDate > maxVal) return false;
        return true;
    };
    dateFilter._tblKH = true;
    $.fn.dataTable.ext.search.push(dateFilter);

    $('#filterStaffAdmin').off('change.tblKH').on('change.tblKH', function() {
        dtAdmin.column(4).search($(this).val()).draw();
    });

    $('#filterFromDate, #filterToDate').off('change.tblKH').on('change.tblKH', function() {
        dtAdmin.draw();
    });
}

let monthlyChart = null;
function renderMonthlyChart(allData) {
    try {
        const yearSet = {};
        allData.forEach(d => {
            const raw = d['Thời điểm nhập'];
            if (!raw) return;
            const yr = new Date(raw).getFullYear();
            if (!isNaN(yr)) yearSet[yr] = true;
        });
        let years = Object.keys(yearSet).sort((a,b) => b-a);
        if (years.length === 0) years = [new Date().getFullYear().toString()];

        const selYear = $('#filterYearChart');
        if (selYear.find('option').length === 0) {
            years.forEach(y => selYear.append(`<option value="${y}">${y}</option>`));
            selYear.off('change').on('change', function() {
                renderMonthlyChartForYear(allData, parseInt($(this).val()));
            });
        }
        renderMonthlyChartForYear(allData, parseInt(years[0]));
    } catch(e) { console.error('renderMonthlyChart error:', e); }
}

function renderMonthlyChartForYear(allData, year) {
    const months = ['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'];
    const countsCaNhan = new Array(12).fill(0);
    const countsHKD = new Array(12).fill(0);
    
    allData.forEach(d => {
        const raw = d['Thời điểm nhập'];
        if (!raw) return;
        const dt = new Date(raw);
        if (isNaN(dt) || dt.getFullYear() !== year) return;
        const m = dt.getMonth();
        if (d['Loại hình dịch vụ'] === 'Hộ kinh doanh') countsHKD[m]++;
        else countsCaNhan[m]++;
    });

    const ctxEl = document.getElementById('chartMonthly');
    if (!ctxEl) return;
    if (monthlyChart) try { monthlyChart.destroy(); } catch(e){}
    monthlyChart = new Chart(ctxEl.getContext('2d'), {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                { label: 'Cá nhân', data: countsCaNhan, backgroundColor: 'rgba(16, 185, 129, 0.75)', borderRadius: 4 },
                { label: 'Hộ KD', data: countsHKD, backgroundColor: 'rgba(245, 158, 11, 0.75)', borderRadius: 4 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: {
                x: { stacked: false, grid: { display: false } },
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });
}

let dtAllStaffs = null;
function showAllStaffModal() {
    try {
        const arr = window._adminRawStaffs || [];
        let html = '';
        arr.forEach((st, idx) => {
            html += `<tr><td>${idx+1}</td><td class="fw-bold">${st.name}</td><td>${st.department}</td><td>${st.total}</td><td>${st.caNhan||0}</td><td>${st.hkd||0}</td></tr>`;
        });
        $('#tblAllStaffs tbody').html(html);
        if(dtAllStaffs) try { dtAllStaffs.destroy(); } catch(e){}
        dtAllStaffs = $('#tblAllStaffs').DataTable({
            responsive: true,
            dom: "<'row mb-2'<'col-sm-12 col-md-4 d-flex align-items-center justify-content-start'l><'col-sm-12 col-md-4 d-flex align-items-center justify-content-center'B><'col-sm-12 col-md-4 d-flex align-items-center justify-content-end'f>>" +
                 "<'row'<'col-sm-12'tr>>" +
                 "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            buttons: [{ extend: 'excelHtml5', text: '<i class="bx bxs-file-export"></i> Xuất Excel', className: 'btn btn-sm btn-success shadow-sm' }],
            language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json" }
        });
        $('#modalAllStaff').modal('show');
    } catch(e) { console.error(e); }
}

window.loadAdminData = () => {
    AppCache.clear('adminDashboard');
    initDashboard();
};
window.showAllStaffModal = showAllStaffModal;
