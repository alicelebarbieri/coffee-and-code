import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import EventCard from "../components/EventCard";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all events created by the logged-in user
  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "events"),
          where("userId", "==", auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(data);
      } catch (err) {
        console.error("Error fetching user events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  // Loading spinner
  if (loading)
    return (
      <p
        style={{
          textAlign: "center",
          color: "white",
          marginTop: "3rem",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </p>
    );

  // Message when user has no events
  if (events.length === 0)
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: "2rem",
          color: "white",
          fontSize: "1.1rem",
        }}
      >
        You haven’t created any events yet.
      </p>
    );

  // Display user's events
  return (
    <div style={{ padding: "2rem" }}>
      {/* Page title */}
      <h1
        style={{
          textAlign: "center",
          color: "white",
          fontWeight: "600",
          fontSize: "2rem",
          marginBottom: "1.5rem",
        }}
      >
        My Events
      </h1>

      {/* Grid of event cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

