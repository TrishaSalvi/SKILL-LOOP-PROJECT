import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { getErrorMessage } from "../api/axios.js";
import Loading from "../Components/Loading.jsx";
import SlotCard from "../Components/SlotCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import socket from "../socket.js";

export default function SkillDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [skill, setSkill] = useState(null);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const [skillRes, slotRes, reviewRes] = await Promise.all([
      api.get(`/skills/${id}`),
      api.get(`/slots/skill/${id}`),
      api.get(`/reviews/skill/${id}`)
    ]);

    setSkill(skillRes.data);
    setSlots(slotRes.data);
    setReviews(reviewRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();

    socket.connect();
    socket.emit("join-skill", id);

    socket.on("slot-created", (slot) => setSlots((prev) => [...prev, slot]));
    socket.on("slot-booked", ({ slotId }) => {
      setSlots((prev) => prev.map((slot) => (slot._id === slotId ? { ...slot, status: "booked" } : slot)));
    });
    socket.on("slot-available", ({ slotId }) => {
      setSlots((prev) => prev.map((slot) => (slot._id === slotId ? { ...slot, status: "available" } : slot)));
    });
    socket.on("slot-deleted", ({ slotId }) => setSlots((prev) => prev.filter((slot) => slot._id !== slotId)));

    return () => {
      socket.emit("leave-skill", id);
      socket.off("slot-created");
      socket.off("slot-booked");
      socket.off("slot-available");
      socket.off("slot-deleted");
    };
  }, [id]);

  const bookSlot = async (slotId) => {
    if (!user) {
      setMessage("Please login to book a session.");
      return;
    }

    setBooking(true);
    setMessage("");

    try {
      await api.post("/bookings", { slotId });
      setMessage("Session booked! Credits are locked in escrow.");
      setSlots((prev) => prev.map((slot) => (slot._id === slotId ? { ...slot, status: "booked" } : slot)));
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <section className="space-y-6">
        <div className="card">
          <div className="flex flex-wrap gap-2">
            <span className="badge">{skill.category}</span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{skill.level}</span>
          </div>

          <h1 className="mt-5 text-4xl font-black text-ink">{skill.title}</h1>
          <p className="mt-4 leading-8 text-slate-600">{skill.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {skill.tags?.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">#{tag}</span>)}
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-black text-ink">Available slots</h2>
          <p className="mt-2 text-sm text-slate-500">Live status updates through Socket.io.</p>
          {message && <p className="mt-4 rounded-2xl bg-teal-50 p-3 text-sm font-semibold text-teal-700">{message}</p>}
          <div className="mt-5 space-y-4">
            {slots.length ? (
              slots.map((slot) => <SlotCard key={slot._id} slot={slot} onBook={bookSlot} booking={booking} />)
            ) : (
              <p className="rounded-2xl bg-slate-50 p-5 text-slate-500">No slots published yet.</p>
            )}
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-black text-ink">Teacher</h2>
          <p className="mt-4 text-lg font-bold">{skill.teacher?.name}</p>
          <p className="text-sm text-slate-500">{skill.teacher?.department} {skill.teacher?.year}</p>
          <p className="mt-3 text-sm text-slate-600">⭐ {skill.teacher?.ratingAvg || 0} from {skill.teacher?.totalReviews || 0} reviews</p>
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-center">
            <p className="text-sm font-semibold text-amber-700">Session Cost</p>
            <p className="text-3xl font-black text-ink">{skill.creditCost}</p>
            <p className="text-xs text-slate-500">credits</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-black text-ink">Reviews</h2>
          <div className="mt-4 space-y-4">
            {reviews.slice(0, 5).map((review) => (
              <div key={review._id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold">⭐ {review.rating}</p>
                <p className="mt-1 text-sm text-slate-600">{review.comment || "No comment"}</p>
                <p className="mt-2 text-xs text-slate-400">by {review.from?.name}</p>
              </div>
            ))}
            {!reviews.length && <p className="text-sm text-slate-500">No reviews yet.</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}
