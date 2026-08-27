const WARNING_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9.5 16.5H2.5L12 3z"/><line x1="12" y1="10" x2="12" y2="14.5"/><circle cx="12" cy="17.2" r="0.6" fill="currentColor" stroke="none"/></svg>';
const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
const SHIELD_ICON = '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/>';

const SEVERITY_LABEL = { critical: 'Critical', high: 'High', medium: 'Medium' };

function renderThreatCard(threat) {
  const card = document.createElement('article');
  card.className = 'threat-card';
  card.id = threat.id;

  const mitigationItems = threat.mitigations
    .map((m) => `<li>${CHECK_ICON}<span>${m}</span></li>`)
    .join('');

  card.innerHTML = `
    <div class="threat-head">
      <span class="threat-warn">${WARNING_ICON}</span>
      <h3 class="threat-title">${threat.title}</h3>
      <div class="threat-badges">
        <span class="badge severity-${threat.severity}">${SEVERITY_LABEL[threat.severity] || threat.severity}</span>
        <span class="badge owasp-badge" title="${threat.owaspName}">${threat.owaspId}</span>
      </div>
    </div>
    <p class="threat-desc">${threat.description}</p>
    <div class="threat-block risk-block">
      <h4>Attack vector</h4>
      <p>${threat.attackVector}</p>
    </div>
    <div class="threat-block example-block">
      <h4>Example</h4>
      <p>${threat.example}</p>
    </div>
    <div class="threat-block mitigation-block">
      <h4>${CHECK_ICON} Mitigations</h4>
      <ul class="mitigation-list">${mitigationItems}</ul>
    </div>
  `;
  return card;
}

function renderPatternCard(pattern) {
  const card = document.createElement('article');
  card.className = 'pattern-card';

  const practiceItems = pattern.practices
    .map((p) => `<li>${CHECK_ICON}<span>${p}</span></li>`)
    .join('');

  card.innerHTML = `
    <div class="pattern-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${SHIELD_ICON}</svg>
    </div>
    <div class="pattern-body">
      <h3 class="pattern-title">${pattern.title}</h3>
      <p class="pattern-desc">${pattern.description}</p>
      <ul class="pattern-list">${practiceItems}</ul>
    </div>
  `;
  return card;
}

function currentTheme() {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const SUN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
const MOON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function paint(theme) {
    btn.innerHTML = theme === 'dark' ? SUN_ICON : MOON_ICON;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  paint(currentTheme());

  btn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      /* localStorage unavailable — theme just won't persist */
    }
    paint(next);
  });
}

async function init() {
  initThemeToggle();

  const threatsEl = document.getElementById('threats');
  const patternsEl = document.getElementById('patterns');

  try {
    const res = await fetch('threats.json', { cache: 'no-store' });
    const data = await res.json();

    data.threats.forEach((threat) => threatsEl.appendChild(renderThreatCard(threat)));
    data.patterns.forEach((pattern) => patternsEl.appendChild(renderPatternCard(pattern)));
  } catch (err) {
    const msg = '<p class="load-error">Couldn\'t load the catalog. Try refreshing.</p>';
    threatsEl.innerHTML = msg;
    patternsEl.innerHTML = '';
    console.error('Failed to load threats.json', err);
  }
}

init();
