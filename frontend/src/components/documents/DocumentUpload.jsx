import { useState } from "react";
import API from "../../services/api";

export default function DocumentUpload({ onUpload }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("LAB");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("file", file);

    try {
      await API.post("/documents", formData);
      setTitle("");
      setFile(null);
      onUpload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="saas-card upload-modern">
      <div className="card-header">
        <h3>Upload New Document</h3>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">

        <input
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="LAB">Lab Report</option>
          <option value="PRESCRIPTION">Prescription</option>
          <option value="OTHER">Other</option>
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit" className="gradient-btn">
          Upload Document
        </button>

      </form>
    </div>
  );
}