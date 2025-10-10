import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import EventCard from "../components/EventCard";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const fetchedEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading events...
      </p>
    );
  }

  if (events.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        No events yet. Try creating one!
      </p>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>☕ Coffee & Code Events</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default Home;
