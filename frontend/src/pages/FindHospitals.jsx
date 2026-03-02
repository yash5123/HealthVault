import { useState, useEffect, useMemo } from "react";
import Layout from "../components/layout/Layout";
import {
  fetchHospitalsFromOSM,
  calculateDistance,
} from "../utils/geoUtils";
import "./hospitals.css";

export default function FindHospitals() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [radius, setRadius] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("savedHospitals")) || []
  );

  // ============================
  // Detect Location
  // ============================

  const detectLocation = () => {
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => setError("Location permission denied")
    );
  };

  // ============================
  // Fetch Hospitals
  // ============================

  useEffect(() => {
    if (!location) return;

    async function loadHospitals() {
      setLoading(true);

      try {
        const data = await fetchHospitalsFromOSM(
          location.lat,
          location.lon,
          radius
        );

        const withDistance = data.map((h) => ({
          ...h,
          distance: calculateDistance(
            location.lat,
            location.lon,
            h.lat,
            h.lon
          ),
          rating: (Math.random() * 2 + 3).toFixed(1),
        }));

        withDistance.sort((a, b) => a.distance - b.distance);
        setHospitals(withDistance);
      } catch (err) {
        setError("Failed to fetch hospitals.");
      }

      setLoading(false);
    }

    loadHospitals();
  }, [location, radius]);

  // ============================
  // Search Filter
  // ============================

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) =>
      h.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [hospitals, search]);

  // ============================
  // Save Hospital
  // ============================

  const toggleSave = (hospital) => {
    let updated;

    if (saved.find((h) => h.id === hospital.id)) {
      updated = saved.filter((h) => h.id !== hospital.id);
    } else {
      updated = [...saved, hospital];
    }

    setSaved(updated);
    localStorage.setItem(
      "savedHospitals",
      JSON.stringify(updated)
    );
  };

  // ============================
  // Star Renderer
  // ============================

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i}>
          {i < fullStars ? "★" : "☆"}
        </span>
      );
    }

    return stars;
  };

  return (
    <Layout>
      <div className="hospital-page">

        {/* ================= HEADER ================= */}
        <div className="hospital-header">
          <div>
            <h1>🏥 Find Nearby Hospitals</h1>
            <p>OpenStreetMap powered healthcare discovery</p>
          </div>

          <button onClick={detectLocation} className="detect-btn">
            📍 Detect Location
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

        {/* ================= CONTROLS ================= */}
        <div className="hospital-controls">
          <input
            placeholder="Search hospitals..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="radius-select"
          >
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
          </select>
        </div>

        {/* ================= MAP ================= */}
        {location && (
          <div className="map-container">
            <iframe
              src={`https://www.google.com/maps?q=${location.lat},${location.lon}&z=14&output=embed`}
              title="map"
              loading="lazy"
            />
          </div>
        )}

        {/* ================= RESULTS ================= */}
        <div className="results-grid">

          {loading && (
            <div className="loading">
              Loading hospitals...
            </div>
          )}

          {!loading && filteredHospitals.length === 0 && (
            <div className="empty-state">
              No hospitals found.
            </div>
          )}

          {filteredHospitals.map((h, index) => (
            <div
              key={h.id}
              className={`hospital-card ${
                index === 0 ? "nearest" : ""
              }`}
            >
              <div className="card-header">
                <h3>{h.name}</h3>

                {index === 0 && (
                  <span className="nearest-badge">
                    Nearest
                  </span>
                )}
              </div>

              <div className="distance">
                📍 {h.distance.toFixed(2)} km away
              </div>

              <div className="rating">
                {renderStars(h.rating)}
                <span className="rating-number">
                  {h.rating}
                </span>
              </div>

              <div className="card-buttons">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`}
                  target="_blank"
                  rel="noreferrer"
                  className="direction-btn"
                >
                  Get Directions
                </a>

                <button
                  onClick={() => toggleSave(h)}
                  className={`save-btn ${
                    saved.find((s) => s.id === h.id)
                      ? "saved"
                      : ""
                  }`}
                >
                  {saved.find((s) => s.id === h.id)
                    ? "💖 Saved"
                    : "🤍 Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}