import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db, storage, auth } from "../firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { geocodeAddress } from "../utils/geocode";

export default function EditEvent() {
  const { state: eventFromState } = useLocation();
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(eventFromState || null);
  const eventId = useMemo(() => event?.id || routeId, [event, routeId]);

  const [title, setTitle] = useState(eventFromState?.title || "");
  const [date, setDate] = useState(eventFromState?.date || "");
  const [startTime, setStartTime] = useState(eventFromState?.startTime || "09:00");
  const [isOnline, setIsOnline] = useState(!!eventFromState?.isOnline);
  const [locationV, setLocationV] = useState(eventFromState?.location || "");
  const [price, setPrice] = useState(eventFromState?.price || "");
  const [description, setDescription] = useState(
    eventFromState?.description || ""
  );

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(eventFromState?.imageUrl || "");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!eventFromState);
  const [error, setError] = useState("");

  // Carrega do Firestore se veio só o id
  useEffect(() => {
    let active = true;
    const fetchIfNeeded = async () => {
      if (eventFromState || !eventId) {
        setInitialLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "events", eventId));
        if (!snap.exists()) {
          if (active) {
            setError("Event not found.");
            setInitialLoading(false);
          }
          return;
        }
        const data = { id: snap.id, ...snap.data() };
        if (!active) return;

        setEvent(data);
        setTitle(data.title || "");
        setDate(data.date || "");
        setStartTime(data.startTime || "09:00");
        setIsOnline(!!data.isOnline);
        setLocationV(data.location || "");
        setPrice(data.price || "");
        setDescription(data.description || "");
        setPreview(data.imageUrl || "");
      } catch (err) {
        console.error(err);
        if (active) setError("Failed to load event.");
      } finally {
        if (active) setInitialLoading(false);
      }
    };

    fetchIfNeeded();
    return () => {
      active = false;
    };
  }, [eventId, eventFromState]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (file) => {
    setImageFile(file);
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!eventId) return;

    if (!auth.currentUser || (event && auth.currentUser.uid !== event.userId)) {
      alert("You can only edit your own events.");
      return;
    }

    setLoading(true);
    try {
      // imagem
      let imageUrl =
        preview && !preview.startsWith("blob:") ? preview : event?.imageUrl || "";

      if (imageFile) {
        const uid = auth.currentUser?.uid || "anon";
        const imageRef = ref(
          storage,
          `events/${uid}/${eventId}-${Date.now()}-${imageFile.name}`
        );
        const snap = await uploadBytes(imageRef, imageFile, {
          contentType: imageFile.type,
        });
        imageUrl = await getDownloadURL(snap.ref);
      }

      // payload base
      const payload = {
        title,
        date,
        startTime,
        location: locationV,
        isOnline,
        price,
        description: description || "",
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      // geocode (presencial)
      try {
        if (!isOnline && locationV) {
          const coords = await geocodeAddress(locationV);
          if (coords) {
            payload.lat = coords.lat;
            payload.lng = coords.lng;
          } else {
            payload.lat = null;
            payload.lng = null;
          }
        } else {
          payload.lat = null;
          payload.lng = null;
        }
      } catch (e1) {
        console.warn("Geocode failed:", e1);
      }

      await updateDoc(doc(db, "events", eventId), payload);

      alert("Event updated successfully!");
      navigate("/myevents");
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading event...
      </p>
    );
  }

  if (error) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>{error}</p>;
  }

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
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Edit Event</h2>

      <form
        onSubmit={handleUpdate}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
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
            value={locationV}
            onChange={(e) => setLocationV(e.target.value)}
            placeholder="Location"
            required
          />
        )}

        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (or Free)"
        />

        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        {preview && (
          <img
            src={preview}
            alt="Current"
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
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
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
