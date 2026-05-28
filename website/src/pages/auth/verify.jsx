import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Import Cognito authentication utilities from Amplify
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import logo from "../../assets/logo.png";

import "../../styles/auth.css";
import "../../styles/register.css";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();

  // Safely capture pre-filled email from login/register redirection state paths
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  
  // UX processing locks to prevent double-form submissions
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Form submit dispatcher for Cognito code confirmation
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      alert("Email verified successfully! Your SarakWay account is active.");
      navigate("/login");
    } catch (err) {
      console.error("Cognito verification error:", err);
      const errorName = err.name || err.code;

      if (errorName === "CodeMismatchException") {
        alert("The verification code entered is incorrect. Please check syntax entry.");
      } else if (errorName === "ExpiredCodeException") {
        alert("This verification code has expired. Please click 'Resend Code'.");
      } else if (errorName === "UserNotFoundException") {
        alert("No pending registration profile was located for this email account.");
      } else {
        alert(err.message || "Verification processing failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Safe wrapper execution to request token replacements
  const handleResend = async () => {
    if (!email) {
      alert("Please specify a target email address first.");
      return;
    }

    try {
      setResending(true);
      await resendSignUpCode({ username: email });
      alert("A fresh verification code token has been dispatched to your inbox.");
    } catch (err) {
      console.error("Cognito code resend error:", err);
      alert(err.message || "Failed to deliver replacement validation token.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page register">
      {/* BACKGROUND SCENE MATRIX */}
      <div className="scene" aria-hidden="true">
        <div className="stars" />
        <div className="halo" />
        <div className="mist mist-1" />
        <div className="mist mist-2" />
        <div className="mist mist-3" />
        <svg className="hills" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="hill-far-v" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a3a24" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#002111" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="hill-mid-v" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#062818" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#000c04" />
            </linearGradient>
            <linearGradient id="hill-near-v" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020e07" />
              <stop offset="100%" stopColor="#000" />
            </linearGradient>
          </defs>
          <path d="M0 540 C 180 460, 360 520, 540 480 S 880 420, 1060 480 S 1380 520, 1600 480 L 1600 900 L 0 900 Z" fill="url(#hill-far-v)" />
          <path d="M0 660 C 220 600, 420 670, 620 630 S 980 580, 1180 640 S 1440 660, 1600 620 L 1600 900 L 0 900 Z" fill="url(#hill-mid-v)" />
          <path d="M0 780 C 120 760, 220 800, 320 780 C 400 765, 440 740, 510 760 C 580 780, 640 750, 720 770 C 820 795, 880 745, 980 770 C 1060 790, 1140 760, 1240 775 C 1340 790, 1440 760, 1600 780 L 1600 900 L 0 900 Z" fill="url(#hill-near-v)" />
        </svg>
      </div>

      {/* TOP BAR BRAND LINK HEADER */}
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
          Need an account? <a onClick={() => navigate("/register")}>Register</a>
        </div>
      </div>

      {/* MAIN LAYOUT SPLIT CONTAINER */}
      <main className="auth">
        {/* LEFT INSCRIPTION SIDEBAR */}
        <section className="intro">
          <span className="eyebrow reveal">
            <span className="dot" />
            Security Verification
          </span>
          <h1 className="reveal">
            Secure your <em>credentials.</em>
          </h1>
          <p className="lead reveal">
            Confirm your registered email endpoint to initialize identity layers, activate dashboards, and start utilizing the training grid.
          </p>
        </section>

        {/* INTERACTIVE VERIFICATION CONTAINER CARD */}
        <section className="card reveal">
          <div className="card-head">
            <h2>Verify <em>email</em></h2>
            <p className="sub">Enter the confirmation code sent via inbox</p>
          </div>

          <form onSubmit={handleVerify} autoComplete="off">
            {/* EMAIL ROW FIELD */}
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

            {/* CONFIRMATION CODE PIN FIELD */}
            <div className="field">
              <input
                id="code"
                name="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder=" "
                maxLength={6}
                required
              />
              <label htmlFor="code">6-Digit Verification Code</label>
            </div>

            {/* ACTIONS BUTTON ROW EXECUTION */}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Verifying Token..." : "Verify Identity"}
            </button>
          </form>

          {/* DYNAMIC FOOTER UTILITIES CARD GRID */}
          <div className="divider">or</div>

          <p className="alt-link" style={{ textStyle: "none", textAlign: "center" }}>
            Didn't receive the alert email?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || loading}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary, #04cc72)",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
                fontWeight: "600"
              }}
            >
              {resending ? "Resending..." : "Resend Code"}
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}
