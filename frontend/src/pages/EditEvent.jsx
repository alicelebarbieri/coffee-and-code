import { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  // Load existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      const snap = await getDoc(doc(db, "events", id));
      if (snap.exists()) {
        setEvent({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (!event) {
    return <p className="text-center text-light mt-5">Event not found.</p>;
  }

  // Handle event update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = event.imageUrl || "";

      // compress and upload new image
      if (image) {
        const compressed = await imageCompression(image, {
          maxSizeMB: 1.0,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });
        const uid = auth.currentUser?.uid || "anon";
        const imageRef = ref(
          storage,
          `event-images/${uid}/${Date.now()}_${image.name}`
        );
        const snap = await uploadBytes(imageRef, compressed, {
          contentType: image.type,
        });
        imageUrl = await getDownloadURL(snap.ref);
      }

      // Update Firestore document
      await updateDoc(doc(db, "events", id), {
        ...event,
        imageUrl,
        updatedAt: Timestamp.now(),
      });

      alert("Event updated successfully!");
      navigate("/myevents");
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "640px",
        margin: "2rem auto",
        padding: "2rem",
        background: "#1e1e1e",
        color: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      {/* Page title */}
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "white",
        }}
      >
        Edit Event
      </h2>

      {/* Edit form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={event.title || ""}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
          required
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="date"
            value={event.date || ""}
            onChange={(e) => setEvent({ ...event, date: e.target.value })}
            required
            style={{ ...inputStyle, flex: 1 }}
          />
          <input
            type="time"
            value={event.startTime || ""}
            onChange={(e) => setEvent({ ...event, startTime: e.target.value })}
            style={{ ...inputStyle, width: 140 }}
          />
        </div>

        <label style={{ fontSize: "0.9rem" }}>
          <input
            type="checkbox"
            checked={event.isOnline || false}
            onChange={(e) =>
              setEvent({ ...event, isOnline: e.target.checked })
            }
            style={{ marginRight: "0.5rem" }}
          />
          Online event
        </label>

        {!event.isOnline && (
          <input
            type="text"
            placeholder="Location"
            value={event.location || ""}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
            style={inputStyle}
          />
        )}

        <input
          type="text"
          placeholder="Price"
          value={event.price || ""}
          onChange={(e) => setEvent({ ...event, price: e.target.value })}
          style={inputStyle}
        />

        <textarea
          placeholder="Event Description"
          value={event.description || ""}
          onChange={(e) =>
            setEvent({ ...event, description: e.target.value })
          }
          rows="3"
          style={inputStyle}
        />

        {/* Display current image */}
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt="Event"
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}

        {/* Upload new image */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          style={{
            background: "#2a2a2a",
            color: "white",
            border: "1px solid #444",
            padding: "0.6rem",
            borderRadius: "6px",
          }}
        />

        {/* Save button */}
        <button
          type="submit"
          style={{
            background: "#2d2d2d",
            color: "white",
            border: "none",
            padding: "0.9rem",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#444")}
          onMouseLeave={(e) => (e.target.style.background = "#2d2d2d")}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  background: "#2a2a2a",
  color: "white",
  border: "1px solid #444",
  borderRadius: "6px",
  padding: "0.6rem",
  fontSize: "0.95rem",
};
