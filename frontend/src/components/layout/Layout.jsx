import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./layout.css";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-container">

      <div className="floating-shape shape1"></div>
      <div className="floating-shape shape2"></div>

      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

        <div className="sidebar-header">
          <div className="logo">
            💜 <span>MedVault</span>
          </div>
        </div>

        <nav className="nav-links">

          <NavLink to="/" end>
            <span className="icon">📊</span>
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/documents">
            <span className="icon">📂</span>
            {!collapsed && <span>Document Vault</span>}
          </NavLink>

          <NavLink to="/medicines">
            <span className="icon">💊</span>
            {!collapsed && <span>Medicine Timer</span>}
          </NavLink>

          <NavLink to="/lowstock">
            <span className="icon">🚨</span>
            {!collapsed && <span>Stock Alert</span>}
          </NavLink>

          <NavLink to="/checkups">
            <span className="icon">📅</span>
            {!collapsed && <span>Checkup Reminders</span>}
          </NavLink>

          <NavLink to="/hospitals">
            <span className="icon">🏥</span>
            {!collapsed && <span>Find Hospitals</span>}
          </NavLink>

        </nav>

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
        {children}
      </main>

    </div>
  );
}