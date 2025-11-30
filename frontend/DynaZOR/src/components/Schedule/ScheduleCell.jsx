export default function ScheduleCell({ time, day, item, onClick }) {
  return (
    <button
      onClick={() => onClick({ time, day, item })}
      className={`
        w-28 h-24 mx-auto 
        flex flex-col justify-center items-center
        border border-gray-300 rounded-xl 
        bg-white shadow-sm
        hover:bg-indigo-50 hover:shadow-md 
        active:scale-95 transition
      `}
    >
      <div className="text-xs text-gray-500">{time}</div>
      <div className="text-sm font-medium text-gray-700">
        {item ? item.label : ""}
      </div>
    </button>
  );
}
