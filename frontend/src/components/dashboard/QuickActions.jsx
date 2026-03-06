import { useNavigate } from "react-router-dom";

export default function QuickActions() {

  const navigate = useNavigate();

  return (

    <div className="dashboard-quick-actions">

      <div
        className="dashboard-action-card"
        onClick={() => navigate("/medicines")}
      >

        <h3>Manage Medicines</h3>

        <p>
          Track stock levels and dosage information
        </p>

      </div>

      <div
        className="dashboard-action-card"
        onClick={() => navigate("/documents")}
      >

        <h3>Upload Documents</h3>

        <p>
          Store prescriptions and reports securely
        </p>

      </div>

      <div
        className="dashboard-action-card"
        onClick={() => navigate("/find-hospitals")}
      >

        <h3>Find Hospitals</h3>

        <p>
          Locate nearby hospitals instantly
        </p>

      </div>

    </div>

  );

}