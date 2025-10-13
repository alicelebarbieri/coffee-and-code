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

  return (
    <div>
      {!user ? (
        <button
          onClick={handleLogin}
          style={{
            backgroundColor: "#4285F4",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "0.6rem 1.2rem",
            cursor: "pointer",
          }}
        >
          Sign in with Google
        </button>
      ) : (
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#555",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "0.6rem 1.2rem",
            cursor: "pointer",
          }}
        >
          Logout ({user.displayName})
        </button>
      )}
    </div>
  );
}
