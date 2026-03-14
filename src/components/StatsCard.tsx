type StatsCardProps = {
  label: string;
  value: string;
  delta: string;
  tone?: "default" | "alert";
};

export function StatsCard({ label, value, delta, tone = "default" }: StatsCardProps) {
  return (
    <article className={`panel stats-card ${tone === "alert" ? "stats-card-alert" : ""}`}>
      <p className="eyebrow">{label}</p>
      <div className="stats-row">
        <strong>{value}</strong>
        <span>{delta}</span>
      </div>
    </article>
  );
}
