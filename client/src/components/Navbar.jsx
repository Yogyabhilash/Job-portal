import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SERVER_BASE_URL } from '../services/api';
import { Briefcase, User as UserIcon, LogOut, LayoutDashboard, Bookmark, FileText } from 'lucide-react';

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom py-3 sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-4 text-primary" to="/">
          <Briefcase className="me-2" size={28} />
          <span>JobPortal</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/jobs">
                Find Jobs
              </NavLink>
            </li>
            {token && user?.role === 'student' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/saved-jobs">
                    Saved Jobs
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/applied-jobs">
                    Applied Jobs
                  </NavLink>
                </li>
              </>
            )}
            {token && user?.role === 'recruiter' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/recruiter-dashboard">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/post-job">
                    Post a Job
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          
          <div className="d-flex align-items-center gap-3">
            <a 
              href={`${SERVER_BASE_URL}/admin/login`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-secondary text-decoration-none fw-semibold border-end pe-3 me-1 fs-6 d-none d-md-inline"
            >
              Admin Portal <i className="bi bi-box-arrow-up-right small"></i>
            </a>

            {token ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 py-2 px-3 border"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <UserIcon size={18} />
                  <span>{user?.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2" aria-labelledby="userDropdown">
                  <li>
                    <div className="px-3 py-2 border-bottom">
                      <p className="mb-0 fw-bold">{user?.name}</p>
                      <p className="mb-0 text-muted small text-truncate" style={{ maxWidth: '180px' }}>{user?.email}</p>
                      <span className="badge bg-primary text-uppercase mt-1" style={{ fontSize: '0.7rem' }}>{user?.role}</span>
                    </div>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2 mt-2 py-2 text-secondary" to="/profile">
                      <UserIcon size={16} /> Profile
                    </Link>
                  </li>
                  {user?.role === 'recruiter' && (
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 py-2 text-secondary" to="/recruiter-dashboard">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                    </li>
                  )}
                  {user?.role === 'student' && (
                    <>
                      <li>
                        <Link className="dropdown-item d-flex align-items-center gap-2 py-2 text-secondary" to="/saved-jobs">
                          <Bookmark size={16} /> Saved Jobs
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item d-flex align-items-center gap-2 py-2 text-secondary" to="/applied-jobs">
                          <FileText size={16} /> Applied Jobs
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item text-danger d-flex align-items-center gap-2 py-2">
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link className="btn btn-secondary-custom px-3 py-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary-custom px-3 py-2" to="/register">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
