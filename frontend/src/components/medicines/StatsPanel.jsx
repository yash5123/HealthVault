export default function StatsPanel({ medicines }) {

  const total = medicines.length;

  const healthy = medicines.filter(
    (m) =>
      m.quantity > m.lowStockThreshold
  ).length;

  const low = medicines.filter(
    (m) =>
      m.quantity <= m.lowStockThreshold &&
      m.quantity > 0
  ).length;

  const critical = medicines.filter(
    (m) => m.quantity === 0
  ).length;

  return (
    <div className="stats-panel">

      <StatCard
        title="Total Medicines"
        value={total}
        variant="primary"
      />

      <StatCard
        title="Healthy"
        value={healthy}
        variant="success"
      />

      <StatCard
        title="Low Stock"
        value={low}
        variant="warning"
      />

      <StatCard
        title="Critical"
        value={critical}
        variant="danger"
      />

    </div>
  );
}

/* ================= INTERNAL STAT CARD ================= */

function StatCard({ title, value, variant }) {

  const colors = {
    primary: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    success: "linear-gradient(135deg,#16a34a,#22c55e)",
    warning: "linear-gradient(135deg,#f59e0b,#fbbf24)",
    danger: "linear-gradient(135deg,#ef4444,#dc2626)",
  };

  return (
    <div
      className="stat-card"
      style={{
        background: colors[variant],
      }}
    >
      <div className="stat-content">
        <p className="stat-title">
          {title}
        </p>
        <h2 className="stat-value">
          {value}
        </h2>
      </div>
    </div>
  );
}