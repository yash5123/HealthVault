export default function Input({
  label,
  error,
  ...props
}) {
  return (
    <div className="field-box">
      {label && (
        <label className="field-label">
          {label}
        </label>
      )}
      <input
        className="field-input"
        {...props}
      />
      {error && (
        <span className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}