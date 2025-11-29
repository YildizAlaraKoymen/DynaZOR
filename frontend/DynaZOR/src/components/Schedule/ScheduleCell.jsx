
export default function ScheduleCell({ time, day, item, onClick }) {
  return (
    <button
      className="schedule-cell"
      onClick={() => onClick?.({ time, day, item })}
    >
      <div className="schedule-cell-time">{time}</div>
      <div className="schedule-cell-content">
        {item ? item.label : ""}
      </div>
    </button>
  )
}