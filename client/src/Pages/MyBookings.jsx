import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../api/axios.js";
import EmptyState from "../Components/EmptyState.jsx";
import Loading from "../Components/Loading.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [reviewForm, setReviewForm] = useState({ bookingId: "", rating: 5, comment: "" });

  const load = async () => {
    const { data } = await api.get("/bookings/mine");
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const completeBooking = async (id) => {
    setMessage("");
    try {
      await api.patch(`/bookings/${id}/complete`);
      setMessage("Session completed. Escrow credits released.");
      load();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const cancelBooking = async (id) => {
    setMessage("");
    try {
      await api.patch(`/bookings/${id}/cancel`);
      setMessage("Booking cancelled. Credits refunded.");
      load();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/reviews", reviewForm);
      setMessage("Review submitted.");
      setReviewForm({ bookingId: "", rating: 5, comment: "" });
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <section className="space-y-6">
        <div className="card">
          <h1 className="text-4xl font-black text-ink">My bookings</h1>
          <p className="mt-2 text-slate-600">Track sessions where you are learner or teacher.</p>
          {message && <p className="mt-4 rounded-2xl bg-teal-50 p-3 text-sm font-semibold text-teal-700">{message}</p>}
        </div>

        {bookings.length ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const iAmLearner = booking.learner?._id === user._id;
              return (
                <article key={booking._id} className="card">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <span className="badge">{iAmLearner ? "Learning" : "Teaching"}</span>
                      <h2 className="mt-3 text-2xl font-black text-ink">{booking.skill?.title}</h2>
                      <p className="mt-2 text-sm text-slate-600">
                        With {iAmLearner ? booking.teacher?.name : booking.learner?.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {booking.slot?.startTime ? new Date(booking.slot.startTime).toLocaleString() : "Slot time unavailable"}
                      </p>
                      <p className="mt-3 font-bold text-indigo-600">{booking.credits} credits • {booking.paymentStatus}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">{booking.status}</span>
                      {booking.status === "booked" && (
                        <>
                          <button onClick={() => completeBooking(booking._id)} className="btn-primary px-4 py-2 text-sm">Complete</button>
                          <button onClick={() => cancelBooking(booking._id)} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No bookings yet" message="Book a skill session or wait for someone to book your slot." />
        )}
      </section>

      <aside className="card h-fit">
        <h2 className="text-2xl font-black text-ink">Leave review</h2>
        <p className="mt-2 text-sm text-slate-600">Reviews are allowed for completed bookings.</p>
        <form onSubmit={submitReview} className="mt-5 space-y-4">
          <select className="form-input" value={reviewForm.bookingId} onChange={(e) => setReviewForm({ ...reviewForm, bookingId: e.target.value })}>
            <option value="">Select completed booking</option>
            {bookings.filter((b) => b.status === "completed").map((booking) => (
              <option key={booking._id} value={booking._id}>{booking.skill?.title}</option>
            ))}
          </select>
          <select className="form-input" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Okay</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Bad</option>
          </select>
          <textarea className="form-input min-h-28" placeholder="Write feedback" value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
          <button className="btn-primary w-full">Submit Review</button>
        </form>
      </aside>
    </div>
  );
}
