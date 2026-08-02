import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Skills from "./Pages/Skills.jsx";
import SkillDetails from "./Pages/SkillDetails.jsx";
import CreateSkill from "./Pages/CreateSkill.jsx";
import MySkills from "./Pages/MySkills.jsx";
import Wallet from "./Pages/Wallet.jsx";
import MyBookings from "./Pages/MyBookings.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-skysoft">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/skills/:id" element={<SkillDetails />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-skill"
            element={
              <ProtectedRoute>
                <CreateSkill />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-skills"
            element={
              <ProtectedRoute>
                <MySkills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
