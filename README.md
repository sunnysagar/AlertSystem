# PLC Data Anomaly Detection

## Overview
This project is a **FastAPI-based backend** that processes real-time **PLC (Programmable Logic Controller) data**, detects anomalies based on statistical calculations, and triggers alerts. It provides a **dashboard for visualization**, **email notifications**, **JWT authentication**, and **report generation**.

## Features
- **Real-time Data Processing**: Receives PLC data and checks for anomalies.
- **Anomaly Detection**: Uses statistical models to identify abnormal sensor values.
- **Alarm System**: Triggers alarms on detecting anomalies.
- **Dashboard**: Provides **graph visualization** of sensor data using React & Recharts.
- **JWT Authentication**: Secure access using JSON Web Tokens.
- **Report Generation**: Exports data and anomalies history.
- **History Tracking**: Stores anomalies in a database for future review.
- **Email Notifications**: Sends periodic email alerts for all sensor anomalies.

## Tech Stack
- **Backend**: FastAPI, Pandas, Pydantic, MongoDB
- **Frontend**: Vite + React, Recharts, Axios, JWTDecode
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB

## Installation & Setup
### Prerequisites
- Python 3.8+
- MongoDB database
- Node.js (for frontend setup)

### Backend Setup
1. **Clone the repository**
   ```sh
   git clone https://github.com/your-repo-name.git
   cd your-repo-name/backend
   ```
2. **Create a virtual environment**
   ```sh
   python -m venv venv
   source venv/bin/activate  # For macOS/Linux
   venv\Scripts\activate     # For Windows
   ```
3. **Install dependencies**
   ```sh
   pip install -r requirements.txt
   ```
4. **Set up environment variables** (create `.env` file)
   ```ini
   DATABASE_URL=postgresql://user:password@localhost:5432/plc_db
   JWT_SECRET=your_secret_key
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   ```
5. **Run the database migrations**
   ```sh
   alembic upgrade head
   ```
6. **Start the FastAPI server**
   ```sh
   uvicorn main:app --reload
   ```

### Frontend Setup
1. **Navigate to frontend directory**
   ```sh
   cd ../frontend
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Run the React app**
   ```sh
   npm run dev
   ```

## API Endpoints
### Authentication
- `POST /auth/register` → Register new user
- `POST /auth/login` → Get JWT token

### PLC Data & Anomalies
- `GET /data` → Fetch latest sensor data
- `POST /data` → Upload PLC data
- `GET /anomalies` → Get anomalies history
- `POST /anomalies/check` → Check for anomalies in real-time

### Reports & Notifications
- `GET /report` → Generate a report of anomalies
- `POST /email/send` → Trigger an email notification

## Database Schema
- **users** (id, username, email, password)
- **plc_data** (id, timestamp, sensor_id, value, status)
- **anomalies** (id, timestamp, sensor_id, anomaly_type, details)

## Email Notifications
- Scheduled email alerts for sensor anomalies at specific intervals.

## Future Enhancements
- AI/ML-based anomaly detection.
- Role-based access control.

## License
This project is open-source under the MIT License.

