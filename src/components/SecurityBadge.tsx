type SecurityBadgeProps = {
  score: number;
};

function getVariant(score: number) {
  if (score >= 85) {
    return { label: "Low Risk", className: "badge badge-safe" };
  }

  if (score >= 70) {
    return { label: "Review", className: "badge badge-review" };
  }

  return { label: "High Risk", className: "badge badge-risk" };
}

export function SecurityBadge({ score }: SecurityBadgeProps) {
  const variant = getVariant(score);

  return (
    <span className={variant.className}>
      {variant.label}
      <strong>{score}</strong>
    </span>
  );
}
