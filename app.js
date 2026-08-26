/* =========================================================
   Aakash S S - Neo-Brutalist Portfolio Scripts
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initResumeModal();
  initEmailCopy();
  initScrollSpy();
  initBackToTop();
});

/* =========================================================
   3. Contact Form Submission Handling (Web3Forms API)
   ========================================================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Anti-spam honeypot check
    const honeypot = form.querySelector('#formHoney');
    if (honeypot && honeypot.value.trim() !== '') {
      // Silently reject bot submission
      return;
    }

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Please fill out all fields before sending.';
      return;
    }

    // Button loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Transmitting message...</span>';
    submitBtn.disabled = true;
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';

    try {
      const formData = new FormData(form);
      formData.append('subject', `🚀 New Portfolio Inquiry from ${name}`);
      formData.append('from_name', name);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `✓ Thank you, ${name}! Your message was delivered successfully. I'll get back to you at <strong>${email}</strong> shortly.`;
        feedback.style.display = 'block';
        form.reset();
      } else {
        feedback.className = 'form-feedback error';
        feedback.textContent = data.message || 'Something went wrong. Please try again or email directly.';
        feedback.style.display = 'block';
      }
    } catch (err) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Network error. Please check your connection or contact me via email.';
      feedback.style.display = 'block';
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

/* =========================================================
   4. Resume Modal Logic
   ========================================================= */
function initResumeModal() {
  const resumeBtn = document.getElementById('resumeBtn');
  const modal = document.getElementById('resumeModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const previewBtn = document.getElementById('previewBtn');

  if (!resumeBtn || !modal) return;

  const openModal = (e) => {
    e.preventDefault();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  resumeBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* =========================================================
   5. Copy Email to Clipboard
   ========================================================= */
function initEmailCopy() {
  const emailBtn = document.getElementById('emailCopyBtn');
  if (!emailBtn) return;

  emailBtn.addEventListener('click', (e) => {
    const email = 'aakash1552005@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      const originalText = emailBtn.textContent;
      emailBtn.textContent = '✓ Copied to clipboard!';
      emailBtn.style.color = '#D4FF33';
      setTimeout(() => {
        emailBtn.textContent = originalText;
        emailBtn.style.color = '';
      }, 2000);
    }).catch(() => {});
  });
}

/* =========================================================
   6. ScrollSpy for Active Nav Links
   ========================================================= */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let current = '';
        const scrollPos = window.scrollY + 140;

        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* =========================================================
   7. Back to Top Smooth Scroll
   ========================================================= */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
