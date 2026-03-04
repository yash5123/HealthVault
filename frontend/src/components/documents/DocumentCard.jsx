export default function DocumentCard({ doc, onDelete }) {

  return (
    <div className="card document-card">

      <strong>{doc.title}</strong>

      <p>{doc.type}</p>

      <p>{new Date(doc.createdAt).toDateString()}</p>

      <div className="actions">

        <a
          href={doc.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-primary action-btn"
        >
          View Document
        </a>

        <button
          className="btn-danger action-btn"
          onClick={() => onDelete(doc._id)}
        >
          🗑 Delete
        </button>

      </div>

    </div>
  );
}