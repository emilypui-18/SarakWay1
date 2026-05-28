import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Import Cognito authentication workflows + resend utility from Amplify
import { signUp, confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import logo from "../../assets/logo.png";

import "../../styles/auth.css";
import "../../styles/register.css";

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

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

function scoreStrength(s) {
  if (!s) return 0;
  let score = 0;
  if (s.length >= 8) score++;
  if (/[A-Z]/.test(s) && /[a-z]/.test(s)) score++;
  if (/\d/.test(s)) score++;
  if (/[^A-Za-z0-9]/.test(s)) score++;
  if (s.length >= 14) score = Math.min(4, score + 1);
  return score;
}

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  // Track registration step phases ('register' or 'verify')
  const [step, setStep] = useState("register");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    code: "", // Holds the 6-digit verification code token
  });

  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Sync state parameters if redirected from the login component safety net
  useEffect(() => {
    if (location.state?.step === "verify" && location.state?.email) {
      setStep("verify");
      setForm((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const strength = useMemo(
    () => scoreStrength(form.password),
    [form.password]
  );

  // Step 1 Action: Initial Cognito Account Creation
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!terms) {
      alert("Please accept SarakWay's terms and policies to continue.");
      return; 
    }
    
    try {
      setLoading(true);

      const { nextStep } = await signUp({
        username: form.email,
        password: form.password,
        options: {
          userAttributes: {
            email: form.email,
            name: form.name, // Maps name string parameter straight to Cognito
          },
        },
      });

      // Shift user down to code input flow if code confirmation required
      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        alert("Registration initiated! Please check your email inbox for a validation code.");
        setStep("verify");
      }
    } catch (err) {
      console.error("Cognito sign up failure:", err);
      const errorName = err.name || err.code;

      if (errorName === "UsernameExistsException") {
        alert("An account with this email address already exists.");
      } else if (errorName === "InvalidPasswordException") {
        alert("Password does not meet security requirements configured in your user pool.");
      } else {
        alert(err.message || "Registration failed. Verify parameter conditions.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2 Action: 6-Digit Code Validation Form Handler
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      await confirmSignUp({
        username: form.email,
        confirmationCode: form.code,
      });

      alert("Email validated successfully! Your account is active.");
      navigate("/login");
    } catch (err) {
      console.error("Cognito verification failure:", err);
      const errorName = err.name || err.code;

      if (errorName === "CodeMismatchException") {
        alert("The verification code entered is incorrect. Please check syntax entry.");
      } else if (errorName === "ExpiredCodeException") {
        alert("This verification code has expired. Please click 'Resend Code'.");
      } else {
        alert(err.message || "Invalid validation code token.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 3 Action: Resend Verification Dispatcher Utility
  const handleResendCode = async () => {
    try {
      setResending(true);
      await resendSignUpCode({ username: form.email });
      alert("A fresh verification code has been dispatched to your email inbox.");
    } catch (err) {
      console.error("Cognito code resend failure:", err);
      alert(err.message || "Failed to deliver replacement validation token.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page register">
      {/* BACKGROUND */}
      <div className="scene" aria-hidden="true">
        <div className="stars" />
        <div className="halo" />
        <div className="mist mist-1" />
        <div className="mist mist-2" />
        <div className="mist mist-3" />
        <svg className="hills" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="hill-far-r" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a3a24" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#002111" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="hill-mid-r" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#062818" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#000c04" />
            </linearGradient>
            <linearGradient id="hill-near-r" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020e07" />
              <stop offset="100%" stopColor="#000" />
            </linearGradient>
          </defs>
          <path d="M0 540 C 180 460, 360 520, 540 480 S 880 420, 1060 480 S 1380 520, 1600 480 L 1600 900 L 0 900 Z" fill="url(#hill-far-r)" />
          <path d="M0 660 C 220 600, 420 670, 620 630 S 980 580, 1180 640 S 1440 660, 1600 620 L 1600 900 L 0 900 Z" fill="url(#hill-mid-r)" />
          <path d="M0 780 C 120 760, 220 800, 320 780 C 400 765, 440 740, 510 760 C 580 780, 640 750, 720 770 C 820 795, 880 745, 980 770 C 1060 790, 1140 760, 1240 775 C 1340 790, 1440 760, 1600 780 L 1600 900 L 0 900 Z" fill="url(#hill-near-r)" />
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
          Already a guide? <a onClick={() => navigate("/login")}>Sign in</a>
        </div>
      </div>

      {/* MAIN */}
      <main className="auth">
        {/* LEFT */}
        <section className="intro">
          <span className="eyebrow reveal">
            <span className="dot" />
            Join the training program
          </span>
          <h1 className="reveal">
            Begin your <em>guide journey.</em>
          </h1>
          <p className="lead reveal">
            Create your SarakWay account to access flexible training modules, live IoT alerts, and SFC-endorsed certifications.
          </p>
        </section>

        {/* INTERACTIVE COMPONENT STRUCTURE */}
        <section className="card reveal">
          <div className="card-head">
            {step === "register" ? (
              <>
                <h2>Create <em>account</em></h2>
                <p className="sub">Join the SarakWay Training Program</p>
              </>
            ) : (
              <>
                <h2>Verify <em>email</em></h2>
                <p className="sub">Enter the code sent to {form.email}</p>
              </>
            )}
          </div>

          {step === "register" ? (
            /* PHASE 1: ACCOUNT REGISTRATION VIEW */
            <form onSubmit={handleRegisterSubmit} autoComplete="on">
              {/* NAME */}
              <div className="field">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label htmlFor="name">Full name</label>
              </div>

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

              {/* PASSWORD STRENGTH */}
              <div className="meter" data-level={strength}>
                <span /><span /><span /><span /><span />
              </div>

              <div className="meter-lab">
                {form.password ? (
                  <>Password strength: <b>{STRENGTH_LABELS[strength]}</b></>
                ) : (
                  <>Use 8+ characters with numbers and symbols.</>
                )}
              </div>

              {/* TERMS */}
              <label className="terms">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  required
                />
                <span>I agree to SarakWay's terms and policies.</span>
              </label>

              {/* BUTTON */}
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          ) : (
            /* PHASE 2: SECURITY VERIFICATION CODE CODE VIEW */
            <form onSubmit={handleVerifySubmit} autoComplete="off">
              <div className="field">
                <input
                  id="code"
                  name="code"
                  type="text"
                  value={form.code}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label htmlFor="code">6-Digit Verification Code</label>
              </div>

              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Confirming Code..." : "Verify Identity"}
              </button>

              {/* RESEND LINK UTILITY */}
              <p className="alt-link" style={{ marginTop: "1.5rem", textAlign: "center" }}>
                Didn't get the email?{" "}
                <button 
                  type="button" 
                  onClick={handleResendCode} 
                  disabled={resending} 
                  style={{ background: "none", border: "none", color: "var(--primary, #04cc72)", cursor: "pointer", padding: 0, textDecoration: "underline", fontWeight: "600" }}
                >
                  {resending ? "Resending..." : "Resend Code"}
                </button>
              </p>

              <button
                type="button"
                className="back-pill"
                style={{ marginTop: "1rem", border: "none", background: "none", width: "100%", justifyContent: "center" }}
                onClick={() => setStep("register")}
              >
                Back to Registration Form
              </button>
            </form>
          )}

          <div className="divider">or</div>

          <p className="alt-link">
            Already have an account? <a onClick={() => navigate("/login")}>Sign in</a>
          </p>
        </section>
      </main>
    </div>
  );
}
