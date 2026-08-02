const formatDate = (value) =>
  new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });

export default function SlotCard({ slot, onBook, booking }) {
  const isAvailable = slot.status === "available";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-ink">{formatDate(slot.startTime)}</p>
          <p className="text-sm text-slate-500">Ends: {formatDate(slot.endTime)}</p>
          <p className="mt-2 text-sm text-slate-600">
            {slot.mode === "online" ? "Online" : "Offline"}
            {slot.location ? ` • ${slot.location}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {slot.status}
          </span>
          <button
            disabled={!isAvailable || booking}
            onClick={() => onBook(slot._id)}
            className="btn-primary disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {booking ? "Booking..." : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
}
