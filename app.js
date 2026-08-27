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

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function animateAttrs(attrs) {
  if (prefersReducedMotion()) return '';
  return attrs
    .map(
      ({ name, values, dur, begin }) =>
        `<animate attributeName="${name}" values="${values}" dur="${dur}" ${begin ? `begin="${begin}"` : ''} repeatCount="indefinite"/>`
    )
    .join('');
}

function renderChannelFlow() {
  const wrap = document.createElement('figure');
  wrap.className = 'flow-diagram';
  wrap.innerHTML = `
    <figcaption class="flow-caption">Instructions and data share one channel</figcaption>
    <svg viewBox="0 0 600 170" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <line class="flow-rail instr" x1="70" y1="40" x2="330" y2="85"/>
      <line class="flow-rail data" x1="70" y1="130" x2="330" y2="85"/>
      <line class="flow-rail merged" x1="330" y1="85" x2="560" y2="85"/>

      <circle class="flow-node-core" cx="70" cy="40" r="6"/>
      <circle class="flow-node-core" cx="70" cy="130" r="6"/>
      <circle class="flow-node-core model" cx="330" cy="85" r="9"/>
      <circle class="flow-node-core" cx="560" cy="85" r="6"/>

      <text class="flow-label" x="70" y="22" text-anchor="middle">User input</text>
      <text class="flow-label" x="70" y="152" text-anchor="middle">Tool / doc output</text>
      <text class="flow-label strong" x="330" y="112" text-anchor="middle">Model context window</text>
      <text class="flow-label" x="560" y="112" text-anchor="middle">Response / action</text>
      <text class="flow-annotate" x="445" y="72" text-anchor="middle">no structural boundary</text>

      <circle class="flow-packet instr" r="4" cx="70" cy="40">
        ${animateAttrs([
          { name: 'cx', values: '70;330', dur: '2.6s' },
          { name: 'cy', values: '40;85', dur: '2.6s' },
        ])}
      </circle>
      <circle class="flow-packet data" r="4" cx="70" cy="130">
        ${animateAttrs([
          { name: 'cx', values: '70;330', dur: '2.6s', begin: '0.4s' },
          { name: 'cy', values: '130;85', dur: '2.6s', begin: '0.4s' },
        ])}
      </circle>
      <circle class="flow-packet merged" r="4" cx="330" cy="85">
        ${animateAttrs([{ name: 'cx', values: '330;560', dur: '1.7s', begin: '0.9s' }])}
      </circle>
    </svg>
  `;
  return wrap;
}

function renderDefenseFlow() {
  const wrap = document.createElement('figure');
  wrap.className = 'flow-diagram';
  wrap.innerHTML = `
    <figcaption class="flow-caption">Layered controls before an action executes</figcaption>
    <svg viewBox="0 0 640 140" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <line class="flow-rail merged" x1="50" y1="70" x2="590" y2="70"/>

      <circle class="flow-node-core risk" cx="50" cy="70" r="7"/>
      <circle class="flow-node-core gate" cx="158" cy="70" r="7"/>
      <circle class="flow-node-core gate" cx="266" cy="70" r="7"/>
      <circle class="flow-node-core gate" cx="374" cy="70" r="7"/>
      <circle class="flow-node-core gate-outer" cx="482" cy="70" r="10"/>
      <circle class="flow-node-core gate-inner" cx="482" cy="70" r="4"/>
      <circle class="flow-node-core safe" cx="590" cy="70" r="7"/>

      <text class="flow-label" x="50" y="94" text-anchor="middle">Untrusted input</text>
      <text class="flow-label" x="158" y="94" text-anchor="middle">Filter</text>
      <text class="flow-label" x="266" y="94" text-anchor="middle">Sandbox</text>
      <text class="flow-label" x="374" y="94" text-anchor="middle">Least privilege</text>
      <text class="flow-label" x="482" y="94" text-anchor="middle">Human approval</text>
      <text class="flow-label strong" x="590" y="94" text-anchor="middle">Action executed</text>

      <circle class="flow-packet safe" r="5" cx="50" cy="70">
        ${animateAttrs([{ name: 'cx', values: '50;158;266;374;482;590', dur: '6s' }])}
      </circle>
    </svg>
  `;
  return wrap;
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
  const channelFlowEl = document.getElementById('flow-channel');
  const defenseFlowEl = document.getElementById('flow-defense');

  if (channelFlowEl) channelFlowEl.appendChild(renderChannelFlow());
  if (defenseFlowEl) defenseFlowEl.appendChild(renderDefenseFlow());

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
