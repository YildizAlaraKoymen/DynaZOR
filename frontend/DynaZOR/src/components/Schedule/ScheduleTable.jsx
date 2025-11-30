import ScheduleCell from './ScheduleCell'

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
const times = ["08:00", "08:45", "09:30", "10:15", "11:00", "11:45", 
               "12:30", "13:15", "14:00", "14:45", "15:30", "16:15", 
               "17:00", "17:45"]

export default function ScheduleTable({ data, onCellClick }) {
  return(
    <div className='schedule-wrapper'>
      <div className = "schedule">
          <div className = "empty-box"/>
          <div className="schedule-row schedule-row--header">
            <div className="schedule-header-empty" />
            {days.map((day) => (
              <div key={day} className="schedule-header-cell">
                {day}
              </div>
            ))}
          </div>
          {times.map((time) => (
            <div key = {time} className="schedule-row">
              <div className = "schedule-col-time">{time}</div>
              {days.map((day) => (
              <ScheduleCell
                key = {`${day}-${time}`}
                time = {time}
                day = {day}
                item = {data?.[day]?.[time]}
                onClick = {onCellClick}
              />
            ))}
            </div>
          ))}
        </div>
    </div>
  
  )
}
