import { useState } from "react";
import { db, auth, storage } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { geocodeAddress } from "../utils/geocode";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00"); // novo
  const [isOnline, setIsOnline] = useState(false); // novo
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date || (!isOnline && !location)) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Upload da imagem (opcional)
      let imageUrl = "";
      if (image) {
        const uid = auth.currentUser?.uid || "anon";
        const imageRef = ref(
          storage,
          `event-images/${uid}/${Date.now()}_${image.name}`
        );
        const snap = await uploadBytes(imageRef, image, {
          contentType: image.type,
        });
        imageUrl = await getDownloadURL(snap.ref);
      }

      // Geocodificação (somente se presencial)
      let coords = null;
      try {
        if (!isOnline && location) {
          coords = await geocodeAddress(location);
        }
      } catch (err) {
        console.warn("Geocode failed:", err);
      }

      const payload = {
        title,
        date,
        startTime,
        location,
        isOnline,
        price: price || "Free",
        description: description || "",
        imageUrl,
        createdAt: Timestamp.now(),
        userId: auth.currentUser?.uid || null,
        userName: auth.currentUser?.displayName || "Anonymous",
      };
      if (coords) {
        payload.lat = coords.lat;
        payload.lng = coords.lng;
      }

      await addDoc(collection(db, "events"), payload);

      alert("Event created successfully!");
      navigate("/myevents");
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to create event. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "640px",
        margin: "2rem auto",
        padding: "2rem",
        background: "#f9f9ff",
        borderRadius: "12px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Create a New Event
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ width: 140 }}
          />
        </div>

        <label className="d-flex align-items-center gap-2">
          <input
            type="checkbox"
            checked={isOnline}
            onChange={(e) => setIsOnline(e.target.checked)}
          />
          Online event
        </label>

        {!isOnline && (
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        )}

        <input
          type="text"
          placeholder="Price (or leave blank for Free)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#3b3b98",
            color: "white",
            border: "none",
            padding: "0.8rem",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
