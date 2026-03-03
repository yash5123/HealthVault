import MedicineCard from "./MedicineCard";

export default function MedicineGrid({
  medicines,
  onEdit,
  onDelete,
}) {
  if (medicines.length === 0) {
    return (
      <div className="empty-state">
        <h3>No medicines added</h3>
        <p>
          Start by adding your first
          medicine above.
        </p>
      </div>
    );
  }

  return (
    <div className="medicine-grid">
      {medicines.map((med) => (
        <MedicineCard
          key={med._id}
          medicine={med}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}