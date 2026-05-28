import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Import the native Cognito password confirmation workflow from Amplify
import { confirmResetPassword } from "aws-amplify/auth";
import logo from "../../assets/logo.png";

import "../../styles/auth.css";
import "../../styles/login.css";

const EyeIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract pre-filled fallback configuration context safely
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email context is missing. Please type in your target account email profile.");
      return;
    }

    try {
      setLoading(true);

      // Applies code authentication and resets the target password record inside your User Pool
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      });

      alert("Password updated successfully! Please log in with your updated credentials.");
      navigate("/login");
    } catch (err) {
      console.error("Cognito password configuration reset failure:", err);
      const errorName = err.name || err.code;

      if (errorName === "CodeMismatchException") {
        alert("The verification code entered is incorrect. Please check syntax entry.");
      } else if (errorName === "ExpiredCodeException") {
        alert("This verification code has expired. Please go back and request a fresh token.");
      } else if (errorName === "InvalidPasswordException") {
        alert("The chosen password structure fails the security criteria configured inside your user pool.");
      } else {
        alert(err.message || "An authentication error occurred while resetting your password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* BACKGROUND SCENE GRAPHICS */}
      <div className="scene" aria-hidden="true">
        <div className="stars" />
        <div className="halo" />
        <div className="mist mist-1" />
        <div className="mist mist-2" />
        <div className="mist mist-3" />
        <svg className="hills" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="hill-far-rp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a3a24" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#002111" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="hill-mid-rp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#062818" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#000c04" />
            </linearGradient>
            <linearGradient id="hill-near-rp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020e07" />
              <stop offset="100%" stopColor="#000" />
            </linearGradient>
          </defs>
          <path d="M0 540 C 180 460, 360 520, 540 480 S 880 420, 1060 480 S 1380 520, 1600 480 L 1600 900 L 0 900 Z" fill="url(#hill-far-rp)" />
          <path d="M0 660 C 220 600, 420 670, 620 630 S 980 580, 1180 640 S 1440 660, 1600 620 L 1600 900 L 0 900 Z" fill="url(#hill-mid-rp)" />
          <path d="M0 780 C 120 760, 220 800, 320 780 C 400 765, 440 740, 510 760 C 580 780, 640 750, 720 770 C 820 795, 880 745, 980 770 C 1060 790, 1140 760, 1240 775 C 1340 790, 1440 760, 1600 780 L 1600 900 L 0 900 Z" fill="url(#hill-near-rp)" />
        </svg>
      </div>

      {/* TOP HEADER STATUS LINE */}
      <div className="topbar">
        <button className="back-pill" onClick={() => navigate("/forgot-password")} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to code request
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

      {/* MAIN CONTAINER LAYOUT */}
      <main className="auth">
        {/* LEFT TEXT PANEL */}
        <section className="intro">
          <span className="eyebrow reveal">
            <span className="dot" />
            Security Reconfiguration
          </span>
          <h1 className="reveal">
            Configure your <em>new credentials.</em>
          </h1>
          <p className="lead reveal">
            Apply the configuration pin sent to your email profile along with a new secure passphrase to complete account updating rules.
          </p>
        </section>

        {/* DATA INPUT SUBMISSION CARD */}
        <section className="card reveal">
          <div className="card-head">
            <h2>Reset <em>password</em></h2>
            <p className="sub">Update credentials for account identity confirmation</p>
          </div>

          <form onSubmit={handleReset} autoComplete="off">
            {/* EMAIL PROFILE FIELD UTILITY */}
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
              <label htmlFor="email">Account Email Profile</label>
            </div>

            {/* VERIFICATION CODE CONTROL */}
            <div className="field">
              <input
                id="code"
                name="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="code">Verification Code Token</label>
            </div>

            {/* NEW PASSWORD DATA CONTROL */}
            <div className="field">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder=" "
                required
              />
              <button
                type="button"
                className="ico pw-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? EyeOffIcon : EyeIcon}
              </button>
              <label htmlFor="newPassword">New Password Selection</label>
            </div>

            {/* TRANSACTION EVENT ACTION RUNNER */}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Reconfiguring..." : "Reset Password"}
            </button>
          </form>

          <div className="divider">or</div>

          <p className="alt-link">
            Aborting configuration? <a onClick={() => navigate("/login")}>Return to Sign In</a>
          </p>
        </section>
      </main>
    </div>
  );
}
