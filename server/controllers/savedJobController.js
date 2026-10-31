const User = require('../models/User');
const Job = require('../models/Job');

// @desc    Save a job listing
// @route   POST /api/saved-jobs/save/:jobId
// @access  Private (Student only)
exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already saved
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job is already saved' });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({ message: 'Job saved successfully', savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Unsave a job listing
// @route   POST /api/saved-jobs/unsave/:jobId
// @access  Private (Student only)
exports.unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if saved
    if (!user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job is not saved' });
    }

    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    await user.save();

    res.status(200).json({ message: 'Job unsaved successfully', savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all saved jobs for current student
// @route   GET /api/saved-jobs
// @access  Private (Student only)
exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedJobs',
      populate: { path: 'recruiter', select: 'name email' },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
