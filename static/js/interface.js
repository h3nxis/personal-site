(function () {
    const root = document.documentElement;
    const scrollButton = document.querySelector('.scroll-top');
    let lastY = 0;

    function updateScrollState() {
        const y = window.scrollY || 0;
        root.style.setProperty('--dot-y', `${y * -0.08}px`);
        document.body.classList.toggle('is-scrolled', y > 24);

        // تشخیص جهت اسکرول برای auto-hide هدر
        if (Math.abs(y - lastY) > 6) {
            if (y > lastY && y > 120) {
                // اسکرول رو به پایین → هدر جمع می‌شود
                document.body.classList.add('scroll-down');
                document.body.classList.remove('scroll-up');
            } else {
                // اسکرول رو به بالا یا نزدیک بالای صفحه → هدر برمی‌گردد
                document.body.classList.add('scroll-up');
                document.body.classList.remove('scroll-down');
            }
        }
        if (y <= 24) {
            document.body.classList.remove('scroll-down', 'scroll-up');
        }
        lastY = y;

        if (scrollButton) {
            scrollButton.classList.toggle('is-visible', y > 420);
        }
    }

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    window.addEventListener('pointermove', function (event) {
        root.style.setProperty('--mouse-x', `${event.clientX}px`);
        root.style.setProperty('--mouse-y', `${event.clientY}px`);
    }, { passive: true });

    if (scrollButton) {
        scrollButton.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
})();


// True seamless marquee: the first chip is always attached to the last chip.
(function () {
    const marquees = document.querySelectorAll('.marquee');
    if (!marquees.length) return;

    function cloneChip(chip) {
        const clone = chip.cloneNode(true);
        clone.setAttribute('tabindex', '0');
        return clone;
    }

    function setupMarquee(marquee) {
        const track = marquee.querySelector('.marquee-track');
        if (!track) return;

        if (!marquee._sourceItems) {
            const firstGroup = track.querySelector('.marquee-group');
            if (!firstGroup) return;
            marquee._sourceItems = Array.from(firstGroup.querySelectorAll('.marquee-item'))
                .map((item) => item.cloneNode(true));
        }

        const sourceItems = marquee._sourceItems;
        if (!sourceItems.length) return;

        track.innerHTML = '';

        const groupOne = document.createElement('div');
        groupOne.className = 'marquee-group';
        track.appendChild(groupOne);

        function appendOneFullSet() {
            sourceItems.forEach((item) => groupOne.appendChild(cloneChip(item)));
        }

        appendOneFullSet();

        const viewportWidth = Math.ceil(marquee.getBoundingClientRect().width || window.innerWidth || 0);
        const minGroupWidth = viewportWidth + 80;
        let guard = 0;

        // The first group must be wider than the visible viewport. Otherwise the tail can expose empty space.
        while (groupOne.scrollWidth < minGroupWidth && guard < 30) {
            appendOneFullSet();
            guard += 1;
        }

        const groupWidth = Math.ceil(groupOne.scrollWidth);
        const groupTwo = groupOne.cloneNode(true);
        groupTwo.setAttribute('aria-hidden', 'true');
        track.appendChild(groupTwo);

        marquee.style.setProperty('--marquee-distance', `${groupWidth}px`);

        // Slower and consistent speed: larger loops take proportionally longer.
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const duration = isMobile ? 12 : 16;
        marquee.style.setProperty('--marquee-duration', `${duration}s`);
    }

    let resizeTimer = null;

    function setupAllMarquees() {
        marquees.forEach(setupMarquee);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAllMarquees);
    } else {
        setupAllMarquees();
    }

    window.addEventListener('load', setupAllMarquees);
    window.addEventListener('resize', function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(setupAllMarquees, 160);
    });
})();
// اسکرول ریویل: انیمیشن‌های ظاهری هنگام اسکرول کردن
function setupScrollReveal() {
    const targets = document.querySelectorAll([
        ".hero-copy",
        ".hero-projects",
        ".marquee",
        ".section-heading",
        ".feature-card",
        ".glass-panel",
        ".footer-brand-box",
        ".footer-links",
        ".footer-contact"
    ].join(","));

    if (!targets.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        targets.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    targets.forEach((item, index) => {
        item.classList.add("reveal-on-scroll");

        const delay = Math.min((index % 5) * 0.06, 0.24);
        item.style.setProperty("--reveal-delay", `${delay}s`);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            } else {
                entry.target.classList.remove("is-visible");
            }
        });
    }, {
        threshold: 0.16,
        rootMargin: "0px 0px -80px 0px"
    });

    targets.forEach((item) => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", () => {
    setupScrollReveal();
});