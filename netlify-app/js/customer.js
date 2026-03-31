/**
 * STAFF CUSTOMER LOGIC
 */
async function initMyCustomersList() {
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
            $('#tbMyCustomersBody').html(`<tr><td colspan="7" class="text-center text-danger py-4">Lỗi: ${res.message}</td></tr>`);
        }
    }, null, 'NONE');
}

function renderStaffDashboardLocal(data) {
    let caNhan = 0, hkd = 0, total = 0;
    let activated = 0, inactive = 0;
    let timeline = {};

    data.forEach(d => {
        total++;
        if (d['Loại hình dịch vụ'] === 'Cá nhân') caNhan++;
        else if (d['Loại hình dịch vụ'] === 'Hộ kinh doanh') hkd++;

        const status = d['Trạng thái'] || '';
        if (status === 'Đã kích hoạt') activated++;
        else inactive++;

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

    // Update progress bars
    const t = total || 1;
    const cnPct = Math.round(caNhan / t * 100);
    const hkdPct = 100 - cnPct;
    $('#staffDash-prog-canhan').css('width', cnPct + '%').attr('aria-valuenow', cnPct);
    $('#staffDash-prog-hkd').css('width', hkdPct + '%').attr('aria-valuenow', hkdPct);

    renderStaffLineChart(timeline);
}

function updateStaffRankings(adminData, email) {
    if(!adminData || !adminData.allStaffs) {
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
        let sDate = `${String(tmp.getDate()).padStart(2,"0")}/${String(tmp.getMonth()+1).padStart(2,"0")}`;
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
    const html = data.sort((a,b) => (new Date(b['Thời điểm nhập']) || 0) - (new Date(a['Thời điểm nhập']) || 0)).map(d => {
        const rowId = (d.ID || d['Mã GD'] || '').toString().replace(/^'/, '');
        const isActivated = (d['Trạng thái'] === 'Đã kích hoạt');
        const statusDot = `<span class="status-dot ${isActivated ? 'active' : 'inactive'}" title="${d['Trạng thái'] || 'Chưa kích hoạt'}"></span>`;
        return `
            <tr data-id="${rowId}" class="clickable-row cursor-pointer">
                <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
                <td class="fw-bold text-dark">${utils_escapeHTML(d['Tên khách hàng'])}</td>
                <td class="text-secondary"><small>${utils_escapeHTML(d['Số TK'] || d['Số tài khoản'] || '')}</small></td>
                <td>${statusDot} <span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'])}</span></td>
                <td><small>${utils_escapeHTML(d['Số điện thoại'])}</small></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary shadow-sm btn-detail" title="Xem chi tiết">
                        <i class="bx bx-search-alt"></i> <span class="d-none d-sm-inline">Chi tiết</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    $('#tbMyCustomersBody').html(html || '<tr><td colspan="7" class="text-center text-muted py-4">Chưa có hồ sơ nào.</td></tr>');
    
    if ($.fn.DataTable.isDataTable('#tblMyCustomers')) $('#tblMyCustomers').DataTable().destroy();
    
    if (data.length > 0) {
        $('#tblMyCustomers').DataTable({
            responsive: true,
            order: [[0, 'desc']],
            lengthMenu: [10, 25, 50, 100],
            pageLength: 25,
            dom: "<'row mb-2'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4 text-center'B><'col-sm-12 col-md-4'f>>" +
                 "<'row'<'col-sm-12'tr>>" +
                 "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            buttons: [
                { 
                    extend: 'excelHtml5', 
                    text: '<i class="bx bxs-file-export"></i> Xuất Excel', 
                    className: 'btn btn-sm btn-success shadow-sm',
                    // P0-FIX: Chỉ export 5 cột dữ liệu (bỏ cột "Xem" - nút bấm)
                    exportOptions: { columns: [0, 1, 2, 3, 4] },
                    title: 'HoSo_CaNhan_YenTho_' + new Date().toISOString().slice(0,10)
                }
            ],
            language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json" },
            search: { caseInsensitive: true, smart: true },
            columnDefs: [
                { targets: [5], orderable: false, searchable: false }
            ]
        });
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

        if (typeof flatpickr !== 'undefined') {
            const fpEl = document.querySelector('.js-datepicker-edit');
            if (fpEl && !fpEl._flatpickr) {
                flatpickr(fpEl, { dateFormat: "d/m/Y", altInput: true, altFormat: "d/m/Y", allowInput: true });
            }
        }

        $('#edit_id').val(id);
        $('#edit_ten_kh').val(row['Tên khách hàng'] || '');
        $('#edit_sdt').val((row['Số điện thoại'] || '').toString().replace(/^'/, ''));
        
        const loaiHinh = row['Loại hình dịch vụ'] || 'Cá nhân';
        const cccdVal = (row['Số CCCD'] || '').toString().replace(/^'/, '');
        const dkkdVal = (row['Số DKKD'] || '').toString().replace(/^'/, '');
        
        $('#edit_cccd').val(cccdVal);
        $('#edit_dkkd').val(dkkdVal);
        
        if (loaiHinh === 'Hộ kinh doanh') {
            $('#edit_dkkd_group').show();
        } else {
            $('#edit_dkkd_group').hide();
        }

        let dDate = row['Ngày mở TK'] || row['Thời điểm nhập'] || '';
        if (dDate) {
            const rawD = new Date(dDate);
            if (!isNaN(rawD)) {
                const formatted = String(rawD.getDate()).padStart(2, '0') + '/' + String(rawD.getMonth() + 1).padStart(2, '0') + '/' + rawD.getFullYear();
                if ($('#edit_ngay_mo')[0]?._flatpickr) {
                    $('#edit_ngay_mo')[0]._flatpickr.setDate(rawD);
                } else {
                    $('#edit_ngay_mo').val(formatted);
                }
            } else {
                $('#edit_ngay_mo').val(dDate);
            }
        }
        
        let stk = (row['Số TK'] || row['Số tài khoản'] || '').toString().replace(/^'/, '');
        if (stk.length > 7 && stk.startsWith('3800200')) stk = stk.substring(7);
        $('#edit_so_tk').val(stk);

        $('#edit_ten_dang_nhap').val((row['Tên đăng nhập'] || '').toString().replace(/^'/, ''));
        $('#edit_mat_khau').val(row['Mật khẩu'] || '');

        const status = row['Trạng thái'] || '';
        $('#edit_is_activated').prop('checked', status === 'Đã kích hoạt');

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
        
        const imgs = getImgHtml(row['URL CCCD Trước'] || row['URL Ảnh Mặt Trước'] || '', 'Mặt trước')
                   + getImgHtml(row['URL CCCD Sau'] || row['URL Ảnh Mặt Sau'] || '', 'Mặt sau')
                   + (loaiHinh !== 'Cá nhân' ? getImgHtml(row['URL GP DKKD'] || row['URL DKKD'] || row['URL Giấy phép'] || '', 'GP ĐKKD') : '')
                   + getImgHtml(row['URL QR'] || row['URL Mã QR'] || '', 'QR TK')
                   + getImgHtml(row['URL Ảnh Thực Hiện'] || row['URL Thực Hiện'] || '', 'Ảnh GD');
                   
        const imgsBlock = imgs ? `<div class="col-12"><p class="text-muted small fw-semibold mb-1"><i class="bx bx-image"></i> Hình ảnh đính kèm</p><div class="row g-2">${imgs}</div></div>` : '<div class="col-12 text-center text-muted"><p class="small">Chưa có ảnh đính kèm</p></div>';

        $('#edit_images_container').html(infoHtml + imgsBlock);
        const modalEl = document.getElementById('modalEditCustomer');
        if (!modalEl) {
            console.error("DEBUG: Không tìm thấy element modalEditCustomer");
            return;
        }
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    } catch(err) { console.error(err); }
}

function handleEditCustomer(e) {
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

    const payload = {
        id: id,
        email: AppState.user ? AppState.user.email : '',
        ten_kh:    $('#edit_ten_kh').val().trim().toUpperCase(),
        sdt:       sdtVal,
        cccd:      $('#edit_cccd').val().trim(),
        dkkd:      $('#edit_dkkd').val().trim(),
        ngay_mo:   $('#edit_ngay_mo').val(),
        so_tk:     ($('#edit_so_tk').val().trim() ? '3800200' + $('#edit_so_tk').val().trim() : ''),
        ten_dang_nhap: $('#edit_ten_dang_nhap').val().trim(),
        mat_khau:  $('#edit_mat_khau').val().trim(),
        is_activated: $('#edit_is_activated').is(':checked')
    };

    runAPI('api_updatecustomer', payload, (res) => {
        btn.prop('disabled', false).html(oldHtml);
        if (res && res.status === 'success') {
            // P0-FIX: Clear cả 2 cache để đảm bảo Dashboard cập nhật chính xác sau kích hoạt
            AppCache.clear('myCustomers');
            AppCache.clear('adminDashboard');
            window._adminAllData = null; // Reset data bộ nhớ để buộc tải lại từ server
            Swal.fire({
                title: 'Lưu thành công!',
                text: 'Hồ sơ đã được cập nhật.',
                icon: 'success',
                confirmButtonColor: '#10b981',
                confirmButtonText: 'Đóng'
            }).then(() => {
                const mEl = document.getElementById('modalEditCustomer');
                if (mEl) bootstrap.Modal.getOrCreateInstance(mEl).hide();
                if (AppState.user && AppState.user.role !== 'Admin') {
                    // Staff: reload danh sách hồ sơ cá nhân
                    initMyCustomersList();
                } else if (AppState.user && AppState.user.role === 'Admin') {
                    // Admin: reload toàn bộ dashboard từ server (không dùng cache)
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
    $(document).on('click', '.clickable-row', function(e) {
        if ($(e.target).is('button') || $(e.target).closest('button').length) return;
        const id = $(this).attr('data-id') || $(this).data('id');
        if (id) openEditCustomerModal(id);
    });

    $(document).on('click', '.btn-detail', function(e) {
        e.stopPropagation(); 
        const id = $(this).closest('tr').attr('data-id') || $(this).closest('tr').data('id');
        if (id) openEditCustomerModal(id);
    });

    // Sửa lỗi: Lắng nghe sự kiện submit của form để ngăn trang bị reload
    $(document).on('submit', '#frmEditCustomer', handleEditCustomer);
});

window.loadStaffMyCustomersView = () => { showView('view-my-customers'); initMyCustomersList(); };
window.openEditCustomerModal = openEditCustomerModal;
