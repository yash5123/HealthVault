import { useState } from "react";

export default function NotificationBell() {

  const [open, setOpen] = useState(false);

  const notifications = [

    { text: "Medicine stock is low", time: "5 min ago" },
    { text: "Lab report uploaded", time: "1 hour ago" },
    { text: "Upcoming checkup tomorrow", time: "Today" }

  ];

  function toggle() {

    setOpen(!open);

  }

  return (

    <div className="dashboard-notification-wrapper">

      <button
        className="dashboard-notification-button"
        onClick={toggle}
      >

        🔔

      </button>

      {open && (

        <div className="dashboard-notification-panel">

          {notifications.map((n, index) => (

            <div
              key={index}
              className="dashboard-notification-item"
            >

              <div className="dashboard-notification-text">
                {n.text}
              </div>

              <div className="dashboard-notification-time">
                {n.time}
              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}