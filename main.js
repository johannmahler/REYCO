document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // ELEMENTS
    // =========================================================

    const body = document.body;
    const header = document.querySelector("header");
    const nav = document.getElementById("mainNav");
    const mobileBtn = document.getElementById("mobileBtn");

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('#mainNav a');



    const heroBg = document.querySelector(".hero-bg");

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    // const closeBtn =
    //     document.querySelector(".lightbox-close-btn"); // ✅ FIX

    const form = document.querySelector(".premium-form");

    // =========================================================
    // MOBILE MENU
    // =========================================================

    function toggleMenu() {
        nav?.classList.toggle("open");
        mobileBtn?.classList.toggle("open");
        body.classList.toggle("menu-open");
    }

    function closeMenu() {
        nav?.classList.remove("open");
        mobileBtn?.classList.remove("open");
        body.classList.remove("menu-open");
    }

    mobileBtn?.addEventListener("click", toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // =========================================================
    // LIGHTBOX
    // =========================================================

    let scrollPosition = 0;

    window.openLightbox = (src) => {

        if (!lightbox || !lightboxImg) return;

        // SAVE CURRENT POSITION
        scrollPosition = window.scrollY;

        // IMAGE
        lightboxImg.src = src;

        // SHOW LIGHTBOX
        lightbox.classList.add("show");

        // LOCK BACKGROUND
        body.style.position = "fixed";
        body.style.top = `-${scrollPosition}px`;
        body.style.width = "100%";
    };

    function closeLightbox() {

        lightbox?.classList.remove("show");

        // RESTORE BODY
        body.style.position = "";
        body.style.top = "";
        body.style.width = "";

        // RESTORE SCROLL POSITION
        window.scrollTo(0, scrollPosition);

        // CLEAR IMAGE
        if (lightboxImg) {
            lightboxImg.src = "";
        }
    }

    // window.closeLightbox = closeLightbox;



    // BACKDROP CLOSE
    lightbox?.addEventListener("click", (e) => {

        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // CLOSE IMAGE CLICK
    lightboxImg?.addEventListener("click", () => {
        closeLightbox();
    });

    // ESC CLOSE
    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {
            closeLightbox();
        }
    });

    // =========================================================
    // FADE IN OBSERVER
    // =========================================================

    const fadeElements = document.querySelectorAll(".fade-in");

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("show");
            fadeObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.15
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // =========================================================
    // PORTFOLIO FILTER
    // =========================================================

    window.filterSelection = (category) => {
        document.querySelectorAll(".portfolio-item").forEach(item => {
            const visible =
                category === "all" ||
                item.classList.contains(category);

            item.classList.toggle("hide", !visible);
        });
    };

    filterSelection("all");


    // =========================================================
    // SERVICE CARD FLIP (MOBILE)
    // =========================================================

    const serviceCards =
        document.querySelectorAll(".service-card");

    serviceCards.forEach(card => {

        card.addEventListener("click", (e) => {

            // LINKS IGNORIEREN
            if (e.target.closest("a")) return;

            // NUR MOBILE
            if (window.innerWidth <= 768) {

                // AKTUELLER STATUS
                const isFlipped =
                    card.classList.contains("flipped");

                // ALLE ZUERST SCHLIESSEN
                serviceCards.forEach(c => {
                    c.classList.remove("flipped");
                });

                // NUR ÖFFNEN WENN VORHER ZU
                if (!isFlipped) {
                    card.classList.add("flipped");
                }
            }
        });
    });

    // =========================================================
    // CLOSE CARD WHEN CLICK OUTSIDE
    // =========================================================

    document.addEventListener("click", (e) => {

        const clickedCard =
            e.target.closest(".service-card");

        // WENN AUSSERHALB GEKLICKT
        if (!clickedCard) {

            serviceCards.forEach(card => {
                card.classList.remove("flipped");
            });
        }
    });

    // =========================================================
    // WHATSAPP
    // =========================================================

    window.sendWhatsApp = () => {

        const name =
            document.getElementById("contact-name")?.value || "";

        const message =
            document.getElementById("contact-message")?.value || "";

        const text =
            `Hola, soy ${name}:

Estoy interesado en una presupuesto.

Proyecto:
${message}
¿Podrían contactarme por favor?`;

        const phone = "5213313479076";

        const url =
            `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

        window.open(url, "_blank");
    };

    // =========================================================
    // HEADER SCROLL
    // =========================================================

    function updateHeader() {
        const currentScroll = window.scrollY;

        header?.classList.toggle(
            "scrolled",
            currentScroll > 20
        );
    }

    window.addEventListener("scroll", updateHeader, { passive: true });

    // =========================================================
    // SMOOTH SCROLL
    // =========================================================

    function smoothScroll(target) {
        const el = document.querySelector(target);
        if (!el) return;

        el.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    document.addEventListener("click", (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const target = link.getAttribute("href");
        if (!target || target === "#") return;

        e.preventDefault();
        smoothScroll(target);
        closeMenu();
    });

    // =========================================================
    // SCROLL SPY
    // =========================================================

    function setActiveLink() {
        let currentSection = "";

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();

            if (
                rect.top <= window.innerHeight * 0.4 &&
                rect.bottom >= window.innerHeight * 0.4
            ) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute("href");

            link.classList.toggle(
                "active",
                href === `#${currentSection}`
            );
        });
    }

    window.addEventListener("scroll", setActiveLink, { passive: true });
    window.addEventListener("load", setActiveLink);

    // =========================================================
    // PARALLAX
    // =========================================================

    if (heroBg) {
        let ticking = false;

        function updateParallax() {
            const offset = window.scrollY * 0.25;
            heroBg.style.transform = `translateY(${offset}px) scale(1.1)`;
            ticking = false;
        }

        window.addEventListener("scroll", () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // =========================================================
    // FORM VALIDATION + PREMIUM UX
    // =========================================================

    if (form) {

        // =====================================================
        // ELEMENTS
        // =====================================================

        const groups =
            form.querySelectorAll(".input-group");

        const button =
            form.querySelector(".btn-submit");

        const successUI =
            document.getElementById("form-success");

        // =====================================================
        // RESET STATES ON PAGE SHOW
        // =====================================================

        window.addEventListener("pageshow", () => {

            // REMOVE SUCCESS POPUP
            successUI?.classList.remove("show");

            // RESET BUTTON STATES
            button?.classList.remove("success");
            button?.classList.remove("loading");
            button?.classList.remove("error");
        });

        // =====================================================
        // VALIDATE INPUT
        // =====================================================

        function validateInput(input, group) {

            // TRIM VALUE
            const value = input.value.trim();

            // EMPTY CHECK
            let valid = value !== "";

            // EMAIL VALIDATION
            if (valid && input.type === "email") {

                valid =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        .test(value);
            }

            // TOGGLE STATES
            group.classList.toggle("error", !valid);

            group.classList.toggle("success", valid);

            return valid;
        }

        // =====================================================
        // REALTIME VALIDATION
        // =====================================================

        groups.forEach(group => {

            const input =
                group.querySelector("input, textarea");

            if (!input) return;

            // VALIDATE ON BLUR
            input.addEventListener("blur", () => {

                validateInput(input, group);
            });

            // LIVE VALIDATION
            input.addEventListener("input", () => {

                validateInput(input, group);
            });
        });

        // =====================================================
        // FORM SUBMIT
        // =====================================================

        form.addEventListener("submit", async (e) => {

            // STOP NORMAL SUBMIT
            e.preventDefault();

            // =================================================
            // VALIDATE ALL FIELDS
            // =================================================

            let valid = true;

            groups.forEach(group => {

                const input =
                    group.querySelector("input, textarea");

                if (!input) return;

                // VALIDATE FIELD
                if (!validateInput(input, group)) {

                    valid = false;
                }
            });

            // =================================================
            // INVALID FORM
            // =================================================

            if (!valid) {

                // ERROR ANIMATION
                button?.classList.add("error");

                // REMOVE ERROR STATE
                setTimeout(() => {

                    button?.classList.remove("error");

                }, 600);

                return;
            }

            // =================================================
            // LOADING STATE
            // =================================================

            button?.classList.add("loading");

            button.disabled = true;

            try {

                // =============================================
                // SEND FORM TO FORMSPREE
                // =============================================

                const response = await fetch(form.action, {

                    method: "POST",

                    body: new FormData(form),

                    headers: {
                        "Accept": "application/json"
                    }
                });

                // ERROR RESPONSE
                if (!response.ok) {

                    throw new Error();
                }

                // =================================================
                // SUCCESS STATE
                // =================================================

                // REMOVE LOADING
                button?.classList.remove("loading");

                // SUCCESS BUTTON
                button?.classList.add("success");

                // SHOW SUCCESS POPUP
                if (successUI) {

                    successUI.classList.remove("show");

                    setTimeout(() => {

                        successUI.classList.add("show");

                    }, 10);
                }

                // RESET FORM
                form.reset();

                // =================================================
                // REMOVE STATES AFTER DELAY
                // =================================================

                setTimeout(() => {

                    // HIDE SUCCESS POPUP
                    successUI?.classList.remove("show");

                    // RESET BUTTON
                    button?.classList.remove("success");
                    // ENABLE BUTTON AGAIN
                    button.disabled = false;

                }, 2500);

            } catch {

                // =================================================
                // ERROR STATE
                // =================================================

                // REMOVE LOADING
                button?.classList.remove("loading");
                button.disabled = false;

                // ERROR ANIMATION
                button?.classList.add("error");

                // REMOVE ERROR CLASS
                setTimeout(() => {

                    button?.classList.remove("error");

                }, 800);

                // ERROR MESSAGE
                alert("❌ Error al enviar el mensaje.");
            }
        });
    }
});