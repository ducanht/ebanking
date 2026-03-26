/**
 * NETLIFY APP ENGINE - V2.0
 * Decoupled Frontend logic for HoKinhDoanh System
 */

const CONFIG = {
    // URL của Google Apps Script Web App (doPost)
    API_URL: "https://script.google.com/macros/s/AKfycbyXBMdJO2JmoaarxW9l7mg-l4tyN6BF1U01jaMPQ48xmVOZM9WFWLnOTIc9Wyf1OpFr/exec",
    VERSION: "2.0.0-netlify",
    CACHE_TTL: 180000 // 3 minutes
};

const AppState = {
    user: null,
    isInitialLoad: true
};

const AppCache = {
    data: {},
    timestamp: {},
    set(key, val) {
        this.data[key] = val;
        this.timestamp[key] = Date.now();
    },
    get(key) {
        if (!this.timestamp[key] || (Date.now() - this.timestamp[key]) > CONFIG.CACHE_TTL) return null;
        return this.data[key];
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
 * CORE: API WRAPPER (STANDALONE)
 * Dùng fetch() thay vì google.script.run
 */
async function fetchAPI(action, data = {}) {
    showLoading();
    try {
        // GAS doPost yêu cầu Content-Type: text/plain để tránh CORS preflight (OPTIONS)
        const response = await fetch(CONFIG.API_URL, {
            method: "POST",
            mode: "no-cors", // Note: no-cors suppresses the response body access in browser
            body: JSON.stringify({ action, data })
        });

        // VẤN ĐỀ: 'no-cors' không cho phép đọc kết quả response.
        // CÁCH GIẢI QUYẾT: Dùng chuẩn POST mặc định nhưng GAS phải trả về JSON + CORS headers.
        // Tuy nhiên, GAS redirection (302) gây khó khăn cho fetch.
        // Giải pháp tối ưu: Gửi request với Content-Type chuẩn và để GAS handle.
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

/**
 * REFINED FETCH API (CORS FRIENDLY FOR GAS)
 */
async function runAPI(action, data = {}, successCallback, errorCallback, loadingMsg) {
    if (loadingMsg !== 'NONE') showLoading(loadingMsg || 'Đang xử lý...');

    try {
        // HACK: Dùng 'text/plain' để trình duyệt KHÔNG gửi OPTIONS request (CORS Preflight)
        // GAS doPost vẫn nhận chuỗi JSON này qua e.postData.contents
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({ action: action, data: data })
        });

        // Lưu ý: GAS thường redirect (302). Fetch với 'follow' sẽ tự xử lý.
        const result = await response.json();
        
        if (loadingMsg !== 'NONE') hideLoading();

        if (result.status === 'success') {
            if (successCallback) successCallback(result);
        } else {
            showAlert('Lỗi', result.message || 'Xử lý thất bại', 'error');
            if (errorCallback) errorCallback(result);
        }
    } catch (err) {
        if (loadingMsg !== 'NONE') hideLoading();
        console.error("API Call Failed:", err);
        
        // Handle possible silent success (where GAS executes but response is opaque due to CORS/Redirect)
        if (action === 'api_submitRegistration' || action === 'api_updateCustomer') {
             // Optional: verify if we should show success anyway if it's a one-way sync
        }

        showAlert('Lỗi Kết Nối', 'Máy chủ không phản hồi đúng định dạng JSON hoặc hết hạn phiên. Vui lòng thử lại.', 'error');
        if (errorCallback) errorCallback(err);
    }
}

/**
 * NAVIGATION & ROUTING
 */
function showView(viewId) {
    console.log("[Router] Navigating to:", viewId);
    $('.view-section').addClass('initially-hidden');
    $(`#${viewId}`).removeClass('initially-hidden');
    
    // Auto-scroll to top
    window.scrollTo(0, 0);
}

/**
 * UTILS
 */
function showLoading(msg = 'Đang tải...') {
    $('#global-spinner h5').text(msg);
    $('#global-spinner').css('display', 'flex');
}

function hideLoading() {
    $('#global-spinner').hide();
}

function showAlert(title, text, icon) {
    Swal.fire({ title, text, icon, confirmButtonColor: '#10b981' });
}

function utils_formatVN(val, type = 'date') {
    if (!val) return 'N/A';
    const dateObj = new Date(val);
    if (isNaN(dateObj)) return val;
    const day = ('0' + dateObj.getDate()).slice(-2);
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const year = dateObj.getFullYear();
    if (type === 'datetime') {
        const h = ('0' + dateObj.getHours()).slice(-2);
        const m = ('0' + dateObj.getMinutes()).slice(-2);
        return `${h}:${m} ${day}/${month}/${year}`;
    }
    return `${day}/${month}/${year}`;
}

/**
 * AUTH LOGIC
 */
async function handleLogin(e) {
    e.preventDefault();
    const email = $('#loginEmail').val().trim();
    const pwd = $('#loginPassword').val();
    
    if (!email || !pwd) return showAlert('Lỗi', 'Nhập đầy đủ thông tin', 'warning');
    
    const hashedPwd = CryptoJS.SHA256(pwd).toString();
    
    runAPI('api_login', { email, password: hashedPwd }, (res) => {
        AppState.user = res.user;
        localStorage.setItem('HOKINHDOANH_SESSION', JSON.stringify(res.user));
        
        if (res.requirePasswordChange) {
            openChangePasswordModal(true);
        } else {
            handleLoginSuccess();
        }
    });
}

function handleLoginSuccess() {
    if (!AppState.user) return;
    
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, icon: 'success', title: 'Xin chào ' + AppState.user.fullName });
    
    if (AppState.user.role === 'Admin') {
        $('#staffBottomNav').addClass('initially-hidden');
        showView('view-dashboard');
        initDashboard();
    } else {
        $('#staffBottomNav').removeClass('initially-hidden');
        showView('view-mo-tai-khoan');
        initMoTaiKhoanForm();
    }
}

function logout() {
    AppState.user = null;
    localStorage.removeItem('HOKINHDOANH_SESSION');
    AppCache.clearAll();
    $('#staffBottomNav').addClass('initially-hidden');
    showView('view-login');
}

/**
 * INITIALIZATION
 */
$(document).ready(() => {
    // Check session
    const saved = localStorage.getItem('HOKINHDOANH_SESSION');
    if (saved) {
        try {
            AppState.user = JSON.parse(saved);
            handleLoginSuccess();
        } catch (e) {
            showView('view-login');
        }
    } else {
        showView('view-login');
    }

    // Attach global events
    $('#frm-login').on('submit', handleLogin);
    
    hideLoading();
});

/**
 * FORM & LIST INITS (Ported from GAS scripts)
 * Note: These are simplified shells. We will inject the full logic in the next steps.
 */
/**
 * FEATURE: MO TAI KHOAN (FORM LOGIC)
 */
let isCvReady = false;
let imageMatStore = {};
let currentInputTargetId = null;

function onOpenCvReady() {
    isCvReady = true;
    console.log("[System] OpenCV initialized.");
}

function initMoTaiKhoanForm() {
    // Datepicker
    flatpickr('.js-datepicker', { dateFormat: "Y-m-d", altFormat: "d/m/Y", altInput: true, defaultDate: "today" });

    $('#frm-mo-tk').off('submit').on('submit', submitMoTaiKhoanForm);
    
    // Image Uploads
    const uploadIds = ['img_truoc', 'img_sau', 'img_qr'];
    uploadIds.forEach(id => {
        $(`#${id}`).on('change', function(e) {
            if(this.files && this.files[0]) {
                const file = this.files[0];
                handleImageInput(file, id);
            }
        });
    });

    // Native Camera Bridge
    const camMap = { 'cam_truoc': 'img_truoc', 'cam_sau': 'img_sau', 'cam_qr': 'img_qr' };
    Object.keys(camMap).forEach(camId => {
        $(`#${camId}`).on('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                const targetId = camMap[camId];
                const dt = new DataTransfer();
                dt.items.add(file);
                document.getElementById(targetId).files = dt.files;
                handleImageInput(file, targetId);
            }
        });
    });
}

async function handleImageInput(file, targetId) {
    showLoading('Đang xử lý ảnh...');
    try {
        // Simplified flow: Skip cropping for PoC stability, go straight to preview & compress
        const reader = new FileReader();
        reader.onload = (e) => {
            $(`#preview_${targetId}`).removeClass('initially-hidden').find('img').attr('src', e.target.result);
        };
        reader.readAsDataURL(file);
    } finally {
        hideLoading();
    }
}

async function submitMoTaiKhoanForm(e) {
    e.preventDefault();
    const btn = $('#btnSubmitAccount');
    btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang nén ảnh...');
    
    $('#compress-progress-wrapper').removeClass('initially-hidden');
    const progressBar = $('#compress-progress-bar');
    
    try {
        // Extract basic data
        const data = {
            email: AppState.user.email,
            loai_hinh: $('#loai_hinh').val(),
            ten_kh: $('#ten_kh').val().trim(),
            cccd: $('#cccd').val().trim(),
            dkkd: $('#dkkd').val().trim(),
            sdt: $('#sdt').val().trim(),
            so_tk: '3800200' + $('#so_tk').val().trim(),
            ngay_mo: $('#ngay_mo').val(),
            // Images will be sent as Base64 placeholders or compressed strings
        };

        // Note: Image reading is async. For simplicity in this step, we read them as base64.
        const readImage = (id) => {
            const inp = document.getElementById(id);
            if (!inp || !inp.files[0]) return Promise.resolve(null);
            return new Promise(res => {
                const r = new FileReader();
                r.onload = (ev) => res(ev.target.result);
                r.readAsDataURL(inp.files[0]);
            });
        };

        progressBar.css('width', '50%');
        data.img_truoc = await readImage('img_truoc');
        data.img_sau = await readImage('img_sau');
        data.img_qr = await readImage('img_qr');
        progressBar.css('width', '100%');

        runAPI('api_submitRegistration', data, (res) => {
            showAlert('Thành công', 'Hồ sơ đã được gửi lên hệ thống!', 'success');
            $('#frm-mo-tk')[0].reset();
            $('.img-preview-box').addClass('initially-hidden');
            $('#compress-progress-wrapper').addClass('initially-hidden');
            btn.prop('disabled', false).html('<i class="bx bx-cloud-upload"></i> Gửi Hồ Sơ & Nén Ảnh');
        }, () => {
            btn.prop('disabled', false).html('<i class="bx bx-cloud-upload"></i> Thử lại');
        });

    } catch (err) {
        console.error("Submit error:", err);
        btn.prop('disabled', false).html('Lỗi - Thử lại');
    }
}

/**
 * FEATURE: DASHBOARD logic
 */
let monthlyChart = null;
let pieChart = null;

function initDashboard() {
    loadAdminData();
}

function loadAdminData() {
    runAPI('api_getAdminDashboardData', {}, (res) => {
        const stats = JSON.parse(res.statsStr);
        renderDashboard(stats);
    });
}

function renderDashboard(s) {
    $('#db-total').text(s.total);
    $('#db-pending').text(s.pending);
    $('#db-approved').text(s.approved);
    $('#db-ca-nhan').text(s.caNhan);
    $('#db-hkd-count').text(s.hkd);

    // Top Staff
    let staffHtml = '';
    (s.topStaffs || []).forEach((st, i) => {
        staffHtml += `<div class="d-flex justify-content-between p-2 rounded ${i===0?'bg-warning-subtle':''}">
            <span>${i+1}. ${st.name}</span>
            <span class="badge bg-primary rounded-pill">${st.total} KH</span>
        </div>`;
    });
    $('#db-topstaff').html(staffHtml);

    // Table
    let tableHtml = '';
    (s.allData || []).forEach(d => {
        tableHtml += `<tr>
            <td><small>${utils_formatVN(d['Thời điểm nhập'])}</small></td>
            <td class="fw-bold">${d['Tên khách hàng']}</td>
            <td>${d['Số CCCD']}</td>
            <td>${d['Loại hình dịch vụ']}</td>
            <td>${d['Cán bộ thực hiện'] ? d['Cán bộ thực hiện'].split('@')[0] : '' }</td>
            <td><span class="badge bg-success">${d['Trạng thái']}</span></td>
            <td class="text-end"><button class="btn btn-sm btn-outline-primary"><i class='bx bx-search'></i></button></td>
        </tr>`;
    });
    $('#tblKH tbody').html(tableHtml);
    if ($.fn.DataTable.isDataTable('#tblKH')) $('#tblKH').DataTable().destroy();
    $('#tblKH').DataTable({ responsive: true });

    // Charts
    renderCharts(s);
}

function renderCharts(s) {
    // Pie Chart
    const ctxPie = document.getElementById('chartLoaiHinh');
    if (ctxPie) {
        if (pieChart) pieChart.destroy();
        pieChart = new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: ['Cá nhân', 'HKD'],
                datasets: [{
                    data: [s.loaiHinh['Cá nhân'], s.loaiHinh['Hộ kinh doanh']],
                    backgroundColor: ['#10b981', '#f59e0b']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // Monthly Chart
    const ctxBar = document.getElementById('chartMonthly');
    if (ctxBar) {
        if (monthlyChart) monthlyChart.destroy();
        // Simplified: use dummy months for now or extract from s if available
        monthlyChart = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6'],
                datasets: [{ label: 'Hồ sơ', data: [12, 19, 3, 5, 2, 3], backgroundColor: '#10b981' }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}
