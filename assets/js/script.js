'use strict';

// sidebar toggle (mobile)
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

sidebarBtn?.addEventListener('click', () => {
  const open = sidebar?.classList.toggle('active');
  sidebarBtn.setAttribute('aria-expanded', String(Boolean(open)));
});

// project modal
const testimonialsItems = document.querySelectorAll('[data-testimonials-item]');
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');
const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

let lastModalTrigger = null;

const toggleModal = () => {
  const isOpen = modalContainer?.classList.toggle('active');
  overlay?.classList.toggle('active');
  document.body.style.overflow = isOpen ? 'hidden' : '';
  if (!isOpen && lastModalTrigger) {
    lastModalTrigger.focus();
    lastModalTrigger = null;
  }
};

const openModal = (item) => {
  lastModalTrigger = item;
  const avatar = item.querySelector('[data-testimonials-avatar]');

  if (modalImg && avatar) {
    modalImg.src = avatar.src;
    modalImg.alt = avatar.alt;
  }
  if (modalTitle) modalTitle.innerHTML = item.querySelector('[data-testimonials-title]')?.innerHTML ?? '';
  if (modalText) modalText.innerHTML = item.querySelector('[data-testimonials-text]')?.innerHTML ?? '';

  toggleModal();
  modalCloseBtn?.focus();
};

testimonialsItems.forEach((item) => {
  item.addEventListener('click', () => openModal(item));
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(item);
    }
  });
});

modalCloseBtn?.addEventListener('click', toggleModal);
overlay?.addEventListener('click', toggleModal);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalContainer?.classList.contains('active')) toggleModal();
});

// contact form validation
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

formInputs.forEach((input) => {
  input.addEventListener('input', () => {
    if (form && formBtn) formBtn.disabled = !form.checkValidity();
  });
});

// page navigation
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

const showPage = (name) => {
  pages.forEach((page) => page.classList.toggle('active', page.dataset.page === name));
  navigationLinks.forEach((link) => {
    const current = link.dataset.navLink === name;
    link.classList.toggle('active', current);
    if (current) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
};

navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    showPage(link.dataset.navLink);
    history.replaceState(null, '', `#${link.dataset.navLink}`);
    window.scrollTo(0, 0);
  });
});

// deep links: /#resume opens the Resume tab directly
const initialPage = window.location.hash.slice(1);
if ([...pages].some((page) => page.dataset.page === initialPage)) showPage(initialPage);

// competency radar (About page)
const radarSvg = document.getElementById('competency-radar');

if (radarSvg) {
  const COMPETENCIES = [
    {
      label: 'People Leadership & Talent Growth',
      value: 1,
      level: 'Expert',
      text: 'Hired and grew a 100+ person engineering organisation; the Tech Mastery programme trained and certified 40+ engineers; chapter leads developed into force multipliers.',
    },
    {
      label: 'Organisational Design at Scale',
      value: 1,
      level: 'Expert',
      text: 'Designed the organisation behind three product tribes — structures, roles, governance and career paths — from a blank page to a working 100+ person system.',
    },
    {
      label: 'Performance Engineering',
      value: 0.55,
      level: 'Proficient',
      text: 'Built load-testing practices and a performance team with standardised playbooks for high-load systems (JMeter, Grafana, Vegeta).',
    },
    {
      label: 'Execution & Delivery Governance',
      value: 0.88,
      level: 'Advanced',
      text: 'Release governance and SDLC standards that made delivery predictable across the ecosystem; test automation scaled from 0% to 40% of the core regression suite.',
    },
    {
      label: 'Data-Driven Management',
      value: 0.85,
      level: 'Advanced',
      text: '10+ quality and efficiency metrics wired into Tableau and Jira; KPI and OKR frameworks linking engineering work to business goals.',
    },
    {
      label: 'Technical Strategy & Budget Ownership',
      value: 0.8,
      level: 'Advanced',
      text: 'Owned a 2-year engineering quality strategy end to end — the roadmap, the hiring plans and the budget behind them.',
    },
    {
      label: 'Quality Engineering & Standards',
      value: 1,
      level: 'Expert',
      text: 'Built a Quality Center of Excellence from scratch: company-wide Quality Gates and Zero Bug Policy that cut critical production incidents by 50%+.',
    },
  ];

  const MATURITY_RINGS = [
    { value: 0.25, label: 'Familiar' },
    { value: 0.5, label: 'Proficient' },
    { value: 0.75, label: 'Advanced' },
    { value: 1, label: 'Expert' },
  ];

  const NS = 'http://www.w3.org/2000/svg';
  const CX = 200;
  const CY = 200;
  const RADIUS = 128;
  const LABEL_RADIUS = 146;
  const detailTitle = document.querySelector('[data-competency-title]');
  const detailText = document.querySelector('[data-competency-text]');

  const angleOf = (index) => (Math.PI / 180) * (-90 + index * (360 / COMPETENCIES.length));
  const pointAt = (index, radius) => [CX + radius * Math.cos(angleOf(index)), CY + radius * Math.sin(angleOf(index))];

  const el = (name, attrs) => {
    const node = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([key, val]) => node.setAttribute(key, val));
    return node;
  };

  // labelled maturity rings + axes
  MATURITY_RINGS.forEach((ring) => {
    const points = COMPETENCIES.map((_, i) => pointAt(i, RADIUS * ring.value).join(',')).join(' ');
    radarSvg.appendChild(el('polygon', { points, class: 'radar-grid', 'aria-hidden': 'true' }));

    const ringLabel = el('text', {
      x: CX + 6, y: CY - RADIUS * ring.value + 11, 'text-anchor': 'start', class: 'radar-ring-label',
      'aria-hidden': 'true',
    });
    ringLabel.textContent = ring.label;
    radarSvg.appendChild(ringLabel);
  });
  const axes = COMPETENCIES.map((_, i) => {
    const [x, y] = pointAt(i, RADIUS);
    const line = el('line', { x1: CX, y1: CY, x2: x, y2: y, class: 'radar-axis', 'aria-hidden': 'true' });
    radarSvg.appendChild(line);
    return line;
  });

  // value shape
  const shapePoints = COMPETENCIES.map((c, i) => pointAt(i, RADIUS * c.value).join(',')).join(' ');
  radarSvg.appendChild(el('polygon', { points: shapePoints, class: 'radar-shape', 'aria-hidden': 'true' }));

  // countdown ring around the active dot — shows when the next switch happens
  const RING_R = 13;
  const RING_CIRC = 2 * Math.PI * RING_R;
  const progressRing = el('circle', {
    cx: CX, cy: CY, r: RING_R, class: 'radar-progress', 'aria-hidden': 'true',
    'stroke-dasharray': RING_CIRC.toFixed(2), 'stroke-dashoffset': RING_CIRC.toFixed(2),
  });
  radarSvg.appendChild(progressRing);

  const dots = [];
  const labels = [];

  const detailLevel = document.querySelector('[data-competency-level]');

  let current = 0;
  let paused = false;

  const select = (index) => {
    current = index;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    labels.forEach((label, i) => label.classList.toggle('active', i === index));
    if (detailTitle) detailTitle.textContent = COMPETENCIES[index].label;
    if (detailText) detailText.textContent = COMPETENCIES[index].text;
    if (detailLevel) {
      detailLevel.textContent = COMPETENCIES[index].level;
      detailLevel.dataset.level = COMPETENCIES[index].level.toLowerCase();
    }

    axes.forEach((axis, i) => axis.classList.toggle('active', i === index));

    // move the countdown ring onto the active dot and restart its fill
    const [rx, ry] = pointAt(index, RADIUS * COMPETENCIES[index].value);
    progressRing.setAttribute('cx', rx);
    progressRing.setAttribute('cy', ry);
    progressRing.classList.remove('is-counting');
    void progressRing.getBoundingClientRect();
    if (!paused) progressRing.classList.add('is-counting');

    // restart the swap animation so each change reads as a deliberate transition
    const panel = document.querySelector('[data-competency-detail]');
    if (panel) {
      panel.classList.remove('is-swapping');
      void panel.offsetWidth;
      panel.classList.add('is-swapping');
    }
  };

  COMPETENCIES.forEach((c, i) => {
    const [x, y] = pointAt(i, RADIUS * c.value);

    // generous invisible tap target behind the visible dot (mobile)
    const hit = el('circle', { cx: x, cy: y, r: 22, fill: 'transparent' });
    hit.style.cursor = 'pointer';
    hit.addEventListener('mouseenter', () => select(i));
    hit.addEventListener('click', () => select(i));
    radarSvg.appendChild(hit);

    const dot = el('circle', {
      cx: x, cy: y, r: 6, class: 'radar-dot', tabindex: '0', role: 'button',
      'aria-label': `${c.label} — ${c.level}`,
    });
    dot.addEventListener('mouseenter', () => select(i));
    dot.addEventListener('focus', () => select(i));
    dot.addEventListener('click', () => select(i));
    radarSvg.appendChild(dot);
    dots.push(dot);

    const [lx, ly] = pointAt(i, LABEL_RADIUS);
    const anchor = Math.abs(lx - CX) < 10 ? 'middle' : lx > CX ? 'start' : 'end';
    const label = el('text', { x: lx, y: ly, 'text-anchor': anchor, class: 'radar-label', 'aria-hidden': 'true' });
    const words = c.label.split(' ');
    const half = Math.ceil(words.length / 2);
    const lines = words.length > 2 ? [words.slice(0, half).join(' '), words.slice(half).join(' ')] : [c.label];
    lines.forEach((line, lineIndex) => {
      const tspan = el('tspan', { x: lx, dy: lineIndex === 0 ? (lines.length > 1 ? '-0.2em' : '0.35em') : '1.2em' });
      tspan.textContent = line;
      label.appendChild(tspan);
    });
    label.addEventListener('mouseenter', () => select(i));
    label.addEventListener('click', () => select(i));
    radarSvg.appendChild(label);
    labels.push(label);
  });

  // autoplay: cycle through competencies, pause while the user interacts
  const CYCLE_MS = 5200;
  const chart = radarSvg.closest('[data-competency-chart]') ?? radarSvg.parentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let cycleTimer = null;

  const stopCycle = () => {
    if (cycleTimer) {
      clearInterval(cycleTimer);
      cycleTimer = null;
    }
    progressRing.style.animationPlayState = 'paused';
  };

  const startCycle = () => {
    stopCycle();
    if (paused || reduceMotion.matches) return;
    progressRing.style.animationPlayState = 'running';
    progressRing.classList.remove('is-counting');
    void progressRing.getBoundingClientRect();
    progressRing.classList.add('is-counting');
    cycleTimer = setInterval(() => {
      select((current + 1) % COMPETENCIES.length);
    }, CYCLE_MS);
  };

  // manual interaction takes over; autoplay resumes when the pointer leaves
  const pause = () => {
    paused = true;
    stopCycle();
  };


  const resume = () => {
    paused = false;
    startCycle();
  };

  if (chart) {
    chart.addEventListener('mouseenter', pause);
    chart.addEventListener('mouseleave', resume);
    chart.addEventListener('focusin', pause);
    chart.addEventListener('focusout', (event) => {
      if (!chart.contains(event.relatedTarget)) resume();
    });
    chart.addEventListener('touchstart', pause, { passive: true });
  }

  document.addEventListener('visibilitychange', () => (document.hidden ? stopCycle() : startCycle()));
  reduceMotion.addEventListener('change', startCycle);

  select(0);
  startCycle();
}

// live local time (Baku, GMT+4) in the sidebar
const localTime = document.querySelector('[data-local-time]');

if (localTime) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Baku',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  let clockTimer = null;
  const tick = () => { localTime.textContent = formatter.format(new Date()); };
  const runClock = () => {
    clearInterval(clockTimer);
    tick();
    if (!document.hidden) clockTimer = setInterval(tick, 1000);
  };
  runClock();
  document.addEventListener('visibilitychange', runClock);
}
