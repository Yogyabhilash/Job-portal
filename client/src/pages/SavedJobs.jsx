import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Bookmark, MapPin, DollarSign, Trash2, ArrowRight } from 'lucide-react';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get('/saved-jobs');
      setSavedJobs(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load saved jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await api.post(`/saved-jobs/unsave/${jobId}`);
      setSavedJobs(savedJobs.filter((job) => job._id !== jobId));
    } catch (err) {
      setErrorMsg('Failed to unsave the job.');
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
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold page-heading">Saved Job Openings</h2>
          <p className="text-muted mb-0">Manage job postings you've saved for later.</p>
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

      {savedJobs.length === 0 ? (
        <div className="text-center py-5 border rounded bg-white">
          <Bookmark className="mx-auto text-secondary mb-3" size={48} />
          <h5 className="text-muted mb-2">No saved jobs yet</h5>
          <p className="text-secondary small">Browse active listings and save them to view them here.</p>
          <Link to="/jobs" className="btn btn-primary-custom mt-3">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {savedJobs.map((job) => (
            <div key={job._id} className="col-md-6">
              <div className="card job-card h-100 p-4 border-0">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="badge bg-secondary text-capitalize mb-2">{job.jobType}</span>
                    <h5 className="fw-bold mb-1 text-truncate" style={{ maxWidth: '280px' }}>{job.title}</h5>
                    <p className="text-primary fw-medium mb-0">{job.company}</p>
                  </div>
                  <button
                    onClick={() => handleUnsave(job._id)}
                    className="btn btn-outline-danger btn-sm border-0"
                    title="Remove from saved jobs"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="text-muted small mb-3 text-truncate-2" style={{ minHeight: '40px' }}>
                  {job.description}
                </p>

                <div className="mb-3 d-flex flex-wrap gap-1">
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center text-muted small">
                  <span className="d-flex align-items-center gap-1">
                    <MapPin size={14} /> {job.location}
                  </span>
                  <span className="d-flex align-items-center gap-1 text-dark fw-semibold">
                    <DollarSign size={14} /> {job.salary}
                  </span>
                </div>
                
                <Link to={`/jobs/${job._id}`} className="btn btn-sm btn-outline-primary mt-3 w-100 fw-semibold" style={{ borderRadius: '8px' }}>
                  View Details & Apply
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
