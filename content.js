function applyFilters() {
    chrome.storage.local.get(["blockedTags"], ({ blockedTags = [] }) => {
        const videos = document.querySelectorAll(
            "ytd-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer"
        );
        
        videos.forEach(video => {
            const title = video.querySelector("#video-title")?.textContent?.toLowerCase() || "";
            const shouldHide = blockedTags.some(tag => title.includes(tag));
            video.style.display = shouldHide ? "none" : "";
        });
    });
}

applyFilters();

new MutationObserver(applyFilters)
    .observe(document.body, { childList: true, subtree: true });

chrome.storage.onChanged.addListener((changes) => {
    if (changes.blockedTags) {
        applyFilters();
    }
});