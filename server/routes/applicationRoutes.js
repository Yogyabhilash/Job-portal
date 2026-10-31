const express = require('express');
const router = express.Router();
const {
  applyJob,
  getAppliedJobs,
  getJobApplicants,
  updateApplicationStatus,
  downloadResume,
  getRecruiterAnalytics,
} = require('../controllers/applicationController');
const { protect, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Student routes
router.post('/apply/:jobId', protect, authorizeRoles('student'), upload.single('resume'), applyJob);
router.get('/applied', protect, authorizeRoles('student'), getAppliedJobs);

// Recruiter routes
router.get('/recruiter/analytics', protect, authorizeRoles('recruiter'), getRecruiterAnalytics);
router.get('/recruiter/applicants/:jobId', protect, authorizeRoles('recruiter'), getJobApplicants);
router.put('/status/:id', protect, authorizeRoles('recruiter'), updateApplicationStatus);

// Shared protected routes
router.get('/resume/:filename', protect, downloadResume);

module.exports = router;
