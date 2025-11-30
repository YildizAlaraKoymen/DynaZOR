from datetime import datetime, timedelta
import pytz
import db

stockholm_tz = pytz.timezone("Europe/Stockholm")


class User:
    def __init__(self, name):
        userID = db.getUserID(name)
        if not userID:
            userID = db.createUser(name)
        self.name = name
        self.id = userID

    def timeslotGen(self, start, end, interval):
        slots = []
        hour = start
        minute = 0

        while hour <= end:
            slots.append((hour, minute))
            minute += interval
            if minute >= 60:
                minute -= 60
                hour += 1
        return slots

    def scheduleGeneration(self):
        today = datetime.now(stockholm_tz).date()
        db.deletePastDays(self.id, today)
        lastDay = db.getLastScheduleDay(self.id)
        lastDay = lastDay if lastDay else today - timedelta(days=1)
        while db.getScheduleDayCount(self.id) < 7:
            nextDay = lastDay + timedelta(days=1)

            day_id = db.insertScheduleDay(self.id, nextDay)

            for hour, minute in self.timeslotGen(8, 17, 45):
                db.insertTimeSlot(day_id, hour, minute, 0)

            lastDay = nextDay
    
    def freeSlot(self, date_str, time_str):
        hour, minute = map(int, time_str.split(":"))
        db.freeSlotDB(self.id, date_str, hour, minute)


    def showSchedule(self): # For test purposes
        for date, slots in db.getSchedule(self.id):
            print(date)
            for hour, minute, available in slots:
                label = f"{hour:02d}:{minute:02d}"
                status = "Not booked" if available else "Booked/Unavalible"
                print(f"   {label} - {status}")

        print("---------------------------\n")
