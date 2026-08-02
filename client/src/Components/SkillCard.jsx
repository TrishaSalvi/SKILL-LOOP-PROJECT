import { Link } from "react-router-dom";

export default function SkillCard({ skill }) {
  return (
    <article className="card flex h-full flex-col justify-between">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="badge">{skill.category}</span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {skill.creditCost} credits
          </span>
        </div>

        <h3 className="text-2xl font-black text-ink">{skill.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{skill.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {skill.tags?.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-sm font-bold text-ink">{skill.teacher?.name || "Teacher"}</p>
          <p className="text-xs text-slate-500">⭐ {skill.ratingAvg || 0} ({skill.totalReviews || 0})</p>
        </div>
        <Link to={`/skills/${skill._id}`} className="btn-primary px-4 py-2 text-sm">
          View
        </Link>
      </div>
    </article>
  );
}
