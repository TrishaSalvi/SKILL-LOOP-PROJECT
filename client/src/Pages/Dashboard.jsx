import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loading from "../Components/Loading.jsx";
import StatCard from "../Components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
  const load = async () => {
    try {
      const [walletRes, bookingsRes, skillsRes] = await Promise.all([
        api.get("/wallet"),
        api.get("/bookings/mine"),
        api.get("/skills/me/my-skills")
      ]);

      setWallet(walletRes.data);
      setBookings(bookingsRes.data);
      setSkills(skillsRes.data);
    } catch (error) {
      console.error("Dashboard load failed:", error);
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <section className="card flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="badge w-fit">Dashboard</p>
          <h1 className="mt-4 text-4xl font-black text-ink">Hi {user.name}, keep the loop moving.</h1>
          <p className="mt-2 text-slate-600">Teach to earn credits. Spend credits to learn new skills.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/create-skill" className="btn-primary">Create Skill</Link>
          <Link to="/skills" className="btn-secondary">Find Skills</Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-4">
        <StatCard label="Available Credits" value={wallet.balance} hint="Spendable now" />
        <StatCard label="Escrow Credits" value={wallet.escrowBalance} hint="Locked in active bookings" />
        <StatCard label="Skills Listed" value={skills.length} hint="Your teachable skills" />
        <StatCard label="Bookings" value={bookings.length} hint="Teaching + learning" />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-2xl font-black text-ink">Recent bookings</h2>
          <div className="mt-5 space-y-3">
            {bookings.slice(0, 4).map((booking) => (
              <div key={booking._id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-ink">{booking.skill?.title}</p>
                <p className="text-sm text-slate-500">{booking.status} • {booking.credits} credits</p>
              </div>
            ))}
            {!bookings.length && <p className="text-slate-500">No bookings yet.</p>}
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-black text-ink">Your skills</h2>
          <div className="mt-5 space-y-3">
            {skills.slice(0, 4).map((skill) => (
              <div key={skill._id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-ink">{skill.title}</p>
                <p className="text-sm text-slate-500">{skill.category} • {skill.creditCost} credits</p>
              </div>
            ))}
            {!skills.length && <p className="text-slate-500">You have not listed any skill yet.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
