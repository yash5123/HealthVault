import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

import { fetchMedicines } from "../../queries/medicinesQuery";
import { fetchDocuments } from "../../queries/documentsQuery";
import { fetchCheckups } from "../../queries/checkupsQuery";
import { fetchDashboard } from "../../queries/dashboardQuery";

import "../../styles/layout.css";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const prefetchMedicines = () => {
    queryClient.prefetchQuery({
      queryKey: ["medicines"],
      queryFn: fetchMedicines,
      staleTime: 1000 * 60 * 5
    });
  };

  const prefetchDocuments = () => {
    queryClient.prefetchQuery({
      queryKey: ["documents"],
      queryFn: fetchDocuments,
      staleTime: 1000 * 60 * 5
    });
  };

  const prefetchCheckups = () => {
    queryClient.prefetchQuery({
      queryKey: ["checkups"],
      queryFn: fetchCheckups,
      staleTime: 1000 * 60 * 5
    });
  };

  const prefetchDashboard = () => {
    queryClient.prefetchQuery({
      queryKey: ["dashboard"],
      queryFn: fetchDashboard,
      staleTime: 1000 * 60 * 5
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-container">

      {/* === BACKGROUND ORBS === */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>

      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

        {/* HEADER */}
        <div className="sidebar-header">
          <div className="logo">
            💜 {!collapsed && <span>MedVault</span>}
          </div>

          {/* Collapse Button */}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "➡" : "⬅"}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="nav-links">

          <NavLink to="/" end onMouseEnter={prefetchDashboard}>
            <span className="icon">📊</span>
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/documents" onMouseEnter={prefetchDocuments}>
            <span className="icon">📂</span>
            {!collapsed && <span>Document Vault</span>}
          </NavLink>

          <NavLink to="/medicines" onMouseEnter={prefetchMedicines}>
            <span className="icon">💊</span>
            {!collapsed && <span>Medicines Management </span>}
          </NavLink>

          <NavLink to="/lowstock" onMouseEnter={prefetchMedicines}>
            <span className="icon">🚨</span>
            {!collapsed && <span>Stock Alert</span>}
          </NavLink>

          <NavLink to="/checkups" onMouseEnter={prefetchCheckups}>
            <span className="icon">📅</span>
            {!collapsed && <span>Checkup Reminders</span>}
          </NavLink>

          <NavLink to="/hospitals">
            <span className="icon">🏥</span>
            {!collapsed && <span>Find Hospitals</span>}
          </NavLink>

        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">

          {!collapsed && (
            <div className="profile-box">
              <div className="profile-avatar">👤</div>
              <div>
                <p className="profile-name">Patient</p>
                <span className="profile-status">
                  ● Secure
                </span>
              </div>
            </div>
          )}

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            🔓 {!collapsed && "Logout"}
          </button>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="main-content">
        <div className="page-container">
          {children}
        </div>
      </main>

    </div>
  );
}