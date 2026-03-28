const i18n = {
    locale: 'pt',
    translations: {},
    
    async init() {
        console.log('i18n: Initializing...');
        const storedLocale = localStorage.getItem('dsbr-locale') || 'pt';
        console.log('i18n: Current locale from storage:', storedLocale);
        const success = await this.loadTranslations(storedLocale);
        if (success) {
            this.applyTranslations();
        }
        this.updateUI();
    },
    
    async loadTranslations(locale) {
        console.log(`i18n: Loading translations for ${locale}...`);
        try {
            const response = await fetch(`./locales/${locale}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            // Only update state if data is valid
            this.translations = data;
            this.locale = locale;
            localStorage.setItem('dsbr-locale', locale);
            document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en';
            
            console.log(`i18n: Translations for ${locale} loaded successfully.`);
            return true;
        } catch (error) {
            console.error('i18n: Error loading translations:', error);
            return false;
        }
    },
    
    applyTranslations() {
        console.log(`i18n: Applying translations for ${this.locale} to DOM...`);
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = this.translations[key];
                } else if (el.hasAttribute('data-i18n-html')) {
                    el.innerHTML = this.translations[key];
                } else {
                    el.textContent = this.translations[key];
                }
            }
        });
    },
    
    async switchLanguage(locale) {
        console.log(`i18n: Switching language to ${locale}...`);
        // Force reload even if it thinks it's the same, to be safe
        const success = await this.loadTranslations(locale);
        if (success) {
            this.applyTranslations();
            this.updateUI();
        }
    },
    
    updateUI() {
        console.log('i18n: Updating UI elements...');
        const selects = document.querySelectorAll('.lang-select');
        selects.forEach(select => {
            select.value = this.locale;
        });
        
        const toggles = document.querySelectorAll('.lang-toggle-btn');
        toggles.forEach(toggle => {
            if (toggle.getAttribute('data-lang') === this.locale) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }
        });
    }
};

// Expose to window for console debugging
window.i18n = i18n;

document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
    
    // Add event listeners for select changes
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('lang-select')) {
            console.log('i18n: Select change detected:', e.target.value);
            i18n.switchLanguage(e.target.value);
        }
    });
});
