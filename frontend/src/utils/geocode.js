export async function geocodeAddress(address) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&components=country:GB&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  console.log("Geocoding response:", data);

  if (data.status === "OK" && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng,
      formattedAddress: data.results[0].formatted_address,
    };
  } else {
    console.warn("Geocoding failed:", data.status);
    return null;
  }
}
