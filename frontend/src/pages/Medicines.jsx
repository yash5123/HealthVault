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
  dosageAmount: "",
  dosageUnit: "mg",
  frequencyPerDay: "",
  durationDays: "",
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
   SMART CALCULATIONS
===================================================== */

const totalRequired =
  (form.frequencyPerDay || 0) *
  (form.durationDays || 0);

const recommendedQuantity =
  totalRequired > 0
    ? totalRequired
    : 0;

/* =====================================================
   CRUD
===================================================== */

const handleAdd = async () => {
  if (!form.name) return;

  await API.post("/api/medicines", {
    ...form,
    totalRequired,
  });

  resetForm();
  fetchMedicines();
};

const handleUpdate = async () => {
  await API.put(
    `/api/medicines/${editingId}`,
    {
      ...form,
      totalRequired,
    }
  );

  resetForm();
  fetchMedicines();
};

const handleDelete = async (id) => {
  if (!window.confirm("Delete this medicine?"))
    return;

  await API.delete(`/api/medicines/${id}`);
  fetchMedicines();
};

const resetForm = () => {
  setForm({
    name: "",
    dosageAmount: "",
    dosageUnit: "mg",
    frequencyPerDay: "",
    durationDays: "",
    quantity: "",
    lowStockThreshold: 5,
  });
  setEditingId(null);
};

/* =====================================================
   FILTER + SORT
===================================================== */

const filtered = useMemo(() => {
  let data = [...medicines];

  if (search) {
    data = data.filter((m) =>
      m.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  if (filter === "LOW") {
    data = data.filter(
      (m) =>
        m.quantity <=
        m.lowStockThreshold
    );
  }

  if (sort === "NAME_ASC") {
    data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  return data;
}, [medicines, search, filter, sort]);

/* =====================================================
   RENDER
===================================================== */

return (
  <Layout>

    <h1>Medicines Management</h1>

    {/* ================= ADD FORM ================= */}

    <div className="card">
      <h3>Add / Edit Medicine</h3>

      <div className="grid">

        <input
          placeholder="Medicine Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        {/* Dosage */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            placeholder="Dosage"
            value={form.dosageAmount}
            onChange={(e) =>
              setForm({
                ...form,
                dosageAmount:
                  Number(e.target.value),
              })
            }
          />

          <select
            value={form.dosageUnit}
            onChange={(e) =>
              setForm({
                ...form,
                dosageUnit:
                  e.target.value,
              })
            }
          >
            <option value="mg">mg</option>
            <option value="ml">ml</option>
            <option value="tablet">
              tablet
            </option>
            <option value="capsule">
              capsule
            </option>
          </select>
        </div>

        {/* Frequency */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            placeholder="Times per day"
            value={form.frequencyPerDay}
            onChange={(e) =>
              setForm({
                ...form,
                frequencyPerDay:
                  Number(e.target.value),
              })
            }
          />
          <span
            style={{
              alignSelf: "center",
            }}
          >
            times/day
          </span>
        </div>

        {/* Duration */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            placeholder="Duration"
            value={form.durationDays}
            onChange={(e) =>
              setForm({
                ...form,
                durationDays:
                  Number(e.target.value),
              })
            }
          />
          <span
            style={{
              alignSelf: "center",
            }}
          >
            days
          </span>
        </div>

        <input
          type="number"
          placeholder="Available Quantity"
          value={form.quantity}
          onChange={(e) =>
            setForm({
              ...form,
              quantity:
                Number(e.target.value),
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
              lowStockThreshold:
                Number(e.target.value),
            })
          }
        />
      </div>

      {/* SMART INFO PANEL */}

      <div
        style={{
          marginTop: 20,
          padding: 15,
          background: "#f3f4f6",
          borderRadius: 8,
        }}
      >
        <p>
          Total Required:{" "}
          <strong>
            {totalRequired}
          </strong>{" "}
          units
        </p>

        <p>
          Recommended Quantity:{" "}
          <strong>
            {recommendedQuantity}
          </strong>
        </p>
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
      </div>
    </div>

    {/* ================= LIST ================= */}

    <div style={{ marginTop: 40 }}>
      {filtered.map((med) => {

        const isLow =
          med.quantity <=
          med.lowStockThreshold;

        return (
          <div
            key={med._id}
            className="card"
            style={{
              marginBottom: 20,
              borderLeft:
                isLow
                  ? "5px solid red"
                  : "5px solid green",
            }}
          >
            <h3>{med.name}</h3>

            <p>
              {med.dosageAmount}{" "}
              {med.dosageUnit}
            </p>

            <p>
              {med.frequencyPerDay}{" "}
              times/day
            </p>

            <p>
              Duration:{" "}
              {med.durationDays} days
            </p>

            <p>
              Quantity: {med.quantity}
            </p>

            <p>
              Required:{" "}
              {med.totalRequired}
            </p>

            {isLow && (
              <span
                style={{
                  color: "red",
                }}
              >
                Low Stock
              </span>
            )}
          </div>
        );
      })}
    </div>

  </Layout>
);
}