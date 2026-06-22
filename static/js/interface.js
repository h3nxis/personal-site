(function () {
    "use strict";

    const root = document.documentElement;
    const body = document.body;
    const scrollButton = document.querySelector(".scroll-top");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lastY = window.scrollY || 0;
    let ticking = false;
    let mouseTicking = false;
    let mouseX = 0;
    let mouseY = 0;

    const HIDE_AFTER = 120;
    const DELTA = 8;

    function updateScrollState() {
        const y = window.scrollY || document.documentElement.scrollTop || 0;

        root.style.setProperty("--dot-y", `${y * -0.055}px`);
        body.classList.toggle("is-scrolled", y > 18);

        const distance = Math.abs(y - lastY);
        const goingDown = y > lastY;

        if (y <= 24) {
            body.classList.remove("scroll-down", "scroll-up");
        } else if (distance > DELTA) {
            if (goingDown && y > HIDE_AFTER) {
                body.classList.add("scroll-down");
                body.classList.remove("scroll-up");
            } else {
                body.classList.add("scroll-up");
                body.classList.remove("scroll-down");
            }

            lastY = y;
        }

        if (scrollButton) {
            scrollButton.classList.toggle("is-visible", y > 420);
        }

        ticking = false;
    }

    function requestScrollUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollState);
            ticking = true;
        }
    }

    function updateMousePosition() {
        root.style.setProperty("--mouse-x", `${mouseX}px`);
        root.style.setProperty("--mouse-y", `${mouseY}px`);
        body.classList.add("pointer-active");
        mouseTicking = false;
    }

    function requestMouseUpdate(event) {
        if (reduceMotion.matches) return;

        mouseX = event.clientX;
        mouseY = event.clientY;

        if (!mouseTicking) {
            window.requestAnimationFrame(updateMousePosition);
            mouseTicking = true;
        }
    }

    function setupScrollReveal() {
        const selectors = [
            ".hero-copy",
            ".hero-projects",
            ".marquee",
            ".section-heading",
            ".feature-card",
            ".glass-panel",
            ".project-card",
            ".about-card",
            ".contact-card",
            ".footer-brand-box",
            ".footer-links",
            ".footer-contact"
        ];

        const items = Array.from(document.querySelectorAll(selectors.join(",")));

        if (!items.length) return;

        items.forEach((item, index) => {
            item.classList.add("reveal-item");
            item.style.setProperty("--reveal-delay", `${Math.min((index % 5) * 45, 180)}ms`);
        });

        if (reduceMotion.matches || !("IntersectionObserver" in window)) {
            items.forEach((item) => item.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                    } else {
                        entry.target.classList.remove("is-visible");
                    }
                });
            },
            {
                threshold: 0.14,
                rootMargin: "0px 0px -60px 0px"
            }
        );

        items.forEach((item) => observer.observe(item));
    }

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate, { passive: true });
    window.addEventListener("pointermove", requestMouseUpdate, { passive: true });

    window.addEventListener("pointerleave", () => {
        body.classList.remove("pointer-active");
    });

    if (scrollButton) {
        scrollButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: reduceMotion.matches ? "auto" : "smooth"
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            updateScrollState();
            setupScrollReveal();
        });
    } else {
        updateScrollState();
        setupScrollReveal();
    }
})();
(function () {
    "use strict";

    const marquees = document.querySelectorAll(".marquee");
    if (!marquees.length) return;

    function cloneChip(chip) {
        const clone = chip.cloneNode(true);
        clone.setAttribute("tabindex", "0");
        return clone;
    }

    function setupMarquee(marquee) {
        const track = marquee.querySelector(".marquee-track");
        if (!track) return;

        if (!marquee._sourceItems) {
            const firstGroup = track.querySelector(".marquee-group");
            if (!firstGroup) return;

            marquee._sourceItems = Array.from(firstGroup.querySelectorAll(".marquee-item"))
                .map((item) => item.cloneNode(true));
        }

        const sourceItems = marquee._sourceItems;
        if (!sourceItems.length) return;

        track.innerHTML = "";

        const groupOne = document.createElement("div");
        groupOne.className = "marquee-group";
        track.appendChild(groupOne);

        function appendFullSet() {
            sourceItems.forEach((item) => {
                groupOne.appendChild(cloneChip(item));
            });
        }

        appendFullSet();

        const viewportWidth = Math.ceil(marquee.getBoundingClientRect().width || window.innerWidth || 0);
        const minWidth = viewportWidth + 120;

        let guard = 0;
        while (groupOne.scrollWidth < minWidth && guard < 30) {
            appendFullSet();
            guard += 1;
        }

        const groupWidth = Math.ceil(groupOne.scrollWidth);
        const groupTwo = groupOne.cloneNode(true);
        groupTwo.setAttribute("aria-hidden", "true");
        track.appendChild(groupTwo);

        marquee.style.setProperty("--marquee-distance", `${groupWidth}px`);

        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        marquee.style.setProperty("--marquee-duration", isMobile ? "13s" : "17s");
    }

    let resizeTimer = null;

    function setupAllMarquees() {
        marquees.forEach(setupMarquee);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupAllMarquees, { once: true });
    } else {
        setupAllMarquees();
    }

    window.addEventListener("load", setupAllMarquees, { once: true });

    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(setupAllMarquees, 160);
    }, { passive: true });
})();