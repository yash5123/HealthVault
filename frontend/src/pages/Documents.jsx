import { useEffect, useState, useMemo } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";
import "../styles/pages/documents.css";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await API.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDocs = useMemo(() => {
    let data = [...documents];

    if (search) {
      data = data.filter((d) =>
        d.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter !== "ALL") {
      data = data.filter((d) => d.type === filter);
    }

    return data;
  }, [documents, search, filter]);

  const total = documents.length;
  const lab = documents.filter(d => d.type === "Lab Report").length;
  const prescription = documents.filter(d => d.type === "Prescription").length;

  return (
    <Layout>
      <div className="page-container page-documents"> {/* ✅ WRAPPER */}

        {/* ================= HEADER ================= */}
        <div className="page-header">
          <h1 className="page-title">Document Vault</h1>
          <p className="page-subtitle">
            Securely manage prescriptions, lab reports and medical records.
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid">

          <div className="stat-card purple">
            <span>Total Documents</span>
            <h2>{total}</h2>
          </div>

          <div className="stat-card green">
            <span>Lab Reports</span>
            <h2>{lab}</h2>
          </div>

          <div className="stat-card orange">
            <span>Prescriptions</span>
            <h2>{prescription}</h2>
          </div>

        </div>

        {/* ================= UPLOAD SECTION ================= */}
        <div className="card upload-section">
          <h2 className="section-title">Upload New Document</h2>

          <div className="grid">

            <input
              type="text"
              placeholder="Document Title"
              className="form-input"
            />

            <select className="form-input">
              <option>Lab Report</option>
              <option>Prescription</option>
              <option>Other</option>
            </select>

            <input
              type="file"
              className="form-input"
            />

            <button className="btn-primary">
              Upload Document
            </button>

          </div>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search documents..."
            className="form-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ================= DOCUMENT GRID ================= */}
        <div className="grid document-grid">

          {filteredDocs.length === 0 && (
            <p className="empty-text">No documents uploaded yet.</p>
          )}

          {filteredDocs.map((doc) => (
            <div key={doc._id} className="card document-card">
              <strong>{doc.title}</strong>
              <p>{doc.type}</p>
              <p>{new Date(doc.createdAt).toDateString()}</p>
            </div>
          ))}

        </div>

      </div>
    </Layout>
  );
}