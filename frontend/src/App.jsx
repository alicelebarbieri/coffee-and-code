import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { testConnection } from "./testFirestore";
import AuthForm from "./components/AuthForm";
import { updateProfile } from "firebase/auth";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvents";
import MyEvents from "./pages/MyEvents";
import EditEvent from "./pages/EditEvent";
import EventDetails from "./pages/EventDetails";

// UI
import NavbarTop from "./components/NavBar";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
    if (u) {
      if (!u.displayName && u.email) {
        const nameFromEmail = u.email.split("@")[0];
        await updateProfile(u, { displayName: nameFromEmail });
        await u.reload();
      }
      setUser(u);
    } else {
      setUser(null);
    }
    setAuthReady(true);
  });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-vh-100 bg-dark text-light">
      <NavbarTop user={user} onLogout={() => signOut(auth)} />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* private routes */}
        {user && <Route path="/create" element={<CreateEvent user={user} />} />}
        {user && <Route path="/myevents" element={<MyEvents user={user} />} />}
        {/* publics routes */}
        <Route path="/edit/:id" element={<EditEvent user={user} />} />
        <Route path="/event/:id" element={<EventDetails user={user} />} />
        <Route path="/login" element={<AuthForm />} />
      </Routes>

      <Footer />
      
    </div>
    
  );
}
