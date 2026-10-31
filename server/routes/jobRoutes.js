const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
} = require('../controllers/jobController');
const { protect, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/', getJobs);
router.get('/detail/:id', getJobById); // Use /detail/:id to avoid conflict with special text subpaths

// Protected routes
router.post('/', protect, authorizeRoles('recruiter'), createJob);
router.get('/recruiter/myjobs', protect, authorizeRoles('recruiter'), getRecruiterJobs);
router.put('/:id', protect, authorizeRoles('recruiter'), updateJob);
router.delete('/:id', protect, authorizeRoles('recruiter', 'admin'), deleteJob);

module.exports = router;
