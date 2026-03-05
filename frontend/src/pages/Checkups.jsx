import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCheckups } from "../queries/checkupsQuery";
import "../styles/pages/checkups.css";

export default function Checkups() {

  /* ======================================================
     STATE
  ====================================================== */

  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [history, setHistory] = useState([]);

  const [form, setForm] = useState({
    type: "",
    doctorName: "",
    lastVisit: "",
    intervalMonths: "",
    notes: "",
  });

  const queryClient = useQueryClient();

  const { data: checkups = [] } = useQuery({
    queryKey: ["checkups"],
    queryFn: fetchCheckups,
    staleTime: 1000 * 60 * 5
  });

  /* ======================================================
     HELPERS
  ====================================================== */

  const calculateNextVisit = (lastVisit, interval) => {
    const date = new Date(lastVisit);
    date.setMonth(date.getMonth() + Number(interval));
    return date;
  };

  const getDaysRemaining = (nextVisit) => {
    const now = new Date();
    const diff = nextVisit - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getPriority = (days) => {
    if (days < 0) return "OVERDUE";
    if (days <= 7) return "CRITICAL";
    if (days <= 30) return "IMPORTANT";
    return "NORMAL";
  };

  const showToast = (message, type = "success") => {

    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);

  };

  /* ======================================================
     VISIT NOTIFICATION
  ====================================================== */

  useEffect(() => {

    checkups?.forEach((c) => {

      const next = calculateNextVisit(c.lastVisit, c.intervalMonths);
      const days = getDaysRemaining(next);

      if (days === 0 && !toast) {
        showToast(`Checkup due today: ${c.type}`, "warning");
      }

      if (days < 0 && !toast) {
        showToast(`Checkup overdue: ${c.type}`, "error");
      }

    });

  }, [checkups]);

  /* ======================================================
     ADD CHECKUP
  ====================================================== */

  const handleAdd = async () => {

    await API.post("/checkups", form);

    showToast("Checkup added successfully");

    setForm({
      type: "",
      doctorName: "",
      lastVisit: "",
      intervalMonths: "",
      notes: "",
    });

    queryClient.invalidateQueries({ queryKey: ["checkups"] });

  };

  /* ======================================================
     COMPLETE CHECKUP
  ====================================================== */

  const markCompleted = async (checkup) => {

    setHistory((prev) => [
      ...prev,
      {
        ...checkup,
        completedAt: new Date(),
      },
    ]);

    await API.patch(`/checkups/${checkup._id}/complete`);

    showToast("Checkup marked as completed");

    queryClient.invalidateQueries({ queryKey: ["checkups"] });

  };

  /* ======================================================
     DELETE CHECKUP
  ====================================================== */

  const deleteCheckup = async (id) => {

    if (!window.confirm("Delete this checkup?")) return;

    await API.delete(`/checkups/${id}`);

    showToast("Checkup deleted", "error");

    queryClient.invalidateQueries({ queryKey: ["checkups"] });

  };

  /* ======================================================
     EDIT CHECKUP DATE
  ====================================================== */

  const editCheckupDate = async (checkup) => {

    const newDate = prompt(
      "Enter new last visit date (YYYY-MM-DD)",
      checkup.lastVisit?.slice(0, 10)
    );

    if (!newDate) return;

    await API.put(`/checkups/${checkup._id}`, {
      ...checkup,
      lastVisit: newDate
    });

    showToast("Checkup updated");

    queryClient.invalidateQueries({ queryKey: ["checkups"] });

  };

  /* ======================================================
     FILTER + SORT
  ====================================================== */

  const processed = useMemo(() => {

    let data = [...(checkups || [])];

    if (search) {
      data = data.filter((c) =>
        c.type.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter !== "ALL") {
      data = data.filter((c) => {

        const next = calculateNextVisit(c.lastVisit, c.intervalMonths);
        const days = getDaysRemaining(next);
        const priority = getPriority(days);

        if (filter === "UPCOMING") return days >= 0;
        if (filter === "OVERDUE") return days < 0;
        if (filter === "CRITICAL") return priority === "CRITICAL";

        return true;

      });
    }

    data.sort((a, b) => {

      const nextA = calculateNextVisit(a.lastVisit, a.intervalMonths);
      const nextB = calculateNextVisit(b.lastVisit, b.intervalMonths);

      return nextA - nextB;

    });

    return data;

  }, [checkups, search, filter]);

  /* ======================================================
     STATS
  ====================================================== */

  const total = checkups.length;

  const overdueCount = checkups.filter((c) => {
    const next = calculateNextVisit(c.lastVisit, c.intervalMonths);
    return getDaysRemaining(next) < 0;
  }).length;

  const upcomingCount = checkups.filter((c) => {
    const next = calculateNextVisit(c.lastVisit, c.intervalMonths);
    return getDaysRemaining(next) >= 0;
  }).length;

  /* ======================================================
     RENDER
  ====================================================== */

  return (

    <div className="page-checkups page-content">

      <div className="page-header">

        <h2 className="page-title">
          <span className="title-icon">📅</span>
          Checkup Reminder System
        </h2>

        <p className="page-subtitle">
          Track preventive medical visits and never miss an important health check.
        </p>

      </div>

      <div className="stats-panel">

        <div className="stat-card total">
          <span className="stat-title">Total Checkups</span>
          <h2>{total}</h2>
        </div>

        <div className="stat-card overdue">
          <span className="stat-title">Overdue</span>
          <h2>{overdueCount}</h2>
        </div>

        <div className="stat-card upcoming">
          <span className="stat-title">Upcoming</span>
          <h2>{upcomingCount}</h2>
        </div>

      </div>

      <div className="checkup-form">

        <h3 className="form-title">
          <span className="form-icon">🩺</span>
          Add Checkup
        </h3>

        <div className="form-grid">

          <input
            className="form-input"
            placeholder="Checkup Type"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          />

          <input
            className="form-input"
            placeholder="Doctor Name"
            value={form.doctorName}
            onChange={(e) =>
              setForm({ ...form, doctorName: e.target.value })
            }
          />

          <input
            className="form-input"
            type="date"
            value={form.lastVisit}
            onChange={(e) =>
              setForm({ ...form, lastVisit: e.target.value })
            }
          />

          <input
            className="form-input"
            type="number"
            placeholder="Interval (Months)"
            value={form.intervalMonths}
            onChange={(e) =>
              setForm({ ...form, intervalMonths: e.target.value })
            }
          />

          <textarea
            className="form-input"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          />

        </div>

        <div className="form-actions">

          <button
            className="btn btn-primary"
            onClick={handleAdd}
          >
            Add Checkup
          </button>

        </div>

      </div>

      <div className="search-panel">

        <div className="search-grid">

          <input
            className="form-input"
            placeholder="Search checkup..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="form-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >

            <option value="ALL">All</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CRITICAL">Critical (7 days)</option>

          </select>

        </div>

      </div>

      <div className="checkup-grid">

        {processed.map((c) => {

          const next = calculateNextVisit(c.lastVisit, c.intervalMonths);
          const days = getDaysRemaining(next);
          const priority = getPriority(days);

          return (

            <div
              key={c._id}
              className={`checkup-card ${priority.toLowerCase()}`}
            >

              <div className="checkup-card-header">

                <h3>{c.type}</h3>

                <span
                  className={`priority-badge ${priority.toLowerCase()}`}
                >
                  {priority}
                </span>

              </div>

              <div className="checkup-card-details">

                <div>
                  <label>Doctor</label>
                  <p>{c.doctorName}</p>
                </div>

                <div>
                  <label>Next Visit</label>
                  <p>{next.toDateString()}</p>
                </div>

              </div>

              <div className="days-remaining">
                Days Remaining:
                <span> {days}</span>
              </div>

              <div className="checkup-actions">

                <button
                  className="complete-btn"
                  onClick={() => markCompleted(c)}
                >
                  Done
                </button>

                <button
                  className="edit-btn"
                  onClick={() => editCheckupDate(c)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteCheckup(c._id)}
                >
                  Delete
                </button>

              </div>

            </div>

          );

        })}

      </div>

      {toast && (
        <div className={`glass-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

    </div>

  );

}