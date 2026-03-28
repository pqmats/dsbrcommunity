const i18n = {
    locale: 'pt',
    translations: {},
    
    async init() {
        this.locale = localStorage.getItem('dsbr-locale') || 'pt';
        await this.loadTranslations(this.locale);
        this.applyTranslations();
        this.updateUI();
    },
    
    async loadTranslations(locale) {
        try {
            const response = await fetch(`./locales/${locale}.json`);
            this.translations = await response.json();
            this.locale = locale;
            localStorage.setItem('dsbr-locale', locale);
            document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en';
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    },
    
    applyTranslations() {
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
        if (this.locale === locale) return;
        await this.loadTranslations(locale);
        this.applyTranslations();
        this.updateUI();
    },
    
    updateUI() {
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

document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
    
    // Add event listeners for select changes
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('lang-select')) {
            i18n.switchLanguage(e.target.value);
        }
    });
});
