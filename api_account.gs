/**
 * MODULE ACCOUNT
 * Các API liên quan đến mở tài khoản và phát triển thành viên
 */

function generateUUID() {
  return Utilities.getUuid();
}

/**
 * Upload ảnh Base64 lên Drive
 */
function api_uploadImage(base64Data, fileName) {
  try {
    const folder = DriveApp.getFolderById(CONFIG.IMAGE_FOLDER_ID);
    // Nếu có prefix data:image/jpeg;base64, ...
    let rawBase64 = base64Data;
    if (base64Data.indexOf(',') !== -1) {
      rawBase64 = base64Data.split(',')[1];
    }
    const blob = Utilities.newBlob(Utilities.base64Decode(rawBase64), "image/jpeg", fileName);
    const file = folder.createFile(blob);
    return "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w1000";
  } catch (e) {
    throw new Error("Lỗi tải ảnh (" + fileName + "): " + e.message);
  }
}

/**
 * Kiểm tra trùng lặp
 */
function checkDuplicateAccount(cccd, dkkd, sdt) {
  const data = getSheetDataAsObjects(CONFIG.SHEET_DATA);
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (cccd && cccd !== "" && row["Số CCCD"] == cccd) return { isDup: true, msg: "Trùng Số CCCD/CMND với giao dịch trước đó." };
    if (dkkd && dkkd !== "" && row["Số DKKD"] == dkkd) return { isDup: true, msg: "Trùng Số Giấy phép ĐKKD với giao dịch trước đó." };
    if (sdt && sdt !== "" && row["Số điện thoại"] == sdt) return { isDup: true, msg: "Trùng Số điện thoại giao dịch trước đó." };
  }
  return { isDup: false };
}

/**
 * API Kiểm tra trùng lặp thời gian thực cho Frontend (CCCD, DKKD, SDT)
 */
function api_validateDuplicate(field, value) {
  if (!value || value === "") return { isDup: false };
  const data = getSheetDataAsObjects(CONFIG.SHEET_DATA);
  let colName = "";
  if (field === "cccd") colName = "Số CCCD";
  else if (field === "dkkd") colName = "Số DKKD";
  else if (field === "sdt") colName = "Số điện thoại";
  
  if (!colName) return { isDup: false };
  
  const found = data.find(row => row[colName] == value || row[colName] == "'" + value);
  if (found) {
    return { 
      isDup: true, 
      msg: `Cảnh báo: ${colName} [${value}] đã tồn tại trong hệ thống (Khách hàng: ${found["Tên khách hàng"]}).` 
    };
  }
  return { isDup: false };
}


/**
 * Xử lý Submit Form mở tài khoản (API chính)
 */
function api_submitAccountForm(formData) {
  try {
    // 0. Server-side Validation Mới (Security Hardening)
    // Tên khách hàng: Chuyển hoa, xóa khoảng trắng thừa, xóa mã độc HTML
    formData.ten_kh = (formData.ten_kh || "").replace(/<[^>]*>?/gm, '').trim().toUpperCase();
    
    // Validate CCCD: Phải đúng 12 số nếu có nhập
    if (formData.cccd) {
      formData.cccd = formData.cccd.trim();
      if (!/^\d{12}$/.test(formData.cccd)) {
        return { status: "error", message: "Số CCCD không hợp lệ (Bắt buộc phải đủ 12 chữ số)." };
      }
    } else if (formData.loai_hinh === "Cá nhân") {
      return { status: "error", message: "Thiếu thông tin CCCD bắt buộc cho Đối tượng Cá nhân." };
    }

    // Validate SĐT: Bắt đầu bằng 0, đủ 10 số
    if (formData.sdt) {
      formData.sdt = formData.sdt.trim();
      if (!/^0\d{9}$/.test(formData.sdt)) {
        return { status: "error", message: "Số điện thoại không hợp lệ (Phải bắt đầu bằng số 0 và đủ 10 chữ số)." };
      }
    }

    // Validate Số Tài Khoản: Phải đủ 16 ký tự (bao gồm prefix 3800200)
    if (formData.so_tk) {
      formData.so_tk = formData.so_tk.trim();
      if (formData.so_tk.length !== 16) {
        return { status: "error", message: "Số tài khoản CIF không hợp lệ (Phải bao gồm tiền tố và đủ 16 ký tự)." };
      }
    }

    // 1. Kiểm trùng
    const dupCheck = checkDuplicateAccount(formData.cccd, formData.dkkd, formData.sdt);
    if (dupCheck.isDup) {
      return { status: "error", message: dupCheck.msg };
    }

    // 2. Upload Ảnh
    let urlTruoc = "", urlSau = "", urlDKKD = "", urlQR = "";
    if (formData.img_truoc) urlTruoc = api_uploadImage(formData.img_truoc, `Truoc_${formData.cccd}_${formData.ten_kh}.jpg`);
    if (formData.img_sau) urlSau = api_uploadImage(formData.img_sau, `Sau_${formData.cccd}_${formData.ten_kh}.jpg`);
    if (formData.img_dkkd) urlDKKD = api_uploadImage(formData.img_dkkd, `DKKD_${formData.dkkd}_${formData.ten_kh}.jpg`);
    if (formData.img_qr)   urlQR   = api_uploadImage(formData.img_qr,   `QR_${formData.cccd || formData.dkkd}_${formData.ten_kh}.jpg`);
    let urlThucHien = "";
    if (formData.img_thuchien) urlThucHien = api_uploadImage(formData.img_thuchien, `ThucHien_${formData.cccd || formData.dkkd}_${formData.ten_kh}.jpg`);

    // 3. Chuẩn bị dữ liệu ghi vào Database
    const newId = generateUUID();
    const timestamp = new Date();

    // Tự động xác định Trạng thái
    const isCaNhan = formData.loai_hinh === "Cá nhân";
    const hasMainId = !!(isCaNhan ? formData.cccd : formData.dkkd);
    const hasContact = !!formData.sdt;
    const hasAccount = !!(formData.so_tk && formData.so_tk.length >= 9);
    const hasImages  = !!(formData.img_truoc && formData.img_sau);
    
    // Nếu có QR nữa thì càng tốt, nhưng tối thiểu cần ID/SĐT/TK/Ảnh
    const trangThai = (hasMainId && hasContact && hasAccount && hasImages) ? "Đã xác minh" : "Chưa hoàn thành";
    
    const rowData = [
      newId, 
      timestamp, 
      formData.email, 
      formData.ten_kh.toUpperCase(), 
      formData.cccd ? "'" + formData.cccd : "", 
      formData.dkkd ? "'" + formData.dkkd : "", 
      formData.sdt ? "'" + formData.sdt : "", 
      formData.loai_hinh, 
      formData.ngay_mo, 
      formData.so_tk ? "'" + formData.so_tk : "", 
      formData.ten_dang_nhap ? "'" + formData.ten_dang_nhap : "",
      formData.mat_khau || "", 
      urlTruoc, 
      urlSau, 
      urlDKKD, 
      urlQR,
      urlThucHien,  // Ảnh thực hiện mở tài khoản
      trangThai
    ];


    // 4. Ghi Batch vào Google Sheets
    insertRecordToSheet(CONFIG.SHEET_DATA, rowData);

    // 5. Tính toán thứ hạng thời gian thực
    const ranking = calculateStaffRanking(formData.email);

    return { 
      status: "success", 
      message: "Lưu hồ sơ thành công!", 
      rankingMsg: ranking 
    };

  } catch (e) {
    return { status: "error", message: "Có lỗi Server khi lưu hồ sơ: " + e.message };
  }
}

/**
 * Tính toán thứ hạng cán bộ
 */
function calculateStaffRanking(staffEmail) {
  const data = getSheetDataAsObjects(CONFIG.SHEET_DATA);
  let counts = {};
  
  // Tính tổng
  data.forEach(row => {
    let email = row["Cán bộ thực hiện"];
    if (email) {
      counts[email] = (counts[email] || 0) + 1;
    }
  });

  // Có thể chưa có trong danh sách nếu vừa mới xong
  counts[staffEmail] = counts[staffEmail] || 1;

  let arr = Object.keys(counts).map(email => ({ email: email, total: counts[email] }));
  arr.sort((a, b) => b.total - a.total); 

  let myRank = -1;
  let top1Total = arr.length > 0 ? arr[0].total : 0;
  
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].email === staffEmail) {
      myRank = i + 1;
      break;
    }
  }

  if (myRank === 1) {
    return `Tuyệt vời! Bạn đang ĐỨNG ĐẦU (#1) toàn Quỹ với ${counts[staffEmail]} chỉ tiêu.`;
  } else {
    return `Bạn đang xếp thứ #${myRank} (${counts[staffEmail]} hồ sơ). Người dẫn đầu hiện có ${top1Total} hồ sơ.`;
  }
}

/**
 * Lấy danh sách khách hàng của Cán bộ (Staff)
 */
function api_getMyCustomers(email) {
  try {
    const data = getSheetDataAsObjects(CONFIG.SHEET_DATA);
    let myData = [];
    let timelineByDate = {};

    for (let i = 0; i < data.length; i++) {
      if (data[i]["Cán bộ thực hiện"] === email) {
        myData.push(data[i]);
        
        // Timeline calculation
        let rawDate = new Date(data[i]["Thời điểm nhập"]);
        if (!isNaN(rawDate)) {
           let mm = String(rawDate.getMonth() + 1).padStart(2, "0");
           let dd = String(rawDate.getDate()).padStart(2, "0");
           let strDate = `${dd}/${mm}`;
           timelineByDate[strDate] = (timelineByDate[strDate] || 0) + 1;
        }
      }
    }
    return { status: "success", data: myData, timelineDate: timelineByDate };
  } catch (e) {
    return { status: "error", message: "Lỗi Server: " + e.message };
  }
}

/**
 * Cán bộ Cập nhật thông tin khách hàng (khi phát hiện sai sót)
 */
function api_updateMyCustomer(updateData) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Khóa 10s chờ
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEET_DATA);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const colId = headers.indexOf("ID");
    const colTen = headers.indexOf("Tên khách hàng");
    const colSdt = headers.indexOf("Số điện thoại");
    const colNgayMo = headers.indexOf("Ngày mở TK");
    const colSoTk = headers.indexOf("Số TK");
    const colQR = headers.indexOf("URL QR");
    const colTrangThai = headers.indexOf("Trạng thái");
    
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][colId].toString() === updateData.id.toString()) {
        rowIndex = i;
        break;
      }
    }

    if (data[rowIndex][colTrangThai] === "Đã xác minh") {
      return { status: "error", message: "Hồ sơ đã được xác minh. Không thể sửa đổi dữ liệu!" };
    }

    // Lấy thông tin từ headers để compute status
    const colCccd = headers.indexOf("Số CCCD");
    const colDkkd = headers.indexOf("Số DKKD");
    const colLh   = headers.indexOf("Loại hình dịch vụ");
    const colImg  = headers.indexOf("URL CCCD Trước");

    // Update values locally
    data[rowIndex][colTen] = updateData.ten_kh.toUpperCase();
    data[rowIndex][colSdt] = updateData.sdt ? "'" + updateData.sdt : "";
    data[rowIndex][colNgayMo] = updateData.ngay_mo;
    data[rowIndex][colSoTk] = updateData.so_tk ? "'" + updateData.so_tk : "";
    
    const colTenDN = headers.indexOf("Tên đăng nhập");
    if (colTenDN !== -1 && typeof updateData.ten_dang_nhap !== "undefined") {
      data[rowIndex][colTenDN] = updateData.ten_dang_nhap ? "'" + updateData.ten_dang_nhap : "";
    }
    if (colQR !== -1 && updateData.url_qr) {
      data[rowIndex][colQR] = updateData.url_qr;
    }
    
    // Tự động tính toán lại trạng thái
    const row = data[rowIndex];
    const haveId    = !!(row[colLh] === "Cá nhân" ? row[colCccd] : row[colDkkd]);
    const haveSdt   = !!(row[colSdt]);
    const haveTk    = !!(row[colSoTk] && row[colSoTk].toString().length >= 9);
    const haveImg   = !!(row[colImg]);
    const newStatus = (haveId && haveSdt && haveTk && haveImg) ? "Đã xác minh" : "Chưa hoàn thành";
    data[rowIndex][colTrangThai] = newStatus;

    // Batch Update 1 row using setValues
    sheet.getRange(rowIndex + 1, 1, 1, data[rowIndex].length).setValues([data[rowIndex]]);
    SpreadsheetApp.flush(); 

    return { 
      status: "success", 
      message: newStatus === "Đã xác minh" ? "Cập nhật thành công! Hồ sơ đã được Đã xác minh (đầy đủ thông tin)." : "Đã lưu điều chỉnh. Hồ sơ vẫn ở trạng thái Chưa hoàn thành." 
    };

  } catch (e) {
    return { status: "error", message: "Lỗi Server Update: " + e.message };
  } finally {
    lock.releaseLock();
  }
}

