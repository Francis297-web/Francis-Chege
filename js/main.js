
(function () {
  "use strict";

  const header = document.getElementById("header");
  const navmenu = document.getElementById("navmenu");
  const navLinks = navmenu ? navmenu.querySelectorAll("a[href^='#']") : [];
  const mobileNavToggle = document.querySelector(".mobile-nav-toggle");

  /* ----------------------------------------------------------------
     Sticky header shrink/shadow state
  ---------------------------------------------------------------- */
  function toggleScrolled() {
    if (!header) return;
    const scrolled = window.scrollY > 60;
    document.body.classList.toggle("scrolled", scrolled);
    header.classList.toggle("scrolled", scrolled);
  }
  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /* ----------------------------------------------------------------
     Mobile nav toggle (hamburger <-> close icon)
  ---------------------------------------------------------------- */
  function mobileNavToogle() {
    document.body.classList.toggle("mobile-nav-active");
    if (mobileNavToggle) {
      mobileNavToggle.classList.toggle("bi-list");
      mobileNavToggle.classList.toggle("bi-x");
    }
  }
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener("click", mobileNavToogle);
  }

  // Close the mobile menu automatically after tapping a nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (document.body.classList.contains("mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /* ----------------------------------------------------------------
     Smooth scroll to in-page anchors, offset for the sticky header
  ---------------------------------------------------------------- */
  function getHeaderOffset() {
    return header ? header.offsetHeight : 0;
  }

  function scrollToTarget(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;
    const top =
      target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset() - 10;
    window.scrollTo({ top, behavior: "smooth" });
  }

  document.querySelectorAll("a[href^='#']").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href === "#" || href.length < 2) return;
    link.addEventListener("click", (e) => {
      if (document.querySelector(href)) {
        e.preventDefault();
        scrollToTarget(href);
        history.pushState(null, "", href);
      }
    });
  });

  // If the page loads with a hash already in the URL, scroll there
  // (accounting for the fixed header) once everything has rendered.
  window.addEventListener("load", () => {
    if (window.location.hash && document.querySelector(window.location.hash)) {
      setTimeout(() => scrollToTarget(window.location.hash), 100);
    }
  });

  /* ----------------------------------------------------------------
     Scrollspy: highlight the current section's nav link
  ---------------------------------------------------------------- */
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = `#${entry.target.id}`;
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === id);
            });
          }
        });
      },
      { rootMargin: `-${getHeaderOffset() + 40}px 0px -60% 0px`, threshold: 0 }
    );
    sections.forEach((section) => spyObserver.observe(section));
  }

  /* ----------------------------------------------------------------
     AOS (Animate On Scroll) init
  ---------------------------------------------------------------- */
  function initAOS() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 600,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }
  }
  window.addEventListener("load", initAOS);

  /* ----------------------------------------------------------------
     Swiper: read embedded JSON config from each .init-swiper block
     (matches the <script type="application/json" class="swiper-config">
     pattern used in the testimonials section)
  ---------------------------------------------------------------- */
  function initSwipers() {
    if (typeof Swiper === "undefined") return;
    document.querySelectorAll(".init-swiper").forEach((swiperEl) => {
      const configEl = swiperEl.querySelector(".swiper-config");
      let config = {};
      if (configEl) {
        try {
          config = JSON.parse(configEl.textContent.trim());
        } catch (err) {
          console.error("Invalid Swiper config JSON:", err);
        }
      }
      new Swiper(swiperEl, config);
    });
  }
  window.addEventListener("load", initSwipers);

  /* ----------------------------------------------------------------
     FAQ accordion (single item open at a time)
  ---------------------------------------------------------------- */
  document.querySelectorAll(".faq-item h3, .faq-item .faq-toggle").forEach((el) => {
    el.addEventListener("click", () => {
      const item = el.closest(".faq-item");
      if (!item) return;
      const wasActive = item.classList.contains("faq-active");

      item.parentElement
        .querySelectorAll(".faq-item")
        .forEach((i) => i.classList.remove("faq-active"));

      if (!wasActive) {
        item.classList.add("faq-active");
      }
    });
  });
})();
