/* =========================================================
   PANTHU — shared layout + interactions
   Header, CTA band and footer are rendered here so the
   navigation only has to be edited in one place.
   Each page sets <body data-page="..."> to mark the active link.
   ========================================================= */

const NAV = [
  { key: "home",      label: "Home",                     href: "index.html" },
  { key: "about",     label: "Company Profile / About Us", href: "about.html" },
  { key: "pmg",       label: "Project Management Group", href: "project-management.html" },
  { key: "marketing", label: "Marketing",                href: "marketing.html" },
  { key: "install",   label: "Installation",             href: "installation.html" },
  { key: "factory",   label: "Factory and Quarry",       href: "factory-quarry.html" },
  { key: "contact",   label: "Contact Us",               href: "contact.html" },
  { key: "gallery",   label: "Project Gallery",          href: "gallery.html" },
];

const LOGO = `
  <svg class="brand-logo" viewBox="0 0 48 44" aria-hidden="true">
    <polygon points="24,2 46,42 2,42" fill="#2b3a8f" />
    <polygon points="24,9 40,38 8,38" fill="none" stroke="#fff" stroke-width="1.4" />
    <text x="24" y="33" text-anchor="middle" font-family="Georgia, serif" font-size="9" font-weight="700" fill="#fff">PGSC</text>
    <circle cx="31" cy="7" r="5" fill="#e0262d" />
  </svg>`;

const LANG = `
  <div class="lang-switch" role="group" aria-label="Language">
    <button type="button" data-lang="mm">MM</button>
    <span aria-hidden="true">/</span>
    <button type="button" data-lang="en">EN</button>
  </div>`;

const navLinks = (active) =>
  NAV.map((n) => `<li><a href="${n.href}"${n.key === active ? ' class="is-active" aria-current="page"' : ""}>${n.label}</a></li>`).join("");

const PARTIALS = {
  header: (active) => `
  <header class="site-header" id="top">
    <div class="header-top container-wide">
      <a href="index.html" class="brand" aria-label="Panthu home">
        ${LOGO}
        <span class="brand-text">
          <span class="brand-name">PANTHU</span>
          <span class="brand-sub">Geological Services Co-operative Ltd.</span>
        </span>
      </a>
      <div class="header-utils">
        <span class="muted">Established 1992</span>
        <a href="#" class="util-link">Download Font</a>
        ${LANG}
      </div>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">
        <span class="menu-label">Menu</span>
      </button>
    </div>
    <nav class="main-nav" id="main-nav" aria-label="Main">
      <ul class="container-wide">${navLinks(active)}</ul>
      <div class="nav-mobile-utils">
        <a href="#" class="util-link">Download Font</a>
        ${LANG}
      </div>
    </nav>
  </header>`,

  cta: () => `
  <section class="cta">
    <div class="container-wide cta-inner">
      <div>
        <h2>Let’s build something lasting.</h2>
        <p>Talk to our team about materials, installation or your next project.</p>
      </div>
      <a href="contact.html" class="btn btn-primary">Contact us <span class="ico">↗</span></a>
    </div>
  </section>`,

  footer: () => `
  <footer class="site-footer">
    <div class="container-wide footer-grid">
      <div class="footer-brand">
        <p class="footer-logo">PANTHU</p>
        <p>Geological Services Co-operative Ltd.</p>
        <p>Natural stone. Lasting possibilities.</p>
        <p class="footer-small">Established 1992</p>
      </div>
      <div class="footer-col">
        <h4>Explore</h4>
        <ul>${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}</ul>
      </div>
      <div class="footer-col">
        <h4>Get in touch</h4>
        <address>
          <p>Dagon Centre, SanChaung Township, Yangon, Myanmar.</p>
          <p><a href="tel:01503256">01-503256</a>, <a href="tel:01516501">01-516501</a></p>
          <p><a href="mailto:panthu@panthupgsc.com">panthu@panthupgsc.com</a></p>
        </address>
      </div>
    </div>
    <div class="container-wide footer-bottom">
      <p>© 2010 – Geological services Co-operative Ltd,. All rights reserved</p>
      <p><a href="#">Download Font</a> <span aria-hidden="true">·</span> <a href="#" data-lang-toggle>MM / EN</a></p>
    </div>
  </footer>`,
};

(() => {
  const active = document.body.dataset.page || "";

  /* ---------- Render shared partials ---------- */
  document.querySelectorAll("[data-include]").forEach((slot) => {
    const render = PARTIALS[slot.dataset.include];
    if (render) slot.outerHTML = render(active);
  });

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("main-nav");

  /* ---------- Mobile menu ---------- */
  if (toggle && nav) {
    const label = toggle.querySelector(".menu-label");
    const setMenu = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      label.textContent = open ? "Close" : "Menu";
    };
    toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 1180) setMenu(false); });
  }

  /* ---------- Header shadow on scroll ---------- */
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Language switch (UI state only, no translations yet) ---------- */
  const langButtons = document.querySelectorAll(".lang-switch button");
  const getLang = () => { try { return localStorage.getItem("panthu-lang") || "en"; } catch (_) { return "en"; } };
  const applyLang = (lang) => {
    langButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.lang === lang));
    document.documentElement.lang = lang === "mm" ? "my" : "en";
    try { localStorage.setItem("panthu-lang", lang); } catch (_) {}
  };
  langButtons.forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));
  document.querySelectorAll("[data-lang-toggle]").forEach((a) =>
    a.addEventListener("click", (e) => { e.preventDefault(); applyLang(getLang() === "en" ? "mm" : "en"); })
  );
  applyLang(getLang());

  /* ---------- Filter chips ---------- */
  document.querySelectorAll("[data-filters]").forEach((group) => {
    const target = document.getElementById(group.dataset.filters);
    if (!target) return;
    const items = target.querySelectorAll("[data-category]");
    group.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      group.querySelectorAll("button").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      const f = btn.dataset.filter;
      items.forEach((item) => {
        const show = f === "all" || item.dataset.category.split(" ").includes(f);
        item.hidden = !show;
        item.classList.remove("is-entering", "reveal");
        if (show) { void item.offsetWidth; item.classList.add("is-entering"); }
      });
    });
  });

  /* ---------- Lightbox for gallery pages ---------- */
  const galleryItems = [...document.querySelectorAll("[data-lightbox] a")];
  if (galleryItems.length) {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML = `
      <button class="lb-btn lb-close" type="button" aria-label="Close">✕</button>
      <button class="lb-btn lb-prev" type="button" aria-label="Previous image">←</button>
      <figure><img alt="" /><figcaption></figcaption></figure>
      <button class="lb-btn lb-next" type="button" aria-label="Next image">→</button>`;
    document.body.appendChild(lb);
    const img = lb.querySelector("img");
    const cap = lb.querySelector("figcaption");
    let index = 0;
    let lastFocus = null;

    const visible = () => galleryItems.filter((a) => !a.hidden);
    const show = (i) => {
      const list = visible();
      index = (i + list.length) % list.length;
      const a = list[index];
      const thumb = a.querySelector("img");
      img.src = a.getAttribute("href");
      img.alt = thumb ? thumb.alt : "";
      cap.textContent = a.querySelector("h3")?.textContent || "";
    };
    const open = (a) => {
      lastFocus = document.activeElement;
      show(visible().indexOf(a));
      lb.classList.add("is-open");
      document.body.classList.add("no-scroll");
      lb.querySelector(".lb-close").focus();
    };
    const close = () => {
      lb.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
      lastFocus?.focus();
    };

    galleryItems.forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); open(a); }));
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
    lb.querySelector(".lb-next").addEventListener("click", () => show(index + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Stat counters ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counters = document.querySelectorAll("[data-count]");
  if (!reduce && counters.length && "IntersectionObserver" in window) {
    const animate = (el) => {
      const target = +el.dataset.count;
      const start = target > 1000 ? target - 60 : 0;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min((now - t0) / 1200, 1);
        el.textContent = Math.round(start + (target - start) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const co = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { animate(e.target); co.unobserve(e.target); }
    }), { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }
})();
