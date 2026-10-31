import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { MapPin, Briefcase, DollarSign, Calendar, Bookmark, BookmarkCheck, Upload, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Student interaction states
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [file, setFile] = useState(null);
  const [applying, setApplying] = useState(false);

  const fetchJobDetails = async () => {
    try {
      const res = await api.get(`/jobs/detail/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load job details.');
    }
  };

  const checkStudentStatus = async () => {
    if (!token || user?.role !== 'student') return;
    try {
      // 1. Check if saved
      const savedRes = await api.get('/saved-jobs');
      const savedList = savedRes.data;
      setIsSaved(savedList.some((sJob) => sJob._id === id));

      // 2. Check if applied
      const appliedRes = await api.get('/applications/applied');
      const appliedList = appliedRes.data;
      const matchingApp = appliedList.find((app) => app.jobId && app.jobId._id === id);
      if (matchingApp) {
        setHasApplied(true);
        setApplicationStatus(matchingApp.status);
      }
    } catch (err) {
      console.error('Error checking student states:', err.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchJobDetails();
      await checkStudentStatus();
      setLoading(false);
    };
    init();
  }, [id, token, user]);

  const handleToggleSave = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      if (isSaved) {
        await api.post(`/saved-jobs/unsave/${id}`);
        setIsSaved(false);
        setSuccessMsg('Job removed from saved listings.');
      } else {
        await api.post(`/saved-jobs/save/${id}`);
        setIsSaved(true);
        setSuccessMsg('Job saved successfully!');
      }
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setErrorMsg('Only PDF files are accepted.');
        setFile(null);
      } else if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMsg('File size must be under 5MB.');
        setFile(null);
      } else {
        setErrorMsg('');
        setFile(selectedFile);
      }
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a PDF resume file first.');
      return;
    }

    setApplying(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post(`/applications/apply/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setHasApplied(true);
      setApplicationStatus('Applied');
      setSuccessMsg('Application submitted successfully!');
      setFile(null);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Submission failed.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">Job posting not found.</div>
        <Link to="/jobs" className="btn btn-primary-custom">Back to Find Jobs</Link>
      </div>
    );
  }

  const isJobOwner = token && user?.role === 'recruiter' && job.recruiter?._id === user?.id;

  return (
    <div className="container py-5">
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <CheckCircle2 size={18} className="me-2" /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <AlertCircle size={18} className="me-2" /> {errorMsg}
        </div>
      )}

      <div className="row g-5">
        {/* Main Job details column */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <span className="badge bg-secondary text-capitalize mb-2">{job.jobType}</span>
                <h1 className="fw-bold mb-1">{job.title}</h1>
                <h4 className="text-primary fw-medium mb-0">{job.company}</h4>
              </div>
              
              {/* Save Button for Students */}
              {(!token || user?.role === 'student') && (
                <button
                  onClick={handleToggleSave}
                  className={`btn d-flex align-items-center gap-2 ${isSaved ? 'btn-success' : 'btn-outline-secondary'}`}
                  style={{ borderRadius: '8px' }}
                >
                  {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  <span>{isSaved ? 'Saved' : 'Save Job'}</span>
                </button>
              )}
            </div>

            <div className="d-flex flex-wrap gap-4 text-muted small py-3 border-top border-bottom mb-4">
              <span className="d-flex align-items-center gap-1">
                <MapPin size={18} /> {job.location}
              </span>
              <span className="d-flex align-items-center gap-1 text-dark fw-semibold">
                <DollarSign size={18} /> {job.salary}
              </span>
              <span className="d-flex align-items-center gap-1">
                <Calendar size={18} /> Posted on {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Description */}
            <h5 className="fw-bold mb-3">Job Description</h5>
            <div className="mb-4 text-secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
              {job.description}
            </div>

            {/* Skills */}
            <h5 className="fw-bold mb-3">Required Technical Skills</h5>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {job.skills.map((skill, index) => (
                <span key={index} className="skill-tag px-3 py-1.5" style={{ fontSize: '0.9rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Panel / Recruiter Card Column */}
        <div className="col-lg-4">
          {/* Applications flow for Students */}
          {(!token || user?.role === 'student') && (
            <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4 text-center">
              <h5 className="fw-bold mb-3">Apply to this Role</h5>
              
              {hasApplied ? (
                <div className="p-3 bg-light rounded-3 border">
                  <FileText className="mx-auto text-success mb-2" size={32} />
                  <p className="fw-bold text-success mb-1">Already Applied</p>
                  <p className="text-secondary small mb-2">You applied for this job opening.</p>
                  <div className="d-inline-block px-3 py-1 bg-white border rounded text-dark fw-semibold">
                    Status: <span className={
                      applicationStatus === 'Shortlisted' ? 'text-success' :
                      applicationStatus === 'Rejected' ? 'text-danger' : 'text-primary'
                    }>{applicationStatus}</span>
                  </div>
                </div>
              ) : !token ? (
                <div>
                  <p className="text-muted small mb-3">Log in as a Student to apply for this job listing.</p>
                  <Link to="/login" className="btn btn-primary-custom w-100 mb-2">
                    Login to Apply
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleApply}>
                  <p className="text-muted small mb-4">Please upload your resume in PDF format (Max 5MB).</p>
                  
                  <div className="mb-4">
                    <label
                      htmlFor="resume"
                      className="border border-dashed rounded-3 p-4 d-block cursor-pointer bg-light hover-bg-slate"
                      style={{ borderStyle: 'dashed', borderColor: '#cbd5e1', cursor: 'pointer' }}
                    >
                      <Upload className="text-secondary mx-auto mb-2" size={24} />
                      <span className="d-block small text-dark fw-semibold">
                        {file ? file.name : 'Select Resume PDF'}
                      </span>
                      <span className="d-block text-secondary x-small mt-1">PDF Files only</span>
                      <input
                        type="file"
                        className="d-none"
                        id="resume"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary-custom w-100 py-2 fw-semibold"
                    disabled={applying || !file}
                  >
                    {applying ? 'Uploading...' : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Owner Dashboard helper */}
          {isJobOwner && (
            <div className="card border-0 shadow-sm p-4 rounded-3 bg-dark text-white mb-4 text-center">
              <CheckCircle2 size={32} className="mx-auto text-warning mb-2" />
              <h5 className="fw-bold text-white mb-2">Your Job Posting</h5>
              <p className="small text-white-50 mb-3">You posted this job. You can view student applicants or edit this posting.</p>
              <div className="d-flex flex-column gap-2">
                <Link to={`/recruiter-dashboard`} className="btn btn-primary-custom w-100">
                  Manage Applications
                </Link>
              </div>
            </div>
          )}

          {/* Recruiter Details Card */}
          <div className="card border-0 shadow-sm p-4 rounded-3 bg-white">
            <h5 className="fw-bold mb-3"><i className="bi bi-person-badge text-primary me-2"></i>About the Recruiter</h5>
            {job.recruiter ? (
              <div>
                <p className="fw-bold mb-1 text-dark">{job.recruiter.name}</p>
                <p className="text-muted small mb-3">{job.recruiter.email}</p>
                
                {job.recruiter.bio && (
                  <p className="small text-secondary mb-3 border-top pt-2">
                    {job.recruiter.bio}
                  </p>
                )}

                {job.recruiter.isVerified ? (
                  <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1">
                    <i className="bi bi-patch-check-fill"></i> Verified Partner
                  </span>
                ) : (
                  <span className="badge bg-warning-subtle text-warning border border-warning-subtle d-inline-flex align-items-center gap-1">
                    <i className="bi bi-exclamation-triangle-fill"></i> Pending Verification
                  </span>
                )}
              </div>
            ) : (
              <p className="text-muted small mb-0">No recruiter information available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
