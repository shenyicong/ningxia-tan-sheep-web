/* ============================================
   我的滩羊手记 - 全站脚本 v2.0
============================================ */

/* ── 1. DOM 就绪 ── */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbar();
    initCategoryTabs();
    initGalleryFilter();
    initLightbox();
    initLoginRegister();
    initScrollAnimations();
    initCounterAnimation();
    initProgressBars();
});

/* ── 2. 暗色模式 ── */
function initTheme() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const saved = localStorage.getItem('theme') || 'light';
    applyTheme(saved);
    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
}

/* ── 3. 移动端导航 ── */
function initNavbar() {
    const toggle = document.querySelector('.menu-toggle');
    const links  = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.innerHTML = links.classList.contains('open')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });
    // 点击链接后关闭菜单
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    // 滚动时导航栏背景变深
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.style.boxShadow = window.scrollY > 40
            ? '0 4px 20px rgba(0,0,0,.35)'
            : '0 3px 15px rgba(0,0,0,.25)';
    });
}

/* ── 4. 分类标签（categories 页） ── */
function initCategoryTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    if (!tabs.length) return;
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.dataset.category;
            document.querySelectorAll('.notes-category').forEach(section => {
                if (cat === 'all' || section.id === cat) {
                    section.classList.remove('hidden');
                    section.style.animation = 'fadeInUp .5s ease both';
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });
}

/* ── 5. 图库筛选（gallery 页） ── */
function initGalleryFilter() {
    const btns  = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.gallery-item');
    if (!btns.length) return;
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.filter;
            items.forEach(item => {
                const show = cat === 'all' || item.dataset.category === cat;
                item.style.opacity    = show ? '1'   : '0';
                item.style.transform  = show ? 'scale(1)' : 'scale(.9)';
                item.style.display    = show ? ''    : 'none';
            });
        });
    });
}

/* ── 6. 灯箱（gallery 页） ── */
function initLightbox() {
    const box = document.getElementById('lightbox');
    if (!box) return;
    const boxImg     = box.querySelector('.lightbox-img');
    const boxCaption = box.querySelector('.lightbox-caption');
    const closeBtn   = box.querySelector('.lightbox-close');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img     = item.querySelector('img');
            const title   = item.querySelector('.gallery-info h3');
            const tagSpan = item.querySelector('.gallery-info span');
            boxImg.src = img.src;
            boxCaption.textContent = (title ? title.textContent : '') + (tagSpan ? ' · ' + tagSpan.textContent : '');
            box.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    function closeLightbox() {
        box.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    box.addEventListener('click', e => { if (e.target === box) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

/* ── 7. 登录 / 注册逻辑 ── */
function initLoginRegister() {
    const loginForm    = document.getElementById('communityForm');
    const registerForm = document.getElementById('registerForm');
    const contactForm  = document.getElementById('contactForm');
    const registerLink = document.getElementById('registerLink');
    const loginLink2   = document.getElementById('loginLink2');
    const logoutLink   = document.getElementById('logoutLink');
    const successBox   = document.getElementById('successToast');

    if (!loginForm && !registerForm) return;

    /* 切换表单 */
    function showForm(form) {
        [loginForm, registerForm, contactForm].forEach(f => f && (f.style.display = 'none'));
        if (form) form.style.display = 'block';
    }

    /* 启动时检查是否已登录 */
    const loggedUser = localStorage.getItem('blogUser');
    if (loggedUser && contactForm) showForm(contactForm);
    else if (loginForm) showForm(loginForm);

    if (registerLink) registerLink.addEventListener('click', e => { e.preventDefault(); showForm(registerForm); });
    if (loginLink2)   loginLink2.addEventListener('click', e  => { e.preventDefault(); showForm(loginForm);    });
    if (logoutLink)   logoutLink.addEventListener('click', e  => {
        e.preventDefault();
        localStorage.removeItem('blogUser');
        showForm(loginForm);
        toast('已成功退出登录');
    });

    /* 登录提交 */
    if (loginForm) loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const u = document.getElementById('username');
        const p = document.getElementById('password');
        clearErrors();
        let ok = true;
        if (!u.value.trim() || u.value.length < 3) {
            showError('usernameError', '用户名长度需 3-15 位'); ok = false;
        }
        if (!p.value || p.value.length < 8) {
            showError('passwordError', '密码至少 8 位'); ok = false;
        }
        if (!ok) return;
        localStorage.setItem('blogUser', u.value.trim());
        toast('登录成功！欢迎回来 👋');
        setTimeout(() => showForm(contactForm), 1200);
    });

    /* 注册提交 */
    if (registerForm) registerForm.addEventListener('submit', e => {
        e.preventDefault();
        const ru  = document.getElementById('regUsername');
        const re  = document.getElementById('regEmail');
        const rp  = document.getElementById('regPassword');
        const cp  = document.getElementById('confirmPassword');
        const ag  = document.getElementById('agreeTerms');
        clearErrors();
        let ok = true;
        if (!ru.value.trim() || ru.value.length < 3)  { showError('regUsernameError', '用户名 3-15 位'); ok = false; }
        if (!validateEmail(re.value))                   { showError('regEmailError',    '请输入有效邮箱'); ok = false; }
        if (rp.value.length < 8 || !/[a-zA-Z]/.test(rp.value) || !/[0-9]/.test(rp.value))
            { showError('regPasswordError', '密码至少 8 位，且须包含字母和数字'); ok = false; }
        if (rp.value !== cp.value) { showError('confirmPasswordError', '两次密码不一致'); ok = false; }
        if (!ag || !ag.checked)   { ok = false; }
        if (!ok) return;
        // 简单本地存储模拟注册
        const users = JSON.parse(localStorage.getItem('blogUsers') || '[]');
        if (users.find(x => x.u === ru.value.trim())) {
            showError('regUsernameError', '该用户名已被注册'); return;
        }
        users.push({ u: ru.value.trim(), e: re.value });
        localStorage.setItem('blogUsers', JSON.stringify(users));
        localStorage.setItem('blogUser', ru.value.trim());
        toast('注册成功！欢迎加入探索 🎉');
        setTimeout(() => showForm(contactForm), 1400);
    });

    /* 留言提交 */
    if (contactForm) contactForm.addEventListener('submit', e => {
        e.preventDefault();
        toast('消息已发送！我会尽快回复你 ✉️');
        contactForm.reset();
    });

    /* 密码强度检测 */
    const regPwd = document.getElementById('regPassword');
    const fill   = document.querySelector('.strength-fill');
    const text   = document.querySelector('.strength-text');
    if (regPwd && fill && text) {
        regPwd.addEventListener('input', () => {
            const v   = regPwd.value;
            let score = 0;
            if (v.length >= 8)  score++;
            if (/[A-Z]/.test(v)) score++;
            if (/[0-9]/.test(v)) score++;
            if (/[^A-Za-z0-9]/.test(v)) score++;
            const levels = [
                { w:'0%',   bg:'transparent', label:'' },
                { w:'25%',  bg:'#e74c3c',     label:'弱' },
                { w:'50%',  bg:'#e67e22',     label:'中' },
                { w:'75%',  bg:'#f1c40f',     label:'强' },
                { w:'100%', bg:'#27ae60',     label:'非常强' },
            ];
            fill.style.width      = levels[score].w;
            fill.style.background = levels[score].bg;
            text.textContent      = levels[score].label ? '密码强度：' + levels[score].label : '';
        });
    }

    /* 实时验证 */
    setupRealTimeValidation();
}

function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
}
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => (el.textContent = ''));
}
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function toast(msg) {
    const box = document.getElementById('successToast');
    if (!box) return;
    box.querySelector('.toast-msg').textContent = msg;
    box.style.display = 'block';
    setTimeout(() => (box.style.display = 'none'), 3000);
}
function setupRealTimeValidation() {
    const fields = {
        username:        { min:3, max:15, pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, errId:'usernameError', label:'用户名 3-15 位字母/数字' },
        regUsername:     { min:3, max:15, pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, errId:'regUsernameError', label:'用户名 3-15 位' },
    };
    Object.entries(fields).forEach(([id, rule]) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => {
            const v = el.value.trim();
            const ok = v.length >= rule.min && v.length <= rule.max && rule.pattern.test(v);
            el.classList.toggle('valid',   ok);
            el.classList.toggle('invalid', !ok && v.length > 0);
            const err = document.getElementById(rule.errId);
            if (err) err.textContent = (!ok && v.length > 0) ? rule.label : '';
        });
    });
}

/* ── 8. 滚动入场动画 ── */
function initScrollAnimations() {
    const targets = document.querySelectorAll(
        '.note-card, .article-item, .origin-card, .gear-item, .gallery-item, .project-card, .timeline-item'
    );
    if (!targets.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animationDelay = '0s';
                    entry.target.classList.add('animate-in');
                }, i * 80);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    targets.forEach(el => io.observe(el));
}

/* ── 9. 数字计数动画（首页统计） ── */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-num[data-target]');
    if (!counters.length) return;
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = +el.dataset.target;
            const suffix = el.dataset.suffix || '';
            let current  = 0;
            const step   = Math.ceil(target / 60);
            const timer  = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current + suffix;
            }, 25);
            io.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
}

/* ── 10. 进度条动画 ── */
function initProgressBars() {
    const bars = document.querySelectorAll('.progress-fill[data-width]');
    if (!bars.length) return;
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.style.width = entry.target.dataset.width;
            io.unobserve(entry.target);
        });
    }, { threshold: 0.3 });
    bars.forEach(b => { b.style.width = '0'; io.observe(b); });
}
