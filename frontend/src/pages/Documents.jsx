import { fetchDocuments } from "../queries/documentsQuery";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";
import DocumentCard from "../components/documents/DocumentCard";
import "../styles/pages/documents.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Documents() {

  /* ================= STATE ================= */

  const queryClient = useQueryClient();
  const {
    data: documents = [],
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });

  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Lab Report");
  const [file, setFile] = useState(null);

  const [message, setMessage] = useState(null);

  const fileInputRef = useRef(null);

  /* ================= AUTO CLEAR MESSAGE ================= */

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);


  /* ================= FILE SELECT ================= */

  const handleFileChange = (e) => {

    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setMessage({ type: "error", text: "No file selected" });
      return;
    }

    setFile(selectedFile);

  };

  /* ================= UPLOAD DOCUMENT ================= */

  const handleUpload = async () => {

    if (!title.trim()) {
      setMessage({ type: "error", text: "Please enter document title" });
      return;
    }

    if (!file) {
      setMessage({ type: "error", text: "Please select a file" });
      return;
    }

    try {

      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      formData.append("file", file);

      await API.post("/documents", formData);

      setMessage({
        type: "success",
        text: "Document uploaded successfully"
      });

      setTitle("");
      setType("Lab Report");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      queryClient.invalidateQueries({ queryKey: ["documents"] });

    } catch (err) {

      console.error("Upload error:", err);

      setMessage({
        type: "error",
        text: "Upload failed"
      });

    }

  };

  /* ================= DELETE DOCUMENT ================= */

  const handleDelete = async (id) => {

    try {

      await API.delete(`/documents/${id}`);

      queryClient.setQueryData(["documents"], (old = []) =>
        old.filter((doc) => doc._id !== id)
      );

      setMessage({
        type: "success",
        text: "Document deleted successfully"
      });

    } catch (err) {

      console.error("Delete error:", err);

      setMessage({
        type: "error",
        text: "Delete failed"
      });

    }

  };

  /* ================= FILTER DOCUMENTS ================= */

  const filteredDocs = useMemo(() => {

    return documents.filter((d) =>
      d.title?.toLowerCase().includes(search.toLowerCase())
    );

  }, [documents, search]);

  /* ================= STATS ================= */

  /* ================= STATS ================= */

  const stats = useMemo(() => {

    if (!documents || documents.length === 0) {
      return {
        total: 0,
        lab: 0,
        prescription: 0
      };
    }

    return {
      total: documents.length,
      lab: documents.filter(d => d.type === "Lab Report").length,
      prescription: documents.filter(d => d.type === "Prescription").length
    };

  }, [documents]);

  /* ================= UI ================= */

  return (
    <Layout>

      <div className="page-documents">
        <div className="page-content">

          {message && (
            <div className={`message-banner ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* ================= HEADER ================= */}

          <div className="page-header">
            <h1 className="page-title">Document Vault</h1>
            <p className="page-subtitle">
              Securely manage prescriptions, lab reports and medical records.
            </p>
          </div>

          {/* ================= STATS ================= */}

          {(isLoading || isFetching) ? (

            <div className="grid">

              <div className="stat-card purple">
                <span>Total Documents</span>
                <h2>...</h2>
              </div>

              <div className="stat-card green">
                <span>Lab Reports</span>
                <h2>...</h2>
              </div>

              <div className="stat-card orange">
                <span>Prescriptions</span>
                <h2>...</h2>
              </div>

            </div>

          ) : (

            <div className="grid">

              <div className="stat-card purple">
                <span>Total Documents</span>
                <h2>{stats.total}</h2>
              </div>

              <div className="stat-card green">
                <span>Lab Reports</span>
                <h2>{stats.lab}</h2>
              </div>

              <div className="stat-card orange">
                <span>Prescriptions</span>
                <h2>{stats.prescription}</h2>
              </div>

            </div>

          )}

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
                onChange={handleFileChange}
              />

              <button
                type="button"
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

          {/* ================= DOCUMENT LIST ================= */}

          <div className="grid document-grid">

            {!loading && filteredDocs.length === 0 && (
              <p className="empty-text">No documents uploaded yet.</p>
            )}

            {filteredDocs.map((doc) => (
              <DocumentCard
                key={doc._id}
                doc={doc}
                onDelete={handleDelete}
              />
            ))}

          </div>

        </div>

      </div>

    </Layout>
  );
}