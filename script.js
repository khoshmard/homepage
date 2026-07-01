// ─── Global state ───
let currentLang = localStorage.getItem('lang') || 'en';
let portfolioData = {};
let postsIndex = [];
let postsCache = {};
let blogDisplayedCount = 0;
const POSTS_PER_PAGE = 3;

// ─── DOM elements ───
const langToggle = document.getElementById('lang-toggle');
const heroSection = document.getElementById('hero-section');
const worksSection = document.getElementById('works-section');
const blogSection = document.getElementById('blog-section');
const skillsSection = document.getElementById('skills-section');
const contactSection = document.getElementById('contact-section');
const projectsContainer = document.getElementById('projects-container');
const blogPostsContainer = document.getElementById('blog-posts-container');
const blogLoadMoreBtn = document.getElementById('blog-load-more');
const blogNoMoreMsg = document.getElementById('blog-no-more');
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
        msg.textContent = 'Error loading data. Please make sure you’re running a local server (e.g. npx serve .).';
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
    if (target === 'blog') {
        // Hide hero, works, skills – keep blog and contact visible
        allMainSections.forEach(sec => sec.style.display = 'none');
        blogSection.style.display = 'block';
        contactSection.style.display = 'block';
        // Load blog posts if not already loaded
        if (postsIndex.length === 0) {
            fetchBlogIndex().then(() => renderBlogNextPosts());
        } else if (blogPostsContainer.children.length === 0) {
            blogDisplayedCount = 0;
            renderBlogNextPosts();
        }
    } else {
        // Show all main sections, hide blog
        heroSection.style.display = 'block';
        worksSection.style.display = 'block';
        skillsSection.style.display = 'block';
        contactSection.style.display = 'block';
        blogSection.style.display = 'none';
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
                <span>${post.date}</span>
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
    if (modalMeta) modalMeta.textContent = `${postMeta.date}  ·  ${(postData.readTime?.[currentLang]) || (postData.readTime?.en) || ''}`;
    if (modalTitle) modalTitle.textContent = (postData.title?.[currentLang]) || (postData.title?.en) || '';
    if (modalBody) modalBody.innerHTML = (postData.content?.[currentLang]) || (postData.content?.en) || '';
    if (modalTech) modalTech.innerHTML = '';
    if (modalLink) modalLink.style.display = 'none';
    modalOverlay?.classList.add('active');
}

function closeModal() {
    modalOverlay?.classList.remove('active');
}

// ─── Event listeners ───
blogLoadMoreBtn?.addEventListener('click', renderBlogNextPosts);

// ─── Navigation handling (with special blog-aware Contact behavior) ───
document.querySelectorAll('.nav-link, #nav-home').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.dataset.target || 'home';

        const blogVisible = blogSection && blogSection.style.display === 'block';
        if (target === 'contact' && blogVisible) {
            const contactEl = document.getElementById('contact-section');
            if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        showSection(target);

        if (target === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (target !== 'blog') {
            const section = document.getElementById(`${target}-section`);
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        } else {
            blogSection?.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

langToggle?.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'fa' : 'en';
    applyLanguage();
    renderMainPage();
    if (blogSection?.style.display === 'block') resetBlogPosts();
});

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) closeModal();
});

// ─── Start ───
loadMainData();