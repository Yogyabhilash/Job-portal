const express = require('express');
const router = express.Router();
const {
  getLogin,
  getDashboard,
  getUsers,
  getRecruiters,
  verifyRecruiter,
  unverifyRecruiter,
  getJobs,
  deleteJob,
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');

// Public route
router.get('/login', getLogin);

// Protected routes (admin only)
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/recruiters', getRecruiters);
router.post('/recruiters/verify/:id', verifyRecruiter);
router.post('/recruiters/unverify/:id', unverifyRecruiter);
router.get('/jobs', getJobs);
router.post('/jobs/delete/:id', deleteJob);

module.exports = router;
