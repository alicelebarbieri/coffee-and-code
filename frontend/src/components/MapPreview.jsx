import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";


import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: marker,
  iconRetinaUrl: marker2x,
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapPreview({
  lat,
  lng,
  title = "Event location",
  height = 160,
  zoom = 13,
  rounded = false,
  className = "",
}) {
  const valid = typeof lat === "number" && typeof lng === "number";
  const center = useMemo(() => [lat, lng], [lat, lng]);
  if (!valid) return null;

  return (
    <div
      className={`${rounded ? "rounded-3 overflow-hidden shadow-sm" : ""} ${className}`}
      style={{ height }}
    >
      <MapContainer
        key={`${lat},${lng}`}       
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={center}>
          <Popup>{title}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
