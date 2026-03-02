import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { name: "Overview", path: "/" },
    { name: "Documents", path: "/documents" },
    { name: "Medicines", path: "/medicines" },
    { name: "Low Stock", path: "/low-stock" },
    { name: "Checkups", path: "/checkups" }
  ];

  return (
    <div style={{
      width: 220,
      background: "#1e293b",
      padding: 20,
      minHeight: "calc(100vh - 60px)"
    }}>
      {links.map(link => (
        <div key={link.path} style={{ marginBottom: 15 }}>
          <Link
            to={link.path}
            style={{
              color:
                location.pathname === link.path
                  ? "#60a5fa"
                  : "#cbd5e1",
              fontWeight:
                location.pathname === link.path
                  ? "bold"
                  : "normal"
            }}
          >
            {link.name}
          </Link>
        </div>
      ))}
    </div>
  );
}