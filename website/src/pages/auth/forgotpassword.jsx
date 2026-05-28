import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Import the native Cognito password recovery workflow from Amplify
import { resetPassword } from "aws-amplify/auth";
import logo from "../../assets/logo.png";

import "../../styles/auth.css";
import "../../styles/login.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Dispatches a password recovery request straight to Cognito
      await resetPassword({ username: email });

      alert("Recovery initiated! Please look for a verification code in your email inbox.");
      
      // Pass the email state context forward to the configuration component
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      console.error("Cognito forgot password failure:", err);
      const errorName = err.name || err.code;

      if (errorName === "UserNotFoundException") {
        alert("No account profile was found matching that email address.");
      } else if (errorName === "LimitExceededException") {
        alert("Attempt limit exceeded. Please wait a few minutes before requesting a new code.");
      } else {
        alert(err.message || "An error occurred while generating your recovery code.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* BACKGROUND SCENE */}
      <div className="scene" aria-hidden="true">
        <div className="stars" />
        <div className="halo" />
        <div className="mist mist-1" />
        <div className="mist mist-2" />
        <div className="mist mist-3" />
        <svg className="hills" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="hill-far-fp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a3a24" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#002111" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="hill-mid-fp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#062818" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#000c04" />
            </linearGradient>
            <linearGradient id="hill-near-fp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020e07" />
              <stop offset="100%" stopColor="#000" />
            </linearGradient>
          </defs>
          <path d="M0 540 C 180 460, 360 520, 540 480 S 880 420, 1060 480 S 1380 520, 1600 480 L 1600 900 L 0 900 Z" fill="url(#hill-far-fp)" />
          <path d="M0 660 C 220 600, 420 670, 620 630 S 980 580, 1180 640 S 1440 660, 1600 620 L 1600 900 L 0 900 Z" fill="url(#hill-mid-fp)" />
          <path d="M0 780 C 120 760, 220 800, 320 780 C 400 765, 440 740, 510 760 C 580 780, 640 750, 720 770 C 820 795, 880 745, 980 770 C 1060 790, 1140 760, 1240 775 C 1340 790, 1440 760, 1600 780 L 1600 900 L 0 900 Z" fill="url(#hill-near-fp)" />
        </svg>
      </div>

      {/* TOP NAVIGATION BAR */}
      <div className="topbar">
        <button className="back-pill" onClick={() => navigate("/login")} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to login
        </button>

        <button className="brand" onClick={() => navigate("/")} type="button">
          <div className="brand-mark">
            <img src={logo} alt="" />
          </div>
          <div>
            <div className="brand-word">SarakWay</div>
            <small className="brand-sub">sarawak forestry corporation</small>
          </div>
        </button>

        <div className="top-side">
          New to SarakWay? <a onClick={() => navigate("/register")}>Register</a>
        </div>
      </div>

      {/* CORE WRAPPER GRID */}
      <main className="auth">
        {/* LEFT INSCRIPTION BLOCK */}
        <section className="intro">
          <span className="eyebrow reveal">
            <span className="dot" />
            Account Recovery Portal
          </span>
          <h1 className="reveal">
            Recover your <em>access layers.</em>
          </h1>
          <p className="lead reveal">
            Provide your verified email identity anchor to receive secure code transmissions and setup a new authentication access password string.
          </p>
        </section>

        {/* INPUT INTERACTIVE CARD */}
        <section className="card reveal">
          <div className="card-head">
            <h2>Forgot <em>password?</em></h2>
            <p className="sub">Enter your email to receive a token</p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="on">
            {/* EMAIL FLOATING LABEL FIELD */}
            <div className="field">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="email">Registered Email Address</label>
            </div>

            {/* FORM ACTION DISPATCH SUBMIT */}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Sending Code..." : "Send Reset Code"}
            </button>
          </form>

          <div className="divider">or</div>

          <p className="alt-link">
            Remembered your access data? <a onClick={() => navigate("/login")}>Sign in</a>
          </p>
        </section>
      </main>
    </div>
  );
}
