import { useEffect, useState, useMemo } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";

export default function Documents() {

  /* =====================================================
     STATE
  ===================================================== */

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [sort, setSort] = useState("NEWEST");
  const [viewMode, setViewMode] = useState("GRID");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({
    title: "",
    type: "",
    file: null,
  });

  /* =====================================================
     FETCH
  ===================================================== */

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const res = await API.get("/api/documents");
    setDocuments(res.data);
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return "📄";
    if (fileUrl.endsWith(".pdf")) return "📕";
    if (fileUrl.endsWith(".jpg") || fileUrl.endsWith(".png")) return "🖼️";
    if (fileUrl.endsWith(".doc") || fileUrl.endsWith(".docx")) return "📘";
    return "📄";
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString();

  /* =====================================================
     UPLOAD FUNCTION
  ===================================================== */

  const handleUpload = async () => {

    if (!form.title || !form.type || !form.file) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("type", form.type);
    formData.append("file", form.file);

    try {
      setUploading(true);
      setUploadProgress(30);

      await API.post("/documents", formData);

      setUploadProgress(100);

      setForm({
        title: "",
        type: "",
        file: null,
      });

      fetchDocuments();

    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 800);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete document?")) return;
    await API.delete(`/api/documents/${id}`);
    fetchDocuments();
  };

  /* =====================================================
     FILTER / SORT
  ===================================================== */

  const filteredDocs = useMemo(() => {

    let data = [...documents];

    if (search) {
      data = data.filter((d) =>
        d.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterType !== "ALL") {
      data = data.filter((d) => d.type === filterType);
    }

    switch (sort) {
      case "NEWEST":
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "OLDEST":
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "A_Z":
        data.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return data;

  }, [documents, search, filterType, sort]);

  /* =====================================================
     STATS
  ===================================================== */

  const totalDocs = documents.length;
  const labReports = documents.filter((d) => d.type === "Lab Report").length;
  const prescriptions = documents.filter((d) => d.type === "Prescription").length;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <Layout>

      <h2>📁 Health Documents</h2>

      {/* ================= SUMMARY ================= */}

      <div className="grid">
        <div className="card dashboard-card">
          <h3>Total Documents</h3>
          <p>{totalDocs}</p>
        </div>

        <div className="card dashboard-card">
          <h3>Lab Reports</h3>
          <p>{labReports}</p>
        </div>

        <div className="card dashboard-card">
          <h3>Prescriptions</h3>
          <p>{prescriptions}</p>
        </div>
      </div>

      {/* ================= CUSTOM UPLOAD CARD ================= */}

      <div className="upload-card" style={{ marginTop: 40 }}>

        <h2 className="upload-title">📂 Upload Document</h2>

        <div className="input-group">
          <label>Document Title</label>
          <input
            type="text"
            placeholder="e.g. Blood Test Report - Jan 2026"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>Document Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="">Select Type</option>
            <option value="Lab Report">Lab Report</option>
            <option value="Prescription">Prescription</option>
            <option value="Invoice">Invoice</option>
            <option value="Scan">Scan</option>
            <option value="Insurance">Insurance</option>
          </select>
        </div>

        <div className="file-upload-wrapper">
          <label className="file-upload-box">
            <input
              type="file"
              onChange={(e) =>
                setForm({ ...form, file: e.target.files[0] })
              }
              hidden
            />

            <div className="upload-content">
              <div className="upload-icon">⬆️</div>

              {form.file ? (
                <p>{form.file.name}</p>
              ) : (
                <>
                  <p className="upload-text">Drag & Drop file here</p>
                  <span className="upload-subtext">
                    or click to browse
                  </span>
                </>
              )}
            </div>
          </label>
        </div>

        {uploading && (
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <button className="upload-btn" onClick={handleUpload}>
          🚀 Upload Document
        </button>

      </div>

      {/* ================= DOCUMENT LIST ================= */}

      <div style={{ marginTop: 40 }}>

        {filteredDocs.length === 0 && (
          <p>No documents found.</p>
        )}

        <div className={viewMode === "GRID" ? "grid" : ""}>

          {filteredDocs.map((doc) => (
            <div key={doc._id} className="card document-card">

              <h3>
                {getFileIcon(doc.fileUrl)} {doc.title}
              </h3>

              <p>Type: {doc.type}</p>
              <p>Uploaded: {formatDate(doc.createdAt)}</p>

              <div className="doc-actions">
                <a
                  href={`http://localhost:5000${doc.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>

                <button onClick={() => handleDelete(doc._id)}>
                  Delete
                </button>
              </div>

            </div>
          ))}

        </div>

      </div>

    </Layout>
  );
}