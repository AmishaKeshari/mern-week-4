// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Please fill in all fields");
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError("Enter a valid email");
    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-wrap">
        <div className="card">
          <h1>Welcome back</h1>
          <p className="muted">Log in to your account to check out.</p>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" />
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={change} placeholder="••••••" />
          {error && <p className="error">{error}</p>}
          <button className="btn block dark" style={{ marginTop: 20 }} onClick={submit} disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
          <p className="muted" style={{ marginTop: 16, marginBottom: 0 }}>
            New here? <Link className="link" to="/register">Create an account</Link>
          </p>
          <p className="muted" style={{ marginTop: 8, fontSize: "0.82rem" }}>
            Admin demo: admin@shop.com / admin123 (after seeding)
          </p>
        </div>
      </div>
    </div>
  );
}
