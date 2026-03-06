import { useMemo } from "react";

export default function HealthScore({ stats }) {

  const score = useMemo(() => {

    if (!stats.total) return 100;

    const healthyWeight = stats.healthy * 1;
    const lowWeight = stats.low * 0.5;
    const criticalWeight = stats.critical * 0;

    const totalScore =
      (healthyWeight + lowWeight + criticalWeight) / stats.total;

    return Math.round(totalScore * 100);

  }, [stats]);

  let status = "Excellent";

  if (score < 80) status = "Moderate";
  if (score < 50) status = "Risky";

  return (

    <div className="dashboard-health-card">

      <div className="dashboard-health-header">
        Health Score
      </div>

      <div className="dashboard-health-score">
        {score}%
      </div>

      <div className="dashboard-health-status">
        {status}
      </div>

      <div className="dashboard-health-bar">

        <div
          className="dashboard-health-progress"
          style={{ width: `${score}%` }}
        />

      </div>

    </div>

  );

}