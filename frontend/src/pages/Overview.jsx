import { useEffect, useState, useMemo } from "react";
import API from "../services/api";

import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useCountUp } from "../hooks/useCountUp";
import { fetchDashboard } from "../queries/dashboardQuery";

import AnimatedBackground from "../components/dashboard/AnimatedBackground";
import CursorGlow from "../components/dashboard/CursorGlow";
import NotificationBell from "../components/dashboard/NotificationBell";

import "../styles/pages/overview.css";

export default function Overview() {

  const navigate = useNavigate();

  const { data, isLoading: loading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 5
  });

  const medicines = data?.medicines || [];
  const documents = data?.documents || [];
  const checkups = data?.checkups || [];

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
      <div className="page-loader-overlay">
        <div className="page-loader"></div>
      </div>
    );

  }

  return (

    <div className="dashboard-page">

      <AnimatedBackground />

      <CursorGlow />

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">

        <div>

          <h1 className="dashboard-title">
            Health Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Intelligent health monitoring system
          </p>

        </div>

        <div className="dashboard-header-right">
          <NotificationBell />
        </div>

      </div>

      {/* ================= KPI PANELS ================= */}

      <div className="dashboard-stats-grid">

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">
            Total Medicines
          </div>
          <div className="dashboard-stat-value">
            {totalAnimated}
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-healthy">
          <div className="dashboard-stat-label">
            Healthy
          </div>
          <div className="dashboard-stat-value">
            {healthyAnimated}
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-low">
          <div className="dashboard-stat-label">
            Low Stock
          </div>
          <div className="dashboard-stat-value">
            {lowAnimated}
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-critical">
          <div className="dashboard-stat-label">
            Critical
          </div>
          <div className="dashboard-stat-value">
            {criticalAnimated}
          </div>
        </div>

      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div style={{ marginTop: 60 }}>

        <h2>Quick Actions</h2>

        <div
          className="dashboard-quick-actions"
          style={{ marginTop: 20 }}
        >

          <div
            className="dashboard-action-card"
            onClick={() => navigate("/medicines")}
          >

            <h3>Manage Medicines</h3>

            <p>
              Track stock levels and dosage information
            </p>

          </div>

          <div
            className="dashboard-action-card"
            onClick={() => navigate("/documents")}
          >

            <h3>Upload Documents</h3>

            <p>
              Store prescriptions and reports securely
            </p>

          </div>

          <div
            className="dashboard-action-card"
            onClick={() => navigate("/hospitals")}
          >

            <h3>Find Hospitals</h3>

            <p>
              Locate nearby care centers
            </p>

          </div>

        </div>

      </div>

      {/* ================= DOCUMENT ANALYTICS ================= */}

      <div style={{ marginTop: 60 }}>

        <h2>Document Distribution</h2>

        <div
          className="dashboard-quick-actions"
          style={{ marginTop: 20 }}
        >

          {Object.entries(documentTypes).length === 0 && (
            <p>No document analytics yet.</p>
          )}

          {Object.entries(documentTypes).map(
            ([type, count]) => (

              <div
                key={type}
                className="dashboard-stat-card"
              >

                <strong>{type}</strong>

                <p>{count} file(s)</p>

              </div>

            )
          )}

        </div>

      </div>

      {/* ================= RECENT MEDICINES ================= */}

      <div style={{ marginTop: 60 }}>

        <h2>Recent Medicines</h2>

        <div
          className="dashboard-quick-actions"
          style={{ marginTop: 20 }}
        >

          {recentMedicines.length === 0 && (
            <p>No medicines added yet.</p>
          )}

          {recentMedicines.map((m) => {

            const status =
              m.quantity === 0
                ? "dashboard-status-critical"
                : m.quantity <= m.lowStockThreshold
                ? "dashboard-status-low"
                : "dashboard-status-healthy";

            return (

              <div
                key={m._id}
                className="dashboard-medicines-card"
              >

                <strong>{m.name}</strong>

                <p>Qty: {m.quantity}</p>

                <span
                  className={`dashboard-medicine-status ${status}`}
                >

                  {m.quantity === 0
                    ? "Critical"
                    : m.quantity <= m.lowStockThreshold
                    ? "Low"
                    : "Healthy"}

                </span>

              </div>

            );

          })}

        </div>

      </div>

      {/* ================= UPCOMING CHECKUPS ================= */}

      <div style={{ marginTop: 60 }}>

        <h2>Upcoming Checkups</h2>

        <div
          className="dashboard-quick-actions"
          style={{ marginTop: 20 }}
        >

          {upcomingCheckups.length === 0 && (
            <p>No checkups scheduled.</p>
          )}

          {upcomingCheckups.map((c) => {

            const next = new Date(c.lastVisit);

            next.setMonth(
              next.getMonth() + Number(c.intervalMonths)
            );

            return (

              <div
                key={c._id}
                className="dashboard-checkups-card"
              >

                <strong>{c.type}</strong>

                <p>
                  Next Visit: {next.toDateString()}
                </p>

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

}