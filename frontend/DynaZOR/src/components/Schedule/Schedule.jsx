import React, { useState, useEffect } from "react";
import ScheduleTable from "./ScheduleTable";
import { scheduleApi } from "../../apis/scheduleApi";

export default function Schedule() {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const { getScheduleList } = scheduleApi();

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await getScheduleList();
        setSchedule(data || {});
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
        setSchedule({}); // fallback for local development
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const handleCellClick = ({ day, time, item }) => {
    setSchedule((prev) => {
      const copy = structuredClone(prev);
      if (!copy[day]) copy[day] = {};
      copy[day][time] = item ? null : { label: "Busy" };
      return copy;
    });
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading schedule...</p>;

  return (
    <div className="px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-center text-4xl font-bold text-gray-800 mb-10">
          Weekly Schedule
        </h1>
        <ScheduleTable data={schedule} onCellClick={handleCellClick} />
      </div>
    </div>
  );
}
