const i18n = {
    locale: 'pt',
    translations: {},
    
    async init() {
        console.log('i18n: Initializing custom dropdown logic...');
        const storedLocale = localStorage.getItem('dsbr-locale') || 'pt';
        const success = await this.loadTranslations(storedLocale);
        if (success) {
            this.applyTranslations();
        }
        this.updateUI();
    },
    
    async loadTranslations(locale) {
        try {
            const response = await fetch(`./locales/${locale}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            this.translations = data;
            this.locale = locale;
            localStorage.setItem('dsbr-locale', locale);
            document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en';
            
            console.log(`i18n: ${locale} loaded.`);
            return true;
        } catch (error) {
            console.error('i18n: Error:', error);
            return false;
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
        const success = await this.loadTranslations(locale);
        if (success) {
            this.applyTranslations();
            this.updateUI();
        }
    },
    
    updateUI() {
        const flag = this.locale === 'pt' ? '🇧🇷' : '🇺🇸';
        const text = this.locale === 'pt' ? 'PT' : 'EN';
        
        // Update all custom switchers
        document.querySelectorAll('.custom-lang-switcher').forEach(switcher => {
            const currentFlag = switcher.querySelector('.current-flag');
            const currentText = switcher.querySelector('.current-text');
            if (currentFlag) currentFlag.textContent = flag;
            if (currentText) currentText.textContent = text;
            
            // Mark active option
            switcher.querySelectorAll('.lang-option').forEach(opt => {
                if (opt.getAttribute('data-value') === this.locale) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
        });
    }
};

window.i18n = i18n;

document.addEventListener('DOMContentLoaded', () => {
    i18n.init();

    // Custom Switcher Logic
    document.addEventListener('click', (e) => {
        // Toggle Dropdown
        const current = e.target.closest('.lang-current');
        if (current) {
            const switcher = current.closest('.custom-lang-switcher');
            // Close others
            document.querySelectorAll('.custom-lang-switcher').forEach(s => {
                if (s !== switcher) s.classList.remove('active');
            });
            switcher.classList.toggle('active');
            return;
        }

        // Selection
        const option = e.target.closest('.lang-option');
        if (option) {
            const val = option.getAttribute('data-value');
            i18n.switchLanguage(val);
            option.closest('.custom-lang-switcher').classList.remove('active');
            return;
        }

        // Close when clicking outside
        if (!e.target.closest('.custom-lang-switcher')) {
            document.querySelectorAll('.custom-lang-switcher').forEach(s => {
                s.classList.remove('active');
            });
        }
    });
});
