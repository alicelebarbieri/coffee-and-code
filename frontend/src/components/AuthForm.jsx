import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
        //alert("Logged in successfully!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // displayName based on email
        const nameFromEmail = email.split("@")[0]; 
        await updateProfile(user, { displayName: nameFromEmail });

        alert("Account created successfully!");

      }
    } catch (error) {
    
    //console.error("Auth Error Code:", error.code);
    //console.error("Auth Error Message:", error.message);
    

    alert(error.message);
    } finally {
    setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "3rem auto",
        padding: "2rem",
        background: "#1e1e1e",
        borderRadius: "10px",
        color: "white",
      }}
    >
    <button
  onClick={() => {
    import("firebase/auth").then(({ GoogleAuthProvider, signInWithPopup }) => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider);
    });
  }}
  style={{
    backgroundColor: "#333",
    color: "white",
    border: "1px solid #555",
    borderRadius: "6px",
    padding: "0.8rem",
    width: "100%",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.3s",
  }}
    onMouseEnter={(e) => (e.target.style.background = "#444")}
    onMouseLeave={(e) => (e.target.style.background = "#333")}
    >
    Continue with Google
    </button>

    <p
    style={{
    textAlign: "center",
    color: "#aaa",
    margin: "1rem 0 0.5rem 0",
    fontSize: "0.9rem",
    }}
    >
    or Sign In
    </p>

    <hr style={{ border: "1px solid #444", margin: "1rem 0" }} />

    <h2
    className="text-center mb-3"
    style={{
    color: "white",
    fontWeight: "600",
    fontSize: "1.5rem",
    marginTop: "1rem",
    }}
    >
    
    </h2>

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "0.7rem",
            borderRadius: "6px",
            border: "1px solid #444",
            backgroundColor: "#2a2a2a",
            color: "white",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "0.7rem",
            borderRadius: "6px",
            border: "1px solid #444",
            backgroundColor: "#2a2a2a",
            color: "white",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#4a4a4a",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "0.8rem",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Please wait..."
            : isLogin
            ? "Sign In"
            : "Create Account"}
        </button>
      </form>

      <p className="text-center mt-3">
        {isLogin ? "New here?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: "none",
            color: "#aaa",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isLogin ? "Create one" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
