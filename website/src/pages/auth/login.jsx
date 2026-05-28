import { useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. Import Cognito Auth utilities from Amplify
import { signIn, fetchAuthSession } from "aws-amplify/auth";
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

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 2. Updated login handler using Cognito
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Sign into Cognito User Pool
      const { isSignedIn, nextStep } = await signIn({
        username: form.email,
        password: form.password,
      });

      // Handle unverified user sign-ups
      if (nextStep && nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        alert("Your email is not verified yet. Redirecting to verification page...");
        navigate("/register", { state: { email: form.email, step: "verify" } });
        return;
      }

      if (isSignedIn) {
        // Fetch the user session to read claims and JWT tokens
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken;

        // Try extracting user role from custom Cognito attribute or default to 'guide'
        const userRole = idToken?.payload["custom:role"] || idToken?.payload["role"] || "guide";

        // Package up user session variables to sync with your current app state architecture
        const userData = {
          email: form.email,
          role: userRole,
          token: idToken?.toString(),
        };

        localStorage.setItem("user", JSON.stringify(userData));

        // Reroute according to system access level
        if (userRole === "admin") {
          navigate("/admin/courses");
        } else {
          navigate("/guide/courses");
        }
      }
    } catch (err) {
      console.error("Cognito login error:", err);
      
      // Catch common Cognito errors to show clean messages
      if (err.name === 'NotAuthorizedException' || err.name === 'UserNotFoundException') {
        alert("Incorrect email or password.");
      } else if (err.name === 'UserNotConfirmedException') {
        alert("Please confirm your email registration verification code first.");
      } else {
        alert(err.message || "An authentication error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* BACKGROUND */}
      <div className="scene" aria-hidden="true">
        <div className="stars" />
        <div className="halo" />
        <div className="mist mist-1" />
        <div className="mist mist-2" />
        <div className="mist mist-3" />
        <svg
          className="hills"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            <linearGradient id="hill-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a3a24" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#002111" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="hill-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#062818" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#000c04" />
            </linearGradient>
            <linearGradient id="hill-near" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020e07" />
              <stop offset="100%" stopColor="#000" />
            </linearGradient>
          </defs>
          <path d="M0 540 C 180 460, 360 520, 540 480 S 880 420, 1060 480 S 1380 520, 1600 480 L 1600 900 L 0 900 Z" fill="url(#hill-far)" />
          <path d="M0 660 C 220 600, 420 670, 620 630 S 980 580, 1180 640 S 1440 660, 1600 620 L 1600 900 L 0 900 Z" fill="url(#hill-mid)" />
          <path d="M0 780 C 120 760, 220 800, 320 780 C 400 765, 440 740, 510 760 C 580 780, 640 750, 720 770 C 820 795, 880 745, 980 770 C 1060 790, 1140 760, 1240 775 C 1340 790, 1440 760, 1600 780 L 1600 900 L 0 900 Z" fill="url(#hill-near)" />
        </svg>
      </div>

      {/* TOP BAR */}
      <div className="topbar">
        <button className="back-pill" onClick={() => navigate("/")} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to home
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

      {/* MAIN */}
      <main className="auth">
        {/* LEFT INTRO */}
        <section className="intro">
          <span className="eyebrow reveal">
            <span className="dot" />
            Park guide portal
          </span>
          <h1 className="reveal" style={{ "--d": ".08s" }}>
            Return to the <em>rainforest.</em>
          </h1>
          <p className="lead reveal" style={{ "--d": ".16s" }}>
            Continue your training journey, monitor alerts, and reconnect with Sarawak’s rainforest learning ecosystem.
          </p>
          <div className="trust-row">
            <div className="trust reveal" style={{ "--d": ".24s" }}>
              <div className="num">52</div>
              <div className="lab">Active Guides</div>
            </div>
            <div className="trust reveal" style={{ "--d": ".32s" }}>
              <div className="num">4</div>
              <div className="lab">National Parks</div>
            </div>
            <div className="trust reveal" style={{ "--d": ".40s" }}>
              <div className="num">141</div>
              <div className="lab">Certificates</div>
            </div>
          </div>
        </section>

        {/* LOGIN CARD */}
        <section className="card reveal">
          <div className="card-head">
            <h2>Welcome <em>back</em></h2>
            <p className="sub">Sign in to SarakWay</p>
          </div>

          <form onSubmit={handleLogin} autoComplete="on">
            {/* EMAIL */}
            <div className="field">
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="email">Email</label>
            </div>

            {/* PASSWORD */}
            <div className="field">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
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
              <label htmlFor="password">Password</label>
            </div>

            {/* OPTIONS */}
            <div className="row">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              {/* Optional: Add routing to your forgot password view here */}
              <a onClick={() => navigate("/forgot-password")}>Forgot password?</a>
            </div>

            {/* LOGIN BUTTON */}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="divider">or</div>

          <p className="alt-link">
            Don’t have an account? <a onClick={() => navigate("/register")}>Create one</a>
          </p>
        </section>
      </main>
    </div>
  );
}
