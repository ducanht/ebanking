/**
 * API MODULE
 * Hardened with Timeout (35s) and Auto-Retry (Max 2)
 */

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyXBMdJO2JmoaarxW9l7mg-l4tyN6BF1U01jaMPQ48xmVOZM9WFWLnOTIc9Wyf1OpFr/exec";

async function runAPI(action, data = {}, successHandler, errorHandler, loadingMsg = 'Đang xử lý...', retryCount = 0) {
    if (loadingMsg !== 'NONE' && retryCount === 0) showLoading(loadingMsg);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout

    try {
        const response = await fetch(GAS_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({ action: action, data: data }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const result = await response.json();
        
        if (loadingMsg !== 'NONE') hideLoading();
        if (successHandler) successHandler(result);
        return result;

    } catch (error) {
        clearTimeout(timeoutId);
        
        // Auto-retry on timeout or network failure (max 2 times)
        if (retryCount < 2 && (error.name === 'AbortError' || error.message === 'Failed to fetch')) {
            console.warn(`API Retry [${action}] attempt ${retryCount + 1}...`);
            return runAPI(action, data, successHandler, errorHandler, loadingMsg, retryCount + 1);
        }

        if (loadingMsg !== 'NONE') hideLoading();
        console.error(`API Error [${action}]:`, error);
        
        let errorMsg = error.message;
        if (error.name === 'AbortError') errorMsg = 'Yêu cầu quá hạn (35s). Vui lòng thử lại.';
        else if (error.message === 'Failed to fetch') errorMsg = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng.';

        if (errorHandler) errorHandler(error);
        else showAlert('Lỗi kết nối', errorMsg, 'error');
    }
}
