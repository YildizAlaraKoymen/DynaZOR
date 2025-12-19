import ScheduleCell from "./ScheduleCell";
import { useMemo } from "react";

const times = [
  "08:00", "08:45", "09:30", "10:15", "11:00", "11:45",
  "12:30", "13:15", "14:00", "14:45", "15:30", "16:15",
  "17:00", "17:45"
];

const timeLabel = (h, m) => `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

export default function ScheduleTable({ schedule_data = [], onCellClick, isOwner, selectedSlots = []}) {
  const { days, grid } = useMemo(() => {
    const dayList = schedule_data.map((d) => d.date);
    const map = {};

    for (const day of schedule_data) {
      map[day.date] = {};
      for (const slot of day.timeslots || []) {
        const t = timeLabel(slot.hour, slot.minute);
        map[day.date][t] = slot;
      }
    }

    return { days: dayList, grid: map };
  }, [schedule_data]);

  if (!days.length) {
    return (
      <div className="text-center py-20">
        <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-gray-600">No Schedule Found</h3>
        <p className="mt-2 text-gray-500">
          {isOwner ? "Start by adding your first time slot" : "Schedule is empty"}
        </p>
        {isOwner && (
          <button className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition">
            Create Schedule
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-gradient-to-r from-gray-50 to-gray-100 w-28"></th>
            {days.map((day) => (
              <th
                key={day}
                className="text-center py-4 px-6 text-lg font-bold text-gray-700 bg-gradient-to-b from-gray-50 to-white border-b-2 border-indigo-200"
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-2xl font-bold text-indigo-600 mt-1">
                    {new Date(day).getDate()}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {times.map((time, idx) => (
            <tr key={time} className={idx % 2 === 0 ? "bg-gray-50/30" : "bg-white"}>
              <td className="sticky left-0 z-10 text-right pr-6 py-4 text-gray-600 font-semibold text-sm bg-gradient-to-r from-gray-50 to-gray-100 border-r-2 border-gray-200">
                <div className="flex items-center justify-end gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {time}
                </div>
              </td>

              {days.map((day) => (
                <td key={`${day}-${time}`} className="p-2 border-b border-gray-100">
                  <ScheduleCell
                    time={time}
                    day={day}
                    item={grid[day]?.[time]}
                    onClick={onCellClick}
                    isOwner={isOwner}
                    selected={selectedSlots.some((s) => s.key === `${day}|${time}`)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
