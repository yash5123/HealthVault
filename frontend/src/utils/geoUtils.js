// ===============================
// GEO UTILS - DISTANCE + API
// ===============================

// Haversine Formula - Distance in KM
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

// ===============================
// FETCH HOSPITALS FROM OSM
// ===============================

export async function fetchHospitalsFromOSM(lat, lon, radiusKm) {
  const radiusMeters = radiusKm * 1000;

  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      relation["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
    );
    out center;
  `;

  const response = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
      method: "POST",
      body: query,
    }
  );

  const data = await response.json();

  return data.elements.map((el) => {
    const hospitalLat = el.lat || el.center?.lat;
    const hospitalLon = el.lon || el.center?.lon;

    return {
      id: el.id,
      name: el.tags?.name || "Unnamed Hospital",
      lat: hospitalLat,
      lon: hospitalLon,
      emergency: el.tags?.emergency === "yes",
    };
  });
}