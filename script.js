'use strict';

// ── Section order ──
const SECTIONS = ['inicio', 'servicios', 'productos', 'nosotros', 'contacto'];
let currentSection = 'inicio';
let isTransitioning = false;

// ── Navigate to a section ──
function navigateTo(id, pushState = true) {
  if (!SECTIONS.includes(id) || (id === currentSection && !isTransitioning === false)) return;
  if (id === currentSection) return;

  isTransitioning = true;

  const leaving = document.getElementById(currentSection);
  const entering = document.getElementById(id);

  if (leaving) leaving.classList.remove('active');
  if (entering) {
    entering.classList.add('active');
    entering.scrollTop = 0;
  }

  currentSection = id;
  updateDots(id);
  updateNavLinks(id);

  if (pushState) {
    history.pushState({ section: id }, '', '#' + id);
  }

  // Re-trigger animate-item transitions each time section opens
  if (entering) {
    const items = entering.querySelectorAll('.animate-item');
    items.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    });
    // Small delay so the section is visible before animating items
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        items.forEach(el => {
          el.style.opacity = '';
          el.style.transform = '';
        });
      });
    });
  }

  // Special: animate terminal on "nosotros"
  if (id === 'nosotros') animateTerminal();

  // Special: start counters on "inicio"
  if (id === 'inicio') startCounters();

  setTimeout(() => { isTransitioning = false; }, 420);
}
window.navigateTo = navigateTo;

// ── Update side dots ──
function updateDots(id) {
  document.querySelectorAll('.side-dots .dot').forEach(d => {
    d.classList.toggle('dot-active', d.dataset.target === id);
  });
}

// ── Update navbar links ──
function updateNavLinks(id) {
  document.querySelectorAll('.nav-links a[data-target]').forEach(a => {
    a.classList.toggle('nav-active', a.dataset.target === id);
  });
}

// ── Bind all navigation triggers ──
function bindNav() {
  // All elements with data-target
  document.querySelectorAll('[data-target]').forEach(el => {
    const tag = el.tagName.toLowerCase();
    // Skip nav-logo anchor (handled separately)
    el.addEventListener('click', e => {
      const target = el.dataset.target;
      if (SECTIONS.includes(target)) {
        e.preventDefault();
        navigateTo(target);
        // Close mobile menu
        document.getElementById('navLinks').classList.remove('open');
      }
    });
  });
}

// ── Mobile burger ──
document.getElementById('navBurger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// ── Browser back/forward ──
window.addEventListener('popstate', e => {
  const id = (e.state && e.state.section) || 'inicio';
  navigateTo(id, false);
});

// ── Keyboard navigation ──
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  const idx = SECTIONS.indexOf(currentSection);
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault();
    if (idx < SECTIONS.length - 1) navigateTo(SECTIONS[idx + 1]);
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault();
    if (idx > 0) navigateTo(SECTIONS[idx - 1]);
  } else if (e.key === 'Escape') {
    closeModal();
  }
});

// ── Counter animation ──
let countersStarted = false;
function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  document.querySelectorAll('.stat-num').forEach(el => {
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

// ── Terminal typing effect ──
let terminalDone = false;
function animateTerminal() {
  if (terminalDone) return;
  terminalDone = true;
  const lines = document.querySelectorAll('.terminal-body .t-line');
  lines.forEach((line, i) => {
    setTimeout(() => { line.style.opacity = '1'; }, 300 + i * 200);
  });
}

// ── Products filter ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.product-card[data-category]').forEach(card => {
      const cats = card.dataset.category || '';
      card.classList.toggle('hidden', filter !== 'all' && !cats.includes(filter));
    });
  });
});

// ── Modal ──
const modalData = {
  'InvoiceFlow':   'Sistema completo de facturación electrónica y cotizaciones. Genera PDFs profesionales, gestiona tu cartera de clientes, controla cuentas por cobrar y obtén reportes financieros automáticos. Compatible con SII Chile.',
  'TaskBoard Pro': 'Gestión de proyectos y equipos con tableros Kanban, seguimiento de tiempos, asignación de tareas, notificaciones por correo y dashboard de productividad. Ideal para equipos de 1 a 50 personas.',
  'WebPresence':   'Plataforma todo-en-uno para tu presencia digital corporativa. Editor drag & drop, blog integrado, formularios de contacto, Google Analytics, optimización SEO y hosting incluido.',
  'StockMaster':   'Control de inventario en tiempo real con lectura de códigos QR/barras, alertas de stock mínimo, trazabilidad por lote, múltiples bodegas y reportes de rotación de productos.',
};
const overlay    = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalBody  = document.getElementById('modalBody');

function openModal(name) {
  modalTitle.textContent = name;
  modalBody.textContent  = modalData[name] || 'Contáctanos para más información.';
  overlay.classList.add('open');
}
function closeModal() {
  overlay.classList.remove('open');
}
window.openModal  = openModal;
window.closeModal = closeModal;
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

// ── Contact form ──
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled   = true;
  btn.innerHTML  = '<span>Enviando...</span>';
  setTimeout(() => {
    e.target.reset();
    btn.disabled  = false;
    btn.innerHTML = '<span>Enviar mensaje</span><svg viewBox="0 0 20 20" fill="none"><path d="M3 10h14M10 3l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    const success = document.getElementById('formSuccess');
    success.classList.add('visible');
    setTimeout(() => success.classList.remove('visible'), 5000);
  }, 1200);
});

// ── Init ──
(function init() {
  bindNav();

  // Read hash on load
  const hash = location.hash.replace('#', '');
  const startSection = SECTIONS.includes(hash) ? hash : 'inicio';

  // Set initial state without transition
  currentSection = startSection;
  const startEl = document.getElementById(startSection);
  if (startEl) startEl.classList.add('active');
  updateDots(startSection);
  updateNavLinks(startSection);
  history.replaceState({ section: startSection }, '', '#' + startSection);

  if (startSection === 'inicio') startCounters();
  if (startSection === 'nosotros') animateTerminal();
})();
