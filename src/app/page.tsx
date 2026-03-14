import { StatsCard } from "@/components/StatsCard";
import { getCategoryBreakdown, getDashboardStats, recentActivity } from "@/lib/data";

export default function DashboardPage() {
  const stats = getDashboardStats();
  const breakdown = getCategoryBreakdown();
  const maxCount = Math.max(...breakdown.map((item) => item.count));

  return (
    <div className="page-grid">
      <section className="stats-grid">
        <StatsCard
          delta={`${stats.publishedSkills} published`}
          label="Total skills"
          value={stats.totalSkills.toString()}
        />
        <StatsCard
          delta="Needs review"
          label="Security alerts"
          tone="alert"
          value={stats.securityAlerts.toString()}
        />
        <StatsCard
          delta="All registries"
          label="Downloads"
          value={stats.totalDownloads.toLocaleString()}
        />
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recent activity</p>
            <h2>Registry operations feed</h2>
          </div>
        </div>
        <div className="activity-list">
          {recentActivity.map((item) => (
            <article className="activity-item" key={item.id}>
              <div className={`activity-dot activity-${item.type}`} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
              <time dateTime={item.timestamp}>
                {new Date(item.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Portfolio mix</p>
            <h2>Category breakdown</h2>
          </div>
        </div>
        <div className="chart-list">
          {breakdown.map((item) => (
            <div className="chart-row" key={item.category}>
              <div className="chart-label">
                <span className="capitalize">{item.category}</span>
                <strong>{item.count}</strong>
              </div>
              <div className="chart-bar">
                <span style={{ width: `${(item.count / maxCount) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
