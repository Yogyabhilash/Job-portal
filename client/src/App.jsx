import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import SavedJobs from './pages/SavedJobs';
import AppliedJobs from './pages/AppliedJobs';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Applicants from './pages/Applicants';
import PostJob from './pages/PostJob';
import EditJob from './pages/EditJob';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <div className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />

              {/* Student Only Routes */}
              <Route
                path="/saved-jobs"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <SavedJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applied-jobs"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <AppliedJobs />
                  </ProtectedRoute>
                }
              />

              {/* Recruiter Only Routes */}
              <Route
                path="/recruiter-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['recruiter']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/applicants/:jobId"
                element={
                  <ProtectedRoute allowedRoles={['recruiter']}>
                    <Applicants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute allowedRoles={['recruiter']}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-job/:id"
                element={
                  <ProtectedRoute allowedRoles={['recruiter']}>
                    <EditJob />
                  </ProtectedRoute>
                }
              />

              {/* Shared Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['student', 'recruiter']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
