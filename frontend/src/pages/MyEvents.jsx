import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import EventCard from "../components/EventCard";

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  if (events.length === 0)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        You haven't created any events yet.
      </p>
    );

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>My Events</h1>
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

export default MyEvents;
