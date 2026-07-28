document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle with Animated Icon Switch
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');

      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // 2. Scroll to Top Button
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
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
  }

  // 3. Formspree AJAX Submission with Toast Notification
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          showToast('Message sent successfully!');
          contactForm.reset();
        } else {
          showToast('Oops! Something went wrong.');
        }
      } catch (error) {
        showToast('Network error. Please try again.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = 'Send Message';
        }
      }
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // 4. Fetch Dynamic Projects from Render Backend
  const backendUrl = "https://portfolio-backend-q63o.onrender.com";

  async function fetchBackendProjects() {
    try {
      const response = await fetch(`${backendUrl}/api/projects`);
      if (!response.ok) return;

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const portfolioGrid = document.getElementById('portfolioGrid');
        if (!portfolioGrid) return;

        data.forEach((project) => {
          const card = document.createElement('div');
          card.className = 'portfolio-card';
          card.innerHTML = `
            <img src="${project.imageUrl || 'https://via.placeholder.com/600x300/151518/ffffff?text=Project'}" 
                 alt="${project.title}" 
                 class="portfolio-img" 
                 onerror="this.src='https://via.placeholder.com/600x300/151518/ffffff?text=Project'">
            <div class="portfolio-content">
              <span class="portfolio-tag">${project.tag || 'Project'}</span>
              <h3>${project.title}</h3>
              <p>${project.description}</p>
            </div>
          `;
          portfolioGrid.appendChild(card);
        });
      }
    } catch (err) {
      console.log('Backend standard load fallback used.');
    }
  }

  fetchBackendProjects();
});
