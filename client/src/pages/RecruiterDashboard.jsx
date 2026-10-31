import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Users, Edit3, Trash2, Calendar, FileText, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [myJobs, setMyJobs] = useState([]);
  const [analytics, setAnalytics] = useState({
    jobsPosted: 0,
    totalApplications: 0,
    totalShortlisted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch own jobs
      const jobsRes = await api.get('/jobs/recruiter/myjobs');
      setMyJobs(jobsRes.data);

      // 2. Fetch analytics statistics
      const analyticsRes = await api.get('/applications/recruiter/analytics');
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job listing? This will also delete any student applications submitted for it.')) {
      try {
        await api.delete(`/jobs/${jobId}`);
        setSuccessMsg('Job posting deleted successfully.');
        // Refresh listings
        setMyJobs(myJobs.filter((job) => job._id !== jobId));
        
        // Refresh analytics
        const analyticsRes = await api.get('/applications/recruiter/analytics');
        setAnalytics(analyticsRes.data);
        
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Failed to delete job.');
      }
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

  return (
    <div className="container py-5">
      {/* Verification Warning banner */}
      {user && !user.isVerified && (
        <div className="alert alert-warning border border-warning-subtle d-flex align-items-center gap-3 p-4 mb-4 rounded-3" role="alert">
          <AlertTriangle size={32} className="text-warning flex-shrink-0" />
          <div>
            <h5 className="alert-heading fw-bold mb-1">Account Pending Verification</h5>
            <p className="mb-0 small text-secondary">
              Your recruiter profile is currently awaiting administrator verification. You can view existing listings and manage candidate applicants, but you cannot post new job openings until verified.
            </p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success" role="alert">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {/* Recruiter Header */}
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold page-heading">Recruiter Dashboard</h2>
          <p className="text-muted mb-0">Overview of your posted jobs and analytics.</p>
        </div>
        
        <Link 
          to="/post-job" 
          className={`btn btn-primary-custom d-flex align-items-center gap-2 fw-semibold ${!user?.isVerified ? 'disabled opacity-50' : ''}`}
          style={{ pointerEvents: !user?.isVerified ? 'none' : 'auto' }}
        >
          <Plus size={18} /> Post a Job
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 analytics-card rounded-3" style={{ borderLeftColor: '#2563eb' }}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted text-uppercase fw-semibold mb-1 small">Jobs Posted</h6>
                <h2 className="fw-bold mb-0 text-dark">{analytics.jobsPosted}</h2>
              </div>
              <div className="fs-2 text-primary bg-primary-subtle p-2 rounded-3"><Plus size={24} /></div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 analytics-card rounded-3" style={{ borderLeftColor: '#4f46e5' }}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted text-uppercase fw-semibold mb-1 small">Applications Received</h6>
                <h2 className="fw-bold mb-0 text-dark">{analytics.totalApplications}</h2>
              </div>
              <div className="fs-2 text-indigo bg-indigo-subtle p-2 rounded-3"><Users size={24} className="text-indigo" /></div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 analytics-card rounded-3" style={{ borderLeftColor: '#10b981' }}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted text-uppercase fw-semibold mb-1 small">Shortlisted Candidates</h6>
                <h2 className="fw-bold mb-0 text-dark">{analytics.totalShortlisted}</h2>
              </div>
              <div className="fs-2 text-success bg-success-subtle p-2 rounded-3"><CheckCircle2 size={24} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* My Job Listings */}
      <div className="card border-0 shadow-sm p-4 rounded-3 bg-white">
        <h4 className="fw-bold mb-4">Your Posted Job Openings</h4>
        
        {myJobs.length === 0 ? (
          <div className="text-center py-5">
            <Plus className="mx-auto text-secondary mb-3" size={48} />
            <h5 className="text-muted mb-2">No jobs posted yet</h5>
            {user?.isVerified ? (
              <p className="text-secondary small">Get started by creating your first job listing.</p>
            ) : (
              <p className="text-secondary small">Once verified by an admin, you can begin posting jobs.</p>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Job Type</th>
                  <th>Created Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myJobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div className="fw-bold text-dark">{job.title}</div>
                      <span className="small text-muted">{job.skills.slice(0, 3).join(', ')}</span>
                    </td>
                    <td>{job.location}</td>
                    <td>{job.salary}</td>
                    <td>
                      <span className="badge bg-secondary text-capitalize">{job.jobType}</span>
                    </td>
                    <td>
                      <span className="small text-muted">
                        <Calendar size={14} className="me-1" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Link
                          to={`/recruiter/applicants/${job._id}`}
                          className="btn btn-sm btn-outline-primary fw-semibold d-flex align-items-center gap-1 px-2.5 py-1.5"
                          title="View Applicants"
                          style={{ borderRadius: '6px' }}
                        >
                          <Users size={14} /> Applicants
                        </Link>
                        <Link
                          to={`/edit-job/${job._id}`}
                          className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center p-2"
                          title="Edit Job"
                          style={{ borderRadius: '6px' }}
                        >
                          <Edit3 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center p-2"
                          title="Delete Job"
                          style={{ borderRadius: '6px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
