/**
 * GAONA CONSULTORES TI - CORE INTERACTIVE ENGINE
 * Modern vanilla JavaScript for enterprise web application
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCounters();
  initServiceFilters();
  initCostEstimator();
  initAppointmentScheduler();
  initContactForm();
  initFaqAccordion();
  initModals();
  initBackToTop();
  initChatbot();
});

/* ==========================================================================
   1. NAVIGATION & SCROLL MANAGEMENT
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header scroll state
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active link indicator on scroll (ScrollSpy)
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      
      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. HERO STAT COUNTERS ANIMATION
   ========================================================================== */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const isDecimal = target % 1 !== 0;
    const duration = 2000; // ms
    const startTime = performance.now();

    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = isDecimal ? (easeProgress * target).toFixed(1) : Math.floor(easeProgress * target);
      
      el.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateValue);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
}

/* ==========================================================================
   3. SERVICES FILTER SYSTEM
   ========================================================================== */
function initServiceFilters() {
  const tabButtons = document.querySelectorAll('.tab-btn[data-filter]');
  const serviceCards = document.querySelectorAll('.service-card[data-category]');

  if (!tabButtons.length || !serviceCards.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE PROJECT COST ESTIMATOR
   ========================================================================== */
function initCostEstimator() {
  const serviceOptions = document.querySelectorAll('.calc-service-opt');
  const scaleOptions = document.querySelectorAll('.calc-scale-opt');
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
  
  const estimatedPriceEl = document.getElementById('calcEstimatedPrice');
  const estimatedTimeEl = document.getElementById('calcEstimatedTime');
  const teamAssignedEl = document.getElementById('calcTeamAssigned');
  const transferBtn = document.getElementById('transferEstimateToContactBtn');

  if (!estimatedPriceEl) return;

  // State
  let currentService = { name: 'Desarrollo de Software', basePrice: 45000, baseWeeks: 6, team: '1 Tech Lead + 2 Devs + 1 QA' };
  let currentScale = { name: 'PyME / Mediana', multiplier: 1.0 };

  const servicesMap = {
    software: { name: 'Desarrollo de Software a Medida', basePrice: 45000, baseWeeks: 6, team: '1 Tech Lead, 2 Fullstack Devs, 1 QA' },
    cloud: { name: 'Arquitectura & Migración Cloud', basePrice: 38000, baseWeeks: 4, team: '1 Cloud Architect, 1 DevOps Engineer' },
    security: { name: 'Auditoría & Blindaje de Ciberseguridad', basePrice: 32000, baseWeeks: 3, team: '1 SecOps Specialist, 1 Ethical Hacker' },
    infra: { name: 'Infraestructura & Soporte Gestionado', basePrice: 24000, baseWeeks: 2, team: '1 SysAdmin Lead, 1 Network Specialist' }
  };

  const scalesMap = {
    startup: { name: 'Startup / Emprendimiento', multiplier: 0.75, timeMultiplier: 0.8 },
    pyme: { name: 'PyME / Empresa en Crecimiento', multiplier: 1.0, timeMultiplier: 1.0 },
    corporate: { name: 'Corporativo / Gran Empresa', multiplier: 1.6, timeMultiplier: 1.4 }
  };

  function updateEstimate() {
    let totalBase = currentService.basePrice * currentScale.multiplier;
    let totalWeeks = Math.ceil(currentService.baseWeeks * (currentScale.timeMultiplier || 1));

    // Calculate addons
    let addonsTotal = 0;
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        addonsTotal += parseFloat(cb.getAttribute('data-price') || 0);
        totalWeeks += parseInt(cb.getAttribute('data-weeks') || 0, 10);
      }
    });

    const finalLow = Math.round((totalBase + addonsTotal) * 0.95);
    const finalHigh = Math.round((totalBase + addonsTotal) * 1.15);

    // Format Currency MXN
    const formatCurrency = (val) => '$' + val.toLocaleString('es-MX') + ' MXN';

    estimatedPriceEl.textContent = `${formatCurrency(finalLow)} - ${formatCurrency(finalHigh)}`;
    estimatedTimeEl.textContent = `${totalWeeks} a ${totalWeeks + 2} semanas aprox.`;
    teamAssignedEl.textContent = currentService.team;
  }

  // Event Listeners for Service Options
  serviceOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      serviceOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const key = opt.getAttribute('data-key');
      if (servicesMap[key]) {
        currentService = servicesMap[key];
        updateEstimate();
      }
    });
  });

  // Event Listeners for Scale Options
  scaleOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      scaleOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const key = opt.getAttribute('data-key');
      if (scalesMap[key]) {
        currentScale = scalesMap[key];
        updateEstimate();
      }
    });
  });

  // Checkboxes
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateEstimate);
  });

  // Transfer Button to Contact Form
  if (transferBtn) {
    transferBtn.addEventListener('click', () => {
      const contactServiceSelect = document.getElementById('contactService');
      const contactMessage = document.getElementById('contactMessage');
      const contactSection = document.getElementById('contacto');

      if (contactServiceSelect) {
        contactServiceSelect.value = currentService.name;
      }
      if (contactMessage) {
        contactMessage.value = `Hola Gaona Consultores, me interesa una cotización para: ${currentService.name} en nivel ${currentScale.name}. Rango estimado calculado: ${estimatedPriceEl.textContent}. Por favor contactarme para revisar detalles.`;
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        showToast('Estimación transferida al formulario de contacto.');
      }
    });
  }

  // Initial Calculation
  updateEstimate();
}

/* ==========================================================================
   5. QUICK APPOINTMENT SCHEDULER WIDGET
   ========================================================================== */
function initAppointmentScheduler() {
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
  const appointmentDateInput = document.getElementById('appointmentDate');
  const selectedSlotDisplay = document.getElementById('selectedSlotDisplay');

  // Set min date to tomorrow
  if (appointmentDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    appointmentDateInput.min = tomorrow.toISOString().split('T')[0];
    appointmentDateInput.value = tomorrow.toISOString().split('T')[0];
  }

  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (selectedSlotDisplay) {
        selectedSlotDisplay.textContent = `Hora seleccionada: ${btn.textContent.trim()} (30 min)`;
      }
    });
  });
}

/* ==========================================================================
   6. CONTACT FORM & SUBMISSION
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('mainContactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span style="display:inline-block; animation: spin 1s infinite linear;">↻</span> Procesando Solicitud...
    `;

    // Simulated API response delay
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      const name = document.getElementById('contactName')?.value || 'Estimado cliente';
      const email = document.getElementById('contactEmail')?.value || '';
      const phone = document.getElementById('contactPhone')?.value || '';
      const company = document.getElementById('contactCompany')?.value || 'Empresa Prospecto';
      const service = document.getElementById('contactService')?.value || 'Consultoría Estratégica & Gobierno TI';
      const appointmentDate = document.getElementById('appointmentDate')?.value || '';
      const message = document.getElementById('contactMessage')?.value || '';
      const ticketId = 'GAONA-' + Math.floor(100000 + Math.random() * 900000);

      // Push to CRM Proposals localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('gaona_crm_proposals') || '[]');
        const newLead = {
          id: 'PROP-' + Math.floor(1000 + Math.random() * 9000),
          client: name,
          company: company,
          email: email,
          phone: phone,
          service: service,
          value: 45000,
          priority: 'alta',
          stage: appointmentDate ? 'diagnosis' : 'prospect',
          date: new Date().toISOString().split('T')[0],
          appointmentDate: appointmentDate,
          notes: `Lead recibido desde formulario web. Mensaje: "${message}" Ticket: ${ticketId}`
        };
        existing.unshift(newLead);
        localStorage.setItem('gaona_crm_proposals', JSON.stringify(existing));
      } catch (err) {
        console.error('CRM sync error:', err);
      }

      // Open Success Modal
      const modal = document.getElementById('successModal');
      const ticketIdEl = document.getElementById('modalTicketId');
      const clientNameEl = document.getElementById('modalClientName');

      if (ticketIdEl) ticketIdEl.textContent = ticketId;
      if (clientNameEl) clientNameEl.textContent = name;

      if (modal) {
        modal.classList.add('open');
      }

      showToast(`¡Solicitud enviada con éxito! Ticket #${ticketId}`);
      contactForm.reset();
    }, 1200);
  });
}

/* ==========================================================================
   7. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(i => i.classList.remove('active'));
        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   8. MODALS ENGINE
   ========================================================================== */
function initModals() {
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn, .modal-dismiss-btn');
  const serviceDetailBtns = document.querySelectorAll('.open-service-modal-btn');

  // Service Data dictionary for dynamic modal loading
  const serviceDetails = {
    cloud: {
      title: 'Arquitectura Cloud & DevOps Empresarial',
      badge: 'AWS • Azure • Google Cloud',
      desc: 'Diseñamos e implementamos arquitecturas en la nube resilientes, escalables y costo-eficientes. Automatizamos tuberías de despliegue CI/CD, contenedores Kubernetes y monitoreo predictivo.',
      benefits: [
        'Reducción de costos de infraestructura de hasta un 40%.',
        'Despliegues automáticos con cero tiempo de inactividad (Zero Downtime).',
        'Garantía de alta disponibilidad 99.99% con arquitecturas Multi-AZ.',
        'Infraestructura como Código (IaC) con Terraform y Ansible.'
      ]
    },
    cyber: {
      title: 'Ciberseguridad Integral & SOC Gestionado 24/7',
      badge: 'ISO 27001 • Zero Trust • Pentesting',
      desc: 'Blindamos los activos digitales y datos estratégicos de su empresa contra amenazas avanzadas. Implementamos defensas activas, auditorías de vulnerabilidad y respuesta ante incidentes en minutos.',
      benefits: [
        'Monitoreo y detección de anomalías 24/7/365 en tiempo real.',
        'Pruebas de penetración (Ethical Hacking) a redes y aplicaciones.',
        'Cumplimiento de estándares internacionales de privacidad y seguridad.',
        'Planes de Recuperación ante Desastres (DRP) probados.'
      ]
    },
    software: {
      title: 'Desarrollo de Software a la Medida & Microservicios',
      badge: 'APIs • Web • Móvil • Cloud-Native',
      desc: 'Construimos soluciones digitales de alto impacto tecnológico, perfectamente integradas con sus sistemas existentes y diseñadas para escalar con su negocio.',
      benefits: [
        'Código limpio, seguro y documentado bajo metodologías ágiles (Scrum/Kanban).',
        'Arquitectura modular basada en microservicios e interfaces de alta velocidad.',
        'Integración con ERPs, CRMs y pasarelas de pago empresariales.',
        'Garantía de soporte evolutivo y mantenimiento post-lanzamiento.'
      ]
    },
    infra: {
      title: 'Infraestructura de Redes & Soporte Gestionado',
      badge: 'Cisco • SD-WAN • SLA < 15 min',
      desc: 'Mantenemos la continuidad operativa de su empresa con administración experta de servidores, redes seguras, conectividad SD-WAN y mesa de ayuda especializada.',
      benefits: [
        'Soporte técnico nivel 1, 2 y 3 con acuerdos de nivel de servicio (SLA) estrictos.',
        'Cableado estructurado, enlaces dedicados y seguridad perimetral.',
        'Mantenimiento preventivo y correctivo programado sin interrumpir labores.',
        'Inventario y gestión del ciclo de vida de activos tecnológicos.'
      ]
    },
    consulting: {
      title: 'Consultoría Estratégica & Gobierno TI',
      badge: 'Estrategia • Transformación Digital • Auditoría',
      desc: 'Alineamos las inversiones tecnológicas con los objetivos comerciales de su empresa. Diseñamos hojas de ruta de transformación digital para maximizar el retorno de inversión (ROI).',
      benefits: [
        'Evaluación de madurez digital y diagnóstico tecnológico integral.',
        'Optimización de licencias de software y reducción de gasto tecnológico.',
        'Selección e implementación de soluciones ERP/CRM de clase mundial.',
        'Acompañamiento a nivel C-Level (vCTO / Asesoría en Dirección TI).'
      ]
    }
  };

  // Open Service Modal
  serviceDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-service-key');
      const data = serviceDetails[serviceKey];
      if (!data) return;

      const modal = document.getElementById('serviceModal');
      const titleEl = document.getElementById('modalServiceTitle');
      const badgeEl = document.getElementById('modalServiceBadge');
      const descEl = document.getElementById('modalServiceDesc');
      const benefitsListEl = document.getElementById('modalServiceBenefits');

      if (titleEl) titleEl.textContent = data.title;
      if (badgeEl) badgeEl.textContent = data.badge;
      if (descEl) descEl.textContent = data.desc;
      if (benefitsListEl) {
        benefitsListEl.innerHTML = data.benefits.map(b => `
          <li style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem; font-size:0.9rem; color:var(--text-primary);">
            <span style="color:var(--accent-cyan); font-weight:bold;">✓</span> ${b}
          </li>
        `).join('');
      }

      if (modal) modal.classList.add('open');
    });
  });

  // Open Policy/Terms Modals
  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) targetModal.classList.add('open');
    });
  });

  // Close handlers
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modalBackdrops.forEach(m => m.classList.remove('open'));
    });
  });

  modalBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
      }
    });
  });

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBackdrops.forEach(m => m.classList.remove('open'));
    }
  });
}

/* ==========================================================================
   9. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-message toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   11. GAONABOT - SMART IT CONSULTANT CHATBOT ENGINE
   ========================================================================== */
function initChatbot() {
  const chatWidget = document.getElementById('gaonaChatWidget');
  const chatTriggerBtn = document.getElementById('chatTriggerBtn');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatResetBtn = document.getElementById('chatResetBtn');
  const chatMessagesBody = document.getElementById('chatMessagesBody');
  const chatInputForm = document.getElementById('chatInputForm');
  const chatInputField = document.getElementById('chatInputField');
  const chatPulseBadge = document.getElementById('chatPulseBadge');

  if (!chatWidget || !chatTriggerBtn) return;

  // Toggle Chat Widget Open/Close
  const toggleChat = () => {
    const isOpen = chatWidget.classList.toggle('open');
    if (isOpen) {
      if (chatPulseBadge) chatPulseBadge.style.display = 'none';
      if (chatInputField) chatInputField.focus();
      scrollChatToBottom();
    }
  };

  const closeChat = () => {
    chatWidget.classList.remove('open');
  };

  chatTriggerBtn.addEventListener('click', toggleChat);
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', closeChat);

  // Scroll helper
  const scrollChatToBottom = () => {
    setTimeout(() => {
      chatMessagesBody.scrollTop = chatMessagesBody.scrollHeight;
    }, 50);
  };

  // Append Message Helper
  const appendMessage = (sender, contentHtml) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.innerHTML = `
      <div class="chat-bubble">
        ${contentHtml}
      </div>
      <span class="chat-msg-time">${timeStr}</span>
    `;

    chatMessagesBody.appendChild(msgDiv);
    scrollChatToBottom();

    // Rebind any new chips inside the message
    msgDiv.querySelectorAll('.chat-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-chat-query');
        if (query) handleUserMessage(query);
      });
    });

    // Rebind action links to close chat if they navigate to a section
    msgDiv.querySelectorAll('.chat-action-link[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        closeChat();
      });
    });
  };

  // Typing Indicator Helper
  let typingEl = null;
  const showTyping = () => {
    if (typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'chat-msg bot';
    typingEl.id = 'chatTypingIndicator';
    typingEl.innerHTML = `
      <div class="chat-bubble typing-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    chatMessagesBody.appendChild(typingEl);
    scrollChatToBottom();
  };

  const hideTyping = () => {
    if (typingEl) {
      typingEl.remove();
      typingEl = null;
    }
  };

  // Bot Knowledge Base & Response Matcher
  const getBotResponse = (query) => {
    const q = query.toLowerCase().trim();

    // 1. Greetings
    if (q.match(/\b(hola|buenos d[ií]as|buenas tardes|buenas noches|hey|qu[eé] tal|saludos)\b/)) {
      return `
        ¡Hola! Es un gusto saludarte. Soy <strong>GaonaBot</strong>, tu asistente de consultoría en TI.
        <br><br>
        ¿Qué solución tecnológica estás buscando para tu empresa?
        <div class="chat-chips-group">
          <button class="chat-chip-btn" data-chat-query="Quiero migrar a la nube">☁️ Nube & DevOps</button>
          <button class="chat-chip-btn" data-chat-query="Auditoría de ciberseguridad">🛡️ Ciberseguridad</button>
          <button class="chat-chip-btn" data-chat-query="Desarrollo de software">💻 Software a Medida</button>
          <button class="chat-chip-btn" data-chat-query="Cotizar un proyecto">💰 Cotizador Rápido</button>
        </div>
      `;
    }

    // 2. Services Overview
    if (q.includes('servicio') || q.includes('ofrecen') || q.includes('hacen') || q.includes('soluciones')) {
      return `
        En <strong>Gaona Consultores TI</strong> ofrecemos 5 líneas estratégicas de solución empresarial:
        <br><br>
        1. <strong>☁️ Cloud & DevOps:</strong> Migraciones AWS/Azure/GCP, Kubernetes, IaC y FinOps.<br>
        2. <strong>🛡️ Ciberseguridad:</strong> Monitoreo SOC 24/7, Ethical Hacking y Zero Trust.<br>
        3. <strong>💻 Software a Medida:</strong> Aplicaciones web/móvil de alto rendimiento y microservicios.<br>
        4. <strong>🔌 Redes & Soporte:</strong> SD-WAN Cisco, servidores y mesa de ayuda con SLAs &lt; 15 min.<br>
        5. <strong>🎯 Consultoría TI:</strong> Auditorías, gobierno corporativo y planes DRP/BCP.
        <br>
        <a href="#servicios" class="chat-action-link">Ver Catálogo Completo →</a>
      `;
    }

    // 3. Cloud / DevOps
    if (q.includes('cloud') || q.includes('nube') || q.includes('aws') || q.includes('azure') || q.includes('devops') || q.includes('kubernetes') || q.includes('docker')) {
      return `
        <strong>☁️ Arquitectura Cloud & DevOps</strong>
        <br><br>
        Diseñamos infraestructuras de alta disponibilidad (99.99% SLA) en <strong>AWS, Microsoft Azure y Google Cloud</strong>.
        <br><br>
        • <strong>Cero Downtime:</strong> Migraciones planificadas sin interrupciones.<br>
        • <strong>FinOps:</strong> Reducción de costos de consumo en hasta 40%.<br>
        • <strong>Automatización:</strong> CI/CD continuo con Terraform y Kubernetes.
        <br>
        <a href="#contacto" class="chat-action-link">Solicitar Asesoría Cloud →</a>
      `;
    }

    // 4. Cybersecurity / SOC
    if (q.includes('seguridad') || q.includes('ciberseguridad') || q.includes('soc') || q.includes('pentesting') || q.includes('hack') || q.includes('iso 27001') || q.includes('ataque') || q.includes('virus')) {
      return `
        <strong>🛡️ Ciberseguridad & SOC 24/7</strong>
        <br><br>
        Protegemos la continuidad y los activos confidenciales de tu organización:
        <br><br>
        • <strong>SOC Gestionado:</strong> Monitoreo activo de amenazas 24/7/365.<br>
        • <strong>Pentesting Ofensivo:</strong> Detección y corrección de vulnerabilidades.<br>
        • <strong>Cumplimiento:</strong> Alineación con ISO 27001, GDPR y Zero Trust.
        <br>
        <a href="#contacto" class="chat-action-link">Solicitar Auditoría de Seguridad →</a>
      `;
    }

    // 5. Software Development
    if (q.includes('software') || q.includes('app') || q.includes('desarrollo') || q.includes('programar') || q.includes('api') || q.includes('web') || q.includes('sistema')) {
      return `
        <strong>💻 Desarrollo de Software a la Medida</strong>
        <br><br>
        Construimos plataformas empresariales escalables con metodologías ágiles (Scrum):
        <br><br>
        • <strong>Fullstack Moderno:</strong> Aplicaciones web responsivas y APIs robustas.<br>
        • <strong>Integraciones:</strong> Conexión directa a ERPs (SAP, Oracle), CRMs y bases de datos.<br>
        • <strong>Propiedad:</strong> 100% del código fuente entregado al cliente.
        <br>
        <a href="#cotizador" class="chat-action-link">Calcular Presupuesto Software →</a>
      `;
    }

    // 6. Pricing & Estimates
    if (q.includes('precio') || q.includes('costo') || q.includes('cotiz') || q.includes('presupuesto') || q.includes('cuanto cuesta') || q.includes('cuánto cuesta') || q.includes('tarifa')) {
      return `
        <strong>💰 Cotizaciones y Presupuestos</strong>
        <br><br>
        Manejamos presupuestos transparentes según el alcance de tu empresa (Startup, PyME o Corporativo).
        <br><br>
        Nuestros rangos base referenciales inician desde <strong>$24,000 a $45,000 MXN</strong> para servicios estructurados con entrega llave en mano o pólizas gestionadas.
        <br><br>
        Puedes usar nuestra calculadora en tiempo real:
        <br>
        <a href="#cotizador" class="chat-action-link">⚡ Abrir Cotizador Interactivo →</a>
      `;
    }

    // 7. Free Diagnosis / Initial Meeting
    if (q.includes('diagnostico') || q.includes('diagnóstico') || q.includes('gratis') || q.includes('gratuito') || q.includes('asesoria') || q.includes('asesoría') || q.includes('cita') || q.includes('agendar')) {
      return `
        <strong>⚡ Diagnóstico TI Gratuito (30 minutos)</strong>
        <br><br>
        Agendamos una sesión virtual con un Consultor Senior para:
        <br>
        1. Analizar tu infraestructura o requerimiento actual.<br>
        2. Identificar riesgos, cuellos de botella y oportunidades de ahorro.<br>
        3. Entregar una propuesta técnica personalizada sin compromiso.
        <br><br>
        <a href="#contacto" class="chat-action-link">📅 Agendar Sesión de Diagnóstico →</a>
      `;
    }

    // 8. SLA & Critical Support Times
    if (q.includes('sla') || q.includes('tiempo') || q.includes('respuesta') || q.includes('urgente') || q.includes('emergencia') || q.includes('soporte') || q.includes('mesa de ayuda')) {
      return `
        <strong>⏱️ Tiempos de Respuesta y SLAs Garantizados</strong>
        <br><br>
        • <strong>Severidad 1 (Crítica):</strong> Respuesta garantizada en <strong>&lt; 15 minutos</strong>.<br>
        • <strong>Disponibilidad:</strong> Mesa de ayuda y monitoreo <strong>24/7/365</strong>.<br>
        • <strong>Uptime Cloud:</strong> Acuerdos de nivel de servicio del <strong>99.9%</strong>.
        <br>
        <a href="#contacto" class="chat-action-link">Contratar Póliza de Soporte →</a>
      `;
    }

    // 9. Contact / Phones / Location
    if (q.includes('contacto') || q.includes('telefono') || q.includes('teléfono') || q.includes('correo') || q.includes('ubicacion') || q.includes('ubicación') || q.includes('direccion') || q.includes('dirección') || q.includes('donde') || q.includes('dónde') || q.includes('whatsapp')) {
      return `
        <strong>📍 Datos de Contacto de Gaona Consultores TI:</strong>
        <br><br>
        • <strong>📞 Teléfono:</strong> <a href="tel:+525584329000" style="color:var(--accent-cyan);">+52 (55) 8432-9000</a><br>
        • <strong>✉️ Correo:</strong> <a href="mailto:contacto@gaonaconsultores.com" style="color:var(--accent-cyan);">contacto@gaonaconsultores.com</a><br>
        • <strong>🏢 Ubicación:</strong> Av. Insurgentes Sur 1602, Crédito Constructor, Benito Juárez, CDMX.<br>
        • <strong>⏰ Horario:</strong> Lun - Vie: 8:30 AM - 6:30 PM (Soporte crítico 24/7).
        <br><br>
        <a href="https://wa.me/525584329000?text=Hola%20Gaona%20Consultores,%20solicito%20informaci%C3%B3n." target="_blank" class="chat-action-link">💬 Chat directo por WhatsApp →</a>
      `;
    }

    // 10. NDA & Confidentiality
    if (q.includes('nda') || q.includes('confidencial') || q.includes('codigo') || q.includes('código') || q.includes('contrato') || q.includes('seguro')) {
      return `
        <strong>🔒 Confidencialidad y Propiedad Intelectual</strong>
        <br><br>
        • <strong>NDA Estricto:</strong> Firmamos acuerdos de confidencialidad desde el primer acercamiento.<br>
        • <strong>Propiedad Total:</strong> El cliente es dueño del 100% del código fuente, arquitecturas y credenciales.<br>
        • <strong>Sin ataduras:</strong> Cero dependencias cautivas o cobros ocultos.
      `;
    }

    // 11. Thanks / Farewell
    if (q.match(/\b(gracias|muchas gracias|perfecto|excelente|vale|ok|adios|adiós|hasta luego)\b/)) {
      return `
        ¡Con mucho gusto! En <strong>Gaona Consultores TI</strong> estamos listos para llevar tu infraestructura tecnológica al siguiente nivel.
        <br><br>
        Si deseas hablar directamente con un ingeniero, puedes agendar aquí:
        <br>
        <a href="#contacto" class="chat-action-link">Agendar Reunión →</a>
      `;
    }

    // 12. Fallback
    return `
      Entendido. Para darte la orientación más precisa sobre <em>"${query}"</em>, te recomiendo una de estas acciones inmediatas:
      <br><br>
      • Agendar una llamada técnica de 30 min.<br>
      • Escribirnos directamente por WhatsApp.<br>
      • Usar el cotizador en línea.
      <br><br>
      <a href="#contacto" class="chat-action-link">📅 Agendar Diagnóstico</a>
      <a href="https://wa.me/525584329000?text=Hola%20Gaona%20Consultores,%20tengo%20una%20consulta%20sobre%20TI." target="_blank" class="chat-action-link">💬 WhatsApp</a>
      <a href="#cotizador" class="chat-action-link">⚡ Cotizar</a>
    `;
  };

  // Main Handle Message Flow
  const handleUserMessage = (userText) => {
    if (!userText || !userText.trim()) return;

    // Append User Message
    appendMessage('user', escapeHtml(userText.trim()));
    if (chatInputField) chatInputField.value = '';

    // Show bot typing simulation
    showTyping();

    const replyDelay = Math.min(1200, Math.max(600, userText.length * 25));

    setTimeout(() => {
      hideTyping();
      const botReplyHtml = getBotResponse(userText);
      appendMessage('bot', botReplyHtml);
    }, replyDelay);
  };

  // Escape HTML helper
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Form Submit
  chatInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInputField) {
      handleUserMessage(chatInputField.value);
    }
  });

  // Initial Chips Event Listener
  chatMessagesBody.querySelectorAll('.chat-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-chat-query');
      if (query) handleUserMessage(query);
    });
  });

  // Reset Conversation
  if (chatResetBtn) {
    chatResetBtn.addEventListener('click', () => {
      chatMessagesBody.innerHTML = `
        <div class="chat-msg bot">
          <div class="chat-bubble">
            👋 Conversación reiniciada. Soy <strong>GaonaBot</strong>, ¿en qué te puedo apoyar hoy?
            <div class="chat-chips-group">
              <button class="chat-chip-btn" data-chat-query="¿Qué servicios ofrecen?">🚀 Ver Servicios TI</button>
              <button class="chat-chip-btn" data-chat-query="¿Cómo funciona el diagnóstico gratuito?">⚡ Diagnóstico Gratis</button>
              <button class="chat-chip-btn" data-chat-query="Quiero cotizar un proyecto">💰 Cotizar Proyecto</button>
              <button class="chat-chip-btn" data-chat-query="¿Cuál es su tiempo de respuesta en soporte?">⏱️ Tiempos de SLA</button>
              <button class="chat-chip-btn" data-chat-query="¿Dónde están ubicados y teléfonos?">📍 Contacto Directo</button>
            </div>
          </div>
          <span class="chat-msg-time">Ahora</span>
        </div>
      `;

      chatMessagesBody.querySelectorAll('.chat-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const query = btn.getAttribute('data-chat-query');
          if (query) handleUserMessage(query);
        });
      });
      showToast('Chat reiniciado.');
    });
  }
}

