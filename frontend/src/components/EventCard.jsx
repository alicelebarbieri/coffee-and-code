import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import GooglePayButton from "@google-pay/button-react";
import {
  Calendar,
  MapPin,
  Video,
  PoundSterling,
  Star,
  UsersRound,
  Edit3,
  Trash2,
} from "lucide-react";

// Estrelas de avaliação
function Stars({ value = 0 }) {
  const full = Math.round(value ?? 0);
  return (
    <div className="d-inline-flex align-items-center" title={`${value ?? 0} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < full ? "text-warning" : "text-secondary"}
          fill={i < full ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

// Mapa do Google mostrando o local do evento
export function EventMap({ lat, lng }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "300px", borderRadius: "12px" }}
      center={{ lat, lng }}
      zoom={14}
    >
      <Marker position={{ lat, lng }} />
    </GoogleMap>
  );
}

// Card principal do evento
export default function EventCard({ event }) {
  const navigate = useNavigate();

  const startISO = useMemo(() => {
    const start = `${event?.date ?? ""}T${(event?.startTime || "09:00")
      .toString()
      .padStart(5, "0")}`;
    const d = new Date(start);
    return isNaN(d) ? null : d;
  }, [event?.date, event?.startTime]);

  const formattedDate =
    startISO?.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) ?? "No date";

  const formattedTime =
    startISO?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) ?? "";

  const handleAddToCalendar = () => {
    if (!startISO) return;
    const endISO = new Date(startISO.getTime() + 60 * 60 * 1000);

    const startStr =
      startISO.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    const endStr =
      endISO.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";

    const title = encodeURIComponent(event.title || "Coffee & Code");
    const details = encodeURIComponent(
      event.description || "Join us at Coffee & Code ☕💻"
    );
    const location = encodeURIComponent(
      event.isOnline ? "Online" : event.location || "TBA"
    );

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
    window.open(url, "_blank");
  };

  const handleEdit = () => navigate(`/edit/${event.id}`, { state: event });

  const handleDelete = async () => {
    if (!window.confirm("Delete this event?")) return;
    await deleteDoc(doc(db, "events", event.id));
    window.location.reload();
  };

  const goToDetails = () => navigate(`/event/${event.id}`, { state: event });

  const isOwner =
    !!auth.currentUser?.uid && auth.currentUser.uid === event.userId;

  return (
    <div className="card h-100 shadow-sm bg-body-tertiary text-body">
      {/* Imagem */}
      {event.imageUrl ? (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="card-img-top"
          style={{ height: 160, objectFit: "cover" }}
          onClick={goToDetails}
          role="button"
        />
      ) : (
        <div
          className="d-flex align-items-center justify-content-center bg-light text-secondary"
          style={{ height: 160 }}
        >
          No image
        </div>
      )}

      <div className="card-body d-flex flex-column">
        {/* Título */}
        <h5 className="card-title mb-2 text-truncate" title={event.title}>
          {event.title}
        </h5>

        {/* Data / Local */}
        <div className="small text-muted mb-2 d-flex flex-wrap gap-3">
          <span className="d-inline-flex align-items-center">
            <Calendar size={16} className="me-1" />
            {formattedDate} {formattedTime && `• ${formattedTime}`}
          </span>

          <span className="d-inline-flex align-items-center">
            {event.isOnline ? (
              <>
                <Video size={16} className="me-1" /> Online
              </>
            ) : (
              <>
                <MapPin size={16} className="me-1" />
                {event.location || "TBA"}
              </>
            )}
          </span>
        </div>

        {/* Preço / Rating / Attendees */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-inline-flex align-items-center gap-2">
            <span className="badge rounded-pill bg-success-subtle text-success-emphasis border border-success-subtle">
              <PoundSterling size={14} className="me-1" />
              {event.price || "Free"}
            </span>
            <span className="d-inline-flex align-items-center gap-1">
              <Stars value={event.rating ?? 0} />
            </span>
          </div>
          <span className="d-inline-flex align-items-center text-muted small">
            <UsersRound size={16} className="me-1" />
            {event.attendeesCount ?? 0}
          </span>
        </div>

        {/* Mapa */}
        {typeof event.lat === "number" &&
          typeof event.lng === "number" &&
          !event.isOnline && (
            <div className="mb-3">
              <EventMap lat={event.lat} lng={event.lng} />
            </div>
          )}

        {/* Google Pay */}
        {event.price > 0 && (
          <div className="mb-3">
            <GooglePayButton
              environment="TEST"
              paymentRequest={{
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [
                  {
                    type: "CARD",
                    parameters: {
                      allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                      allowedCardNetworks: ["MASTERCARD", "VISA"],
                    },
                    tokenizationSpecification: {
                      type: "PAYMENT_GATEWAY",
                      parameters: {
                        gateway: "stripe",
                        "stripe:version": "2020-08-27",
                        "stripe:publishableKey": import.meta.env
                          .VITE_STRIPE_PUBLIC_KEY,
                      },
                    },
                  },
                ],
                merchantInfo: {
                  merchantId: "BCR2DN6XXXX", // depois configuramos isso
                  merchantName: "Coffee & Code",
                },
                transactionInfo: {
                  totalPriceStatus: "FINAL",
                  totalPriceLabel: "Total",
                  totalPrice: Number(event.price || 0).toFixed(2),
                  currencyCode: "GBP",
                  countryCode: "GB",
                },
              }}
              onLoadPaymentData={(paymentData) => {
                console.log("Payment successful:", paymentData);
              }}
            />
          </div>
        )}

        {/* Criado por */}
        <div className="text-muted small mb-3">
          Created by <strong>{event.userName || "Anonymous"}</strong>
        </div>

        {/* Ações */}
        <div className="mt-auto d-flex flex-wrap gap-2">
          <button className="btn btn-dark flex-grow-1" onClick={handleAddToCalendar}>
            Add to Google Calendar
          </button>

          <button className="btn btn-outline-secondary" onClick={goToDetails}>
            Details
          </button>

          {isOwner && (
            <>
              <button className="btn btn-warning" onClick={handleEdit}>
                <Edit3 size={16} className="me-1" />
                Edit
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                <Trash2 size={16} className="me-1" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

