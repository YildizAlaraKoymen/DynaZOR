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
        scheduleID INT FOREIGN KEY REFERENCES userSchedule(scheduleID),
        hour INT,
        minute INT,
        available INT
    );
    """)
    conn.commit()


def getUserID(username):
    cursor.execute("SELECT userID FROM users WHERE username=?", (username,))
    row = cursor.fetchone()
    return row[0] if row else None


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
        ORDER BY scheduleDate
    """, (userID,))
    days = cursor.fetchall()

    schedule = []

    for scheduleID, scheduleDate in days:
        cursor.execute("""
            SELECT hour, minute, available FROM timeslots
            WHERE scheduleID=? ORDER BY hour, minute
        """, (scheduleID,))
        timeSlots = cursor.fetchall()
        schedule.append((scheduleDate, timeSlots))

    return schedule

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


