/**
 * MODULE ADMIN
 * Cung cấp API phục vụ Dashboard Thống kê và Quản lý Báo cáo
 */

function api_getAdminDashboardData() {
  try {
    const data = getSheetDataAsObjects(CONFIG.SHEET_DATA);
    const staffs = getSheetDataAsObjects(CONFIG.SHEET_STAFF);

    let totalAccounts   = data.length;
    let pendingAccounts = data.filter(d => d["Trạng thái"] === "Chưa hoàn thành").length;  // Hồ sơ chưa đủ thông tin
    let approvedAccounts = data.filter(d => d["Trạng thái"] === "Đã xác minh").length;
    let caNhanAccounts  = data.filter(d => d["Loại hình dịch vụ"] === "Cá nhân").length;
    let hkdAccounts     = data.filter(d => d["Loại hình dịch vụ"] === "Hộ kinh doanh").length;

    
    // Tổng hợp loại hình
    let loaiHinhCount = {"Cá nhân": 0, "Hộ kinh doanh": 0};
    data.forEach(d => {
      let lh = d["Loại hình dịch vụ"];
      if(lh) {
        loaiHinhCount[lh] = (loaiHinhCount[lh] || 0) + 1;
      }
    });

    // Thống kê nhân viên xuất sắc — phân loại Cá nhân / Kinh doanh
    let staffCount = {};
    data.forEach(d => {
      let e = d["Cán bộ thực hiện"];
      let lh = d["Loại hình dịch vụ"];
      if(e) {
        if (!staffCount[e]) staffCount[e] = { total: 0, caNhan: 0, hkd: 0 };
        staffCount[e].total++;
        if (lh === "Cá nhân") staffCount[e].caNhan++;
        else if (lh === "Hộ kinh doanh") staffCount[e].hkd++;
      }
    });

    let allStaffStats = Object.keys(staffCount).map(k => {
      let tUser = staffs.find(s => s["Email"] === k);
      return {
        email: k,
        name: tUser ? tUser["Họ tên"] : k,
        department: tUser ? tUser["Bộ phận"] : "",
        total: staffCount[k].total,
        caNhan: staffCount[k].caNhan,
        hkd: staffCount[k].hkd
      };
    }).sort((a,b) => b.total - a.total);

    let topStaffs = allStaffStats.slice(0, 5); // Tối đa 5 người

    // Xử lý Timeline (Gom nhóm theo Ngày và Tháng)
    let timelineByDate = {};
    let typeByMonth = {};

    data.forEach(d => {
      let rawDate = new Date(d["Thời điểm nhập"]);
      if (isNaN(rawDate)) return;
      
      let yyyy = rawDate.getFullYear();
      let mm = String(rawDate.getMonth() + 1).padStart(2, "0");
      let dd = String(rawDate.getDate()).padStart(2, "0");
      
      let strDate = `${dd}/${mm}`;
      let strMonth = `${mm}/${yyyy}`; 
      
      timelineByDate[strDate] = (timelineByDate[strDate] || 0) + 1;
      
      let lh = d["Loại hình dịch vụ"];
      if (!typeByMonth[strMonth]) typeByMonth[strMonth] = { "Cá nhân": 0, "Hộ kinh doanh": 0 };
      if (lh && typeByMonth[strMonth][lh] !== undefined) {
         typeByMonth[strMonth][lh]++;
      }
    });

    // Chuyển Obj Timeline Date sang mảng và giới hạn 30 ngày gần nhất để biểu đồ không bị nát
    let arrTimelineDate = Object.keys(timelineByDate).map(k => ({ date: k, count: timelineByDate[k] }));
    // Mảng này cần sort chronological, nhưng vì object key bảo toàn thứ tự lúc sinh data nên tạm chấp nhận hoặc chỉ lấy mảng đảo ngược
    
    // Để giữ nguyên file nhẹ, chỉ trả về dạng Object Map

    
    let statsPayload = {
      total: totalAccounts,
      pending: pendingAccounts,
      approved: approvedAccounts,
      caNhan: caNhanAccounts,
      hkd: hkdAccounts,
      loaiHinh: loaiHinhCount,
      allStaffs: allStaffStats,
      topStaffs: topStaffs,
      timelineDate: timelineByDate,
      typeMonth: typeByMonth,
      allData: data 
    };

    return {
      status: "success",
      statsStr: JSON.stringify(statsPayload) // Serialize thủ công để tránh lỗi mất object của GAS
    };

  } catch (e) {
    return { status: "error", message: "Lỗi lấy dữ liệu Admin: " + e.message };
  }
}

/**
 * Xóa hồ sơ hoặc đổi trạng thái (chỉ Admin)
 * Cần truyền đối tượng {id, newStatus}
 */
function api_adminUpdateStatus(id, newStatus) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheetByName(CONFIG.SHEET_DATA);
    const data = sheet.getDataRange().getValues();
    const header = data[0];
    
    // Ưu tiên cột "ID", sau đó là "Mã GD"
    let idIdx = header.indexOf("ID");
    if (idIdx === -1) idIdx = header.indexOf("Mã GD"); 
    
    const statusIdx = header.indexOf("Trạng thái");

    if (idIdx === -1 || statusIdx === -1) throw new Error("Cấu trúc bảng bị sai lệch (thiếu Mã GD hoặc Trạng thái).");

    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
        if (data[i][idIdx] === id) {
            rowIndex = i;
            break;
        }
    }

    if (rowIndex === -1) {
        return { status: "error", message: "Không tìm thấy hồ sơ với ID tương ứng." };
    }

    // Cập nhật State bộ nhớ (RAM) và ghi Batch SetValues
    data[rowIndex][statusIdx] = newStatus;
    sheet.getRange(rowIndex + 1, 1, 1, data[rowIndex].length).setValues([data[rowIndex]]);
    
    // Đẩy thay đổi lập tức lên GG Sheets
    SpreadsheetApp.flush();
    
    return { status: "success", message: "Đã cập nhật trạng thái thành: " + newStatus };
  } catch (e) {
    return { status: "error", message: "Lỗi Admin: " + e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * API trả về vị trí xếp hạng của 1 Cán bộ cụ thể
 * Trả về: rank, số cá nhân, số HKD, người phía trên cách bao nhiêu, top1 tên + số
 */
function api_getMyRanking(email) {
  try {
    const data = getSheetDataAsObjects(CONFIG.SHEET_DATA);
    const staffs = getSheetDataAsObjects(CONFIG.SHEET_STAFF);

    // Đếm theo email, phân loại CA/HKD
    let staffCount = {};
    data.forEach(d => {
      let e = d["Cán bộ thực hiện"];
      let lh = d["Loại hình dịch vụ"];
      if (e) {
        if (!staffCount[e]) staffCount[e] = { total: 0, caNhan: 0, hkd: 0 };
        staffCount[e].total++;
        if (lh === "Cá nhân") staffCount[e].caNhan++;
        else if (lh === "Hộ kinh doanh") staffCount[e].hkd++;
      }
    });

    // Sắp xếp bảng xếp hạng
    let ranked = Object.keys(staffCount).map(k => {
      let u = staffs.find(s => s["Email"] === k);
      return { email: k, name: u ? u["Họ tên"] : k, ...staffCount[k] };
    }).sort((a, b) => b.total - a.total);

    let myIdx = ranked.findIndex(r => r.email === email);
    if (myIdx === -1) {
      // Cán bộ chưa có hồ sơ nào
      return {
        status: "success",
        rank: ranked.length + 1,
        myTotal: 0, myCaNhan: 0, myHkd: 0,
        top1Total: ranked.length > 0 ? ranked[0].total : 0,
        top1Name: ranked.length > 0 ? ranked[0].name : "—",
        aboveName: "—",
        aboveDiff: 0,
        totalStaffs: ranked.length + 1
      };
    }

    let me = ranked[myIdx];
    let above = myIdx > 0 ? ranked[myIdx - 1] : null;
    let top1 = ranked[0];

    return {
      status: "success",
      rank: myIdx + 1,
      myTotal: me.total,
      myCaNhan: me.caNhan,
      myHkd: me.hkd,
      top1Total: top1.total,
      top1Name: top1.name,
      aboveName: above ? above.name : "—",
      aboveDiff: above ? above.total - me.total : 0,
      totalStaffs: ranked.length
    };
  } catch (e) {
    return { status: "error", message: "Lỗi xếp hạng: " + e.message };
  }
}
