import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-ink text-white" : "text-slate-600 hover:bg-white hover:text-ink"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-skysoft/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-2xl font-black text-ink">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white">S</span>
          SkillLoop
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/skills" className={navClass}>Discover</NavLink>
          {user && <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>}
          {user && <NavLink to="/my-skills" className={navClass}>My Skills</NavLink>}
          {user && <NavLink to="/bookings" className={navClass}>Bookings</NavLink>}
          {user && <NavLink to="/wallet" className={navClass}>Wallet</NavLink>}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm font-semibold text-slate-600 sm:block">Hi, {user.name}</span>
              <button onClick={logout} className="btn-secondary px-4 py-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary px-4 py-2">Login</Link>
              <Link to="/register" className="btn-primary px-4 py-2">Join</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
