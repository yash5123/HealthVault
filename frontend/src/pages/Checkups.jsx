import { useEffect, useState, useMemo } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";

export default function Checkups() {

/* ======================================================
   STATE
====================================================== */

const [checkups, setCheckups] = useState([]);
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("ALL");
const [history, setHistory] = useState([]);

const [form, setForm] = useState({
  type: "",
  doctor: "",
  lastVisit: "",
  intervalMonths: "",
  notes: "",
});

/* ======================================================
   FETCH
====================================================== */

useEffect(() => {
  fetchCheckups();
}, []);

const fetchCheckups = async () => {
  const res = await API.get("/api/checkups");
  setCheckups(res.data);
};

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

const getPriorityColor = (priority) => {
  switch (priority) {
    case "OVERDUE":
      return "#ef4444";
    case "CRITICAL":
      return "#f97316";
    case "IMPORTANT":
      return "#f59e0b";
    default:
      return "#10b981";
  }
};

/* ======================================================
   ADD CHECKUP
====================================================== */

const handleAdd = async () => {
  await API.post("/api/checkups", form);  // ✅ FIXED ROUTE
  setForm({
    type: "",
    doctor: "",
    lastVisit: "",
    intervalMonths: "",
    notes: "",
  });
  fetchCheckups();
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

  await API.patch(`/api/checkups/${checkup._id}/complete`);
  fetchCheckups();
};

/* ======================================================
   FILTER + SORT
====================================================== */

const processed = useMemo(() => {
  let data = [...checkups];

  if (search) {
    data = data.filter((c) =>
      c.type.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filter !== "ALL") {
    data = data.filter((c) => {
      const next = calculateNextVisit(
        c.lastVisit,
        c.intervalMonths
      );
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
  <Layout>

    <h2>📅 Checkup Reminder System</h2>

    {/* SUMMARY */}
    <div className="grid">
      <div className="card dashboard-card">
        <h3>Total Checkups</h3>
        <p>{total}</p>
      </div>

      <div className="card dashboard-card danger">
        <h3>Overdue</h3>
        <p>{overdueCount}</p>
      </div>

      <div className="card dashboard-card">
        <h3>Upcoming</h3>
        <p>{upcomingCount}</p>
      </div>
    </div>

    {/* ADD FORM */}
    <div className="card" style={{ marginTop: 30 }}>
      <h3>Add Checkup</h3>

      <div className="grid">
        <input
          placeholder="Checkup Type"
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        />

        <input
          placeholder="Doctor Name"
          value={form.doctor}
          onChange={(e) =>
            setForm({ ...form, doctor: e.target.value })
          }
        />

        <input
          type="date"
          value={form.lastVisit}
          onChange={(e) =>
            setForm({
              ...form,
              lastVisit: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Interval (Months)"
          value={form.intervalMonths}
          onChange={(e) =>
            setForm({
              ...form,
              intervalMonths: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({
              ...form,
              notes: e.target.value,
            })
          }
        />
      </div>

      <button
        style={{ marginTop: 15 }}
        onClick={handleAdd}
      >
        Add Checkup
      </button>
    </div>

    {/* FILTER */}
    <div className="card" style={{ marginTop: 30 }}>
      <div className="grid">
        <input
          placeholder="Search checkup..."
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
          <option value="UPCOMING">Upcoming</option>
          <option value="OVERDUE">Overdue</option>
          <option value="CRITICAL">Critical (7 days)</option>
        </select>
      </div>
    </div>

    {/* LIST */}
    <div style={{ marginTop: 40 }}>
      {processed.map((c) => {

        const next = calculateNextVisit(
          c.lastVisit,
          c.intervalMonths
        );

        const days = getDaysRemaining(next);
        const priority = getPriority(days);
        const color = getPriorityColor(priority);

        return (
          <div
            key={c._id}
            className="card"
            style={{
              marginBottom: 25,
              borderLeft: `6px solid ${color}`,
            }}
          >
            <h3>{c.type}</h3>
            <p>Doctor: {c.doctor}</p>
            <p>Next Visit: {next.toDateString()}</p>
            <p>Days Remaining: {days}</p>

            <div
              className="progress-container"
              style={{ marginTop: 15 }}
            >
              <div
                className="progress-bar"
                style={{
                  width: `${Math.min((30 - days) * 3, 100)}%`,
                  background: color,
                }}
              />
            </div>

            <div style={{ marginTop: 15 }}>
              <button onClick={() => markCompleted(c)}>
                Mark Completed
              </button>
            </div>

          </div>
        );
      })}
    </div>

    {/* HISTORY */}
    <div style={{ marginTop: 50 }}>
      <h3>📜 Completion History</h3>

      {history.length === 0 && (
        <p>No completed checkups yet.</p>
      )}

      {history.map((item, index) => (
        <div key={index} className="card">
          <p>
            {item.type} completed on{" "}
            {item.completedAt.toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>

  </Layout>
);
}