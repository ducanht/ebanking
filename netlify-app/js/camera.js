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
 */
function assignFileToInput(inputId, file) {
    const input = document.getElementById(inputId);
    if (!input) return;
    try {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
    } catch (e) {
        input._customFile = file;
        console.warn('DataTransfer not supported, using fallback for', inputId);
    }
}

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
                if (maxContour && maxArea > (src.rows * src.cols * 0.1)) {
                    const pArr = [];
                    for (let j = 0; j < 4; j++) {
                        pArr.push({ x: maxContour.data32S[j * 2] / src.cols, y: maxContour.data32S[j * 2 + 1] / src.rows });
                    }
                    quadPoints = sortPoints(pArr);
                } else {
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

function startCroppingFlow(source, targetId) {
    if (!source) return;
    currentInputTargetId = targetId;
    const img = new Image();
    img.onload = function() {
        const canvas = document.getElementById('quad-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const maxW = Math.min(window.innerWidth * 0.92, 900);
        const maxH = window.innerHeight * 0.60;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        canvas.width  = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        _cleanupMat(targetId);
        if (isCvReady && window.cv) {
            try { imageMatStore[targetId] = cv.imread(img); } catch(e) { console.warn('cv.imread failed:', e); }
        }

        updateQuadUI();
        initQuadInteraction();

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

function resizeCanvasIfNeed(srcCanvas, maxDim = 1280) {
    let w = srcCanvas.width;
    let h = srcCanvas.height;
    if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
        const resCanvas = document.createElement('canvas');
        resCanvas.width = w;
        resCanvas.height = h;
        const ctx = resCanvas.getContext('2d');
        ctx.drawImage(srcCanvas, 0, 0, srcCanvas.width, srcCanvas.height, 0, 0, w, h);
        return resCanvas;
    }
    return srcCanvas;
}

function finishCropping() {
    const mat = imageMatStore[currentInputTargetId];
    if (!mat || !isCvReady) {
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
        
        let outCanvas = document.createElement('canvas');
        cv.imshow(outCanvas, warpedMat);
        
        // P1-FIX: Nén ảnh chống mập Base64 - Tối đa 1280px
        outCanvas = resizeCanvasIfNeed(outCanvas, 1280);

        outCanvas.toBlob((blob) => {
            const file = new File([blob], `${currentInputTargetId}.jpg`, { type: "image/jpeg" });
            assignFileToInput(currentInputTargetId, file);
            const previewSrc = outCanvas.toDataURL('image/jpeg');
            $(`#preview_${currentInputTargetId}`).removeClass('initially-hidden').show().find('img').attr('src', previewSrc);
            _cleanupMat(currentInputTargetId);
            const modalInst = bootstrap.Modal.getInstance(document.getElementById('cropModal'));
            if (modalInst) modalInst.hide();
        }, 'image/jpeg', 0.75); // quality 0.75 để tối ưu cho Base64 GAS
        
        srcCoords.delete(); dstCoords.delete(); M.delete(); warpedMat.delete();
    } catch(e) {
        console.error('finishCropping error:', e);
        skipCropping();
    }
}

function skipCropping() {
    const mat = imageMatStore[currentInputTargetId];
    if (mat && isCvReady) {
        let outCanvas = document.createElement('canvas');
        try {
            cv.imshow(outCanvas, mat);
            
            // P1-FIX: Nén ảnh chống mập Base64 - Tối đa 1280px
            outCanvas = resizeCanvasIfNeed(outCanvas, 1280);

            outCanvas.toBlob((blob) => {
                const file = new File([blob], `${currentInputTargetId}_raw.jpg`, { type: "image/jpeg" });
                assignFileToInput(currentInputTargetId, file);
                $(`#preview_${currentInputTargetId}`).removeClass('initially-hidden').show().find('img').attr('src', outCanvas.toDataURL('image/jpeg'));
                _cleanupMat(currentInputTargetId);
                const modalInst = bootstrap.Modal.getInstance(document.getElementById('cropModal'));
                if (modalInst) modalInst.hide();
            }, 'image/jpeg', 0.75); // quality 0.75
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
$(document).ready(() => {
    $(document).on('hidden.bs.modal', '#cropModal', function() { _cleanupAllMats(); });
    // Bind nut X thu cong vi data-bs-dismiss co the khong gan duoc voi static backdrop
    $(document).on('click', '#btnCloseCameraModal', function() { closeCameraModal(); });
    $(document).on('hide.bs.modal', '#cameraModal', function() { _stopCameraStream(); });
});

/**
 * CAMERA MODULE (getUserMedia Flow)
 */
let _cameraStream = null;         
let _cameraFacing = 'environment';
let _cameraTargetId = null;        
let _galleryInput = null;          

async function openCamera(targetId) {
    _cameraTargetId = targetId;
    _cameraFacing = 'environment'; 

    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
    if (!isSecure || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        _openFilePicker(targetId);
        return;
    }

    const modalEl = document.getElementById('cameraModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    document.getElementById('cameraError').classList.add('d-none');
    document.getElementById('cameraVideo').classList.remove('d-none');
    document.getElementById('btnCapturePhoto').disabled = true;
    modal.show();

    await _startCameraStream();
}

async function _startCameraStream() {
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
            try {
                _cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                const video = document.getElementById('cameraVideo');
                video.srcObject = _cameraStream;
                await video.play();
                document.getElementById('btnCapturePhoto').disabled = false;
                return;
            } catch(e2) { msg = 'Camera không tương thích.'; }
        }
        document.getElementById('cameraVideo').classList.add('d-none');
        document.getElementById('cameraError').classList.remove('d-none');
        document.getElementById('cameraErrorMsg').textContent = msg;
    }
}

async function switchCamera() {
    _cameraFacing = _cameraFacing === 'environment' ? 'user' : 'environment';
    document.getElementById('btnCapturePhoto').disabled = true;
    await _startCameraStream();
}

function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    if (!video || !_cameraStream) return;

    const snapshot = document.getElementById('cameraSnapshot');
    snapshot.width  = video.videoWidth;
    snapshot.height = video.videoHeight;
    const ctx = snapshot.getContext('2d');
    if (_cameraFacing === 'user') {
        ctx.translate(snapshot.width, 0);
        ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, snapshot.width, snapshot.height);

    snapshot.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `${_cameraTargetId}_cam.jpg`, { type: 'image/jpeg' });
        closeCameraModal();

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

function closeCameraModal() {
    _stopCameraStream();
    const modalEl = document.getElementById('cameraModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}

function fallbackToGallery() {
    closeCameraModal();
    _openFilePicker(_cameraTargetId);
}

function _openFilePicker(targetId) {
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

window.onOpenCvReady = onOpenCvReady;
window.openCamera = openCamera;
window.capturePhoto = capturePhoto;
window.switchCamera = switchCamera;
window.closeCameraModal = closeCameraModal;
window.fallbackToGallery = fallbackToGallery;
window.finishCropping = finishCropping;
window.skipCropping = skipCropping;
