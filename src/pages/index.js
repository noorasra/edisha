// pages/login.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebaseConfig"; // Import the initialized Firebase auth
import { signInWithEmailAndPassword } from "firebase/auth"; // Import the sign-in method
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "@/components/layout/Layout";
import Tags from "@/constants/tags";

export default function Login() {
  const [email, setEmail] = useState(""); // Change username to email
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password); // Authenticate user

      // Store authentication status and the current timestamp
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("loginTime", Date.now());

      router.push("/marriage-admin-panel"); // Redirect to the admin panel
    } catch (error) {
      alert("Invalid email or password: " + error.message); // Show error message
    }
  };

  const isSessionValid = () => {
    const loginTime = localStorage.getItem("loginTime");
    const sessionDuration = 60 * 60 * 1000; // 1 hour in milliseconds

    if (!loginTime) {
      return false; // No login time found
    }

    const currentTime = Date.now();
    return currentTime - loginTime < sessionDuration; // Check if the session is still valid
  };

  useEffect(() => {
    if (
      isSessionValid() &&
      localStorage.getItem("isAuthenticated") === "true"
    ) {
      router.push("/marriage-admin-panel"); // Redirect to the admin panel if already authenticated
    }
  }, [router]);

  return (
    <Layout title={Tags.edishahr.title} description={Tags.edishahr.description}>
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div
          className="card p-4 shadow-sm"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h2 className="text-center mb-4">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
