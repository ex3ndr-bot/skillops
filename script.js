const state = {
  skills: [],
  stats: { total_skills: 0, categories: 0, compliance_percent: 0, critical_findings: 0 },
  categories: [],
  comparison: null,
  findings: [],
  timelines: {}
};

const skillGrid = document.getElementById('skillGrid');
const searchInput = document.getElementById('skillSearch');
const compareA = document.getElementById('compareA');
const compareB = document.getElementById('compareB');
const comparisonGrid = document.getElementById('comparisonGrid');
const scanList = document.getElementById('scanList');
const scanDetail = document.getElementById('scanDetail');
const categoryList = document.getElementById('categoryList');
const syncStatus = document.getElementById('syncStatus');
const opsStatus = document.getElementById('opsStatus');

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${detail}`);
  }
  return response.json();
}

function animateValue(el, target) {
  const duration = 900;
  const start = Number(el.dataset.value || 0);
  const startTime = performance.now();
  const step = now => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(start + (target - start) * eased);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.dataset.value = String(target);
  };
  requestAnimationFrame(step);
}

function renderStats() {
  document.querySelectorAll('[data-stat]').forEach(el => {
    const key = el.dataset.stat;
    animateValue(el, Number(state.stats[key] || 0));
  });
}

function severityClass(skill) {
  return (skill.scan_summary?.severity || 'low').toLowerCase();
}

function renderSkills(skills = state.skills) {
  skillGrid.innerHTML = skills.map(skill => `
    <article class="skill-card glass ${severityClass(skill)}">
      <div class="skill-card-header">
        <div>
          <p class="eyebrow">${skill.category}</p>
          <h4>${skill.name}</h4>
        </div>
        <span class="status-chip ${skill.status}">${skill.status}</span>
      </div>
      <p class="muted">${skill.description}</p>
      <div class="meta-grid">
        <div><span>Owner</span><strong>${skill.owner}</strong></div>
        <div><span>Version</span><strong>${skill.version}</strong></div>
        <div><span>Security</span><strong>${skill.security_level}</strong></div>
        <div><span>Scan</span><strong>${skill.scan_summary?.severity || 'unknown'} (${skill.scan_summary?.score || 0})</strong></div>
      </div>
      <div class="capability-list">
        ${(skill.capabilities || []).map(item => `<span>${item}</span>`).join('')}
      </div>
      <div class="card-actions">
        <label class="compare-check"><input class="compare-toggle" type="checkbox" data-skill="${skill.id}"> Compare</label>
        <button class="button tertiary" data-scan="${skill.id}">Run scan</button>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('[data-scan]').forEach(btn => btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Scanning…';
    try {
      await api(`/api/scan/${btn.dataset.scan}`, { method: 'POST' });
      await refreshData(searchInput.value.trim());
    } catch (error) {
      alert(`Scan failed: ${error.message}`);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Run scan';
    }
  }));

  document.querySelectorAll('.compare-toggle').forEach(box => {
    box.checked = [compareA.value, compareB.value].includes(box.dataset.skill);
    box.addEventListener('change', () => syncCompareFromCheckbox(box));
  });
}

function populateCategories() {
  categoryList.innerHTML = state.categories.map(item => `
    <div class="category-row">
      <span>${item.category}</span>
      <strong>${item.count}</strong>
    </div>
  `).join('');
}

function populateCompare() {
  const options = state.skills.map(skill => `<option value="${skill.id}">${skill.name}</option>`).join('');
  compareA.innerHTML = options;
  compareB.innerHTML = options;
  if (state.skills[0]) compareA.value = state.skills[0].id;
  if (state.skills[1]) compareB.value = state.skills[1].id;
}

async function renderComparison() {
  if (!compareA.value || !compareB.value) return;
  const data = await api(`/api/compare?a=${encodeURIComponent(compareA.value)}&b=${encodeURIComponent(compareB.value)}`);
  state.comparison = data;
  comparisonGrid.innerHTML = [data.a, data.b].map(skill => `
    <section class="compare-panel glass">
      <p class="eyebrow">${skill.category}</p>
      <h4>${skill.name}</h4>
      <div class="compare-table">
        <div class="compare-row"><strong>Owner</strong><span>${skill.owner}</span></div>
        <div class="compare-row"><strong>Version</strong><span>${skill.version}</span></div>
        <div class="compare-row"><strong>Status</strong><span>${skill.status}</span></div>
        <div class="compare-row"><strong>Security</strong><span>${skill.security_level}</span></div>
        <div class="compare-row"><strong>Maturity</strong><span>${skill.maturity}</span></div>
        <div class="compare-row"><strong>Coverage</strong><span>${skill.coverage}</span></div>
        <div class="compare-row"><strong>Risk</strong><span>${skill.risk}</span></div>
        <div class="compare-row"><strong>Capabilities</strong><span>${(skill.capabilities || []).join(', ')}</span></div>
      </div>
    </section>
  `).join('');

  document.querySelectorAll('.compare-toggle').forEach(box => {
    box.checked = [compareA.value, compareB.value].includes(box.dataset.skill);
  });
}

async function enrichFindings(skills) {
  const top = skills.slice(0, 5);
  const items = [];
  for (const skill of top) {
    const timeline = await api(`/api/timeline/${skill.id}`);
    state.timelines[skill.id] = timeline.timeline;
    items.push({ skill, timeline: timeline.timeline });
  }
  state.findings = items;
  renderFindings();
}

function renderFindings() {
  scanList.innerHTML = state.findings.map((item, index) => `
    <article class="scan-item ${severityClass(item.skill)} ${index === 0 ? 'active' : ''}" data-index="${index}">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
        <span class="severity ${severityClass(item.skill)}">${item.skill.scan_summary?.severity || 'low'}</span>
        <span class="eyebrow">${item.skill.name}</span>
      </div>
      <h4>${item.skill.owner}</h4>
      <p class="muted">${item.skill.description}</p>
    </article>
  `).join('');

  const renderDetail = index => {
    const item = state.findings[index];
    if (!item) return;
    const timelineMarkup = (item.timeline || []).slice(0, 4).map(event => `
      <li><strong>${event.version}</strong> · ${new Date(event.changed_at).toLocaleString()}<br><span class="muted">${event.summary}</span></li>
    `).join('');
    scanDetail.innerHTML = `
      <span class="severity ${severityClass(item.skill)}">${item.skill.scan_summary?.severity || 'low'}</span>
      <h4>${item.skill.name}</h4>
      <p><strong>Owner:</strong> ${item.skill.owner}</p>
      <p><strong>Security level:</strong> ${item.skill.security_level}</p>
      <p><strong>Latest score:</strong> ${item.skill.scan_summary?.score || 0}</p>
      <p><strong>Findings:</strong> ${item.skill.scan_summary?.findings || 0}</p>
      <p><strong>Timeline</strong></p>
      <ul class="timeline-list">${timelineMarkup}</ul>
    `;
  };

  renderDetail(0);
  document.querySelectorAll('.scan-item').forEach(item => item.addEventListener('click', () => {
    document.querySelectorAll('.scan-item').forEach(node => node.classList.remove('active'));
    item.classList.add('active');
    renderDetail(Number(item.dataset.index));
  }));
}

function syncCompareFromCheckbox(box) {
  const selected = Array.from(document.querySelectorAll('.compare-toggle:checked')).map(node => node.dataset.skill);
  if (selected.length > 2) {
    box.checked = false;
    return;
  }
  if (selected[0]) compareA.value = selected[0];
  if (selected[1]) compareB.value = selected[1];
  if (!selected[1] && state.skills[1]) compareB.value = state.skills[1].id;
  renderComparison();
}

async function refreshData(query = '') {
  const [skillsResp, categoriesResp, statsResp] = query
    ? await Promise.all([api(`/api/search?q=${encodeURIComponent(query)}`), api('/api/categories'), api('/api/stats')])
    : await Promise.all([api('/api/skills'), api('/api/categories'), api('/api/stats')]);

  state.skills = query ? skillsResp.results : skillsResp.skills;
  state.categories = categoriesResp.categories;
  state.stats = { ...statsResp, categories: categoriesResp.categories.length };
  syncStatus.textContent = `Last live sync: ${new Date().toLocaleTimeString()}`;
  opsStatus.textContent = 'API online';

  renderStats();
  renderSkills();
  populateCategories();
  populateCompare();
  await renderComparison();
  await enrichFindings(state.skills);
}

searchInput.addEventListener('input', async e => {
  await refreshData(e.target.value.trim());
});
compareA.addEventListener('change', renderComparison);
compareB.addEventListener('change', renderComparison);
document.querySelectorAll('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
  document.querySelector(btn.dataset.scroll).scrollIntoView({ behavior: 'smooth' });
}));
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
  document.querySelectorAll('.nav-link').forEach(node => node.classList.remove('active'));
  link.classList.add('active');
}));

refreshData().catch(error => {
  console.error(error);
  opsStatus.textContent = 'API error';
  syncStatus.textContent = error.message;
  scanDetail.innerHTML = `<p class="muted">Failed to load live registry: ${error.message}</p>`;
});
