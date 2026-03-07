import NotificationBell from "./NotificationBell";

export default function DashboardHeader() {

  return (

    <div className="dashboard-header">

      <div className="dashboard-header-left">

        <h1 className="dashboard-title">
          Health Dashboard
        </h1>

        <p className="dashboard-subtitle">
          Intelligent health monitoring system
        </p>

      </div>

      <div className="dashboard-header-right">

        <NotificationBell />

      </div>

    </div>

  );

}