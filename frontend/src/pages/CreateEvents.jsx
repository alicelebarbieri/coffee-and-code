import { useState } from "react";
import { db, storage, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !date || !location) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const imageRef = ref(storage, `events/${Date.now()}-${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "events"), {
        title,
        date,
        location,
        price: price || "Free",
        imageUrl,
        createdAt: serverTimestamp(),
        userId: auth.currentUser ? auth.currentUser.uid : null,
        userName: auth.currentUser ? auth.currentUser.displayName : "Anonymous",
      });

      alert("🎉 Event created successfully!");
      navigate("/myevents");
    } catch (error) {
      console.error("❌ Error adding event:", error);
      alert("Failed to create event. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "2rem",
        background: "#f9f9ff",
        borderRadius: "12px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#3b3b98",
        }}
      >
        Create a New Event ☕
      </h2>

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
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Price (or leave blank for Free)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#999" : "#3b3b98",
            color: "white",
            border: "none",
            padding: "0.8rem",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.3s ease",
          }}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;

