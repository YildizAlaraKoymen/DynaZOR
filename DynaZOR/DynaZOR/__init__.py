"""
The flask application package.
"""

from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from .api import Register, Login, Schedule, TimeSlot

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"]) #This is the port of frontend server

# Initialize Flask-RESTful API
api = Api(app)

# Register API endpoints
api.add_resource(Register, '/api/auth/register')
api.add_resource(Login, '/api/auth/login')
api.add_resource(Schedule, '/api/schedule/<int:user_id>')
api.add_resource(TimeSlot, '/api/timeslot/<int:user_id>')
