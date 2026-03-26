/**
 * MODULE DATABASE
 * Giao tiếp với Google Sheets bằng Batch Operations để tối ưu hiệu suất
 */

function getSheetByName(sheetName) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    return ss.getSheetByName(sheetName);
  } catch (e) {
    throw new Error("Lỗi kết nối CSDL: Vui lòng kiểm tra lại SPREADSHEET_ID trong Config.gs. Chi tiết: " + e.message);
  }
}

/**
 * Đọc toàn bộ dữ liệu Sheet và chuyển đổi thành Mảng Object (JSON)
 */
function getSheetDataAsObjects(sheetName) {
  const sheet = getSheetByName(sheetName);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues(); // Đọc Batch 1 lần
  if (data.length <= 1) return []; // Không có dữ liệu ngoài Header
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      let val = row[index];
      // Google Apps Script HTML Service không thể tự Serialize Date Object
      // Cần phải Stringify các giá trị Date thành String trước khi trả về Frontend
      if (val instanceof Date) {
        val = val.toISOString();
      }
      obj[header] = val;
    });
    return obj;
  });
}

/**
 * Thêm 1 dòng dữ liệu bằng Batch SetValues có tích hợp Khóa chống ghi đè
 */
function insertRecordToSheet(sheetName, newRowDataAsArray) {
  const lock = LockService.getScriptLock();
  try {
    // Chờ tối đa 10s để lấy quyền ghi độc quyền
    lock.waitLock(10000); 
    
    const sheet = getSheetByName(sheetName);
    if (!sheet) throw new Error("Sheet không tồn tại: " + sheetName);
    
    // Đọc số dòng cuối ngay trong vùng an toàn (atomic)
    const lastRow = sheet.getLastRow();
    const numCols = newRowDataAsArray.length;
    
    // Ghi dữ liệu 1 lần vào dòng cuối cùng
    sheet.getRange(lastRow + 1, 1, 1, numCols).setValues([newRowDataAsArray]);
    
    // Đẩy thay đổi xuống đĩa ngay lập tức
    SpreadsheetApp.flush();
    
  } catch (e) {
    throw new Error("Lỗi khi ghi dữ liệu (Concurrency/Timeout): " + e.message);
  } finally {
    lock.releaseLock();
  }
}
