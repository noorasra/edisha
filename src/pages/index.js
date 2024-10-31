// pages/login.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "@/components/layout/Layout";
import Tags from "@/constants/tags";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Hardcoded credentials
  const hardcodedUsername = "admin";
  const hardcodedPassword = "admin@5600";

  const handleLogin = (e) => {
    e.preventDefault();

    // Check if the entered credentials match
    if (username === hardcodedUsername && password === hardcodedPassword) {
      // Store authentication status and the current timestamp
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("loginTime", Date.now()); // Store the current timestamp

      router.push("/marriage-admin-panel"); // Redirect to the admin panel
    } else {
      alert("Invalid username or password");
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
    // Check if session is valid when component mounts
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
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
