# JobPortal - Full-Stack Career Platform

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

A modern, responsive full-stack Job Portal platform featuring role-based access control (Candidates, Recruiters, and Administrators), resume uploading, real-time status tracking, recruiter analytics, and an integrated Server-Side Rendered (SSR) Admin management desk.

---

## Architecture & Tech Stack

* **Frontend**: React.js 19 (Vite) + React Router v7 + Axios + Lucide Icons + Bootstrap 5
* **Backend**: Node.js + Express.js REST API
* **Database**: MongoDB with Mongoose ODM
* **Authentication**: JWT (JSON Web Tokens) with HTTP Authorization headers + bcryptjs password hashing
* **File Handling**: Multer for PDF resume uploads and validated streaming
* **Admin Desk**: Server-Side Rendered (SSR) views with EJS

---

## Key Features

### 1. Candidates / Students
* **Authentication**: Secure registration and login with encrypted credentials.
* **Job Discovery**: Full-text job search (by title or company) and filtering by location, workplace type, and employment type.
* **Save Jobs**: Bookmark and manage saved job openings.
* **Direct Application**: Apply directly with PDF resume uploads.
* **Application Tracker**: Track submission status (`Applied`, `Shortlisted`, `Rejected`) in real time.
* **Profile Management**: Update profile details, bio, phone, and contact information.

### 2. Recruiters
* **Recruiter Portal**: Post, edit, and delete job listings.
* **Analytics Overview**: At-a-glance dashboard metrics for posted jobs, total applications received, and shortlisted candidates.
* **Applicant Review**: Review applicant profiles, change application review statuses, and preview/download submitted PDF resumes.
* **Verification Safeguard**: Unverified recruiters are restricted from publishing postings until approved by Admin.

### 3. Administrators (SSR Management Panel)
* **Secure Admin Access**: Dedicated admin session authentication.
* **Platform Metrics**: System-wide overview of active students, registered recruiters, live jobs, and total applications.
* **Recruiter Moderation**: Review recruiter credibility and toggle verified/unverified status.
* **Job Moderation**: Delete spam or unauthorized postings with cascading deletion of corresponding applications.
* **User Directory**: View registered accounts across all roles.

---

## Project Structure

```
Job-portal/
├── client/                 # React 19 + Vite Frontend SPA
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer, ProtectedRoute)
│   │   ├── context/        # AuthContext for state & tokens
│   │   ├── pages/          # Candidate & Recruiter views
│   │   └── services/       # Axios API client with dynamic baseUrl
│   ├── package.json
│   └── vercel.json         # SPA rewrite configuration
├── server/                 # Express.js REST API
│   ├── config/             # Database connection (Mongoose)
│   ├── controllers/        # Business logic for auth, jobs, applications
│   ├── middleware/         # JWT verification & role authorization
│   ├── models/             # User, Job, Application, and SavedJob schemas
│   ├── routes/             # Express API routes
│   ├── scripts/            # Database seed script
│   ├── uploads/            # Uploaded PDF resumes
│   ├── package.json
│   └── server.js           # Server entry point
├── admin/                  # SSR Admin Panel
│   └── views/              # EJS templates for the administration desk
└── README.md
```

---

## Getting Started Locally

### Prerequisites
* Node.js (v18 or higher)
* MongoDB running locally (`mongodb://127.0.0.1:27017/job_portal`) or a MongoDB Atlas connection string.

### 1. Backend Setup
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Create a `.env` file (copy `.env.example` or create new):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/job_portal
   JWT_SECRET=your_jwt_secret_key_here
   CLIENT_URL=http://localhost:5173
   ```
3. Install dependencies and seed the initial dataset:
   ```bash
   npm install
   npm run seed
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   * REST API runs at `http://localhost:5000`
   * Admin Panel is available at `http://localhost:5000/admin/login`

### 2. Frontend Setup
1. Open a new terminal and navigate to `client/`:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file for custom API endpoints:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SERVER_URL=http://localhost:5000
   ```
4. Start the development client:
   ```bash
   npm run dev
   ```
   * Frontend runs at `http://localhost:5173`

---

## Seed Credentials for Testing

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@jobportal.com` | `Admin@123` |
| **Recruiter (Verified)** | `recruiter1@jobportal.com` | `Recruiter@123` |
| **Recruiter (Unverified)** | `recruiter3@jobportal.com` | `Recruiter@123` |
| **Student / Candidate** | `student1@jobportal.com` | `Student@123` |

---

## Deployment Guide

### Backend (Render / Railway)
1. Push your repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
3. Set the Root Directory to `server`.
4. Configure the build and start commands:
   * Build Command: `npm install`
   * Start Command: `npm start`
5. Configure Environment Variables:
   * `PORT`: `5000`
   * `MONGODB_URI`: `<your MongoDB Atlas connection string>`
   * `JWT_SECRET`: `<secure secret>`
   * `CLIENT_URL`: `<deployed frontend domain, e.g. https://your-jobportal.vercel.app>`

### Frontend (Vercel)
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Set Root Directory to `client`.
3. Framework Preset: **Vite**.
4. Configure Environment Variables:
   * `VITE_API_URL`: `<deployed backend url>/api`
   * `VITE_SERVER_URL`: `<deployed backend url>`
5. Deploy. The included `vercel.json` ensures full Single Page Application routing support.

---

## Author

Developed and maintained by **[Yogyabhilash](https://github.com/Yogyabhilash)**.

## License

This project is open-source and available under the [MIT License](LICENSE).
