import Link from "next/link";

import { Skill } from "@/lib/types";
import { SecurityBadge } from "@/components/SecurityBadge";

type SkillCardProps = {
  skill: Skill;
};

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <article className="panel skill-card">
      <div className="skill-card-header">
        <div>
          <p className="eyebrow">{skill.category.replace("-", " ")}</p>
          <h3>{skill.name}</h3>
        </div>
        <SecurityBadge score={skill.securityScore} />
      </div>
      <p className="skill-card-copy">{skill.description}</p>
      <dl className="skill-meta">
        <div>
          <dt>Version</dt>
          <dd>{skill.version}</dd>
        </div>
        <div>
          <dt>Author</dt>
          <dd>{skill.author}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd className="capitalize">{skill.status}</dd>
        </div>
        <div>
          <dt>Downloads</dt>
          <dd>{skill.downloads.toLocaleString()}</dd>
        </div>
      </dl>
      <div className="skill-card-actions">
        <Link className="button button-secondary" href={`/registry/${skill.id}`}>
          View details
        </Link>
        <button className="button" type="button">
          Install
        </button>
      </div>
    </article>
  );
}
