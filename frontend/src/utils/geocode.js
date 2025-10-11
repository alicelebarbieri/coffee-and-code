export async function geocodeAddress(query) {
  if (!query || !query.trim()) return null;

  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
    encodeURIComponent(query);

  const res = await fetch(url, {
    headers: {
      "Accept-Language": "en",
    },
  });
  if (!res.ok) return null;

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  const first = data[0];
  return {
    lat: parseFloat(first.lat),
    lng: parseFloat(first.lon),
  };
}