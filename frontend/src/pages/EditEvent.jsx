import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db, storage, auth } from "../firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function EditEvent() {

  const { state: eventFromState } = useLocation();
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(eventFromState || null);
  const eventId = useMemo(() => event?.id || routeId, [event, routeId]);

  const [title, setTitle] = useState(eventFromState?.title || "");
  const [date, setDate] = useState(eventFromState?.date || "");
  const [locationV, setLocationV] = useState(eventFromState?.location || "");
  const [price, setPrice] = useState(eventFromState?.price || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(eventFromState?.imageUrl || "");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!eventFromState); 
  const [error, setError] = useState("");

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
          setError("Event not found.");
          setInitialLoading(false);
          return;
        }
        const data = { id: snap.id, ...snap.data() };
        if (!active) return;
        setEvent(data);
        setTitle(data.title || "");
        setDate(data.date || "");
        setLocationV(data.location || "");
        setPrice(data.price || "");
        setPreview(data.imageUrl || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load event.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchIfNeeded();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
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
      let imageUrl = preview || "";

      
      if (imageFile) {
        
        const imageRef = ref(
          storage,
          `events/${auth.currentUser.uid}/${eventId}-${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, "events", eventId), {
        title,
        date,
        location: locationV,
        price,
        imageUrl,
        updatedAt: serverTimestamp(),
      });

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
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading event...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>{error}</p>;
  }

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

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="text"
          value={locationV}
          onChange={(e) => setLocationV(e.target.value)}
          placeholder="Location"
          required
        />

        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (or Free)"
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

export default EditEvent;
