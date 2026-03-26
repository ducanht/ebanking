/**
 * SETUP SCRIPT
 * Chạy hàm `runFirstTimeSetup()` MỘT LẦN DUY NHẤT để hệ thống tự động:
 * 1. Kết nối với file Google Sheets (ID đã xác định)
 * 2. Khởi tạo cấu trúc các Sheet làm Database nếu chúng chưa tồn tại.
 */

function runFirstTimeSetup() {
  try {
    const ssId = CONFIG.SPREADSHEET_ID;
    const imageFolderId = CONFIG.IMAGE_FOLDER_ID;
    
    // 1. Kết nối Google Sheets hiện có
    const ss = SpreadsheetApp.openById(ssId);

    // 2. Khởi tạo Sheet Data_MoTaiKhoan (Nếu chưa có)
    let sheetData = ss.getSheetByName(CONFIG.SHEET_DATA);
    if (!sheetData) {
      // Nếu file đang trống và chỉ có Sheet1, có thể đổi tên Sheet1
      const defaultSheet = ss.getSheets()[0];
      if (defaultSheet.getName() === "Sheet1" || defaultSheet.getName() === "Trang tính1") {
        sheetData = defaultSheet;
        sheetData.setName(CONFIG.SHEET_DATA);
      } else {
        sheetData = ss.insertSheet(CONFIG.SHEET_DATA);
      }
    }
    
    const headerData = [
      "ID", "Thời điểm nhập", "Cán bộ thực hiện", "Tên khách hàng", 
      "Số CCCD", "Số DKKD", "Số điện thoại", "Loại hình dịch vụ", 
      "Ngày mở TK", "Số TK", "Tên đăng nhập", "Mật khẩu", 
      "URL CCCD Trước", "URL CCCD Sau", "URL GP DKKD", "URL QR", "URL Ảnh Thực Hiện", "Trạng thái"
    ];
    sheetData.getRange(1, 1, 1, headerData.length).setValues([headerData]);
    sheetData.getRange(1, 1, 1, headerData.length).setFontWeight("bold").setBackground("#e0e0e0");
    sheetData.setFrozenRows(1);

    // 3. Khởi tạo Sheet Staff_List (Nếu chưa có)
    let sheetStaff = ss.getSheetByName(CONFIG.SHEET_STAFF);
    if (!sheetStaff) {
      sheetStaff = ss.insertSheet(CONFIG.SHEET_STAFF);
      
      const headerStaff = [
        "Email", "Họ tên", "Bộ phận", "Quyền hạn", "Mật khẩu (SHA-256)", "Chỉ tiêu", "Trạng thái"
      ];
      sheetStaff.getRange(1, 1, 1, headerStaff.length).setValues([headerStaff]);
      sheetStaff.getRange(1, 1, 1, headerStaff.length).setFontWeight("bold").setBackground("#e0e0e0");
      sheetStaff.setFrozenRows(1);
      
      // Khởi tạo hàng loạt tài khoản mặc định (Pass tĩnh: qtdyentho)
      const defaultPassHash = "8129dded126fb1fc345df502a48eb6f03c48d6b9ee088c5efa23f085919adb34"; 
      const initialStaffRows = [
        ["admin@yentho.com", "Quản trị viên", "HĐQT", "Admin", defaultPassHash, 0, "Hoạt động"],
        ["ducanht.gemini@gmail.com", "Quản Trị Hệ Thống", "HĐQT", "Admin", defaultPassHash, 0, "Hoạt động"],
        ["thuhien.3982@gmail.com", "Trịnh Thị Hiền", "Kế toán", "User", defaultPassHash, 100, "Hoạt động"],
        ["qtdyentho.thaobui@gmail.com", "Bùi Thị Thảo", "Tín dụng", "User", defaultPassHash, 100, "Hoạt động"],
        ["nguyenmen.yt.83@gmail.com", "Nguyễn Thị Mến", "Tín dụng", "User", defaultPassHash, 100, "Hoạt động"],
        ["qtdyentho.nguyennhan@gmail.com", "Nguyễn Hữu Nhân", "Tín dụng", "User", defaultPassHash, 100, "Hoạt động"],
        ["nguyenvansontdyt@gmail.com", "Nguyễn Văn Sơn", "Tín dụng", "User", defaultPassHash, 100, "Hoạt động"],
        ["sinhtdyt@gmail.com", "Nguyễn Thị Sinh", "Kế toán", "User", defaultPassHash, 100, "Hoạt động"],
        ["qtdyentho.vuhien@gmail.com", "Vũ Thị Hiền", "Kế toán", "User", defaultPassHash, 100, "Hoạt động"],
        ["qtdyentho.huyennhu@gmail.com", "Trần Như Huyền", "Kế toán", "User", defaultPassHash, 100, "Hoạt động"],
        ["hoanglan1289@gmail.com", "Hoàng Thị Lan", "Kế toán", "User", defaultPassHash, 100, "Hoạt động"],
        ["qtdyentho.thaopham@gmail.com", "Phạm Thị Thảo", "Kế toán", "User", defaultPassHash, 100, "Hoạt động"],
        ["qtdyentho.luudinh@gmail.com", "Lưu Thị Định", "Tín dụng", "User", defaultPassHash, 100, "Hoạt động"],
        ["qtdyentho.admin@gmail.com", "QTDYENTHO", "HĐQT", "Admin", defaultPassHash, 0, "Hoạt động"],
        ["qtdyentho.thunghiem@gmail.com", "THUNGHIEM", "Tín dụng", "User", defaultPassHash, 100, "Hoạt động"]
      ];
      sheetStaff.getRange(2, 1, initialStaffRows.length, 7).setValues(initialStaffRows);
    }

    Logger.log("================= SETUP THÀNH CÔNG ==================");
    Logger.log("Đã kết nối và cài đặt cấu trúc cho File Sheets: " + ssId);
    Logger.log("Thư mục Ảnh được cấu hình: " + imageFolderId);
    Logger.log("=====================================================");
    
    return {
      status: "success",
      message: "Setup completed successfully using the provided IDs.",
    };

  } catch (e) {
    Logger.log("Lỗi Setup: " + e.toString());
    return { status: "error", message: e.toString() };
  }
}

/**
 * Migration Script: Chạy 1 lần để nâng cấp Bảng Staff_List đang có sẵn (Thêm cột Quyền hạn)
 */
function migrateAddingRole() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheetStaff = ss.getSheetByName(CONFIG.SHEET_STAFF);
    if (!sheetStaff) return "Sheet không tồn tại.";
    
    const headers = sheetStaff.getRange(1, 1, 1, sheetStaff.getLastColumn()).getValues()[0];
    if (headers.indexOf("Quyền hạn") !== -1) return "Đã migration trước đó rồi.";
    
    sheetStaff.insertColumnAfter(3);
    sheetStaff.getRange(1, 4).setValue("Quyền hạn").setFontWeight("bold").setBackground("#e0e0e0");
    
    const lastRow = sheetStaff.getLastRow();
    if (lastRow > 1) {
      const data = sheetStaff.getRange(2, 3, lastRow - 1, 1).getValues(); // Cột Bộ phận hiện tại
      const roles = data.map(row => [row[0] === "HĐQT" ? "Admin" : "User"]);
      sheetStaff.getRange(2, 4, lastRow - 1, 1).setValues(roles);
    }

    // Thêm tài khoản Thử nghiệm User nếu chưa có
    const emailData = sheetStaff.getRange(2, 1, lastRow - 1, 1).getValues();
    const hasTester = emailData.some(row => row[0] === "qtdyentho.thunghiem@gmail.com");
    if (!hasTester) {
       sheetStaff.appendRow(["qtdyentho.thunghiem@gmail.com", "Cán bộ Thử nghiệm", "Tín dụng", "User", "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9", 100, "Hoạt động"]);
    }
    
    return "Migration thành công!";
  } catch(e) {
    return "Lỗi Migration Role: " + e.message;
  }
}

/**
 * Migration Script 2: Thêm cột URL QR vào đúng vị trí 15 (Trước Trạng thái)
 */
function migrateAddingQRColumn() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheetData = ss.getSheetByName(CONFIG.SHEET_DATA);
    if (!sheetData) return "Sheet không tồn tại.";
    
    const headers = sheetData.getRange(1, 1, 1, sheetData.getLastColumn()).getValues()[0];
    if (headers.indexOf("URL QR") !== -1) return "Cột URL QR đã tồn tại.";
    
    // Chèn vào trước cột Trạng thái (thường là cột cuối cùng)
    const statusIdx = headers.indexOf("Trạng thái");
    if (statusIdx === -1) {
      // Nếu không thấy cột Trạng thái, chèn vào cuối
      sheetData.getRange(1, headers.length + 1).setValue("URL QR").setFontWeight("bold").setBackground("#e0e0e0");
    } else {
      sheetData.insertColumnBefore(statusIdx + 1);
      sheetData.getRange(1, statusIdx + 1).setValue("URL QR").setFontWeight("bold").setBackground("#e0e0e0");
    }
    
    return "Đã thêm cột URL QR thành công!";
  } catch(e) {
    return "Lỗi Migration QR: " + e.message;
  }
}

/**
 * Migration Script 3: Thêm cột Tên đăng nhập vào sau cột Số TK
 */
function migrateAddingUsernameColumn() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheetData = ss.getSheetByName(CONFIG.SHEET_DATA);
    if (!sheetData) return "Sheet không tồn tại.";
    
    const headers = sheetData.getRange(1, 1, 1, sheetData.getLastColumn()).getValues()[0];
    if (headers.indexOf("Tên đăng nhập") !== -1) return "Cột Tên đăng nhập đã tồn tại.";
    
    // Chèn vào sau cột Số TK
    const tkIdx = headers.indexOf("Số TK");
    if (tkIdx === -1) {
      sheetData.getRange(1, headers.length + 1).setValue("Tên đăng nhập").setFontWeight("bold").setBackground("#e0e0e0");
    } else {
      sheetData.insertColumnAfter(tkIdx + 1);
      sheetData.getRange(1, tkIdx + 2).setValue("Tên đăng nhập").setFontWeight("bold").setBackground("#e0e0e0");
    }
    
    return "Đã thêm cột Tên đăng nhập thành công!";
  } catch(e) {
    return "Lỗi Migration Tên đăng nhập: " + e.message;
  }
}

/**
 * Migration Script 4: Thêm cột URL Ảnh Thực Hiện
 */
function migrateAddingActionImageColumn() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheetData = ss.getSheetByName(CONFIG.SHEET_DATA);
    if (!sheetData) return "Sheet không tồn tại.";
    
    const headers = sheetData.getRange(1, 1, 1, sheetData.getLastColumn()).getValues()[0];
    if (headers.indexOf("URL Ảnh Thực Hiện") !== -1) return "Cột URL Ảnh Thực Hiện đã tồn tại.";
    
    // Chèn vào trước cột Trạng thái
    const statusIdx = headers.indexOf("Trạng thái");
    if (statusIdx === -1) {
      sheetData.getRange(1, headers.length + 1).setValue("URL Ảnh Thực Hiện").setFontWeight("bold").setBackground("#e0e0e0");
    } else {
      sheetData.insertColumnBefore(statusIdx + 1);
      sheetData.getRange(1, statusIdx + 1).setValue("URL Ảnh Thực Hiện").setFontWeight("bold").setBackground("#e0e0e0");
    }
    
    return "Đã thêm cột URL Ảnh Thực Hiện thành công!";
  } catch(e) {
    return "Lỗi Migration Ảnh Thực Hiện: " + e.message;
  }
}

/**
 * ----------------------------------------------------
 * TẠO DỮ LIỆU MẪU (SEED DATA) & QUẢN LÝ DỮ LIỆU RÁC
 * ----------------------------------------------------
 */

function generateFakeData() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheetData = ss.getSheetByName(CONFIG.SHEET_DATA);
    const sheetStaff = ss.getSheetByName(CONFIG.SHEET_STAFF);
    
    if (!sheetData || !sheetStaff) return "Lỗi: Không tìm thấy Sheet Data hoặc Staff.";
    
    // Lấy danh sách NV
    const staffs = getSheetDataAsObjects(CONFIG.SHEET_STAFF);
    if (staffs.length === 0) return "Chưa có cán bộ nào trong Staff_List.";
    
    const hoKhach = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Đỗ", "Vũ", "Đặng", "Bùi"];
    const tenKhach = ["Anh", "Bình", "Chung", "Dương", "Hải", "Lâm", "Minh", "Nam", "Quân", "Sơn", "Hương", "Lan", "Hà", "Trang"];
    const trangThaiList = ["Chờ duyệt", "Đã xác minh", "Từ chối"];
    const loaiHinhList = ["Cá nhân", "Cá nhân", "Cá nhân", "Hộ kinh doanh"]; // Tỉ lệ 3/1
    
    let newRows = [];
    
    staffs.forEach(staff => {
      // Chỉ tạo cho User (Không tạo cho Admin/HĐQT)
      if (staff["Quyền hạn"] === "Admin") return;
      
      const email = staff["Email"];
      // Mỗi người 10 -> 15 hs
      const numRecords = Math.floor(Math.random() * 6) + 10;
      
      for (let i = 0; i < numRecords; i++) {
        let isCaNhan = loaiHinhList[Math.floor(Math.random() * loaiHinhList.length)] === "Cá nhân";
        let fullName = hoKhach[Math.floor(Math.random() * hoKhach.length)] + " " + (isCaNhan ? "Thị " : "Văn ") + tenKhach[Math.floor(Math.random() * tenKhach.length)];
        if (!isCaNhan) fullName = "HKD " + fullName;
        
        let cccd = "014" + String(Math.floor(Math.random() * 1000000000)).padStart(9, "0");
        let dkkd = isCaNhan ? "" : "DKKD" + String(Math.floor(Math.random() * 10000)).padStart(4, "0");
        let sdt = "09" + String(Math.floor(Math.random() * 100000000)).padStart(8, "0");
        let tk = "3800200" + String(Math.floor(Math.random() * 100000)).padStart(5, "0");
        
        let pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30)); // random trong 30 ngày qua
        let strNgayMo = Utilities.formatDate(pastDate, "Asia/Ho_Chi_Minh", "yyyy-MM-dd");
        
        let state = trangThaiList[Math.floor(Math.random() * trangThaiList.length)];
        
        newRows.push([
          Utilities.getUuid(),  // ID
          pastDate,             // Thời điểm nhập
          email,                // Cán bộ thực hiện
          fullName.toUpperCase(), // Tên khách hàng
          "'" + cccd,                 // Số CCCD
          dkkd ? "'" + dkkd : "",     // Số DKKD
          "'" + sdt,                  // Số điện thoại
          isCaNhan ? "Cá nhân" : "Hộ kinh doanh", // Loại hình dịch vụ
          strNgayMo,            // Ngày mở TK
          "'" + tk,                   // Số TK
          "qtdyentho",                // Mật khẩu
          "https://via.placeholder.com/150", // Mặt trước
          "https://via.placeholder.com/150", // Mặt sau
          isCaNhan ? "" : "https://via.placeholder.com/150", // DKKD
          "https://via.placeholder.com/150", // URL QR
          "https://via.placeholder.com/150", // URL Ảnh Thực Hiện
          state                 // Trạng thái
        ]);
      }
    });
    
    if (newRows.length > 0) {
      const headerData = [
        "ID", "Thời điểm nhập", "Cán bộ thực hiện", "Tên khách hàng", 
        "Số CCCD", "Số DKKD", "Số điện thoại", "Loại hình dịch vụ", 
        "Ngày mở TK", "Số TK", "Tên đăng nhập", "Mật khẩu", 
        "URL CCCD Trước", "URL CCCD Sau", "URL GP DKKD", "URL QR", "URL Ảnh Thực Hiện", "Trạng thái"
      ];
      const numCols = headerData.length;
      sheetData.getRange(sheetData.getLastRow() + 1, 1, newRows.length, numCols).setValues(newRows);
    }
    return "Đã tạo thành công " + newRows.length + " hồ sơ mẫu.";
  } catch(e) {
    return "Lỗi Seed Data: " + e.message;
  }
}

function clearFakeData() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheetData = ss.getSheetByName(CONFIG.SHEET_DATA);
    const lastRow = sheetData.getLastRow();
    if (lastRow > 1) {
      const numCols = sheetData.getLastColumn();
      sheetData.getRange(2, 1, lastRow - 1, numCols).clearContent();
      return "Đã xóa sạch cấu trúc dữ liệu hồ sơ (Trừ header).";
    }
    return "Không có dữ liệu để xóa.";
  } catch(e) {
    return "Lỗi Clear Data: " + e.message;
  }
}
