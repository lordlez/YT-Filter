const translations = {
    es: {
        title: "Filtro de Contenido YT",
        label: "Palabras bloqueadas actualmente:",
        placeholder: "Ej: pokemon, minecraft",
        saveBtn: "Guardar",
        resetBtn: "Reiniciar",
        saveSuccess: "¡Filtros aplicados!",
        resetSuccess: "¡Filtros reiniciados!"
    },
    en: {
        title: "YT Content Filter",
        label: "Currently blocked words:",
        placeholder: "E.g.: pokemon, minecraft",
        saveBtn: "Save",
        resetBtn: "Reset",
        saveSuccess: "Filters applied!",
        resetSuccess: "Filters reset!"
    }
};

const elements = {
    title: document.getElementById('title'),
    label: document.getElementById('label'),
    input: document.getElementById('tags-input'),
    saveBtn: document.getElementById('save-btn'),
    resetBtn: document.getElementById('reset-btn'),
    status: document.getElementById('status'),
    langEs: document.getElementById('lang-es'),
    langEn: document.getElementById('lang-en')
};

function setLanguage(lang) {
    const t = translations[lang];
    
    elements.title.textContent = t.title;
    elements.label.textContent = t.label;
    elements.input.placeholder = t.placeholder;
    elements.saveBtn.textContent = t.saveBtn;
    elements.resetBtn.textContent = t.resetBtn;
    
    elements.langEs.classList.toggle('active', lang === 'es');
    elements.langEn.classList.toggle('active', lang === 'en');
    
    chrome.storage.local.set({ language: lang });
}

elements.langEs.addEventListener('click', () => setLanguage('es'));
elements.langEn.addEventListener('click', () => setLanguage('en'));

chrome.storage.local.get(['language', 'blockedTags'], ({ language = 'es', blockedTags }) => {
    setLanguage(language);
    if (blockedTags) elements.input.value = blockedTags.join(', ');
});

elements.saveBtn.addEventListener('click', () => {
    const tags = elements.input.value.split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag);

    chrome.storage.local.get(['language'], ({ language = 'es' }) => {
        chrome.storage.local.set({ blockedTags: tags }, () => {
            elements.status.textContent = translations[language].saveSuccess;
            setTimeout(() => elements.status.textContent = '', 2000);
            refreshTabs();
        });
    });
});

elements.resetBtn.addEventListener('click', () => {
    chrome.storage.local.get(['language'], ({ language = 'es' }) => {
        chrome.storage.local.set({ blockedTags: [] }, () => {
            elements.input.value = '';
            elements.status.textContent = translations[language].resetSuccess;
            setTimeout(() => elements.status.textContent = '', 2000);
            refreshTabs();
        });
    });
});

function refreshTabs() {
    chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
        tabs.forEach(tab => chrome.tabs.reload(tab.id));
    });
}