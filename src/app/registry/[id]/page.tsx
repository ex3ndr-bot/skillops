import { notFound } from "next/navigation";

import { SecurityBadge } from "@/components/SecurityBadge";
import { getSkillById } from "@/lib/data";
import { SecurityScanner } from "@/lib/security";

type SkillDetailPageProps = {
  params: {
    id: string;
  };
};

export default function SkillDetailPage({ params }: SkillDetailPageProps) {
  const detail = getSkillById(params.id);

  if (!detail) {
    notFound();
  }

  const scan = SecurityScanner.scan(detail.skill, detail.sourceSnippet);

  return (
    <div className="page-grid detail-grid">
      <section className="panel detail-hero">
        <div className="detail-header">
          <div>
            <p className="eyebrow">{detail.skill.category.replace("-", " ")}</p>
            <h2>{detail.skill.name}</h2>
            <p className="detail-copy">{detail.skill.description}</p>
          </div>
          <SecurityBadge score={detail.skill.securityScore} />
        </div>

        <dl className="detail-metadata">
          <div>
            <dt>Version</dt>
            <dd>{detail.skill.version}</dd>
          </div>
          <div>
            <dt>Author</dt>
            <dd>{detail.skill.author}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd className="capitalize">{detail.skill.status}</dd>
          </div>
          <div>
            <dt>Downloads</dt>
            <dd>{detail.skill.downloads.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{new Date(detail.skill.createdAt).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{new Date(detail.skill.updatedAt).toLocaleDateString()}</dd>
          </div>
        </dl>

        <div className="action-row">
          <button className="button" type="button">
            Install skill
          </button>
          <button className="button button-secondary" type="button">
            Uninstall
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Security</p>
            <h2>Latest scan results</h2>
          </div>
        </div>
        <div className="scan-score">
          <strong>{scan.score}</strong>
          <span>Security score</span>
        </div>
        <div className="finding-list">
          {scan.findings.length > 0 ? (
            scan.findings.map((finding) => (
              <article className="finding-item" key={finding.id}>
                <div className={`severity severity-${finding.severity}`}>{finding.severity}</div>
                <div>
                  <h3>{finding.title}</h3>
                  <p>{finding.description}</p>
                </div>
              </article>
            ))
          ) : (
            <p className="muted">No issues detected in the current scan profile.</p>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Dependencies</p>
            <h2>Dependency tree</h2>
          </div>
        </div>
        <div className="dependency-tree">
          <div className="dependency-node dependency-root">{detail.skill.name}</div>
          {detail.skill.dependencies.map((dependency) => (
            <div className="dependency-branch" key={dependency}>
              <span />
              <div className="dependency-node">{dependency}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Version history</p>
            <h2>Release timeline</h2>
          </div>
        </div>
        <div className="version-list">
          {detail.versionHistory.map((version) => (
            <article className="version-item" key={version.version}>
              <div>
                <h3>{version.version}</h3>
                <p>{version.summary}</p>
              </div>
              <time dateTime={version.releasedAt}>
                {new Date(version.releasedAt).toLocaleDateString()}
              </time>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
