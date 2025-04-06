// Función para mostrar TODOS los videos
function showAllVideos() {
    document.querySelectorAll("ytd-video-renderer, ytd-rich-item-renderer").forEach(video => {
        video.style.display = "";
    });
}

// Función para ocultar videos no deseados
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

// Observador para cambios dinámicos en la página
const observer = new MutationObserver(hideVideos);
observer.observe(document.body, { childList: true, subtree: true });

// Escuchar mensajes desde popup.js (para reset)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "resetFilters") {
        showAllVideos();
    }
});

// Ejecutar al cargar la página
hideVideos();