(function () {
    var STORAGE_KEY = 's9-lang';

    function getStoredLang() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'en' || saved === 'zh') return saved;
        } catch (e) {}
        return 'zh';
    }

    function applyLang(lang) {
        var isEn = lang === 'en';

        document.querySelectorAll('.lang-zh').forEach(function (el) {
            el.style.display = isEn ? 'none' : '';
        });
        document.querySelectorAll('.lang-en').forEach(function (el) {
            el.style.display = isEn ? '' : 'none';
        });
        document.querySelectorAll('.lang-toggle-btn').forEach(function (btn) {
            btn.textContent = isEn ? '中文' : 'EN';
        });

        document.documentElement.setAttribute('lang', isEn ? 'en' : 'zh-tw');

        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {}
    }

    document.addEventListener('DOMContentLoaded', function () {
        applyLang(getStoredLang());

        document.querySelectorAll('.lang-toggle-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                applyLang(getStoredLang() === 'en' ? 'zh' : 'en');
            });
        });
    });
})();
