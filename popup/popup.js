const tagsInput = document.getElementById("tags-input");
const statusEl = document.getElementById("status");

chrome.storage.local.get(["blockedTags"], ({ blockedTags }) => {
    if (blockedTags && blockedTags.length > 0) {
        tagsInput.value = blockedTags.join(", ");
    }
});

document.getElementById("save-btn").addEventListener("click", () => {
    const tags = tagsInput.value
        .split(",")
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag);

    chrome.storage.local.set({ blockedTags: tags }, () => {
        statusEl.textContent = "Filtros aplicados!";
        setTimeout(() => statusEl.textContent = "", 2000);
        
        chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
            tabs.forEach(tab => {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: () => location.reload()
                });
            });
        });
    });
});

document.getElementById("reset-btn").addEventListener("click", () => {
    chrome.storage.local.set({ blockedTags: [] }, () => {
        tagsInput.value = "";
        statusEl.textContent = "Filtros reiniciados!";
        setTimeout(() => statusEl.textContent = "", 2000);
        
        chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.reload(tab.id);
            });
        });
    });
});