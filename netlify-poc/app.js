/**
 * Netlify PoC - app.js
 * Giao tiếp với Google Apps Script qua Fetch API thay vì google.script.run
 */

// ĐỊA CHỈ WEB APP CỦA GOOGLE APPS SCRIPT (Cần cập nhật sau khi triển khai)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyXBMdJO2JmoaarxW9l7mg-l4tyN6BF1U01jaMPQ48xmVOZM9WFWLnOTIc9Wyf1OpFr/exec"; 

/**
 * Hàm gọi API dùng chung
 */
async function fetchAPI(action, data = {}) {
    console.log(`[PoC] Calling action: ${action}`, data);
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            mode: "cors", // Cần thiết để đọc response sau redirect
            cache: "no-cache",
            headers: {
                "Content-Type": "text/plain;charset=utf-8", // Dùng text/plain để tránh OPTIONS preflight
            },
            redirect: "follow",
            body: JSON.stringify({
                action: action,
                data: data
            })
        });
        
        console.log(`[PoC] Response status: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("[PoC] Result:", result);
        return result;
    } catch (error) {
        console.error("[PoC] Fetch Error detail:", error);
        return { status: "error", message: error.message };
    }
}

/**
 * Hàm định dạng ngày VN
 */
function utils_formatDate(dateStr) {
    if(!dateStr) return "";
    const d = new Date(dateStr);
    if(isNaN(d)) return dateStr;
    return d.toLocaleDateString('vi-VN');
}

/**
 * Hàm tạo Badge trạng thái
 */
function getStatusBadge(status) {
    const map = {
        'Đã xác minh': '<span class="badge bg-success">Đã xác minh</span>',
        'Hợp lệ': '<span class="badge bg-success">Hợp lệ</span>',
        'Chưa hoàn thành': '<span class="badge bg-warning text-dark">Thiếu thông tin</span>',
        'Thiếu ảnh': '<span class="badge bg-danger">Thiếu ảnh</span>'
    };
    return map[status] || `<span class="badge bg-secondary">${status || 'Chưa rõ'}</span>`;
}

/**
 * Load danh sách khách hàng (PoC)
 */
async function initMyCustomersList() {
    const spinner = document.getElementById("global-spinner");
    if (spinner) spinner.style.display = "flex";
    
    // Giả lập email của user cho PoC (Trong bản thật sẽ lấy từ Auth)
    const mockUserEmail = "staff@example.com"; 

    const res = await fetchAPI("api_getMyCustomers", { email: mockUserEmail });
    
    if (spinner) spinner.style.display = "none";

    if(res.status === "success") {
        const data = res.data || [];
        renderTable(data);
    } else {
        if (window.Swal) {
            Swal.fire("Lỗi", res.message || "Không thể tải dữ liệu", "error");
        } else {
            alert("Lỗi: " + (res.message || "Không thể tải dữ liệu"));
        }
    }
}

/**
 * Render bảng bằng DataTables
 */
let dtTable = null;
function renderTable(data) {
    if (!window.jQuery || !$.fn.DataTable) {
        console.error("jQuery hoặc DataTables chưa được tải!");
        return;
    }

    if(dtTable) dtTable.destroy();

    let rows = "";
    data.forEach(item => {
        rows += `
            <tr>
                <td>${utils_formatDate(item['Thời điểm nhập'])}</td>
                <td class="fw-bold text-dark">${item['Tên khách hàng'] || ""}</td>
                <td>${item['Số điện thoại'] || ""}</td>
                <td>3800200${item['Số Tài khoản'] || ""}</td>
                <td>${getStatusBadge(item['Trạng thái'])}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary shadow-sm" onclick="alert('Xem chi tiết: ${item['ID']}')">
                        <i class='bx bx-info-circle'></i> Chi tiết
                    </button>
                </td>
            </tr>
        `;
    });

    $("#tblMyCustomers tbody").html(rows);

    dtTable = $("#tblMyCustomers").DataTable({
        responsive: true,
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json"
        }
    });
}

// Khởi chạy an toàn bằng Vanilla JS
window.addEventListener('load', function() {
    console.log("[PoC] Trang đã tải, kiểm tra thư viện...");
    if (!window.jQuery) {
        console.error("[PoC] jQuery KHÔNG tải được từ CDN. Vui lòng kiểm tra kết nối internet hoặc dùng Local Server.");
        const spr = document.getElementById("global-spinner");
        if (spr) spr.innerHTML = '<h5 class="text-danger">Lỗi: Không tải được thư viện jQuery từ CDN. Vui lòng kết nối internet hoặc dùng Live Server.</h5>';
    } else {
        initMyCustomersList();
    }
});
