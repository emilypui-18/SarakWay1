import { useState, useContext } from "react";
import { UserContext } from '../../App';
import { useNavigate } from "react-router-dom";
// Import Cognito Auth utilities from Amplify
import { signIn, fetchAuthSession, signOut } from "aws-amplify/auth";
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

  const { setUser } = useContext(UserContext);

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

  // Auth login handler mapped directly to Cognito User Pool 
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ⭐ DEV SAFETY SHIELD: Silently clear out any lingering old Cognito sessions
      try {
        const checkSession = await fetchAuthSession();
        if (checkSession.tokens?.idToken) {
          console.log("Lingering authentication state identified. Evicting old session...");
          await signOut();
          localStorage.removeItem("user");
        }
      } catch (sessionErr) {
        // No active session found; safe to skip straight into standard login logic
      }

      // 1. Standard Cognito Login
      const { isSignedIn, nextStep } = await signIn({
        username: form.email,
        password: form.password,
      });

      if (nextStep && nextStep.signInStep === "CONFIRM_SIGN_UP") {
        navigate("/register", { state: { email: form.email, step: "verify" } });
        return;
      }

      if (isSignedIn) {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken;
        const userRole = idToken?.payload["custom:role"] || idToken?.payload["role"] || "guide";

        console.log("Fetching database mapping parameters from Express...");

        // 2. Fetch User Profile from your Express backend
        let userData = {
          user_id: null,
          email: form.email,
          role: userRole,
          token: idToken?.toString(),
        };

        try {
          const syncResponse = await fetch("/http://3.83.197.89:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email })
          });

          if (syncResponse.ok) {
            const syncData = await syncResponse.json();
            
            // UPDATED: Syncing with your new flat backend response
            userData.user_id = syncData.user_id;
            userData.user_name = syncData.user_name;
            userData.role = syncData.role || userRole;
          }
        } catch (backendFetchErr) {
          console.error("Express SQL integration check failed:", backendFetchErr);
        }

        // 3. Final State Update
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // 4. Redirect
        if (userData.role === "admin") {
          navigate("/admin/courses");
        } else {
          navigate("/guide/dashboard");
        }
      }
    } catch (err) {
      console.error("Cognito login error:", err);
      const errorName = err.name || err.code;

      if (errorName === "NotAuthorizedException" || errorName === "UserNotFoundException") {
        alert("Incorrect email or password.");
      } else if (errorName === "UserNotConfirmedException") {
        alert("Please confirm your email registration verification code first.");
        // Self-recovery option: redirect them to verification directly
        navigate("/register", { state: { email: form.email, step: "verify" } });
      } else if (errorName === "PasswordResetRequiredException") {
        alert("Password reset required. Please click 'Forgot password'.");
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
        <svg className="hills" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
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
