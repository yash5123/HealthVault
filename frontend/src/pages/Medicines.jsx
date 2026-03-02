import { useEffect, useState, useMemo } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";

export default function Medicines() {
  /* =====================================================
     STATE
  ===================================================== */

  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState("NAME_ASC");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    quantity: "",
    lowStockThreshold: 5,
  });

  /* =====================================================
     FETCH
  ===================================================== */

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const res = await API.get("/api/medicines");
    setMedicines(res.data);
  };

  /* =====================================================
     CRUD
  ===================================================== */

  const handleAdd = async () => {
    if (!form.name) return;

    await API.post("/api/medicines", form);
    resetForm();
    fetchMedicines();
  };

  const handleUpdate = async () => {
    await API.put(`/api/medicines/${editingId}`, form);
    resetForm();
    fetchMedicines();
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this medicine?");
    if (!confirm) return;

    await API.delete(`/api/medicines/${id}`);
    fetchMedicines();
  };

  const adjustQuantity = async (id, amount) => {
    const med = medicines.find((m) => m._id === id);
    if (!med) return;

    const newQty = Math.max(0, med.quantity + amount);

    await API.put(`/api/medicines/${id}`, {
    ...med,
    quantity: newQty,
    });

    fetchMedicines();
  };

  const resetForm = () => {
    setForm({
      name: "",
      dosage: "",
      frequency: "",
      quantity: "",
      lowStockThreshold: 5,
    });
    setEditingId(null);
  };

  /* =====================================================
     FILTER / SORT
  ===================================================== */

  const filteredMedicines = useMemo(() => {
    let data = [...medicines];

    // Search
    if (search) {
      data = data.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter
    if (filter === "LOW") {
      data = data.filter(
        (m) => m.quantity <= m.lowStockThreshold
      );
    }

    // Sort
    switch (sort) {
      case "NAME_ASC":
        data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      case "LOW_STOCK":
        data.sort(
          (a, b) =>
            a.quantity - b.quantity
        );
        break;
      case "HIGH_QTY":
        data.sort(
          (a, b) =>
            b.quantity - a.quantity
        );
        break;
      default:
        break;
    }

    return data;
  }, [medicines, search, filter, sort]);

  /* =====================================================
     STATS
  ===================================================== */

  const total = medicines.length;
  const lowStockCount = medicines.filter(
    (m) => m.quantity <= m.lowStockThreshold
  ).length;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <Layout>
      <div className="page-header">
      <h1 className="page-title">
        Medicines Management
      </h1>
    </div>  

      {/* ===================== SUMMARY ===================== */}

      <div className="grid">
        <div className="card dashboard-card">
          <h3>Total Medicines</h3>
          <p>{total}</p>
        </div>

        <div className="card dashboard-card warning">
          <h3>Low Stock</h3>
          <p>{lowStockCount}</p>
        </div>
      </div>

      {/* ===================== CONTROLS ===================== */}

      <div className="card" style={{ marginTop: 30 }}>
        <h3>Add / Edit Medicine</h3>

        <div className="grid">
          <input
            placeholder="Medicine Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Dosage"
            value={form.dosage}
            onChange={(e) =>
              setForm({ ...form, dosage: e.target.value })
            }
          />

          <input
            placeholder="Frequency"
            value={form.frequency}
            onChange={(e) =>
              setForm({ ...form, frequency: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Low Stock Threshold"
            value={form.lowStockThreshold}
            onChange={(e) =>
              setForm({
                ...form,
                lowStockThreshold: Number(
                  e.target.value
                ),
              })
            }
          />
        </div>

        <div style={{ marginTop: 15 }}>
          {editingId ? (
            <button onClick={handleUpdate}>
              Update Medicine
            </button>
          ) : (
            <button onClick={handleAdd}>
              Add Medicine
            </button>
          )}

          {editingId && (
            <button
              style={{ marginLeft: 10 }}
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ===================== SEARCH & FILTER ===================== */}

      <div className="card" style={{ marginTop: 30 }}>
        <div className="grid">
          <input
            placeholder="Search medicine..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="ALL">All</option>
            <option value="LOW">Low Stock</option>
          </select>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >
            <option value="NAME_ASC">
              Sort A-Z
            </option>
            <option value="LOW_STOCK">
              Lowest Quantity
            </option>
            <option value="HIGH_QTY">
              Highest Quantity
            </option>
          </select>
        </div>
      </div>

      {/* ===================== MEDICINE LIST ===================== */}

      <div style={{ marginTop: 30 }}>
        {filteredMedicines.length === 0 && (
          <p>No medicines found.</p>
        )}

        <div className="grid">
          {filteredMedicines.map((med) => {
            const percent =
              (med.quantity /
                med.lowStockThreshold) *
              100;

            const low =
              med.quantity <=
              med.lowStockThreshold;

            return (
              <div
                key={med._id}
                className="card medicine-card"
              >
                <div className="medicine-header">
                  <h3>{med.name}</h3>

                  {low && (
                    <span className="badge danger">
                      Low Stock
                    </span>
                  )}
                </div>

                <div className="medicine-details">
                  <div>
                    <label>Dosage</label>
                    <p>{med.dosage}</p>
                  </div>

                  <div>
                    <label>Frequency</label>
                    <p>{med.frequency}</p>
                  </div>

                  <div>
                    <label>Quantity</label>
                    <p>{med.quantity}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-container">
                  <div
                    className={
                      low
                        ? "progress-bar progress-danger"
                        : "progress-bar"
                    }
                    style={{
                      width: `${Math.min(
                        percent,
                        100
                      )}%`,
                    }}
                  />
                </div>

                {/* Actions */}
                <div className="medicine-actions">
                  <button
                    onClick={() =>
                      adjustQuantity(
                        med._id,
                        -1
                      )
                    }
                  >
                    -
                  </button>

                  <button
                    onClick={() =>
                      adjustQuantity(
                        med._id,
                        1
                      )
                    }
                    style={{
                      marginLeft: 5,
                    }}
                  >
                    +
                  </button>

                  <button
                    style={{
                      marginLeft: 10,
                    }}
                    onClick={() => {
                      setEditingId(med._id);
                      setForm(med);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="danger-btn"
                    style={{
                      marginLeft: 10,
                    }}
                    onClick={() =>
                      handleDelete(med._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}