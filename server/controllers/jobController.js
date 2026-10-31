const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, salary, jobType, description, skills } = req.body;

    // Verify recruiter is verified before posting
    const user = await User.findById(req.user.id);
    if (!user || !user.isVerified) {
      return res.status(403).json({
        message: 'Your recruiter account must be verified by an admin before you can post jobs.',
      });
    }

    if (!title || !company || !location || !salary || !jobType || !description) {
      return res.status(400).json({ message: 'All fields except skills are required' });
    }

    // Convert skills to array if it is a string
    let skillsArray = [];
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === 'string') {
        skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const job = await Job.create({
      title,
      company,
      location,
      salary,
      jobType,
      description,
      skills: skillsArray,
      recruiter: req.user.id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all jobs (with optional search and filters)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { search, location, jobType } = req.query;
    const query = {};

    // Text search on title or company
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by location
    if (location && location !== 'All') {
      query.location = { $regex: `^${location}$`, $options: 'i' };
    }

    // Filter by job type
    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    const jobs = await Job.find(query)
      .populate('recruiter', 'name email isVerified')
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single job details
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.id || req.params.id)
      .populate('recruiter', 'name email isVerified phone bio');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only)
exports.updateJob = async (req, res) => {
  try {
    const { title, company, location, salary, jobType, description, skills } = req.body;
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify owner
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this job posting' });
    }

    // Convert skills to array if it is a string
    let skillsArray = job.skills;
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === 'string') {
        skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.jobType = jobType || job.jobType;
    job.description = description || job.description;
    job.skills = skillsArray;

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter or Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify owner or admin
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job posting' });
    }

    await Job.deleteOne({ _id: job._id });
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get recruiter's own jobs and analytics
// @route   GET /api/jobs/recruiter/myjobs
// @access  Private (Recruiter only)
exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
