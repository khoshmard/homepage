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
// Media modal state
let currentMediaIndex = 0;
let currentMediaItems = [];

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

const iconMap = {
    email: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
        nameEn: 'Email',
        nameFa: 'رایانامه',
        color: '#ea4335'
    },
    linkedin: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
        nameEn: 'LinkedIn',
        nameFa: 'لینکدین',
        color: '#0A66C2'
    },
    github: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
        nameEn: 'GitHub',
        nameFa: 'گیت‌هاب',
        color: '#8534f3'
    },
    twitter: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
        nameEn: 'X / Twitter',
        nameFa: 'ایکس/توییتر',
        color: '#ea4335'
    },
    resume: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
        nameEn: 'Resume',
        nameFa: 'رزومه',
        color: '#fd79a8'
    },
    virasty: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><linearGradient id="a" x1="50%" x2="50%" y1="99%"><stop stop-color="#1c9df0"/><stop offset="99%" stop-color="#1cc7f0"/></linearGradient><linearGradient id="b" x1="50%" x2="50%" y1="99%"><stop stop-color="#1c9df0"/><stop offset="99%" stop-color="#1caaef"/></linearGradient><g stroke="#FEFEFE" stroke-width=".8"><circle cx="12" cy="12" r="11.6" fill="url(#a)"/><path fill="url(#b)" d="M12 15.4H4q-2.7-.1-3 2.7v5.5h11"/><path fill="none" stroke-linecap="round" stroke-width=".25" d="M1 21.7q1-2.2 3-2.3h3"/><g fill="#0F1318"><circle cx="12" cy="12" r="3.4"/><path d="M23.6 2.5q-.1-2-2.1-2.1h-5.3v4.7q.2 2.6 2.8 2.8h4.6z"/></g><path d="M23.6 8v4M16 .4h-4"/></g><path fill="#333739" d="M23.2 7.4V2.6q0-.9-.5-1.3l-5.5 5.5q.6.6 1.8.7"/><path stroke="#1CB5F0" d="M22.7 12V8.3"/><path stroke="#1CC7F0" d="M12 1.3h3.8"/></svg>`,
        nameEn: 'Virasty',
        nameFa: 'ویراستی',
        color: '#1c9df0'
    },
    eitaa: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="currentColor"><path transform="translate(0.01414, 0.00909) scale(0.0468451)" d="m127.317 510.763a141.312 141.312 0 0 1 -49.749-17.707c-34.56-19.819-60.352-55.317-68.629-94.421-3.221-15.296-3.627-34.624-3.2-153.749.405-128.193.106-121.579 6.208-142.699 3.029-10.517 11.456-28.587 17.557-37.696 22.507-33.494 55.616-54.998 96.64-62.784 8.192-1.557 20.053-1.707 129.195-1.707 133.355 0 128.96-.192 150.741 6.699a145.216 145.216 0 0 1 92.032 89.259c7.04 19.989 7.381 23.189 7.872 75.84l.427 47.573-8.341 5.717c-11.904 8.128-27.52 22.613-49.408 45.867-25.216 26.795-50.688 51.627-63.616 62.016-27.925 22.421-53.504 35.221-79.488 39.765-13.525 2.347-35.883 1.429-49.109-2.027-11.797-3.072-11.029-3.584-15.488 9.899a135.573 135.573 0 0 0 -6.784 32.981l-.661 8.683-3.115-.64c-25.92-5.141-51.605-27.413-61.525-53.333a76.437 76.437 0 0 1 -5.547-26.005l-.341-7.253-6.592-6.059c-13.739-12.587-22.677-27.989-25.493-43.968-4.523-25.451 7.253-54.229 32.811-80.128 26.965-27.371 66.709-48.853 105.664-57.173 14.037-2.987 38.784-3.776 51.264-1.6 24.277 4.224 44.096 16.491 56.427 34.965 3.883 5.781 4.16 6.613 3.776 11.84a17.323 17.323 0 0 1 -3.904 10.517c-9.92 13.888-39.424 28.757-71.168 35.84-56 12.48-91.605-3.029-86.037-37.525.555-3.477.853-6.485.661-6.677-.683-.683-6.251 2.219-12.267 6.4-10.219 7.125-19.264 20.992-22.4 34.283-.768 3.328-1.067 8.661-.725 13.867.427 7.061 1.131 9.685 4.096 15.701 1.963 3.968 5.867 9.6 8.704 12.565l5.12 5.355-2.048 2.603a103.36 103.36 0 0 0 -14.443 25.963 77.547 77.547 0 0 0 -2.24 38.72c2.197 9.835 8.981 23.36 15.765 31.317 5.163 6.08 17.003 16.299 18.901 16.299.512 0 .939-1.024.939-2.261.021-4.907 3.925-20.757 6.955-28.309 9.024-22.571 28.821-41.813 60.16-58.453 5.227-2.773 20.309-10.027 33.536-16.149 29.013-13.44 44.864-21.653 53.568-27.84 25.088-17.771 40.597-44.053 45.653-77.333 1.835-12.16 1.835-34.859 0-47.083-7.851-52.011-46.827-87.381-102.784-93.227-62.4-6.549-141.824 41.664-190.763 115.776-23.808 36.053-39.893 76.053-46.656 116.117-2.624 15.531-3.605 44.373-1.984 58.667 4.117 36.352 17.536 65.664 40.597 88.661a139.328 139.328 0 0 0 39.893 28.011c50.517 24.107 106.453 24.64 155.627 1.515 21.248-10.005 42.112-25.515 64.491-48 21.76-21.867 36.48-40.107 76.629-95.104 22.187-30.357 39.765-50.517 48.469-55.573l3.2-1.835-.405 65.941c-.384 63.851-.469 66.283-2.624 75.968-12.8 57.131-54.187 98.901-110.827 111.829l-9.984 2.283-123.2.213c-100.992.171-124.8-.043-132.053-1.195z" /></svg>`,
        nameEn: 'Eitaa',
        nameFa: 'ایتا',
        color: '#e37600'
    },
    bale: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11.425 23.987a12.218 12.218 0 0 1-2.95-.514 6.578 6.578 0 0 0-.336-.116C4.936 22.303 2.22 19.763.913 16.599a11.92 11.92 0 0 1-.9-4.063C.005 12.377.001 10.246 0 6.74 0 .71-.005 1.137.07.903.23.394.673.05 1.224.005c.421-.034.7.088 1.603.699.562.38 1.119.78 1.796 1.289.315.237.353.261.376.247l.35-.23c.58-.381 1.11-.677 1.7-.945A11.913 11.913 0 0 1 9.766.21a11.19 11.19 0 0 1 2.041-.2c1.14-.016 2.077.091 3.152.36 3.55.888 6.538 3.411 8.028 6.78.492 1.113.845 2.43.945 3.522.033.366.039.43.053.611.008.105.015.406.015.669 0 .783-.065 1.57-.169 2.064a5.474 5.474 0 0 0-.046.26c-.056.378-.214.987-.399 1.535-.205.613-.367.999-.684 1.633a11.95 11.95 0 0 1-2.623 3.436c-.44.396-.829.705-1.26 1.003-.647.445-1.307.812-2.039 1.134-.6.265-1.44.539-2.101.686a11.165 11.165 0 0 1-1.178.202 12.28 12.28 0 0 1-2.076.082zm-.61-5.92c.294-.06.678-.209.864-.337.144-.099.428-.376 2.064-2.013a161.8 161.8 0 0 1 1.764-1.753c.017 0 1.687-1.67 1.687-1.689 0-.02 1.64-1.648 1.661-1.648.01 0 .063-.047.118-.106.467-.495.682-.957.716-1.547.026-.433-.06-.909-.217-1.196a2.552 2.552 0 0 0-.983-1.024c-.281-.163-.512-.233-.888-.27-.306-.031-.688 0-.948.075-.243.07-.603.274-.853.481-.042.035-1.279 1.265-2.748 2.733l-2.671 2.67-1.093-1.09c-.6-.6-1.12-1.114-1.155-1.142a2.419 2.419 0 0 0-1.338-.51c-.404-.013-.91.09-1.224.25a2.89 2.89 0 0 0-.659.526c-.108.12-.287.357-.29.385-.003.03-.009.044-.065.16a2.312 2.312 0 0 0-.224.91c-.011.229-.01.265.019.491.045.353.24.781.51 1.115.05.063.97.992 2.044 2.064 1.507 1.505 1.98 1.97 2.074 2.039.327.24.683.388 1.101.456.182.03.5.016.734-.03z"/></svg>`,
        nameEn: 'Bale',
        nameFa: 'بله',
        color: '#4cebb4'
    }
};

function getIconSVG(iconKey, size = 20, color = null) {
    const icon = iconMap[iconKey];
    if (!icon) return ''; // fallback to nothing or an emoji
    let svg = icon.svg
        .replace(/width="[^"]*"/, `width="${size}"`)
        .replace(/height="[^"]*"/, `height="${size}"`);
    if (color) {
        svg = svg.replace(/fill="currentColor"/, `fill="${color}"`);
    }
    return svg;
}

// ─── Load main data ───
async function loadMainData() {
    try {
        const res = await fetch('data.json');
        portfolioData = await res.json();
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
    setLanguage(currentLang);
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
            const iconSvg = getIconSVG(l.iconKey, 18, iconMap[l.iconKey]?.color || 'currentColor');
            return `
                <a href="${url}" class="contact-link" target="_blank" rel="noopener">
                    <span class="contact-icon">${iconSvg}</span> ${platform}
                </a>`;
        }).join('');
    }
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
        const card = document.createElement('a');
        const postUrl = `blog/post-${post.id}.html`;   // static file URL
        card.href = postUrl;
        card.className = 'project-card blog-card';
        card.dataset.id = post.id;
        card.style = 'text-decoration: none; color: inherit; display: flex; flex-direction: column; gap: 14px;';
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
        card.addEventListener('click', (e) => {
            e.preventDefault();
            openBlogModal(post);
        });
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

// Highlight hashtags
function highlightHashtags(text) {
    if (!text) return '';
    // Matches: #word including Persian letters, numbers, underscores
    return text.replace(/(#[\w\u0600-\u06FF]+)/g, '<span class="hashtag">$1</span>');
}

// Get filtered social posts for current language
function getFilteredSocialPosts() {
    return allSocialPosts.filter(post => {
        const content = post.content?.[currentLang];
        const hasContent = (typeof content === 'string' && content.trim() !== '') ||
            (Array.isArray(content) && content.some(line => line.trim() !== ''));
        const hasMedia = post.media && post.media.length > 0;
        return hasContent || (hasMedia && !post.content?.en && !post.content?.fa);
    });
}

function filterMediaByLanguage(mediaItems, lang) {
    if (!mediaItems || !mediaItems.length) return [];
    return mediaItems.filter(item => {
        // If no caption object at all, show in all languages
        if (!item.caption) return true;
        // If caption object is empty, show in all languages
        if (typeof item.caption === 'object' && !item.caption.en && !item.caption.fa) return true;
        // Otherwise, require the caption to exist (non‑empty) in the current language
        const captionForLang = item.caption[lang];
        return captionForLang && captionForLang.trim() !== '';
    });
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
    const filtered = getFilteredSocialPosts();
    const slice = filtered.slice(socialDisplayedCount, socialDisplayedCount + SOCIAL_PER_PAGE);
    if (slice.length === 0) {
        socialLoadMoreBtn.style.display = 'none';
        socialNoMoreMsg.style.display = 'block';
        return;
    }

    const lang = currentLang;
    slice.forEach(post => {
        const platform = post.platform || 'twitter';
        const platformData = iconMap[platform];
        const contentArray = post.content?.[lang] || post.content?.en || '';
        const contentText = Array.isArray(contentArray) ? contentArray.join('<br>') : contentArray;
        const textHtml = contentText ? `<div class="social-content">${highlightHashtags(contentText)}</div>` : '';

        // Filter media for the current language
        const visibleMedia = post.media ? filterMediaByLanguage(post.media, lang) : [];
        if (!contentText && visibleMedia.length === 0) return;  // skip rendering this post

        const card = document.createElement('div');
        card.className = `social-card ${platform}`;   // adds class for color border
        if (post.media && post.media.length > 0 && !(post.content?.[lang] || post.content?.en)) {
            card.classList.add('media-only');
        }

        // Build media gallery HTML (thumbnails)
        let mediaHtml = '';
        if (visibleMedia && visibleMedia.length) {
            const mediaItems = visibleMedia.slice(0, 3);   // show first 3 thumbnails
            const remaining = visibleMedia.length - 3;
            mediaHtml = `<div class="social-media-gallery">
                ${mediaItems.map(m => {
                if (m.type === 'image') {
                    return `<img src="${m.url}" alt="${m.alt || ''}" loading="lazy" class="social-thumb" data-index="${mediaItems.indexOf(m)}">`;
                } else {
                    return `<div class="social-thumb video-thumb" data-index="${mediaItems.indexOf(m)}" style="background-image:url(${m.thumbnail || ''})">
                            <span class="play-icon">▶</span>
                        </div>`;
                }
            }).join('')}
                ${remaining > 0 ? `<div class="social-thumb more-overlay">+${remaining}</div>` : ''}
            </div>`;
        }

        card.innerHTML = `
            <div class="social-header">
                <span class="social-platform-icon" style="color:${platformData.color}">
                    ${getIconSVG(post.platform, 20, platformData.color)}
                </span>
                <span class="social-platform-name">(${lang === 'fa' ? platformData.nameFa : platformData.nameEn})</span>
                <span class="social-date">${lang === 'fa' ? toJalali(post.date) : post.date}</span>
            </div>
            ${textHtml}
            ${mediaHtml}
            <a href="${post.url}" class="social-link" target="_blank" rel="noopener">
                ${lang === 'en' ? 'View original' : 'مشاهده پست اصلی'} ↗
            </a>
        `;

        // Attach click handlers for media
        const thumbnails = card.querySelectorAll('.social-thumb, .more-overlay');
        thumbnails.forEach((thumb, idx) => {
            thumb.addEventListener('click', (e) => {
                e.stopPropagation(); // don't open original link
                if (thumb.classList.contains('more-overlay')) {
                    // Show first of remaining images
                    openMediaModal(post, 3);
                } else {
                    const index = parseInt(thumb.getAttribute('data-index'), 10);
                    openMediaModal(post, index);
                }
            });
        });

        // If media-only, the whole card click opens media (not the original link)
        if (card.classList.contains('media-only')) {
            card.addEventListener('click', (e) => {
                // Only if click is not on the "View original" link
                if (!e.target.closest('.social-link')) {
                    openMediaModal(post, 0);
                }
            });
        }

        socialPostsContainer.appendChild(card);
    });

    socialDisplayedCount += slice.length;
    if (socialDisplayedCount >= filtered.length) {
        socialLoadMoreBtn.style.display = 'none';
        socialNoMoreMsg.style.display = 'block';
    }
}

function resetSocialPosts() {
    socialPostsContainer.innerHTML = '';
    socialDisplayedCount = 0;
    const filtered = getFilteredSocialPosts();
    if (filtered.length === 0) {
        socialLoadMoreBtn.style.display = 'none';
        socialNoMoreMsg.style.display = 'block';
        socialNoMoreMsg.textContent = currentLang === 'en' ? 'No posts available.' : 'پستی موجود نیست.';
        return;
    }
    socialLoadMoreBtn.style.display = 'inline-block';
    socialNoMoreMsg.style.display = 'none';
    renderSocialNextPosts();   // will use filtered list inside
}

// Initialize social section
async function loadSocialSection() {
    if (allSocialPosts.length === 0) {
        await fetchSocialPosts();
    }
    resetSocialPosts();
}

// ─── Media Lightbox ───
function openMediaModal(post, index) {
    currentMediaItems = post.media ? filterMediaByLanguage(post.media, currentLang) : [];
    if(currentMediaItems.length === 0) return;
    currentMediaIndex = index;
    showMediaItem(currentMediaIndex);

    // Hide other modal elements (title, body, tech)
    if (modalIcon) modalIcon.style.display = 'none';
    if (modalMeta) modalMeta.style.display = 'none';
    if (modalTitle) modalTitle.style.display = 'none';
    if (modalBody) modalBody.style.display = 'none';
    if (modalTech) modalTech.style.display = 'none';
    if (modalLink) modalLink.style.display = 'none';

    const mediaContainer = document.getElementById('modal-media');
    if (mediaContainer) mediaContainer.style.display = 'flex';
    modalOverlay?.classList.add('active');
}

function showMediaItem(index) {
    const mediaItem = currentMediaItems[index];
    if (!mediaItem) return;

    const mediaContent = document.getElementById('media-content');
    const caption = document.getElementById('media-caption');
    if (!mediaContent || !caption) return;

    // Clear previous content
    mediaContent.innerHTML = '';

    // Caption (bilingual)
    const lang = currentLang;
    const captionText = (mediaItem.caption?.[lang]) || (mediaItem.caption?.en) || '';
    caption.textContent = captionText;

    if (mediaItem.type === 'image') {
        const img = document.createElement('img');
        img.src = mediaItem.url;
        img.alt = mediaItem.alt || '';
        img.loading = 'lazy';
        mediaContent.appendChild(img);
    } else if (mediaItem.type === 'video') {
        // If it's a YouTube/Vimeo URL, embed iframe; else use <video>
        if (mediaItem.url.includes('youtube.com/embed') || mediaItem.url.includes('vimeo.com/video')) {
            const iframe = document.createElement('iframe');
            iframe.src = mediaItem.url;
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('allow', 'autoplay; encrypted-media');
            mediaContent.appendChild(iframe);
        } else {
            const video = document.createElement('video');
            video.src = mediaItem.url;
            video.controls = true;
            video.style.maxWidth = '100%';
            video.style.maxHeight = '60vh';
            mediaContent.appendChild(video);
        }
    }

    // Arrow visibility
    const prevBtn = document.getElementById('media-prev');
    const nextBtn = document.getElementById('media-next');
    if (prevBtn) prevBtn.style.display = (currentMediaItems.length > 1 && index > 0) ? 'block' : 'none';
    if (nextBtn) nextBtn.style.display = (currentMediaItems.length > 1 && index < currentMediaItems.length - 1) ? 'block' : 'none';
}

function closeMediaModal() {
    const mediaContainer = document.getElementById('modal-media');
    if (mediaContainer) mediaContainer.style.display = 'none';
    // Restore modal elements (they stay hidden, but next project modal will show them)
    modalOverlay?.classList.remove('active');
    // Clean up any video playback
    const mediaContent = document.getElementById('media-content');
    if (mediaContent) mediaContent.innerHTML = '';
}

// Arrow navigation
document.getElementById('media-prev')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentMediaIndex > 0) {
        currentMediaIndex--;
        showMediaItem(currentMediaIndex);
    }
});
document.getElementById('media-next')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentMediaIndex < currentMediaItems.length - 1) {
        currentMediaIndex++;
        showMediaItem(currentMediaIndex);
    }
});

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
    // Also close media modal if active
    if (document.getElementById('modal-media')?.style.display !== 'none') {
        closeMediaModal();
    }
    // Restore modal elements visibility for next project modal
    if (modalIcon) modalIcon.style.display = '';
    if (modalMeta) modalMeta.style.display = '';
    if (modalTitle) modalTitle.style.display = '';
    if (modalBody) modalBody.style.display = '';
    if (modalTech) modalTech.style.display = '';
    if (modalLink) modalLink.style.display = '';
}

// ─── Navigation ───
// Delegated navigation handler (works with dynamically added navbar)
document.addEventListener('click', e => {
    const link = e.target.closest('.nav-link, #nav-home');
    if (!link) return;
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
        const section = document.getElementById(`${target}-section`);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
});

// ─── Load More Buttons ───
blogLoadMoreBtn?.addEventListener('click', renderBlogNextPosts);
socialLoadMoreBtn?.addEventListener('click', renderSocialNextPosts);

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