/* =========================================================
   Aakash S S - Neo-Brutalist Portfolio Scripts
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initContactForm();
  initResumeModal();
  initEmailCopy();
  initScrollSpy();
  initImagePlaceholder();
  initBackToTop();
});

/* =========================================================
   1. Interactive Neural Network / Data Graph Canvas
   ========================================================= */
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;

  // Configuration
  const nodeCount = 28;
  const nodes = [];
  const maxDistance = 110;
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  window.addEventListener('resize', resize);
  resize();

  // Create Nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2.5 + 1.5,
      baseRadius: Math.random() * 2.5 + 1.5,
      isHighlighted: Math.random() > 0.8
    });
  }

  // Mouse Interaction on container
  const container = document.getElementById('visualContainer');
  if (container) {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    container.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw Crosshair Grid Dots in background
    ctx.fillStyle = 'rgba(26, 26, 26, 0.08)';
    const gridSize = 32;
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    // Update & Draw Nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      node.x += node.vx;
      node.y += node.vy;

      // Bounce off walls
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      // Mouse Proximity Effect
      const dx = mouse.x - node.x;
      const dy = mouse.y - node.y;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);

      if (distToMouse < 100) {
        node.x -= dx * 0.02;
        node.y -= dy * 0.02;
      }

      // Draw Node
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.isHighlighted ? '#FF4D4D' : '#1A1A1A';
      ctx.fill();

      // Connect Nodes with Lines
      for (let j = i + 1; j < nodes.length; j++) {
        const other = nodes[j];
        const dist = Math.hypot(node.x - other.x, node.y - other.y);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          const opacity = (1 - dist / maxDistance) * 0.35;
          ctx.strokeStyle = (node.isHighlighted || other.isHighlighted)
            ? `rgba(255, 77, 77, ${opacity * 1.5})`
            : `rgba(26, 26, 26, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

/* =========================================================
   2. Interactive Image Placeholder / Upload
   ========================================================= */
function initImagePlaceholder() {
  const avatarBox = document.getElementById('avatarBox');
  if (!avatarBox) return;

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  avatarBox.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.getElementById('headshotImg');
        if (img) {
          img.src = event.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

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
        feedback.innerHTML = `✓ Thank you, ${name}! Your message was delivered directly to Aakash's inbox. I'll get back to you at <strong>${email}</strong> shortly.`;
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

  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      window.print();
    });
  }
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
