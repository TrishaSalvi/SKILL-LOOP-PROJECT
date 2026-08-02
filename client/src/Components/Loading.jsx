export default function Loading({ text = "Loading..." }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="rounded-3xl bg-white px-8 py-6 text-center shadow-soft">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-emerald-500" />
        <p className="font-semibold text-slate-600">{text}</p>
      </div>
    </div>
  );
}
