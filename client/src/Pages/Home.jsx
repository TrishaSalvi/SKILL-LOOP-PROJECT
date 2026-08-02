import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <section>
        <span className="badge">Teach • Earn Credits • Learn</span>
        <h1 className="mt-6 text-5xl font-black leading-tight text-ink sm:text-6xl">
          A campus skill economy where skills become currency.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          SkillLoop lets students list teachable skills, open session slots, book peer sessions using credits,
          and build trust through reviews. No money involved — just contribution and learning.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link to={user ? "/create-skill" : "/register"} className="btn-primary">
            Start Teaching
          </Link>
          <Link to="/skills" className="btn-secondary">
            Discover Skills
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="card">
            <p className="text-3xl">📚</p>
            <h3 className="mt-3 font-black">Teach</h3>
            <p className="mt-2 text-sm text-slate-600">Create skills and publish slots.</p>
          </div>
          <div className="card">
            <p className="text-3xl">💳</p>
            <h3 className="mt-3 font-black">Earn</h3>
            <p className="mt-2 text-sm text-slate-600">Credits release after completion.</p>
          </div>
          <div className="card">
            <p className="text-3xl">🚀</p>
            <h3 className="mt-3 font-black">Learn</h3>
            <p className="mt-2 text-sm text-slate-600">Spend credits on peer sessions.</p>
          </div>
        </div>
      </section>

      <section className="card min-h-[430px]">
        <div className="relative mx-auto flex h-[380px] max-w-md items-center justify-center">
          <div className="absolute top-8 rounded-full bg-emerald-500 px-12 py-6 font-black text-white shadow-soft">Teach</div>
          <div className="absolute left-4 top-48 rounded-full bg-indigo-500 px-12 py-6 font-black text-white shadow-soft">Learn</div>
          <div className="absolute right-0 top-48 rounded-full bg-amber-400 px-12 py-6 font-black text-white shadow-soft">Credit</div>
          <div className="absolute bottom-8 max-w-xs text-center text-slate-600">
            Contribution creates access. Learning becomes a community loop.
          </div>
          <div className="absolute left-32 top-36 h-24 w-1 rotate-[-12deg] rounded-full bg-amber-300" />
          <div className="absolute right-28 top-40 h-24 w-1 rotate-45 rounded-full bg-indigo-400" />
        </div>
      </section>
    </div>
  );
}
