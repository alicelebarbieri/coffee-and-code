import { useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../firebase";

function AuthButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <img
          src={user.photoURL}
          alt={user.displayName}
          style={{ width: "30px", borderRadius: "50%" }}
        />
        <span style={{ color: "white", fontSize: "0.9rem" }}>
          {user.displayName}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: "#e74c3c",
            border: "none",
            padding: "0.4rem 0.8rem",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      style={{
        background: "#3b3b98",
        border: "none",
        padding: "0.5rem 1rem",
        color: "white",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Login with Google
    </button>
  );
}

export default AuthButton;
