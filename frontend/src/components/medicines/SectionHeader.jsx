  export default function SectionHeader({
    title = "Medicines Management",
    subtitle = "Track dosage, stock levels and smart consumption insights.",
    actionLabel,
    onActionClick,
  }) {
    return (
      <div className="section-header">

        <div className="section-header-left">
          <h1 className="section-title">
            {title}
          </h1>

          <p className="section-subtitle">
            {subtitle}
          </p>
        </div>

        {actionLabel && (
          <div className="section-header-right">
            <button
              className="section-action-btn"
              onClick={onActionClick}
            >
              {actionLabel}
            </button>
          </div>
        )}

      </div>
    );
  }