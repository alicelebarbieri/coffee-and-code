import { useRef, useState } from "react";
import { db, auth, storage } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { geocodeAddress } from "../utils/geocode";
import imageCompression from "browser-image-compression";
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "../hooks/useGoogleMaps";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const navigate = useNavigate();
  const { isLoaded } = useGoogleMaps();

  // Google Places setup
  const autocompleteRef = useRef(null);


  // Called when user selects a place from the suggestions
  const handlePlaceChanged = async () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    const formattedAddress = place.formatted_address || place.name || "";
    setLocation(formattedAddress);

    const geometry = place.geometry?.location;
    if (geometry) {
      setCoords({ lat: geometry.lat(), lng: geometry.lng() });
    } else {
      try {
        const g = await geocodeAddress(formattedAddress);
        if (g) setCoords({ lat: g.lat, lng: g.lng });
      } catch (err) {
        console.error("Geocoding fallback failed:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date || (!isOnline && !location)) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      // Upload image if provided
      let imageUrl = "";
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

      // Get coordinates if not online
      let finalCoords = coords;
      let formattedAddress = location;
      if (!isOnline && !coords && location) {
        try {
          const g = await geocodeAddress(location);
          if (g) {
            finalCoords = { lat: g.lat, lng: g.lng };
            formattedAddress = g.formattedAddress || location;
          }
        } catch (err) {
          console.error("Manual geocode failed:", err);
        }
      }

      // Build Firestore payload
      const payload = {
        title,
        date,
        startTime,
        location: formattedAddress,
        isOnline,
        price: price || "Free",
        description: description || "",
        imageUrl,
        createdAt: Timestamp.now(),
        userId: auth.currentUser?.uid || null,
        userName: auth.currentUser?.displayName || "Anonymous",
        lat: finalCoords?.lat || null,
        lng: finalCoords?.lng || null,
      };

      const user = auth.currentUser;

      if (user) {
        payload.userId = user.uid;
        payload.userName = user.displayName || user.email || "Anonymous";
      } else {
        payload.userId = null;
        payload.userName = "Anonymous";
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
        background: "#1e1e1e",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "white",
        }}
      >
        Create a New Event
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
          style={{
            backgroundColor: "#2c2c2c",
            color: "white",
            border: "1px solid #444",
            borderRadius: "6px",
            padding: "0.6rem",
          }}
        />

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{
              flex: 1,
              backgroundColor: "#2c2c2c",
              color: "white",
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "0.6rem",
            }}
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{
              width: 140,
              backgroundColor: "#2c2c2c",
              color: "white",
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "0.6rem",
            }}
          />
        </div>

        <label style={{ color: "#ddd" }}>
          <input
            type="checkbox"
            checked={isOnline}
            onChange={(e) => {
              setIsOnline(e.target.checked);
              if (e.target.checked) setCoords(null);
            }}
          />{" "}
          Online event
        </label>

        {!isOnline && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {isLoaded ? (
              <Autocomplete
                onLoad={(ac) => (autocompleteRef.current = ac)}
                onPlaceChanged={handlePlaceChanged}
                options={{
                  componentRestrictions: { country: "gb" },
                  types: ["geocode"],
                }}
              >
                <input
                  type="text"
                  placeholder="Location (e.g. 102 Thomas Lane, Birmingham, UK)"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setCoords(null);
                  }}
                  required
                  style={{
                    backgroundColor: "#2c2c2c",
                    color: "white",
                    border: "1px solid #444",
                    borderRadius: "6px",
                    padding: "0.6rem",
                  }}
                />
              </Autocomplete>
            ) : (
              <input
                type="text"
                placeholder="Location (loading Places...)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                style={{
                  backgroundColor: "#2c2c2c",
                  color: "white",
                  border: "1px solid #444",
                  borderRadius: "6px",
                  padding: "0.6rem",
                }}
              />
            )}
            <small style={{ color: "#aaa" }}>
              Start typing and choose a suggested address.
            </small>
          </div>
        )}

        <input
          type="text"
          placeholder="Price (or leave blank for Free)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{
            backgroundColor: "#2c2c2c",
            color: "white",
            border: "1px solid #444",
            borderRadius: "6px",
            padding: "0.6rem",
          }}
        />

        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          style={{
            backgroundColor: "#2c2c2c",
            color: "white",
            border: "1px solid #444",
            borderRadius: "6px",
            padding: "0.6rem",
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          style={{ color: "white" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#333",
            color: "white",
            border: "none",
            padding: "0.8rem",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#444")}
          onMouseLeave={(e) => (e.target.style.background = "#333")}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
