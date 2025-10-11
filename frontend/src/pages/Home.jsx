// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import EventCard from "../components/EventCard";
import Hero from "../components/Hero";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Se preferir ordenar por data do evento, troque "createdAt" por "date"
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {/* Banner com imagem e textos brancos */}
      <Hero />

      <div className="container py-4">
        <h2 className="mb-2 text-center text-white">Upcoming Events</h2>
        <p className="text-center text-muted mb-4">
          Find meetups happening near you — or online
        </p>

        {/* Estados: carregando / vazio / grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" />
            <p className="mt-3 mb-0 text-muted">Loading events…</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="mb-2 text-white">No events yet</h4>
            <p className="text-muted">
              Create your first event using “+ Create Event”.
            </p>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {events.map((ev) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
                key={ev.id}
              >
                <EventCard event={ev} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;



