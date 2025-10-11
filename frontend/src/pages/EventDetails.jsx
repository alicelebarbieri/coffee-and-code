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
import MapPreview from "../components/MapPreview";

export default function EventDetails() {
  const { state: fromState } = useLocation();
  const { id } = useParams();
  const [event, setEvent] = useState(fromState || null);
  const [loading, setLoading] = useState(!fromState);

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

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {/* Imagem grande */}
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

          {/* Mapa (quando presencial) */}
          {typeof event.lat === "number" &&
          typeof event.lng === "number" &&
          !event.isOnline ? (
            <div className="mb-4">
              <h6 className="text-muted mb-2">Location</h6>
              <MapPreview lat={event.lat} lng={event.lng} title={event.title} height={260} />
              <div className="small text-muted mt-2">{event.location}</div>
            </div>
          ) : (
            event.isOnline && (
              <div className="small text-muted mb-4">Online event</div>
            )
          )}

          <h4 className="h5">Details</h4>
          <p className="lead" style={{ whiteSpace: "pre-wrap" }}>
            {event.description || "No description provided."}
          </p>
        </div>

        <aside className="col-12 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Attend</h5>
              <p className="text-muted small">
                Add to your calendar or share with friends.
              </p>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => window.history.back()}
                >
                  Back
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => window.print()}
                >
                  Print details
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

