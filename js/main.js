// ===== STATE =====
let activeSection = 'home';
let toastTimeout = null;
let navTick = 0;

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// ===== NAVIGATION =====
function navigateTo(section) {
  activeSection = section;
  navTick++;

  // Update nav links
  document.querySelectorAll('.nav-links button, .mobile-menu button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === section);
  });

  // Scroll
  const el = document.getElementById(section);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (section === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Close mobile menu
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('bar1').classList.remove('open1');
  document.getElementById('bar2').classList.remove('open2');
  document.getElementById('bar3').classList.remove('open3');

  try { window.location.hash = section; } catch (e) {}
  showToast(`→ ${section.charAt(0).toUpperCase() + section.slice(1)}`);
}

// ===== MOBILE MENU =====
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const b1 = document.getElementById('bar1');
  const b2 = document.getElementById('bar2');
  const b3 = document.getElementById('bar3');
  menu.classList.toggle('open');
  b1.classList.toggle('open1');
  b2.classList.toggle('open2');
  b3.classList.toggle('open3');
}

// ===== CONTACT FORM =====
function copyDraft() {
  const name = document.getElementById('contactName').value || 'Your Name';
  const email = document.getElementById('contactEmail').value || 'your@email.com';
  const message = document.getElementById('contactMessage').value || '';

  const draft = `Hi Francis,\n\n${message}\n\nFrom: ${name} <${email}>`;

  navigator.clipboard.writeText(draft).then(() => {
    showToast('Draft copied!');
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = draft;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('Draft copied!');
  });

  // Update mailto link
  const mailto = document.getElementById('mailtoLink');
  mailto.href = `mailto:francischege381@gmail.com?subject=${encodeURIComponent(`Project inquiry from ${name}`)}&body=${encodeURIComponent(draft)}`;
}

// Update mailto on input change
document.addEventListener('DOMContentLoaded', function () {
  ['contactName', 'contactEmail', 'contactMessage'].forEach(id => {
    document.getElementById(id).addEventListener('input', copyDraft);
  });
  // Initial mailto setup
  copyDraft();

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const section = entry.target.dataset.section;
        if (section) {
          activeSection = section;
          document.querySelectorAll('.nav-links button, .mobile-menu button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === section);
          });
        }
      }
    });
  }, { threshold: 0.2 });

  reveals.forEach(el => observer.observe(el));

  // Set home as active initially
  document.querySelector('.nav-links button[data-section="home"]').classList.add('active');
});
