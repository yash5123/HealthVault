export default function DocumentFilters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
}) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search documents..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        <option value="ALL">All Types</option>
        <option value="LAB">Lab Reports</option>
        <option value="PRESCRIPTION">Prescriptions</option>
        <option value="OTHER">Other</option>
      </select>
    </div>
  );
}