import { sampleSkills, skillDetails, getSecuritySummary } from "@/lib/data";
import { SecurityScanner } from "@/lib/security";

export default function SecurityPage() {
  const summary = getSecuritySummary();
  const recentScans = skillDetails
    .map((detail) => ({
      id: detail.skill.id,
      name: detail.skill.name,
      result: SecurityScanner.scan(detail.skill, detail.sourceSnippet),
    }))
    .sort((left, right) => left.result.score - right.result.score)
    .slice(0, 6);

  return (
    <div className="page-grid security-grid">
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Risk overview</p>
            <h2>Skills by risk level</h2>
          </div>
        </div>
        <div className="risk-grid">
          <article className="risk-card risk-low">
            <span>Low risk</span>
            <strong>{summary.riskBands.low}</strong>
            <p>{sampleSkills.filter((skill) => skill.securityScore >= 85).length} skills cleared automated policy.</p>
          </article>
          <article className="risk-card risk-medium">
            <span>Medium risk</span>
            <strong>{summary.riskBands.medium}</strong>
            <p>These skills require targeted review before promotion.</p>
          </article>
          <article className="risk-card risk-high">
            <span>High risk</span>
            <strong>{summary.riskBands.high}</strong>
            <p>Blocked or degraded skills need remediation before install.</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recent scan results</p>
            <h2>Highest priority findings</h2>
          </div>
        </div>
        <div className="scan-table">
          {recentScans.map((scan) => (
            <article className="scan-row" key={scan.id}>
              <div>
                <h3>{scan.name}</h3>
                <p>{scan.result.findings[0]?.description ?? "No findings detected."}</p>
              </div>
              <div className="scan-meta">
                <strong>{scan.result.score}</strong>
                <span>{scan.result.findings.length} findings</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Compliance</p>
            <h2>Policy posture</h2>
          </div>
        </div>
        <div className="compliance-list">
          {summary.compliance.map((item) => (
            <article className="compliance-item" key={item.label}>
              <div>
                <h3>{item.label}</h3>
                <p>{item.value} of active skills conform to this control.</p>
              </div>
              <span className={`compliance-status compliance-${item.status}`}>{item.status}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
