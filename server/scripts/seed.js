const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// Load env vars
dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/job_portal');
    console.log('Connected to database for seeding...');

    // Clear collections
    await User.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    console.log('Cleared existing database entries.');

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@jobportal.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '1234567890',
      bio: 'Administrator account for managing recruiters and jobs.',
      isVerified: true,
    });
    console.log('Seeded Admin account.');

    // 2. Create Recruiters
    const recruiters = await User.create([
      {
        name: 'Jane Tech-HR',
        email: 'recruiter1@jobportal.com',
        password: 'Recruiter@123',
        role: 'recruiter',
        phone: '1112223333',
        bio: 'Tech Recruiter at Google. Looking for modern web development talent.',
        isVerified: true,
      },
      {
        name: 'Mike Dev-Manager',
        email: 'recruiter2@jobportal.com',
        password: 'Recruiter@123',
        role: 'recruiter',
        phone: '4445556666',
        bio: 'Engineering Manager at Stripe. Specializing in finance tech.',
        isVerified: true,
      },
      {
        name: 'Alice Startup-CEO',
        email: 'recruiter3@jobportal.com',
        password: 'Recruiter@123',
        role: 'recruiter',
        phone: '7778889999',
        bio: 'Founder & CEO of NextGen AI. Growing early stage teams.',
        isVerified: false, // Unverified
      },
    ]);
    console.log('Seeded 3 Recruiters (2 verified, 1 unverified).');

    // 3. Create Students
    const students = await User.create([
      {
        name: 'Alex Student',
        email: 'student1@jobportal.com',
        password: 'Student@123',
        role: 'student',
        phone: '9876543210',
        bio: 'CS sophomore specializing in front-end React apps.',
      },
      {
        name: 'Sarah Grad',
        email: 'student2@jobportal.com',
        password: 'Student@123',
        role: 'student',
        phone: '9876543211',
        bio: 'Recent Bootcamp graduate eager to work as a backend developer.',
      },
      {
        name: 'John Doe',
        email: 'student3@jobportal.com',
        password: 'Student@123',
        role: 'student',
        phone: '9876543212',
        bio: 'Fullstack hobbyist transitioning to professional development roles.',
      },
      {
        name: 'Emily Smith',
        email: 'student4@jobportal.com',
        password: 'Student@123',
        role: 'student',
        phone: '9876543213',
        bio: 'Graduate student focused on Python, Node, and data engineering.',
      },
      {
        name: 'David Lee',
        email: 'student5@jobportal.com',
        password: 'Student@123',
        role: 'student',
        phone: '9876543214',
        bio: 'Self-taught coder passionate about clean software designs and web dev.',
      },
    ]);
    console.log('Seeded 5 Students.');

    // 4. Create Jobs (10 Jobs)
    const jobs = await Job.create([
      {
        title: 'Frontend Engineer (React)',
        company: 'Google',
        location: 'Mountain View, CA',
        salary: '$120,000 - $150,000',
        jobType: 'Full-time',
        description: 'Join the Google React Core UI team. Build next generation scalable Web Apps.',
        skills: ['React', 'JavaScript', 'CSS', 'Redux', 'Git'],
        recruiter: recruiters[0]._id,
      },
      {
        title: 'Backend Developer (NodeJS)',
        company: 'Google',
        location: 'Remote',
        salary: '$110,000 - $140,000',
        jobType: 'Remote',
        description: 'Responsible for designing robust API architectures, databases, and microservices.',
        skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Docker'],
        recruiter: recruiters[0]._id,
      },
      {
        title: 'Full Stack Web Intern',
        company: 'Google',
        location: 'San Francisco, CA',
        salary: '$40 - $60 / hr',
        jobType: 'Internship',
        description: 'A 6-month internship focused on React + NodeJS dashboard development.',
        skills: ['React', 'Node.js', 'MongoDB', 'Bootstrap'],
        recruiter: recruiters[0]._id,
      },
      {
        title: 'Backend Engineer (Node/Stripe)',
        company: 'Stripe',
        location: 'Seattle, WA',
        salary: '$130,000 - $160,000',
        jobType: 'Full-time',
        description: 'Build backend pipelines and merchant portals for global financial solutions.',
        skills: ['Node.js', 'Express', 'PostgreSQL', 'TypeScript', 'APIs'],
        recruiter: recruiters[1]._id,
      },
      {
        title: 'DevOps Engineer',
        company: 'Stripe',
        location: 'Remote',
        salary: '$140,000 - $180,000',
        jobType: 'Remote',
        description: 'Optimize CI/CD workflows, manage AWS cloud architectures, and deploy services.',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
        recruiter: recruiters[1]._id,
      },
      {
        title: 'Staff Full Stack Developer',
        company: 'Stripe',
        location: 'Austin, TX',
        salary: '$160,000 - $200,000',
        jobType: 'Full-time',
        description: 'Lead engineering decisions on full-stack projects, serving millions of active checkouts.',
        skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Security'],
        recruiter: recruiters[1]._id,
      },
      {
        title: 'Junior React Developer',
        company: 'NextGen AI',
        location: 'Boston, MA',
        salary: '$80,000 - $95,000',
        jobType: 'Full-time',
        description: 'Entry-level position for React developers. Work closely with product design teams.',
        skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Figma'],
        recruiter: recruiters[2]._id, // Posted by unverified recruiter - students can still view it, but recruiter cannot post *new* ones until verified.
      },
      {
        title: 'Python Backend Dev',
        company: 'NextGen AI',
        location: 'New York, NY',
        salary: '$90,000 - $110,000',
        jobType: 'Contract',
        description: 'Short-term contract building backend agents and integrations for AI models.',
        skills: ['Python', 'FastAPI', 'MongoDB', 'LangChain'],
        recruiter: recruiters[2]._id,
      },
      {
        title: 'Software Engineer',
        company: 'Google',
        location: 'New York, NY',
        salary: '$115,000 - $145,000',
        jobType: 'Full-time',
        description: 'Generalist engineering role across Google Docs, Sheets, and drive services.',
        skills: ['Java', 'C++', 'Python', 'Algorithms'],
        recruiter: recruiters[0]._id,
      },
      {
        title: 'Frontend React Developer',
        company: 'Stripe',
        location: 'San Francisco, CA',
        salary: '$125,000 - $155,000',
        jobType: 'Full-time',
        description: 'Develop rich user dashboards and widgets for the payment processing APIs.',
        skills: ['React', 'TypeScript', 'CSS', 'Webpack'],
        recruiter: recruiters[1]._id,
      },
    ]);
    console.log('Seeded 10 Jobs.');

    // 5. Create Applications (15 Applications)
    // Distributed among students and jobs
    const applications = await Application.create([
      // Student 1 (Alex Student) applications
      {
        studentId: students[0]._id,
        jobId: jobs[0]._id, // Google Frontend
        resume: 'resume-sample.pdf',
        status: 'Shortlisted',
      },
      {
        studentId: students[0]._id,
        jobId: jobs[2]._id, // Google Intern
        resume: 'resume-sample.pdf',
        status: 'Applied',
      },
      {
        studentId: students[0]._id,
        jobId: jobs[9]._id, // Stripe Frontend
        resume: 'resume-sample.pdf',
        status: 'Rejected',
      },

      // Student 2 (Sarah Grad) applications
      {
        studentId: students[1]._id,
        jobId: jobs[1]._id, // Google Backend
        resume: 'resume-sample.pdf',
        status: 'Shortlisted',
      },
      {
        studentId: students[1]._id,
        jobId: jobs[3]._id, // Stripe Backend
        resume: 'resume-sample.pdf',
        status: 'Applied',
      },
      {
        studentId: students[1]._id,
        jobId: jobs[7]._id, // NextGen Python
        resume: 'resume-sample.pdf',
        status: 'Applied',
      },

      // Student 3 (John Doe) applications
      {
        studentId: students[2]._id,
        jobId: jobs[0]._id, // Google Frontend
        resume: 'resume-sample.pdf',
        status: 'Applied',
      },
      {
        studentId: students[2]._id,
        jobId: jobs[1]._id, // Google Backend
        resume: 'resume-sample.pdf',
        status: 'Applied',
      },
      {
        studentId: students[2]._id,
        jobId: jobs[5]._id, // Stripe Staff Fullstack
        resume: 'resume-sample.pdf',
        status: 'Rejected',
      },

      // Student 4 (Emily Smith) applications
      {
        studentId: students[3]._id,
        jobId: jobs[1]._id, // Google Backend
        resume: 'resume-sample.pdf',
        status: 'Shortlisted',
      },
      {
        studentId: students[3]._id,
        jobId: jobs[4]._id, // Stripe DevOps
        resume: 'resume-sample.pdf',
        status: 'Applied',
      },
      {
        studentId: students[3]._id,
        jobId: jobs[7]._id, // NextGen Python
        resume: 'resume-sample.pdf',
        status: 'Applied',
      },

      // Student 5 (David Lee) applications
      {
        studentId: students[4]._id,
        jobId: jobs[2]._id, // Google Intern
        resume: 'resume-sample.pdf',
        status: 'Applied',
      },
      {
        studentId: students[4]._id,
        jobId: jobs[6]._id, // NextGen Junior React
        resume: 'resume-sample.pdf',
        status: 'Shortlisted',
      },
      {
        studentId: students[4]._id,
        jobId: jobs[9]._id, // Stripe Frontend
        resume: 'resume-sample.pdf',
        status: 'Applied',
      },
    ]);
    console.log('Seeded 15 Applications.');

    // Save a couple savedJobs for students for testing
    // Student 1 saves Google Backend & Stripe DevOps
    students[0].savedJobs = [jobs[1]._id, jobs[4]._id];
    await students[0].save();

    // Student 2 saves Google Frontend
    students[1].savedJobs = [jobs[0]._id];
    await students[1].save();
    console.log('Seeded user savedJobs links.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
