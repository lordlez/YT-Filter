// Elementos del DOM
const tagsInput = document.getElementById("tags-input");
const tagsChips = document.getElementById("tags-chips");
let tags = [];

// Cargar tags guardados al abrir el popup
chrome.storage.local.get(["blockedTags"], (data) => {
    if (data.blockedTags) {
        tags = data.blockedTags;
        renderChips();
    }
});

// Función para renderizar los chips con animación
function renderChips() {
    tagsChips.innerHTML = "";
    tags.forEach((tag, index) => {
        const chip = document.createElement("div");
        chip.className = "chip";
        chip.innerHTML = `
            ${tag}
            <span class="chip-remove" data-index="${index}">
                <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L11 11M1 11L11 1" stroke="#666" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </span>
        `;
        tagsChips.appendChild(chip);
    });
}

// Evento para agregar tags al presionar coma o Enter
tagsInput.addEventListener("keydown", (e) => {
    if (e.key === "," || e.key === "Enter") {
        e.preventDefault();
        const tag = tagsInput.value.trim();
        if (tag && !tags.includes(tag)) {
            tags.push(tag);
            renderChips();
        }
        tagsInput.value = "";
    }
});

// Evento para eliminar tags con animación
tagsChips.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".chip-remove");
    if (removeBtn) {
        const chip = removeBtn.parentElement;
        chip.style.opacity = "0";
        chip.style.transform = "scale(0.9)";
        
        setTimeout(() => {
            const index = removeBtn.getAttribute("data-index");
            tags.splice(index, 1);
            renderChips();
        }, 200); // Espera a que termine la animación
    }
});

// Guardar tags
document.getElementById("save-btn").addEventListener("click", () => {
    chrome.storage.local.set({ blockedTags: tags }, () => {
        document.getElementById("status").textContent = "Filtros guardados!";
        setTimeout(() => {
            document.getElementById("status").textContent = "";
        }, 2000);
    });
});

// Resetear tags
document.getElementById("reset-btn").addEventListener("click", () => {
    tags = [];
    renderChips();
    chrome.storage.local.remove(["blockedTags"], () => {
        document.getElementById("status").textContent = "Filtros reseteados!";
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.reload(tabs[0].id);
        });
        setTimeout(() => {
            document.getElementById("status").textContent = "";
        }, 2000);
    });
});