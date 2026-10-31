import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Briefcase, MapPin, DollarSign, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const res = await api.get('/jobs');
        // Get the latest 3 jobs
        setRecentJobs(res.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load recent jobs:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="hero-banner mb-5 text-center text-md-start">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <span className="badge bg-primary text-uppercase px-3 py-2 mb-3 fw-semibold">Discover Your Next Career Step</span>
            <h1 className="display-4 fw-bold mb-3 text-white">Find the Perfect Job For Your Future</h1>
            <p className="lead text-white-50 mb-4">
              Explore thousands of job listings from leading technology companies, startups, and developers worldwide. Fully responsive, clean, and fast.
            </p>
            
            {/* Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="bg-white p-2 rounded-3 shadow-lg d-flex flex-column flex-md-row gap-2" style={{ maxWidth: '650px' }}>
              <div className="input-group align-items-center flex-grow-1 px-2">
                <Search className="text-secondary me-2" size={20} />
                <input
                  type="text"
                  className="form-control border-0 shadow-none py-2"
                  placeholder="Job title, keywords, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary-custom px-4 py-2">
                Search Jobs
              </button>
            </form>
          </div>
          <div className="col-lg-5 d-none d-lg-block text-center">
            <Briefcase size={220} className="text-primary opacity-50" style={{ strokeWidth: 1 }} />
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="row g-4 mb-5 text-center">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 h-100 rounded-3">
            <div className="text-primary mb-3">
              <UserPlus size={40} className="mx-auto" />
            </div>
            <h5 className="fw-bold">Easy Sign Up</h5>
            <p className="text-muted mb-0">Create your candidate or recruiter account in seconds. Access all core features instantly.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 h-100 rounded-3">
            <div className="text-success mb-3">
              <Briefcase size={40} className="mx-auto" />
            </div>
            <h5 className="fw-bold">Apply with PDF Resumes</h5>
            <p className="text-muted mb-0">Candidates can apply for job openings by uploading a PDF resume directly to recruiters.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 h-100 rounded-3">
            <div className="text-warning mb-3">
              <ShieldCheck size={40} className="mx-auto" />
            </div>
            <h5 className="fw-bold">Verified Recruiters Only</h5>
            <p className="text-muted mb-0">Our administrators verify recruiter profiles to ensure high-quality, genuine job listings.</p>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold page-heading mb-1">Featured Job Postings</h2>
            <p className="text-muted mb-0">Check out the most recently posted career opportunities.</p>
          </div>
          <Link to="/jobs" className="btn btn-outline-primary d-flex align-items-center gap-2 fw-semibold">
            See All Jobs <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="text-center py-5 border rounded bg-white">
            <p className="text-muted mb-0">No job postings available yet.</p>
          </div>
        ) : (
          <div className="row g-4">
            {recentJobs.map((job) => (
              <div key={job._id} className="col-md-4">
                <div className="card job-card h-100 p-4 border-0">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="badge bg-secondary text-capitalize mb-2" style={{ fontSize: '0.75rem' }}>
                        {job.jobType}
                      </span>
                      <h5 className="fw-bold mb-1 text-truncate" style={{ maxWidth: '240px' }} title={job.title}>
                        {job.title}
                      </h5>
                      <p className="text-primary fw-medium mb-0">{job.company}</p>
                    </div>
                  </div>
                  
                  <p className="text-muted small mb-3 text-truncate-3" style={{ height: '72px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {job.description}
                  </p>

                  <div className="mb-3 d-flex flex-wrap gap-1">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="badge bg-light text-secondary border d-flex align-items-center">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center text-muted small">
                    <span className="d-flex align-items-center gap-1">
                      <MapPin size={14} /> {job.location}
                    </span>
                    <span className="d-flex align-items-center gap-1 text-dark fw-semibold">
                      <DollarSign size={14} /> {job.salary}
                    </span>
                  </div>
                  
                  <Link to={`/jobs`} className="stretched-link" aria-label="View Details"></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
