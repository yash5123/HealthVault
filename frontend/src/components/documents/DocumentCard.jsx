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
          className="btn btn-primary"
        >
          View Document
        </a>

        <button
          className="btn btn-danger"
          onClick={() => onDelete(doc._id)}
        >
          🗑 Delete
        </button>

      </div>

    </div>
  );
}