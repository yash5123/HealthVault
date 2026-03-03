export default function StatusBadge({ status }) {
  const map = {
    HEALTHY: {
      bg: "#dcfce7",
      color: "#166534",
      label: "Healthy",
    },
    LOW: {
      bg: "#fef3c7",
      color: "#92400e",
      label: "Low Stock",
    },
    CRITICAL: {
      bg: "#fee2e2",
      color: "#991b1b",
      label: "Critical",
    },
  };

  const current = map[status];

  return (
    <span
      style={{
        background: current.bg,
        color: current.color,
        padding: "6px 14px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {current.label}
    </span>
  );
}