"""
REST API resources for DynaZOR.
Defines all endpoints for user authentication, registration, and schedule management.
"""

from flask_restful import Resource, reqparse, abort
from flask import request, session, current_app
from . import db
from datetime import datetime, timedelta, date
import os
import boto3

TOPIC_ARN = os.getenv('SNS_TOPIC_ARN')
sns_client = boto3.client("sns",region_name=os.getenv("AWS_REGION"))

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
            sns_client.subscribe(TopicArn=TOPIC_ARN, Protocol="email", Endpoint=args['email']) # subscribing to SNS
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
        username = db.getUsernameByID(user_id)
        parser.add_argument('date', type=str, required=True, help='Date is required (YYYY-MM-DD)')
        parser.add_argument('hour', type=int, required=True, help='Hour is required')
        parser.add_argument('minute', type=int, required=True, help='Minute is required')
        
        args = parser.parse_args()

        try:
            db.toggleSlotDB(user_id, args['date'], args['hour'], args['minute'])

            chosenTimeslotID = db.getTimeslotID(user_id, args['date'], args['hour'], args['minute'])
            cancelled_booker_id = db.isBooked(chosenTimeslotID)
            if (cancelled_booker_id):
                cancelled_booker_email = db.getEmailByUserID(cancelled_booker_id)
                sns_client.publish(
                    TopicArn=TOPIC_ARN, 
                    Message=f"Your appointment with {username} on {args['date']} at {args['hour']:02d}:{args['minute']:02d} has been cancelled by the owner.",
                    Subject="Appointment Cancelled",
                    MessageAttributes={
                        'target_email': {
                        'DataType': 'String',
                        'StringValue': cancelled_booker_email
                        }
                    }
                )

                cancelled_waitlist = db.getWaitList(chosenTimeslotID)
                for i in cancelled_waitlist:
                    db.removeFromWaitlist(chosenTimeslotID,i['user_id'])
                    sns_client.publish(
                        TopicArn=TOPIC_ARN, 
                        Message=f"You are no longer waiting in the queue for appointment with {username} on {args['date']} at {args['hour']:02d}:{args['minute']:02d}, appointment slot has been removed by the owner.",
                        Subject="Appointment Queue Cancelled",
                        MessageAttributes={
                            'target_email': {
                            'DataType': 'String',
                            'StringValue': i['email']
                            }
                        }
                    )                    

                db.freeSlotDB(chosenTimeslotID)

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
    def post(self, user_id):
        payload = request.get_json(force=True) or {}
        selections = payload.get('selections', [])
        booker_id = payload.get("bookerID")

        if not booker_id:
            abort(400, message="bookerID is required")
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

            # Ensure the booker's own schedule is free for the requested slot
            is_available = db.checkOwnAvailability(booker_id, hour, minute, date)
            selectedTimeslotID = db.getTimeslotID(user_id, date, hour, minute)
            if not is_available:
                abort(400, message=f"Your schedule is not available for timeslot {hour:02d}:{minute:02d}")
            try:
                if db.isInWaitlist(booker_id,selectedTimeslotID):
                    abort(400, message=f"Your are already in the waitlist for timeslot {hour:02d}:{minute:02d}")
                db.schedulerAlgorithm(user_id, date, hour, minute, booker_id)
                booked.append({'date': date, 'hour': hour, 'minute': minute})
            except Exception as e:
                abort(500, message=str(e))
        return { 'message': 'Appointment submitted', 'booked': booked }, 200

    def delete(self, user_id):
        username = db.getUsernameByID(user_id)
        payload = request.get_json(force=True) or {}
        selections = payload.get('selections', [])
        booker_id = payload.get("bookerID")

        if not booker_id:
            abort(400, message="bookerID is required")
        if not isinstance(selections, list) or not selections:
            abort(400, message="selections must be a non-empty array")

        canceled = []
        for sel in selections:
            try:
                date = sel.get('date')
                hour = int(sel.get('hour'))
                minute = int(sel.get('minute'))
            except Exception:
                abort(400, message="Each selection must include date (YYYY-MM-DD), hour, minute")

            try:
                db.reopenSlotForBooker(booker_id,date,hour,minute)
                waitingUserEmail = db.reSchedulerAlgorithm(user_id,date,hour,minute)
                canceled.append({'date': date, 'hour': hour, 'minute': minute})
                if (waitingUserEmail):
                    sns_client.publish(
                        TopicArn=TOPIC_ARN, 
                        Message=f"A spot for the appointment with {username} opened up on {date} at {hour:02d}:{minute:02d}!",
                        Subject="Appointment Rescheduled",
                        MessageAttributes={
                            'target_email': {
                                'DataType': 'String',
                                'StringValue': waitingUserEmail
                            }
                        }
                    )
            except Exception as e:
                abort(500, message=str(e))

        return { 'message': 'Appointment canceled', 'canceled': canceled }, 200
    

class Analytics(Resource):
    def get(self, user_id):
        try:
            frequent_slot = db.getMostFrequentSlotOfUser(user_id)
            formatted_slot = ""
            if frequent_slot:
                h,m = frequent_slot[0], frequent_slot[1]
                formatted_slot = f"{h:02d}:{m:02d}"

            top_bookers = db.getTopBookers(user_id)
            bookers_list = []
            if top_bookers:
                for i in top_bookers:
                    bookers_list.append({"name": i[0], "count": i[1]})

            return {
                "frequent_hour": formatted_slot,
                "top_bookers": bookers_list
            },200

        except Exception as e:
            abort(500, message=str(e))


class Profile(Resource):
    """Update basic profile fields for the current user"""
    def put(self, user_id):
        payload = request.get_json(force=True) or {}
        name = payload.get("name")
        username = payload.get("username")
        email = payload.get("email")

        if not any([name, username, email]):
            abort(400, message="Provide at least one of name, username, or email")

        try:
            success = db.updateUser(user_id, name=name, username=username, email=email)
            if not success:
                abort(500, message="Failed to update profile")
            return {"message": "Profile updated"}, 200
        except Exception as e:
            abort(500, message=str(e))

class AdminAuth(Resource):
    """Authenticate admin with password"""
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('password', type=str, required=True, help='Password is required')
        args = parser.parse_args()
        
        # Check admin credentials in database
        admin = db.checkAdminLogin('admin', args['password'])
        
        if admin:
            return {'message': 'Admin authenticated successfully'}, 200
        else:
            abort(401, message="Invalid admin password")


class AdminInitialize(Resource):
    """Initialize or reset the database with admin authentication"""
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('password', type=str, required=True, help='Password is required')
        args = parser.parse_args()
        
        # Verify admin credentials
        admin = db.checkAdminLogin('admin', args['password'])
        if not admin:
            abort(401, message="Invalid admin password")
        
        try:
            db.createTables()
            return {'message': 'Database initialized successfully'}, 200
        except Exception as e:
            abort(500, message=f"Initialization failed: {str(e)}")


class AdminReset(Resource):
    """Reset the database with admin authentication"""
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('password', type=str, required=True, help='Password is required')
        args = parser.parse_args()
        
        # Verify admin credentials
        admin = db.checkAdminLogin('admin', args['password'])
        if not admin:
            abort(401, message="Invalid admin password")
        
        try:
            db.createTables()
            return {'message': 'Database reset successfully'}, 200
        except Exception as e:
            abort(500, message=f"Reset failed: {str(e)}")


class AdminView(Resource):
    """View all users and their information with admin authentication"""
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('password', type=str, required=True, help='Password is required')
        args = parser.parse_args()
        
        # Verify admin credentials
        admin = db.checkAdminLogin('admin', args['password'])
        if not admin:
            abort(401, message="Invalid admin password")
        
        try:
            rows = db.getAllUsersInfo()
            user_list = []
            for row in rows:
                user_id = row[0]
                user_bookings = db.getUserBookings(user_id)
                # Convert booking rows to serializable format
                bookings_list = [
                    {
                        'date': str(booking[0]),
                        'hour': booking[1],
                        'minute': booking[2],
                        'owner_name': booking[3]
                    } for booking in user_bookings
                ]
                user_list.append({
                    'userID': row[0],
                    'name': row[1],
                    'username': row[2],
                    'email': row[3],
                    'bookings': bookings_list,
                    'booking_count': len(bookings_list)
                })
            
            # Get schedules
            db.cursor.execute("SELECT scheduleID, userID, scheduleDate FROM userSchedule ORDER BY scheduleDate DESC")
            schedule_rows = db.cursor.fetchall()
            schedules_list = []
            for sched in schedule_rows:
                # Get username for display
                db.cursor.execute("SELECT username FROM users WHERE userID = ?", (sched[1],))
                username_row = db.cursor.fetchone()
                schedules_list.append({
                    'scheduleID': sched[0],
                    'userID': sched[1],
                    'username': username_row[0] if username_row else 'Unknown',
                    'date': str(sched[2])
                })
            
            # Get timeslots (limited to avoid overwhelming response)
            db.cursor.execute("SELECT TOP 100 timeSlotID, scheduleID, hour, minute, available, bookedByUserID FROM timeslots ORDER BY scheduleID DESC")
            timeslot_rows = db.cursor.fetchall()
            timeslots_list = [
                {
                    'timeSlotID': ts[0],
                    'scheduleID': ts[1],
                    'hour': ts[2],
                    'minute': ts[3],
                    'available': ts[4],
                    'bookedByUserID': ts[5]
                } for ts in timeslot_rows
            ]

            # appointment stats snapshot
            db.cursor.execute("SELECT ownerUserID, bookerUserID, hour, minute, bookingCount FROM appointmentStats")
            stats_rows = db.cursor.fetchall()
            stats_list = [
                {
                    'ownerUserID': s[0],
                    'bookerUserID': s[1],
                    'hour': s[2],
                    'minute': s[3],
                    'bookingCount': s[4]
                } for s in stats_rows
            ]
            
            return {
                'user_count': len(user_list),
                'users': user_list,
                'schedules': schedules_list,
                'timeslots': timeslots_list,
                'appointment_stats': stats_list,
                'message': 'Database view retrieved successfully'
            }, 200
        except Exception as e:
            abort(500, message=f"View failed: {str(e)}")


class AdminBackup(Resource):
    """Backup the database with admin authentication"""
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('password', type=str, required=True, help='Password is required')
        args = parser.parse_args()
        
        # Verify admin credentials
        admin = db.checkAdminLogin('admin', args['password'])
        if not admin:
            abort(401, message="Invalid admin password")
        
        try:
            backup_data = db.backupDatabase()
            if backup_data is None:
                abort(500, message="Backup failed")
            
            # Convert Row objects to serializable format, handling date objects
            def serialize_value(value):
                """Convert non-JSON-serializable types to strings"""
                if isinstance(value, date):
                    return str(value)
                elif isinstance(value, datetime):
                    return value.isoformat()
                else:
                    return value
            
            serializable_backup = {}
            for table_name, rows in backup_data.items():
                serializable_backup[table_name] = [
                    tuple(serialize_value(val) for val in row) for row in rows
                ]
            
            return {
                'message': 'Database backed up successfully',
                'backup': serializable_backup
            }, 200
        except Exception as e:
            abort(500, message=f"Backup failed: {str(e)}")


class AdminModify(Resource):
    """Modify user information or delete users with admin authentication"""
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('password', type=str, required=True, help='Password is required')
        parser.add_argument('action', type=str, required=True, help='Action is required (update, delete)')
        parser.add_argument('userID', type=int, required=True, help='User ID is required')
        parser.add_argument('name', type=str)
        parser.add_argument('username', type=str)
        parser.add_argument('email', type=str)
        args = parser.parse_args()
        
        # Verify admin credentials
        admin = db.checkAdminLogin('admin', args['password'])
        if not admin:
            abort(401, message="Invalid admin password")
        
        try:
            if args['action'] == 'update':
                success = db.updateUser(
                    args['userID'],
                    name=args.get('name'),
                    username=args.get('username'),
                    email=args.get('email')
                )
                if success:
                    return {'message': 'User updated successfully'}, 200
                else:
                    abort(500, message="Failed to update user")
            
            elif args['action'] == 'delete':
                success = db.deleteUser(args['userID'])
                if success:
                    return {'message': 'User deleted successfully'}, 200
                else:
                    abort(500, message="Failed to delete user")
            
            else:
                abort(400, message="Invalid action. Use 'update' or 'delete'")
        
        except Exception as e:
            abort(500, message=f"Modify failed: {str(e)}")