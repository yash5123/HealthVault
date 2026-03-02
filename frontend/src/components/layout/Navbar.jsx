import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { logout } = useContext(AuthContext);

  return (
    <div style={{
      height: 60,
      background: "#111827",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 30px",
      borderBottom: "1px solid #1f2937"
    }}>
      <h2 style={{ color: "#60a5fa" }}>HealthVault</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}