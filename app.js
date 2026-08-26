/* =========================================================
   Aakash S S - Neo-Brutalist Portfolio Scripts
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initAITerminalPlayground();
  initContactForm();
  initResumeModal();
  initEmailCopy();
  initScrollSpy();
  initImagePlaceholder();
  initBackToTop();
});

/* =========================================================
   1. Interactive Live AI Model Playground Terminal
   ========================================================= */
function initAITerminalPlayground() {
  const screen = document.getElementById('terminalScreen');
  const cmdDisplay = document.getElementById('terminalCmd');
  const runBtn = document.getElementById('terminalRunBtn');
  const tabs = document.querySelectorAll('.terminal-tab');

  if (!screen || !cmdDisplay || !runBtn) return;

  let currentModel = 'churn';

  const modelData = {
    churn: {
      cmd: 'xgboost_pipeline.predict(customer_id="TEL-9402")',
      render: (isFresh = false) => {
        const churnProb = (isFresh ? (Math.random() * 12 + 10) : 14.8).toFixed(1);
        const latency = (isFresh ? (Math.random() * 6 + 10) : 12.4).toFixed(1);
        return `
          <div class="term-row term-comment">// MLOps Pipeline · XGBoost v2.0 · Automated Drift Monitoring</div>
          <div class="term-row">
            <span class="term-prompt-icon">&gt;</span>
            <span class="term-cmd">INPUT:</span>
            <span class="term-key">{ tenure: <span class="term-val">"24mo"</span>, contract: <span class="term-val">"Two-Year"</span>, monthly: <span class="term-val">"$78.50"</span> }</span>
          </div>
          
          <div class="term-metrics-box">
            <div class="term-metric-item">
              <span class="term-metric-label">MODEL ROC-AUC</span>
              <span class="term-metric-number">0.847</span>
            </div>
            <div class="term-metric-item">
              <span class="term-metric-label">RECALL LIFT</span>
              <span class="term-metric-number coral">48% → 80%</span>
            </div>
          </div>

          <div class="term-row">
            <span class="term-prompt-icon">&gt;</span>
            <span class="term-cmd">PREDICTION:</span>
            <span class="term-badge-inline">LOW CHURN RISK (${churnProb}%)</span>
          </div>
          <div class="term-row term-success">
            ✓ Inference: ${latency}ms · Status: 200 OK (Kubernetes Pod / FastAPI)
          </div>
        `;
      }
    },
    rag: {
      cmd: 'vector_store.similarity_search("TN student welfare scholarships")',
      render: (isFresh = false) => {
        const simScore = (isFresh ? (Math.random() * 0.04 + 0.94) : 0.968).toFixed(3);
        const latency = (isFresh ? (Math.random() * 10 + 20) : 24.6).toFixed(1);
        return `
          <div class="term-row term-comment">// Conversational AI & RAG · ChromaDB + Groq LLaMA 3.3</div>
          <div class="term-row">
            <span class="term-prompt-icon">&gt;</span>
            <span class="term-cmd">QUERY:</span>
            <span class="term-key">"Student scholarship & welfare eligibility"</span>
          </div>
          
          <div class="term-metrics-box">
            <div class="term-metric-item">
              <span class="term-metric-label">VECTOR COSINE SIM</span>
              <span class="term-metric-number">${simScore}</span>
            </div>
            <div class="term-metric-item">
              <span class="term-metric-label">BENCHMARK TESTS</span>
              <span class="term-metric-number">86/86 (100%)</span>
            </div>
          </div>

          <div class="term-row">
            <span class="term-prompt-icon">&gt;</span>
            <span class="term-cmd">CONTEXT:</span>
            <span class="term-val">"TN Higher Education Scholarship Aid (Scheme #14)"</span>
          </div>
          <div class="term-row term-success">
            ✓ Retrieved in ${latency}ms · Bilingual Stream (English/Tamil)
          </div>
        `;
      }
    },
    vision: {
      cmd: 'cnn_edge_detector.classify(frame_tensor[224, 224, 3])',
      render: (isFresh = false) => {
        const conf = (isFresh ? (Math.random() * 3 + 95) : 96.2).toFixed(1);
        const fps = (isFresh ? (Math.random() * 4 + 28) : 30.2).toFixed(0);
        return `
          <div class="term-row term-comment">// Edge Vision AI · ESP32-CAM + TensorFlow Sensor Fallback</div>
          <div class="term-row">
            <span class="term-prompt-icon">&gt;</span>
            <span class="term-cmd">SENSOR FEED:</span>
            <span class="term-key">Camera Frame [224x224 RGB] · <span class="term-val">${fps} FPS</span></span>
          </div>
          
          <div class="term-metrics-box">
            <div class="term-metric-item">
              <span class="term-metric-label">VISION CONFIDENCE</span>
              <span class="term-metric-number">${conf}%</span>
            </div>
            <div class="term-metric-item">
              <span class="term-metric-label">SENSOR FALLBACK</span>
              <span class="term-metric-number coral">ACTIVE (5-CAT)</span>
            </div>
          </div>

          <div class="term-row">
            <span class="term-prompt-icon">&gt;</span>
            <span class="term-cmd">CLASSIFICATION:</span>
            <span class="term-badge-inline">RECYCLABLE PLASTIC</span>
          </div>
          <div class="term-row term-success">
            ✓ Microcontroller Servo Command: DISPATCH_BIN_02
          </div>
        `;
      }
    }
  };

  function updateScreen(isFresh = false) {
    const data = modelData[currentModel];
    if (!data) return;

    cmdDisplay.textContent = data.cmd;
    screen.innerHTML = data.render(isFresh);
  }

  // Handle Tab Switching
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentModel = tab.getAttribute('data-model');
      updateScreen(false);
    });
  });

  // Handle "Run Inference" Execution
  runBtn.addEventListener('click', () => {
    const originalText = runBtn.innerHTML;
    runBtn.innerHTML = '<span>⚡ COMPENSATING...</span>';
    runBtn.disabled = true;

    screen.style.opacity = '0.5';

    setTimeout(() => {
      updateScreen(true);
      screen.style.opacity = '1';
      runBtn.innerHTML = originalText;
      runBtn.disabled = false;
    }, 280);
  });

  // Initial Load
  updateScreen(false);
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
