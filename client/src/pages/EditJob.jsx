import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/detail/${id}`);
        const job = res.data;
        
        // Authorization check: Make sure recruiter is the job poster
        if (job.recruiter && job.recruiter._id !== user?.id) {
          navigate('/recruiter-dashboard');
          return;
        }

        setTitle(job.title);
        setCompany(job.company);
        setLocation(job.location);
        setSalary(job.salary);
        setJobType(job.jobType);
        setSkills(job.skills.join(', '));
        setDescription(job.description);

      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      await api.put(`/jobs/${id}`, {
        title,
        company,
        location,
        salary,
        jobType,
        skills,
        description,
      });

      setSuccessMsg('Job posting updated successfully!');
      setTimeout(() => {
        navigate('/recruiter-dashboard');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update job posting.');
      setSubmitting(false);
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
      <Link to="/recruiter-dashboard" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 mb-4 fw-semibold" style={{ borderRadius: '8px' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 rounded-3 bg-white">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-4">
                <h2 className="fw-bold mb-0">Edit Job Posting</h2>
              </div>

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

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="title" className="form-label fw-semibold">Job Title *</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="company" className="form-label fw-semibold">Company Name *</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="location" className="form-label fw-semibold">Location *</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="salary" className="form-label fw-semibold">Salary Range *</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      id="salary"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="jobType" className="form-label fw-semibold">Job Type *</label>
                    <select
                      className="form-select form-control-custom"
                      id="jobType"
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="skills" className="form-label fw-semibold">Required Skills (comma separated) *</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      id="skills"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-semibold">Detailed Description *</label>
                  <textarea
                    className="form-control form-control-custom"
                    id="description"
                    rows="6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  disabled={submitting}
                >
                  <Save size={20} />
                  {submitting ? 'Updating...' : 'Save Job Posting'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
