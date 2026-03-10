/* ====================================================
   CHAJOY — Global Scripts v2
   ==================================================== */

// THEME
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById("themeBtn");
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    if (btn) btn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
    localStorage.setItem("cj-theme", isDark ? "dark" : "light");
}

function applySavedTheme() {
    const saved = localStorage.getItem("cj-theme");
    const btn = document.getElementById("themeBtn");
    if (saved === "dark") {
        document.body.classList.add("dark");
        if (btn) btn.textContent = "☀️ Light";
    }
}

// HAMBURGER
function initHamburger() {
    const hb = document.querySelector('.hamburger');
    const nl = document.querySelector('.nav-links');
    if (!hb || !nl) return;
    hb.addEventListener('click', () => {
        hb.classList.toggle('open');
        nl.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav')) {
            hb.classList.remove('open');
            nl.classList.remove('open');
        }
    });
}

// ACTIVE NAV LINK
function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === path || (path === '' && href === 'index.html')) {
            a.classList.add('active');
        }
    });
}

// SCROLL REVEAL
function initReveal() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('vis'), i * 70);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// LOCATION STATUS
function updateLocationStatus() {
    function toMins(h, m) { return h * 60 + m; }
    const now = new Date();
    const dhaka = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const cur = dhaka.getHours() * 60 + dhaka.getMinutes();

    const bEl = document.getElementById("baddaStatus");
    if (bEl) {
        const open = cur >= toMins(10, 0) && cur < toMins(23, 0);
        bEl.textContent = open ? "OPEN NOW" : "CLOSED";
        bEl.className = "status-pill " + (open ? "open" : "closed");
    }
    const mEl = document.getElementById("mirpurStatus");
    if (mEl) {
        const open = cur >= toMins(11, 0) && cur < toMins(22, 0);
        mEl.textContent = open ? "OPEN NOW" : "CLOSED";
        mEl.className = "status-pill " + (open ? "open" : "closed");
    }
}

// MENU FILTER
function initMenuFilter() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.menu-card[data-tags]');
    if (!btns.length) return;
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            cards.forEach(card => {
                const tags = card.dataset.tags || '';
                const show = filter === 'all' || tags.includes(filter);
                card.style.display = show ? '' : 'none';
                if (show) card.style.animation = 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both';
            });
        });
    });
}

// QUIZ
const quizData = [
    {
        question: "What's your current mood? 🤔",
        options: [
            { label: "🍓 Sweet & fruity", value: "fruity" },
            { label: "🍫 Rich & indulgent", value: "rich" },
            { label: "🧊 Cool & refreshing", value: "refreshing" },
            { label: "🍵 Warm & cozy", value: "cozy" }
        ]
    },
    {
        question: "Pick your ideal texture:",
        options: [
            { label: "🍨 Creamy smooth", value: "creamy" },
            { label: "🧋 Chewy pearls", value: "chewy" },
            { label: "🫧 Light & airy", value: "light" },
            { label: "🍦 Soft serve", value: "soft" }
        ]
    },
    {
        question: "Choose your vibe:",
        options: [
            { label: "☀️ Fun & playful", value: "playful" },
            { label: "🌙 Calm & chill", value: "calm" },
            { label: "🎉 Celebratory", value: "celebratory" },
            { label: "💪 Energy boost", value: "energy" }
        ]
    }
];

const quizResults = {
    fruity: { name: "Blueberry Fruit Tea", emoji: "🫐", desc: "Bright, tangy, naturally sweet — just like your energy!" },
    rich: { name: "Brown Sugar Boba Sundae", emoji: "🍮", desc: "Deep caramel warmth with chewy boba magic." },
    refreshing: { name: "Lychee Fruit Tea", emoji: "🍈", desc: "Delicate, floral, perfectly chilled." },
    cozy: { name: "Taro Milk Tea", emoji: "💜", desc: "Velvety earthy taro that feels like a hug in a cup." },
    creamy: { name: "Strawberry Sundae", emoji: "🍓", desc: "Luscious vanilla base with real strawberry drizzle." },
    chewy: { name: "Brown Sugar Boba Sundae", emoji: "🍮", desc: "Warm chewy pearls meet cold creamy bliss." },
    soft: { name: "Strawberry Sundae", emoji: "🍓", desc: "Light, dreamy, and undeniably delicious." },
    default: { name: "Captain's Special", emoji: "🐧", desc: "Our mascot's personal favourite — a secret delight!" }
};

let quizAnswers = [], currentQ = 0;

function initQuiz() {
    if (!document.getElementById('quiz')) return;
    renderQuiz();
}

function renderQuiz() {
    const el = document.getElementById('quiz');
    if (!el) return;
    if (currentQ >= quizData.length) { showResult(); return; }
    const q = quizData[currentQ];
    const progress = quizData.map((_, i) => `<div class="qp-dot ${i <= currentQ ? 'on' : ''}"></div>`).join('');
    el.innerHTML = `
        <div class="quiz-progress">${progress}</div>
        <div class="quiz-q">${q.question}</div>
        <div class="quiz-opts">
            ${q.options.map(o => `<button class="quiz-opt" onclick="selectAnswer('${o.value}')">${o.label}</button>`).join('')}
        </div>`;
}

function selectAnswer(value) {
    quizAnswers.push(value);
    currentQ++;
    setTimeout(renderQuiz, 180);
}

function showResult() {
    const el = document.getElementById('quiz');
    const key = quizAnswers[0] || 'default';
    const r = quizResults[key] || quizResults.default;
    el.innerHTML = `
        <div class="quiz-result">
            <span class="result-emoji">${r.emoji}</span>
            <div class="result-name">${r.name}</div>
            <p class="result-desc">${r.desc}</p>
            <div class="coupon">🎉 Show this for 10% OFF your first order!</div><br>
            <button class="quiz-restart" onclick="restartQuiz()">Try Again ↺</button>
        </div>`;
}

function restartQuiz() {
    quizAnswers = [];
    currentQ = 0;
    renderQuiz();
}

// COUNTER ANIMATION
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 55);
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current + suffix;
            if (current >= target) clearInterval(timer);
        }, 22);
    });
}

// PARALLAX HERO
function initParallax() {
    const bg = document.querySelector('.hero-bg');
    if (!bg) return;
    window.addEventListener('scroll', () => {
        bg.style.transform = `scale(1.06) translateY(${window.scrollY * 0.28}px)`;
    }, { passive: true });
}

// NAV SHADOW ON SCROLL
function initNavScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.style.boxShadow = window.scrollY > 30 ? '0 4px 24px rgba(0,0,0,0.08)' : '';
    }, { passive: true });
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
    applySavedTheme();
    initHamburger();
    setActiveNav();
    initReveal();
    updateLocationStatus();
    setInterval(updateLocationStatus, 60000);
    initMenuFilter();
    initQuiz();
    initParallax();
    initNavScroll();

    // Counter animation
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        const obs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
        }, { threshold: 0.4 });
        obs.observe(statsBar);
    }

    // Hero bg initial scale
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) setTimeout(() => { heroBg.style.transform = 'scale(1)'; }, 80);
});
