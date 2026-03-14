const skills = [
  {
    name: 'Access Governance AI', category: 'Security', owner: 'Identity Platform', maturity: 'GA', status: 'Compliant',
    coverage: '98%', risk: 'Low', description: 'Automates policy review, approval chains, and entitlement drift detection.',
    capabilities: ['RBAC validation', 'Entitlement drift alerts', 'Audit export'],
  },
  {
    name: 'Vendor Risk Copilot', category: 'Compliance', owner: 'GRC Office', maturity: 'Beta', status: 'Review',
    coverage: '91%', risk: 'Medium', description: 'Accelerates third-party skill intake with evidence collection and policy mapping.',
    capabilities: ['Questionnaire autofill', 'Evidence ingestion', 'Risk scoring'],
  },
  {
    name: 'Incident Triage Assistant', category: 'Operations', owner: 'SRE', maturity: 'GA', status: 'Compliant',
    coverage: '96%', risk: 'Low', description: 'Summarizes alerts, proposes runbooks, and coordinates escalation paths.',
    capabilities: ['Alert clustering', 'Runbook suggestions', 'Pager integration'],
  },
  {
    name: 'PII Discovery Engine', category: 'Data Protection', owner: 'Data Security', maturity: 'Pilot', status: 'Review',
    coverage: '88%', risk: 'High', description: 'Continuously scans prompts, outputs, and stored artifacts for sensitive data leakage.',
    capabilities: ['PII pattern detection', 'Redaction workflows', 'Retention tagging'],
  },
  {
    name: 'Knowledge Routing Hub', category: 'Enablement', owner: 'Enterprise AI', maturity: 'GA', status: 'Compliant',
    coverage: '99%', risk: 'Low', description: 'Routes internal queries to approved skills with ownership and lifecycle metadata.',
    capabilities: ['Intent routing', 'Owner registry', 'Lifecycle controls'],
  },
  {
    name: 'Contract Review Analyst', category: 'Legal', owner: 'Legal Ops', maturity: 'Beta', status: 'Compliant',
    coverage: '94%', risk: 'Medium', description: 'Compares clauses against approved playbooks and flags deviations for counsel.',
    capabilities: ['Clause extraction', 'Playbook matching', 'Deviation alerts'],
  }
];

const findings = [
  {
    title: 'Unscoped API token in Vendor Risk Copilot', severity: 'critical', skill: 'Vendor Risk Copilot',
    summary: 'A shared service token retains broad read permissions across two environments.',
    impact: 'Could expose vendor assessment artifacts beyond intended business units.',
    remediation: ['Rotate token and enforce environment scoping', 'Add token expiration under 30 days', 'Block shared secret reuse in CI policies']
  },
  {
    title: 'PII retention policy gap', severity: 'high', skill: 'PII Discovery Engine',
    summary: 'Derived scan artifacts lack explicit retention and purge metadata.',
    impact: 'Potential over-retention of sensitive evidence snapshots.',
    remediation: ['Attach retention class to all artifacts', 'Backfill purge jobs for prior scans', 'Add policy validation to release checklist']
  },
  {
    title: 'Missing attestation for legal templates', severity: 'medium', skill: 'Contract Review Analyst',
    summary: 'Two clause libraries were updated without quarterly business owner attestation.',
    impact: 'Could create uncertainty around approved fallback language.',
    remediation: ['Request template owner sign-off', 'Require attestation before publish', 'Log approvals in registry metadata']
  },
  {
    title: 'Stale webhook signature secret', severity: 'low', skill: 'Incident Triage Assistant',
    summary: 'Webhook signing secret age exceeded internal 90-day target by 8 days.',
    impact: 'Low immediate exposure due to compensating controls and network restrictions.',
    remediation: ['Rotate secret', 'Add age monitoring to dashboard']
  }
];

const skillGrid = document.getElementById('skillGrid');
const searchInput = document.getElementById('skillSearch');
const compareA = document.getElementById('compareA');
const compareB = document.getElementById('compareB');
const comparisonGrid = document.getElementById('comparisonGrid');
const scanList = document.getElementById('scanList');
const scanDetail = document.getElementById('scanDetail');

function renderSkills(filter = '') {
  const q = filter.trim().toLowerCase();
  const filtered = skills.filter(skill =>
    [skill.name, skill.owner, skill.category, skill.maturity].some(v => v.toLowerCase().includes(q))
  );

  skillGrid.innerHTML = filtered.map(skill => `
    <article class="skill-card">
      <div class="skill-top">
        <div>
          <p class="eyebrow">${skill.category}</p>
          <h4>${skill.name}</h4>
        </div>
        <span class="badge ${skill.status === 'Compliant' ? 'compliant' : 'review'}">${skill.status}</span>
      </div>
      <p class="muted">${skill.description}</p>
      <div class="meta">
        <span>Owner: ${skill.owner}</span>
        <span>Maturity: ${skill.maturity}</span>
        <span>Coverage: ${skill.coverage}</span>
        <span>Risk: ${skill.risk}</span>
      </div>
      <ul class="cap-list">
        ${skill.capabilities.map(cap => `<li>${cap}</li>`).join('')}
      </ul>
      <div class="card-actions">
        <label class="muted"><input class="compare-toggle" type="checkbox" data-skill="${skill.name}" /> Compare</label>
        <span class="eyebrow">${skill.coverage} policy coverage</span>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.compare-toggle').forEach(box => {
    box.addEventListener('change', event => syncCompareFromCheckbox(event.target));
  });
}

function populateCompare() {
  const options = skills.map(skill => `<option value="${skill.name}">${skill.name}</option>`).join('');
  compareA.innerHTML = options;
  compareB.innerHTML = options;
  compareA.selectedIndex = 0;
  compareB.selectedIndex = 1;
  renderComparison();
}

function getSkill(name) {
  return skills.find(skill => skill.name === name) || skills[0];
}

function renderComparison() {
  const a = getSkill(compareA.value);
  const b = getSkill(compareB.value);
  comparisonGrid.innerHTML = [a, b].map(skill => `
    <section class="compare-panel">
      <p class="eyebrow">${skill.category}</p>
      <h4>${skill.name}</h4>
      <div class="compare-table">
        <div class="compare-row"><strong>Owner</strong><span>${skill.owner}</span></div>
        <div class="compare-row"><strong>Maturity</strong><span>${skill.maturity}</span></div>
        <div class="compare-row"><strong>Status</strong><span>${skill.status}</span></div>
        <div class="compare-row"><strong>Coverage</strong><span>${skill.coverage}</span></div>
        <div class="compare-row"><strong>Risk</strong><span>${skill.risk}</span></div>
        <div class="compare-row"><strong>Capabilities</strong><span>${skill.capabilities.join(', ')}</span></div>
      </div>
    </section>
  `).join('');

  document.querySelectorAll('.compare-toggle').forEach(box => {
    box.checked = [compareA.value, compareB.value].includes(box.dataset.skill);
  });
}

function syncCompareFromCheckbox(box) {
  const selected = Array.from(document.querySelectorAll('.compare-toggle:checked')).map(node => node.dataset.skill);
  if (selected.length > 2) {
    box.checked = false;
    return;
  }
  if (selected[0]) compareA.value = selected[0];
  if (selected[1]) compareB.value = selected[1];
  renderComparison();
}

function renderFindings() {
  scanList.innerHTML = findings.map((finding, index) => `
    <article class="scan-item ${finding.severity} ${index === 0 ? 'active' : ''}" data-index="${index}">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
        <span class="severity ${finding.severity}">${finding.severity}</span>
        <span class="eyebrow">${finding.skill}</span>
      </div>
      <h4>${finding.title}</h4>
      <p class="muted">${finding.summary}</p>
    </article>
  `).join('');

  const renderDetail = idx => {
    const finding = findings[idx];
    scanDetail.innerHTML = `
      <span class="severity ${finding.severity}">${finding.severity}</span>
      <h4>${finding.title}</h4>
      <p><strong>Skill:</strong> ${finding.skill}</p>
      <p><strong>Summary:</strong> ${finding.summary}</p>
      <p><strong>Business impact:</strong> ${finding.impact}</p>
      <p><strong>Remediation plan</strong></p>
      <ul>${finding.remediation.map(item => `<li>${item}</li>`).join('')}</ul>
    `;
  };

  renderDetail(0);
  document.querySelectorAll('.scan-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.scan-item').forEach(node => node.classList.remove('active'));
      item.classList.add('active');
      renderDetail(Number(item.dataset.index));
    });
  });
}

function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = Number(counter.dataset.target);
    const duration = 1200;
    const startTime = performance.now();
    const step = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

searchInput.addEventListener('input', e => renderSkills(e.target.value));
compareA.addEventListener('change', renderComparison);
compareB.addEventListener('change', renderComparison);
document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => document.querySelector(btn.dataset.scroll).scrollIntoView({ behavior: 'smooth' }));
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(node => node.classList.remove('active'));
    link.classList.add('active');
  });
});

renderSkills();
populateCompare();
renderFindings();
animateCounters();
