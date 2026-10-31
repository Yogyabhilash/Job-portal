const express = require('express');
const router = express.Router();
const { saveJob, unsaveJob, getSavedJobs } = require('../controllers/savedJobController');
const { protect, authorizeRoles } = require('../middleware/auth');

router.use(protect);
router.use(authorizeRoles('student'));

router.post('/save/:jobId', saveJob);
router.post('/unsave/:jobId', unsaveJob);
router.get('/', getSavedJobs);

module.exports = router;
