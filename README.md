# 🏥 HealthVault

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4facfe,100:00f2fe&height=180&section=header&text=HealthVault&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Personal%20Health%20Management%20Platform&descAlignY=60"/>

</div>

---

<div align="center">

<img src="https://img.shields.io/github/stars/yash5123/HealthVault?style=for-the-badge&logo=github">
<img src="https://img.shields.io/github/forks/yash5123/HealthVault?style=for-the-badge&logo=github">
<img src="https://img.shields.io/github/license/yash5123/HealthVault?style=for-the-badge">
<img src="https://img.shields.io/github/last-commit/yash5123/HealthVault?style=for-the-badge">

</div>

---

# 🧠 Overview

**HealthVault** is a modern full-stack application that helps users manage and organize their health information in a single place.

The platform provides tools to:

* 💊 manage medicines and dosage
* 📂 store medical documents
* 📅 track health checkups
* 🚨 monitor medicine stock alerts
* 🗺 find nearby hospitals

All features are integrated inside a **clean dashboard interface**.

---

# ✨ Core Features

### 📊 Health Dashboard

* overview of medicines and documents
* recent activity insights
* quick access actions

---

### 💊 Medicine Management

Track medicines efficiently.

Features include:

* dosage & frequency tracking
* automatic days remaining calculation
* quantity monitoring
* edit & delete medicines

Status indicators:

🟢 Healthy
🟡 Low Stock
🔴 Critical

---

### 🚨 Smart Stock Alerts

Automatically detects medicines running low.

Includes:

* refill recommendations
* quantity adjustment tools
* urgency sorting

---

### 📂 Document Vault

Store medical documents securely.

Supported types:

* lab reports
* prescriptions
* medical records

Features:

* cloud storage uploads
* document search
* quick preview

---

### 📅 Checkup Reminder System

Track health visits and reminders.

Capabilities:

* schedule checkups
* doctor information
* reminder intervals
* overdue tracking

---

### 🗺 Nearby Hospital Finder

Discover hospitals using map-based search.

Features:

* detect location
* distance calculation
* hospital ratings
* save favorite hospitals

Powered by **OpenStreetMap + Leaflet**.

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

### 🔐 Authentication

```
POST /api/auth/register
POST /api/auth/login
```

---

### 💊 Medicines

```
GET    /api/medicines
POST   /api/medicines
PUT    /api/medicines/:id
DELETE /api/medicines/:id
```

---

### 📂 Documents

```
GET    /api/documents
POST   /api/documents
DELETE /api/documents/:id
```

---

### 📅 Checkups

```
GET    /api/checkups
POST   /api/checkups
PUT    /api/checkups/:id
DELETE /api/checkups/:id
```

---

# ⚙ Installation

Clone the repository

```
git clone https://github.com/yash5123/HealthVault.git
cd HealthVault
```

Install dependencies

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

Start backend

```
npm run dev
```

Start frontend

```
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

Backend runs on

```
http://localhost:5000
```

---

# 🔑 Environment Variables

Create `.env` inside **backend**

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# 📊 GitHub Stats

<div align="center">

<img src="https://github-readme-stats.vercel.app/api?username=yash5123&show_icons=true&theme=tokyonight">

</div>

---

# 👨‍💻 Author

**Yash Rai**

GitHub
[https://github.com/yash5123](https://github.com/yash5123)

---

# ⭐ Support

If you like this project, consider giving it a **star ⭐ on GitHub**.
