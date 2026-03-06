export default function RecentMedicines({ medicines = [] }) {

  const recent = medicines.slice(0, 4);

  return (

    <div className="dashboard-medicines-card">

      <div className="dashboard-section-title">
        Recent Medicines
      </div>

      <div className="dashboard-medicine-list">

        {recent.map((m, index) => {

          let status = "healthy";

          if (m.quantity === 0) status = "critical";
          else if (m.quantity <= 10) status = "low";

          return (

            <div
              key={index}
              className="dashboard-medicine-item"
            >

              <div className="dashboard-medicine-name">
                {m.name}
              </div>

              <div className={`dashboard-medicine-status dashboard-status-${status}`}>

                {status}

              </div>

              <div className="dashboard-medicine-qty">
                {m.quantity}
              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}