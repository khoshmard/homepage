// ─── Language state ───
let currentLang = 'en'; // 'en' or 'fa'
let portfolioData = {};

// ─── DOM elements ───
const langToggle = document.getElementById('lang-toggle');
const projectsContainer = document.getElementById('projects-container');
const skillsContainer = document.getElementById('skills-container');
const contactLinksContainer = document.getElementById('contact-links');
const heroTagsContainer = document.getElementById('hero-tags');
const heroRole = document.getElementById('hero-role');
const heroName = document.getElementById('hero-name-dynamic');
const contactEmailLabel = document.getElementById('contact-email-label');
const contactLocation = document.getElementById('contact-location');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalTech = document.getElementById('modal-tech');
const modalLink = document.getElementById('modal-link');

// ─── Fetch JSON data ───
async function loadData() {
    try {
        const response = await fetch('data.json');
        portfolioData = await response.json();
        renderPage(currentLang);
    } catch (error) {
        console.error('Failed to load data.json:', error);
        // Fallback empty data
        document.body.innerHTML += '<p style="color:red;text-align:center;">Error loading data. Please run via a local server.</p>';
    }
}

// ─── Helper: get translated string ───
function t(key, defaultValue = '') {
    // for simple strings like skills
    if (typeof key === 'object' && key !== null) {
        return key[currentLang] || key.en || '';
    }
    return defaultValue;
}

// ─── Render entire page ───
function renderPage(lang) {
    currentLang = lang;
    const data = portfolioData;

    // Update language button text
    langToggle.textContent = lang === 'en' ? '🇮🇷 فارسی' : '🇬🇧 English';
    document.documentElement.lang = lang === 'fa' ? 'fa' : 'en';
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

    // Static text with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        // Get translation from data.i18n or fallback
        if (data.i18n && data.i18n[key]) {
            el.textContent = data.i18n[key][lang] || data.i18n[key].en || el.textContent;
        }
    });

    // Hero
    const personal = data.personal[lang] || data.personal.en;
    heroName.textContent = personal.name;
    heroRole.textContent = personal.role;
    heroTagsContainer.innerHTML = personal.heroTags.map(t => `<span class="hero-tag"><span class="icon">${t.icon}</span> ${t.label}</span>`).join('');

    // Projects
    projectsContainer.innerHTML = data.projects.map(p => {
        const proj = p[lang] || p.en;
        return `
        <div class="project-card" data-id="${p.id}">
            <div class="project-icon">${p.icon}</div>
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            <div class="project-tech">${proj.tech.map(t => `<span>${t}</span>`).join('')}</div>
            <span class="project-link">${lang === 'en' ? 'View details' : 'جزئیات'} →</span>
        </div>`;
    }).join('');

    // Skills – if skills are simple strings, just use them; if objects, translate
    const skills = data.skills.map(s => (typeof s === 'object' ? s[lang] || s.en : s));
    skillsContainer.innerHTML = skills.map(s => `<span class="skill-chip">${s}</span>`).join('');

    // Contact
    contactEmailLabel.textContent = lang === 'en' 
        ? `Let's collaborate — ${data.personal.en.email}` 
        : `همکاری — ${data.personal.fa.email}`;
    contactLocation.textContent = personal.location;
    contactLinksContainer.innerHTML = data.contactLinks.map(l => {
        const platform = l[lang === 'en' ? 'platformEn' : 'platformFa'] || l.platformEn;
        return `<a href="${l.url}" class="contact-link" target="_blank" rel="noopener">${l.icon} ${platform}</a>`;
    }).join('');

    // Footer year
    document.getElementById('footer-year').textContent = new Date().getFullYear();

    // Attach event listeners to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.getAttribute('data-id'), 10);
            openModal(id);
        });
    });
}

// ─── Modal functions ───
function openModal(projectId) {
    const project = portfolioData.projects.find(p => p.id === projectId);
    if (!project) return;
    const proj = project[currentLang] || project.en;
    modalIcon.textContent = project.icon;
    modalTitle.textContent = proj.title;
    modalDescription.textContent = proj.detailedDescription || proj.description;
    modalTech.innerHTML = proj.tech.map(t => `<span>${t}</span>`).join('');
    const link = project.link;
    if (link && link !== '#') {
        modalLink.href = link;
        modalLink.textContent = currentLang === 'en' ? 'Learn more →' : 'اطلاعات بیشتر ←';
        modalLink.style.display = 'inline-flex';
    } else {
        modalLink.style.display = 'none';
    }
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

// ─── Event listeners ───
langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'fa' : 'en';
    renderPage(currentLang);
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
});

// ─── Initial load ───
loadData();