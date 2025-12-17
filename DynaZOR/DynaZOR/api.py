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
        parser.add_argument('email', type=str, required=True, help='Email is required')
        parser.add_argument('name', type=str, required=True, help='Name is required')
        parser.add_argument('surname', type=str, required=True, help='Surname is required')
        parser.add_argument('username', type=str, required=True, help='Username is required')
        parser.add_argument('password', type=str, required=True, help='Password is required')
        
        args = parser.parse_args()
        
        # Check if user already exists
        if db.checkUserExist(args['username'], args['email']):
            abort(409, message="User already exists")
        
        try:
            full_name = f"{args['name']} {args['surname']}"
            db.createUser(full_name, args['username'], args['email'], args['password'])
            return {'message': 'User registered successfully'}, 201
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
          'name': user[1],
          'username': user[2],
          'email': user[3],
          'message': 'Login successful'
        }, 200


class Schedule(Resource):
    """Get user schedule"""
    def get(self, user_id):
        try:
            schedule = db.getSchedule(user_id)
            if not schedule:
                return {'message': 'No schedule found'}, 404
            
            # Format schedule for frontend
            formatted_schedule = []
            for date, timeslots in schedule:
                formatted_schedule.append({
                    'date': str(date),
                    'timeslots': [
                        {
                            'hour': ts[0],
                            'minute': ts[1],
                            'available': ts[2]
                        }
                        for ts in timeslots
                    ]
                })
            
            return {'schedule': formatted_schedule}, 200
        except Exception as e:
            abort(500, message=str(e))


class TimeSlot(Resource):
    """Mark a timeslot as available/unavailable"""
    def post(self, user_id):
        parser = reqparse.RequestParser()
        parser.add_argument('date', type=str, required=True, help='Date is required (YYYY-MM-DD)')
        parser.add_argument('hour', type=int, required=True, help='Hour is required')
        parser.add_argument('minute', type=int, required=True, help='Minute is required')
        
        args = parser.parse_args()
        
        try:
            db.freeSlotDB(user_id, args['date'], args['hour'], args['minute'])
            return {'message': 'Timeslot updated successfully'}, 200
        except Exception as e:
            abort(500, message=str(e))
