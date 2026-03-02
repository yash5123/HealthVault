import { useEffect, useState, useMemo } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";

export default function LowStock() {

/* ======================================================
   STATE
====================================================== */

const [medicines, setMedicines] = useState([]);
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("ALL");
const [sort, setSort] = useState("CRITICAL_FIRST");
const [refillHistory, setRefillHistory] = useState([]);

/* ======================================================
   FETCH
====================================================== */

useEffect(() => {
  fetchMedicines();
}, []);

const fetchMedicines = async () => {
  const res = await API.get("/api/medicines");
  setMedicines(res.data);
};

/* ======================================================
   HELPERS
====================================================== */

const calculateConsumptionPerDay = (frequency) => {
  const match = frequency.match(/\d+/);
  return match ? Number(match[0]) : 1;
};

const calculateDaysRemaining = (med) => {
  const perDay = calculateConsumptionPerDay(med.frequency);
  if (perDay === 0) return Infinity;
  return Math.floor(med.quantity / perDay);
};

const getStockLevel = (med) => {
  if (med.quantity === 0) return "CRITICAL";
  if (med.quantity <= med.lowStockThreshold)
    return "LOW";
  return "HEALTHY";
};

const getSeverityColor = (level) => {
  switch (level) {
    case "CRITICAL":
      return "#ef4444";
    case "LOW":
      return "#f59e0b";
    default:
      return "#10b981";
  }
};

/* ======================================================
   RESTOCK
====================================================== */

const restockMedicine = async (med, amount) => {
  const updatedQty = med.quantity + amount;

  await API.put(`/medicines/${med._id}`, {
    ...med,
    quantity: updatedQty,
  });

  setRefillHistory((prev) => [
    ...prev,
    {
      name: med.name,
      amount,
      date: new Date(),
    },
  ]);

  fetchMedicines();
};

/* ======================================================
   FILTER + SORT
====================================================== */

const processedData = useMemo(() => {
  let data = [...medicines];

  if (search) {
    data = data.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filter !== "ALL") {
    data = data.filter(
      (m) => getStockLevel(m) === filter
    );
  }

  switch (sort) {
    case "CRITICAL_FIRST":
      data.sort(
        (a, b) =>
          calculateDaysRemaining(a) -
          calculateDaysRemaining(b)
      );
      break;
    case "ALPHABETICAL":
      data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;
    default:
      break;
  }

  return data;
}, [medicines, search, filter, sort]);

/* ======================================================
   STATS
====================================================== */

const criticalCount = medicines.filter(
  (m) => getStockLevel(m) === "CRITICAL"
).length;

const lowCount = medicines.filter(
  (m) => getStockLevel(m) === "LOW"
).length;

const healthyCount = medicines.filter(
  (m) => getStockLevel(m) === "HEALTHY"
).length;

/* ======================================================
   RENDER
====================================================== */

return (
  <Layout>

    <h2>🚨 Stock Alert System</h2>

    {/* ================= SUMMARY ================= */}

    <div className="grid">
      <div className="card dashboard-card danger">
        <h3>Critical</h3>
        <p>{criticalCount}</p>
      </div>

      <div className="card dashboard-card warning">
        <h3>Low</h3>
        <p>{lowCount}</p>
      </div>

      <div className="card dashboard-card">
        <h3>Healthy</h3>
        <p>{healthyCount}</p>
      </div>
    </div>

    {/* ================= CONTROLS ================= */}

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
          <option value="CRITICAL">
            Critical
          </option>
          <option value="LOW">
            Low
          </option>
          <option value="HEALTHY">
            Healthy
          </option>
        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option value="CRITICAL_FIRST">
            Critical First
          </option>
          <option value="ALPHABETICAL">
            Alphabetical
          </option>
        </select>
      </div>
    </div>

    {/* ================= MEDICINE LIST ================= */}

    <div style={{ marginTop: 40 }}>
      {processedData.map((med) => {

        const level = getStockLevel(med);
        const days = calculateDaysRemaining(med);
        const color = getSeverityColor(level);

        return (
          <div
            key={med._id}
            className="card"
            style={{
              marginBottom: 25,
              borderLeft: `6px solid ${color}`,
            }}
          >
            <h3>{med.name}</h3>

            <p>Current Quantity: {med.quantity}</p>
            <p>Daily Usage: {calculateConsumptionPerDay(med.frequency)}</p>
            <p>
              Estimated Days Remaining:{" "}
              {days >= 0 ? days : 0}
            </p>

            <div
              className="progress-container"
              style={{ marginTop: 15 }}
            >
              <div
                className="progress-bar"
                style={{
                  width: `${Math.min(
                    (med.quantity /
                      med.lowStockThreshold) *
                      100,
                    100
                  )}%`,
                  background: color,
                }}
              />
            </div>

            <div
              style={{
                marginTop: 15,
                display: "flex",
                gap: 10,
              }}
            >
              <button
                onClick={() =>
                  restockMedicine(med, 10)
                }
              >
                +10 Refill
              </button>

              <button
                onClick={() =>
                  restockMedicine(med, 30)
                }
              >
                +30 Refill
              </button>
            </div>
          </div>
        );
      })}
    </div>

    {/* ================= REFILL HISTORY ================= */}

    <div style={{ marginTop: 50 }}>
      <h3>📦 Refill History</h3>

      {refillHistory.length === 0 && (
        <p>No refills yet.</p>
      )}

      {refillHistory.map((item, index) => (
        <div key={index} className="card">
          <p>
            {item.name} refilled by {item.amount} units
          </p>
          <p>
            {item.date.toLocaleString()}
          </p>
        </div>
      ))}
    </div>

  </Layout>
);
}