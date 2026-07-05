// ─── Shared Components ───

function renderNavbar(lang) {
    const nav = document.getElementById('main-navbar');
    if (!nav) return;
    nav.innerHTML = `
        <div class="container">
            <a href="index.html" class="nav-logo" id="nav-home">◈ <span>Khoshmard</span></a>
            <ul class="nav-links">
                <li><a href="index.html#works" class="nav-link" data-target="works">${lang === 'en' ? 'Works' : 'نمونه‌کارها'}</a></li>
                <li><a href="index.html#blog" class="nav-link" data-target="blog">${lang === 'en' ? 'Blog' : 'نوشته‌ها'}</a></li>
                <li><a href="index.html#social" class="nav-link" data-target="social">${lang === 'en' ? 'Social' : 'افکار'}</a></li>
                <li><a href="index.html#skills" class="nav-link" data-target="skills">${lang === 'en' ? 'Skills' : 'مهارت‌ها'}</a></li>
                <li><a href="index.html#contact" class="nav-link" class="nav-cta" data-target="contact">${lang === 'en' ? 'Reach Me' : 'تماس'}</a></li>
            </ul>
            <button id="lang-toggle" class="lang-btn">${lang === 'en' ? '🇮🇷 فارسی' : '🇬🇧 English'}</button>
        </div>
    `;

    // Attach language toggle behaviour
    const btn = document.getElementById('lang-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const currentLang = localStorage.getItem('lang') || 'en';
            const newLang = currentLang === 'en' ? 'fa' : 'en';
            setLanguage(newLang);

            if (typeof renderMainPage === 'function') {
                renderMainPage();
            } else {
                location.reload();
            }
        });
    }
}

function renderFooter(lang) {
    const footer = document.getElementById('main-footer');
    if (!footer) return;
    const year = new Date().getFullYear();
    footer.innerHTML = `
        <div class="container">
            <p>© ${lang === 'en' ? year + ' - Built with passion. All rights reserved.' : toPersianDigits(year) + ' - ساخته شده با اشتیاق. تمامی حقوق محفوظ است.'}</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const lang = localStorage.getItem('lang') || 'en';
    renderNavbar(lang);
    renderFooter(lang);
});