import { useState } from "react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import "../../styles/register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      // 🔥 handle non-JSON errors safely
      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        alert("Registration failed");
        return;
      }

      const data = await res.json();

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
<img
  src={logo}
  alt="logo"
  className="auth-logo"
/>

<h1 className="auth-title">
  Create Account
</h1>

<p className="auth-subtitle">
  Join the SarakWay Training Program
</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="name"
            onChange={handleChange}
            required
          />

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

          <button type="submit">register</button>
        </form>

        <p onClick={() => navigate("/login")} className="link">
          already have an account? login
        </p>
      </div>
    </div>
  );
}