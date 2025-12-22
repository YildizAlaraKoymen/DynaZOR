"""
This script runs the DynaZOR application using a development server.
"""

import os
from os import environ
from DynaZOR import app
from DynaZOR import db
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import atexit

def create_daily_schedules():
    """Create a new schedule for all users for today"""
    try:
        today = datetime.now().date()
        user_ids = db.getAllUsers()
        for user_id in user_ids:
            # Check if user already has a schedule for today
            db.cursor.execute("""
                SELECT scheduleID FROM userSchedule
                WHERE userID=? AND scheduleDate=?
            """, (user_id, today))
            existing = db.cursor.fetchone()
            
            if not existing:
                db.createSchedule(user_id, today)
                print(f"Created schedule for user {user_id} on {today}")
    except Exception as e:
        print(f"Error creating daily schedules: {e}")

# Set up scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(
    func=create_daily_schedules,
    trigger="cron",
    hour=0,
    minute=0,
    id="create_daily_schedules"
)
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5555))
    app.run(host="0.0.0.0", port=port, debug=True, use_reloader=False)

