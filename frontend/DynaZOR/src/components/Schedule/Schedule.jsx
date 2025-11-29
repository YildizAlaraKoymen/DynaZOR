import React, {useState} from "react";
import ScheduleTable from "./ScheduleTable"

const initialData = {
  Mon: {
    "08:45": { label: "Math" },
    "10:15": { label: "Physics" },
  },
  Wed: {
    "11:00": { label: "Meeting" },
  },
};

export default function Schedule() {
  const [schedule, setSchedule] = useState(initialData);

  const handleCellClick = ({ day, time, item }) => {
    console.log("Clicked", day, time, item)

    setSchedule((prev) => {
      const copy = structuredClone(prev);
      if (!copy[day]) copy[day] = {};
      copy[day][time] = item ? null : { label: "Busy"}
      return copy;
    })
  }
  return (
    <div>
      <h1 className="schedule-title">Schedule</h1>
      <ScheduleTable data = {schedule} onCellClick = {handleCellClick}/>
    </div>
  )
}
