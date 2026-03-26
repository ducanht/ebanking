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
 * API ROUTER cho Netlify (Bản PoC)
 * Hỗ trợ các yêu cầu Fetch từ bên ngoài
 */
function doPost(e) {
  var result = { status: "error", message: "Unknown error" };
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    var data = postData.data || {};

    // Định tuyến API cho tất cả nghiệp vụ
    if (action === "api_login") {
      result = api_login(data);
    } 
    else if (action === "api_changePassword") {
      result = api_changePassword(data);
    }
    else if (action === "api_submitRegistration") {
      result = api_submitRegistration(data);
    }
    else if (action === "api_getMyCustomers") {
      result = api_getMyCustomers(data);
    } 
    else if (action === "api_getAdminDashboardData") {
       result = api_getAdminDashboardData(); 
    }
    else if (action === "api_updateCustomer") {
      result = api_updateCustomer(data);
    }
    else {
      result.message = "Action '" + action + "' không được hỗ trợ.";
    }
  } catch (err) {
    result.message = "Backend Error: " + err.message;
  }

  // Luôn trả về dữ liệu đã được Serialize JSON
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
