const Application = require('../models/Application');
const Job = require('../models/Job');
const path = require('path');
const fs = require('fs');

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Student only)
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF resume' });
    }

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      // Remove file if job doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      studentId: req.user.id,
      jobId,
    });

    if (alreadyApplied) {
      // Remove file to prevent cluttering disk
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      studentId: req.user.id,
      jobId,
      resume: req.file.filename,
      status: 'Applied',
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current student's applied jobs
// @route   GET /api/applications/applied
// @access  Private (Student only)
exports.getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate({
        path: 'jobId',
        populate: { path: 'recruiter', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get applicants for a specific job posting
// @route   GET /api/applications/recruiter/applicants/:jobId
// @access  Private (Recruiter only)
exports.getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify job belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
    }

    const applicants = await Application.find({ jobId })
      .populate('studentId', 'name email phone bio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      job,
      applicants,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/status/:id
// @access  Private (Recruiter only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['Applied', 'Shortlisted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(id).populate('jobId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify recruiter owns the job
    if (application.jobId.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update status' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: 'Status updated successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Download resume file securely
// @route   GET /api/applications/resume/:filename
// @access  Private (Recruiter, Admin or Student owner)
exports.downloadResume = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Find the application associated with this resume to check permissions
    const application = await Application.findOne({ resume: filename }).populate('jobId');

    if (!application) {
      // If no application matches but admin requests, allow it. Otherwise deny.
      if (req.user.role === 'admin') {
        return res.sendFile(filePath);
      }
      return res.status(404).json({ message: 'Associated application not found' });
    }

    // Authorization checks:
    // 1. User is the student who applied
    // 2. User is the recruiter who posted the job
    // 3. User is an admin
    const isStudentOwner = req.user.id === application.studentId.toString();
    const isRecruiterOwner = req.user.id === application.jobId.recruiter.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isStudentOwner && !isRecruiterOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to access this resume' });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get recruiter analytics (Jobs posted, applications count, shortlisted count)
// @route   GET /api/applications/recruiter/analytics
// @access  Private (Recruiter only)
exports.getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // 1. Get all jobs posted by recruiter
    const jobs = await Job.find({ recruiter: recruiterId });
    const jobIds = jobs.map((job) => job._id);

    // 2. Get applications received for these jobs
    const totalApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
    });

    // 3. Get shortlisted applications
    const totalShortlisted = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: 'Shortlisted',
    });

    res.status(200).json({
      jobsPosted: jobs.length,
      totalApplications,
      totalShortlisted,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
