import ScheduleCell from "./ScheduleCell";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const times = [
  "08:00", "08:45", "09:30", "10:15", "11:00", "11:45",
  "12:30", "13:15", "14:00", "14:45", "15:30", "16:15",
  "17:00", "17:45"
];

export default function ScheduleTable({ data, onCellClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-separate border-spacing-0">
        
        {/* Header Row */}
        <thead>
          <tr>
            <th className="w-24"></th>
            {days.map((day) => (
              <th
                key={day}
                className="text-center py-3 text-lg font-semibold text-gray-600 border-b"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>

        {/* Schedule Rows */}
        <tbody>
          {times.map((time) => (
            <tr key={time} className="h-20">
              {/* Time column */}
              <td className="text-right pr-4 text-gray-500 font-medium text-md align-middle border-r">
                {time}
              </td>

              {/* Day columns */}
              {days.map((day) => (
                <td key={`${day}-${time}`} className="p-2">
                  <ScheduleCell
                    time={time}
                    day={day}
                    item={data?.[day]?.[time]}
                    onClick={onCellClick}
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
