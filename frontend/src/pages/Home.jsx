import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import EventCard from "../components/EventCard";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading events...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: "2rem" }}>{error}</p>;
  if (!events.length) return <p style={{ textAlign: "center", marginTop: "2rem" }}>No events yet. Try creating one!</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>☕ Coffee & Code Events</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
        {events.map((ev) => <EventCard key={ev.id} event={ev} />)}
      </div>
    </div>
  );
}
export default Home;