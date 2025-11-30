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
        setSchedule(data);
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const handleCellClick = ({ day, time, item }) => {
    console.log("Clicked", day, time, item);

    setSchedule((prev) => {
      const copy = structuredClone(prev);
      if (!copy[day]) copy[day] = {};
      copy[day][time] = item ? null : { label: "Busy" };
      return copy;
    });
  };

  if (loading) return <p>Loading schedule...</p>;

  return (
    <div>
      <h1 className="schedule-title">Schedule</h1>
      <ScheduleTable data={schedule} onCellClick={handleCellClick} />
    </div>
  );
}
