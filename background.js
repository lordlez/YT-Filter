// Puedes usarlo para futuras funcionalidades
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateFilters") {
        sendResponse({ status: "Filters updated!" });
    }
});