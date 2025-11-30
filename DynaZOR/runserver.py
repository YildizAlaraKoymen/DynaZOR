"""
This script runs the DynaZOR application using a development server.
"""

import os
from os import environ
from DynaZOR import app


if __name__ == '__main__':
    HOST = "localhost"
    PORT = 5555



app.run(HOST, PORT)
