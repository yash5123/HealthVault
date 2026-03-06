import { useState, useEffect, useMemo } from "react";
import {
  fetchHospitalsFromOSM,
  calculateDistance,
} from "../utils/geoUtils";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import L from "leaflet";

/* Fix leaflet marker icons */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function FindHospitals() {

  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [radius, setRadius] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeHospital, setActiveHospital] = useState(null);

  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("savedHospitals")) || []
  );

  const [toast, setToast] = useState(null);

  /* =========================
     Detect Location
  ========================= */

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

  /* =========================
     Fetch Hospitals
  ========================= */

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

      } catch {

        setError("Failed to fetch hospitals.");

      }

      setLoading(false);

    }

    loadHospitals();

  }, [location, radius]);

  /* =========================
     Search Filter
  ========================= */

  const filteredHospitals = useMemo(() => {

    return hospitals.filter((h) =>
      h.name?.toLowerCase().includes(search.toLowerCase())
    );

  }, [hospitals, search]);

  /* =========================
     Save Hospital
  ========================= */

  const toggleSave = (hospital) => {

    let updated;

    const exists = saved.find((h) => h.id === hospital.id);

    if (exists) {

      updated = saved.filter((h) => h.id !== hospital.id);

      setToast({
        type: "remove",
        message: "Hospital removed from saved list",
      });

    } else {

      updated = [...saved, hospital];

      setToast({
        type: "success",
        message: "Hospital saved successfully",
      });

    }

    setSaved(updated);

    localStorage.setItem(
      "savedHospitals",
      JSON.stringify(updated)
    );

    setTimeout(() => setToast(null), 2500);

  };

  /* =========================
     Remove Saved
  ========================= */

  const removeSaved = (id) => {

    const updated = saved.filter((h) => h.id !== id);

    setSaved(updated);

    localStorage.setItem(
      "savedHospitals",
      JSON.stringify(updated)
    );

  };

  /* =========================
     Star Renderer
  ========================= */

  const renderStars = (rating) => {

    const stars = [];

    const fullStars = Math.floor(rating);

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

    <div className="page-hospitals">

      {/* ================= HEADER ================= */}

      <div className="hospital-header">

        <div>
          <h1>🏥 Find Nearby Hospitals</h1>
          <p>OpenStreetMap powered healthcare discovery</p>
        </div>

        <button
          onClick={detectLocation}
          className="detect-btn"
        >
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
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={radius}
          onChange={(e) =>
            setRadius(Number(e.target.value))
          }
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

          <MapContainer
            center={[location.lat, location.lon]}
            zoom={14}
            style={{ height: "350px", width: "100%" }}
          >

            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Location */}
            <Marker position={[location.lat, location.lon]}>
              <Popup>Your Location</Popup>
            </Marker>

            {/* Hospital Markers */}
            {filteredHospitals.map((h) => (
              <Marker
                key={h.id}
                position={[h.lat, h.lon]}
                eventHandlers={{
                  click: () => setActiveHospital(h.id),
                }}
              >
                <Popup>
                  <b>{h.name}</b>
                  <br />
                  {h.distance.toFixed(2)} km away
                </Popup>
              </Marker>
            ))}

          </MapContainer>

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
            className={`hospital-card 
              ${index === 0 ? "nearest" : ""}
              ${activeHospital === h.id ? "active" : ""}
            `}
            onMouseEnter={() => setActiveHospital(h.id)}
            onMouseLeave={() => setActiveHospital(null)}
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

      {/* ================= SAVED PANEL ================= */}

      {saved.length > 0 && (

        <div className="saved-panel">

          <h3>💖 Saved Hospitals</h3>

          {saved.map((h) => (

            <div
              key={h.id}
              className="saved-item"
            >

              <span>{h.name}</span>

              <button
                className="remove-save"
                onClick={() => removeSaved(h.id)}
              >
                Remove
              </button>

            </div>

          ))}

        </div>

      )}

      {/* ================= TOAST ================= */}

      {toast && (

        <div className="toast-container">

          <div
            className={`toast ${
              toast.type === "success"
                ? "toast-success"
                : "toast-remove"
            }`}
          >

            <div className="toast-title">
              {toast.type === "success"
                ? "Saved"
                : "Removed"}
            </div>

            <div className="toast-message">
              {toast.message}
            </div>

          </div>

        </div>

      )}

    </div>

  );

}