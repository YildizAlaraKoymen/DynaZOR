import { useState, useEffect } from "react";
import ScheduleTable from "./ScheduleTable";
import { scheduleApi } from "../../apis/scheduleApi";

export default function Schedule({ userID }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const { getSchedule } = scheduleApi();

  useEffect(() => {
    const loadSchedule = async () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 pb-2 leading-tight">
            Your Daily Schedule
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
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Daily Overview</h2>
            <p className="text-indigo-100 mt-1">Click on any time slot to edit availability</p>
          </div>
          
          <div className="p-8">
            <ScheduleTable schedule_data={schedule} />
          </div>
        </div>

      </div>
    </div>
  );
}
