import { useState, useEffect, useMemo } from "react";
import ScheduleTable from "./ScheduleTable";
import MakeAppointment from "./MakeAppointment";
import { userApi } from "../../apis/userApi";

export default function Schedule({ userID, viewerID, viewerRole }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]); // for viewers
  const { getSchedule, getUserByUsername, toggleTimeslot } = userApi();

  // Determine if viewer can edit: owner or admin
  const isOwner = useMemo(() => {
    if (!userID) return false;
    if (viewerRole === "owner") return true;
    if (viewerRole === "viewer") return false;
    return false;
  }, [userID, viewerRole]);

  useEffect(() => {
    const loadSchedule = async () => {
      console.log(isOwner)
      try {
        setLoading(true);
        const data = await getSchedule(userID);
        console.log("Schedule data received:", data);
        setSchedule(data?.schedule || []);
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setMessage(["Failed to load schedule", "error"]);
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };

    if (userID) loadSchedule();
  }, [userID]);

  const handleCellClick = async ({ time, day }) => {
    const [hour, minute] = time.split(':').map(Number);

    // Owner: toggle directly on backend
    if (isOwner) {
      try {
        setLoading(true);
        await toggleTimeslot(userID, day, hour, minute);
        const data = await getSchedule(userID);
        setSchedule(data?.schedule || []);
      } catch (err) {
        console.error("Error toggling timeslot:", err);
        setMessage(["Failed to update timeslot", "error"]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Viewer: select up to 3 available slots locally
    const scheduleDay = schedule.find((s) => s.date === day);
    const ts = scheduleDay?.timeslots.find((t) => t.hour === hour && t.minute === minute);
    if (!ts || ts.available !== 1) {
      setMessage(["You can only select available slots", "error"]);
      return;
    }

    const key = `${day}|${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;
    const exists = selectedSlots.some((s) => s.key === key);
    if (exists) {
      setSelectedSlots(selectedSlots.filter((s) => s.key !== key));
      return;
    }

    if (selectedSlots.length >= 3) {
      setMessage(["You can select at most 3 timeslots", "error"]);
      return;
    }

    setSelectedSlots([
      ...selectedSlots,
      { key, date: day, hour, minute },
    ]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600 mb-4 pb-2 leading-tight">
            {isOwner ? "Your Daily Schedule" : "Schedule"}
          </h1>
        </div>

        {/* Error Message */}
        {message && message[1] === "error" && (
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 font-medium">{message[0]}</p>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Table Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Daily Overview</h2>
              {!isOwner && (
                <span className="inline-flex items-center gap-2 text-indigo-100 bg-white/10 px-3 py-1 rounded-md">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2-7a2 2 0 114 0v1h-4v-1zM7 9a3 3 0 016 0v1h1a1 1 0 110 2H6a1 1 0 110-2h1V9z" clipRule="evenodd"/></svg>
                </span>
              )}
            </div>
            <p className="text-indigo-100 mt-1">
              {isOwner ? "Click any time slot to edit availability" : "Choose at most three available timeslots to make an appointment"}
            </p>
          </div>
          
          <div className="p-8">
            <ScheduleTable schedule_data={schedule} isOwner={isOwner} onCellClick={handleCellClick} selectedSlots={selectedSlots} />
          </div>
        </div>

        {/* Make appointment button */}
        {isOwner && <MakeAppointment getUserByUsername = {getUserByUsername} />}

        {/* Submit selection for viewers */}
        {!isOwner && (
          <div className="mt-6 max-w-4xl mx-auto flex items-center gap-3">
            <button
              onClick={async () => {
                if (!selectedSlots.length) {
                  setMessage(["Select at least one timeslot", "error"]);
                  return;
                }
                try {
                  setLoading(true);
                  // Send selections to backend (requires userApi method)
                  const api = userApi();
                  await api.submitAppointment(userID, selectedSlots.map(({ date, hour, minute }) => ({ date, hour, minute })));
                  setMessage(["Appointment request submitted", "success"]);
                  setSelectedSlots([]);
                  const data = await getSchedule(userID);
                  setSchedule(data?.schedule || []);
                } catch (err) {
                  console.error(err);
                  setMessage(["Failed to submit appointment", "error"]);
                } finally {
                  setLoading(false);
                }
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition disabled:bg-gray-400"
              disabled={loading}
            >
              Submit Selected ({selectedSlots.length}/3)
            </button>
            <button
              onClick={() => setSelectedSlots([])}
              className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
            >
              Clear
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
