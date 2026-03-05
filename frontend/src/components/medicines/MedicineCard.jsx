import StatusBadge from "./StatusBadge";

export default function MedicineCard({
  medicine,
  onEdit,
  onDelete,
}) {
  const status =
    medicine.quantity === 0
      ? "CRITICAL"
      : medicine.quantity <=
        medicine.lowStockThreshold
        ? "LOW"
        : "HEALTHY";

  const percent = Math.min(
    (medicine.quantity /
      medicine.lowStockThreshold) *
    100,
    100
  );

  const daysRemaining =
    medicine.frequencyPerDay > 0
      ? Math.floor(
        medicine.quantity /
        medicine.frequencyPerDay
      )
      : 0;

  return (
    <div
      className={`medicine-card ${status.toLowerCase()}`}
    >
      {/* HEADER */}
      <div className="medicine-card-header">
        <h3>{medicine.name}</h3>
        <StatusBadge status={status} />
      </div>

      {/* DETAILS */}
      <div className="medicine-card-details">
        <div>
          <label>Dosage</label>
          <p>
            {medicine.dosageAmount}{" "}
            {medicine.dosageUnit}
          </p>
        </div>

        <div>
          <label>Frequency</label>
          <p>
            {medicine.frequencyPerDay}{" "}
            times/day
          </p>
        </div>

        <div>
          <label>Duration</label>
          <p>
            {medicine.durationDays} days
          </p>
        </div>

        <div>
          <label>Quantity</label>
          <p>{medicine.quantity}</p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="medicine-progress">
        <div
          className="medicine-progress-bar"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="medicine-days">
        Estimated days remaining:{" "}
        <strong>{daysRemaining}</strong>
      </p>

      {/* ACTIONS */}
      <div className="medicine-actions">
        <button
          className="btn btn-primary"
          onClick={() => onEdit(medicine)}
        >
          Edit
        </button>

        <button
          className="danger-btn"
          onClick={() =>
            onDelete(medicine._id)
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
}