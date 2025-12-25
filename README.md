# DynaZOR
## DynaZOR is a cloud-based scheduling and rendezvous system designed to automate appointment management between users. The goal is to eliminate manual scheduling errors and reduce communication delays by using AWS services for storing data and notifications.

## 📬 Contacts

- 👩‍💻 **Yıldız Alara Köymen**  
  📧 e245338@metu.edu.tr

- 👨‍💻 **Burak Mirac Dumlu**  
  📧 e258494@metu.edu.tr

- 👨‍💻 **Emir Canlı**  
  📧 e263754@metu.edu.tr

## Technologies:

### Backend:

Python – Core programming language [![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff)](#)

Flask / Flask RESTful – REST API framework [![Flask](https://img.shields.io/badge/Flask-000?logo=flask&logoColor=fff)](#)

pyodbc – Database connectivity

Docker – Containerization for deployment [![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](#)

AWS SNS – Email notification service [![AWS](https://custom-icon-badges.demolab.com/badge/AWS-%23FF9900.svg?logo=aws&logoColor=white)](#)

### Frontend: 

React – User interface library [![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)

Vite – Frontend build tool [![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)

Tailwind CSS – Utility first styling [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)

React Router – Client side routing [![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)](#)

### Database:

Microsoft SQL Server [![Microsoft SQL Server](https://custom-icon-badges.demolab.com/badge/Microsoft%20SQL%20Server-CC2927?logo=mssqlserver-white&logoColor=white)](#)

### Deployment & Cloud
Amazon RDS (Relational Database Service) - Cloud database

Render – Backend hosting 

Vercel – Frontend hosting [![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)](#)

GitHub – Source control and CI integration [![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?logo=github&logoColor=white)](#)

## Directory structure 

DynaZOR/  
├─ DynaZOR/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Backend root  
│  ├─ app.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Backend entry point  
│  ├─ Dockerfile  
│  ├─ DynaZOR/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Backend application package  
│  │  ├─ api.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # REST API endpoints and routing  
│  │  ├─ db.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Database access layer  
│  │  ├─ __init__.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # App initialization and configuration  
│  │  └─ ...  
│  └─ ...  
│  
├─ frontend/  
│  └─ DynaZOR/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Frontend application root  
│     ├─ src/  
│     │  ├─ apis/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # API client wrappers  
│     │  ├─ assets/  
│     │  ├─ components/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Reusable UI components  
│     │  ├─ hooks/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Custom React hooks  
│     │  ├─ pages/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Page level components  
│     │  └─ ...  
│     └─ ...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Vite config, public assets, etc.  
│  
└─ README.md  
  
## How to use:

### You can use the application with this link: https://dyna-zor.vercel.app

However, if you want to run it locally:
1) Downlaod all the required libaries both for backend and frontend
2) Run the backend server (app.py will be the main py file) python /.app for example.
3) Run the frontend server (execute "npm run dev" on frontend folder [.../DynaZOR/frontend/DynaZOR])
Note: Frontend server is the main web server to browse pages, while backend server is opened to apply logic.

# frontend of DynaZOR
The frontend is built using Vite, React, Tailwind CSS, and communicates with the backend through Axios based API functions.

## UI walkthrough:

### Home page

<img width="2399" height="1342" alt="image" src="https://github.com/user-attachments/assets/d5b9e0e2-6678-49b6-a708-e5e65cdede26" />

### User Login

<img width="2389" height="1323" alt="image" src="https://github.com/user-attachments/assets/b8453641-75e4-4d02-9d68-34e394651b84" />

The login component has the necessary error handling such as required fields.

-> User can route to register page if they click the Register link.

<img width="312" height="68" alt="image" src="https://github.com/user-attachments/assets/2178db40-6a03-4299-8d95-c7f02fb5c7e3" />

### User Registration

<img width="2388" height="1323" alt="image" src="https://github.com/user-attachments/assets/50a7218e-1452-497e-9b31-d2be4e1f4246" />

The register component has the necessary error handling such as required fields, the backend gives a 409 error if user already exists.

-> User can route to login page if they click the Login link.

<img width="319" height="66" alt="image" src="https://github.com/user-attachments/assets/61134462-03bf-49fe-9af0-4430df4843bc" />

### Dashboard:

<img width="2329" height="1331" alt="image" src="https://github.com/user-attachments/assets/13a78857-d1d4-486e-b812-928f166c94a5" />

### Analytics:

<img width="2372" height="1339" alt="image" src="https://github.com/user-attachments/assets/e4b3fd5a-f28e-4229-9969-6a8c5a5e663a" />

### Manage profile:

<img width="2364" height="1339" alt="image" src="https://github.com/user-attachments/assets/ae0490c7-b058-42aa-9a57-1c3efa282bde" />

### Daily Schedule view with clickable schedule cells:

<img width="2367" height="1341" alt="image" src="https://github.com/user-attachments/assets/18ce071b-ade8-4eca-aa67-ad24875a8754" />

User can toggle the availabilty of the slots by clicking the cells. 

### Making an appointment:

<img width="1996" height="166" alt="image" src="https://github.com/user-attachments/assets/5d97aa43-fe1d-4268-b838-8a4ee0d5c8de" />

When this button is cliked the user is asked the username of the user they wish to get an appointment from. This component also has the necessary error handling such as making sure the username exists. 

<img width="1928" height="306" alt="image" src="https://github.com/user-attachments/assets/92873d6d-9060-478c-bc36-7536ebf2aad2" />

<img width="2355" height="1323" alt="image" src="https://github.com/user-attachments/assets/f36d6216-1847-42ff-a298-5e08f0c0ca82" />

When the user submits the username theyre routed to the schedule of the user they wished to take the appointment from. They can select and submit at most 3 available timeslots for the backend algorithm to calculate and give response with the best booking time.

<img width="2276" height="1304" alt="image" src="https://github.com/user-attachments/assets/1dabbd60-b255-4f1f-9250-5599ee97761d" />

# Backend of the DynaZOR:

The backend is built using Python and Flask micro framework, on Visual Studio.
Its main purpose is to maintain the data in the Microsoft SQL Server cloud database that is on the Amazon RDS cloud service, recieve and process the request of the frontend (such as login info, or registeration process) and basically handle the communication between the frontend and the cloud database without any problems.

## 1. Appointment Algorithm Explanation:

When a viewer submits up to 3 available timeslot selections on an owner's schedule, the system processes each selection through the schedulerAlgorithm: it first checks if the slot is free (available=1 and not already booked); if free, it books the appointment by calling addAppointmentDB(), which sets the slot as booked on the owner's schedule with bookedByUserID=viewerID and mirrors the booking on the viewer's schedule with available=0 and bookedByUserID=ownerID, then updates appointment statistics for analytics. If the slot is already booked or the viewer is already in the waitlist, the request is rejected with an appropriate error. If the slot is booked but the viewer is not yet queued, they are added to the priorityQueue with a priority number based on queue position. When the owner later cancels the appointment or toggles the slot free, reSchedulerAlgorithm() is triggered, which iterates through the waitlist in priority order, checks each queued user's availability, and automatically promotes the first eligible user by booking them, removing them from the queue, and sending them a notification email that ensures the next person in line gets the appointment without manual intervention.

## 2. ReScheduler Algorithm (Automatic Waitlist Promotion):
   
Triggered when an appointment is freed (owner cancels, toggles slot, or viewer cancels). Iterates through the priority queue in order, validates each queued user's availability on their own schedule, automatically promotes the first eligible user by booking them, removes them from the queue, and sends a confirmation email. Cleans up ineligible entries (users who are no longer available or already booked elsewhere).

## 4. Analytics Update Algorithm (Appointment Stats Tracking):
   
Records booking frequency per owner-booker-timeslot combination. Increments bookingCount whenever an appointment is confirmed, enabling the system to identify most frequent slots and top bookers for insights on user behavior and scheduling patterns.

## 5. Most Frequent Slot Detection Algorithm (Analytics)
   
Queries the appointmentStats table to find the timeslot (hour:minute) where a user has the most confirmed bookings, used to recommend optimal scheduling times to bookers.

## 6. Schedule Generation Algorithm (Daily Timeslot Creation)
   
Automatically creates 14 default timeslots (08:00–17:45 in 45-minute intervals) for each user when a new schedule day is initialized, ensuring consistent availability structure across all users. This can be scaled where the user is prompted between which hours they want to create their schedule.
