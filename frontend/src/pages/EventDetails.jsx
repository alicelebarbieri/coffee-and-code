import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Calendar,
  MapPin,
  Video,
  UsersRound,
  PoundSterling,
  Star,
} from "lucide-react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import GooglePayButton from "@google-pay/button-react";
import { useGoogleMaps } from "../hooks/useGoogleMaps";


export default function EventDetails() {
  const { state: fromState } = useLocation();
  const { id } = useParams();
  const [event, setEvent] = useState(fromState || null);
  const [loading, setLoading] = useState(!fromState);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (fromState) return;
    (async () => {
      setLoading(true);
      const snap = await getDoc(doc(db, "events", id));
      if (snap.exists()) setEvent({ id: snap.id, ...snap.data() });
      setLoading(false);
    })();
  }, [fromState, id]);

  if (loading || !event) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  const start = event.date
    ? new Date(`${event.date}T${(event.startTime || "09:00").padStart(5, "0")}`)
    : null;

  const lat =
    event.lat !== null && event.lat !== undefined ? event.lat : 51.5074;
  const lng =
    event.lng !== null && event.lng !== undefined ? event.lng : -0.1278;

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-100 rounded-3 shadow-sm mb-3"
              style={{ maxHeight: 360, objectFit: "cover" }}
            />
          ) : (
            <div
              className="w-100 rounded-3 shadow-sm mb-3 bg-light d-flex align-items-center justify-content-center text-secondary"
              style={{ height: 240 }}
            >
              No image
            </div>
          )}

          <h1 className="h3 fw-semibold mb-2">{event.title}</h1>

          <div className="d-flex flex-wrap gap-3 text-muted mb-3">
            <span className="d-inline-flex align-items-center">
              <Calendar size={18} className="me-2" />
              {start
                ? `${start.toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })} • ${start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "TBA"}
            </span>

            <span className="d-inline-flex align-items-center">
              {event.isOnline ? (
                <>
                  <Video size={18} className="me-2" /> Online
                </>
              ) : (
                <>
                  <MapPin size={18} className="me-2" />
                  {event.location || "TBA"}
                </>
              )}
            </span>

            <span className="d-inline-flex align-items-center">
              <PoundSterling size={18} className="me-2" />
              {event.price || "Free"}
            </span>
          </div>

          <p className="text-muted mb-1">
            Created by <strong>{event.userName || "Anonymous"}</strong>
          </p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="d-inline-flex align-items-center text-muted">
              <UsersRound size={18} className="me-2" />
              {event.attendeesCount ?? 0} going
            </div>
            <div className="d-inline-flex align-items-center text-warning">
              <Star size={18} className="me-2" fill="currentColor" />
              {event.rating ?? 0}/5
            </div>
          </div>

          {!event.isOnline && (
            <div className="my-4">
              <h5>Location</h5>
              <EventMap lat={lat} lng={lng} />
              <div className="small text-muted mt-2">{event.location}</div>
            </div>
          )}

          <h4 className="h5">Details</h4>
          <p className="lead" style={{ whiteSpace: "pre-wrap" }}>
            {event.description || "No description provided."}
          </p>

          {event.price > 0 && <EventPayment price={Number(event.price)} />}
        </div>
      </div>
    </div>
  );
}

function EventMap({ lat, lng }) {

  const { isLoaded } = useGoogleMaps();

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "300px",
        borderRadius: "12px",
      }}
      center={{ lat, lng }}
      zoom={14}
    >
      <Marker position={{ lat, lng }} />
    </GoogleMap>
  );
}

function EventPayment({ price }) {
  return (
    <div className="my-4">
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
                  "stripe:publishableKey":
                    import.meta.env.VITE_STRIPE_PUBLIC_KEY,
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: "BCR2DN6...",
            merchantName: "Coffee & Code",
          },
          transactionInfo: {
            totalPriceStatus: "FINAL",
            totalPriceLabel: "Total",
            totalPrice: price.toFixed(2),
            currencyCode: "GBP",
            countryCode: "GB",
          },
        }}
        onLoadPaymentData={(paymentRequest) => {
          console.log("Payment data", paymentRequest);
        }}
      />
    </div>
  );
}
