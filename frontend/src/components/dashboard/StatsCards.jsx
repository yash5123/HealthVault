import useAnimatedCounter from "../../hooks/useAnimatedCounter";

export default function StatsCards({ stats }) {

  const total = useAnimatedCounter(stats.total);
  const healthy = useAnimatedCounter(stats.healthy);
  const low = useAnimatedCounter(stats.low);
  const critical = useAnimatedCounter(stats.critical);

  return (

    <div className="dashboard-stats-grid">

      <div className="dashboard-stat-card">

        <div className="dashboard-stat-label">
          Total Medicines
        </div>

        <div className="dashboard-stat-value">
          {total}
        </div>

      </div>

      <div className="dashboard-stat-card dashboard-stat-healthy">

        <div className="dashboard-stat-label">
          Healthy
        </div>

        <div className="dashboard-stat-value">
          {healthy}
        </div>

      </div>

      <div className="dashboard-stat-card dashboard-stat-low">

        <div className="dashboard-stat-label">
          Low Stock
        </div>

        <div className="dashboard-stat-value">
          {low}
        </div>

      </div>

      <div className="dashboard-stat-card dashboard-stat-critical">

        <div className="dashboard-stat-label">
          Critical
        </div>

        <div className="dashboard-stat-value">
          {critical}
        </div>

      </div>

    </div>

  );

}