const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 7781);
const ROOT = '/home/skillops-api';
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(ROOT, 'data');
const SKILLS_FILE = path.join(DATA_DIR, 'skills.json');
const TIMELINES_FILE = path.join(DATA_DIR, 'timelines.json');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function timestamp(offsetMinutes = 0) {
  return new Date(Date.now() + offsetMinutes * 60000).toISOString();
}

function seedSkills() {
  const skills = [
    { id:'skill-auth-zero-trust', name:'Zero Trust Auth Gateway', description:'Centralized authentication gateway with SSO, MFA enforcement, adaptive access policies, and service token brokering.', category:'Security', version:'4.3.1', owner:'Identity Platform', status:'active', security_level:'critical', maturity:'GA', coverage:'Global', risk:'medium', capabilities:['SSO','MFA','SCIM','JWT validation'], tags:['auth','sso','zero-trust'], last_updated:timestamp(-9000), scan_summary:{severity:'medium', score:89, findings:2} },
    { id:'skill-payments-orchestrator', name:'Payments Orchestrator', description:'Routes transactions across processors, applies policy checks, retries failures, and exposes reconciliation events.', category:'Finance', version:'3.8.0', owner:'Payments Core', status:'active', security_level:'critical', maturity:'GA', coverage:'Global', risk:'high', capabilities:['Multi-processor routing','PCI controls','Retries','Reconciliation'], tags:['payments','pci','transactions'], last_updated:timestamp(-8500), scan_summary:{severity:'high', score:78, findings:4} },
    { id:'skill-structured-logging', name:'Structured Logging Fabric', description:'Standardized structured logging pipeline with retention, masking, and cross-service correlation.', category:'Observability', version:'2.7.4', owner:'SRE Foundations', status:'active', security_level:'high', maturity:'GA', coverage:'Global', risk:'low', capabilities:['JSON logs','PII masking','Trace correlation','Retention policies'], tags:['logging','observability','compliance'], last_updated:timestamp(-8000), scan_summary:{severity:'low', score:95, findings:1} },
    { id:'skill-runtime-monitoring', name:'Runtime Monitoring Mesh', description:'Unified infrastructure and application monitoring with SLO dashboards and anomaly detection.', category:'Observability', version:'5.0.2', owner:'Platform Reliability', status:'active', security_level:'high', maturity:'GA', coverage:'Global', risk:'low', capabilities:['Metrics','Alerting','Anomaly detection','SLOs'], tags:['monitoring','sre','metrics'], last_updated:timestamp(-7600), scan_summary:{severity:'medium', score:88, findings:2} },
    { id:'skill-secrets-broker', name:'Secrets Broker', description:'Manages secret issuance, rotation, scoped delivery, and audit logging for workloads.', category:'Security', version:'6.1.0', owner:'Security Engineering', status:'active', security_level:'critical', maturity:'GA', coverage:'Global', risk:'medium', capabilities:['Secret rotation','Audit logs','Scoped leases','KMS integration'], tags:['secrets','kms','vault'], last_updated:timestamp(-7200), scan_summary:{severity:'critical', score:70, findings:5} },
    { id:'skill-policy-engine', name:'Policy Evaluation Engine', description:'Executes compliance and operational policy decisions for requests, deployments, and data flows.', category:'Governance', version:'3.2.5', owner:'Governance Systems', status:'active', security_level:'critical', maturity:'Beta', coverage:'Regional', risk:'medium', capabilities:['OPA-style rules','Decision logs','Policy bundles','Exception workflows'], tags:['policy','governance','compliance'], last_updated:timestamp(-6800), scan_summary:{severity:'medium', score:84, findings:3} },
    { id:'skill-data-classifier', name:'Sensitive Data Classifier', description:'Detects PII, PCI, and regulated fields in data pipelines with tagging and quarantine hooks.', category:'Data Protection', version:'2.4.9', owner:'Data Security', status:'active', security_level:'critical', maturity:'GA', coverage:'Global', risk:'medium', capabilities:['PII detection','PCI detection','Tagging','Quarantine'], tags:['data','pii','dlp'], last_updated:timestamp(-6400), scan_summary:{severity:'high', score:81, findings:3} },
    { id:'skill-audit-trail', name:'Immutable Audit Trail', description:'Stores append-only security and operational events for forensic investigation and compliance reporting.', category:'Governance', version:'1.9.3', owner:'Compliance Platform', status:'active', security_level:'critical', maturity:'GA', coverage:'Global', risk:'low', capabilities:['Append-only ledger','Forensics','Export','Retention locks'], tags:['audit','forensics','ledger'], last_updated:timestamp(-6000), scan_summary:{severity:'low', score:96, findings:0} },
    { id:'skill-api-gateway', name:'Enterprise API Gateway', description:'Ingress layer for service APIs with auth, quota, schema validation, and traffic shaping.', category:'Platform', version:'7.0.1', owner:'Edge Platform', status:'active', security_level:'high', maturity:'GA', coverage:'Global', risk:'medium', capabilities:['Rate limits','Schema validation','Auth','Traffic policies'], tags:['api','gateway','edge'], last_updated:timestamp(-5600), scan_summary:{severity:'medium', score:87, findings:2} },
    { id:'skill-k8s-deploy', name:'Kubernetes Deployment Manager', description:'Deployment orchestration skill with progressive rollout, rollback, and policy-aware approvals.', category:'DevOps', version:'4.0.6', owner:'Developer Infrastructure', status:'active', security_level:'high', maturity:'GA', coverage:'Global', risk:'medium', capabilities:['Canary','Rollback','Approvals','Policy hooks'], tags:['kubernetes','deployments','devops'], last_updated:timestamp(-5200), scan_summary:{severity:'medium', score:86, findings:2} },
    { id:'skill-ci-security', name:'CI Security Guardrails', description:'Build-time security checks for dependencies, secrets leakage, and container policy enforcement.', category:'DevSecOps', version:'3.5.7', owner:'AppSec Tooling', status:'active', security_level:'critical', maturity:'GA', coverage:'Global', risk:'medium', capabilities:['SAST','Secrets scanning','Container policy','Dependency checks'], tags:['ci','security','sast'], last_updated:timestamp(-4800), scan_summary:{severity:'high', score:79, findings:4} },
    { id:'skill-customer-notify', name:'Customer Notification Hub', description:'Delivers transactional email, SMS, and push notifications with compliance templates and throttling.', category:'Communications', version:'2.2.1', owner:'Customer Platform', status:'active', security_level:'medium', maturity:'GA', coverage:'Global', risk:'low', capabilities:['Email','SMS','Push','Template governance'], tags:['notifications','email','sms'], last_updated:timestamp(-4400), scan_summary:{severity:'low', score:93, findings:1} },
    { id:'skill-billing-reports', name:'Billing Reporting Engine', description:'Produces invoice artifacts, usage rollups, and executive finance dashboards from metered events.', category:'Finance', version:'1.7.8', owner:'Revenue Systems', status:'active', security_level:'high', maturity:'Beta', coverage:'Regional', risk:'medium', capabilities:['Usage aggregation','Invoice export','Dashboard feeds','Backfill'], tags:['billing','reports','finance'], last_updated:timestamp(-4000), scan_summary:{severity:'medium', score:85, findings:2} },
    { id:'skill-incident-response', name:'Incident Response Automation', description:'Coordinates incident severity, on-call routing, stakeholder updates, and automated runbooks.', category:'Operations', version:'5.4.4', owner:'Incident Command', status:'active', security_level:'high', maturity:'GA', coverage:'Global', risk:'low', capabilities:['On-call routing','Runbooks','Status updates','Escalations'], tags:['incident','operations','oncall'], last_updated:timestamp(-3600), scan_summary:{severity:'low', score:94, findings:1} },
    { id:'skill-access-review', name:'Quarterly Access Review Manager', description:'Automates access certification campaigns, manager attestations, and evidence packaging.', category:'Governance', version:'2.0.5', owner:'IAM Governance', status:'active', security_level:'critical', maturity:'GA', coverage:'Global', risk:'medium', capabilities:['Campaigns','Attestations','Evidence export','Remediation queues'], tags:['iam','access-review','sox'], last_updated:timestamp(-3200), scan_summary:{severity:'medium', score:83, findings:3} },
    { id:'skill-feature-flags', name:'Feature Flag Control Plane', description:'Manages rollout rules, segment targeting, kill switches, and experiment governance.', category:'Platform', version:'4.9.2', owner:'Experimentation Platform', status:'active', security_level:'medium', maturity:'GA', coverage:'Global', risk:'low', capabilities:['Segmentation','Kill switch','Rules','Audit'], tags:['feature-flags','rollout','experiments'], last_updated:timestamp(-2800), scan_summary:{severity:'low', score:92, findings:1} },
    { id:'skill-data-retention', name:'Data Retention Enforcer', description:'Applies retention schedules and legal hold policies across data stores and exports.', category:'Data Protection', version:'3.1.4', owner:'Privacy Engineering', status:'active', security_level:'critical', maturity:'GA', coverage:'Global', risk:'medium', capabilities:['Retention policies','Legal hold','Deletion workflows','Evidence'], tags:['retention','privacy','gdpr'], last_updated:timestamp(-2400), scan_summary:{severity:'high', score:80, findings:3} }
  ];

  const timelines = {};
  skills.forEach((skill, index) => {
    timelines[skill.id] = [
      { version: skill.version, changed_at: skill.last_updated, author: skill.owner, summary: 'Current production release with enterprise support and audit coverage.' },
      { version: previousVersion(skill.version, 1), changed_at: timestamp(-10000 + index * 7), author: skill.owner, summary: 'Expanded capability set and refreshed control mappings.' },
      { version: previousVersion(skill.version, 2), changed_at: timestamp(-14000 + index * 7), author: skill.owner, summary: 'Initial regulated deployment with baseline compliance checks.' }
    ];
  });

  return { skills, timelines };
}

function previousVersion(version, step) {
  const parts = String(version).split('.').map(v => Number(v));
  if (parts.length !== 3) return version;
  parts[2] = Math.max(0, parts[2] - step);
  return parts.join('.');
}

function ensureData() {
  ensureDir(DATA_DIR);
  if (!fs.existsSync(SKILLS_FILE) || !fs.existsSync(TIMELINES_FILE)) {
    const seeded = seedSkills();
    fs.writeFileSync(SKILLS_FILE, JSON.stringify(seeded.skills, null, 2));
    fs.writeFileSync(TIMELINES_FILE, JSON.stringify(seeded.timelines, null, 2));
  }
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

function loadSkills() {
  return readJson(SKILLS_FILE, []);
}

function loadTimelines() {
  return readJson(TIMELINES_FILE, {});
}

function saveSkills(skills) {
  writeJson(SKILLS_FILE, skills);
}

function saveTimelines(timelines) {
  writeJson(TIMELINES_FILE, timelines);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload, null, 2));
}

function sendText(res, statusCode, text, contentType='text/plain; charset=utf-8') {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(text);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function normalizeSkill(input, existing = {}) {
  const allowed = ['name','description','category','version','owner','status','security_level'];
  const skill = { ...existing };
  for (const key of allowed) {
    if (input[key] !== undefined) skill[key] = String(input[key]).trim();
  }
  skill.name = skill.name || '';
  skill.description = skill.description || '';
  skill.category = skill.category || 'Uncategorized';
  skill.version = skill.version || '1.0.0';
  skill.owner = skill.owner || 'Unknown';
  skill.status = skill.status || 'draft';
  skill.security_level = skill.security_level || 'medium';
  if (!skill.id) {
    skill.id = slugify(skill.name || `skill-${Date.now()}`);
  }
  skill.last_updated = timestamp();
  skill.maturity = skill.maturity || 'GA';
  skill.coverage = skill.coverage || 'Global';
  skill.risk = skill.risk || deriveRisk(skill.security_level);
  skill.capabilities = skill.capabilities || deriveCapabilities(skill.category);
  skill.tags = skill.tags || deriveTags(skill);
  skill.scan_summary = skill.scan_summary || { severity: deriveRisk(skill.security_level), score: deriveScore(skill.security_level), findings: 1 };
  return skill;
}

function deriveRisk(level) {
  const map = { critical:'high', high:'medium', medium:'low', low:'low' };
  return map[String(level).toLowerCase()] || 'medium';
}

function deriveScore(level) {
  const map = { critical:76, high:84, medium:91, low:96 };
  return map[String(level).toLowerCase()] || 88;
}

function deriveCapabilities(category) {
  const cat = String(category).toLowerCase();
  if (cat.includes('security')) return ['Controls','Auditability','Policy enforcement'];
  if (cat.includes('finance')) return ['Transactions','Reconciliation','Reporting'];
  if (cat.includes('observability')) return ['Metrics','Dashboards','Alerts'];
  if (cat.includes('platform')) return ['Routing','Scale','Governance'];
  return ['Workflow automation','Enterprise integration','Reporting'];
}

function deriveTags(skill) {
  return [skill.category, skill.status, skill.security_level].map(v => String(v).toLowerCase().replace(/\s+/g, '-'));
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `skill-${Date.now()}`;
}

function compareSkills(a, b) {
  if (!a || !b) return null;
  const fields = ['name','category','version','owner','status','security_level','maturity','coverage','risk'];
  const comparison = {};
  for (const field of fields) {
    comparison[field] = { a: a[field], b: b[field], same: a[field] === b[field] };
  }
  comparison.capabilities = { a: a.capabilities || [], b: b.capabilities || [], same: JSON.stringify(a.capabilities || []) === JSON.stringify(b.capabilities || []) };
  return comparison;
}

function searchSkills(skills, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return skills;
  return skills.filter(skill => {
    const haystack = [
      skill.id, skill.name, skill.description, skill.category, skill.owner, skill.status,
      skill.security_level, ...(skill.capabilities || []), ...(skill.tags || [])
    ].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

function skillStats(skills) {
  const total = skills.length;
  const criticalFindings = skills.reduce((sum, skill) => sum + ((skill.scan_summary && skill.scan_summary.severity === 'critical') ? 1 : 0), 0);
  const compliant = skills.filter(skill => (skill.scan_summary?.score || 0) >= 85).length;
  const compliancePercent = total ? Math.round((compliant / total) * 100) : 0;
  const byStatus = {};
  const bySecurityLevel = {};
  for (const skill of skills) {
    byStatus[skill.status] = (byStatus[skill.status] || 0) + 1;
    bySecurityLevel[skill.security_level] = (bySecurityLevel[skill.security_level] || 0) + 1;
  }
  return { total_skills: total, compliance_percent: compliancePercent, critical_findings: criticalFindings, by_status: byStatus, by_security_level: bySecurityLevel };
}

function categoryCounts(skills) {
  const map = {};
  for (const skill of skills) {
    map[skill.category] = (map[skill.category] || 0) + 1;
  }
  return Object.entries(map)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([category, count]) => ({ category, count }));
}

function scanResult(skill) {
  const profiles = {
    critical: [
      { severity:'critical', title:'Privileged token rotation overdue', summary:'Service credentials exceeded rotation policy threshold.', impact:'Credential compromise blast radius remains elevated until rotated.', remediation:['Rotate privileged credentials immediately','Enforce shorter lease TTLs','Backfill audit evidence for the missed window'] },
      { severity:'high', title:'Break-glass role lacks dual approval', summary:'Emergency role access path bypasses peer approval control.', impact:'High-risk production actions can occur without compensating review.', remediation:['Require dual approval on emergency grants','Log all break-glass sessions','Add weekly attestations'] }
    ],
    high: [
      { severity:'high', title:'Dependency review lagging baseline', summary:'One or more runtime dependencies are beyond approved patch SLA.', impact:'Known vulnerabilities may remain exploitable in production paths.', remediation:['Patch flagged libraries','Add CI policy gates','Track owner SLA breaches'] },
      { severity:'medium', title:'Audit fields partially populated', summary:'Some state transition events are missing actor metadata.', impact:'Forensic investigations would have reduced attribution fidelity.', remediation:['Enforce actor context in API layer','Reject writes without metadata','Backfill missing attributes when possible'] }
    ],
    medium: [
      { severity:'medium', title:'Control evidence package incomplete', summary:'One compliance control is missing fresh evidence artifacts.', impact:'Audit readiness is reduced until evidence is regenerated.', remediation:['Regenerate evidence package','Attach change ticket references','Schedule monthly verification'] },
      { severity:'low', title:'Least-privilege drift detected', summary:'A non-critical service role has one unused permission.', impact:'Low immediate risk but violates hardening standards.', remediation:['Remove unused permission','Add role diff checks','Review quarterly access baselines'] }
    ],
    low: [
      { severity:'low', title:'Documentation freshness warning', summary:'Runbook was not updated in the last review window.', impact:'Responders may rely on slightly stale operational context.', remediation:['Review runbook','Refresh owner escalation contacts','Automate doc freshness checks'] }
    ]
  };
  const level = String(skill.security_level || 'medium').toLowerCase();
  const findings = profiles[level] || profiles.medium;
  const severity = findings[0].severity;
  const score = Math.max(62, Math.min(98, deriveScore(level) - (severity === 'critical' ? 8 : severity === 'high' ? 5 : severity === 'medium' ? 2 : 0)));
  return {
    skillId: skill.id,
    scanned_at: timestamp(),
    severity,
    score,
    findings,
    summary: `${findings.length} simulated findings generated for ${skill.name}.`
  };
}

function serveStatic(reqPath, res) {
  const safePath = reqPath === '/' ? '/index.html' : reqPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, safePath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    return sendText(res, 403, 'Forbidden');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (fallbackErr, fallbackData) => {
        if (fallbackErr) return sendText(res, 404, 'Not found');
        sendText(res, 200, fallbackData, 'text/html; charset=utf-8');
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html':'text/html; charset=utf-8',
      '.js':'application/javascript; charset=utf-8',
      '.css':'text/css; charset=utf-8',
      '.json':'application/json; charset=utf-8',
      '.svg':'image/svg+xml',
      '.png':'image/png'
    };
    sendText(res, 200, data, types[ext] || 'application/octet-stream');
  });
}

ensureDir(ROOT);
ensureDir(PUBLIC_DIR);
ensureData();

const server = http.createServer(async (req, res) => {
  if (!req.url) return sendJson(res, 400, { error:'Missing URL' });
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  try {
    if (pathname === '/health') {
      return sendJson(res, 200, { ok:true, service:'skillops-api', port:PORT, timestamp:timestamp() });
    }

    if (pathname === '/api/skills' && req.method === 'GET') {
      const skills = loadSkills();
      return sendJson(res, 200, { skills, count: skills.length });
    }

    if (pathname === '/api/skills' && req.method === 'POST') {
      const body = await parseBody(req);
      const skills = loadSkills();
      const skill = normalizeSkill(body);
      if (skills.some(item => item.id === skill.id)) {
        skill.id = `${skill.id}-${Date.now()}`;
      }
      skills.unshift(skill);
      saveSkills(skills);
      const timelines = loadTimelines();
      timelines[skill.id] = [{ version: skill.version, changed_at: timestamp(), author: skill.owner, summary: 'Skill created in registry.' }];
      saveTimelines(timelines);
      return sendJson(res, 201, skill);
    }

    if (pathname.startsWith('/api/skills/') && ['GET','PUT','DELETE'].includes(req.method)) {
      const skillId = decodeURIComponent(pathname.split('/').pop());
      const skills = loadSkills();
      const index = skills.findIndex(skill => skill.id === skillId);
      if (index === -1) return sendJson(res, 404, { error:'Skill not found' });

      if (req.method === 'GET') {
        return sendJson(res, 200, skills[index]);
      }

      if (req.method === 'DELETE') {
        const removed = skills.splice(index, 1)[0];
        saveSkills(skills);
        const timelines = loadTimelines();
        timelines[skillId] = timelines[skillId] || [];
        timelines[skillId].unshift({ version: removed.version, changed_at: timestamp(), author: removed.owner, summary: 'Skill removed from active registry.' });
        saveTimelines(timelines);
        return sendJson(res, 200, { deleted:true, skill: removed });
      }

      if (req.method === 'PUT') {
        const body = await parseBody(req);
        const existing = skills[index];
        const previousVersionValue = existing.version;
        const updated = normalizeSkill(body, existing);
        skills[index] = { ...existing, ...updated };
        saveSkills(skills);
        const timelines = loadTimelines();
        timelines[skillId] = timelines[skillId] || [];
        timelines[skillId].unshift({ version: skills[index].version, changed_at: timestamp(), author: skills[index].owner, summary: `Skill updated from version ${previousVersionValue} to ${skills[index].version}.` });
        saveTimelines(timelines);
        return sendJson(res, 200, skills[index]);
      }
    }

    if (pathname === '/api/categories' && req.method === 'GET') {
      const skills = loadSkills();
      return sendJson(res, 200, { categories: categoryCounts(skills) });
    }

    if (pathname.startsWith('/api/scan/') && req.method === 'POST') {
      const skillId = decodeURIComponent(pathname.split('/').pop());
      const skills = loadSkills();
      const index = skills.findIndex(skill => skill.id === skillId);
      if (index === -1) return sendJson(res, 404, { error:'Skill not found' });
      const result = scanResult(skills[index]);
      skills[index].scan_summary = { severity: result.severity, score: result.score, findings: result.findings.length };
      skills[index].last_updated = timestamp();
      saveSkills(skills);
      const timelines = loadTimelines();
      timelines[skillId] = timelines[skillId] || [];
      timelines[skillId].unshift({ version: skills[index].version, changed_at: result.scanned_at, author: 'Security Scanner', summary: `Simulated ${result.severity} security scan executed.` });
      saveTimelines(timelines);
      return sendJson(res, 200, result);
    }

    if (pathname === '/api/compare' && req.method === 'GET') {
      const aId = url.searchParams.get('a');
      const bId = url.searchParams.get('b');
      const skills = loadSkills();
      const a = skills.find(skill => skill.id === aId);
      const b = skills.find(skill => skill.id === bId);
      if (!a || !b) return sendJson(res, 404, { error:'Both skills must exist' });
      return sendJson(res, 200, { a, b, comparison: compareSkills(a, b) });
    }

    if (pathname.startsWith('/api/timeline/') && req.method === 'GET') {
      const skillId = decodeURIComponent(pathname.split('/').pop());
      const timelines = loadTimelines();
      return sendJson(res, 200, { skillId, timeline: timelines[skillId] || [] });
    }

    if (pathname === '/api/search' && req.method === 'GET') {
      const q = url.searchParams.get('q') || '';
      const skills = loadSkills();
      const results = searchSkills(skills, q);
      return sendJson(res, 200, { query:q, count:results.length, results });
    }

    if (pathname === '/api/stats' && req.method === 'GET') {
      const skills = loadSkills();
      return sendJson(res, 200, skillStats(skills));
    }

    return serveStatic(pathname, res);
  } catch (error) {
    return sendJson(res, 500, { error:'Internal server error', detail:error.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SkillOps API listening on http://0.0.0.0:${PORT}`);
});
