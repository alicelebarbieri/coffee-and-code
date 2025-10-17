import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import EventCard from "../components/EventCard";
import Hero from "../components/Hero";

function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));

    // Firestore listener for real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allEvents = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const now = new Date();
        const upcoming = [];
        const past = [];

        // Separate upcoming and past events
        for (const ev of allEvents) {
          const eventDate = ev.date
            ? new Date(`${ev.date}T${(ev.startTime || "09:00").padStart(5, "0")}`)
            : null;

          if (eventDate && eventDate >= now) {
            upcoming.push(ev);
          } else {
            past.push(ev);
          }
        }

        // Sort both groups by date
        upcoming.sort(
          (a, b) =>
            new Date(a.date + "T" + a.startTime) -
            new Date(b.date + "T" + b.startTime)
        );
        past.sort(
          (a, b) =>
            new Date(b.date + "T" + b.startTime) -
            new Date(a.date + "T" + a.startTime)
        );

        setUpcomingEvents(upcoming);
        setPastEvents(past);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to listen to events:", error);
        setLoading(false);
      }
    );

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Hero banner at the top */}
      <Hero />

      <div className="container py-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" />
            <p className="mt-3 mb-0 text-muted">Loading events…</p>
          </div>
        ) : (
          <>
            {/* Upcoming Events */}
            <h2 className="mb-2 text-center text-white">Upcoming Events</h2>
            <p className="text-center text-muted mb-4">
              Find meetups happening near you — or online
            </p>

            {upcomingEvents.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="mb-2 text-white">No upcoming events</h4>
                <p className="text-muted">
                  Create a new event using “+ Create Event”.
                </p>
              </div>
            ) : (
              <div className="row g-4 justify-content-center mb-5">
                {upcomingEvents.map((ev) => (
                  <div
                    className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
                    key={ev.id}
                  >
                    <EventCard event={ev} />
                  </div>
                ))}
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <>
                <h2 className="mb-2 text-center text-white">Past Events</h2>
                <p className="text-center text-muted mb-4">
                  These events have already taken place.
                </p>

                <div className="row g-4 justify-content-center">
                  {pastEvents.map((ev) => (
                    <div
                      className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
                      key={ev.id}
                    >
                      <EventCard event={ev} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Home;
