export default function SearchPanel({
  search,
  setSearch,
  filter,
  setFilter,
  sort,
  setSort,
}) {
  return (
    <div className="search-panel">

      <div className="search-header">
        <h3>Search & Filters</h3>
        <p>Refine your medicines list</p>
      </div>

      <div className="search-grid">

        {/* SEARCH INPUT */}
        <div className="search-field">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by medicine name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* FILTER */}
        <div className="search-field">
          <label>Status Filter</label>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="ALL">All</option>
            <option value="HEALTHY">Healthy</option>
            <option value="LOW">Low Stock</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        {/* SORT */}
        <div className="search-field">
          <label>Sort By</label>
          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >
            <option value="NAME_ASC">
              Name (A-Z)
            </option>
            <option value="LOW_FIRST">
              Lowest Stock
            </option>
          </select>
        </div>

      </div>

    </div>
  );
}