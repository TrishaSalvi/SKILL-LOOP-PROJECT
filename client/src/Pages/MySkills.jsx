import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../api/axios.js";
import EmptyState from "../Components/EmptyState.jsx";
import Loading from "../Components/Loading.jsx";

export default function MySkills() {
  const [skills, setSkills] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [slotForm, setSlotForm] = useState({
    skillId: "",
    startTime: "",
    endTime: "",
    mode: "online",
    meetingLink: "",
    location: ""
  });

  const load = async () => {
    const [skillsRes, slotsRes] = await Promise.all([
      api.get("/skills/me/my-skills"),
      api.get("/slots/mine")
    ]);
    setSkills(skillsRes.data);
    setSlots(slotsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSlotChange = (e) => setSlotForm({ ...slotForm, [e.target.name]: e.target.value });

  const createSlot = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/slots", slotForm);
      setMessage("Slot created successfully.");
      setSlotForm({ skillId: "", startTime: "", endTime: "", mode: "online", meetingLink: "", location: "" });
      load();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const deleteSlot = async (slotId) => {
    try {
      await api.delete(`/slots/${slotId}`);
      setSlots((prev) => prev.filter((slot) => slot._id !== slotId));
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <section className="space-y-6">
        <div className="card">
          <h1 className="text-4xl font-black text-ink">My teaching skills</h1>
          <p className="mt-2 text-slate-600">Manage your skills and add bookable session slots.</p>
        </div>

        {skills.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {skills.map((skill) => (
              <div key={skill._id} className="card">
                <span className="badge">{skill.category}</span>
                <h2 className="mt-4 text-2xl font-black text-ink">{skill.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{skill.description}</p>
                <p className="mt-4 font-bold text-indigo-600">{skill.creditCost} credits/session</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No skills yet" message="Create a skill first, then add time slots." />
        )}
      </section>

      <aside className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-black text-ink">Create slot</h2>
          {message && <p className="mt-4 rounded-2xl bg-teal-50 p-3 text-sm font-semibold text-teal-700">{message}</p>}
          <form onSubmit={createSlot} className="mt-5 space-y-4">
            <select className="form-input" name="skillId" value={slotForm.skillId} onChange={handleSlotChange}>
              <option value="">Select skill</option>
              {skills.map((skill) => <option key={skill._id} value={skill._id}>{skill.title}</option>)}
            </select>
            <input className="form-input" name="startTime" type="datetime-local" value={slotForm.startTime} onChange={handleSlotChange} />
            <input className="form-input" name="endTime" type="datetime-local" value={slotForm.endTime} onChange={handleSlotChange} />
            <select className="form-input" name="mode" value={slotForm.mode} onChange={handleSlotChange}>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            <input className="form-input" name="meetingLink" placeholder="Meeting link optional" value={slotForm.meetingLink} onChange={handleSlotChange} />
            <input className="form-input" name="location" placeholder="Location optional" value={slotForm.location} onChange={handleSlotChange} />
            <button className="btn-primary w-full">Add Slot</button>
          </form>
        </div>

        <div className="card">
          <h2 className="text-2xl font-black text-ink">My slots</h2>
          <div className="mt-5 space-y-3">
            {slots.map((slot) => (
              <div key={slot._id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-ink">{slot.skill?.title}</p>
                <p className="text-sm text-slate-500">{new Date(slot.startTime).toLocaleString()}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="badge">{slot.status}</span>
                  {slot.status === "available" && (
                    <button onClick={() => deleteSlot(slot._id)} className="text-sm font-bold text-rose-600">Delete</button>
                  )}
                </div>
              </div>
            ))}
            {!slots.length && <p className="text-sm text-slate-500">No slots yet.</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}
