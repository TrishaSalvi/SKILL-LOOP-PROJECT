export default function EmptyState({ title, message, action }) {
  return (
    <div className="card py-12 text-center">
      <p className="text-5xl">🌱</p>
      <h3 className="mt-4 text-2xl font-black text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-slate-600">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
