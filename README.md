# 🏥 HealthVault

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4facfe,100:00f2fe&height=180&section=header&text=HealthVault&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Personal%20Health%20Management%20Platform&descAlignY=60"/>

</div>

---

<div align="center">

🚀 **Live Application**

### 🔗 [https://health-vault-ruddy.vercel.app/](https://health-vault-ruddy.vercel.app/)

<br>

<a href="https://health-vault-ruddy.vercel.app/">
<img src="https://img.shields.io/badge/Live%20Demo-Visit%20HealthVault-00c853?style=for-the-badge&logo=vercel&logoColor=white"/>
</a>

<br><br>


</div>

---

# 🧠 Overview

**HealthVault** is a modern full-stack healthcare management platform designed to help users organize and track their medical information in one place.

The application provides tools for:

* 💊 managing medicines and dosage
* 📂 storing medical documents
* 📅 tracking health checkups
* 🚨 monitoring medicine stock alerts
* 🗺 finding nearby hospitals

All features are integrated into a **clean and intuitive dashboard interface**.

---

# ✨ Core Features

## 📊 Health Dashboard

The dashboard provides a quick overview of health data.

Features include:

* medicine statistics
* document insights
* quick access actions
* recent activity tracking

---

## 💊 Medicine Management

Track medicines efficiently and monitor stock levels.

Features include:

* dosage and frequency tracking
* automatic days remaining calculation
* quantity monitoring
* editing and deleting medicines

Status indicators:

🟢 Healthy
🟡 Low Stock
🔴 Critical

---

## 🚨 Smart Stock Alerts

The system automatically detects medicines that are running low.

Features include:

* refill recommendations
* quantity adjustment tools
* urgency sorting

---

## 📂 Document Vault

Securely store important medical documents.

Supported document types:

* lab reports
* prescriptions
* medical records

Capabilities include:

* cloud storage uploads
* document search
* quick preview

---

## 📅 Checkup Reminder System

Track scheduled health checkups and reminders.

Capabilities include:

* scheduling checkups
* doctor information tracking
* reminder intervals
* overdue alerts

---

## 🗺 Nearby Hospital Finder

Find nearby hospitals using an interactive map.

Features include:

* location detection
* distance calculation
* hospital ratings
* saving favorite hospitals

Powered by **OpenStreetMap and Leaflet**.

---

# ⚙ Tech Stack

<div align="center">

### Frontend

<img src="https://skillicons.dev/icons?i=react,vite,js,html,css" />

### Backend

<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />

### Tools

<img src="https://skillicons.dev/icons?i=git,github,vscode" />

</div>

---

# 🧩 System Architecture

```
React Frontend
     │
     ▼
Axios API Client
     │
     ▼
Express REST API
     │
     ▼
MongoDB Database
     │
     ▼
Cloudinary Storage
```

---

# 📂 Project Structure

```
HealthVault
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── styles
│   │   └── utils
│
└── README.md
```

---

# 📡 API Overview

## 🔐 Authentication

```
POST /api/auth/register
POST /api/auth/login
```

---

## 💊 Medicines

```
GET    /api/medicines
POST   /api/medicines
PUT    /api/medicines/:id
DELETE /api/medicines/:id
```

---

## 📂 Documents

```
GET    /api/documents
POST   /api/documents
DELETE /api/documents/:id
```

---

## 📅 Checkups

```
GET    /api/checkups
POST   /api/checkups
PUT    /api/checkups/:id
DELETE /api/checkups/:id
```

---

# ⚙ Installation

Clone the repository:

```
git clone https://github.com/yash5123/HealthVault.git
cd HealthVault
```

---

# 📦 Install Dependencies

### Backend

```
cd backend
npm install
```

### Frontend

```
cd frontend
npm install
```

---

# ▶ Run the Application

Start backend:

```
npm run dev
```

Start frontend:

```
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:5000
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **backend** folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```


# 👨‍💻 Author

**Yash Rai**

🔗 GitHub
[https://github.com/yash5123](https://github.com/yash5123)

---

# ⭐ Support

If you like this project, consider giving it a **star ⭐ on GitHub**.

---
