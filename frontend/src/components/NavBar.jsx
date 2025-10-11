import { NavLink } from "react-router-dom";

export default function NavbarTop({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand bg-body sticky-top border-bottom">
      <div className="container">
        
        <NavLink to="/" className="navbar-brand fw-bold me-3">
          Coffee & Code
        </NavLink>

        <div className="ms-auto d-flex align-items-center gap-2">
          <NavLink to="/" className={({ isActive }) => `nav-ghost ${isActive ? "active" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/create" className={({ isActive }) => `nav-ghost ${isActive ? "active" : ""}`}>
            + Create Event
          </NavLink>
          <NavLink to="/myevents" className={({ isActive }) => `nav-ghost ${isActive ? "active" : ""}`}>
            My Events
          </NavLink>

          {user && (
            <>
              <span className="ms-2 me-1 small text-muted d-none d-sm-inline">
                {user.displayName || "User"}
              </span>
              <button className="nav-ghost" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
