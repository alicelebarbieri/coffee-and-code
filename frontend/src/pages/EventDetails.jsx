import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import {
  Calendar,
  MapPin,
  Video,
  UsersRound,
  PoundSterling,
  Star,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import GooglePayButton from "@google-pay/button-react";
import { useGoogleMaps } from "../hooks/useGoogleMaps";

export default function EventDetails() {
  const { state: fromState } = useLocation();
  const { id } = useParams();
  const [event, setEvent] = useState(fromState || null);
  const [loading, setLoading] = useState(!fromState);
  const [joined, setJoined] = useState(false); // track join status
  const { isLoaded } = useGoogleMaps();
  const [loadingJoin, setLoadingJoin] = useState(false);

  useEffect(() => {
    if (fromState) return;
    (async () => {
      setLoading(true);
      const snap = await getDoc(doc(db, "events", id));
      if (snap.exists()) setEvent({ id: snap.id, ...snap.data() });
      setLoading(false);
    })();
  }, [fromState, id]);

  // Check if current user has joined
  useEffect(() => {
    if (!event || !auth.currentUser) return;
    const attendees = event.attendees || [];
    setJoined(attendees.includes(auth.currentUser.uid));
  }, [event]);

  if (loading || !event) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  // Join or leave event

  const [buttonDisabled, setButtonDisabled] = useState(false); // ⏳ prevent spam clicks

const toggleJoinEvent = async () => {
  const user = auth.currentUser;
  if (!user) return alert("Please log in first.");
  if (buttonDisabled) return;

  setButtonDisabled(true);
  setLoadingJoin(true);

  const eventRef = doc(db, "events", id);

  try {
    const snap = await getDoc(eventRef);
    if (!snap.exists()) return alert("Event not found!");

    const data = snap.data();
    const attendees = data.attendees || [];

    if (!joined) {
      // JOIN EVENT
      await updateDoc(eventRef, {
        attendees: arrayUnion(user.uid),
        attendeesCount: data.attendeesCount ? increment(1) : 1, 
      });

      setJoined(true);
      setEvent((prev) => ({
        ...prev,
        attendeesCount: (prev.attendeesCount ?? 0) + 1,
        attendees: [...(prev.attendees || []), user.uid],
      }));
    } else {
      // LEAVE EVENT
      await updateDoc(eventRef, {
        attendees: arrayRemove(user.uid),
        attendeesCount:
          data.attendeesCount && data.attendeesCount > 0
            ? increment(-1)
            : 0, // prevent negatives
      });

      setJoined(false);
      setEvent((prev) => ({
        ...prev,
        attendeesCount: Math.max((prev.attendeesCount ?? 1) - 1, 0),
        attendees: (prev.attendees || []).filter((id) => id !== user.uid),
      }));
    }
  } catch (error) {
    console.error("Error updating event:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoadingJoin(false);
    setTimeout(() => setButtonDisabled(false), 2000);
  }
};

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

          {/* Join/Leave button */}
          <button
            className={`btn w-100 mt-3 fw-semibold ${
              joined ? "btn-outline-light" : "btn-info text-white"
            }`}
            onClick={toggleJoinEvent}
            disabled={buttonDisabled || loadingJoin}
            style={{
              borderRadius: "8px",
              transition: "all 0.3s",
              opacity: buttonDisabled ? 0.7 : 1,
              cursor: buttonDisabled ? "not-allowed" : "pointer",
              minHeight: "48px",
            }}
          >
            {loadingJoin ? (
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
              />
            ) : joined ? (
              "Joined ✓ Leave Event"
            ) : (
              "Join this event"
            )}
          </button>

          {event.price > 0 && <EventPayment price={Number(event.price)} />}
        </div>
      </div>
    </div>
  );
}

/* ------------------------- MAP COMPONENT ------------------------- */
function EventMap({ lat, lng }) {
  const { isLoaded } = useGoogleMaps();
  if (!isLoaded) return null;
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

/* ------------------------- PAYMENT COMPONENT ------------------------- */
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
