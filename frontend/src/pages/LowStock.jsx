import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import { fetchMedicines } from "../queries/medicinesQuery";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "../styles/pages/lowstock.css";

export default function LowStock() {

  /* ================= STATE ================= */

  const queryClient = useQueryClient();

  /* MEDICINES QUERY */

  const { data: medicines = [] } = useQuery({
    queryKey: ["medicines"],
    queryFn: fetchMedicines,
    staleTime: 1000 * 60 * 5
  });

  /* REFILL HISTORY QUERY */

  const { data: refillHistory = [] } = useQuery({
    queryKey: ["refillHistory"],
    queryFn: async () => {
      const res = await API.get("/refills");
      return res.data;
    }
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState("CRITICAL_FIRST");
  const [customAmount, setCustomAmount] = useState({});
  const [toasts, setToasts] = useState([]);

  /* ================= HELPERS ================= */

  const calculateConsumptionPerDay = (frequency) => {
    if (!frequency) return 1;
    const match = frequency.toString().match(/\d+/);
    return match ? Number(match[0]) : 1;
  };

  const calculateDaysRemaining = (med) => {
    const perDay = calculateConsumptionPerDay(med.frequencyPerDay);
    if (!perDay || perDay === 0) return Infinity;
    return Math.floor(med.quantity / perDay);
  };

  const getStockLevel = (med) => {
    if (med.quantity === 0) return "CRITICAL";
    if (med.quantity <= med.lowStockThreshold) return "LOW";
    return "HEALTHY";
  };

  /* ================= SMART ALERTS ================= */

  const calculateRecommendedRefill = (med) => {

    const perDay = calculateConsumptionPerDay(med.frequencyPerDay);

    if (!perDay) return 0;

    const targetDays = 30; // keep 30 days stock

    const requiredStock = perDay * targetDays;

    const refill = requiredStock - med.quantity;

    return refill > 0 ? refill : 0;
  };

  const getSmartWarning = (med) => {

    const days = calculateDaysRemaining(med);

    if (days <= 3) {
      return `⚠ Will run out in ${days} days`;
    }

    if (days <= 7) {
      return `⚠ Low stock — ${days} days remaining`;
    }

    return null;
  };


  /* ================= RESTOCK ================= */
  const showToast = (type, message) => {

    const id = Date.now();

    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);

  };

  const restockMedicine = async (med, amount) => {

    if (!amount) {
      showToast("reduce", "Please enter a quantity");
      return;
    }

    const updatedQty = med.quantity + amount;

    /* Prevent negative stock */

    if (updatedQty < 0) {
      showToast("reduce", "Stock cannot go below 0");
      return;
    }
    await API.put(`/medicines/${med._id}`, {
      ...med,
      quantity: updatedQty,
    });

    await API.post("/refills", {
      medicineId: med._id,
      name: med.name,
      amount,
      action: amount > 0 ? "ADD" : "REDUCE"
    });

    if (amount > 0) {
      showToast("add", `+${amount} units added to ${med.name}`);
    } else {
      showToast("reduce", `${Math.abs(amount)} units removed from ${med.name}`);
    }

    setCustomAmount((prev) => ({
      ...prev,
      [med._id]: ""
    }));

    queryClient.invalidateQueries({ queryKey: ["medicines"] });
    queryClient.invalidateQueries({ queryKey: ["refillHistory"] });

  };


  /* ================= FILTER + SORT ================= */

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

  /* ================= STATS ================= */

  const criticalCount = medicines.filter(
    (m) => getStockLevel(m) === "CRITICAL"
  ).length;

  const lowCount = medicines.filter(
    (m) => getStockLevel(m) === "LOW"
  ).length;

  const healthyCount = medicines.filter(
    (m) => getStockLevel(m) === "HEALTHY"
  ).length;

  /* ================= RENDER ================= */

  return (
    <div className="page-lowstock">
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${toast.type === "add" ? "toast-add" : "toast-reduce"
              }`}
          >
            <div className="toast-title">✔ Stock Updated</div>
            <div className="toast-message">{toast.message}</div>
          </div>
        ))}
      </div>
      {/* HEADER */}

      <div className="page-header">
        <h1 className="page-title">🚨 Stock Alert System</h1>
        <p className="page-subtitle">
          Monitor medicine inventory and refill before it runs out.
        </p>
      </div>


      {/* STATS */}

      <div className="stats-panel">

        <div className="stat-card critical">
          <span className="stat-title">CRITICAL</span>
          <h2>{criticalCount}</h2>
        </div>

        <div className="stat-card low">
          <span className="stat-title">LOW</span>
          <h2>{lowCount}</h2>
        </div>

        <div className="stat-card healthy">
          <span className="stat-title">HEALTHY</span>
          <h2>{healthyCount}</h2>
        </div>

      </div>


      {/* SEARCH PANEL */}

      <div className="search-panel">

        <div className="search-grid">

          <div className="search-field">
            <label>Search Medicine</label>
            <input
              placeholder="Search medicine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="search-field">
            <label>Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="CRITICAL">Critical</option>
              <option value="LOW">Low</option>
              <option value="HEALTHY">Healthy</option>
            </select>
          </div>

          <div className="search-field">
            <label>Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="CRITICAL_FIRST">Critical First</option>
              <option value="ALPHABETICAL">Alphabetical</option>
            </select>
          </div>

        </div>

      </div>

      {processedData.length === 0 && (
        <div className="empty-state">
          <h3>No medicines found</h3>
          <p>Try adjusting search or filter settings.</p>
        </div>
      )}

      {/* MEDICINE LIST */}

      <div className="medicine-grid">

        {processedData.map((med) => {

          const level = getStockLevel(med);
          const days = calculateDaysRemaining(med);
          const warning = getSmartWarning(med);

          const percentage = Math.min(
            (med.quantity / med.lowStockThreshold) * 100,
            100
          );

          return (

            <div
              key={med._id}
              className={`medicine-card ${level.toLowerCase()}`}
            >

              <div className="medicine-card-header">
                <h3>{med.name}</h3>
              </div>

              {warning && (
                <div className="smart-warning">
                  {warning}
                </div>
              )}
              <div className="medicine-card-details">

                <div>
                  <label>Quantity</label>
                  <p>{med.quantity}</p>
                </div>

                <div>
                  <label>Days Remaining</label>
                  <p>{days >= 0 ? days : 0}</p>
                </div>

              </div>


              <div className="medicine-progress">
                <div
                  className="medicine-progress-bar"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="recommended-refill">
                Recommended refill: +{calculateRecommendedRefill(med)}
              </div>


              <div className="medicine-actions">

                <div className="quick-refill">
                  <button onClick={() => restockMedicine(med, 10)}>+10</button>
                  <button onClick={() => restockMedicine(med, 30)}>+30</button>
                </div>

                <div className="custom-refill">

                  <input
                    type="number"
                    placeholder="Custom"
                    value={customAmount[med._id] || ""}
                    onChange={(e) =>
                      setCustomAmount({
                        ...customAmount,
                        [med._id]: e.target.value
                      })
                    }
                  />

                  <button
                    onClick={() =>
                      restockMedicine(
                        med,
                        Math.abs(Number(customAmount[med._id] || 0))
                      )
                    }
                  >
                    Add
                  </button>

                  <button
                    className="reduce-btn"
                    onClick={() =>
                      restockMedicine(
                        med,
                        -Number(customAmount[med._id] || 0)
                      )
                    }
                  >
                    Reduce
                  </button>

                </div>

              </div>

            </div>

          );

        })}

      </div>


      {/* REFILL HISTORY */}

      <div className="refill-history">

        <h3>📦 Refill History</h3>

        {refillHistory.length === 0 && (
          <p>No refills yet.</p>
        )}

        {refillHistory.map((item, index) => (

          <div key={item._id} className="history-item">

            <p className={item.amount > 0 ? "add" : "reduce"}>
              {item.name} {item.amount > 0 ? "+" : ""}{item.amount} units
            </p>

            <p>{new Date(item.date).toLocaleString()}</p>

          </div>

        ))}

      </div>

    </div>
  );
}