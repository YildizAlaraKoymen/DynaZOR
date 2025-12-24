"""
The flask application package.
"""

from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from .api import AdminInitialize, Analytics, Profile, Register, Login, Schedule, TimeSlot, User, UserByID, Appointment, AdminAuth, AdminInitialize, AdminReset, AdminView, AdminBackup, AdminModify

app = Flask(__name__)
app.config['SECRET_KEY'] = "04KMGIRO4SF4fsrf"

# Allow frontend origin and preflight across all API routes
app.config["CORS_HEADERS"] = "Content-Type"
CORS(
	app,
	resources={r"/api/*": {"origins": [
    "http://localhost:5173", 
    "https://dyna-zor.vercel.app"
    ]}},
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
api.add_resource(UserByID, '/api/user/id/<int:user_id>')
api.add_resource(Appointment, '/api/user/appointment/<int:user_id>')
api.add_resource(Profile, '/api/user/profile/<int:user_id>')
api.add_resource(AdminAuth, '/api/admin/auth')
api.add_resource(AdminInitialize, '/api/admin/init')
api.add_resource(AdminReset, '/api/admin/reset')
api.add_resource(AdminView, '/api/admin/view')
api.add_resource(AdminBackup, '/api/admin/backup')
api.add_resource(AdminModify, '/api/admin/modify')
api.add_resource(Analytics, '/api/analytics/<int:user_id>')
