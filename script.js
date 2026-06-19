'use strict';

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile burger ──
const burger   = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Counter animation ──
const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;
function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  counters.forEach(el => {
    const target = +el.dataset.target;
    const step   = Math.ceil(target / 40);
    let current  = 0;
    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

// ── Scroll reveal (data-aos) ──
const aosEls = document.querySelectorAll('[data-aos]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
aosEls.forEach(el => observer.observe(el));

// Hero stats trigger
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { startCounters(); statsObs.disconnect(); }
  }, { threshold: 0.5 });
  statsObs.observe(heroStats);
}

// ── Products filter ──
const filterBtns   = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    productCards.forEach(card => {
      const cats = card.dataset.category || '';
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);
    });
  });
});

// ── Modal ──
const modalProducts = {
  'InvoiceFlow': 'Sistema completo de facturación electrónica y cotizaciones. Genera PDFs profesionales, gestiona tu cartera de clientes, controla cuentas por cobrar y obtén reportes financieros automáticos. Compatible con SII Chile.',
  'TaskBoard Pro': 'Gestión de proyectos y equipos con tableros Kanban, seguimiento de tiempos, asignación de tareas, notificaciones por correo y dashboard de productividad. Ideal para equipos de 1 a 50 personas.',
  'WebPresence': 'Plataforma todo-en-uno para tu presencia digital corporativa. Editor drag & drop, blog integrado, formularios de contacto, Google Analytics, optimización SEO y hosting incluido.',
  'StockMaster': 'Control de inventario en tiempo real con lectura de códigos QR/barras, alertas de stock mínimo, trazabilidad por lote, múltiples bodegas y reportes de rotación de productos.',
};

const overlay    = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalBody  = document.getElementById('modalBody');

function openModal(name) {
  modalTitle.textContent = name;
  modalBody.textContent  = modalProducts[name] || 'Contáctanos para más información sobre este producto.';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
window.openModal  = openModal;
window.closeModal = closeModal;

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── Contact form ──
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled    = true;
  btn.innerHTML   = '<span>Enviando...</span>';

  // Simulate async send
  setTimeout(() => {
    form.reset();
    btn.disabled  = false;
    btn.innerHTML = '<span>Enviar mensaje</span><svg viewBox="0 0 20 20" fill="none"><path d="M3 10h14M10 3l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    formSuccess.classList.add('visible');
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
  }, 1200);
});

// ── Terminal typing effect ──
const termLines = document.querySelectorAll('.terminal-body .t-line');
termLines.forEach((line, i) => {
  line.style.opacity = '0';
  setTimeout(() => {
    line.style.transition = 'opacity .3s';
    line.style.opacity = '1';
  }, 400 + i * 220);
});

// ── Smooth active nav link highlight ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObs.observe(s));
