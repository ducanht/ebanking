/**
 * HỆ THỐNG QUẢN LÝ MỞ TÀI KHOẢN - QUỸ TDND YÊN THỌ
 * File: Main.gs
 * Chức năng: Entry point (doGet), Router (include)
 */

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Hệ thống Quản lý Chỉ tiêu Mở tài khoản - Yên Thọ')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/** 
 * API ROUTER cho Netlify / Vercel
 * Hỗ trợ các yêu cầu Fetch từ Front-end tách biệt
 */
function doPost(e) {
  var result = { status: "error", message: "Unknown action" };
  try {
    // 1. Parse dữ liệu đầu vào
    var postData = JSON.parse(e.postData.contents);
    var rawAction = (postData.action || "").toString().trim().toLowerCase();
    var data = postData.data || {};

    // 2. Định nghĩa các hàm xử lý API
    // (Đường dẫn đến các hàm thực tế trong api_auth.gs, api_account.gs, api_admin.gs)
    var apiHandlers = {
      "api_login": api_auth_login,
      "api_changepassword": api_auth_changePassword,
      "api_submitregistration": api_submitAccountForm,
      "api_getmycustomers": api_getMyCustomers,
      "api_getadmindashboarddata": api_getAdminDashboardData,
      "api_updatecustomer": api_updateMyCustomer
    };

    // 3. Thực thi hàm tương ứng hoặc báo lỗi
    if (apiHandlers[rawAction]) {
      result = apiHandlers[rawAction](data);
    } else {
      result.message = "Action '" + (postData.action || 'empty') + "' không được hỗ trợ.";
    }
  } catch (err) {
    result.message = "GAS Backend Error: " + err.toString();
    console.error(err);
  }

  // 4. Trả về kết quả JSON kèm CORS Header (mặc định của ContentService)
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
