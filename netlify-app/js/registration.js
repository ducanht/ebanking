/**
 * REGISTRATION LOGIC
 */
function initMoTaiKhoanForm() {
    flatpickr(".js-datepicker", { dateFormat: "Y-m-d", altInput: true, altFormat: "d/m/Y", defaultDate: "today" });
    
    $('#frm-mo-tk').off('submit').on('submit', handleRegistration);
    $('#loai_hinh').on('change', toggleFormFields);
    toggleFormFields(); 

    const camMap = {
        'cam_truoc': 'img_truoc',
        'cam_sau':   'img_sau',
        'cam_dkkd':  'img_dkkd',
        'cam_qr':    'img_qr',
        'cam_thuchien': 'img_thuchien'
    };

    const triggerProcessing = async (file, targetId) => {
        if (!file) return;
        showLoading('Phân tích ảnh...');
        try {
            const processed = await processImageWithAI(file);
            startCroppingFlow(processed, targetId);
        } catch(e) {
            startCroppingFlow(file, targetId);
        } finally {
            hideLoading();
        }
    };

    const uploadIds = ['img_truoc', 'img_sau', 'img_dkkd', 'img_qr', 'img_thuchien'];
    uploadIds.forEach(id => {
        $(`#${id}`).off('change').on('change', async function() {
            if (this.files && this.files[0]) {
                await triggerProcessing(this.files[0], id);
            }
        });
    });

    Object.keys(camMap).forEach(camId => {
        const targetId = camMap[camId];
        $(`#${camId}`).off('change').on('change', async function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
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
    
    const progressWrapper = $('#compress-progress-wrapper');
    const progressBar = $('#compress-progress-bar');
    const progressLabel = $('#compress-progress-label');
    const progressPct = $('#compress-progress-pct');

    btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
    progressWrapper.removeClass('initially-hidden').removeClass('d-none').show();
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

    const filesToProcess = fileSlots.filter(s => document.getElementById(s.id) && document.getElementById(s.id).files[0]);
    const totalSteps = filesToProcess.length + 2; 
    let currentStep = 0;

    const updateUIProgress = (msg, pct) => {
        progressLabel.text(msg);
        progressBar.css('width', `${pct}%`).attr('aria-valuenow', pct);
        progressPct.text(`${pct}%`);
    };

    const compressWithTimeout = (file, slotLabel, ms = 10000) => {
        const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1200, useWebWorker: true };
        return Promise.race([
            imageCompression(file, options),
            new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), ms))
        ]);
    };

    updateUIProgress('Bắt đầu quy trình xử lý hồ sơ...', 5);

    for (const slot of filesToProcess) {
        currentStep++;
        const fileInput = document.getElementById(slot.id);
        const file = fileInput ? fileInput.files[0] : null;

        updateUIProgress(`Đang tối ưu ${slot.label} (${currentStep}/${filesToProcess.length})...`, Math.round((currentStep / totalSteps) * 100));

        if (!file) continue;

        try {
            const compressed = await compressWithTimeout(file, slot.label);
            data[slot.id] = await imageCompression.getDataUrlFromFile(compressed);
        } catch (err) {
            if (err.message === "TIMEOUT") {
                console.warn(`Nén ${slot.label} quá thời gian, dùng ảnh gốc.`);
                progressLabel.text(`Bỏ qua nén ${slot.label} (quá 10s)...`);
            } else {
                console.error(`Lỗi nén ${slot.label}:`, err);
            }
            data[slot.id] = await new Promise(r => {
                const reader = new FileReader();
                reader.onload = (e) => r(e.target.result);
                reader.readAsDataURL(file);
            });
        }
    }

    updateUIProgress('Đang mã hóa & chuẩn bị gửi máy chủ...', 90);
    btn.html('<span class="spinner-border spinner-border-sm"></span> Đang lưu hồ sơ...');
    
    await new Promise(r => setTimeout(r, 400));
    updateUIProgress('Đang gửi dữ liệu & đồng bộ cơ sở dữ liệu...', 95);

    runAPI('api_submitregistration', data, (res) => {
        btn.prop('disabled', false).html(oldBtn);
        if (res.status === 'success') {
            updateUIProgress('Hồ sơ đã được gửi thành công!', 100);
            progressBar.addClass('bg-success');
            setTimeout(() => {
                progressWrapper.addClass('initially-hidden').addClass('d-none').hide();
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
            progressWrapper.addClass('initially-hidden').hide();
            progressBar.removeClass('bg-danger');
        }, 5000);
    }, 'NONE');
}

function checkDuplicate(input) {
    if (!input || !input.value) return;
    const val = input.value.trim();
    const lh = $('#loai_hinh').val(); 
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
            input.setCustomValidity(res.msg || 'Giá trị này đã tồn tại cùng loại hình!');
            $(input).addClass('is-invalid');
            if ($(input).siblings('.invalid-feedback').length) {
                $(input).siblings('.invalid-feedback').text(res.msg || 'Giá trị này đã tồn tại cùng loại hình!');
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

window.loadStaffOpenAccountView = () => showView('view-mo-tai-khoan');
