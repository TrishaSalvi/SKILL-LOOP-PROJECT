import { useEffect, useState } from "react";
import api from "../api/axios.js";
import EmptyState from "../Components/EmptyState.jsx";
import Loading from "../Components/Loading.jsx";
import SkillCard from "../Components/SkillCard.jsx";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchSkills = async () => {
    setLoading(true);
    const { data } = await api.get("/skills", { params: { search, category } });
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSkills();
  };

  return (
    <div className="space-y-8">
      <section className="card">
        <h1 className="text-4xl font-black text-ink">Discover peer skills</h1>
        <p className="mt-2 text-slate-600">Search for skills, compare credits, and book open slots.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-[1fr_240px_auto]">
          <input className="form-input" placeholder="Search React, C++, design, poetry..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <input className="form-input" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <button className="btn-primary">Search</button>
        </form>
      </section>

      {loading ? (
        <Loading />
      ) : skills.length ? (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => <SkillCard key={skill._id} skill={skill} />)}
        </section>
      ) : (
        <EmptyState title="No skills found" message="Try another search or create the first skill in this category." />
      )}
    </div>
  );
}
