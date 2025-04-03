# Industrial Data Monitoring

## Overview
This project provides a backend service for real-time monitoring and anomaly detection of industrial sensors using **FastAPI** and **MongoDB**. The system collects data from **PLCs (Programmable Logic Controllers)**, performs anomaly detection using statistical calculations, triggers alarms, and provides real-time visualizations via a **React + Vite frontend**.

## Features
- **Real-time Data Ingestion** from PLCs
- **Anomaly Detection** with threshold-based statistics
- **Alarm System** triggered by anomalies
- **User Authentication** using JWT
- **Graph Visualization** with Recharts (via React frontend)
- **Report Generation** for anomalies
- **Historical Data Storage** for anomaly review
- **Email Notifications** for anomalies at scheduled intervals

---

## Technologies Used
### Backend
- **FastAPI** - High-performance web framework
- **MongoDB** - NoSQL database for storing sensor data
- **Pandas** - Data processing and statistical analysis
- **JWT (JSON Web Tokens)** - Authentication mechanism
- **Celery & Redis** - Asynchronous task processing (for scheduled email notifications)

### Frontend
- **React + Vite** - Modern frontend framework
- **Recharts** - Data visualization
- **JWT-Decode** - Authentication handling
- **Axios** - API requests

---

## Installation
### Prerequisites
- **Python 3.9+**
- **MongoDB** (Local or Cloud)
- **Redis** (For Celery task scheduling)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-repo/fastapi-monitoring.git
cd fastapi-monitoring
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables
Create a `.env` file and add the following:
```env
MONGO_URI=mongodb://localhost:27017/your_db_name
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.your-email.com
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
REDIS_URL=redis://localhost:6379/0
```

### Step 4: Run the Backend
```bash
uvicorn app.main:app --reload
```

### Step 5: Start Celery Worker (For Email Notifications)
```bash
celery -A app.tasks worker --loglevel=info
```

### Step 6: Start the Frontend (if applicable)
```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints
### Authentication
- **`POST /auth/login`** - Login with credentials and receive a JWT token
- **`POST /auth/register`** - Register a new user

### Sensor Data
- **`GET /sensors/{sensor_id}`** - Fetch real-time sensor data
- **`POST /sensors/data`** - Upload sensor data manually (for testing)

### Anomaly Detection
- **`GET /anomalies/history`** - View historical anomalies
- **`POST /anomalies/check`** - Run anomaly detection on new data

### Notifications
- **`POST /notifications/send`** - Manually trigger an email alert

---

## Database Schema (MongoDB)
### Users Collection
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "password": "hashed-string",
  "created_at": "timestamp"
}
```

### Sensor Data Collection
```json
{
  "_id": "ObjectId",
  "sensor_id": "string",
  "timestamp": "timestamp",
  "value": "float",
  "status": "normal | anomaly"
}
```

### Anomalies Collection
```json
{
  "_id": "ObjectId",
  "sensor_id": "string",
  "timestamp": "timestamp",
  "anomaly_type": "string",
  "resolved": "boolean"
}
```

---

## Future Enhancements
- AI-based anomaly detection using Machine Learning
- WebSockets for real-time updates
- Role-based access control (RBAC)
- Mobile app integration

## License
MIT License

---

For any queries, feel free to contribute or raise an issue! 🚀

