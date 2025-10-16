import { NavLink } from "react-router-dom";
import AuthButton from "./AuthButton";

export default function NavbarTop({ user, onLogout }) {
  return (
    <nav
      className="navbar navbar-expand sticky-top border-bottom"
      style={{
        backgroundColor: "#1e1e1e",
        color: "white",
      }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <NavLink
          to="/"
          className="navbar-brand fw-bold"
          style={{ color: "white", textDecoration: "none" }}
        >
          Coffee & Code ☕💻
        </NavLink>

        <div className="d-flex align-items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `fw-semibold text-decoration-none ${
                isActive ? "text-light" : "text-light"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/create"
            className={({ isActive }) =>
              `fw-semibold text-decoration-none ${
                isActive ? "text-light" : "text-light"
              }`
            }
          >
            + Create Event
          </NavLink>

          <NavLink
            to="/myevents"
            className={({ isActive }) =>
              `fw-semibold text-decoration-none ${
                isActive ? "text-light" : "text-light"
              }`
            }
          >
            My Events
          </NavLink>

          <AuthButton user={user} onLogout={onLogout} />
        </div>
      </div>
    </nav>
  );
}
