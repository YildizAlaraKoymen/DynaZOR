import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MakeAppointment({ getUserByUsername }) {
  const [scheduleOwner, setScheduleOwner] = useState("");
  const [form, setForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleAppointmentButton = () => setForm(true);

  const handleScheduleOwnerChange = (e) => {
    setScheduleOwner(e.target.value);
  };

  const handleMakeAppointment = async () => {
    if (!scheduleOwner.trim()) {
      setMessage(["Please enter a username", "error"]);
      return;
    }

    setLoading(true);
    try {
      const user = await getUserByUsername(scheduleOwner);
      if (user?.userID) {
        setMessage(["Redirecting to schedule", "success"]);
        localStorage.setItem("viewerRole", "viewer");
        setTimeout(() => {
          navigate("/schedule", { state: { userID: user.userID } });
          setScheduleOwner("");
          setForm(false);
        }, 500);
      } else {
        setMessage(["User not found", "error"]);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setMessage(["The user doesn't exist, please try again", "error"]);
      } else {
        setMessage(["Failed to find user", "error"]);
      }
      setScheduleOwner("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <button
        onClick={handleAppointmentButton}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200"
      >
        Make an Appointment
      </button>
      {form && (
        <div className="mt-4">
          <input
            type="text"
            value={scheduleOwner}
            placeholder="Enter username"
            onChange={handleScheduleOwnerChange}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <button
            onClick={handleMakeAppointment}
            disabled={loading}
            className="mt-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
          >
            {loading ? "Searching..." : "Submit"}
          </button>
        </div>
      )}
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
      {message && message[1] === "success" && (
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-green-800 font-medium">{message[0]}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
