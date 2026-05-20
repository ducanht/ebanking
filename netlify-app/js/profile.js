/**
 * ============================================================
 * PROFILE.JS — Module Quản lý Hồ Sơ PDF
 * v2.4.0 — Fix: Dùng _customerMap thay .data() để tương thích Select2
 *
 * Luồng Staff: Chọn KH → Preview → Chọn mẫu → Tạo PDF → Tải về
 * Luồng Admin: Modal Cấu hình Mẫu → Lưu vào Config_Templates sheet
 * ============================================================
 */

const ProfileManager = {

    templates:    [],   // Cache danh sách mẫu biểu
    _customerMap: {},   // Map: customerId → full customer object
                        // (Select2 clone DOM nên .data() trên <option> bị mất,
                        //  phải lưu vào object riêng để tra cứu khi chọn)

    // ===================================================
    // KHỞI TẠO
    // ===================================================

    init: function() {
        // Dùng event delegation ($(document).on) để hoạt động
        // dù element được inject vào DOM sau khi trang load
        $(document).on('change', '#profile-customer-select', this.onCustomerSelected.bind(this));
        $(document).on('change', '#profile-template-select', this.onTemplateSelected.bind(this));
        $(document).on('submit', '#frmGenerateProfile',      this.generateProfilePDF.bind(this));
        $(document).on('click',  '#btnSaveTemplates',        this.saveTemplatesAdmin.bind(this));
        $(document).on('click',  '#btnConfirmExportPDF',     this.confirmExportPDF.bind(this));
        $(document).on('click',  '#btnCancelDraft',          this.cancelDraft.bind(this));
        $(document).on('click',  '.btn-delete-template', function() {
            $(this).closest('tr').remove();
        });
        // ✅ Copy placeholder when clicked
        $(document).on('click', '.copyable-placeholder', function() {
            const text = $(this).text();
            navigator.clipboard.writeText(text).then(() => {
                const $el = $(this);
                const originalBg = $el.css('background-color');
                $el.css('background-color', '#10b981').css('color', '#fff');
                setTimeout(() => $el.css('background-color', '').css('color', ''), 1000);
                
                // Show toast or small feedback
                if (typeof Swal !== 'undefined' && Swal.resumeTimer) {
                    // Small toast if needed, but the color change is usually enough
                }
            });
        });

        // ✅ Search placeholders
        $(document).on('input', '#search-placeholder', this.filterPlaceholders.bind(this));

        // ✅ Live preview Số TK đầy đủ khi người dùng gõ vào #profile-stk
        $(document).on('input', '#profile-stk', function() {
            const val = $(this).val().replace(/\D/g, '').slice(0, 9); // Chỉ chữ số, tối đa 9
            $(this).val(val); // Tự động strip ký tự không hợp lệ
            $('#profile-stk-preview').text(val ? '380020' + val : '--');
        });
    },

    /**
     * Khởi tạo hoặc Re-init Select2 SAU KHI đã có dữ liệu option
     * Lý do gọi sau: Select2 cần biết số lượng option để quyết định
     * có hiển thị search box hay không (minimumResultsForSearch)
     */
    initCustomerSelect2: function() {
        const $el = $('#profile-customer-select');
        if (!$el.length || typeof $.fn.select2 === 'undefined') return;

        // Destroy instance cũ trước để tránh duplicate event
        if ($el.hasClass('select2-hidden-accessible')) {
            $el.select2('destroy');
        }

        $el.select2({
            theme:    'bootstrap-5',
            width:    '100%',
            placeholder: '-- Gõ tên, CCCD, số điện thoại để tìm --',
            allowClear: true,
            language: {
                noResults: function() { return 'Không tìm thấy khách hàng.'; },
                searching: function() { return 'Đang tìm kiếm...'; }
            },
            // ✅ Custom matcher: tìm không phân biệt hoa/thường và không dấu tiếng Việt
            matcher: function(params, data) {
                if (!params.term || !params.term.trim()) return data;
                const terms = utils_normalizeVN(params.term).split(/\s+/).filter(Boolean);
                const haystack = utils_normalizeVN(data.text || '');
                if (terms.every(t => haystack.includes(t))) return data;
                return null;
            }
        });
    },

    // ===================================================
    // STAFF: LOAD VIEW TẠO HỒ SƠ
    // ===================================================

    loadView: function() {
        showView('view-tao-ho-so');
        this.loadCustomersForSelect();
        this.loadTemplatesForSelect();
        this.loadRecentHistory();
    },

    /**
     * Tải danh sách KH của cán bộ đang đăng nhập vào Select2
     *
     * Lỗi phổ biến đã fix:
     *   - KHÔNG dùng $opt.data('customer', c) vì Select2 clone <option>
     *     sang shadow DOM riêng → .data() ở <option> gốc bị mất
     *   - GIẢI PHÁP: Lưu c vào this._customerMap[id], onCustomerSelected
     *     tra cứu bằng ID thay vì .data()
     *
     * Key trả về từ backend (tên cột gốc tiếng Việt):
     *   'ID', 'Tên khách hàng', 'Số CCCD', 'Số điện thoại', 'Địa chỉ', 'Ngành nghề KD'
     */
    loadCustomersForSelect: function() {
        const $select = $('#profile-customer-select');

        // Hiển thị loading trong dropdown
        $select.empty().append('<option value="">-- Đang tải danh sách... --</option>');
        // Nếu Select2 đã init, trigger để UI cập nhật placeholder
        if ($select.hasClass('select2-hidden-accessible')) {
            $select.trigger('change.select2');
        }

        // Reset map mỗi lần load
        this._customerMap = {};

        APIClient.call('api_getmycustomers', {})
            .then(res => {
                if (res.status !== 'success') {
                    $select.empty().append('<option value="">-- Lỗi tải dữ liệu --</option>');
                    Swal.fire('Lỗi', res.message || 'Không thể tải danh sách khách hàng.', 'error');
                    return;
                }

                const customers = res.data || [];

                // Reset về option rỗng đầu tiên
                $select.empty().append('<option value="">-- Chọn khách hàng cần in --</option>');

                if (customers.length === 0) {
                    showAlert('Thông báo', 'Bạn chưa có hồ sơ nào được ghi nhận trong hệ thống. Hãy mở tài khoản trước.', 'info');
                    this.initCustomerSelect2();
                    return;
                }

                customers.forEach(c => {
                    // Xóa prefix ' — Google Sheets tự thêm để lưu số dạng text
                    const id      = String(c['ID']             || '').replace(/^'/, '').trim();
                    const tenKH   = String(c['Tên khách hàng'] || '(Không tên)').trim();
                    const rawCCCD = String(c['Số CCCD']        || '').replace(/^'/, '').trim();

                    if (!id) return; // Bỏ dòng không có ID (header hoặc dòng rỗng)

                    // ✅ Lưu vào map để onCustomerSelected() tra cứu bằng ID
                    this._customerMap[id] = c;

                    // ✅ Option text đầy đủ: Tên + CCCD + SĐT — Select2 tìm kiếm trong text này
                    const sdt = String(c['Số điện thoại'] || '').replace(/^'/, '').trim();
                    const tenHKD = String(c['Tên hộ kinh doanh'] || '').trim();
                    const optLabel = tenHKD
                        ? `${utils_escapeHTML(tenHKD)} (${utils_escapeHTML(tenKH)}) — ${rawCCCD} — ${sdt}`
                        : `${utils_escapeHTML(tenKH)} — ${rawCCCD} — ${sdt}`;

                    $select.append(
                        `<option value="${id}">${optLabel}</option>`
                    );
                });

                // ✅ Gọi initCustomerSelect2() SAU KHI đã append xong option
                // để Select2 nhìn thấy đúng số lượng item
                this.initCustomerSelect2();
            })
            .catch(err => {
                console.error('[ProfileManager] loadCustomersForSelect:', err);
                $select.empty().append('<option value="">-- Lỗi kết nối --</option>');
                Swal.fire('Lỗi mạng', 'Không thể tải danh sách khách hàng. Vui lòng thử lại.', 'error');
            });
    },

    /**
     * Tải lịch sử 5 hồ sơ gần nhất của cán bộ
     */
    loadRecentHistory: function() {
        const $container = $('#profile-recent-list');
        $container.html(`
            <div class="text-center py-4">
                <div class="spinner-border spinner-border-sm text-primary opacity-50"></div>
                <p class="small text-muted mt-2 mb-0">Đang tải lịch sử...</p>
            </div>
        `);

        APIClient.call('api_getrecentprofiles', {
            email: AppState.user ? AppState.user.email : ''
        })
        .then(res => {
            if (res.status !== 'success') {
                $container.html(`
                    <div class="text-center py-4 text-danger opacity-75">
                        <i class='bx bx-error-circle fs-2'></i>
                        <p class="small mb-0">Lỗi tải lịch sử</p>
                    </div>
                `);
                return;
            }

            const logs = res.data || [];
            if (logs.length === 0) {
                $container.html(`
                    <div class="text-center py-4 text-muted opacity-50">
                        <i class='bx bx-history fs-1'></i>
                        <p class="small mb-0">Chưa có lịch sử in</p>
                    </div>
                `);
                return;
            }

            let html = '<div class="list-group list-group-flush rounded-3 border overflow-hidden">';
            logs.forEach(log => {
                const timeStr = utils_formatVN(log['Thời điểm'], 'datetime');
                const fileUrl = log['Link file'] || '#';
                const fileName = log['Tên file'] || 'Hồ sơ PDF';
                const customer = log['Khách hàng'] || 'N/A';
                const template = log['Mẫu biểu'] || 'Mẫu mặc định';

                html += `
                    <a href="${fileUrl}" target="_blank" class="list-group-item list-group-item-action p-3 border-bottom-0">
                        <div class="d-flex w-100 justify-content-between align-items-start">
                            <div class="me-2">
                                <div class="fw-bold text-dark small mb-0">${utils_escapeHTML(customer)}</div>
                                <div class="text-muted" style="font-size: 0.7rem;">
                                    <i class='bx bx-file-blank me-1'></i>${utils_escapeHTML(template)}
                                </div>
                            </div>
                            <span class="badge bg-light text-muted border" style="font-size: 0.65rem;">${timeStr}</span>
                        </div>
                    </a>
                `;
            });
            html += '</div>';
            
            $container.html(html);
        })
        .catch(err => {
            console.error('[ProfileManager] loadRecentHistory:', err);
            $container.html('<div class="text-center py-4 text-danger">Lỗi kết nối lịch sử.</div>');
        });
    },

    /**
     * Lọc danh sách placeholder khi gõ tìm kiếm
     */
    filterPlaceholders: function() {
        const query = utils_normalizeVN($('#search-placeholder').val().toLowerCase());
        
        $('.placeholder-cat').each(function() {
            let hasVisible = false;
            $(this).find('.copyable-placeholder').each(function() {
                const tag   = $(this).text().toLowerCase();
                const title = utils_normalizeVN($(this).attr('title') || '').toLowerCase();
                
                if (tag.includes(query) || title.includes(query)) {
                    $(this).removeClass('d-none');
                    hasVisible = true;
                } else {
                    $(this).addClass('d-none');
                }
            });

            // Nếu category không còn tag nào khớp → ẩn cả category
            if (hasVisible) {
                $(this).removeClass('d-none');
            } else {
                $(this).addClass('d-none');
            }
        });
    },

    /**
     * Tải danh sách mẫu biểu vào dropdown
     * Key trả về (backend đã chuẩn hóa camelCase): id, name, fileId, status
     */
    loadTemplatesForSelect: function() {
        const $select = $('#profile-template-select');
        $select.empty().append('<option value="">-- Đang tải mẫu biểu... --</option>');

        APIClient.call('api_gettemplates', {})
            .then(res => {
                $select.empty().append('<option value="">-- Chọn Mẫu Hồ Sơ --</option>');

                if (res.status === 'success') {
                    this.templates = res.data || [];
                    const activeTemplates = this.templates.filter(t => t.status !== 'Ngừng hoạt động');

                    if (activeTemplates.length === 0) {
                        $select.empty().append('<option value="">-- Chưa có mẫu (Admin cần cấu hình) --</option>');
                        return;
                    }

                    activeTemplates.forEach(t => {
                        // value = t.fileId (Google Drive File ID của template Sheet)
                        $select.append(
                            `<option value="${utils_escapeHTML(t.fileId)}">${utils_escapeHTML(t.name)}</option>`
                        );
                    });
                } else {
                    // Sprint 2 Fix XSS: escape message trước khi chèn vào HTML
                    $select.empty().append(`<option value="">-- Lỗi: ${utils_escapeHTML(String(res.message || 'Không xác định'))} --</option>`);
                }
            })
            .catch(err => {
                console.error('[ProfileManager] loadTemplatesForSelect:', err);
                $select.empty().append('<option value="">-- Lỗi kết nối --</option>');
            });
    },

    /**
     * Sự kiện chọn khách hàng → Hiển thị preview đầy đủ thông tin
     * ✅ Tra cứu qua this._customerMap[customerId] thay vì .data()
     */
    onCustomerSelected: function() {
        const customerId = $('#profile-customer-select').val();
        const $preview   = $('#profile-customer-preview');
        const $emptyHint = $('#profile-empty-hint');

        // Reset summary badge
        $('#profile-missing-summary, #profile-complete-summary').addClass('d-none');

        if (!customerId) {
            $preview.addClass('d-none');
            $emptyHint.removeClass('d-none');
            return;
        }

        const c = this._customerMap[customerId];
        if (!c) {
            $preview.addClass('d-none');
            $emptyHint.removeClass('d-none');
            return;
        }

        // ✅ Cuộn đến phần preview để staff dễ nhìn (đặc biệt trên mobile)
        const targetScroll = document.getElementById('profile-customer-preview');
        if (targetScroll) {
            window.scrollTo({
                top: targetScroll.offsetTop - 100,
                behavior: 'smooth'
            });
        }

        // ─── Helper: điền một trường, highlight đỏ nếu rỗng ───────────────────
        // required=true → trường bắt buộc: hiện badge đỏ "Còn thiếu"
        // required=false → trường tùy chọn: hiện badge xám "Chưa có"
        const _field = (elId, value, required, type = 'text') => {
            const $el = $('#' + elId);
            if (!$el.length) return 0;

            let v = String(value || '').replace(/^'/, '').trim();
            const isInvalid = !v || v === 'N/A' || v === '--' || v === 'null' || v === 'undefined';

            if (!isInvalid) {
                // Nếu là ngày tháng, ưu tiên format VN
                if (type === 'date') v = utils_formatVN(v, 'date');
                else if (type === 'datetime') v = utils_formatVN(v, 'datetime');
                
                $el.html(`<span class="text-dark fw-semibold">${utils_escapeHTML(v)}</span>`);
                return 0; // Không thiếu
            } else {
                if (required) {
                    $el.html(`
                        <span class="text-danger small fw-bold">
                            <i class='bx bx-error-circle me-1'></i>Yêu cầu bổ sung
                        </span>
                    `);
                    return 1; // Thiếu trường bắt buộc
                } else {
                    $el.html(`<span class="text-muted small fst-italic opacity-50">Chưa cập nhật</span>`);
                    return 0; // Thiếu nhưng không bắt buộc
                }
            }
        };

        // ─── Helper: render ảnh thumbnail ──────────────────────────────────────
        const _imgSlot = (label, url) => {
            const u = String(url || '').trim();
            if (u && u !== 'N/A' && u !== 'null') {
                // Tạo thumbnail URL từ Drive link sử dụng Regex để tách File ID chuẩn xác hơn
                let thumb = u;
                let fid = null;
                
                const driveRegex = [
                    /\/d\/([a-zA-Z0-9_-]{25,})\//,
                    /id=([a-zA-Z0-9_-]{25,})/,
                    /file\/d\/([a-zA-Z0-9_-]{25,})/
                ];

                for (let reg of driveRegex) {
                    const match = u.match(reg);
                    if (match && match[1]) {
                        fid = match[1];
                        break;
                    }
                }

                if (fid) {
                    thumb = `https://drive.google.com/thumbnail?id=${fid}&sz=w300`;
                }

                return `
                    <div class="col-6 col-md-4">
                        <div class="img-slot-premium border rounded overflow-hidden bg-white shadow-sm text-center" 
                             style="cursor:zoom-in" 
                             onclick="ProfileManager.viewImage('${utils_escapeHTML(label)}', '${utils_escapeHTML(u)}', '${fid}')">
                            <div class="bg-light d-flex align-items-center justify-content-center position-relative" style="height:120px;">
                                <img src="${thumb}" class="img-fluid" style="max-height:100%; object-fit:contain;"
                                     onerror="this.src='https://placehold.co/200x120?text=Lỗi+Ảnh'"
                                     alt="${utils_escapeHTML(label)}">
                                <div class="position-absolute bottom-0 end-0 p-1 opacity-50">
                                    <i class='bx bx-zoom-in text-dark bg-white rounded-circle p-1' style="font-size:0.8rem"></i>
                                </div>
                            </div>
                            <div class="small text-muted px-2 py-1 border-top text-truncate bg-white fw-bold" style="font-size: 0.65rem;" title="${utils_escapeHTML(label)}">${utils_escapeHTML(label)}</div>
                        </div>
                    </div>`;
            } else {
                return `
                    <div class="col-6 col-md-4">
                        <div class="border rounded bg-light text-center py-4 shadow-sm opacity-75 d-flex flex-column align-items-center justify-content-center" style="height:145px; border-style: dashed !important;">
                            <i class='bx bx-image-alt text-muted' style="font-size:2rem;opacity:.3"></i>
                            <div class="small text-muted mt-1 px-1 text-truncate" style="font-size: 0.65rem;">${utils_escapeHTML(label)}</div>
                            <span class="badge bg-secondary-subtle text-secondary mt-1" style="font-size:.6rem">Chưa có ảnh</span>
                        </div>
                    </div>`;
            }
        };

        // ─── Extract raw values (Xử lý tiền tố ' và các biến thể tên cột) ──────
        const rawCCCD    = String(c['Số CCCD']        || '').replace(/^'/, '').trim();
        const rawSDT     = String(c['Số điện thoại']  || '').replace(/^'/, '').trim();
        const rawSTK     = String(c['Số TK'] || c['Số tài khoản'] || '').replace(/^'/, '').trim();
        const rawDKKD    = String(c['Số DKKD'] || c['Số ĐKKD'] || '').replace(/^'/, '').trim();
        const loaiHinh   = String(c['Loại hình dịch vụ'] || 'Khác').trim();
        const isHKD      = loaiHinh.toLowerCase().includes('hộ kinh doanh');

        // ─── Hiện/ẩn UI ────────────────────────────────────────────────────────
        $preview.removeClass('d-none');
        $emptyHint.addClass('d-none');

        // ─── Thông tin cá nhân ─────────────────────────────────────────────────
        $('#preview-name').text(c['Tên khách hàng'] || '(Không tên)');

        // Badge Trạng thái
        const status = c['Trạng thái'] || 'Chưa rõ';
        let statusBadge = `<span class="badge bg-secondary">${utils_escapeHTML(status)}</span>`;
        if (status === 'Đã kích hoạt')   statusBadge = `<span class="badge bg-success">${utils_escapeHTML(status)}</span>`;
        else if (status === 'Chưa kích hoạt') statusBadge = `<span class="badge bg-warning text-dark">${utils_escapeHTML(status)}</span>`;
        $('#preview-trangthai').html(statusBadge);

        // Badge Đối tượng
        const doiTuong = c['Đối tượng'] || '';
        const dtColor  = doiTuong === 'Thành viên' ? 'primary' : 'secondary';
        $('#preview-doituong-badge').text(doiTuong).attr('class', `badge bg-${dtColor} ms-1`);

        // Đếm số trường bắt buộc còn thiếu
        let missingCount = 0;
        missingCount += _field('preview-cccd',       rawCCCD,                         true);
        missingCount += _field('preview-ngaysinh',   c['Ngày sinh'],                  false, 'date');
        missingCount += _field('preview-ngaycap',    c['Ngày cấp CCCD'],              true,  'date');
        missingCount += _field('preview-ngayhethan', c['Ngày hết hạn'],               true,  'date');
        missingCount += _field('preview-noicap',     c['Nơi cấp CCCD'] || c['Nơi cấp'], true);
        missingCount += _field('preview-phone',      rawSDT,                           true);
        missingCount += _field('preview-email',      c['Email KH'],                   false);
        missingCount += _field('preview-diachi',     c['Địa chỉ'],                    true);

        // ─── Hộ kinh doanh ─────────────────────────────────────────────────────
        if (isHKD) {
            $('#preview-hkd-card').removeClass('d-none');
            missingCount += _field('preview-tenhkd',   c['Tên hộ kinh doanh'],        true);
            missingCount += _field('preview-dkkd',     rawDKKD,                        true);
            missingCount += _field('preview-nganhnghe',c['Ngành nghề KD'],             true);
            missingCount += _field('preview-diachikd', c['Địa chỉ KD'],               true);
        } else {
            $('#preview-hkd-card').addClass('d-none');
            // Reset các trường HKD khi không phải HKD
            ['preview-tenhkd', 'preview-dkkd', 'preview-nganhnghe', 'preview-diachikd'].forEach(id => {
                $('#' + id).html('<span class="text-muted small fst-italic">N/A</span>');
            });
        }

        // ─── Tài khoản & Dịch vụ ──────────────────────────────────────────────
        _field('preview-loaihinh', loaiHinh, false);
        _field('preview-doituong', doiTuong, false);
        missingCount += _field('preview-stk',    rawSTK,            true);
        _field('preview-ngaymo', c['Ngày mở TK'] || c['Thời điểm nhập'], false, 'date');

        const trueVals = ['true', 'có', 'x', '1', 'yes'];
        const hasQR  = trueVals.includes(String(c['Cung cấp Mã QR'] || '').trim().toLowerCase());
        const hasLoa = trueVals.includes(String(c['Cung cấp Loa']   || '').trim().toLowerCase());
        $('#preview-coqr').html(hasQR
            ? `<span class="badge bg-success"><i class='bx bx-check'></i> Có</span>`
            : `<span class="badge bg-secondary">Không</span>`);
        $('#preview-coloa').html(hasLoa
            ? `<span class="badge bg-success"><i class='bx bx-check'></i> Có</span>`
            : `<span class="badge bg-secondary">Không</span>`);

        // ─── Hình ảnh ──────────────────────────────────────────────────────────
        let imgsHtml  = _imgSlot('CCCD Mặt trước',  c['URL CCCD Trước']);
        imgsHtml     += _imgSlot('CCCD Mặt sau',    c['URL CCCD Sau']);
        if (isHKD)
            imgsHtml += _imgSlot('GP ĐKKD',         c['URL GP DKKD']);
        imgsHtml     += _imgSlot('Ảnh QR',          c['URL QR']);
        imgsHtml     += _imgSlot('Ảnh thực hiện',   c['URL Ảnh Thực Hiện']);
        imgsHtml     += _imgSlot('Hồ sơ scan',      c['URL Hồ Sơ Scan']);
        $('#preview-images-row').html(imgsHtml);

        // ─── Tự động điền Số TK (chỉ điền phần suffix, không có prefix '380020') ──
        // Lý do: Input #profile-stk chỉ nhận 9 số cuối. Frontend tự ghép prefix khi gửi.
        const stkSuffix = rawSTK.startsWith('380020') ? rawSTK.slice(6) : rawSTK;
        $('#profile-stk').val(stkSuffix || '');
        $('#profile-stk-preview').text(stkSuffix ? '380020' + stkSuffix : '--');

        // ─── Banner tổng kết thiếu/đủ ──────────────────────────────────────────
        if (missingCount > 0) {
            $('#profile-missing-count').text(missingCount);
            $('#profile-missing-summary').removeClass('d-none');
            $('#profile-complete-summary').addClass('d-none');
        } else {
            $('#profile-missing-summary').addClass('d-none');
            $('#profile-complete-summary').removeClass('d-none');
        }
    },

    /**
     * Sự kiện chọn mẫu hồ sơ → Hiện nút xem mẫu gốc
     */
    onTemplateSelected: function() {
        const fileId = $('#profile-template-select').val();
        const $btnView = $('#btnViewTemplate');
        
        if (fileId) {
            $btnView.attr('href', `https://drive.google.com/open?id=${fileId}`);
            $btnView.removeClass('d-none');
        } else {
            $btnView.addClass('d-none');
        }
    },

    /**
     * Tạo PDF Hồ Sơ Khách Hàng
     * Payload (khớp api_generateCustomerProfilePDF trong GAS):
     *   customerId  — ID dòng KH trong Sheet
     *   templateId  — Google Drive File ID của Sheet mẫu (t.fileId)
     *   soTaiKhoan  — Số TK để tạo QR
     *   email       — Auto inject bởi APIClient
     */
    generateProfilePDF: function(e) {
        if (e) e.preventDefault();

        const customerId     = $('#profile-customer-select').val();
        const templateFileId = $('#profile-template-select').val();
        // ✅ Ghép prefix '380020' với suffix người dùng nhập để tạo số TK đầy đủ
        const stkInput = ($('#profile-stk').val() || '').trim();
        const stk      = stkInput ? '380020' + stkInput : '';

        if (!customerId) {
            Swal.fire('Thiếu thông tin', 'Vui lòng chọn khách hàng.', 'warning'); return;
        }

        const c = this._customerMap[customerId];
        if (c) {
            const missing = [];
            const rawCCCD = String(c['Số CCCD'] || '').replace(/^'/, '').trim();
            const rawSDT  = String(c['Số điện thoại'] || '').replace(/^'/, '').trim();
            const rawDKKD = String(c['Số DKKD'] || c['Số ĐKKD'] || '').replace(/^'/, '').trim();
            const rawSTK_c = String(c['Số TK'] || c['Số tài khoản'] || '').replace(/^'/, '').trim();

            if (!rawSDT) missing.push("Số điện thoại");
            if (!rawCCCD) missing.push("Số CCCD");
            if (!String(c['Ngày cấp CCCD'] || '').trim()) missing.push("Ngày cấp");
            if (!String(c['Nơi cấp CCCD'] || c['Nơi cấp'] || '').trim()) missing.push("Nơi cấp");
            if (!String(c['Địa chỉ'] || '').trim()) missing.push("Địa chỉ");
            if (!String(c['Ngày hết hạn'] || '').trim()) missing.push("Ngày hết hạn");
            
            // Ưu tiên STK nhập tay trong form, nếu rỗng mới check trong object KH
            if (!stk && !rawSTK_c) missing.push("Số Tài khoản");
            
            const loaiHinh = String(c['Loại hình dịch vụ'] || '').toLowerCase();
            if (loaiHinh.includes('hộ kinh doanh')) {
                if (!String(c['Tên hộ kinh doanh'] || '').trim()) missing.push("Tên hộ kinh doanh");
                if (!rawDKKD) missing.push("Số ĐKKD");
                if (!String(c['Ngành nghề KD'] || '').trim()) missing.push("Ngành nghề kinh doanh");
                if (!String(c['Địa chỉ KD'] || '').trim()) missing.push("Địa chỉ kinh doanh");
            }
            
            if (missing.length > 0) {
                Swal.fire({
                    title: 'Thiếu thông tin bắt buộc',
                    html: `Hồ sơ khách hàng này chưa đủ thông tin. Vui lòng vào <b>Cập nhật Khách hàng</b> để bổ sung các trường sau:<br><br><b class="text-danger">${missing.join(', ')}</b>`,
                    icon: 'error'
                });
                return;
            }
        }

        if (!templateFileId) {
            Swal.fire('Thiếu thông tin', 'Vui lòng chọn mẫu hồ sơ.', 'warning'); return;
        }
        
        // ✅ Validate phần suffix người dùng nhập (phải đủ 9 chữ số)
        if (!stkInput) {
            Swal.fire('Thiếu thông tin', 'Vui lòng nhập 9 số cuối của tài khoản.', 'warning'); return;
        }
        if (!/^\d{9}$/.test(stkInput)) {
            Swal.fire('Định dạng sai', 'Vui lòng nhập đúng 9 chữ số cuối (VD: 123456789).', 'error');
            return;
        }
        // stk lúc này = '380020' + stkInput (15 chữ số đầy đủ) — gửi thẳng lên backend

        const $btn = $('#btnGeneratePDF');
        Utils.buttonLoading($btn, true, 'Đang tạo bản nháp...');

        APIClient.call('api_generateprofilepdf', {
            customerId:  customerId,
            templateId:  templateFileId,
            soTaiKhoan:  stk,          // Số TK đầy đủ 15 chữ số (380020 + suffix)
            email:       AppState.user ? AppState.user.email : '',
            mode:        'draft'
        })
        .then(res => {
            Utils.buttonLoading($btn, false, "<i class='bx bxs-file-pdf'></i> Tạo Bản Nháp Để Kiểm Tra");

            if (res.status === 'success') {
                // Hiển thị section draft
                $('#btnGeneratePDF').addClass('d-none');
                $('#profile-draft-section').removeClass('d-none');
                
                // Cập nhật link xem bản nháp
                $('#btnViewDraft').attr('href', res.data.fileUrl);
                
                // Lưu dữ liệu vào data attribute của nút chốt
                const customerName = c ? (c['Tên khách hàng'] || 'N/A') : 'N/A';
                const cccd = c ? (String(c['Số CCCD'] || '').replace(/^'/, '').trim()) : 'N/A';
                const templateName = $('#profile-template-select option:selected').text();

                $('#btnConfirmExportPDF')
                    .data('draft-id', res.data.draftFileId)
                    .data('file-name', res.data.fileName)
                    .data('customer-name', customerName)
                    .data('cccd', cccd)
                    .data('template-name', templateName);
                    
                Swal.fire({
                    title: 'Bản Nháp Đã Sẵn Sàng!',
                    text: 'Vui lòng mở xem bản nháp và kiểm tra thông tin. Nếu đã chính xác, hãy bấm "Chốt Xuất PDF".',
                    icon: 'info',
                    confirmButtonText: 'Đã hiểu'
                });
            } else {
                Swal.fire('Lỗi Tạo Bản Nháp', res.message || 'Có lỗi không xác định.', 'error');
            }
        })
        .catch(err => {
            Utils.buttonLoading($btn, false, "<i class='bx bxs-file-pdf'></i> Tạo Bản Nháp Để Kiểm Tra");
            console.error('[ProfileManager] generateProfilePDF:', err);
            Swal.fire('Lỗi kết nối', 'Không thể kết nối tới máy chủ. Vui lòng thử lại.', 'error');
        });
    },

    /**
     * Chốt bản nháp thành PDF chính thức
     */
    confirmExportPDF: function() {
        const $btn = $('#btnConfirmExportPDF');
        const draftId = $btn.data('draft-id');
        const fileName = $btn.data('file-name');
        const customerName = $btn.data('customer-name');
        const cccd = $btn.data('cccd');
        const templateName = $btn.data('template-name');
        
        if (!draftId) {
            Swal.fire('Lỗi', 'Không tìm thấy thông tin bản nháp.', 'error');
            return;
        }

        Utils.buttonLoading($btn, true, 'Đang xuất PDF...');

        APIClient.call('api_exportDraftToPDF', {
            draftFileId: draftId,
            fileName: fileName,
            email: AppState.user ? AppState.user.email : '',
            customerName: customerName,
            cccd: cccd,
            templateName: templateName
        })
        .then(res => {
            Utils.buttonLoading($btn, false, "<i class='bx bxs-check-circle'></i> Chốt Xuất PDF Chính Thức");

            if (res.status === 'success') {
                Swal.fire({
                    title: '✅ Xuất PDF Thành Công!',
                    text: 'Hồ sơ PDF đã được lưu trên Google Drive. Bản nháp đã được dọn dẹp.',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: '<i class="bx bx-download"></i> Xem File PDF',
                    cancelButtonText: 'Đóng',
                    confirmButtonColor: '#10b981'
                }).then(result => {
                    if (result.isConfirmed && res.data && res.data.fileUrl) {
                        window.open(res.data.fileUrl, '_blank');
                    }
                    // Reset UI
                    $('#profile-draft-section').addClass('d-none');
                    $('#btnGeneratePDF').removeClass('d-none');
                    
                    // Refresh lịch sử
                    this.loadRecentHistory();
                });
            } else {
                Swal.fire('Lỗi Xuất PDF', res.message || 'Có lỗi không xác định.', 'error');
            }
        })
        .catch(err => {
            Utils.buttonLoading($btn, false, "<i class='bx bxs-check-circle'></i> Chốt Xuất PDF Chính Thức");
            console.error('[ProfileManager] confirmExportPDF:', err);
            Swal.fire('Lỗi kết nối', 'Không thể kết nối tới máy chủ. Vui lòng thử lại.', 'error');
        });
    },

    /**
     * Hủy bỏ bản nháp
     */
    cancelDraft: function() {
        Swal.fire({
            title: 'Hủy bản nháp?',
            text: "Bản nháp hiện tại sẽ bị bỏ qua. Hệ thống backend sẽ tự dọn dẹp.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Đồng ý Hủy',
            cancelButtonText: 'Không'
        }).then((result) => {
            if (result.isConfirmed) {
                $('#profile-draft-section').addClass('d-none');
                $('#btnGeneratePDF').removeClass('d-none');
            }
        });
    },

    // ===================================================
    // ADMIN: CẤU HÌNH MẪU PDF
    // ===================================================

    openConfigModal: function() {
        const $tbody = $('#tblTemplates tbody');
        $tbody.html(`
            <tr>
                <td colspan="3" class="text-center py-3">
                    <div class="spinner-border spinner-border-sm text-primary me-2"></div>
                    Đang tải cấu hình từ máy chủ...
                </td>
            </tr>
        `);

        const configModal = new bootstrap.Modal(document.getElementById('modalConfigTemplates'));
        configModal.show();

        APIClient.call('api_gettemplates', {})
            .then(res => {
                if (res.status === 'success') {
                    this.templates = res.data || [];
                    this.renderTemplatesTableAdmin();
                } else {
                    // Sprint 2 Fix XSS: escape res.message và err trước khi chèn vào HTML
                    $tbody.html(`<tr><td colspan="3" class="text-center text-danger py-3">
                        <i class="bx bx-error-circle me-1"></i>Lỗi: ${utils_escapeHTML(String(res.message || 'Không xác định'))}
                    </td></tr>`);
                }
            })
            .catch(err => {
                $tbody.html(`<tr><td colspan="3" class="text-center text-danger py-3">
                    <i class="bx bx-wifi-off me-1"></i>Lỗi kết nối: ${utils_escapeHTML(String(err && err.message ? err.message : err))}
                </td></tr>`);
            });
    },

    renderTemplatesTableAdmin: function() {
        const $tbody = $('#tblTemplates tbody');
        $tbody.empty();

        if (!this.templates || this.templates.length === 0) {
            $tbody.html(`
                <tr>
                    <td colspan="3" class="text-center text-muted py-3">
                        <i class="bx bx-info-circle me-1"></i>
                        Chưa có mẫu nào. Nhấn <strong>"+ Thêm mẫu mới"</strong> để bắt đầu.
                    </td>
                </tr>
            `);
            return;
        }

        this.templates.forEach(t => {
            const status = t.status || 'Hoạt động';
            const statusOptions = ['Hoạt động', 'Ngừng hoạt động'].map(s => 
                `<option value="${s}" ${status === s ? 'selected' : ''}>${s}</option>`
            ).join('');

            $tbody.append(`
                <tr>
                    <td>
                        <input type="text" class="form-control form-control-sm tpl-name"
                            value="${utils_escapeHTML(t.name || '')}"
                            placeholder="Tên mẫu gợi nhớ (VD: Mẫu KH Cá nhân)">
                    </td>
                    <td>
                        <input type="text" class="form-control form-control-sm tpl-id"
                            value="${utils_escapeHTML(t.fileId || '')}"
                            placeholder="Google Drive File ID">
                    </td>
                    <td>
                        <select class="form-select form-select-sm tpl-status">
                            ${statusOptions}
                        </select>
                    </td>
                    <td class="text-center">
                        <div class="d-flex gap-1 justify-content-center">
                            <a href="https://drive.google.com/open?id=${t.fileId}" target="_blank" class="btn btn-sm btn-outline-info" title="Xem file">
                                <i class="bx bx-show"></i>
                            </a>
                            <button class="btn btn-sm btn-outline-danger btn-delete-template" title="Xóa">
                                <i class="bx bx-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `);
        });
    },

    addNewTemplateRow: function() {
        const $tbody = $('#tblTemplates tbody');
        if ($tbody.find('td[colspan="3"]').length > 0) {
            $tbody.empty();
        }
        $tbody.append(`
            <tr>
                <td>
                    <input type="text" class="form-control form-control-sm tpl-name"
                        value="" placeholder="Tên mẫu gợi nhớ">
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm tpl-id"
                        value="" placeholder="Google Drive ID">
                </td>
                <td>
                    <select class="form-select form-select-sm tpl-status">
                        <option value="Hoạt động" selected>Hoạt động</option>
                        <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                    </select>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger btn-delete-template">
                        <i class="bx bx-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    },

    /**
     * Admin lưu danh sách template lên GAS
     * Payload (khớp api_saveTemplates trong GAS v2.3):
     *   email     — Auto inject bởi APIClient
     *   templates — [{name, fileId}]
     */
    saveTemplatesAdmin: function() {
        const payload = [];
        let hasError  = false;

        $('#tblTemplates tbody tr').each(function() {
            const name   = $(this).find('.tpl-name').val().trim();
            const fileId = $(this).find('.tpl-id').val().trim();
            const status = $(this).find('.tpl-status').val();

            if (name === '' || fileId === '') {
                hasError = true;
            } else {
                payload.push({ name: name, fileId: fileId, status: status });
            }
        });

        if (hasError) {
            Swal.fire('Lỗi nhập liệu', 'Vui lòng điền đủ Tên mẫu và File ID trên tất cả các dòng trước khi lưu.', 'warning');
            return;
        }

        const $btn = $('#btnSaveTemplates');
        Utils.buttonLoading($btn, true, 'Đang lưu...');

        APIClient.call('api_savetemplates', {
            email:      AppState.user ? AppState.user.email : '',
            clientRole: AppState.user ? AppState.user.role  : '',   // Backup role để backend fallback
            templates:  payload
        })
        .then(res => {
            Utils.buttonLoading($btn, false, '<i class="bx bx-save"></i> Lưu cấu hình');

            if (res.status === 'success') {
                Swal.fire('✅ Lưu thành công!', res.message || 'Cấu hình mẫu PDF đã được cập nhật.', 'success');
                // Cập nhật lại cache local từ payload vừa gửi
                this.templates = payload.map(t => ({ ...t, id: '' })); 
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalConfigTemplates'));
                if (modal) modal.hide();
                this.loadTemplatesForSelect();
            } else {
                Swal.fire('Lỗi lưu', res.message || 'Không thể lưu cấu hình.', 'error');
            }
        })
        .catch(err => {
            Utils.buttonLoading($btn, false, '<i class="bx bx-save"></i> Lưu cấu hình');
            console.error('[ProfileManager] saveTemplatesAdmin:', err);
            Swal.fire('Lỗi kết nối', 'Không thể lưu cấu hình. Vui lòng thử lại.', 'error');
        });
    },

    /**
     * Hiển thị ảnh phóng to trong Modal
     * @param {string} label - Tiêu đề ảnh
     * @param {string} url - URL gốc (Drive)
     * @param {string} fid - File ID Drive (nếu có)
     */
    viewImage: function(label, url, fid) {
        const $modal = $('#modalViewImage');
        const $img   = $('#imgFullView');
        const $cap   = $('#imgFullCaption');

        if (!$modal.length || !$img.length) return;

        // Ưu tiên dùng ảnh chất lượng cao từ thumbnail API nếu có fid
        // sz=s2000 để lấy ảnh gần như gốc
        const displayUrl = fid 
            ? `https://drive.google.com/thumbnail?id=${fid}&sz=s2000` 
            : url;

        $img.attr('src', 'https://placehold.co/600x400?text=Đang+tải+ảnh...');
        $cap.text(label);

        const modalInstance = new bootstrap.Modal($modal[0]);
        modalInstance.show();

        // Load ảnh thực tế
        const tempImg = new Image();
        tempImg.onload = function() {
            $img.attr('src', displayUrl);
        };
        tempImg.onerror = function() {
            $img.attr('src', 'https://placehold.co/600x400?text=Lỗi+tải+ảnh');
        };
        tempImg.src = displayUrl;
    }

}; // End ProfileManager

// ===================================================
// Global Wrappers — Gọi từ onclick trong HTML
// ===================================================

function loadProfileView() {
    ProfileManager.loadView();
    if (typeof updateBottomNavActive === 'function') updateBottomNavActive('navProfile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function openConfigTemplatesModal() { ProfileManager.openConfigModal(); }
function addNewTemplateRow()        { ProfileManager.addNewTemplateRow(); }
function viewImage(label, url, fid) { ProfileManager.viewImage(label, url, fid); }

// Khởi tạo khi DOM ready
$(document).ready(function() {
    ProfileManager.init();
});
