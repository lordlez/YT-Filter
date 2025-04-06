document.getElementById("save-btn").addEventListener("click", () => {
    const tagsInput = document.getElementById("tags-input").value;
    const tags = tagsInput.split(",").map(tag => tag.trim().toLowerCase());
    
    chrome.storage.local.set({ blockedTags: tags }, () => {
        document.getElementById("status").textContent = "¡Filtros guardados!";
        setTimeout(() => {
            document.getElementById("status").textContent = "";
        }, 2000);
    });
});

chrome.storage.local.get(["blockedTags"], (data) => {
    if (data.blockedTags) {
        document.getElementById("tags-input").value = data.blockedTags.join(", ");
    }
});