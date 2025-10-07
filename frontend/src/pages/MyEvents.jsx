import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";
import EventCard from "../components/EventCard";

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setEvents([]);
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "events"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load your events");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center" }}>{error}</p>;
  if (!events.length) return <p style={{ textAlign: "center", marginTop: "2rem" }}>You haven't created any events yet.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>My Events</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
        {events.map((ev) => <EventCard key={ev.id} event={ev} />)}
      </div>
    </div>
  );
}
export default MyEvents;
