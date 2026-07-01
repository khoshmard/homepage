// ─── Global state ───
let currentLang = localStorage.getItem('lang') || 'en';
let portfolioData = {};
let postsIndex = [];
let postsCache = {};
let blogDisplayedCount = 0;
const POSTS_PER_PAGE = 3;
let allSocialPosts = [];
let socialDisplayedCount = 0;
const SOCIAL_PER_PAGE = 3;

// ─── DOM elements ───
const langToggle = document.getElementById('lang-toggle');
const heroSection = document.getElementById('hero-section');
const worksSection = document.getElementById('works-section');
const blogSection = document.getElementById('blog-section');
const socialSection = document.getElementById('social-section');
const skillsSection = document.getElementById('skills-section');
const contactSection = document.getElementById('contact-section');
const projectsContainer = document.getElementById('projects-container');
const blogPostsContainer = document.getElementById('blog-posts-container');
const blogLoadMoreBtn = document.getElementById('blog-load-more');
const blogNoMoreMsg = document.getElementById('blog-no-more');
const socialPostsContainer = document.getElementById('social-posts-container');
const socialLoadMoreBtn = document.getElementById('social-load-more');
const socialNoMoreMsg = document.getElementById('social-no-more');
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
const modalMeta = document.getElementById('modal-meta');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalTech = document.getElementById('modal-tech');
const modalLink = document.getElementById('modal-link');
const footerYear = document.getElementById('footer-year');

// ─── Convert a number to Persian digits ───
function toPersianDigits(num) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, d => persianDigits[d]);
}

// ─── Jalali (Shamsi) date converter ───
function toJalali(dateStr) {
    // dateStr format: "YYYY-MM-DD"
    const [gy, gm, gd] = dateStr.split('-').map(Number);
    // Convert Gregorian to Jalali
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
    // Persian month names
    const monthNames = [
        '', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    return `${toPersianDigits(jd)}/${monthNames[jm]}/${toPersianDigits(jy)}`;
}

// ─── Language ───
function applyLanguage() {
    document.documentElement.lang = currentLang === 'fa' ? 'fa' : 'en';
    document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
    langToggle.textContent = currentLang === 'en' ? '🇮🇷 فارسی' : '🇬🇧 English';
    localStorage.setItem('lang', currentLang);
}

// ─── Load main data ───
async function loadMainData() {
    try {
        const res = await fetch('data.json');
        portfolioData = await res.json();
        applyLanguage();
        renderMainPage();
    } catch (err) {
        console.error(err);
        // Show a user-friendly message
        const msg = document.createElement('p');
        msg.style.color = 'red';
        msg.style.textAlign = 'center';
        msg.textContent = 'Error loading data. Please make sure you’re running a local server.';
        document.body.prepend(msg);
    }
}

// ─── Render main sections ───
function renderMainPage() {
    const data = portfolioData;
    const lang = currentLang;

    // i18n texts
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (data.i18n && data.i18n[key]) {
            el.textContent = data.i18n[key][lang] || data.i18n[key].en || el.textContent;
        }
    });

    // Hero
    const personal = data.personal?.[lang] || data.personal?.en;
    if (personal) {
        heroName.textContent = personal.name;
        heroRole.textContent = personal.role;
        heroTagsContainer.innerHTML = personal.heroTags.map(t =>
            `<span class="hero-tag"><span class="icon">${t.icon}</span> ${t.label}</span>`
        ).join('');
    }

    // Projects
    if (data.projects) {
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
        // Attach click listeners
        document.querySelectorAll('#projects-container .project-card').forEach(card => {
            card.addEventListener('click', () => openProjectModal(parseInt(card.dataset.id)));
        });
    }

    // Skills
    if (data.skills) {
        const skills = data.skills.map(s => (typeof s === 'object' ? s[lang] || s.en : s));
        skillsContainer.innerHTML = skills.map(s => `<span class="skill-chip">${s}</span>`).join('');
    }

    // Contact – email assembled safely
    const emailUser = data.contactEmail?.user || 'your.email';
    const emailDomain = data.contactEmail?.domain || 'example.com';
    const fullEmail = `${emailUser}@${emailDomain}`;

    contactEmailLabel.textContent = lang === 'en'
        ? `Let's collaborate — ${fullEmail}`
        : `همکاری — ${fullEmail}`;

    contactLocation.textContent = personal?.location || '';

    if (data.contactLinks) {
        contactLinksContainer.innerHTML = data.contactLinks.map(l => {
            const platform = l[lang === 'en' ? 'platformEn' : 'platformFa'] || l.platformEn;
            let url = l.url;
            if (platform.toLowerCase() === 'email' || url.startsWith('mailto:')) {
                url = `mailto:${fullEmail}`;
            }
            return `<a href="${url}" class="contact-link" target="_blank" rel="noopener">${l.icon} ${platform}</a>`;
        }).join('');
    }

    footerYear.textContent = new Date().getFullYear();
}

// ─── Section visibility ───
function showSection(target) {
    const allMainSections = [heroSection, worksSection, skillsSection];
    const blogVisible = blogSection && blogSection.style.display === 'block';
    const socialVisible = socialSection && socialSection.style.display === 'block';

    if (target === 'blog') {
        allMainSections.forEach(sec => sec.style.display = 'none');
        blogSection.style.display = 'block';
        socialSection.style.display = 'none';
        contactSection.style.display = 'block';
        if (postsIndex.length === 0) {
            fetchBlogIndex().then(() => renderBlogNextPosts());
        } else if (blogPostsContainer.children.length === 0) {
            blogDisplayedCount = 0;
            renderBlogNextPosts();
        }
    } else if (target === 'social') {
        allMainSections.forEach(sec => sec.style.display = 'none');
        socialSection.style.display = 'block';
        blogSection.style.display = 'none';
        contactSection.style.display = 'block';
        loadSocialSection();
    } else {
        // Show all main, hide blog/social
        heroSection.style.display = 'block';
        worksSection.style.display = 'block';
        skillsSection.style.display = 'block';
        contactSection.style.display = 'block';
        blogSection.style.display = 'none';
        socialSection.style.display = 'none';
    }
}

// ─── Blog fetching & rendering ───
async function fetchBlogIndex() {
    try {
        const res = await fetch('blog/index.json');
        postsIndex = await res.json();
        postsIndex.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (err) {
        blogPostsContainer.innerHTML = '<p style="color:red;">Failed to load blog posts.</p>';
    }
}

function renderBlogNextPosts() {
    const slice = postsIndex.slice(blogDisplayedCount, blogDisplayedCount + POSTS_PER_PAGE);
    if (slice.length === 0) {
        blogLoadMoreBtn.style.display = 'none';
        blogNoMoreMsg.style.display = 'block';
        return;
    }
    const lang = currentLang;
    slice.forEach(post => {
        const card = document.createElement('div');
        card.className = 'project-card blog-card';
        card.dataset.id = post.id;
        card.innerHTML = `
            <div class="project-icon">${post.icon || '📝'}</div>
            <div class="blog-meta">
                <span>${lang === 'fa' ? toJalali(post.date) : post.date}</span>
                <span>·</span>
                <span>${(post.readTime?.[lang]) || (post.readTime?.en) || ''}</span>
            </div>
            <h3>${(post.title?.[lang]) || (post.title?.en) || ''}</h3>
            <p>${(post.summary?.[lang]) || (post.summary?.en) || ''}</p>
            <div class="project-tech">${(post.tags || []).map(tag => `<span>${tag}</span>`).join('')}</div>
            <span class="project-link">${lang === 'en' ? 'Read more' : 'ادامه مطلب'} →</span>
        `;
        card.addEventListener('click', () => openBlogModal(post));
        blogPostsContainer.appendChild(card);
    });
    blogDisplayedCount += slice.length;
    if (blogDisplayedCount >= postsIndex.length) {
        blogLoadMoreBtn.style.display = 'none';
        blogNoMoreMsg.style.display = 'block';
    }
}

function resetBlogPosts() {
    blogPostsContainer.innerHTML = '';
    blogDisplayedCount = 0;
    blogLoadMoreBtn.style.display = 'inline-block';
    blogNoMoreMsg.style.display = 'none';
    if (postsIndex.length > 0) renderBlogNextPosts();
}

async function fetchSocialPosts() {
    try {
        const res = await fetch('social/index.json');
        allSocialPosts = await res.json();
        // Sort by date descending (just in case)
        allSocialPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (err) {
        socialPostsContainer.innerHTML = '<p style="color:red;">Failed to load social posts.</p>';
    }
}

function renderSocialNextPosts() {
    const slice = allSocialPosts.slice(socialDisplayedCount, socialDisplayedCount + SOCIAL_PER_PAGE);
    if (slice.length === 0) {
        socialLoadMoreBtn.style.display = 'none';
        socialNoMoreMsg.style.display = 'block';
        return;
    }

    const lang = currentLang;
    slice.forEach(post => {
        const card = document.createElement('div');
        card.className = 'social-card';
        card.innerHTML = `
            <div class="social-header">
                <span class="social-platform-icon">${post.icon || '📢'}</span>
                <span class="social-date">${lang === 'fa' ? toJalali(post.date) : post.date}</span>
            </div>
            <div class="social-content">${(post.content?.[lang]) || (post.content?.en) || ''}</div>
            <a href="${post.url}" class="social-link" target="_blank" rel="noopener">
                ${lang === 'en' ? 'View original' : 'مشاهده پست اصلی'} ↗
            </a>
        `;
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A') {
                window.open(post.url, '_blank');
            }
        });
        socialPostsContainer.appendChild(card);
    });

    socialDisplayedCount += slice.length;
    if (socialDisplayedCount >= allSocialPosts.length) {
        socialLoadMoreBtn.style.display = 'none';
        socialNoMoreMsg.style.display = 'block';
    }
}

function resetSocialPosts() {
    socialPostsContainer.innerHTML = '';
    socialDisplayedCount = 0;
    socialLoadMoreBtn.style.display = 'inline-block';
    socialNoMoreMsg.style.display = 'none';
    if (allSocialPosts.length > 0) {
        renderSocialNextPosts();
    }
}

// Initialize social section
async function loadSocialSection() {
    if (allSocialPosts.length === 0) {
        await fetchSocialPosts();
    }
    resetSocialPosts();
}

// ─── Modal: project ───
function openProjectModal(projectId) {
    const project = portfolioData.projects?.find(p => p.id === projectId);
    if (!project) return;
    const proj = project[currentLang] || project.en;
    if (modalIcon) modalIcon.textContent = project.icon;
    if (modalMeta) modalMeta.textContent = '';
    if (modalTitle) modalTitle.textContent = proj.title;
    if (modalBody) modalBody.innerHTML = proj.detailedDescription || proj.description;
    if (modalTech) modalTech.innerHTML = proj.tech.map(t => `<span>${t}</span>`).join('');
    const link = project.link;
    if (modalLink) {
        if (link && link !== '#') {
            modalLink.href = link;
            modalLink.textContent = currentLang === 'en' ? 'Learn more →' : 'اطلاعات بیشتر ←';
            modalLink.style.display = 'inline-flex';
        } else {
            modalLink.style.display = 'none';
        }
    }
    modalOverlay?.classList.add('active');
}

// ─── Modal: blog ───
async function openBlogModal(postMeta) {
    const postId = postMeta.id;
    if (!postsCache[postId]) {
        try {
            const res = await fetch(`blog/post-${postId}.json`);
            postsCache[postId] = await res.json();
        } catch (e) {
            if (modalBody) modalBody.innerHTML = '<p>Error loading article.</p>';
            return;
        }
    }
    const postData = postsCache[postId];
    if (modalIcon) modalIcon.textContent = postMeta.icon || '📝';
    if (modalMeta) modalMeta.textContent = `${currentLang === 'fa' ? toJalali(postMeta.date) : postMeta.date}  ·  ${(postData.readTime?.[currentLang]) || (postData.readTime?.en) || ''}`;
    if (modalTitle) modalTitle.textContent = (postData.title?.[currentLang]) || (postData.title?.en) || '';
    if (modalBody) modalBody.innerHTML = (postData.content?.[currentLang]) || (postData.content?.en) || '';
    if (modalTech) modalTech.innerHTML = '';
    if (modalLink) modalLink.style.display = 'none';
    modalOverlay?.classList.add('active');
}

function closeModal() {
    modalOverlay?.classList.remove('active');
}

// ─── Navigation ───
document.querySelectorAll('.nav-link, #nav-home').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.dataset.target || 'home';
        const blogVisible = blogSection && blogSection.style.display === 'block';
        const socialVisible = socialSection && socialSection.style.display === 'block';

        // Special handling for Contact while blog or social is visible
        if (target === 'contact' && (blogVisible || socialVisible)) {
            const contactEl = document.getElementById('contact-section');
            if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        showSection(target);

        if (target === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (target !== 'blog' && target !== 'social') {
            const section = document.getElementById(`${target}-section`);
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Scroll to blog or social section
            const section = document.getElementById(`${target}-section`);
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ─── Load More Buttons ───
blogLoadMoreBtn?.addEventListener('click', renderBlogNextPosts);
socialLoadMoreBtn?.addEventListener('click', renderSocialNextPosts);

// ─── Language toggle ───
langToggle?.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'fa' : 'en';
    applyLanguage();
    renderMainPage();
    if (blogSection?.style.display === 'block') resetBlogPosts();
    if (socialSection?.style.display === 'block') resetSocialPosts();
});

// ─── Modal close ───
modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) closeModal();
});

// ─── Start ───
loadMainData();