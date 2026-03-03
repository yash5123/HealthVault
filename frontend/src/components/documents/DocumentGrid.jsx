import DocumentCard from "./DocumentCard";

export default function DocumentGrid({ documents }) {
  if (!documents.length)
    return <p className="empty-state">No documents uploaded yet.</p>;

  return (
    <div className="modern-doc-grid">
      {documents.map(doc => (
        <DocumentCard key={doc._id} doc={doc} />
      ))}
    </div>
  );
}