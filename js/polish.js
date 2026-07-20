// Add this file as assets/js/polish.js and include it AFTER assets/js/main.js:
// <script src="assets/js/polish.js"></script>

document.addEventListener("DOMContentLoaded", () => {

  // ---------- Animate skill progress bars when they scroll into view ----------
  const skillBoxes = document.querySelectorAll(".skill-box");
  skillBoxes.forEach((box) => {
    const bar = box.querySelector(".progress-bar");
    if (bar) {
      const target = bar.style.width || bar.getAttribute("aria-valuenow") + "%";
      box.style.setProperty("--target-width", target);
    }
  });

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillBoxes.forEach((box) => skillObserver.observe(box));

  // ---------- Generic reveal-on-scroll for elements without data-aos ----------
  const revealEls = document.querySelectorAll(".reveal-on-scroll");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // ---------- Scroll-to-top button visibility ----------
  const scrollTopBtn = document.getElementById("scroll-top");
  if (scrollTopBtn) {
    const toggleScrollTop = () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add("active");
      } else {
        scrollTopBtn.classList.remove("active");
      }
    };
    window.addEventListener("scroll", toggleScrollTop);
    toggleScrollTop();
  }

});
