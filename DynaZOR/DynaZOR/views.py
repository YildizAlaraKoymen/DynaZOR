"""
Routes and views for the flask application.
"""

from DynaZOR import db
import pyodbc
from flask import *
from flask_cors import CORS
from DynaZOR import app
from dotenv import load_dotenv
import os
import secrets
from os import environ

load_dotenv()


@app.post("/api/auth/login")
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    row = db.checkUserLogin(email,password)
    if row:
        token = secrets.token_hex(32)
        return jsonify({"success": True, "token": token, "message": "Login Successful"})
    else:
        return jsonify({"success": False, "message": "Login Failed"})


@app.post("/api/user/add")
def register():
    data = request.get_json()
    name = data.get("name")
    surname = data.get("surname")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    name = (name + " " + surname)

    row = db.checkUserExist(username,email)
    if row:
        return jsonify({"success": False, "message": "Username or email has already been registered"})
    else:
        db.createUser(name,username,email,password)
        return jsonify({"success": True, "message": "User is registered successfully"})