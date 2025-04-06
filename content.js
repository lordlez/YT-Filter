function hideVideos() {
    chrome.storage.local.get(["blockedTags"], (data) => {
        const blockedTags = data.blockedTags || [];
        if (blockedTags.length === 0) return;

        document.querySelectorAll("ytd-video-renderer, ytd-rich-item-renderer").forEach(video => {
            const title = video.querySelector("#video-title")?.textContent.toLowerCase();
            const channel = video.querySelector("#channel-name")?.textContent.toLowerCase();
            
            if (blockedTags.some(tag => title?.includes(tag) || channel?.includes(tag))) {
                video.style.display = "none";
            }
        });
    });
}

// Observador para detectar cambios dinámicos en la página (ej: scroll infinito)
const observer = new MutationObserver(hideVideos);
observer.observe(document.body, { childList: true, subtree: true });

// Ejecutar al cargar la página
hideVideos();