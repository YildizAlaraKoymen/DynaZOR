"""
This script runs the DynaZOR application using a development server.
"""

from dotenv import load_dotenv
import pyodbc
import os
from os import environ
from DynaZOR import app


if __name__ == '__main__':
    HOST = environ.get('SERVER_HOST', 'localhost')
    try:
        PORT = int(environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555


load_dotenv()

try:
    conn = pyodbc.connect(
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={os.getenv('SQLSERVER_HOST')};"
        f"DATABASE={os.getenv('SQLSERVER_DB')};"
        f"UID={os.getenv('SQLSERVER_USER')};"
        f"PWD={os.getenv('SQLSERVER_PASS')}",
    )
    cursor = conn.cursor()
    cursor.execute("SELECT GETDATE()") # test
    result = cursor.fetchone()
    print("Connection successful!", result[0])
except Exception as e:
    print("Connection failed:", e)

app.run(HOST, PORT)
