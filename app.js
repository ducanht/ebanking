/**
 * NETLIFY HIGH-FIDELITY APP ENGINE (app.js)
 * Phiên bản nâng cấp: Hỗ trợ OpenCV, Nén ảnh tự động, Dashboard và DataTables chuyên nghiệp.
 * Hệ thống giao tiếp với GAS Backend qua API JSON (doPost).
 */

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyXBMdJO2JmoaarxW9l7mg-l4tyN6BF1U01jaMPQ48xmVOZM9WFWLnOTIc9Wyf1OpFr/exec";

const AppState = {
    user: JSON.parse(localStorage.getItem('HOKINHDOANH_SESSION')) || null,
    VERSION: "2.1.2-STABLE",
    apiBase: "",
    lastActive: Date.now()
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
$(document).on('click keydown scroll mousedown touchstart', () => AppState.lastActive = Date.now());
setInterval(checkInactivity, 5 * 60 * 1000);

// --- CẤU HÌNH EVENT DELEGATION: XỬ LÝ CLICK XEM CHI TIẾT ---
$(document).on('click', '.clickable-row', function(e) {
    // Nếu click vào nút Chi tiết hoặc thành phần bên trong nút, dừng lại để tránh trigger 2 lần
    if ($(e.target).is('button') || $(e.target).closest('button').length) return;
    
    const id = $(this).attr('data-id') || $(this).data('id');
    if (id) openEditCustomerModal(id);
});

// Xử lý riêng khi click trực tiếp vào nút Chi tiết
$(document).on('click', '.btn-detail', function(e) {
    e.stopPropagation(); // Ngăn chặn sự kiện lan lên thẻ tr
    const id = $(this).closest('tr').attr('data-id') || $(this).closest('tr').data('id');
    if (id) openEditCustomerModal(id);
});



/**
 * CACHE SYSTEM
 */
const AppCache = {
    data: {},
    timestamp: {},
    TTL: 300000, // 5 phút (tăng từ 3 phút để giảm request lên Vercel)
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
 * Hardened with Timeout (30s) and Auto-Retry (Max 2)
 */
async function runAPI(action, data = {}, successHandler, errorHandler, loadingMsg = 'Đang xử lý...', retryCount = 0) {
    if (loadingMsg !== 'NONE' && retryCount === 0) showLoading(loadingMsg);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout

    try {
        const response = await fetch(GAS_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({ action: action, data: data }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const result = await response.json();
        
        if (loadingMsg !== 'NONE') hideLoading();
        if (successHandler) successHandler(result);
        return result;

    } catch (error) {
        clearTimeout(timeoutId);
        
        // Auto-retry on timeout or network failure (max 2 times)
        if (retryCount < 2 && (error.name === 'AbortError' || error.message === 'Failed to fetch')) {
            console.warn(`API Retry [${action}] attempt ${retryCount + 1}...`);
            return runAPI(action, data, successHandler, errorHandler, loadingMsg, retryCount + 1);
        }

        if (loadingMsg !== 'NONE') hideLoading();
        console.error(`API Error [${action}]:`, error);
        
        let errorMsg = error.message;
        if (error.name === 'AbortError') errorMsg = 'Yêu cầu quá hạn (35s). Vui lòng thử lại.';
        else if (error.message === 'Failed to fetch') errorMsg = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng.';

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
    const lh = $('#loai_hinh').val(); // Lấy loại hình hiện tại
    if (!val) {
        $(input).removeClass('is-invalid');
        input.setCustomValidity('');
        return;
    }
    
    if (!input.checkValidity()) {
        $(input).addClass('is-invalid');
        return;
    }

    runAPI('api_validateduplicate', { field: input.id, value: val, loaiHinh: lh }, (res) => {
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
 * OPENCV & IMAGE PROCESSING
 * Hardened version based on GAS production frmMoTaiKhoan.html.
 */
let isCvReady = false;
let currentInputTargetId = null;
let quadPoints = [ {x:0.1, y:0.1}, {x:0.9, y:0.1}, {x:0.9, y:0.9}, {x:0.1, y:0.9} ];
let activePointIndex = -1;
let imageMatStore = {}; // Map: targetId -> cv.Mat (image)

function onOpenCvReady() {
    isCvReady = true;
    console.log('OpenCV.js ready (Netlify).');
}

/**
 * Giai phong tat ca Mat con ton dong trong imageMatStore
 */
function _cleanupAllMats() {
    Object.keys(imageMatStore).forEach(key => {
        try { imageMatStore[key].delete(); } catch(e) {}
        delete imageMatStore[key];
    });
}

/**
 * Giai phong Mat cho 1 targetId cu the
 */
function _cleanupMat(targetId) {
    if (imageMatStore[targetId]) {
        try { imageMatStore[targetId].delete(); } catch(e) {}
        delete imageMatStore[targetId];
    }
}

/**
 * Assign file an toan vao input[type=file]
 * DataTransfer co the that bai tren mot so trinh duyet Android cu.
 */
function assignFileToInput(inputId, file) {
    const input = document.getElementById(inputId);
    if (!input) return;
    try {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
    } catch (e) {
        // Fallback: luu custom de xu ly khi submit
        input._customFile = file;
        console.warn('DataTransfer not supported, using fallback for', inputId);
    }
}

/**
 * Phan tich anh bang OpenCV, phat hien goc tai lieu
 * Tra ve source goc neu CV chua san hoac khong nhan dang duoc
 */
function processImageWithAI(source) {
    return new Promise((resolve) => {
        if (!isCvReady || !window.cv) return resolve(source);
        const img = new Image();
        img.onload = () => {
            let src = null, dst = null, contours = null, hierarchy = null, maxContour = null;
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
                // Chi cap nhat quadPoints neu tim thay tam giac > 10% dien tich
                if (maxContour && maxArea > (src.rows * src.cols * 0.1)) {
                    const pArr = [];
                    for (let j = 0; j < 4; j++) {
                        pArr.push({ x: maxContour.data32S[j * 2] / src.cols, y: maxContour.data32S[j * 2 + 1] / src.rows });
                    }
                    quadPoints = sortPoints(pArr);
                } else {
                    // Reset ve vi tri mac dinh neu khong phat hien goc
                    quadPoints = [{x:0.1,y:0.1},{x:0.9,y:0.1},{x:0.9,y:0.9},{x:0.1,y:0.9}];
                }
                resolve(source);
            } catch(e) {
                console.warn('processImageWithAI error:', e);
                quadPoints = [{x:0.1,y:0.1},{x:0.9,y:0.1},{x:0.9,y:0.9},{x:0.1,y:0.9}];
                resolve(source);
            } finally {
                if (src) src.delete();
                if (dst) dst.delete();
                if (contours) contours.delete();
                if (hierarchy) hierarchy.delete();
                if (maxContour) maxContour.delete();
            }
        };
        img.onerror = () => resolve(source);
        if (source instanceof File || source instanceof Blob) {
            const reader = new FileReader();
            reader.onload = (ev) => img.src = ev.target.result;
            reader.readAsDataURL(source);
        } else if (source instanceof HTMLCanvasElement) {
            img.src = source.toDataURL();
        } else {
            resolve(source);
        }
    });
}

function sortPoints(pts) {
    if (!pts || pts.length !== 4) return [{x:0.1,y:0.1},{x:0.9,y:0.1},{x:0.9,y:0.9},{x:0.1,y:0.9}];
    const sorted = new Array(4);
    const sum = pts.map(p => p.x + p.y);
    const diff = pts.map(p => p.x - p.y);
    sorted[0] = pts[sum.indexOf(Math.min(...sum))];
    sorted[2] = pts[sum.indexOf(Math.max(...sum))];
    sorted[1] = pts[diff.indexOf(Math.max(...diff))];
    sorted[3] = pts[diff.indexOf(Math.min(...diff))];
    return sorted;
}

/**
 * Mo man hinh cat anh sau khi phan tich xong
 */
function startCroppingFlow(source, targetId) {
    // Guard: neu CV chua san hoac source khong hop le
    if (!source) {
        console.warn('startCroppingFlow: no source provided');
        return;
    }
    currentInputTargetId = targetId;
    const img = new Image();
    img.onload = function() {
        const canvas = document.getElementById('quad-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        // Tinh toan scale vu phu hop voi man hinh
        const maxW = Math.min(window.innerWidth * 0.92, 900);
        const maxH = window.innerHeight * 0.60;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        canvas.width  = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Luu Mat vao store (giai phong cai cu neu co)
        _cleanupMat(targetId);
        if (isCvReady && window.cv) {
            try { imageMatStore[targetId] = cv.imread(img); } catch(e) { console.warn('cv.imread failed:', e); }
        }

        // Dam bao quadPoints luon duoc reset truoc khi mo modal
        updateQuadUI();
        initQuadInteraction();

        // Hien modal
        const modalEl = document.getElementById('cropModal');
        let modal = bootstrap.Modal.getInstance(modalEl);
        if (!modal) modal = new bootstrap.Modal(modalEl);
        modal.show();
    };
    img.onerror = () => console.warn('startCroppingFlow: failed to load image');
    if (source instanceof File || source instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (ev) => img.src = ev.target.result;
        reader.readAsDataURL(source);
    } else if (source instanceof HTMLCanvasElement) {
        img.src = source.toDataURL('image/jpeg');
    } else {
        img.src = source;
    }
}

function updateQuadUI() {
    const svg = document.getElementById('quad-svg');
    const poly = document.getElementById('quad-poly');
    if (!svg || !poly) return;
    const w = svg.clientWidth, h = svg.clientHeight;
    let pointStr = "";
    quadPoints.forEach((p, i) => {
        const px = p.x * w, py = p.y * h;
        const circle = document.getElementById('p' + i);
        if (circle) { circle.setAttribute('cx', px); circle.setAttribute('cy', py); }
        pointStr += `${px},${py} `;
    });
    poly.setAttribute('points', pointStr.trim());
}

function initQuadInteraction() {
    const svg = document.getElementById('quad-svg');
    if (!svg) return;
    // Xoa event cu de tranh duplicate
    const newSvg = svg.cloneNode(true);
    svg.parentNode.replaceChild(newSvg, svg);
    const freshSvg = document.getElementById('quad-svg');

    const handleMove = (e) => {
        if (activePointIndex === -1) return;
        e.preventDefault();
        const rect = freshSvg.getBoundingClientRect();
        const touch = e.touches ? e.touches[0] : e;
        const x = Math.max(0, Math.min(1, (touch.clientX - rect.left)  / rect.width));
        const y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
        quadPoints[activePointIndex] = { x, y };
        updateQuadUI();
    };
    const handleEnd = () => {
        activePointIndex = -1;
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleEnd);
    };
    for (let i = 0; i < 4; i++) {
        const circle = document.getElementById('p' + i);
        if (!circle) continue;
        const start = (e) => {
            activePointIndex = i;
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleMove, {passive: false});
            window.addEventListener('touchend', handleEnd);
        };
        circle.onmousedown  = start;
        circle.ontouchstart = start;
    }
}

function finishCropping() {
    const mat = imageMatStore[currentInputTargetId];
    if (!mat || !isCvReady) {
        // Neu khong co mat (OpenCV chua san), skip ban lam phang nhung van luu anh
        skipCropping();
        return;
    }
    try {
        const srcPoints = [];
        quadPoints.forEach(p => { srcPoints.push(p.x * mat.cols); srcPoints.push(p.y * mat.rows); });
        const w = Math.max(
            Math.hypot(srcPoints[4]-srcPoints[6], srcPoints[5]-srcPoints[7]),
            Math.hypot(srcPoints[2]-srcPoints[0], srcPoints[3]-srcPoints[1])
        );
        const h = Math.max(
            Math.hypot(srcPoints[2]-srcPoints[4], srcPoints[3]-srcPoints[5]),
            Math.hypot(srcPoints[0]-srcPoints[6], srcPoints[1]-srcPoints[7])
        );
        if (w < 10 || h < 10) { skipCropping(); return; }

        const srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, srcPoints);
        const dstCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, w, 0, w, h, 0, h]);
        const M = cv.getPerspectiveTransform(srcCoords, dstCoords);
        const warpedMat = new cv.Mat();
        cv.warpPerspective(mat, warpedMat, M, new cv.Size(w, h), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
        const outCanvas = document.createElement('canvas');
        cv.imshow(outCanvas, warpedMat);
        outCanvas.toBlob((blob) => {
            const file = new File([blob], `${currentInputTargetId}.jpg`, { type: "image/jpeg" });
            assignFileToInput(currentInputTargetId, file);
            const previewSrc = outCanvas.toDataURL('image/jpeg');
            $(`#preview_${currentInputTargetId}`).removeClass('initially-hidden').show().find('img').attr('src', previewSrc);
            _cleanupMat(currentInputTargetId);
            const modalInst = bootstrap.Modal.getInstance(document.getElementById('cropModal'));
            if (modalInst) modalInst.hide();
        }, 'image/jpeg', 0.82);
        srcCoords.delete(); dstCoords.delete(); M.delete(); warpedMat.delete();
    } catch(e) {
        console.error('finishCropping error:', e);
        skipCropping();
    }
}

function skipCropping() {
    const mat = imageMatStore[currentInputTargetId];
    if (mat && isCvReady) {
        const outCanvas = document.createElement('canvas');
        try {
            cv.imshow(outCanvas, mat);
            outCanvas.toBlob((blob) => {
                const file = new File([blob], `${currentInputTargetId}_raw.jpg`, { type: "image/jpeg" });
                assignFileToInput(currentInputTargetId, file);
                $(`#preview_${currentInputTargetId}`).removeClass('initially-hidden').show().find('img').attr('src', outCanvas.toDataURL('image/jpeg'));
                _cleanupMat(currentInputTargetId);
                const modalInst = bootstrap.Modal.getInstance(document.getElementById('cropModal'));
                if (modalInst) modalInst.hide();
            }, 'image/jpeg', 0.85);
        } catch(e) {
            _cleanupMat(currentInputTargetId);
            const modalInst = bootstrap.Modal.getInstance(document.getElementById('cropModal'));
            if (modalInst) modalInst.hide();
        }
    } else {
        _cleanupMat(currentInputTargetId);
        const modalInst = bootstrap.Modal.getInstance(document.getElementById('cropModal'));
        if (modalInst) modalInst.hide();
    }
}

// Giai phong bo nho khi modal bi dong (bat ky nguyen nhan nao)
$(document).on('hidden.bs.modal', '#cropModal', function() { _cleanupAllMats(); });

/**
 * CAMERA MODULE (getUserMedia Flow)
 * - Dung cho Netlify (HTTPS), ho tro ca mobile va desktop.
 * - Fallback an toan sang file picker neu browser khong ho tro hoac user tu choi quyen.
 */
let _cameraStream = null;         // MediaStream hien tai
let _cameraFacing = 'environment'; // 'environment' = camera sau (mac dinh cho chup chung tu)
let _cameraTargetId = null;        // ID input file se nhan anh sau khi chup
let _galleryInput = null;          // input[type=file] an dung de fallback gallery

/**
 * Mo modal camera hoac fallback sang gallery neu getUserMedia khong kha dung
 */
async function openCamera(targetId) {
    _cameraTargetId = targetId;
    _cameraFacing = 'environment'; // always start with back camera

    // Kiem tra browser ho tro getUserMedia va dang chay tren HTTPS / localhost
    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
    if (!isSecure || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // Fallback: mo file picker truc tiep
        _openFilePicker(targetId);
        return;
    }

    // Hien modal
    const modalEl = document.getElementById('cameraModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    document.getElementById('cameraError').classList.add('d-none');
    document.getElementById('cameraVideo').classList.remove('d-none');
    document.getElementById('btnCapturePhoto').disabled = true;
    modal.show();

    await _startCameraStream();
}

async function _startCameraStream() {
    // Dung stream cu neu co
    _stopCameraStream();

    const constraints = {
        video: {
            facingMode: _cameraFacing,
            width:  { ideal: 1920 },
            height: { ideal: 1080 }
        },
        audio: false
    };

    try {
        _cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.getElementById('cameraVideo');
        video.srcObject = _cameraStream;
        await video.play();
        document.getElementById('btnCapturePhoto').disabled = false;
    } catch (err) {
        console.error('Camera error:', err);
        let msg = 'Không thể truy cập camera.';
        if (err.name === 'NotAllowedError')  msg = 'Bạn đã từ chối quyền camera. Vui lòng cấp quyền từ cài đặt trình duyệt.';
        if (err.name === 'NotFoundError')    msg = 'Thiết bị không có camera phù hợp.';
        if (err.name === 'NotReadableError') msg = 'Camera đang được ứng dụng khác sử dụng.';
        if (err.name === 'OverconstrainedError') {
            // Thu lai voi constraint don gian hon
            try {
                _cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                const video = document.getElementById('cameraVideo');
                video.srcObject = _cameraStream;
                await video.play();
                document.getElementById('btnCapturePhoto').disabled = false;
                return;
            } catch(e2) { msg = 'Camera không tương thích.'; }
        }
        // Hien man hinh loi
        document.getElementById('cameraVideo').classList.add('d-none');
        document.getElementById('cameraError').classList.remove('d-none');
        document.getElementById('cameraErrorMsg').textContent = msg;
    }
}

/**
 * Doi camera truoc / sau
 */
async function switchCamera() {
    _cameraFacing = _cameraFacing === 'environment' ? 'user' : 'environment';
    document.getElementById('btnCapturePhoto').disabled = true;
    await _startCameraStream();
}

/**
 * Chup anh tu video stream
 */
function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    if (!video || !_cameraStream) return;

    const snapshot = document.getElementById('cameraSnapshot');
    snapshot.width  = video.videoWidth;
    snapshot.height = video.videoHeight;
    const ctx = snapshot.getContext('2d');
    // Neu dung camera truoc (selfie), can lat anh lai cho tu nhien
    if (_cameraFacing === 'user') {
        ctx.translate(snapshot.width, 0);
        ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, snapshot.width, snapshot.height);

    snapshot.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `${_cameraTargetId}_cam.jpg`, { type: 'image/jpeg' });
        closeCameraModal();

        // Gui anh qua pipeline phan tich + crop
        showLoading('Đang phân tích ảnh chụp...');
        try {
            const processed = await processImageWithAI(file);
            startCroppingFlow(processed, _cameraTargetId);
        } catch(e) {
            startCroppingFlow(file, _cameraTargetId);
        } finally {
            hideLoading();
        }
    }, 'image/jpeg', 0.92);
}

/**
 * Dong modal camera va giai phong stream
 */
function closeCameraModal() {
    _stopCameraStream();
    const modalEl = document.getElementById('cameraModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}

/**
 * Fallback: mo file picker (gallery / he thong)
 */
function fallbackToGallery() {
    closeCameraModal();
    _openFilePicker(_cameraTargetId);
}

function _openFilePicker(targetId) {
    // Tao input an de mo he thong file picker
    if (_galleryInput) { try { document.body.removeChild(_galleryInput); } catch(e) {} }
    _galleryInput = document.createElement('input');
    _galleryInput.type = 'file';
    _galleryInput.accept = 'image/*';
    _galleryInput.style.display = 'none';
    _galleryInput.onchange = async function() {
        const file = this.files && this.files[0];
        if (!file) return;
        assignFileToInput(targetId, file);
        showLoading('Đang phân tích ảnh...');
        try {
            const processed = await processImageWithAI(file);
            startCroppingFlow(processed, targetId);
        } catch(e) {
            startCroppingFlow(file, targetId);
        } finally {
            hideLoading();
        }
    };
    document.body.appendChild(_galleryInput);
    _galleryInput.click();
}

function _stopCameraStream() {
    if (_cameraStream) {
        _cameraStream.getTracks().forEach(t => t.stop());
        _cameraStream = null;
    }
    const video = document.getElementById('cameraVideo');
    if (video) { video.srcObject = null; }
}

// Dam bao stream bi dung khi dong modal
$(document).on('hide.bs.modal', '#cameraModal', function() { _stopCameraStream(); });

// Bind nut X thu cong vi data-bs-dismiss co the khong gan duoc voi static backdrop
$(document).on('click', '#btnCloseCameraModal', function() { closeCameraModal(); });

// Expose ra window
window.openCamera      = openCamera;
window.capturePhoto    = capturePhoto;
window.switchCamera    = switchCamera;
window.closeCameraModal = closeCameraModal;
window.fallbackToGallery = fallbackToGallery;



/**
 * REGISTRATION LOGIC
 */
function initMoTaiKhoanForm() {
    flatpickr(".js-datepicker", { dateFormat: "Y-m-d", altInput: true, altFormat: "d/m/Y", defaultDate: "today" });
    
    $('#frm-mo-tk').off('submit').on('submit', handleRegistration);
    $('#loai_hinh').on('change', toggleFormFields);
    toggleFormFields(); // Initialize field visibility on load

    // Map camera inputs -> corresponding file inputs
    const camMap = {
        'cam_truoc': 'img_truoc',
        'cam_sau':   'img_sau',
        'cam_dkkd':  'img_dkkd',
        'cam_qr':    'img_qr',
        'cam_thuchien': 'img_thuchien'
    };

    const triggerProcessing = async (file, targetId) => {
        if (!file) return;
        showLoading('Phan tich anh...');
        try {
            const processed = await processImageWithAI(file);
            startCroppingFlow(processed, targetId);
        } catch(e) {
            startCroppingFlow(file, targetId);
        } finally {
            hideLoading();
        }
    };

    // File (gallery) inputs
    const uploadIds = ['img_truoc', 'img_sau', 'img_dkkd', 'img_qr', 'img_thuchien'];
    uploadIds.forEach(id => {
        $(`#${id}`).off('change').on('change', async function() {
            if (this.files && this.files[0]) {
                await triggerProcessing(this.files[0], id);
            }
        });
    });

    // Camera inputs
    Object.keys(camMap).forEach(camId => {
        const targetId = camMap[camId];
        $(`#${camId}`).off('change').on('change', async function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                // Sao chep sang input goc de validation van hoat dong
                assignFileToInput(targetId, file);
                await triggerProcessing(file, targetId);
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
    
    // UI Elements
    const progressWrapper = $('#compress-progress-wrapper');
    const progressBar = $('#compress-progress-bar');
    const progressLabel = $('#compress-progress-label');
    const progressPct = $('#compress-progress-pct');

    btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
    progressWrapper.show();
    progressBar.css('width', '0%');
    progressPct.text('0%');

    const fileSlots = [
        { id: 'img_truoc', label: 'CCCD Trước' },
        { id: 'img_sau',   label: 'CCCD Sau' },
        { id: 'img_dkkd',  label: 'Giấy phép' },
        { id: 'img_qr',    label: 'Mã QR' },
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

    const filesToProcess = fileSlots.filter(s => document.getElementById(s.id).files[0]);
    const totalSteps = filesToProcess.length + 2; // +1 for prep, +1 for network
    let currentStep = 0;

    const updateUIProgress = (msg, pct) => {
        progressLabel.text(msg);
        progressBar.css('width', `${pct}%`).attr('aria-valuenow', pct);
        progressPct.text(`${pct}%`);
    };

    // Helper: Nén ảnh với timeout 10s
    const compressWithTimeout = (file, slotLabel, ms = 10000) => {
        const options = { 
            maxSizeMB: 0.4, 
            maxWidthOrHeight: 1200, 
            useWebWorker: false, // Tắt web worker để tránh lỗi CORS/treo
            onProgress: (pct) => {
                const currentPct = Math.round(pct);
                updateUIProgress(`Đang tối ưu ${slotLabel} (${currentPct}%)...`, Math.round(((currentStep - 1) / totalSteps) * 100 + (currentPct / totalSteps)));
            }
        };
        return Promise.race([
            imageCompression(file, options),
            new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), ms))
        ]);
    };

    updateUIProgress('Bắt đầu quy trình xử lý hồ sơ...', 5);

    for (const slot of filesToProcess) {
        currentStep++;
        // FIX: Dung slot.id thay vi slot.inputId
        const fileInput = document.getElementById(slot.id);
        const file = fileInput ? fileInput.files[0] : null;

        updateUIProgress(`Đang tối ưu ${slot.label} (${currentStep}/${filesToProcess.length})...`, Math.round((currentStep / totalSteps) * 100));

        if (!file) {
            console.warn(`Không tìm thấy file cho ${slot.label}`);
            continue;
        }

        try {
            const compressed = await compressWithTimeout(file, slot.label);
            data[slot.id] = await imageCompression.getDataUrlFromFile(compressed);
        } catch (err) {
            if (err.message === "TIMEOUT") {
                console.warn(`Nén ${slot.label} quá 10s, dùng ảnh gốc.`);
                progressLabel.text(`Bỏ qua nén ${slot.label} (quá 10s)...`);
            } else {
                console.error(`Lỗi nén ${slot.label}:`, err);
            }
            // Fallback dung anh goc
            data[slot.id] = await new Promise(r => {
                const reader = new FileReader();
                reader.onload = (e) => r(e.target.result);
                reader.readAsDataURL(file);
            });
        }
    }

    // Buoc cuoi: Gui du lieu len Server
    updateUIProgress('Đang mã hóa & chuẩn bị gửi máy chủ...', 90);
    btn.html('<span class="spinner-border spinner-border-sm"></span> Đang lưu hồ sơ...');
    
    // Thêm một độ trễ nhỏ để người dùng thấy 90%
    await new Promise(r => setTimeout(r, 400));
    updateUIProgress('Đang gửi dữ liệu & đồng bộ cơ sở dữ liệu...', 95);

    runAPI('api_submitregistration', data, (res) => {
        btn.prop('disabled', false).html(oldBtn);
        if (res.status === 'success') {
            updateUIProgress('Hồ sơ đã được gửi thành công!', 100);
            progressBar.addClass('bg-success');
            setTimeout(() => {
                progressWrapper.fadeOut();
                progressBar.removeClass('bg-success');
            }, 3000);
            showAlert('Thành công!', 'Hồ sơ đã được lưu và đồng bộ truyền tin thành công.', 'success');
            document.getElementById('frm-mo-tk').reset();
            $('.img-preview-box').hide();
            AppCache.clear('myCustomers');
        } else {
            updateUIProgress('Lỗi gửi hồ sơ!', 0);
            progressBar.addClass('bg-danger');
            setTimeout(() => {
                progressWrapper.hide();
                progressBar.removeClass('bg-danger');
            }, 5000);
            showAlert('Lỗi', res.message, 'error');
        }
    }, () => {
        btn.prop('disabled', false).html(oldBtn);
        updateUIProgress('Lỗi kết nối máy chủ!', 0);
        progressBar.addClass('bg-danger');
        setTimeout(() => {
            progressWrapper.hide();
            progressBar.removeClass('bg-danger');
        }, 5000);
    }, 'NONE');
}


/**
 * STAFF CUSTOMER LOGIC
 */
async function initMyCustomersList() {
    if (!AppState.user) return;
    
    const cached = AppCache.get('myCustomers');
    if (cached) {
        renderMyCustomersTable(cached.data);
        renderStaffDashboardLocal(cached.data || []);
        // Dùng cache admin nếu có, không thì mới fetch
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
            
            // Fetch rankings: dùng cache nếu có
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
        
        // Thêm icon vinh danh cho Top 3
        if (rank === 1) {
            rankHtml = `<i class='bx bxs-trophy text-warning'></i> ${rankHtml}`;
        } else if (rank === 2) {
            rankHtml = `<i class='bx bxs-medal text-secondary'></i> ${rankHtml}`;
        } else if (rank === 3) {
            rankHtml = `<i class='bx bxs-medal' style="color: #cd7f32;"></i> ${rankHtml}`;
        }
        
        $('#staffDash-rank').html(rankHtml);
        
        // Thông tin người xếp trên
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
        const rowId = (d.ID || d['Mã GD'] || '').toString().replace(/^'/, '');
        return `
            <tr data-id="${rowId}" class="clickable-row cursor-pointer" onclick="openEditCustomerModal('${rowId}')">
                <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
                <td class="fw-bold">${utils_escapeHTML(d['Tên khách hàng'])}</td>
                <td><small>${utils_escapeHTML(d['Số CCCD'])}</small></td>
                <td><small>${utils_escapeHTML(d['Số GP ĐKKD'] || '')}</small></td>
                <td><span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'])}</span></td>
                <td><small>${utils_escapeHTML(d['Số điện thoại'])}</small></td>
                <td>${AppState.user ? utils_escapeHTML(AppState.user.name) : utils_escapeHTML(d['Cán bộ thực hiện'] || '')}</td>
                <td><small>${utils_escapeHTML(d['Ngày mở TK'] || d['Ngày mở'] || '')}</small></td>
                <td><small>${utils_escapeHTML(d['Số TK'] || d['Số tài khoản'] || '')}</small></td>
                <td class="text-end"><button class="btn btn-sm btn-outline-primary shadow-sm btn-detail" onclick="openEditCustomerModal('${rowId}'); event.stopPropagation();"><i class="bx bx-search-alt"></i> Chi tiết</button></td>
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
                    exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
                    title: 'Ho_So_Ca_Nhan_' + new Date().toISOString().slice(0,10)
                }
            ],
            language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json" },
            search: { caseInsensitive: true, smart: true },
            columnDefs: [
                { targets: [3, 6, 7, 8], visible: false },
                { targets: [9], orderable: false, searchable: false }
            ]
        });
    }
}
/**
 * DASHBOARD & DATA LOGIC
 */
let charts = {};

// GLOBAL UTILITY: Parse stats từ response (statsStr là chuẩn, fallback sang stats)
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

    // Dùng cache nếu còn hợp lệ — tránh gọi API thừa
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
    // Hủy DataTable cũ nếu đã tồn tại để tránh double-init
    if ($.fn.DataTable.isDataTable('#tblKH')) {
        $('#tblKH').DataTable().destroy();
    }

    window._adminAllData = allData.sort((a,b) => (new Date(b['Thời điểm nhập'])||0) - (new Date(a['Thời điểm nhập'])||0));
    window._adminRawStaffs = allStaffs;

    const staffMap = {};
    allStaffs.forEach(st => staffMap[st.email] = st.name);

    // Các cột trong tbody (7 cột, khớp với thead):
    // 0=Thời gian | 1=Họ Tên | 2=Loại hình | 3=Số TK | 4=Email (hidden, filter) | 5=Cán bộ | 6=Thao tác
    const html = window._adminAllData.map(d => {
        const staffEmail = (d['Cán bộ thực hiện'] || '').toString().trim();
        const staffName  = staffMap[staffEmail] || staffEmail;
        const rowId      = (d['ID'] || d['Mã GD'] || '').toString().trim().replace(/^'/, '');
        return `
            <tr data-id="${rowId}" class="clickable-row cursor-pointer" style="cursor:pointer" onclick="openEditCustomerModal('${rowId}')">
                <td><small class="text-muted">${utils_formatVN(d['Thời điểm nhập'], 'date')}</small></td>
                <td class="fw-bold text-dark">${utils_escapeHTML(d['Tên khách hàng'] || '')}</td>
                <td><span class="badge bg-light text-dark border">${utils_escapeHTML(d['Loại hình dịch vụ'] || 'Cá nhân')}</span></td>
                <td class="text-secondary"><small>${utils_escapeHTML((d['Số tài khoản'] || '').toString().replace(/^'/, ''))}</small></td>
                <td class="d-none">${utils_escapeHTML(staffEmail)}</td>
                <td><small>${utils_escapeHTML(staffName)}</small></td>
                <td class="text-end"><button class="btn btn-sm btn-outline-primary px-2 btn-detail" onclick="openEditCustomerModal('${rowId}'); event.stopPropagation();"><i class="bx bx-info-circle"></i></button></td>
            </tr>`;
    }).join('');

    $('#tblKH tbody').html(html);

    // Populate Staff Filter (chỉ điền 1 lần)
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
                // Xuất tất cả cột bao gồm cột ẩn (email, STK, CCCD, ...)
                columns: ':all',
                format: {
                    header: function(data, col) {
                        // Ẩn cột email khỏi header xuất
                        const hdrs = ['Thời gian', 'Họ Tên', 'Loại Hình', 'Số TK', 'Email CB', 'Cán Bộ', 'Thao tác'];
                        return hdrs[col] || data;
                    }
                }
            },
            title: 'Bao_Cao_KH_YenTho_' + new Date().toISOString().slice(0,10)
        }],
        language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json" },
        search: { caseInsensitive: true, smart: true }, // Bỏ searchDelay để đạt "tức thời"
        columnDefs: [
            { targets: [4], visible: false, searchable: true },   // Email CB (dùng để lọc)
            { targets: [6], orderable: false, searchable: false }  // Nút thao tác
        ]
    });

    // Ngăn DataTable search tìm cột 6 (nút bấm)
    window._dtAdmin = dtAdmin;

    // ==> Lọc theo ngày (cấy vào custom search)
    // Xóa lọc cũ nếu có để tránh cộng dồn khi render lại
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

    // ==> Lọc theo Cán bộ (search cột email ẩn - index 4)
    $('#filterStaffAdmin').off('change.tblKH').on('change.tblKH', function() {
        dtAdmin.column(4).search($(this).val()).draw();
    });

    // ==> Lọc theo Ngày
    $('#filterFromDate, #filterToDate').off('change.tblKH').on('change.tblKH', function() {
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

// --- CUSTOMER & IMAGE MODAL ---
function openEditCustomerModal(id) {
    try {
        if (!id) return;
        
        // Làm sạch ID: Chuyển về string, trim và bỏ dấu nháy đơn prefix (') thường gặp ở Google Sheets
        const rowIdStr = String(id).trim().replace(/^'/, '');
        
        let row = null;
        let sourceData = [];

        if (AppState.user && AppState.user.role === 'Admin') {
            sourceData = window._adminAllData || [];
        } else {
            const cache = AppCache.get('myCustomers');
            sourceData = (cache && Array.isArray(cache.data)) ? cache.data : [];
        }
        
        // Tìm kiếm dòng tương ứng
        for (let i = 0; i < sourceData.length; i++) {
            const currentId = String(sourceData[i]['ID'] || sourceData[i]['Mã GD'] || '').trim().replace(/^'/, '');
            if (currentId === rowIdStr) {
                row = sourceData[i];
                break;
            }
        }

        if (!row) {
            console.warn("Không tìm thấy khách hàng với ID:", rowIdStr, "trong nguồn dữ liệu của", AppState.user?.role);
            showAlert('Lỗi', 'Không tìm thấy thông tin hồ sơ khách hàng. Vui lòng thử lại hoặc tải lại trang.', 'error');
            return;
        }

        // Khởi tạo datepicker cho modal chỉnh sửa nếu chưa có
        if (typeof flatpickr !== 'undefined') {
            const fpEl = document.querySelector('.js-datepicker-edit');
            if (fpEl && !fpEl._flatpickr) {
                flatpickr(fpEl, {
                    dateFormat: "d/m/Y",
                    altInput: true,
                    altFormat: "d/m/Y",
                    allowInput: true
                });
            }
        }

        // Đổ dữ liệu vào form
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
                if ($('#edit_ngay_mo')[0]._flatpickr) {
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

        const trangThai = row['Trạng thái'] || 'Chưa hoàn thành';
        const isVerified = (trangThai === 'Đã xác minh');

        // Theo yêu cầu mới, User tự quản lý sửa hồ sơ nên không khóa nút Lưu kể cả khi đã xác minh
        if (AppState.user && AppState.user.role === 'Admin') {
            $('#btnSaveEdit').hide();
            $('#frmEditCustomer input').prop('readonly', true);
            $('#edit_status_alert').removeClass('d-none');
            $('.modal-title').html(`<i class='bx bx-search-alt text-white'></i> Chi tiết Hồ sơ <span class="badge bg-info small ms-2">Chế độ xem</span>`);
        } else {
            $('#btnSaveEdit').show();
            $('#frmEditCustomer input').prop('readonly', false);
            $('#edit_status_alert').addClass('d-none');
            
            if (isVerified) {
                $('.modal-title').html(`<i class='bx bxs-check-shield text-success'></i> Chi tiết Hồ sơ <span class="badge bg-success small ms-2">Đã xác minh</span>`);
            } else {
                $('.modal-title').html(`<i class='bx bxs-edit-alt text-white'></i> Chỉnh sửa Hồ sơ`);
            }
        }

        const infoHtml = `<div class="col-12 mb-2">
                            <div class="p-2 bg-white rounded border d-flex gap-2 shadow-sm align-items-center">
                                <span class="badge bg-primary">${utils_escapeHTML(loaiHinh)}</span>
                                <span>CCCD: <b>${utils_escapeHTML(cccdVal)}</b></span>
                                ${isVerified ? '<span class="ms-auto badge rounded-pill bg-success-subtle text-success border border-success-subtle"><i class="bx bxs-check-circle"></i> Đã duyệt</span>' : ''}
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
        $('#modalEditCustomer').modal('show');
    } catch(err) { console.error(err); }
}


/**
 * APP INITIALIZATION
 */
$(document).ready(() => {
    // Normalization logic for DataTables Vietnamese Search
    if (typeof $.fn.dataTable !== 'undefined' && $.fn.dataTable.ext && $.fn.dataTable.ext.type) {
        $.fn.dataTable.ext.type.search.string = function(data) {
            if (!data) return '';
            if (typeof data !== 'string') return data;
            return data
                .replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a')
                .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, 'e')
                .replace(/i|í|ì|ỉ|ĩ|ị/g, 'i')
                .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, 'o')
                .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, 'u')
                .replace(/ý|ỳ|ỷ|ỹ|ỵ/g, 'y')
                .replace(/đ/g, 'd')
                .replace(/Á|À|Ả|Ã|Ạ|Ă|Ắ|Ằ|Ẳ|Ẵ|Ặ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ/g, 'A')
                .replace(/É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ/g, 'E')
                .replace(/I|Í|Ì|Ỉ|Ĩ|Ị/g, 'I')
                .replace(/Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ/g, 'O')
                .replace(/Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự/g, 'U')
                .replace(/Ý|Ỳ|Ỷ|Ỹ|Ỵ/g, 'Y')
                .replace(/Đ/g, 'D');
        };
    }

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

function openChangePasswordModal() {
    $('#pwdOld').val('');
    $('#pwdNew').val('');
    $('#pwdNewConfirm').val('');
    $('#pwdAlertForce').hide();
    $('#modalChangePassword').modal('show');
}

function handleChangePassword(e) {
    e.preventDefault();
    if (!AppState.user) return;
    
    const oldP = $('#pwdOld').val();
    const newP = $('#pwdNew').val();
    const newPc = $('#pwdNewConfirm').val();

    if (!oldP || !newP) {
        showAlert('Lỗi', 'Vui lòng nhập đầy đủ mật khẩu cũ và mới.', 'warning');
        return;
    }
    
    if (newP !== newPc) {
        showAlert('Lỗi', 'Mật khẩu mới không khớp!', 'warning');
        return;
    }

    if (newP.length < 6) {
        showAlert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự.', 'warning');
        return;
    }

    // Khai báo btn và oldHtml đúng chỗ
    const btn = $('#btnSubmitChangePwd');
    const oldHtml = btn.html();
    btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
    
    // Hash passwords for security
    const oldH = CryptoJS.SHA256(oldP).toString();
    const newH = CryptoJS.SHA256(newP).toString();

    runAPI('api_changepassword', {
        email: AppState.user.email,
        oldHashed: oldH,
        newHashed: newH
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
        cccd:      $('#edit_cccd').val().trim(),
        dkkd:      $('#edit_dkkd').val().trim(),
        ngay_mo:   $('#edit_ngay_mo').val(),
        so_tk:     ($('#edit_so_tk').val().trim() ? '3800200' + $('#edit_so_tk').val().trim() : ''),
        ten_dang_nhap: $('#edit_ten_dang_nhap').val().trim(),
        mat_khau:  $('#edit_mat_khau').val().trim()
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
    localStorage.clear();
    sessionStorage.clear();
    AppCache.clearAll();
    AppState.user = null;
    
    // Ép trình duyệt tải lại trang và bỏ qua cache bằng cách thêm tham số timestamp ngẫu nhiên
    window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
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

window.onOpenCvReady = onOpenCvReady;
window.loadStaffOpenAccountView = () => showView('view-mo-tai-khoan');
window.loadStaffMyCustomersView = () => { showView('view-my-customers'); initMyCustomersList(); };
window.logout = logout;
window.finishCropping = finishCropping;
window.openChangePasswordModal = () => {
    $('#pwdAlertForce').hide();
    $('#modalChangePassword .btn-close').show();
    $('#modalChangePassword').attr('data-bs-keyboard', 'true');
    $('#frmChangePassword')[0].reset();
    $('#modalChangePassword').modal('show');
};
window.loadAdminData = () => {
    AppCache.clear('adminDashboard');
    initDashboard();
};
window.skipCropping = skipCropping;
window.openEditCustomerModal = openEditCustomerModal;
