export default function ActivityTimeline({ activities = [] }) {

  const recent = activities.slice(0, 6);

  return (

    <div className="dashboard-activity-card">

      <div className="dashboard-section-title">
        Recent Activity
      </div>

      <div className="dashboard-activity-list">

        {recent.length === 0 && (

          <div className="dashboard-activity-empty">
            No recent activity
          </div>

        )}

        {recent.map((a, index) => (

          <div
            key={index}
            className="dashboard-activity-item"
          >

            <div className="dashboard-activity-dot" />

            <div className="dashboard-activity-text">

              <div className="dashboard-activity-title">
                {a.title}
              </div>

              <div className="dashboard-activity-time">
                {a.time}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}   