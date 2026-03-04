import { useEffect, useState, useMemo, useRef } from "react";
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

  const fileInputRef = useRef(null);


  /* ================= FETCH DOCUMENTS ================= */

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await API.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error("Fetch documents error:", err);
    }
  };


  /* ================= UPLOAD DOCUMENT ================= */

  const handleUpload = async () => {

    if (!title.trim()) {
      alert("Please enter document title");
      return;
    }

    if (!file) {
      alert("Please select a file");
      return;
    }

    try {

      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      formData.append("file", file);

      await API.post("/documents", formData, {
        transformRequest: (data) => data
      });

      alert("Document uploaded successfully!");

      /* reset fields */

      setTitle("");
      setType("Lab Report");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchDocuments();

    } catch (err) {

      console.error("Upload error:", err);

      if (err.response) {
        console.error("Server error:", err.response.data);
        alert(err.response.data.message || "Upload failed");
      } else if (err.request) {
        console.error("Network error:", err.request);
        alert("Network error while uploading");
      } else {
        alert("Upload failed");
      }

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
              ref={fileInputRef}
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

              <a
                href={`https://healthvault-o7bs.onrender.com${doc.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ marginTop: "10px", display: "inline-block" }}
              >
                View Document
              </a>

            </div>
          ))}

        </div>

      </div>

    </Layout>
  );
}