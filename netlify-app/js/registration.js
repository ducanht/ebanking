/**
 * MODULE: ĐĂNG KÝ MỞ TÀI KHOẢN
 * Quản lý toàn bộ nghiệp vụ form khai báo hồ sơ mới
 */

// ========================================================
// HÀM INIT CHÍNH – Gọi 1 lần khi staff đăng nhập
// ========================================================
function initMoTaiKhoanForm() {
    // === 1. Khởi tạo Flatpickr cho tất cả ô ngày ===
    const VI_LOCALE = {
        firstDayOfWeek: 1,
        weekdays: { shorthand: ['CN','T2','T3','T4','T5','T6','T7'], longhand: ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'] },
        months: {
            shorthand: ['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'],
            longhand: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12']
        }
    };

    // Khởi tạo riêng từng datepicker để gắn đúng callback
    // Ngày sinh → trigger autoFillSoTK + autoCalcNgayHetHan
    flatpickr('#ngay_sinh', {
        dateFormat: 'Y-m-d', altInput: true, altFormat: 'd/m/Y',
        locale: VI_LOCALE, allowInput: false,
        onChange: function() {
            autoFillSoTK();
            autoCalcNgayHetHan();
        }
    });

    // Ngày cấp CCCD → trigger autoCalcNgayHetHan
    flatpickr('#ngay_cap_cccd', {
        dateFormat: 'Y-m-d', altInput: true, altFormat: 'd/m/Y',
        locale: VI_LOCALE, allowInput: false,
        onChange: function() {
            autoCalcNgayHetHan();
        }
    });

    // Ngày hết hạn → chỉ đọc/tính tự động, nhưng vẫn cho pick thủ công nếu cần
    flatpickr('#ngay_het_han', {
        dateFormat: 'Y-m-d', altInput: true, altFormat: 'd/m/Y',
        locale: VI_LOCALE, allowInput: false
    });

    // Ngày mở tài khoản → mặc định hôm nay
    flatpickr('#ngay_mo', {
        dateFormat: 'Y-m-d', altInput: true, altFormat: 'd/m/Y',
        locale: VI_LOCALE, allowInput: false,
        defaultDate: new Date()
    });

    // === 2. Lắng nghe thay đổi SĐT → tự động tính số TK (nếu chế độ sdt) ===
    $('#sdt').on('input blur', function() {
        autoFillSoTK();
    });

    // === 6. Lắng nghe thay đổi radio stk_mode → cập nhật hint và refill ===
    $('input[name="stk_mode"]').on('change', function() {
        updateSTKModeUI();
        autoFillSoTK();
    });

    // === 7. Nếu mode manual thì bỏ readonly, mode auto thì readonly ===
    updateSTKModeUI();

    // === 8. Toggle field theo loại hình ===
    toggleFormFields();

    // === 9. Lắng nghe submit form ===
    $('#frm-mo-tk').off('submit').on('submit', handleSubmitMoTK);

    // === 10. Lắng nghe preview ảnh ===
    ['img_truoc', 'img_sau', 'img_qr', 'img_thuchien', 'img_dkkd'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', function() {
                previewImage(this, 'preview_' + id);
            });
        }
    });
}

// ========================================================
// CẬP NHẬT UI KHI THAY ĐỔI CHẾ ĐỘ TẠO SỐ TK
// ========================================================
function updateSTKModeUI() {
    const mode = $('input[name="stk_mode"]:checked').val();
    const $soTK = $('#so_tk');
    const $hintText = $('#stk-hint-text');

    switch (mode) {
        case 'ngaysinh':
            $soTK.prop('readonly', true).css('background-color', '#f0fdf4');
            $hintText.html('Tự động từ: <strong>1ddmmyyyy0</strong> (ngày sinh) — 10 số');
            break;
        case 'sdt':
            $soTK.prop('readonly', true).css('background-color', '#eff6ff');
            $hintText.html('Tự động từ: <strong>10 số cuối</strong> SĐT (bỏ đầu 0)');
            break;
        case 'manual':
            $soTK.prop('readonly', false).css('background-color', '');
            $hintText.html('<strong>Nhập thủ công</strong> 10 số cuối tài khoản');
            break;
    }
}

// ========================================================
// TỰ ĐỘNG ĐIỀN SỐ TK THEO CHẾ ĐỘ ĐANG CHỌN
// ========================================================
function autoFillSoTK() {
    const mode = $('input[name="stk_mode"]:checked').val();
    if (mode === 'manual') return; // Chế độ thủ công → không làm gì

    const $soTK = $('#so_tk');

    if (mode === 'ngaysinh') {
        // Format: 1ddmmyyyy0 → 10 ký tự (prefix 380020 là 6 số, phần sau cần 10 số)
        const ngaySinhVal = $('#ngay_sinh').val(); // YYYY-MM-DD
        if (!ngaySinhVal) { $soTK.val(''); return; }

        const parts = ngaySinhVal.split('-');
        if (parts.length !== 3) { $soTK.val(''); return; }

        const yyyy = parts[0];
        const mm = parts[1].padStart(2, '0');
        const dd = parts[2].padStart(2, '0');

        // Số TK = 1 + dd + mm + yyyy + 0 → tổng 10 chữ số
        const soTK10 = '1' + dd + mm + yyyy + '0';
        if (soTK10.length === 10) {
            $soTK.val(soTK10);
            // Trigger kiểm tra trùng
            checkDuplicate(document.getElementById('so_tk'));
        }
    } else if (mode === 'sdt') {
        // Lấy 10 số cuối của SĐT (bỏ số 0 đầu)
        let sdt = $('#sdt').val().trim().replace(/\D/g, '');
        if (!sdt || sdt.length < 10) { $soTK.val(''); return; }

        // Bỏ số 0 đầu nếu có → lấy 10 số cuối
        if (sdt.startsWith('0')) sdt = sdt.substring(1);
        const soTK10 = sdt.slice(-10).padStart(10, '0');

        $soTK.val(soTK10);
        checkDuplicate(document.getElementById('so_tk'));
    }
}

// ========================================================
// TỰ ĐỘNG TÍNH NGÀY HẾT HẠN CCCD
// Logic: Theo Luật CCCD Việt Nam
//  - Dưới 14 tuổi (khi cấp): hết hạn lúc 14 tuổi
//  - 14 ≤ tuổi < 23: hết hạn lúc 25 tuổi (năm sinh + 25)
//  - 23 ≤ tuổi < 38: hết hạn lúc 40 tuổi (năm sinh + 40)
//  - 38 ≤ tuổi < 58: hết hạn lúc 60 tuổi (năm sinh + 60)
//  - ≥ 58 tuổi: Không thời hạn → để trống
// Ngày, tháng hết hạn = ngày sinh (không đổi, chỉ đổi năm)
// ========================================================
function autoCalcNgayHetHan() {
    const ngaySinhVal = $('#ngay_sinh').val();    // YYYY-MM-DD
    const ngayCapVal  = $('#ngay_cap_cccd').val(); // YYYY-MM-DD
    const $hetHan = $('#ngay_het_han');

    if (!ngaySinhVal || !ngayCapVal) {
        // Chưa đủ dữ liệu → xoá ngày hết hạn
        if ($hetHan[0] && $hetHan[0]._flatpickr) $hetHan[0]._flatpickr.clear();
        else $hetHan.val('');
        return;
    }

    // Parse ngày sinh và ngày cấp
    const sinh = new Date(ngaySinhVal + 'T00:00:00');
    const cap  = new Date(ngayCapVal + 'T00:00:00');

    if (isNaN(sinh) || isNaN(cap)) return;

    // Tính tuổi tại thời điểm cấp CCCD
    let tuoiKhiCap = cap.getFullYear() - sinh.getFullYear();
    const m = cap.getMonth() - sinh.getMonth();
    if (m < 0 || (m === 0 && cap.getDate() < sinh.getDate())) {
        tuoiKhiCap--;
    }

    const namSinh = sinh.getFullYear();
    let namHetHan;

    if (tuoiKhiCap < 14) {
        namHetHan = namSinh + 14;          // Hết hạn lúc 14 tuổi
    } else if (tuoiKhiCap < 23) {
        namHetHan = namSinh + 25;          // Hết hạn lúc 25 tuổi
    } else if (tuoiKhiCap < 38) {
        namHetHan = namSinh + 40;          // Hết hạn lúc 40 tuổi
    } else if (tuoiKhiCap < 58) {
        namHetHan = namSinh + 60;          // Hết hạn lúc 60 tuổi
    } else {
        // Từ 58 tuổi trở lên: Không thời hạn
        if ($hetHan[0] && $hetHan[0]._flatpickr) $hetHan[0]._flatpickr.clear();
        else $hetHan.val('');
        // Hiển thị tooltip/text gợi ý
        $hetHan.siblings('.invalid-feedback').hide();
        return;
    }

    // Ngày hết hạn = cùng ngày, tháng với ngày sinh nhưng đổi năm
    const dd = String(sinh.getDate()).padStart(2, '0');
    const mm = String(sinh.getMonth() + 1).padStart(2, '0');
    const expiryISO = `${namHetHan}-${mm}-${dd}`;

    // Cập nhật vào Flatpickr (hoặc input thường)
    if ($hetHan[0] && $hetHan[0]._flatpickr) {
        $hetHan[0]._flatpickr.setDate(expiryISO, true);
    } else {
        $hetHan.val(expiryISO);
    }
}

// ========================================================
// TOGGLE FIELDS THEO LOẠI HÌNH
// ========================================================
function toggleFormFields() {
    const loaiHinh = $('#loai_hinh').val();
    const isHKD = (loaiHinh === 'Hộ kinh doanh');

    // Các trường chỉ có khi là HKD
    $('#div_dkkd, #div_ten_hkd, #div_dia_chi_kd, #div_ten_dang_nhap, #div_mat_khau').each(function() {
        if (isHKD) {
            $(this).removeClass('initially-hidden').show();
        } else {
            $(this).addClass('initially-hidden').hide();
        }
    });

    $('#div_img_dkkd').each(function() {
        if (isHKD) {
            $(this).removeClass('initially-hidden').show();
        } else {
            $(this).addClass('initially-hidden').hide();
        }
    });

    // Bắt buộc ĐKKD khi là HKD
    const dkkdEl = document.getElementById('dkkd');
    if (dkkdEl) dkkdEl.required = isHKD;
}

// ========================================================
// KIỂM TRA TRÙNG LẶP DỮ LIỆU (CCCD, SĐT, Số TK, ĐKKD)
// ========================================================
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
            // Khôi phục message gốc
            if (input.id === 'cccd') $(input).siblings('.invalid-feedback').text('Căn cước công dân bắt buộc đúng 12 chữ số.');
            else if (input.id === 'sdt') $(input).siblings('.invalid-feedback').text('SĐT bắt buộc bắt đầu bằng 0 và đủ 10 chữ số.');
            else if (input.id === 'so_tk') $(input).siblings('.invalid-feedback').text('Cần nhập đúng 10 chữ số cuối.');
            else if (input.id === 'dkkd') $(input).siblings('.invalid-feedback').text('Số giấy phép kinh doanh không hợp lệ.');
        }
    }, null, 'NONE');
}

// ========================================================
// XEM TRƯỚC ẢNH KHI CHỌN FILE
// ========================================================
function previewImage(input, previewId) {
    const file = input.files[0];
    const $previewBox = $('#' + previewId);
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $previewBox.removeClass('initially-hidden').show();
            $previewBox.find('img').attr('src', e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// ========================================================
// ĐIỀU HƯỚNG — Định nghĩa đầy đủ ở phần cuối file (loadStaffOpenAccountView)
// ========================================================

// ========================================================
// QR CCCD Scanning Logic
// ========================================================
let html5QrCode;

function openCCCDScanner() {
    $('#qrScannerModal').modal('show');
    $('#qr-loading').removeClass('d-none');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function(stream) {
                stream.getTracks().forEach(track => track.stop());
                setTimeout(() => {
                    html5QrCode = new Html5Qrcode('qr-reader');
                    const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };
                    $('#qr-loading').addClass('d-none');
                    html5QrCode.start({ facingMode: 'environment' }, config, onScanSuccess)
                    .catch(() => {
                        showAlert('Lỗi Camera', 'Không thể khởi động camera quét. Hãy kiểm tra trình duyệt.', 'error');
                        closeCCCDScanner();
                    });
                }, 500);
            })
            .catch(function() {
                $('#qr-loading').addClass('d-none');
                showAlert('Lỗi Quyền truy cập', 'Bạn chưa cấp quyền máy ảnh. Vui lòng cấp quyền trong cài đặt trình duyệt để tiếp tục.', 'error');
                closeCCCDScanner();
            });
    } else {
        showAlert('Trình duyệt không hỗ trợ', 'Trình duyệt của bạn không hỗ trợ truy cập máy ảnh.', 'error');
    }
}

function closeCCCDScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            html5QrCode.clear();
            html5QrCode = null;
        }).catch((err) => {
            console.log('Failed to clear html5QrCode:', err);
        });
    }
    $('#qrScannerModal').modal('hide');
}

function onScanSuccess(decodedText) {
    // Format chuẩn CCCD VN: CCCD|CMT_cũ|Tên|ngàysinhddMMyyyy|Giới tính|Địa chỉ|ngàycapddMMyyyy
    closeCCCDScanner();
    const parts = decodedText.split('|');
    if (parts.length >= 7) {
        const cccd    = parts[0];
        const name    = parts[2];
        const dobStr  = parts[3]; // ddMMyyyy
        const address = parts[5];
        const issueStr = parts[6]; // ddMMyyyy

        $('#cccd').val(cccd);
        $('#ten_kh').val(name.toUpperCase());
        $('#dia_chi').val(address);

        // Điền ngày sinh
        if (dobStr && dobStr.length === 8 && $('#ngay_sinh')[0]._flatpickr) {
            const dob = `${dobStr.substring(4,8)}-${dobStr.substring(2,4)}-${dobStr.substring(0,2)}`;
            $('#ngay_sinh')[0]._flatpickr.setDate(dob, true); // true để trigger onChange
        }

        // Điền ngày cấp và thời hạn
        if (issueStr && issueStr.length === 8 && $('#ngay_cap_cccd')[0]._flatpickr) {
            const issue = `${issueStr.substring(4,8)}-${issueStr.substring(2,4)}-${issueStr.substring(0,2)}`;
            $('#ngay_cap_cccd')[0]._flatpickr.setDate(issue, true); // true để trigger onChange → sẽ gọi autoCalcNgayHetHan
        }

        // Trigger kiểm tra trùng CCCD
        checkDuplicate(document.getElementById('cccd'));

        // Sau khi điền ngày (có delay nhỏ để flatpickr cập nhật value), trigger auto số TK
        setTimeout(() => {
            autoFillSoTK();
        }, 100);

        Swal.fire({
            title: 'Thành công!',
            text: 'Dữ liệu CCCD đã được tự động điền.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    } else {
        showAlert('Mã QR không hợp lệ', 'Vui lòng quét đúng chuẩn định dạng QR CCCD.', 'warning');
    }
}

// ========================================================
// TÍNH NGÀY HẾT HẠN CCCD TỪ CHUỖI THÔ (dùng cho QR scan)
// Hàm dùng khi chỉ có chuỗi ddMMyyyy (format QR code)
// ========================================================
function calculateCCCDExpiry(dobStr, issueStr) {
    if (!dobStr || !issueStr || dobStr.length !== 8 || issueStr.length !== 8) return '';

    const d_d = parseInt(dobStr.substring(0, 2));
    const d_m = parseInt(dobStr.substring(2, 4)) - 1;
    const d_y = parseInt(dobStr.substring(4, 8));

    const i_d = parseInt(issueStr.substring(0, 2));
    const i_m = parseInt(issueStr.substring(2, 4)) - 1;
    const i_y = parseInt(issueStr.substring(4, 8));

    const dob   = new Date(d_y, d_m, d_d);
    const issue = new Date(i_y, i_m, i_d);

    // Tính tuổi tại thời điểm cấp CCCD
    let tuoiKhiCap = issue.getFullYear() - dob.getFullYear();
    const dm = issue.getMonth() - dob.getMonth();
    if (dm < 0 || (dm === 0 && issue.getDate() < dob.getDate())) {
        tuoiKhiCap--;
    }

    let namHetHan;
    if (tuoiKhiCap < 14) {
        namHetHan = d_y + 14;
    } else if (tuoiKhiCap < 23) {
        namHetHan = d_y + 25;
    } else if (tuoiKhiCap < 38) {
        namHetHan = d_y + 40;
    } else if (tuoiKhiCap < 58) {
        namHetHan = d_y + 60;
    } else {
        return ''; // Không thời hạn
    }

    // Ngày hết hạn = cùng ngày tháng sinh, chỉ khác năm
    return `${namHetHan}-${String(d_m + 1).padStart(2, '0')}-${String(d_d).padStart(2, '0')}`;
}

// ========================================================
// HANDLER SUBMIT FORM MỞ TÀI KHOẢN
// ========================================================
async function handleSubmitMoTK(e) {
    e.preventDefault();

    // Validate HTML5 built-in
    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }

    const btn = $('#btnSubmitAccount');
    const oldBtn = btn.html();
    btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span> Đang xử lý...');

    const progressWrapper = $('#compress-progress-wrapper');
    const progressBar     = $('#compress-progress-bar');
    const progressLabel   = $('#compress-progress-label');
    const progressPct     = $('#compress-progress-pct');

    const updateUIProgress = (label, pct) => {
        progressLabel.text(label);
        progressPct.text(pct + '%');
        progressBar.css('width', pct + '%');
    };

    try {
        // === Thu thập dữ liệu form ===
        const loaiHinh = $('#loai_hinh').val();
        const soTK10   = $('#so_tk').val().trim();

        // Collect payload
        const payload = {
            // v3.0 Sprint 1 Fix IMPORTANT-02: Gửi kèm email cán bộ để backend ghi "Cán bộ thực hiện"
            email:     AppState.user ? AppState.user.email : '',
            ten_kh:    $('#ten_kh').val().trim().toUpperCase(),
            loai_hinh: loaiHinh,
            cccd:      $('#cccd').val().trim(),
            ngay_sinh: $('#ngay_sinh').val(),
            ngay_cap_cccd:  $('#ngay_cap_cccd').val(),
            ngay_het_han:   $('#ngay_het_han').val(),
            dia_chi:   $('#dia_chi').val().trim(),
            sdt:       $('#sdt').val().trim(),
            so_tk:     soTK10 ? ('380020' + soTK10) : '',
            ngay_mo:   $('#ngay_mo').val(),
            // Thành viên → Đối tượng
            doi_tuong:    $('#is_member').prop('checked') ? 'Thành viên' : 'Ngoài thành viên',
            is_activated: $('#is_activated').prop('checked') ? 'TRUE' : 'FALSE',
            // Thiết bị cung cấp
            co_qr:        $('#co_qr').prop('checked'),
            co_loa:       $('#co_loa').prop('checked'),
            nganh_nghe:   $('#nganh_nghe').val().trim().toUpperCase(),
            // HKD fields
            dkkd:         $('#dkkd').val().trim(),
            ten_hkd:      $('#ten_hkd').val().trim().toUpperCase(),
            dia_chi_kd:   $('#dia_chi_kd').val().trim(),
            ten_dang_nhap: $('#ten_dang_nhap').val().trim(),
            mat_khau:      $('#mat_khau').val().trim(),
        };


        // === Validate bổ sung backend-side ===
        if (!payload.ten_kh) throw new Error('Tên khách hàng không được để trống!');
        if (!payload.ngay_mo) throw new Error('Ngày đăng ký không được để trống!');
        if (!payload.so_tk || payload.so_tk.length < 9) throw new Error('Số tài khoản chưa đầy đủ!');
        if (loaiHinh === 'Hộ kinh doanh' && !payload.dkkd) throw new Error('Số ĐKKD bắt buộc với Hộ kinh doanh!');

        // === Nén và upload ảnh ===
        progressWrapper.removeClass('initially-hidden').show();
        updateUIProgress('Đang nén ảnh CCCD trước...', 10);

        const imageResults = await processAndUploadImages(updateUIProgress);

        // Gộp payload và ảnh
        Object.assign(payload, imageResults);

        updateUIProgress('Đang gửi dữ liệu...', 90);

        // === Gọi API submit ===
        runAPI('api_submitaccount', payload, (res) => {
            btn.prop('disabled', false).html(oldBtn);
            progressWrapper.addClass('initially-hidden').hide();

            if (res && res.status === 'success') {
                Swal.fire({
                    title: '🎉 Đã gửi thành công!',
                    html: `<p class="mb-1">Hồ sơ <strong>${payload.ten_kh}</strong> đã được lưu.</p>
                           <p class="mb-0 text-muted small">Số TK: <strong>${payload.so_tk}</strong></p>`,
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
                // Reset form
                document.getElementById('frm-mo-tk').reset();
                document.getElementById('frm-mo-tk').classList.remove('was-validated');
                // Reset Flatpickr
                document.querySelectorAll('.js-datepicker').forEach(el => {
                    if (el._flatpickr) el._flatpickr.clear();
                });
                // Reset về ngày mở = hôm nay
                const ngayMoEl = document.getElementById('ngay_mo');
                if (ngayMoEl && ngayMoEl._flatpickr) ngayMoEl._flatpickr.setDate(new Date(), true);
                // Reset preview ảnh
                ['img_truoc','img_sau','img_qr','img_thuchien','img_dkkd'].forEach(id => {
                    const pv = document.getElementById('preview_' + id);
                    if (pv) { pv.classList.add('initially-hidden'); pv.style.display = 'none'; }
                });
                // Reset mode về ngaysinh
                document.getElementById('stk_mode_ngaysinh').checked = true;
                updateSTKModeUI();
                toggleFormFields();
            } else {
                const errMsg = (res && res.message) ? res.message : 'Lỗi không xác định!';
                setTimeout(() => { progressWrapper.addClass('initially-hidden').hide(); }, 5000);
                showAlert('Lỗi', errMsg, 'error');
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

    } catch (err) {
        btn.prop('disabled', false).html(oldBtn);
        progressWrapper.addClass('initially-hidden').hide();
        showAlert('Lỗi', err.message, 'error');
    }
}

// ========================================================
// NÉN VÀ CHUẨN BỊ ẢNH (đọc dưới dạng base64)
// Hàm trả về Promise<{img_truoc, img_sau, img_qr, img_thuchien, img_dkkd}>
// ========================================================
async function processAndUploadImages(updateUIProgress) {
    const fileIds = [
        { id: 'img_truoc', label: 'CCCD mặt trước', required: true },
        { id: 'img_sau',   label: 'CCCD mặt sau',   required: true },
        { id: 'img_qr',    label: 'QR tài khoản',   required: true },
        { id: 'img_thuchien', label: 'Ảnh thực hiện', required: true },
        { id: 'img_dkkd',  label: 'Giấy phép ĐKKD', required: false },
    ];

    const result = {};
    let pct = 10;
    const pctStep = Math.floor(70 / fileIds.length);

    for (const item of fileIds) {
        const el = document.getElementById(item.id);
        if (!el || !el.files || el.files.length === 0) {
            if (item.required) throw new Error(`Vui lòng chọn ảnh: ${item.label}!`);
            result[item.id] = '';
            continue;
        }
        updateUIProgress(`Đang nén ${item.label}...`, pct);
        const b64 = await readFileAsBase64(el.files[0], 500); // giới hạn 500KB
        result[item.id] = b64;
        pct += pctStep;
        updateUIProgress(`Đã nén ${item.label}`, Math.min(pct, 85));
    }
    return result;
}

/**
 * Đọc file ảnh, compress về base64 ≤ maxKB KB
 */
function readFileAsBase64(file, maxKB = 500) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // Giảm kích thước nếu quá lớn
                const MAX_DIM = 1200;
                if (width > MAX_DIM || height > MAX_DIM) {
                    if (width > height) {
                        height = Math.round(height * MAX_DIM / width);
                        width = MAX_DIM;
                    } else {
                        width = Math.round(width * MAX_DIM / height);
                        height = MAX_DIM;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);

                // Nén với chất lượng giảm dần cho đến khi đạt giới hạn
                let quality = 0.85;
                let dataUrl;
                do {
                    dataUrl = canvas.toDataURL('image/jpeg', quality);
                    quality -= 0.05;
                } while (dataUrl.length > maxKB * 1024 * 1.37 && quality > 0.1);

                resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ===================================================================
// NAVIGATION HELPER — Dùng cho Bottom Nav (Staff)
// ===================================================================

/**
 * Chuyển sang màn hình Mở tài khoản mới (tab "Mở TK")
 * Gọi initMoTaiKhoanForm() nếu chưa init lần nào.
 */
window._moTaiKhoanInited = false;
window.loadStaffOpenAccountView = function() {
    showView('view-mo-tai-khoan');
    updateBottomNavActive('navOpenAccount');
    if (!window._moTaiKhoanInited) {
        if (typeof initMoTaiKhoanForm === 'function') initMoTaiKhoanForm();
        window._moTaiKhoanInited = true;
    }
    // Scroll lên đầu khi chuyển tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Cập nhật trạng thái active cho bottom nav
 * @param {string} activeId - ID của nav item đang active
 */
function updateBottomNavActive(activeId) {
    $('#staffBottomNav .nav-link').removeClass('active text-primary fw-bold');
    $('#' + activeId).addClass('active text-primary fw-bold');
}
