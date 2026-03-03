export default function DocumentCard({ doc }) {
  return (
    <div className="modern-doc-card">
      <div className="doc-top">
        <span className="doc-badge">{doc.type}</span>
      </div>

      <h4>{doc.title}</h4>

      <p>
        {new Date(doc.createdAt).toLocaleDateString()}
      </p>

      <div className="doc-actions">
        <a href={doc.fileUrl} target="_blank" rel="noreferrer">
          View
        </a>
      </div>
    </div>
  );
}