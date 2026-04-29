document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // MOBILE MENU
    // ==========================
    window.toggleMenu = function () {
        const nav = document.getElementById("mainNav");
        if (nav) nav.classList.toggle("open");
    };

    document.querySelectorAll("#mainNav a").forEach(link => {
        link.addEventListener("click", () => {
            const nav = document.getElementById("mainNav");
            if (nav) nav.classList.remove("open");
        });
    });

    // ==========================
    // LIGHTBOX
    // ==========================
    window.openLightbox = function (src) {
        const lightbox = document.getElementById("lightbox");
        const img = document.getElementById("lightbox-img");

        if (!lightbox || !img) return;

        img.src = src;
        lightbox.classList.add("show");
    };

    window.closeLightbox = function () {
        const lightbox = document.getElementById("lightbox");
        if (lightbox) lightbox.classList.remove("show");
    };

    // ==========================
    // FADE IN
    // ==========================
    const faders = document.querySelectorAll(".fade-in");

    const observerFade = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    faders.forEach(el => observerFade.observe(el));

    // ==========================
    // PORTFOLIO FILTER
    // ==========================
    window.filterSelection = function (category) {
        const items = document.querySelectorAll(".portfolio-item");

        items.forEach(item => {
            item.classList.remove("show");

            if (category === "all" || item.classList.contains(category)) {
                item.classList.add("show");
            }
        });
    };

    filterSelection("all");

    // ==========================
    // WHATSAPP
    // ==========================
    window.sendWhatsApp = function () {
        const name = document.getElementById("contact-name")?.value || "";
        const email = document.getElementById("contact-email")?.value || "";
        const message = document.getElementById("contact-message")?.value || "";

        const text = `Hola 👋, soy ${name}.

Estoy interesado en una remodelación.

📍 Tipo de proyecto:
${message}

💰 Presupuesto estimado:
(aprox.)

📅 Tiempo para iniciar:

¿Podrían orientarme sobre disponibilidad y próximos pasos?`;

        const phone = "5213313479076";

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
    };

    // ==========================
    // HEADER SCROLL
    // ==========================
    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 20);
    });

    // ==========================
    // CLEAN SCROLL SYSTEM
    // ==========================
    function smoothScrollTo(target) {
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

        smoothScrollTo(target);

        const nav = document.getElementById("mainNav");
        if (nav) nav.classList.remove("open");
    });

    // ==========================
    // SCROLL SPY + INDICATOR
    // ==========================
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("#mainNav a");
    const indicator = document.querySelector(".nav-indicator");

    function moveIndicator(link) {
        if (!indicator || !link) return;

        const rect = link.getBoundingClientRect();
        const parentRect = link.parentElement.parentElement.getBoundingClientRect();

        indicator.style.width = rect.width + "px";
        indicator.style.left = (rect.left - parentRect.left) + "px";
    }

    // HOVER + FIX (kein glitch)
    navLinks.forEach(link => {
        link.addEventListener("mouseenter", () => moveIndicator(link));

        link.addEventListener("mouseleave", () => {
            const activeLink = document.querySelector("#mainNav a.active");
            if (activeLink) moveIndicator(activeLink);
        });
    });

    let currentActive = "";

    function updateMenu() {
        navLinks.forEach(link => {
            const target = link.getAttribute("href")?.replace("#", "");

            if (target === currentActive) {
                link.classList.add("active");
                moveIndicator(link);
            } else {
                link.classList.remove("active");
            }
        });
    }

    const spy = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    currentActive = entry.target.id;
                    updateMenu();
                }
            });
        },
        {
            threshold: 0.3,
            rootMargin: "-30% 0px -20% 0px"
        }
    );

    sections.forEach(sec => spy.observe(sec));
    window.addEventListener("scroll", () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
            currentActive = "contacto";
            updateMenu();
        }
    });

});


// ==========================
// PARALLAX (SAFE)
// ==========================
const heroBg = document.querySelector(".hero-bg");

if (heroBg) {
    window.addEventListener("scroll", () => {
        heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    });
}


// ==========================
// FORM VALIDATION + SUBMIT
// ==========================
const groups = document.querySelectorAll(".input-group");

groups.forEach(group => {
    const input = group.querySelector("input, textarea");

    if (!input) return;

    input.addEventListener("blur", () => validate(input, group));
    input.addEventListener("input", () => liveValidate(input, group));
});

function validate(input, group) {
    const value = input.value.trim();

    if (value === "") {
        group.classList.add("error");
        group.classList.remove("success");
        return;
    }

    if (input.type === "email") {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        if (!valid) {
            group.classList.add("error");
            group.classList.remove("success");
            return;
        }
    }

    group.classList.remove("error");
    group.classList.add("success");
}

function liveValidate(input, group) {
    if (group.classList.contains("error")) {
        validate(input, group);
    }
}

const form = document.querySelector(".premium-form");

if (form) {
    const button = form.querySelector(".btn-submit");
    const successUI = document.getElementById("form-success");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        let valid = true;

        document.querySelectorAll(".input-group").forEach(group => {
            const input = group.querySelector("input, textarea");

            if (!input || !input.value.trim()) {
                group.classList.add("error");
                valid = false;
            } else {
                group.classList.remove("error");
            }
        });

        if (!valid) return;

        button.classList.add("loading");

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {
                button.classList.remove("loading");
                button.classList.add("success");

                setTimeout(() => {
                    successUI?.classList.add("show");
                }, 500);

                setTimeout(() => {
                    window.location.href = "gracias.html";
                }, 2500);

            } else {
                throw new Error();
            }

        } catch (error) {
            button.classList.remove("loading");
            alert("❌ Mensaje NO enviado");
        }
    });
}