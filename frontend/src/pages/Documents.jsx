import { useEffect, useState, useMemo } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";
import "../styles/pages/documents.css";

export default function Documents() {

  /* ================= STATE ================= */

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Lab Report");
  const [file, setFile] = useState(null);


  /* ================= FETCH DOCUMENTS ================= */

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


  /* ================= UPLOAD DOCUMENT ================= */

  const handleUpload = async () => {

    if (!title || !file) {
      alert("Please fill all fields");
      return;
    }

    try {

      const formData = new FormData();

      formData.append("title", title);
      formData.append("type", type);
      formData.append("file", file);

      await API.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Document uploaded successfully!");

      setTitle("");
      setFile(null);

      fetchDocuments();

    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };


  /* ================= FILTER DOCUMENTS ================= */

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


  /* ================= STATS ================= */

  const total = documents.length;
  const lab = documents.filter(d => d.type === "Lab Report").length;
  const prescription = documents.filter(d => d.type === "Prescription").length;


  /* ================= UI ================= */

  return (
    <Layout>

      <div className="page-container page-documents">

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              className="form-input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Lab Report</option>
              <option>Prescription</option>
              <option>Other</option>
            </select>

            <input
              type="file"
              className="form-input"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              className="btn-primary"
              onClick={handleUpload}
            >
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