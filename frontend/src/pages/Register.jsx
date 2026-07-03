// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    if (!form.name || !form.email || !form.password) return setError("All fields are required");
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError("Enter a valid email");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    try {
      setLoading(true);
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-wrap">
        <div className="card">
          <h1>Create your account</h1>
          <p className="muted">It takes less than a minute.</p>
          <label>Name</label>
          <input name="name" value={form.name} onChange={change} placeholder="Your name" />
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" />
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={change} placeholder="At least 6 characters" />
          {error && <p className="error">{error}</p>}
          <button className="btn block dark" style={{ marginTop: 20 }} onClick={submit} disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
          <p className="muted" style={{ marginTop: 16, marginBottom: 0 }}>
            Already have an account? <Link className="link" to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
