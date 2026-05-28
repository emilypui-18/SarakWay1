import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import "../../styles/auth.css";

export default function ResetPassword() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const email =
    location.state?.email || "";

  const [code, setCode] =
    useState("");

  const [newPassword,
    setNewPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleReset = async (e) => {

    e.preventDefault();

    setError("");

    try {

      setLoading(true);

      const response = await fetch(

        "/auth/reset-password",

        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            email,
            code,
            newPassword,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.message ||
          "Reset failed"
        );

        return;
      }

      alert(
        "Password reset successful"
      );

      navigate("/login");

    } catch (err) {

      console.error(err);

      setError(
        "Network error"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="auth-page">

      <form
        className="auth-form"
        onSubmit={handleReset}
      >

        <h1>
          Reset Password
        </h1>

        <input
          type="text"
          placeholder="Verification code"
          value={code}
          onChange={(e) =>
            setCode(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(
              e.target.value
            )
          }
          required
        />

        <button type="submit">

          {loading
            ? "Resetting..."
            : "Reset Password"}

        </button>

        {error && (
          <p>{error}</p>
        )}

      </form>

    </div>
  );
}
