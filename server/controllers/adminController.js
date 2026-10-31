const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Render Admin Login page
// @route   GET /admin/login
// @access  Public
exports.getLogin = (req, res) => {
  res.render('login', { error: req.query.error || null });
};

// @desc    Render Admin Dashboard statistics
// @route   GET /admin/dashboard
// @access  Private (Admin only)
exports.getDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.render('dashboard', {
      stats: {
        totalStudents,
        totalRecruiters,
        totalJobs,
        totalApplications,
      },
      token: req.query.token || req.body.token,
    });
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
};

// @desc    Render all system users
// @route   GET /admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ role: 1, name: 1 });
    res.render('users', {
      users,
      token: req.query.token || req.body.token,
    });
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
};

// @desc    Render recruiters verify page
// @route   GET /admin/recruiters
// @access  Private (Admin only)
exports.getRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({ role: 'recruiter' }).select('-password').sort({ name: 1 });
    res.render('recruiters', {
      recruiters,
      token: req.query.token || req.body.token,
    });
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
};

// @desc    Verify recruiter profile
// @route   POST /admin/recruiters/verify/:id
// @access  Private (Admin only)
exports.verifyRecruiter = async (req, res) => {
  try {
    const recruiter = await User.findById(req.params.id);
    if (!recruiter || recruiter.role !== 'recruiter') {
      return res.status(404).send('Recruiter not found');
    }
    recruiter.isVerified = true;
    await recruiter.save();
    
    const token = req.query.token || req.body.token;
    res.redirect(`/admin/recruiters?token=${token}`);
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
};

// @desc    Unverify recruiter profile
// @route   POST /admin/recruiters/unverify/:id
// @access  Private (Admin only)
exports.unverifyRecruiter = async (req, res) => {
  try {
    const recruiter = await User.findById(req.params.id);
    if (!recruiter || recruiter.role !== 'recruiter') {
      return res.status(404).send('Recruiter not found');
    }
    recruiter.isVerified = false;
    await recruiter.save();
    
    const token = req.query.token || req.body.token;
    res.redirect(`/admin/recruiters?token=${token}`);
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
};

// @desc    Render all job postings
// @route   GET /admin/jobs
// @access  Private (Admin only)
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('recruiter', 'name email').sort({ createdAt: -1 });
    res.render('jobs', {
      jobs,
      token: req.query.token || req.body.token,
    });
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
};

// @desc    Delete job posting (Admin delete fake jobs)
// @route   POST /admin/jobs/delete/:id
// @access  Private (Admin only)
exports.deleteJob = async (req, res) => {
  try {
    await Job.deleteOne({ _id: req.params.id });
    await Application.deleteMany({ jobId: req.params.id });
    
    const token = req.query.token || req.body.token;
    res.redirect(`/admin/jobs?token=${token}`);
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
};
