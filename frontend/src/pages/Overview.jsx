import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import API from "../services/api";
import { useCountUp } from "../hooks/useCountUp";

export default function Overview() {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [medRes, docRes, checkRes] = await Promise.all([
          API.get("/medicines"),
          API.get("/documents"),
          API.get("/checkups"),
        ]);

        setMedicines(medRes.data);
        setDocuments(docRes.data);
        setCheckups(checkRes.data);
      } catch (err) {
        console.log("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ================= ANALYTICS ================= */

  const healthyCount = useMemo(
    () =>
      medicines.filter(
        (m) => m.quantity > m.lowStockThreshold
      ).length,
    [medicines]
  );

  const lowStockCount = useMemo(
    () =>
      medicines.filter(
        (m) =>
          m.quantity <= m.lowStockThreshold &&
          m.quantity > 0
      ).length,
    [medicines]
  );

  const criticalCount = useMemo(
    () =>
      medicines.filter((m) => m.quantity === 0).length,
    [medicines]
  );

  const documentTypes = useMemo(() => {
    const counts = {};
    documents.forEach((doc) => {
      counts[doc.type] = (counts[doc.type] || 0) + 1;
    });
    return counts;
  }, [documents]);

  const recentMedicines = medicines.slice(-3).reverse();
  const upcomingCheckups = checkups.slice(-3).reverse();

  /* ================= ANIMATED NUMBERS ================= */

  const totalAnimated = useCountUp(medicines.length);
  const healthyAnimated = useCountUp(healthyCount);
  const lowAnimated = useCountUp(lowStockCount);
  const criticalAnimated = useCountUp(criticalCount);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <Layout>
        <div className="page-loader-overlay">
          <div className="page-loader"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      {/* ================= HEADER ================= */}

      <div className="page-header">
        <h1 className="page-title">
          AI Health Dashboard
        </h1>
        <p className="page-subtitle">
          Intelligent health monitoring system
        </p>
      </div>

      {/* ================= KPI PANELS ================= */}

      <div className="grid">

        {[
          { label: "Total Medicines", value: totalAnimated },
          { label: "Healthy", value: healthyAnimated },
          { label: "Low Stock", value: lowAnimated },
          { label: "Critical", value: criticalAnimated },
        ].map((item, index) => (
          <div
            key={item.label}
            className="ai-panel stagger-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="ai-panel-title">
              {item.label}
            </div>
            <div className="ai-panel-value">
              {item.value}
            </div>
          </div>
        ))}

      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div style={{ marginTop: 70 }}>
        <h2>Quick Actions</h2>

        <div className="grid" style={{ marginTop: 25 }}>

          <div
            className="card action-card"
            onClick={() => navigate("/medicines")}
          >
            <div className="action-icon">💊</div>
            <div>
              <h4>Manage Medicines</h4>
              <p>Track stock & dosage</p>
            </div>
          </div>

          <div
            className="card action-card"
            onClick={() => navigate("/documents")}
          >
            <div className="action-icon">📁</div>
            <div>
              <h4>Upload Documents</h4>
              <p>Store reports securely</p>
            </div>
          </div>

          <div
            className="card action-card"
            onClick={() => navigate("/hospitals")}
          >
            <div className="action-icon">🏥</div>
            <div>
              <h4>Find Hospitals</h4>
              <p>Locate nearby care centers</p>
            </div>
          </div>

        </div>
      </div>

      {/* ================= DOCUMENT ANALYTICS ================= */}

      <div style={{ marginTop: 70 }}>
        <h2>Document Distribution</h2>

        <div className="grid" style={{ marginTop: 25 }}>
          {Object.entries(documentTypes).length === 0 && (
            <p>No document analytics yet.</p>
          )}

          {Object.entries(documentTypes).map(([type, count]) => (
            <div key={type} className="card">
              <strong>{type}</strong>
              <p>{count} file(s)</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RECENT MEDICINES ================= */}

      <div style={{ marginTop: 70 }}>
        <h2>Recent Medicines</h2>

        <div className="grid" style={{ marginTop: 25 }}>
          {recentMedicines.length === 0 && (
            <p>No medicines added yet.</p>
          )}

          {recentMedicines.map((m) => (
            <div
              key={m._id}
              className={`card ${m.quantity === 0 ? "card-critical" : ""
                }`}
            >
              <strong>{m.name}</strong>
              <p>Qty: {m.quantity}</p>
              <p>
                Status:{" "}
                {m.quantity === 0
                  ? "❌ Critical"
                  : m.quantity <= m.lowStockThreshold
                    ? "⚠ Low"
                    : "✅ Healthy"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= UPCOMING CHECKUPS ================= */}

      <div style={{ marginTop: 70 }}>
        <h2>Upcoming Checkups</h2>

        <div className="grid" style={{ marginTop: 25 }}>
          {upcomingCheckups.length === 0 && (
            <p>No checkups scheduled.</p>
          )}

          {upcomingCheckups.map((c) => {
            const next = new Date(c.lastVisit);
            next.setMonth(
              next.getMonth() + Number(c.intervalMonths)
            );

            return (
              <div key={c._id} className="card">
                <strong>{c.type}</strong>
                <p>Next Visit: {next.toDateString()}</p>
              </div>
            );
          })}
        </div>
      </div>

    </Layout>
  );
}