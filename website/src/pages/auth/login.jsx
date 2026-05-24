import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";
import logo from "../../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://172.20.10.2:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ store user in localStorage
        localStorage.setItem("user", JSON.stringify(data));

        // ✅ redirect based on role
        if (data.role === "admin") {
          navigate("/admin/courses");
        } else {
          navigate("/guide/courses");
        }
      } else {
        alert(data.message || "login failed");
      }
    } catch (err) {
      console.error(err);
      alert("server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <img
  src={logo}
  alt="logo"
  className="auth-logo"
/>

<h1 className="auth-title">
  Welcome Back
</h1>

<p className="auth-subtitle">
  Sign in to SarakWay
</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={handleChange}
            required
          />

          <button type="submit">login</button>
        </form>

        <p onClick={() => navigate("/register")} className="link">
          don’t have an account? register
        </p>
      </div>
    </div>
  );
}