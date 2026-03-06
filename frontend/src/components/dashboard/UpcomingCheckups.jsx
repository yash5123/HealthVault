export default function UpcomingCheckups({ checkups = [] }) {

  const upcoming = checkups.slice(0, 3);

  return (

    <div className="dashboard-checkups-card">

      <div className="dashboard-section-title">
        Upcoming Checkups
      </div>

      <div className="dashboard-checkups-list">

        {upcoming.length === 0 && (

          <div className="dashboard-checkup-empty">
            No upcoming checkups
          </div>

        )}

        {upcoming.map((c, index) => (

          <div
            key={index}
            className="dashboard-checkup-item"
          >

            <div className="dashboard-checkup-name">
              {c.title}
            </div>

            <div className="dashboard-checkup-date">
              {new Date(c.date).toLocaleDateString()}
            </div>

          </div>

        ))}

      </div>

    </div>

  );

}