import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Search, MapPin, Briefcase, DollarSign, Filter, RefreshCw } from 'lucide-react';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || 'All');

  // Available options for filters
  const locations = ['All', 'Remote', 'Mountain View, CA', 'San Francisco, CA', 'Seattle, WA', 'Austin, TX', 'Boston, MA', 'New York, NY'];
  const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const queryParams = {};
      if (search) queryParams.search = search;
      if (location && location !== 'All') queryParams.location = location;
      if (jobType && jobType !== 'All') queryParams.jobType = jobType;

      const res = await api.get('/jobs', { params: queryParams });
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (location && location !== 'All') params.location = location;
    if (jobType && jobType !== 'All') params.jobType = jobType;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('All');
    setJobType('All');
    setSearchParams({});
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold page-heading">Find Your Dream Job</h2>
          <p className="text-muted">Explore active career opportunities posted by verified recruiters.</p>
        </div>
      </div>

      {/* Filter and Search Form Card */}
      <div className="card border-0 shadow-sm p-4 rounded-3 bg-white mb-5">
        <form onSubmit={handleApplyFilters}>
          <div className="row g-3">
            {/* Search Input */}
            <div className="col-lg-4">
              <label className="form-label fw-semibold">Keywords Search</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><Search size={18} className="text-secondary" /></span>
                <input
                  type="text"
                  className="form-control form-control-custom border-start-0 ps-1"
                  placeholder="Job title, company name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Location Select */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-semibold">Location</label>
              <select
                className="form-select form-control-custom"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type Select */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-semibold">Job Type</label>
              <select
                className="form-select form-control-custom"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="col-lg-2 d-flex align-items-end gap-2">
              <button type="submit" className="btn btn-primary-custom w-100 py-2.5 d-flex align-items-center justify-content-center gap-2">
                <Filter size={18} /> Apply
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-secondary-custom py-2.5 px-3 d-flex align-items-center justify-content-center"
                title="Clear Filters"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Jobs Listings Container */}
      <div className="row">
        {loading ? (
          <div className="col text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="col text-center py-5 border rounded bg-white">
            <h5 className="text-muted mb-2">No jobs match your search criteria</h5>
            <p className="text-secondary small">Try clearing filters or checking spelling.</p>
            <button onClick={handleClearFilters} className="btn btn-sm btn-primary-custom mt-2">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="col-12 d-grid gap-4">
            <div className="text-muted small mb-2">{jobs.length} jobs available</div>
            {jobs.map((job) => (
              <div key={job._id} className="card job-card p-4 border-0">
                <div className="row align-items-center g-3">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-secondary text-capitalize">{job.jobType}</span>
                      {job.recruiter?.isVerified && (
                        <span className="badge bg-success-subtle text-success border border-success-subtle d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                          <i className="bi bi-patch-check-fill"></i> Verified Company
                        </span>
                      )}
                    </div>
                    <h4 className="fw-bold mb-1">{job.title}</h4>
                    <p className="text-primary fw-medium mb-3">{job.company}</p>

                    <div className="d-flex flex-wrap gap-1.5 mb-3">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="d-flex flex-wrap gap-4 text-muted small">
                      <span className="d-flex align-items-center gap-1">
                        <MapPin size={16} /> {job.location}
                      </span>
                      <span className="d-flex align-items-center gap-1 text-dark fw-semibold">
                        <DollarSign size={16} /> {job.salary}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-4 text-md-end d-grid d-md-block">
                    <Link to={`/jobs/${job._id}`} className="btn btn-primary-custom">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
