import { Calendar, MapPin, PoundSterling, Trash2, Edit3 } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function EventCard({ event }) {
  const navigate = useNavigate();

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-GB")
    : "No date";

  const calendarDate = event.date
    ? new Date(event.date).toISOString().split("T")[0].replace(/-/g, "")
    : "";

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(event.title);
    const location = encodeURIComponent(event.location);
    const details = encodeURIComponent("Join us at Coffee & Code ☕!");
    const startDate = calendarDate;
    const endDate = calendarDate;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    window.open(url, "_blank");
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await deleteDoc(doc(db, "events", event.id));
      alert("🗑️ Event deleted successfully!");
      window.location.reload(); // atualiza a página rapidamente
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Check console for details.");
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${event.id}`);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "1.5rem",
        background: "#fff",
        boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
        transition: "transform 0.2s ease",
        textAlign: "center",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
    >
      {/* 🖼️ Event image */}
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          style={{
            width: "100%",
            maxHeight: "200px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "1rem",
          }}
        />
      )}

      {/* 📋 Event info */}
      <h3 style={{ marginBottom: "0.6rem", color: "#3b3b98" }}>
        {event.title}
      </h3>

      <p style={{ margin: "0.4rem 0" }}>
        <Calendar size={16} color="#6c5ce7" style={{ marginRight: 5 }} />
        {formattedDate}
      </p>

      <p style={{ margin: "0.4rem 0" }}>
        <MapPin size={16} color="#e17055" style={{ marginRight: 5 }} />
        {event.location}
      </p>

      <p style={{ margin: "0.4rem 0" }}>
        <PoundSterling size={16} color="#0984e3" style={{ marginRight: 5 }} />
        {event.price || "Free"}
      </p>

      {/* 📅 Add to Google Calendar */}
      <button
        onClick={handleAddToCalendar}
        style={{
          background: "#3b3b98",
          color: "white",
          border: "none",
          padding: "0.6rem 1rem",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "0.8rem",
          transition: "background 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.background = "#575fcf")}
        onMouseLeave={(e) => (e.target.style.background = "#3b3b98")}
      >
        Add to Google Calendar
      </button>

      {/* ✏️ Edit & Delete buttons */}
      {auth.currentUser && auth.currentUser.uid === event.userId && (
        <div style={{ marginTop: "1rem", display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={handleEdit}
            style={{
              background: "#f9ca24",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Edit3 size={16} />
            Edit
          </button>

          <button
            onClick={handleDelete}
            style={{
              background: "#eb4d4b",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default EventCard;
