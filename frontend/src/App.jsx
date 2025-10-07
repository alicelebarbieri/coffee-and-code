import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvents";
import logo from "./assets/logo.png"; 
import AuthButton from "./components/AuthButton";
import MyEvents from "./pages/MyEvents";
import EditEvent from "./pages/EditEvent";

function App() {
  return (
    <div>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          background: "#2d3436",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src={logo} alt="Coffee & Code logo" width="35" height="35" />
          <h2 style={{ color: "white", margin: 0 }}>Coffee & Code</h2>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Link style={{ color: "white", textDecoration: "none" }} to="/">
            Home
          </Link>
          <Link style={{ color: "white", textDecoration: "none" }} to="/create">
            + Create Event
          </Link>
          <Link style={{ color: "white", textDecoration: "none" }} to="/myevents">
            My Events
          </Link>
          <AuthButton />
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/myevents" element={<MyEvents />} />
        <Route path="/edit/:id" element={<EditEvent />} />
      </Routes>
    </div>
  );
}

export default App;

