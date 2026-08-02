import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "", year: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-xl card">
      <h1 className="text-3xl font-black text-ink">Create your SkillLoop account</h1>
      <p className="mt-2 text-slate-600">You get 100 welcome credits to start learning.</p>

      {error && <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input className="form-input" name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
        <input className="form-input" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input className="form-input" name="password" type="password" placeholder="Password minimum 6 characters" value={form.password} onChange={handleChange} />
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="form-input" name="department" placeholder="Department" value={form.department} onChange={handleChange} />
          <input className="form-input" name="year" placeholder="Year" value={form.year} onChange={handleChange} />
        </div>
        <button className="btn-primary w-full">Register</button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        Already have an account? <Link className="font-bold text-emerald-500" to="/login">Login</Link>
      </p>
    </div>
  );
}
