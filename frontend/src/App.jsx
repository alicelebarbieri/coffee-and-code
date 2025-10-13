import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { testConnection } from "./testFirestore";

// Pages
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvents";
import MyEvents from "./pages/MyEvents";
import EditEvent from "./pages/EditEvent";
import EventDetails from "./pages/EventDetails";

// UI
import NavbarTop from "./components/NavBar";

function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // autentication
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  // Firestore test
  //useEffect(() => {
  //  testConnection();
  //}, []);

  if (!authReady) return null;

  return (
    <div className="min-vh-100 bg-dark text-light">
      <NavbarTop user={user} onLogout={() => signOut(auth)} />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* private routes */}
        {user && <Route path="/create" element={<CreateEvent />} />}
        {user && <Route path="/myevents" element={<MyEvents />} />}
        {/* publics routes */}
        <Route path="/edit/:id" element={<EditEvent />} />
        <Route path="/event/:id" element={<EventDetails />} />
      </Routes>
    </div>
  );
}

export default App;
