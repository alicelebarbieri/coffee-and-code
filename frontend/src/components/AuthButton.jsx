import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

export default function AuthButton({ user }) {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Error during login:", err);
      alert("Login failed. Check console for details.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        className="btn btn-outline-light fw-semibold"
        style={{
          borderRadius: "6px",
          padding: "0.5rem 1rem",
        }}
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="d-flex align-items-center gap-2">
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt="Profile"
          className="rounded-circle border"
          style={{
            width: 32,
            height: 32,
            objectFit: "cover",
            borderColor: "#444",
          }}
        />
      )}
      <span className="small text-light">{user.displayName}</span>
      <button
        onClick={handleLogout}
        className="btn btn-outline-light btn-sm fw-semibold"
        style={{
          borderRadius: "6px",
          padding: "0.4rem 0.8rem",
        }}
      >
        Logout
      </button>
    </div>
  );
}
