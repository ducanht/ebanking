# Core Principles & Quy Tắc Cốt Lõi — Quỹ TDND Yên Thọ

> Tài liệu này được tổng hợp từ `GEMINI.md` (System Prompt) và các bài học thực tế từ quá trình phát triển.
> Agent **phải đọc và tuân thủ** trước khi bắt tay vào bất kỳ thay đổi nào.

---

## PHẦN A — QUY CHUẨN HỆ THỐNG (từ GEMINI.md)

### A1. Vai Trò Đa Nhiệm (BẮT BUỘC)
Mỗi khi nhận yêu cầu, phải đóng song song **4 vai trò**:
1. **Developer** — Viết code tối ưu, sạch sẽ, ES6+.
2. **Tester** — Lường trước nhập sai (nhập chữ vào ô số, bấm đúp Submit...).
3. **Reviewer** — Kiểm tra không vi phạm Quota 6 phút của GAS.
4. **Debugger** — Mọi hàm phải có `try...catch`, không bao giờ "chết lặng".

---

### A2. Quy Chuẩn Backend (.gs)

| Nguyên tắc | Mô tả |
|---|---|
| **Batch Operations** | TUYỆT ĐỐI không `getValue()`, `setValue()`, `appendRow()` trong vòng lặp. Dùng `getValues()` → xử lý array → `setValues()` |
| **LockService** | Mọi thao tác GHI/SỬA Sheet phải bọc `LockService.getScriptLock().waitLock(...)` + kết thúc `SpreadsheetApp.flush()` |
| **CONFIG Object** | Tập trung ID file, Tên Sheet vào 1 Object `CONFIG`. Không hardcode rải rác |
| **Validate Server** | Mọi dữ liệu từ Client đều phải validate lại ở Backend trước khi ghi. Không bao giờ tin 100% Client |
| **ES6+** | Dùng `const`/`let`, Arrow functions, `map`, `filter`, `reduce` |

---

### A3. Quy Chuẩn Frontend (.html)

- Giao tiếp Backend: 100% qua `google.script.run` + `.withSuccessHandler()` + `.withFailureHandler()`.
- Khi Submit: **bắt buộc** hiện Spinner + `disabled` nút → chống click đúp tạo bút toán kép.
- Viewport: `<meta name="viewport" content="width=device-width, initial-scale=1.0">` ở mọi trang.
- **Form:** Bootstrap Grid `row / col-12 col-md-6 col-lg-4`.
- **Tables:** Bọc `<div class="table-responsive">` hoặc `responsive: true` trong DataTables.

---

### A4. Bảng Màu Hệ Thống (Premium UI)

| Token | Màu | Dùng cho |
|---|---|---|
| `--primary-color` | `#10b981` Emerald Green | Nút chính, tiêu đề |
| `--secondary-color` | `#64748b` Slate Blue | Text phụ, icon |
| `--accent-color` | `#f59e0b` Amber Gold | Highlight, badge |
| Background | `#F8FAFC → #F1F5F9` | Gradient nền trang |

Phong cách: **Glassmorphism** — `background: rgba(255,255,255,0.85)`, `backdrop-filter: blur(12px)`.

---

### A5. Hệ Sinh Thái Thư Viện CDN Bắt Buộc

#### CSS
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
<link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
<link href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap5.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" rel="stylesheet">
```

#### JavaScript
```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
<script src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js"></script>
<script src="https://cdn.datatables.net/responsive/2.5.0/js/responsive.bootstrap5.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/MrSaints/pdfmake-vietnamese-vfs/vfs_fonts.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.bootstrap5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<!-- BẮT BUỘC: Locale tiếng Việt cho Flatpickr — xem Rule B2 -->
<script src="https://npmcdn.com/flatpickr/dist/l10n/vn.js"></script>
<script src="https://cdn.jsdelivr.net/npm/autonumeric@4.6.0/dist/autoNumeric.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
```

---

### A6. Tiêu Chuẩn Xử Lý Thời Gian (DateTime)

| Lớp | Định dạng | Ghi chú |
|---|---|---|
| **Frontend (hiển thị)** | `DD/MM/YYYY` | Dùng `altInput` + `altFormat: "d/m/Y"` của Flatpickr |
| **Backend (lưu trữ)** | `YYYY-MM-DD` hoặc `Date Object` | TUYỆT ĐỐI không lưu `DD/MM/YYYY` vào Sheets → sai lệch sort/query |

---

### A7. Tiêu Chuẩn Sinh Mã (Self-Correction)

- Trước khi xuất code: **Dry-run trong đầu** — phát hiện vòng lặp lớn gây Timeout hoặc rủi ro kiểu dữ liệu → tự sửa ngay.
- Code đưa ra phải **hoàn chỉnh**, không bỏ `...` hay `// TODO`.
- Chú thích bằng **tiếng Việt**, dùng đúng **thuật ngữ tài chính Việt Nam**.

---

## PHẦN B — BÀI HỌC THỰC CHIẾN (từ Debug thực tế)

### B1. GAS Date Serialization — SILENT CRASH

**Vấn đề:** `google.script.run` không tự Serialize `Date Object` → `withSuccessHandler` nhận `undefined` → Dashboard trống, không lỗi, không cảnh báo.

**Giải pháp:** Trong `getSheetDataAsObjects` (Database.gs), bắt buộc chuyển đổi:

```javascript
if (val instanceof Date) {
  val = val.toISOString();
}
obj[header] = val;
```

---

### B2. Flatpickr Locale "vn" — JS CRASH

**Vấn đề:** Dùng `locale: "vn"` mà thiếu file ngôn ngữ → JS crash tại `initDashboard()` → toàn bộ Dashboard không load.

**Giải pháp:** Load CDN locale (xem A5 — đã nhúng sẵn):
```html
<script src="https://npmcdn.com/flatpickr/dist/l10n/vn.js"></script>
```

---

### B3. Leading Zeros — SỐ 0 BIẾN MẤT

**Vấn đề:** Google Sheets diễn giải chuỗi số thuần túy thành Number → mất số `0` đầu của CCCD, SĐT, STK.

**Giải pháp:** Prefix dấu `'` khi ghi:
```javascript
rowData[colCCCD] = "'" + formData.cccd;  // Ép Google Sheets lưu Text
rowData[colSdt]  = "'" + formData.sdt;
rowData[colStk]  = "'" + formData.so_tk;
```

---

### B4. DataTable Lifecycle — CRASH KHI RE-INIT

**Vấn đề:** Sau khi gọi `DataTable().destroy()`, nếu không reset biến tham chiếu → lần init tiếp theo dùng biến cũ gây crash hoặc render trống silent. Ngoài ra nếu phần `else` nằm ngoài `try { }` do lỗi indent → toàn bộ render function không chạy.

**Giải pháp:**
```javascript
// 1. Bắt buộc reset biến sau destroy
if ($.fn.DataTable.isDataTable('#myTable')) {
  $('#myTable').DataTable().destroy();
  dtMyTable = null; // ← KHÔNG ĐƯỢC BỎ QUA
}

// 2. Bọc TOÀN BỘ render function trong try-catch để không crash silent
function renderTable(data) {
  try {
    let html = '';
    if (!data || data.length === 0) {
      html = '<tr><td>Chưa có dữ liệu</td></tr>';
    } else {
      data.forEach(d => { html += `<tr>...</tr>`; });
    }
    $('#tbody').html(html);
    if (data && data.length > 0) {
      dtMyTable = $('#myTable').DataTable({ ... });
    }
  } catch(err) {
    console.error('render error:', err);
    $('#tbody').html('<tr><td class="text-danger">' + err.message + '</td></tr>');
  }
}
```

---

---

### B5. Flatpickr trên Element Null — SILENT CRASH LÀM TREO TRANG

**Vấn đề:** Code cũ `document.querySelector('.js-datepicker-edit')._flatpickr` — nếu modal chưa mount hoặc class không tồn tại, `.querySelector()` trả về `null`. Truy cập `._flatpickr` trên `null` = **TypeError crash silent** → toàn bộ hàm mở modal không chạy, trang "đứng" không phản hồi.

**Giải pháp (bắt buộc):** Luôn null-safe + try-catch với Flatpickr:
```javascript
try {
    let fpEl = document.querySelector('.js-datepicker-edit');
    if (fpEl) {
        let fpEdit = fpEl._flatpickr;
        if (!fpEdit) {
            fpEdit = flatpickr(fpEl, { dateFormat: 'Y-m-d', altInput: true, altFormat: 'd/m/Y' });
        }
        if (fpEdit && dateValue) fpEdit.setDate(dateValue);
    }
} catch(fpErr) {
    console.warn('[flatpickr-edit]', fpErr.message);
}
```

> ⚠️ **KHÔNG BAO GIỜ** truy cập `element._flatpickr` mà không kiểm tra `element !== null` trước.

---

### B6. DataTable Responsive + Event Delegation — CLICK MẤT SAU RE-RENDER

**Vấn đề:** Nếu gắn `onclick="..."` trực tiếp vào HTML `<tr>` hoặc `<button>`, DataTable Responsive sẽ **xóa và tái tạo DOM** khi thay đổi kích thước màn hình → mất sự kiện. Tương tự, `$('#tbody').on('click', ...)` cũng bị mất nếu tbody được `.html()` thay thế.

**Vấn đề cộng thêm:** Khi DataTable thu gọn (responsive), nó tạo `<tr class="child">` để hiện data ẩn. Nếu click vào child row, `$(this).closest('tr[data-id]')` sẽ không tìm được dòng cha.

**Giải pháp bắt buộc:**
1. Đặt `data-*` attr trên `<tr>` (không phải button)
2. Gắn event vào **TABLE element** (không phải tbody/document với selector broad)
3. Xử lý child row:

```javascript
$('#tblMyTable').off('click').on('click', 'tbody tr, tbody td', function() {
    let tr = $(this).closest('tr');
    // DataTable responsive tạo <tr class="child"> → tìm dòng cha
    if (tr.hasClass('child')) {
        tr = tr.prevAll('tr[data-record-id]').first();
    }
    let id = tr.attr('data-record-id');
    if (id) openDetailModal(id);
});
```

---

### B7. Event Selector Quá Rộng — ANTI-PATTERN NGUY HIỂM

**Vấn đề:** Dùng class selector chung như `.btn-outline-primary` trong event delegation sẽ **bắt tất cả button** trên trang có class đó, không chỉ button trong bảng mong muốn. Điều này gây:
- Click vào nút khác → mở modal không đúng
- Loop lỗi khi nhiều bảng cùng tên class
- Cực kỳ khó debug

**Giải pháp:**
- ❌ `$(document).on('click', '.btn-outline-primary', ...)` — TUYỆT ĐỐI KHÔNG
- ✅ `$('#tblCụThể').on('click', 'tbody tr[data-record-id]', ...)` — Selector chính xác đến table cụ thể + data attribute
- ✅ Gắn ID duy nhất vào mỗi element tương tác, không dùng class chung

---

### B8. Bootstrap Modal — MỞ LẦN 2 KHÔNG HOẠT ĐỘNG

**Vấn đề:** `new bootstrap.Modal(element)` tạo **instance mới** mỗi lần gọi → lần mở 2 sẽ chồng backdrop, modal trắng hoặc không đóng được.

**Giải pháp:** Luôn dùng `getOrCreateInstance`:
```javascript
let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('myModal'));
modal.show();
```

---

### B9. Tìm Record Theo ID — KEY MISMATCH GIỮA SHEET VÀ FRONTEND

**Vấn đề:** Tên cột đầu tiên trong Google Sheets có thể là `"ID"`, `"Mã GD"`, hoặc `"id"` tùy người tạo Sheet. `find(r => r['ID'] === maGd)` sẽ trả về `undefined` nếu cột thực tế là `"Mã GD"`.

**Giải pháp — Fallback lookup pattern:**
```javascript
function findById(arr, id) {
    if (!arr || !arr.length) return null;
    // Thử cả 2 tên cột phổ biến, trim để tránh whitespace
    return arr.find(r =>
        String(r['ID'] || r['Mã GD'] || '').trim() === String(id).trim()
    ) || null;
}
```

> 💡 **Debug tip:** Khi báo "Không tìm thấy hồ sơ", log `Object.keys(arr[0])` để xem tên cột thực tế.

---

## PHẦN C — QUY TẮC TỰ TIẾN HOÁ

**Khi Agent phát hiện một pattern/bug/best-practice mới quan trọng:**

1. 🔔 **Cảnh báo** User ngay tại cuối response.
2. **Trình bày** ngắn gọn: vấn đề là gì, tại sao quan trọng, giải pháp là gì.
3. **Hỏi:** *"Bạn có muốn tôi lưu rule này vào `.agent\rules\core_principles.md` không?"*
4. Nếu User **đồng ý** → Lưu vào **Phần B** theo đúng format có sẵn.
5. Nếu User **từ chối** → Bỏ qua.

> **Mục tiêu:** Tích luỹ tri thức dự án — tránh lặp lại cùng một lỗi.
