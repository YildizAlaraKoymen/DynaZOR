"""
The flask application package.
"""

from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from .api import Register, Login, Schedule, TimeSlot, User, Appointment

app = Flask(__name__)

# Allow frontend origin and preflight across all API routes
app.config["CORS_HEADERS"] = "Content-Type"
CORS(
	app,
	resources={r"/api/*": {"origins": "http://localhost:5173"}},
	supports_credentials=True,
	allow_headers=["Content-Type", "Authorization"],
	methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)

# Initialize Flask-RESTful API
api = Api(app)

# Register API endpoints
api.add_resource(Register, '/api/auth/register')
api.add_resource(Login, '/api/auth/login')
api.add_resource(Schedule, '/api/user/schedule/<int:user_id>')
api.add_resource(TimeSlot, '/api/user/timeslot/<int:user_id>')
api.add_resource(User, '/api/user/search/<string:username>')
api.add_resource(Appointment, '/api/user/appointment/<int:user_id>')
