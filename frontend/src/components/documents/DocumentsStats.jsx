export default function DocumentsStats({ documents = [] }) {
  const total = documents.length;
  const lab = documents.filter(d => d.type === "LAB").length;
  const prescription = documents.filter(d => d.type === "PRESCRIPTION").length;

  return (
    <div className="saas-stats-grid">

      <div className="saas-stat-card purple">
        <span>Total Documents</span>
        <h2>{total}</h2>
      </div>

      <div className="saas-stat-card blue">
        <span>Lab Reports</span>
        <h2>{lab}</h2>
      </div>

      <div className="saas-stat-card green">
        <span>Prescriptions</span>
        <h2>{prescription}</h2>
      </div>

    </div>
  );
}