# db.py
from dotenv import load_dotenv
import pyodbc
import os
from datetime import date

load_dotenv()
conn = pyodbc.connect(
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={os.getenv('SQLSERVER_HOST')};"
        f"DATABASE={os.getenv('SQLSERVER_DB')};"
        f"UID={os.getenv('SQLSERVER_USER')};"
        f"PWD={os.getenv('SQLSERVER_PASS')}",
)
cursor = conn.cursor()


def createTables():
    cursor.execute("IF OBJECT_ID('priorityQueue','U') IS NOT NULL DROP TABLE priorityQueue;")
    cursor.execute("IF OBJECT_ID('timeslots','U') IS NOT NULL DROP TABLE timeslots;")
    cursor.execute("IF OBJECT_ID('userSchedule','U') IS NOT NULL DROP TABLE userSchedule;")
    cursor.execute("IF OBJECT_ID('users','U') IS NOT NULL DROP TABLE users;")

    cursor.execute("""
    CREATE TABLE users (
        userID INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255),
        username NVARCHAR(255) UNIQUE,
        email NVARCHAR(255) UNIQUE,
        password NVARCHAR(255)
    );
    """)

    cursor.execute("""
    CREATE TABLE userSchedule (
        scheduleID INTEGER IDENTITY(1,1) PRIMARY KEY,
        userID INT FOREIGN KEY REFERENCES users(userID),
        scheduleDate DATE
    );
    """)

    cursor.execute("""
    CREATE TABLE timeslots (
        timeSlotID INT IDENTITY(1,1) PRIMARY KEY,
        scheduleID INT NOT NULL FOREIGN KEY REFERENCES userSchedule(scheduleID),
        hour INT CHECK (hour BETWEEN 0 AND 23),   
        minute INT CHECK (minute BETWEEN 0 AND 59), 
        available BIT DEFAULT 1,
        bookedByUserID INT FOREIGN KEY REFERENCES users(userID)
    );
    """)

    cursor.execute("""
    CREATE TABLE priorityQueue (
        timeSlotID INT NOT NULL,
        userID INT NOT NULL,
        priorityNo INT NOT NULL, 
        PRIMARY KEY (timeSlotID, userID),
        FOREIGN KEY (timeSlotID) REFERENCES timeslots(timeSlotID),
        FOREIGN KEY (userID) REFERENCES users(userID)
    );
    """)
    conn.commit()


def getUserID(username):
    cursor.execute("SELECT userID FROM users WHERE username=?", (username,))
    row = cursor.fetchone()
    return row[0] if row else None


def getAllUsers():
    cursor.execute("SELECT userID FROM users")
    rows = cursor.fetchall()
    return [row[0] for row in rows]


def checkUserLogin(email,password):
    cursor.execute("SELECT * FROM users WHERE email=? AND password=?", (email, password))
    row = cursor.fetchone()
    return row

def checkUserExist(username,email):
    cursor.execute("SELECT * FROM users WHERE username=? OR email=?", (username, email))
    row = cursor.fetchone()
    return row


def createUser(name,username,email,password):
    cursor.execute("INSERT INTO users(name,username,email,password) VALUES(?,?,?,?)", (name,username,email,password))
    conn.commit()


def deletePastDays(userID, today: date):
    cursor.execute("""
        DELETE FROM userSchedule WHERE userID=? AND scheduleDate < ?
    """, (userID, today))
    conn.commit()

def createSchedule(userID, scheduleDate):
    cursor.execute("""
        INSERT INTO userSchedule(userID, scheduleDate)
        OUTPUT INSERTED.scheduleID
        VALUES (?, ?)
    """, (userID, scheduleDate))
    
    scheduleID = cursor.fetchone()[0]
    
    timeslots = [
        (8, 0), (8, 45), (9, 30), (10, 15), (11, 0), (11, 45),
        (12, 30), (13, 15), (14, 0), (14, 45), (15, 30), (16, 15),
        (17, 0), (17, 45)
    ]
    
    # Make all timeslots available on default
    for hour, minute in timeslots:
        cursor.execute("""
            INSERT INTO timeslots(scheduleID, hour, minute, available)
            VALUES (?, ?, ?, 1)
        """, (scheduleID, hour, minute))
    
    conn.commit()
    return scheduleID

def getLastScheduleDay(userID):
    cursor.execute("""
        SELECT scheduleDate FROM userSchedule
        WHERE userID=?
        ORDER BY scheduleDate DESC
        LIMIT 1
    """, (userID,))
    row = cursor.fetchone()
    return row[0] if row else None


def getScheduleDayCount(userID):
    cursor.execute("""
        SELECT COUNT(*) FROM userSchedule WHERE userID=?
    """, (userID,))
    count = cursor.fetchone()[0]
    return count


def insertScheduleDay(userID, scheduleDate):
    cursor.execute("""
        INSERT INTO userSchedule(userID, scheduleDate)
        OUTPUT INSERTED.userID VALUES (?, ?)
    """, (userID, scheduleDate))
    user_id = cursor.fetchone()[0]
    conn.commit()
    return user_id

def insertTimeSlot(scheduleID, hour, minute, available):
    cursor.execute("""
        INSERT INTO timeslots(scheduleID, hour, minute, available)
        VALUES (?, ?, ?, ?)
    """, (scheduleID, hour, minute, available))
    conn.commit()

def getSchedule(userID):
    cursor.execute("""
        SELECT scheduleID, scheduleDate FROM userSchedule
        WHERE userID=?
        ORDER BY scheduleDate DESC
    """, (userID,))
    row = cursor.fetchone()
    
    if not row:
        return [] 
    
    scheduleID, scheduleDate = row
    
    cursor.execute("""
        SELECT hour, minute, available FROM timeslots
        WHERE scheduleID=? ORDER BY hour, minute
    """, (scheduleID,))
    timeSlots = cursor.fetchall()
    
    return [{
        'date': str(scheduleDate),
        'timeslots': [
            {'hour': ts[0], 'minute': ts[1], 'available': int(ts[2])}
            for ts in timeSlots
        ]
    }]

def toggleSlotDB(userID, date, hour, minute):
    cursor.execute("""
        UPDATE timeslots
        SET available = CASE WHEN available = 1 THEN 0 ELSE 1 END
        WHERE hour = ?
          AND minute = ?
          AND scheduleID = (
                SELECT scheduleID
                FROM userSchedule
                WHERE userID = ?
                  AND scheduledate = ?
          )
    """, (hour, minute, userID, date))

    conn.commit()
    return cursor.rowcount


def getWaitList(timeslot_id):
    cursor.execute("""
        SELECT 
            pq.priorityNo,
            u.userID,
            u.name,
            u.email
        FROM priorityQueue pq
        JOIN users u ON pq.userID = u.userID
        WHERE pq.timeSlotID = ?
        ORDER BY pq.priorityNo ASC
    """, (timeslot_id,))

    results = []
    for row in cursor.fetchall():
        results.append({
            "priority": row[0],
            "user_id": row[1],
            "name": row[2],
            "email": row[3]
        })
    return results

def addWaitList(timeslot_id, user_id):
    cursor.execute("""
        SELECT MAX(priorityNo) FROM priorityQueue WHERE timeSlotID = ?
    """, (timeslot_id,))
    row = cursor.fetchone()
    current_max = row[0] if row[0] is not None else 0
    new_priority = current_max + 1

    cursor.execute("""
        INSERT INTO priorityQueue (timeSlotID, userID, priorityNo)
        VALUES (?, ?, ?)
    """, (timeslot_id, user_id, new_priority))
    conn.commit()

def freeSlotDB(timeSlotID):
    cursor.execute("""
        UPDATE timeslots
        SET available = 1, bookedByUserID = NULL
        WHERE timeSlotID = ?
    """, (timeSlotID,))
    conn.commit()
    return cursor.rowcount

def addAppointmentDB(timeslotID, userID):
    cursor.execute("""
        UPDATE timeslots 
        SET available = 0, bookedByUserID = ?
        WHERE timeSlotID = ?
    """, (userID, timeslotID))
    conn.commit()

def removeFromWaitlist(timeslot_id, user_id):
    cursor.execute("""
        DELETE FROM priorityQueue 
        WHERE timeSlotID = ? AND userID = ?
    """, (timeslot_id, user_id))
    conn.commit()

def isBooked(timeslotID):
    cursor.execute("""
        SELECT available 
        FROM timeslots 
        WHERE timeSlotID = ?
    """, (timeslotID,))
    row = cursor.fetchone()
    return row[0] == 0 

def getTimeslotID(user_id, date_str, hour, minute):
    cursor.execute("""
        SELECT ts.timeSlotID 
        FROM timeslots ts
        JOIN userSchedule us ON ts.scheduleID = us.scheduleID
        WHERE us.userID = ? 
          AND us.scheduleDate = ? 
          AND ts.hour = ? 
          AND ts.minute = ?
    """, (user_id, date_str, hour, minute))
    row = cursor.fetchone()
    return row[0]

def schedulerAlgorithm(userID,dateStr,hour,minute,appointingUserID):
    timeslotID =  getTimeslotID(userID, dateStr, hour, minute)
    if isBooked(timeslotID):
        addWaitList(timeslotID, appointingUserID)
    else:
        addAppointmentDB(timeslotID, appointingUserID)

def reSchedulerAlgorithm(userID, dateStr, timeStr):
    hour, minute = map(int, timeStr.split(":"))
    timeslotID = getTimeslotID(userID, dateStr, hour, minute)
    waitlist = getWaitList(timeslotID)

    if not waitlist:
        freeSlotDB(timeslotID)
    else:
        priorityUser = waitlist[0] # The one with lowest priorityNo
        priorityUserID = priorityUser['user_id']
        addAppointmentDB(timeslotID, priorityUserID)
        removeFromWaitlist(timeslotID, priorityUserID)

