// ─── Shared translation utilities ───

function toPersianDigits(num) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, d => persianDigits[d]);
}

function toJalali(dateStr) {
    if (!dateStr) return '';
    const [gy, gm, gd] = dateStr.split('-').map(Number);
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
    let jy = -1595 + (33 * Math.floor(days / 12053));
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    let jm, jd;
    if (days < 186) {
        jm = 1 + Math.floor(days / 31);
        jd = 1 + (days % 31);
    } else {
        jm = 7 + Math.floor((days - 186) / 30);
        jd = 1 + ((days - 186) % 30);
    }
    const monthNames = ['', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'امرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    return `${toPersianDigits(jd)}/${monthNames[jm]}/${toPersianDigits(jy)}`;
}

function getCurrentJalaliYear() {
    const dateStr = new Date().toISOString().split('T')[0];
    const fullJalali = toJalali(dateStr);
    const parts = fullJalali.split('/');
    return parts[parts.length - 1];
}

// ─── Core language setter ───
function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

    window.appLang = lang;

    // Update toggle button text (if present)
    const btn = document.getElementById('lang-toggle');
    if (btn) {
        btn.textContent = lang === 'en' ? '🇮🇷 فارسی' : '🇬🇧 English';
    }

    // Update static dates (used in blog post pages)
    document.querySelectorAll('.static-date').forEach(el => {
        const dateStr = el.dataset.date;
        if (dateStr) {
            el.textContent = lang === 'fa' ? toJalali(dateStr) : dateStr;
        }
    });

    // Toggle language blocks for blog posts
    const enBlock = document.getElementById('content-en');
    const faBlock = document.getElementById('content-fa');
    if (enBlock && faBlock) {
        if (lang === 'fa') {
            enBlock.classList.remove('active');
            faBlock.classList.add('active');
        } else {
            faBlock.classList.remove('active');
            enBlock.classList.add('active');
        }
    }
}

// On page load, apply the saved language
(function () {
    const savedLang = localStorage.getItem('lang') || 'en';
    setLanguage(savedLang);
})();