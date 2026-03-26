/**
 * MODULE AUTHENTICATION
 * Quản lý Đăng nhập, Xác thực và Sinh Hash
 */

/**
 * Kiểm tra đăng nhập
 * Client gọi google.script.run lên và truyền vào email cùng pass đã hash 256
 */
function api_auth_login(email, hashedPassword) {
  try {
    const staffs = getSheetDataAsObjects(CONFIG.SHEET_STAFF);
    const user = staffs.find(s => s["Email"] === email && s["Mật khẩu (SHA-256)"] === hashedPassword && s["Trạng thái"] === "Hoạt động");
    
    const defaultHash = "8129dded126fb1fc345df502a48eb6f03c48d6b9ee088c5efa23f085919adb34"; // qtdyentho
    
    if (user) {
      let reqChange = (hashedPassword === defaultHash);
      return {
        status: "success",
        user: {
          email: user["Email"],
          fullName: user["Họ tên"],
          department: user["Bộ phận"],
          role: user["Quyền hạn"] || (user["Bộ phận"] === "HĐQT" ? "Admin" : "User"),
          target: user["Chỉ tiêu"]
        },
        requirePasswordChange: reqChange
      };
    } else {
      return { 
        status: "error", 
        message: "Email hoặc Mật khẩu không đúng. Hoặc tài khoản của bạn đã bị khóa." 
      };
    }
  } catch (e) {
    // Bẫy lỗi bảo vệ Server tránh sụp hệ thống
    return { status: "error", message: "Hệ thống gặp sự cố Authentication: " + e.message };
  }
}

/**
 * Hàm hỗ trợ băm SHA-256 cho Server nếu cần
 */
function generateSHA256Hash(inputString) {
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, inputString, Utilities.Charset.UTF_8);
  let txtHash = '';
  for (let i = 0; i < rawHash.length; i++) {
    let hashVal = rawHash[i];
    if (hashVal < 0) {
      hashVal += 256;
    }
    if (hashVal.toString(16).length == 1) {
      txtHash += '0';
    }
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}

/**
 * Đổi mật khẩu chủ động
 */
function api_auth_changePassword(email, oldHashed, newHashed) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // 10s timeout
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_STAFF);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const colEmail = headers.indexOf("Email");
    const colPass = headers.indexOf("Mật khẩu (SHA-256)");
    const colStatus = headers.indexOf("Trạng thái");
    
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][colEmail] === email && data[i][colStatus] === "Hoạt động") {
        if (data[i][colPass] === oldHashed) {
          rowIndex = i;
          break;
        } else {
          return { status: "error", message: "Mật khẩu cũ không chính xác!" };
        }
      }
    }
    
    if (rowIndex === -1) {
      return { status: "error", message: "Không tìm thấy người dùng hoặc tài khoản bị khóa." };
    }
    
    // Set mật khẩu mới
    data[rowIndex][colPass] = newHashed;
    sheet.getRange(rowIndex + 1, 1, 1, data[rowIndex].length).setValues([data[rowIndex]]);
    SpreadsheetApp.flush();
    
    return { status: "success", message: "Đổi mật khẩu thành công!" };
  } catch (e) {
    return { status: "error", message: "Lỗi Server đổi mật khẩu: " + e.message };
  } finally {
    lock.releaseLock();
  }
}
