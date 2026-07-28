// DOM Elements
const scrollTopBtn = document.getElementById('scrollTopBtn');
const toast = document.getElementById('toast');
const contactForm = document.getElementById('contactForm');

// Scroll to Top Logic
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Form Submission Handler
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  toast.classList.add('show');
  contactForm.reset();
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
});
