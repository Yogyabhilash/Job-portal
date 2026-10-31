import React from 'react';
import { Briefcase } from 'lucide-react';
import { SERVER_BASE_URL } from '../services/api';

const Footer = () => {
  return (
    <footer className="footer-custom mt-auto py-5 text-secondary">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center fw-bold fs-4 text-white mb-3">
              <Briefcase className="me-2 text-primary" size={24} />
              <span>JobPortal</span>
            </div>
            <p className="small text-slate-400">
              A premium, simple, and clean full-stack job application portal demonstrating modern web engineering practices with React, Express, MongoDB, and EJS.
            </p>
          </div>
          <div className="col-6 col-lg-2 offset-lg-2">
            <h6 className="text-white fw-semibold mb-3">For Candidates</h6>
            <ul className="list-unstyled d-grid gap-2 small">
              <li><a href="/jobs" className="text-decoration-none text-secondary hover-text-primary">Find Jobs</a></li>
              <li><a href="/applied-jobs" className="text-decoration-none text-secondary">Applied Jobs</a></li>
              <li><a href="/saved-jobs" className="text-decoration-none text-secondary">Saved Jobs</a></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="text-white fw-semibold mb-3">For Recruiters</h6>
            <ul className="list-unstyled d-grid gap-2 small">
              <li><a href="/post-job" className="text-decoration-none text-secondary">Post a Job</a></li>
              <li><a href="/recruiter-dashboard" className="text-decoration-none text-secondary">Dashboard</a></li>
              <li><a href="/profile" className="text-decoration-none text-secondary">Profile Settings</a></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="text-white fw-semibold mb-3">Admin Desk</h6>
            <ul className="list-unstyled d-grid gap-2 small">
              <li>
                <a 
                  href={`${SERVER_BASE_URL}/admin/login`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-decoration-none text-secondary"
                >
                  Admin Portal <i className="bi bi-box-arrow-up-right small ms-1"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-4 border-secondary opacity-25" />
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small">
          <p className="mb-0">&copy; {new Date().getFullYear()} JobPortal Inc. All rights reserved.</p>
          <p className="mb-0 text-slate-500">Built for Demo Portfolio Showcase</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
