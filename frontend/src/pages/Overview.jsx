import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import API from "../services/api";

export default function Overview() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    medicines: 0,
    lowStock: 0,
    documents: 0,
    overdue: 0,
  });

  const [recentMeds, setRecentMeds] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meds = await API.get("/api/medicines");
        const docs = await API.get("/api/documents");
        const checkups = await API.get("/api/checkups");

        const lowStock = meds.data.filter(
          (m) => m.quantity <= m.lowStockThreshold
        );

        const overdue = checkups.data.filter((c) => {
          const next = new Date(c.lastVisit);
          next.setMonth(
            next.getMonth() + Number(c.intervalMonths)
          );
          return new Date() > next;
        });

        setStats({
          medicines: meds.data.length,
          lowStock: lowStock.length,
          documents: docs.data.length,
          overdue: overdue.length,
        });

        setRecentMeds(meds.data.slice(-3));
        setUpcoming(checkups.data.slice(-3));
      } catch (err) {
        console.log("Overview error:", err.response?.data || err);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">
          Dashboard Overview
        </h1>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid">
        <div className="card dashboard-card">
          <h3>💊 Medicines</h3>
          <p>{stats.medicines}</p>
        </div>

        <div className="card dashboard-card warning">
          <h3>⚠ Low Stock</h3>
          <p>{stats.lowStock}</p>
        </div>

        <div className="card dashboard-card">
          <h3>📄 Documents</h3>
          <p>{stats.documents}</p>
        </div>

        <div className="card dashboard-card danger">
          <h3>🚨 Overdue Checkups</h3>
          <p>{stats.overdue}</p>
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div style={{ marginTop: 50 }}>
        <h3>🚀 Quick Actions</h3>

        <div className="grid" style={{ marginTop: 20 }}>
          <div
            className="card dashboard-card action-card"
            onClick={() => navigate("/hospitals")}
          >
            <div className="action-icon">🏥</div>
            <div>
              <h4>Find Hospitals</h4>
              <p>Locate nearby hospitals instantly</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RECENT MEDICINES ================= */}
      <div style={{ marginTop: 50 }}>
        <h3>🧾 Recent Medicines</h3>

        <div className="grid">
          {recentMeds.map((m) => (
            <div key={m._id} className="card">
              <strong>{m.name}</strong>
              <p>{m.dosage}</p>
              <p>Qty: {m.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= UPCOMING CHECKUPS ================= */}
      <div style={{ marginTop: 50 }}>
        <h3>📅 Upcoming Checkups</h3>

        <div className="grid">
          {upcoming.map((c) => {
            const next = new Date(c.lastVisit);
            next.setMonth(
              next.getMonth() + Number(c.intervalMonths)
            );

            return (
              <div key={c._id} className="card">
                <strong>{c.type}</strong>
                <p>Next: {next.toDateString()}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
} 