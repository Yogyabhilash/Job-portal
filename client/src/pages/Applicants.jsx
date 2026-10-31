import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api, { API_BASE_URL } from '../services/api';
import { ArrowLeft, Download, FileText, Calendar, Check, X, ClipboardCheck, ArrowUpDown } from 'lucide-react';

const Applicants = () => {
  const { jobId } = useParams();
  const { token } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/applications/recruiter/applicants/${jobId}`);
      setJob(res.data.job);
      setApplicants(res.data.applicants);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load job applicants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.put(`/applications/status/${appId}`, { status: newStatus });
      setSuccessMsg(`Applicant status updated to ${newStatus}.`);
      
      // Update local state
      setApplicants(
        applicants.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app
        )
      );

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleDownloadResume = (filename) => {
    // Open resume in new tab passing token query for authentication
    const downloadUrl = `${API_BASE_URL}/applications/resume/${filename}?token=${token}`;
    window.open(downloadUrl, '_blank');
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
      <Link to="/recruiter-dashboard" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 mb-4 fw-semibold" style={{ borderRadius: '8px' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

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

      {/* Job Info Card */}
      {job && (
        <div className="card border-0 shadow-sm p-4 rounded-3 bg-dark text-white mb-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <span className="badge bg-primary text-capitalize mb-2">{job.jobType}</span>
              <h2 className="fw-bold mb-1">{job.title}</h2>
              <p className="text-white-50 mb-0">{job.company} — {job.location}</p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <span className="text-white-50 small d-block">Applications Received</span>
              <h3 className="fw-bold mb-0 text-warning">{applicants.length}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Applicants List */}
      <div className="card border-0 shadow-sm p-4 rounded-3 bg-white">
        <h4 className="fw-bold mb-4">Job Applicants</h4>

        {applicants.length === 0 ? (
          <div className="text-center py-5">
            <ClipboardCheck className="mx-auto text-secondary mb-3" size={48} />
            <h5 className="text-muted mb-2">No applications received yet</h5>
            <p className="text-secondary small">As soon as students apply for this job posting, they will show up here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Candidate Details</th>
                  <th>Contact</th>
                  <th>Bio</th>
                  <th>Applied On</th>
                  <th>Resume</th>
                  <th>Status</th>
                  <th className="text-center">Set Status</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => {
                  const student = app.studentId;
                  if (!student) return null;

                  return (
                    <tr key={app._id}>
                      <td>
                        <div className="fw-bold text-dark">{student.name}</div>
                        <span className="badge bg-light text-secondary border mt-1">Student</span>
                      </td>
                      <td>
                        <div className="small">{student.email}</div>
                        <div className="small text-muted">{student.phone || 'No phone'}</div>
                      </td>
                      <td>
                        <div className="text-truncate small text-secondary" style={{ maxWidth: '200px' }} title={student.bio}>
                          {student.bio || '—'}
                        </div>
                      </td>
                      <td>
                        <span className="small text-muted d-flex align-items-center gap-1">
                          <Calendar size={12} />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDownloadResume(app.resume)}
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 px-2.5 py-1.5"
                          style={{ borderRadius: '6px' }}
                        >
                          <Download size={14} /> Resume PDF
                        </button>
                      </td>
                      <td>
                        <span className={`badge px-2.5 py-1.5 text-uppercase ${
                          app.status === 'Shortlisted' ? 'bg-success' :
                          app.status === 'Rejected' ? 'bg-danger' : 'bg-primary'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1">
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'Shortlisted')}
                            className="btn btn-sm btn-success d-flex align-items-center justify-content-center p-2"
                            title="Shortlist Candidate"
                            disabled={app.status === 'Shortlisted'}
                            style={{ borderRadius: '6px' }}
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'Rejected')}
                            className="btn btn-sm btn-danger d-flex align-items-center justify-content-center p-2"
                            title="Reject Candidate"
                            disabled={app.status === 'Rejected'}
                            style={{ borderRadius: '6px' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
