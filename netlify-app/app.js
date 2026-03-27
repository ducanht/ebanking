/**
 * NETLIFY HIGH-FIDELITY APP ENGINE (app.js)
 * Phiên bản nâng cấp: Hỗ trợ OpenCV, Nén ảnh tự động, Dashboard và DataTables chuyên nghiệp.
 * Hệ thống giao tiếp với GAS Backend qua API JSON (doPost).
 */

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyXBMdJO2JmoaarxW9l7mg-l4tyN6BF1U01jaMPQ48xmVOZM9WFWLnOTIc9Wyf1OpFr/exec";

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
        // Sử dụng text/plain để tránh kích hoạt CORS Preflight (OPTIONS request) mà GAS không hỗ trợ
        const response = await fetch(GAS_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({ action: action, data: data })
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const result = await response.json();
        
        if (loadingMsg !== 'NONE') hideLoading();
        if (successHandler) successHandler(result);
        return result;

    } catch (error) {
        if (loadingMsg !== 'NONE') hideLoading();
        console.error(`API Error [${action}]:`, error);
        
        // Trình duyệt có thể ném lỗi "Failed to fetch" nếu URL sai hoặc CORS bị chặn
        const errorMsg = error.message === 'Failed to fetch' 
            ? 'Không thể kết nối tới máy chủ API. Vui lòng kiểm tra lại GAS_API_URL trong app.js.'
            : error.message;

        if (errorHandler) errorHandler(error);
        else showAlert('Lỗi kết nối', errorMsg, 'error');
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
    $('.view-section').addClass('d-none');
    $(`#${viewId}`).removeClass('d-none');
}

function showAlert(title, text, icon) {
    Swal.fire({ title, text, icon, confirmButtonColor: '#10b981' });
}

function checkDuplicate(input) {
    const val = input.value.trim();
    if (!val) {
        $(input).removeClass('is-invalid');
        input.setCustomValidity('');
        return;
    }
    
    if (!input.checkValidity()) {
        $(input).addClass('is-invalid');
        return;
    }

    runAPI('api_validateduplicate', { field: input.id, value: val }, (res) => {
        if (res && res.isDup) {
            input.setCustomValidity(res.msg || 'Giá trị này đã tồn tại!');
            $(input).addClass('is-invalid');
            if ($(input).siblings('.invalid-feedback').length) {
                $(input).siblings('.invalid-feedback').text(res.msg || 'Giá trị này đã tồn tại!');
            }
        } else {
            input.setCustomValidity('');
            $(input).removeClass('is-invalid');
            if (input.id === 'cccd') $(input).siblings('.invalid-feedback').text('Căn cước công dân bắt buộc đúng 12 chữ số.');
            else if (input.id === 'sdt') $(input).siblings('.invalid-feedback').text('SĐT bắt buộc bắt đầu bằng 0 và đủ 10 chữ số.');
            else if (input.id === 'so_tk') $(input).siblings('.invalid-feedback').text('Cần nhập đúng 9 chữ số cuối.');
        }
    }, null, 'NONE');
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
    console.log("OpenCV.js matches production version & logic ready.");
    // Un-disable any camera buttons if they were disabled
    $('.btn-outline-primary i.bx-camera, .btn-outline-primary i.bx-qr-scan').closest('.btn').prop('disabled', false).removeClass('disabled');
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
        
        // Cleanup memory
        if (imageMatStore[currentInputTargetId]) {
            imageMatStore[currentInputTargetId].delete();
            delete imageMatStore[currentInputTargetId];
        }
        
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
            
            // Cleanup memory
            if (imageMatStore[currentInputTargetId]) {
                imageMatStore[currentInputTargetId].delete();
                delete imageMatStore[currentInputTargetId];
            }
            
            bootstrap.Modal.getInstance(document.getElementById('cropModal')).hide();
        }, 'image/jpeg', 0.85);
    } else {
        bootstrap.Modal.getInstance(document.getElementById('cropModal')).hide();
    }
}

// Global cleanup when modal is closed (any way)
$(document).ready(() => {
    $('#cropModal').on('hidden.bs.modal', function () {
        // Clear all mats if any left
        Object.keys(imageMatStore).forEach(key => {
            try { imageMatStore[key].delete(); } catch(e) {}
            delete imageMatStore[key];
        });
    });
});

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
        action: "api_submitregistration",
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
    
    runAPI('api_submitregistration', data, (res) => {
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
    
    runAPI('api_getmycustomers', { email: AppState.user.email }, (res) => {
        if (res.status === 'success') {
            AppCache.set('myCustomers', res);
            renderMyCustomersTable(res.data || []);
            renderStaffDashboardLocal(res.data || []);
            
            // Fetch rankings silently
            runAPI('api_getadmindashboarddata', {}, (adminRes) => {
                if (adminRes.status === 'success') {
                    updateStaffRankings(adminRes.data, AppState.user.email);
                }
            }, null, 'NONE');
        } else {
            $('#tbMyCustomersBody').html(`<tr><td colspan="7" class="text-center text-danger py-4">Lỗi: ${res.message}</td></tr>`);
        }
    }, null, 'NONE');
}

function renderStaffDashboardLocal(data) {
    let caNhan = 0, hkd = 0;
    let timeline = {};

    data.forEach(d => {
        if (d['Loại hình dịch vụ'] === 'Cá nhân') caNhan++;
        else if (d['Loại hình dịch vụ'] === 'Hộ kinh doanh') hkd++;

        let rawDate = new Date(d["Thời điểm nhập"]);
        if (!isNaN(rawDate)) {
            let strDate = `${String(rawDate.getDate()).padStart(2,"0")}/${String(rawDate.getMonth()+1).padStart(2,"0")}`;
            timeline[strDate] = (timeline[strDate] || 0) + 1;
        }
    });

    $('#staffDash-canhan').text(caNhan);
    $('#staffDash-hkd').text(hkd);

    // Render chart
    renderStaffLineChart(timeline);
}

function updateStaffRankings(adminData, email) {
    if(!adminData || !adminData.allStaffs) return;
    
    let staffs = adminData.allStaffs;
    let rank = staffs.findIndex(s => s.email === email) + 1;
    let me = staffs.find(s => s.email === email);
    
    if (rank > 0) {
        $('#staffDash-rank').text(`#${rank} / ${staffs.length}`);
    } else {
        $('#staffDash-rank').text('Chưa xếp hạng');
    }

    if (staffs.length > 0) {
        let top1 = staffs[0];
        $('#staffDash-top1Name').text(top1.name || top1.email);
        $('#staffDash-top1Count').text(`${top1.total} hồ sơ`);
    }
}

let staffChartInstance = null;
function renderStaffLineChart(timeline) {
    const ctx = document.getElementById('chartStaffMonthly');
    if (!ctx) return;
    
    // Last 30 days calculation
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
        const statusColor = d['Trạng thái'] === 'Đã xác minh' ? 'text-success' : 'text-warning';
        return `
            <tr onclick="openEditCustomerModal('${d.ID || d['Mã GD']}')" class="cursor-pointer">
                <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
                <td class="fw-bold">${d['Tên khách hàng']}</td>
                <td><small>${d['Số CCCD']}</small></td>
                <td><small>${d['Số GP ĐKKD'] || ''}</small></td>
                <td><span class="badge bg-light text-dark border">${d['Loại hình dịch vụ']}</span></td>
                <td><small>${d['Số điện thoại']}</small></td>
                <td>${AppState.user ? AppState.user.name : (d['Cán bộ thực hiện'] || '')}</td>
                <td><small>${d['Ngày mở TK'] || d['Ngày mở'] || ''}</small></td>
                <td><small>${d['Số TK'] || d['Số tài khoản'] || ''}</small></td>
                <td><small>${d['Trạng thái'] || ''}</small></td>
                <td class="text-end"><button class="btn btn-sm btn-outline-primary shadow-sm"><i class="bx bx-search-alt"></i> Chi tiết</button></td>
            </tr>
        `;
    }).join('');

    $('#tbMyCustomersBody').html(html || '<tr><td colspan="8" class="text-center text-muted py-4">Chưa có hồ sơ nào.</td></tr>');
    
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
                    exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
                    title: 'Ho_So_Ca_Nhan_' + new Date().toISOString().slice(0,10)
                }
            ],
            language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json" },
            search: { smart: true },
            columnDefs: [
                { targets: [3, 6, 7, 8, 9], visible: false },
                { targets: [10], orderable: false, searchable: false }
            ]
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
            let s = null;
            if (res.statsStr) {
                try { s = JSON.parse(res.statsStr); } catch(e) { console.error("Parse statsStr error", e); }
            } else {
                s = res.stats;
            }

            if (!s) {
                console.error("Dashboard stats is null", res);
                return;
            }

            renderAdminStats(s);
            renderAdminCharts(s);
            renderAdminTable(s.allData || [], s.allStaffs || []);
            renderAdminTopStaff(s.allStaffs || []);

            // Initialize Flatpickr for date filters
            if (typeof flatpickr !== 'undefined') {
                flatpickr('#filterFromDate', { altInput: true, altFormat: 'd/m/Y', dateFormat: 'Y-m-d' });
                flatpickr('#filterToDate', { altInput: true, altFormat: 'd/m/Y', dateFormat: 'Y-m-d' });
            }
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
    window._adminAllData = allData.sort((a,b) => (new Date(b['Thời điểm nhập']) || 0) - (new Date(a['Thời điểm nhập']) || 0));
    window._adminRawStaffs = allStaffs;

    const staffMap = {};
    allStaffs.forEach(st => staffMap[st.email] = st.name);
    
    const html = window._adminAllData.map(d => {
        const staffName = staffMap[d['Cán bộ thực hiện']] || d['Cán bộ thực hiện'];
        return `
            <tr onclick="openEditCustomerModal('${d.ID}')" class="cursor-pointer">
                <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
                <td class="fw-bold text-dark">${d['Tên khách hàng'] || ''}</td>
                <td><span class="badge bg-light text-dark border">${d['Loại hình dịch vụ'] || 'Cá nhân'}</span></td>
                <td>${d['Số tài khoản'] || ''}</td>
                <td>${(d['Số ĐKKD'] || d['Số GP ĐKKD'] || '').toString().replace(/^'/, '')}</td>
                <td>${(d['Số CCCD'] || '').toString().replace(/^'/, '')}</td>
                <td>${d['Số điện thoại'] || ''}</td>
                <td>${d['Tên đăng nhập'] || ''}</td>
                <td>${d['Mật khẩu'] || ''}</td>
                <td>${staffName}</td>
                <td class="text-truncate" style="max-width: 150px;" title="${staffName}">
                    <small class="text-secondary">${staffName}</small>
                    <span class="d-none">${d['Cán bộ thực hiện']}</span>
                </td>
                <td><span class="badge ${d['Trạng thái'] === 'Đã xác minh' ? 'bg-success' : 'bg-warning'}">${d['Trạng thái']}</span></td>
                <td class="text-end"><button class="btn btn-sm btn-outline-primary" onclick="openEditCustomerModal('${d.ID}')"><i class="bx bx-info-circle"></i></button></td>
            </tr>
        `;
    }).join('');

    $('#tblKH tbody').html(html);
    
    // Populate Staff Filter if empty
    const selStaff = $('#filterStaffAdmin');
    if (selStaff.find('option').length <= 1) {
        allStaffs.forEach(st => {
            selStaff.append(`<option value="${st.email}">${st.name}</option>`);
        });
    }
    const dtAdmin = $('#tblKH').DataTable({
        responsive: true,
        order: [[0, 'desc']],
        dom: "<'row mb-2'<'col-sm-12 col-md-4 d-flex align-items-center justify-content-start'l><'col-sm-12 col-md-4 d-flex align-items-center justify-content-center'B><'col-sm-12 col-md-4 d-flex align-items-center justify-content-end'f>>" +
             "<'row'<'col-sm-12'tr>>" +
             "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: [{
            extend: 'excelHtml5',
            text: '<i class="bx bxs-file-export"></i> Xuất Excel',
            className: 'btn btn-sm btn-success shadow-sm',
            exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11] },
            title: 'Bao_Cao_KH_YenTho_' + new Date().toISOString().slice(0,10)
        }],
        language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json" },
        search: { caseInsensitive: true, smart: true },
        columnDefs: [
            { targets: [3, 4, 5, 6, 7, 8, 9], visible: false },
            { targets: [12], orderable: false, searchable: false }
        ]
    });

    // Custom filtering function which will search data in column 0 (Thời gian)
    $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
        if (settings.nTable.id !== 'tblKH') return true;
        
        const minVal = $('#filterFromDate').val(); // YYYY-MM-DD
        const maxVal = $('#filterToDate').val(); // YYYY-MM-DD
        const dateStr = window._adminAllData[dataIndex]['Thời điểm nhập']; // Original data
        if (!dateStr) return true;
        
        const rowDate = new Date(dateStr).toISOString().slice(0, 10);
        
        if (minVal && rowDate < minVal) return false;
        if (maxVal && rowDate > maxVal) return false;
        return true;
    });

    $('#filterStaffAdmin').off('change').on('change', function() {
        dtAdmin.column(9).search($(this).val()).draw();
    });

    $('#filterFromDate, #filterToDate').on('change', function() {
        dtAdmin.draw();
    });
}
// --- MONTHLY CHARTS ---
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

// --- ALL STAFF MODAL ---
let dtAllStaffs = null;
function showAllStaffModal() {
    try {
        const arr = window._adminRawStaffs || [];
        let html = '';
        arr.forEach((st, idx) => {
            html += `<tr><td>${idx+1}</td><td class="fw-bold">${st.name}</td><td>${st.department}</td><td>${st.email}</td><td>${st.total}</td><td>${st.caNhan||0}</td><td>${st.hkd||0}</td></tr>`;
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

// --- CUSTOMER & IMAGE MODAL ---
function openEditCustomerModal(id) {
    try {
        if (!id) return;
        let sourceData = (AppState.user && AppState.user.role === 'Admin') ? (window._adminAllData || []) : ((AppCache.get('myCustomers') || {}).data || []);
        for (let i = 0; i < sourceData.length; i++) {
            if (String(sourceData[i]['ID'] || sourceData[i]['Mã GD']).trim() === String(id).trim()) {
                row = sourceData[i];
                break;
            }
        }
        if (!row) return;

        $('#edit_id').val(id);
        $('#edit_ten_kh').val(row['Tên khách hàng'] || '');
        $('#edit_sdt').val((row['Số điện thoại'] || '').toString().replace(/^'/, ''));
        
        let dDate = row['Ngày mở TK'] || row['Thời điểm nhập'] || '';
        if (dDate) {
            const rawD = new Date(dDate);
            if (!isNaN(rawD)) {
                dDate = String(rawD.getDate()).padStart(2, '0') + '/' + String(rawD.getMonth() + 1).padStart(2, '0') + '/' + rawD.getFullYear();
            }
        }
        $('#edit_ngay_mo').val(dDate);
        
        let stk = (row['Số TK'] || row['Số tài khoản'] || '').toString().replace(/^'/, '');
        if (stk.length > 7 && stk.startsWith('3800200')) stk = stk.substring(7);
        $('#edit_so_tk').val(stk);

        if (AppState.user && AppState.user.role === 'Admin') {
            $('#btnSaveEdit').hide();
            $('#frmEditCustomer input').prop('readonly', true);
        } else {
            $('#btnSaveEdit').show();
            $('#frmEditCustomer input').prop('readonly', false);
            $('#edit_id').prop('readonly', true);
        }

        const loaiHinh = row['Loại hình dịch vụ'] || 'Cá nhân';
        const cccdVal = (row['Số CCCD'] || '').toString().replace(/^'/, '');
        const infoHtml = `<div class="col-12 mb-2"><div class="p-2 bg-white rounded border d-flex gap-2 shadow-sm">
                           <span class="badge bg-primary">${loaiHinh}</span>
                           <span>CCCD: <b>${cccdVal}</b></span></div></div>`;
                           
        const getImgHtml = (url, label) => {
            if (!url || url.trim() === '') return '';
            let safeUrl = url.trim();
            if (safeUrl.indexOf('drive.google.com/file/d/') > -1) {
                const fileId = safeUrl.split('/d/')[1].split('/')[0];
                safeUrl = 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w800';
            }
            return `<div class="col-4">
                        <a href="${url}" target="_blank" title="Xem ảnh">
                            <div class="img-detail-box">
                                <img src="${safeUrl}" class="img-detail-inner" alt="${label}" onerror="this.parentElement.innerHTML='<span class=\\'text-muted small\\'>Không hỗ trợ</span>'">
                            </div>
                            <small class="d-block text-center mt-1 text-secondary">${label}</small>
                        </a>
                    </div>`;
        };
        
        const imgs = getImgHtml(row['URL CCCD Trước'] || '', 'Mặt trước')
                   + getImgHtml(row['URL CCCD Sau'] || '', 'Mặt sau')
                   + (loaiHinh !== 'Cá nhân' ? getImgHtml(row['URL GP DKKD'] || row['URL DKKD'] || '', 'GP ĐKKD') : '')
                   + getImgHtml(row['URL QR'] || row['URL Mã QR'] || '', 'QR TK')
                   + getImgHtml(row['URL Ảnh Thực Hiện'] || row['URL Thực Hiện'] || '', 'Ảnh GD');
                   
        const imgsBlock = imgs ? `<div class="col-12"><p class="text-muted small fw-semibold mb-1"><i class="bx bx-image"></i> Hình ảnh đính kèm</p><div class="row g-2">${imgs}</div></div>` : '<div class="col-12 text-center text-muted"><p class="small">Chưa có ảnh đính kèm</p></div>';
        
        $('#edit_images_container').html(infoHtml + imgsBlock);
        $('#modalEditCustomer').modal('show');
    } catch(err) { console.error(err); }
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
    $('#frmChangePassword').on('submit', handleChangePassword);
    $('#frmEditCustomer').on('submit', handleEditCustomer);
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
            if (res.requirePasswordChange) {
                $('#modalChangePassword').modal('show');
                $('#pwdAlertForce').removeClass('initially-hidden').show();
                $('#modalChangePassword .btn-close').hide();
                $('#modalChangePassword').attr('data-bs-keyboard', 'false');
                hideLoading();
            } else {
                handleLoginSuccess(false);
            }
        } else showAlert('Lỗi', res.message, 'error');
    });
}

function handleChangePassword(e) {
    e.preventDefault();
    if (!AppState.user) return;
    
    const oldP = $('#pwdOld').val();
    const newP = $('#pwdNew').val();
    const newPc = $('#pwdNewConfirm').val();
    
    if (newP !== newPc) {
        showAlert('Lỗi', 'Mật khẩu mới không khớp!', 'warning');
        return;
    }
    
    const btn = $('#btnSubmitChangePwd');
    const oldHtml = btn.html();
    btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
    
    runAPI('api_changepassword', {
        email: AppState.user.email,
        oldHashed: CryptoJS.SHA256(oldP).toString(),
        newHashed: CryptoJS.SHA256(newP).toString()
    }, (res) => {
        btn.prop('disabled', false).html(oldHtml);
        if (res.status === 'success') {
            showAlert('Thành công', 'Đổi mật khẩu thành công! Vui lòng truy cập hệ thống.', 'success');
            $('#modalChangePassword').modal('hide');
            handleLoginSuccess(false);
        } else {
            showAlert('Lỗi', res.message, 'error');
        }
    });
}

/**
 * Xử lý Lưu thay đổi Hồ sơ Khách hàng
 */
function handleEditCustomer(e) {
    e.preventDefault(); // Ngăn reload trang khi submit form

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
        ngay_mo:   $('#edit_ngay_mo').val(),
        so_tk:     ($('#edit_so_tk').val().trim() ? '3800200' + $('#edit_so_tk').val().trim() : '')
    };

    runAPI('api_updatecustomer', payload, (res) => {
        btn.prop('disabled', false).html(oldHtml);
        if (res && res.status === 'success') {
            AppCache.clear('myCustomers'); // Xoa cache để load lai du lieu moi
            Swal.fire({
                title: 'Lưu thành công!',
                text: 'Hồ sơ đã được cập nhật.',
                icon: 'success',
                confirmButtonColor: '#10b981',
                confirmButtonText: 'Đóng'
            }).then(() => {
                $('#modalEditCustomer').modal('hide');
                if (AppState.user && AppState.user.role !== 'Admin') {
                    initMyCustomersList(); // Reload lại danh sách sau khi lưu thành công
                }
            });
        } else {
            showAlert('Lỗi', (res && res.message) ? res.message : 'Không thể cập nhật hồ sơ. Vui lòng thử lại.', 'error');
        }
    }, () => {
        btn.prop('disabled', false).html(oldHtml);
    }, 'Đang lưu hồ sơ...');
}

function handleLoginSuccess(silent) {
    hideLoading();
    const userName = AppState.user.fullName || AppState.user.name || AppState.user.email;
    if (!silent) showAlert('Thành công', `Chào mừng ${userName}!`, 'success');
    
    $('#user-name-display-admin').text(userName);
    $('#user-name-display-user').text(userName);
    
    if (AppState.user.role === 'Admin') {
        $('#staffBottomNav').addClass('d-none');
        showView('view-dashboard');
        initDashboard();
    } else {
        $('#staffBottomNav').removeClass('d-none');
        showView('view-mo-tai-khoan');
        initMoTaiKhoanForm();
    }
}

function logout() {
    localStorage.removeItem('HOKINHDOANH_SESSION');
    sessionStorage.removeItem('HOKINHDOANH_SESSION');
    AppCache.clearAll();
    AppState.user = null;
    $('#frm-login')[0].reset();
    window.location.reload();
}

window.onOpenCvReady = onOpenCvReady;
window.loadStaffOpenAccountView = () => showView('view-mo-tai-khoan');
window.loadStaffMyCustomersView = () => { showView('view-my-customers'); initMyCustomersList(); };
window.logout = logout;
window.finishCropping = finishCropping;
window.skipCropping = skipCropping;
