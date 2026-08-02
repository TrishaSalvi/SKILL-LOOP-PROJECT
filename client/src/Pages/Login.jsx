import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-xl card">
      <h1 className="text-3xl font-black text-ink">Welcome back</h1>
      <p className="mt-2 text-slate-600">Login to teach, book sessions, and manage your wallet.</p>

      {error && <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input className="form-input" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input className="form-input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button className="btn-primary w-full">Login</button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        New here? <Link className="font-bold text-emerald-500" to="/register">Create account</Link>
      </p>
    </div>
  );
}
