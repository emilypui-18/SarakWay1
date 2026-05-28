import { useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. Import the centralized apiFetch wrapper (2 levels up gets to website/src/)
import { apiFetch } from "../../api";

import "../../styles/auth.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // 2. CHANGED: Swapped window.fetch() + IP with your clean apiFetch tool
      const response = await apiFetch("/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to send reset code"
        );
        return;
      }

      navigate(
        "/reset-password",
        {
          state: { email },
        }
      );

    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <h1>Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">
          {loading ? "Sending..." : "Send Reset Code"}
        </button>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
