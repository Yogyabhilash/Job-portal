import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, MapPin, DollarSign, Calendar, ArrowRight } from 'lucide-react';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await api.get('/applications/applied');
        setApplications(res.data);
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to load applied jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJobs();
  }, []);

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
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold page-heading">Your Applications</h2>
          <p className="text-muted mb-0">Track statuses of roles you've applied to.</p>
        </div>
        <Link to="/jobs" className="btn btn-outline-primary d-flex align-items-center gap-2 fw-semibold">
          Find More Jobs <ArrowRight size={16} />
        </Link>
      </div>

      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="text-center py-5 border rounded bg-white">
          <FileText className="mx-auto text-secondary mb-3" size={48} />
          <h5 className="text-muted mb-2">No applications yet</h5>
          <p className="text-secondary small">You haven't submitted job applications yet.</p>
          <Link to="/jobs" className="btn btn-primary-custom mt-3">
            Browse & Apply
          </Link>
        </div>
      ) : (
        <div className="col-12 d-grid gap-4">
          {applications.map((app) => {
            const job = app.jobId;
            if (!job) return null; // Fallback if job was deleted

            return (
              <div key={app._id} className="card job-card p-4 border-0">
                <div className="row align-items-center g-3">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                      <span className="badge bg-secondary text-capitalize">{job.jobType}</span>
                      <span className="text-secondary small d-flex align-items-center gap-1">
                        <Calendar size={14} /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="fw-bold mb-1">{job.title}</h4>
                    <p className="text-primary fw-medium mb-3">{job.company}</p>

                    <div className="d-flex flex-wrap gap-4 text-muted small">
                      <span className="d-flex align-items-center gap-1">
                        <MapPin size={16} /> {job.location}
                      </span>
                      <span className="d-flex align-items-center gap-1 text-dark fw-semibold">
                        <DollarSign size={16} /> {job.salary}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-4 text-md-end d-flex flex-column align-items-md-end gap-2.5">
                    {/* Status Badge */}
                    <div>
                      <span className="text-muted small d-block mb-1">Application Status</span>
                      <span className={`badge px-3 py-2 text-uppercase fs-6 ${
                        app.status === 'Shortlisted' ? 'bg-success' :
                        app.status === 'Rejected' ? 'bg-danger' : 'bg-primary'
                      }`} style={{ letterSpacing: '0.5px' }}>
                        {app.status}
                      </span>
                    </div>

                    <Link to={`/jobs/${job._id}`} className="btn btn-sm btn-outline-secondary mt-2 w-100 w-md-auto fw-semibold" style={{ borderRadius: '8px' }}>
                      View Posting
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
