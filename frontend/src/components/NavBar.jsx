import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function NavbarTop({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top border-bottom"
      style={{
        backgroundColor: "#1e1e1e",
        color: "white",
      }}
    >
      <div className="container-fluid px-3">
        {/* Brand */}
        <NavLink
          to="/"
          className="navbar-brand fw-bold"
          style={{ color: "white", textDecoration: "none" }}
        >
          Coffee & Code ☕💻
        </NavLink>

        {/* Toggler button (mobile) */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          style={{ color: "white" }}
        >
          <span
            className="navbar-toggler-icon"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'white\' viewBox=\'0 0 30 30\'%3E%3Cpath stroke=\'white\' stroke-width=\'2\' d=\'M4 7h22M4 15h22M4 23h22\'/%3E%3C/svg%3E")',
            }}
          ></span>
        </button>

        {/* Collapsible menu */}
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <div className="ms-auto d-flex flex-column flex-lg-row align-items-center gap-3 mt-3 mt-lg-0">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `fw-semibold text-decoration-none ${
                  isActive ? "text-info" : "text-light"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/create"
              className={({ isActive }) =>
                `fw-semibold text-decoration-none ${
                  isActive ? "text-info" : "text-light"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              + Create Event
            </NavLink>

            <NavLink
              to="/myevents"
              className={({ isActive }) =>
                `fw-semibold text-decoration-none ${
                  isActive ? "text-info" : "text-light"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              My Events
            </NavLink>

            {/* ✅ Conditional render */}
            {user ? (
              <div className="d-flex align-items-center gap-2 ms-3">
                <span style={{ color: "#bbb", fontWeight: 500 }}>
                  👋 {user.displayName || user.email}
                </span>
                <button
                  onClick={onLogout}
                  className="btn btn-outline-light btn-sm"
                  style={{
                    borderRadius: "6px",
                    padding: "0.4rem 0.8rem",
                    border: "1px solid #888",
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="btn btn-outline-light ms-3"
                style={{
                  borderRadius: "6px",
                  padding: "0.5rem 1rem",
                  border: "1px solid #888",
                }}
              >
                Sign in / Register
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
