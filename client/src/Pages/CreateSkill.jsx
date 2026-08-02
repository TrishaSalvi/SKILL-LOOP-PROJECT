import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../api/axios.js";

export default function CreateSkill() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    level: "Beginner",
    creditCost: 10,
    proofLink: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/skills", form);
      navigate("/my-skills");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-3xl card">
      <h1 className="text-4xl font-black text-ink">Create a teachable skill</h1>
      <p className="mt-2 text-slate-600">List what you can teach and set a credit cost for one session.</p>

      {error && <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input className="form-input" name="title" placeholder="Skill title, e.g. React Basics" value={form.title} onChange={handleChange} />
        <textarea className="form-input min-h-32" name="description" placeholder="Describe what learners will understand after the session" value={form.description} onChange={handleChange} />
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="form-input" name="category" placeholder="Category, e.g. Coding" value={form.category} onChange={handleChange} />
          <select className="form-input" name="level" value={form.level} onChange={handleChange}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="form-input" name="tags" placeholder="Tags comma separated" value={form.tags} onChange={handleChange} />
          <input className="form-input" name="creditCost" type="number" min="1" placeholder="Credit cost" value={form.creditCost} onChange={handleChange} />
        </div>
        <input className="form-input" name="proofLink" placeholder="Proof link, GitHub, portfolio, certificate optional" value={form.proofLink} onChange={handleChange} />
        <button className="btn-primary w-full">Create Skill</button>
      </form>
    </div>
  );
}
