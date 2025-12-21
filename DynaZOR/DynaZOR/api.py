"""
REST API resources for DynaZOR.
Defines all endpoints for user authentication, registration, and schedule management.
"""

from flask_restful import Resource, reqparse, abort
from flask import request
from . import db
from datetime import datetime, timedelta


class Register(Resource):
    """Handle user registration"""
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('surname', type=str, required=True)
        parser.add_argument('username', type=str, required=True)
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        
        args = parser.parse_args()
        
        # Check if user already exists
        if db.checkUserExist(args['username'], args['email']):
            abort(409, message="User already exists")
        
        try:
            full_name = f"{args['name']} {args['surname']}"
            db.createUser(full_name, args['username'], args['email'], args['password'])
            
            # Get the newly created user's ID
            userID = db.getUserID(args['username'])
            
            return {
                'message': 'User registered successfully',
                'userID': userID
            }, 201
        except Exception as e:
            abort(500, message=str(e))


class Login(Resource):
    """Handle user login"""
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True, help='Email is required')
        parser.add_argument('password', type=str, required=True, help='Password is required')
        
        args = parser.parse_args()
        
        user = db.checkUserLogin(args['email'], args['password'])
        if user is None:
          abort(401, message="Invalid email or password")

        return {
          'userID': user[0],
          'message': 'Login successful'
        }, 200


class Schedule(Resource):
    """Get or create user schedule"""
    def get(self, user_id):
        try:
            from datetime import datetime
            today = datetime.now().date()
            
            # Check if user has a schedule for today
            db.cursor.execute("""
                SELECT scheduleID FROM userSchedule
                WHERE userID=? AND scheduleDate=?
            """, (user_id, today))
            existing = db.cursor.fetchone()
            
            # Create if doesn't exist
            if not existing:
                db.createSchedule(user_id, today)
            
            schedule = db.getSchedule(user_id)
            return {'schedule': schedule}, 200
        except Exception as e:
            abort(500, message=str(e))

    def post(self, user_id):
        """
        Create an empty schedule day for the user.
        Expects: { "scheduleDate": "YYYY-MM-DD" }
        """
        parser = reqparse.RequestParser()
        parser.add_argument('scheduleDate', type=str, required=True, help='scheduleDate is required (YYYY-MM-DD)')
        args = parser.parse_args()

        try:
            # Parse and validate date
            schedule_date = datetime.strptime(args['scheduleDate'], '%Y-%m-%d').date()
        except ValueError:
            abort(400, message="scheduleDate must be in format YYYY-MM-DD")

        try:
            schedule_id = db.createSchedule(user_id, schedule_date)
            return {
                'scheduleID': schedule_id,
                'message': 'Schedule created'
            }, 201
        except Exception as e:
            abort(500, message=str(e))

class TimeSlot(Resource):
    """Toggle a timeslot between available/unavailable"""
    def post(self, user_id):
        parser = reqparse.RequestParser()
        parser.add_argument('date', type=str, required=True, help='Date is required (YYYY-MM-DD)')
        parser.add_argument('hour', type=int, required=True, help='Hour is required')
        parser.add_argument('minute', type=int, required=True, help='Minute is required')
        
        args = parser.parse_args()
        
        try:
            db.toggleSlotDB(user_id, args['date'], args['hour'], args['minute'])
            return {'message': 'Timeslot toggled successfully'}, 200
        except Exception as e:
            abort(500, message=str(e))

class User(Resource):
    def get(self, username):
        try:
          user_id = db.getUserID(username)
          if user_id is None:
                abort(404, message="User not found")
          return {'userID': user_id}, 200
        except Exception as e:
            abort(500, message=str(e))


class UserByID(Resource):
    """Get user details by user ID"""
    def get(self, user_id):
        try:
            cursor = db.cursor
            cursor.execute("SELECT userID, name, username, email FROM users WHERE userID = ?", (user_id,))
            row = cursor.fetchone()
            if row is None:
                abort(404, message="User not found")
            return {
                'userID': row[0],
                'name': row[1],
                'username': row[2],
                'email': row[3]
            }, 200
        except Exception as e:
            abort(500, message=str(e))


class Appointment(Resource):
    """Submit up to 3 timeslot selections for a user (viewer)"""
    #CHANGE THE ALGORITHM AS NEEDED
    def post(self, user_id):
        payload = request.get_json(force=True) or {}
        selections = payload.get('selections', [])

        if not isinstance(selections, list) or not selections:
            abort(400, message="selections must be a non-empty array")
        if len(selections) > 3:
            abort(400, message="You can select at most 3 timeslots")

        booked = []
        for sel in selections:
            try:
                date = sel.get('date')
                hour = int(sel.get('hour'))
                minute = int(sel.get('minute'))
            except Exception:
                abort(400, message="Each selection must include date (YYYY-MM-DD), hour, minute")

            # Book the slot (viewer requests translate to booking for simplicity)
            try:
                #TODO: ADD THE BOOKING ALGORITHM HERE
                #db.bookSlotDB(user_id, date, hour, minute)
                booked.append({'date': date, 'hour': hour, 'minute': minute})
            except Exception as e:
                abort(500, message=str(e))

        return { 'message': 'Appointment submitted', 'booked': booked }, 200
    
