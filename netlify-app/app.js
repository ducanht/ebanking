/**
 * NETLIFY HIGH-FIDELITY APP ENGINE (app.js)
 * Phiên bản nâng cấp: Hỗ trợ OpenCV, Nén ảnh tự động, Dashboard và DataTables chuyên nghiệp.
 * Hệ thống giao tiếp với GAS Backend qua API JSON (doPost).
 */

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzf4m3V5P61c3XhU8T0Y4-U0o7B8hE_z6x9_7z6_7z6/exec"; // CẦN CẬP NHẬT URL THỰC TẾ

const AppState = {
    user: JSON.parse(localStorage.getItem('HOKINHDOANH_SESSION')) || null,
    VERSION: "2.0.0-HIFI",
    apiBase: "" // Sẽ được cập nhật từ URL triển khai
};

/**
 * CACHE SYSTEM
 */
const AppCache = {
    data: {},
    timestamp: {},
    TTL: 180000, 
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
 * CORE API WRAPPER
 */
async function runAPI(action, data = {}, successHandler, errorHandler, loadingMsg = 'Đang xử lý...') {
    if (loadingMsg !== 'NONE') showLoading(loadingMsg);

    try {
        const response = await fetch(GAS_API_URL, {
            method: "POST",
            mode: "no-cors", // Quan trọng cho GAS
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, ...data })
        });

        // Với no-cors, chúng ta không đọc được body trực tiếp. 
        // Tuy nhiên, chúng ta sẽ sử dụng một trick: GAS sẽ redirect về một URL chứa kết quả nếu cần, 
        // hoặc chúng ta dùng JSONP/CORS chuẩn nếu người dùng đã cấu hình.
        // Ở đây, giả định GAS đã được cấu hình CORS chuẩn (trả về Content-Type: application/json).
        
        // TRICK: Vì fetch no-cors không đọc được response, 
        // nhưng GAS Web App bản chất là hỗ trợ CORS nếu ta xử lý Option request hoặc dùng Redirect.
        // Giải pháp tốt nhất cho Standalone là dùng CORS thực thụ (GAS trả về TextOutput).
        
        const realResponse = await fetch(GAS_API_URL, {
            method: "POST",
            body: JSON.stringify({ action, ...data })
        });
        
        const result = await realResponse.json();
        if (loadingMsg !== 'NONE') hideLoading();
        if (successHandler) successHandler(result);
        return result;

    } catch (error) {
        if (loadingMsg !== 'NONE') hideLoading();
        console.error(`API Error [${action}]:`, error);
        if (errorHandler) errorHandler(error);
        else showAlert('Lỗi kết nối', 'Không thể kết nối tới máy chủ GAS. Vui lòng kiểm tra đường truyền.', 'error');
    }
}

// --- UI UTILS ---
function showLoading(msg = 'Đang tải...') {
    $('#global-spinner h5').text(msg);
    $('#global-spinner').css('display', 'flex');
}

function hideLoading() {
    $('#global-spinner').hide();
}

function showView(viewId) {
    $('.view-item').addClass('view-item-hidden');
    $(`#${viewId}`).removeClass('view-item-hidden');
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

/**
 * OPENCV & IMAGE PROCESSING (PORTED)
 */
let isCvReady = false;
let currentInputTargetId = null;
let quadPoints = [ {x:0.1, y:0.1}, {x:0.9, y:0.1}, {x:0.9, y:0.9}, {x:0.1, y:0.9} ];
let activePointIndex = -1;
let imageMatStore = {};

function onOpenCvReady() {
    isCvReady = true;
    console.log("OpenCV.js matches production version.");
}

function processImageWithAI(source) {
    return new Promise((resolve) => {
        if (!isCvReady || !window.cv) return resolve(source);
        const img = new Image();
        img.onload = () => {
            let src, dst, contours, hierarchy, maxContour;
            try {
                src = cv.imread(img);
                dst = new cv.Mat();
                cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
                cv.GaussianBlur(dst, dst, new cv.Size(5, 5), 0);
                cv.Canny(dst, dst, 75, 200, 3, false);
                contours = new cv.MatVector();
                hierarchy = new cv.Mat();
                cv.findContours(dst, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
                let maxArea = 0;
                for (let i = 0; i < contours.size(); ++i) {
                    const cnt = contours.get(i);
                    const area = cv.contourArea(cnt);
                    if (area > maxArea) {
                        const peri = cv.arcLength(cnt, true);
                        const approx = new cv.Mat();
                        cv.approxPolyDP(cnt, approx, 0.02 * peri, true);
                        if (approx.rows === 4) {
                            maxArea = area;
                            if (maxContour) maxContour.delete();
                            maxContour = approx;
                        } else approx.delete();
                    }
                }
                if (maxContour && maxArea > (src.rows * src.cols * 0.1)) {
                    const pArr = [];
                    for (let j = 0; j < 4; j++) {
                        pArr.push({ x: maxContour.data32S[j * 2] / src.cols, y: maxContour.data32S[j * 2 + 1] / src.rows });
                    }
                    quadPoints = sortPoints(pArr);
                }
                resolve(source);
            } catch(e) { resolve(source); }
            finally {
                if(src) src.delete(); if(dst) dst.delete();
                if(contours) contours.delete(); if(hierarchy) hierarchy.delete();
                if(maxContour) maxContour.delete();
            }
        };
        img.onerror = () => resolve(source);
        if (source instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => img.src = e.target.result;
            reader.readAsDataURL(source);
        } else img.src = source.toDataURL();
    });
}

function sortPoints(pts) {
    const sorted = new Array(4);
    const sum = pts.map(p => p.x + p.y);
    const diff = pts.map(p => p.x - p.y);
    sorted[0] = pts[sum.indexOf(Math.min(...sum))];
    sorted[2] = pts[sum.indexOf(Math.max(...sum))];
    sorted[1] = pts[diff.indexOf(Math.max(...diff))];
    sorted[3] = pts[diff.indexOf(Math.min(...diff))];
    return sorted;
}

function startCroppingFlow(source, targetId) {
    currentInputTargetId = targetId;
    const img = new Image();
    img.onload = function() {
        const canvas = document.getElementById('quad-canvas');
        const ctx = canvas.getContext('2d');
        const scale = Math.min((window.innerWidth * 0.9) / img.width, (window.innerHeight * 0.7) / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if(imageMatStore[targetId]) { try { imageMatStore[targetId].delete(); } catch(e){} }
        imageMatStore[targetId] = cv.imread(img);
        updateQuadUI();
        initQuadInteraction();
        (new bootstrap.Modal(document.getElementById('cropModal'))).show();
    };
    if (source instanceof HTMLCanvasElement) img.src = source.toDataURL('image/jpeg');
    else {
        const reader = new FileReader();
        reader.onload = (e) => img.src = e.target.result;
        reader.readAsDataURL(source);
    }
}

function updateQuadUI() {
    const svg = document.getElementById('quad-svg');
    const poly = document.getElementById('quad-poly');
    const w = svg.clientWidth, h = svg.clientHeight;
    let pointStr = "";
    quadPoints.forEach((p, i) => {
        const px = p.x * w, py = p.y * h;
        const circle = document.getElementById('p' + i);
        circle.setAttribute('cx', px);
        circle.setAttribute('cy', py);
        pointStr += `${px},${py} `;
    });
    poly.setAttribute('points', pointStr.trim());
}

function initQuadInteraction() {
    const svg = document.getElementById('quad-svg');
    const handleMove = (e) => {
        if (activePointIndex === -1) return;
        const rect = svg.getBoundingClientRect();
        const touch = e.touches ? e.touches[0] : e;
        const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
        quadPoints[activePointIndex] = { x, y };
        updateQuadUI();
    };
    const handleEnd = () => {
        activePointIndex = -1;
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('touchmove', handleMove);
    };
    for (let i = 0; i < 4; i++) {
        const circle = document.getElementById('p' + i);
        const start = (e) => {
            activePointIndex = i;
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleMove, {passive:false});
            window.addEventListener('touchend', handleEnd);
        };
        circle.onmousedown = start;
        circle.ontouchstart = start;
    }
}

function finishCropping() {
    const mat = imageMatStore[currentInputTargetId];
    if (!mat) return;
    const srcPoints = [];
    quadPoints.forEach(p => { srcPoints.push(p.x * mat.cols); srcPoints.push(p.y * mat.rows); });
    const w = Math.max(Math.hypot(srcPoints[4]-srcPoints[6], srcPoints[5]-srcPoints[7]), Math.hypot(srcPoints[2]-srcPoints[0], srcPoints[3]-srcPoints[1]));
    const h = Math.max(Math.hypot(srcPoints[2]-srcPoints[4], srcPoints[3]-srcPoints[5]), Math.hypot(srcPoints[0]-srcPoints[6], srcPoints[1]-srcPoints[7]));
    const srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, srcPoints);
    const dstCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, w, 0, w, h, 0, h]);
    const M = cv.getPerspectiveTransform(srcCoords, dstCoords);
    const warpedMat = new cv.Mat();
    cv.warpPerspective(mat, warpedMat, M, new cv.Size(w, h), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    const outCanvas = document.createElement('canvas');
    cv.imshow(outCanvas, warpedMat);
    outCanvas.toBlob((blob) => {
        const file = new File([blob], `${currentInputTargetId}.jpg`, { type: "image/jpeg" });
        const input = document.getElementById(currentInputTargetId);
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        $(`#preview_${currentInputTargetId}`).removeClass('initially-hidden').show().find('img').attr('src', outCanvas.toDataURL('image/jpeg'));
        bootstrap.Modal.getInstance(document.getElementById('cropModal')).hide();
    }, 'image/jpeg', 0.8);
    srcCoords.delete(); dstCoords.delete(); M.delete(); warpedMat.delete();
}

function skipCropping() {
    const mat = imageMatStore[currentInputTargetId];
    if (mat) {
        const outCanvas = document.createElement('canvas');
        cv.imshow(outCanvas, mat);
        outCanvas.toBlob((blob) => {
            const file = new File([blob], `${currentInputTargetId}_raw.jpg`, { type: "image/jpeg" });
            const input = document.getElementById(currentInputTargetId);
            const dt = new DataTransfer();
            dt.items.add(file);
            input.files = dt.files;
            $(`#preview_${currentInputTargetId}`).removeClass('initially-hidden').show().find('img').attr('src', outCanvas.toDataURL('image/jpeg'));
            bootstrap.Modal.getInstance(document.getElementById('cropModal')).hide();
        }, 'image/jpeg', 0.85);
    } else bootstrap.Modal.getInstance(document.getElementById('cropModal')).hide();
}

/**
 * REGISTRATION LOGIC
 */
function initMoTaiKhoanForm() {
    flatpickr(".js-datepicker", { dateFormat: "Y-m-d", altInput: true, altFormat: "d/m/Y", defaultDate: "today" });
    
    $('#frm-mo-tk').off('submit').on('submit', handleRegistration);
    $('#loai_hinh').on('change', toggleFormFields);

    const uploads = ['img_truoc', 'img_sau', 'img_dkkd', 'img_qr', 'img_thuchien'];
    uploads.forEach(id => {
        $(`#${id}`).on('change', async function() {
            if (this.files && this.files[0]) {
                showLoading('Phân tích ảnh...');
                const processed = await processImageWithAI(this.files[0]);
                startCroppingFlow(processed, id);
                hideLoading();
            }
        });
        // Native camera triggers
        $(`input[id^="cam_"]`).on('change', function() {
            const targetId = this.id.replace('cam_', 'img_');
            if (this.files && this.files[0]) {
                const dt = new DataTransfer();
                dt.items.add(this.files[0]);
                document.getElementById(targetId).files = dt.files;
                $(`#${targetId}`).trigger('change');
            }
        });
    });
}

function toggleFormFields() {
    const isHKD = $('#loai_hinh').val() === 'Hộ kinh doanh';
    $('#div_dkkd, #div_img_dkkd, #div_ten_dang_nhap').toggle(isHKD);
    $('#dkkd, #img_dkkd').prop('required', isHKD);
}

async function handleRegistration(e) {
    e.preventDefault();
    const btn = $('#btnSubmitAccount');
    const oldBtn = btn.html();
    btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang nén ảnh...');

    const progressWrapper = $('#compress-progress-wrapper');
    const progressBar = $('#compress-progress-bar');
    progressWrapper.show();

    const fileSlots = [
        { id: 'img_truoc', label: 'CCCD Trước' },
        { id: 'img_sau', label: 'CCCD Sau' },
        { id: 'img_dkkd', label: 'Giấy phép' },
        { id: 'img_qr', label: 'Mã QR' },
        { id: 'img_thuchien', label: 'Ảnh thực hiện' }
    ];

    const data = {
        action: "api_submitAccountForm",
        email: AppState.user.email,
        loai_hinh: $('#loai_hinh').val(),
        ten_kh: $('#ten_kh').val().trim(),
        cccd: $('#cccd').val().trim(),
        dkkd: $('#dkkd').val().trim(),
        sdt: $('#sdt').val().trim(),
        so_tk: '3800200' + $('#so_tk').val().trim(),
        ten_dang_nhap: $('#ten_dang_nhap').val().trim(),
        ngay_mo: $('#ngay_mo').val(),
        mat_khau: $('#mat_khau').val() || ""
    };

    let done = 0;
    const total = fileSlots.filter(s => document.getElementById(s.id).files[0]).length || 1;

    for (const slot of fileSlots) {
        const file = document.getElementById(slot.id).files[0];
        if (file) {
            try {
                const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1200, useWebWorker: true };
                const compressed = await imageCompression(file, options);
                data[slot.id] = await imageCompression.getDataUrlFromFile(compressed);
                done++;
                const pct = Math.round((done / total) * 100);
                progressBar.css('width', `${pct}%`).text(`${pct}%`);
            } catch (err) {
                console.warn("Nén ảnh thất bại, dùng ảnh gốc:", err);
                data[slot.id] = await new Promise(r => {
                    const reader = new FileReader();
                    reader.onload = (e) => r(e.target.result);
                    reader.readAsDataURL(file);
                });
            }
        }
    }

    btn.html('<span class="spinner-border spinner-border-sm"></span> Đang lưu hồ sơ...');
    
    runAPI('api_submitAccountForm', data, (res) => {
        btn.prop('disabled', false).html(oldBtn);
        progressWrapper.hide();
        if (res.status === 'success') {
            showAlert('Thành công!', 'Hồ sơ đã được lưu và đồng bộ.', 'success');
            document.getElementById('frm-mo-tk').reset();
            $('.img-preview-box').hide();
            AppCache.clear('myCustomers');
        } else showAlert('Lỗi', res.message, 'error');
    }, () => btn.prop('disabled', false).html(oldBtn), 'NONE');
}

/**
 * STAFF CUSTOMER LOGIC
 */
async function initMyCustomersList() {
    if (!AppState.user) return;
    
    const cached = AppCache.get('myCustomers');
    if (cached) {
        renderMyCustomersTable(cached.data);
        return;
    }

    $('#tbMyCustomersBody').html('<tr><td colspan="7" class="text-center py-4"><span class="spinner-border text-primary"></span><br>Đang đồng bộ...</td></tr>');
    
    runAPI('api_getMyCustomers', { email: AppState.user.email }, (res) => {
        if (res.status === 'success') {
            AppCache.set('myCustomers', res);
            renderMyCustomersTable(res.data || []);
        } else {
            $('#tbMyCustomersBody').html(`<tr><td colspan="7" class="text-center text-danger py-4">Lỗi: ${res.message}</td></tr>`);
        }
    }, null, 'NONE');
}

function renderMyCustomersTable(data) {
    const html = data.slice().reverse().map(d => {
        const statusColor = d['Trạng thái'] === 'Đã xác minh' ? 'text-success' : 'text-warning';
        return `
            <tr onclick="openEditCustomerModal('${d.ID || d['Mã GD']}')" class="cursor-pointer">
                <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'])}</small></td>
                <td class="fw-bold">${d['Tên khách hàng']}<br><small class="text-secondary fw-normal">${d['Số điện thoại']}</small></td>
                <td><small>${d['Số CCCD']}</small></td>
                <td><small>${d['Số GP ĐKKD'] || ''}</small></td>
                <td><span class="badge bg-light text-dark border">${d['Loại hình dịch vụ']}</span></td>
                <td><span class="${statusColor} fw-bold"><i class="bx bxs-circle"></i> ${d['Trạng thái']}</span></td>
                <td><button class="btn btn-sm btn-outline-primary shadow-sm"><i class="bx bx-search-alt"></i> Chi tiết</button></td>
            </tr>
        `;
    }).join('');

    $('#tbMyCustomersBody').html(html || '<tr><td colspan="7" class="text-center text-muted py-4">Chưa có hồ sơ nào.</td></tr>');
    
    if ($.fn.DataTable.isDataTable('#tblMyCustomers')) $('#tblMyCustomers').DataTable().destroy();
    
    if (data.length > 0) {
        $('#tblMyCustomers').DataTable({
            responsive: true,
            dom: 'Bfrtip',
            buttons: [
                { extend: 'excelHtml5', text: '<i class="bx bxs-file-export"></i> Xuất Excel', className: 'btn btn-sm btn-success shadow-sm' }
            ],
            language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json" }
        });
    }
}
/**
 * DASHBOARD & DATA LOGIC
 */
let charts = {};

async function initDashboard() {
    runAPI('api_getAdminDashboardData', {}, (res) => {
        if (res.status === 'success') {
            const s = typeof res.stats === 'string' ? JSON.parse(res.stats) : res.stats;
            renderAdminStats(s);
            renderAdminCharts(s);
            renderAdminTable(s.allData, s.allStaffs);
        }
    });
}

function renderAdminStats(s) {
    $('#db-total').text(s.total || 0);
    $('#db-pending').text(s.pending || 0);
    $('#db-approved').text(s.approved || 0);
    $('#db-ca-nhan').text(s.caNhan || 0);
    $('#db-hkd-count').text(s.hkd || 0);
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
    const staffMap = {};
    allStaffs.forEach(st => staffMap[st.email] = st.name);
    
    const html = allData.map(d => `
        <tr onclick="openEditCustomerModal('${d.ID}')" class="cursor-pointer">
            <td><small>${utils_formatVN(d['Thời điểm nhập'], 'datetime')}</small></td>
            <td class="fw-bold">${d['Tên khách hàng']}</td>
            <td><small>${d['Số CCCD']}</small></td>
            <td><span class="badge bg-light text-dark border">${d['Loại hình dịch vụ']}</span></td>
            <td><small class="text-secondary">${staffMap[d['Cán bộ thực hiện']] || d['Cán bộ thực hiện']}</small></td>
            <td><span class="badge ${d['Trạng thái'] === 'Đã xác minh' ? 'bg-success' : 'bg-warning'}">${d['Trạng thái']}</span></td>
            <td class="text-end"><button class="btn btn-sm btn-outline-primary"><i class="bx bx-info-circle"></i></button></td>
        </tr>
    `).join('');

    $('#tblKH tbody').html(html);
    if ($.fn.DataTable.isDataTable('#tblKH')) $('#tblKH').DataTable().destroy();
    $('#tblKH').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: ['excelHtml5', 'pdfHtml5', 'print'],
        language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json" }
    });
}

/**
 * APP INITIALIZATION
 */
$(document).ready(() => {
    if (!AppState.user) {
        showView('view-login');
        hideLoading();
    } else {
        handleLoginSuccess(true);
    }

    $('#frm-login').on('submit', handleLogin);
});

function handleLogin(e) {
    e.preventDefault();
    const email = $('#loginEmail').val().trim();
    const pwd = $('#loginPassword').val();
    const hashedPwd = CryptoJS.SHA256(pwd).toString();

    runAPI('api_login', { email, password: hashedPwd }, (res) => {
        if (res.status === 'success') {
            AppState.user = res.user;
            localStorage.setItem('HOKINHDOANH_SESSION', JSON.stringify(res.user));
            handleLoginSuccess(false);
        } else showAlert('Lỗi', res.message, 'error');
    });
}

function handleLoginSuccess(silent) {
    hideLoading();
    if (!silent) showAlert('Thành công', `Chào mừng ${AppState.user.fullName}!`, 'success');
    
    if (AppState.user.role === 'Admin') {
        $('#staffBottomNav').hide();
        showView('view-dashboard');
        initDashboard();
    } else {
        $('#staffBottomNav').show();
        showView('view-mo-tai-khoan');
        initMoTaiKhoanForm();
    }
}

function logout() {
    localStorage.removeItem('HOKINHDOANH_SESSION');
    AppState.user = null;
    window.location.reload();
}

window.onOpenCvReady = onOpenCvReady;
window.loadStaffOpenAccountView = () => showView('view-mo-tai-khoan');
window.loadStaffMyCustomersView = () => { showView('view-my-customers'); initMyCustomersList(); };
window.logout = logout;
window.finishCropping = finishCropping;
window.skipCropping = skipCropping;
