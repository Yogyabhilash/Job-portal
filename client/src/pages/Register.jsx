import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, UserCheck } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [errorMsg, setErrorMsg] = useState('');
  const { register, token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (token && user) {
      if (user.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/jobs');
      }
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const registeredUser = await register(name, email, password, role);
      if (registeredUser.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      setErrorMsg(err);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm border-0 p-4 rounded-3 bg-white mt-2">
            <div className="card-body">
              <div className="text-center mb-4">
                <div className="text-primary mb-2">
                  <UserPlus size={40} className="mx-auto" />
                </div>
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Register as a Candidate or Recruiter</p>
              </div>

              {errorMsg && (
                <div className="alert alert-danger" role="alert">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" class="form-label fw-semibold">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><User size={18} className="text-secondary" /></span>
                    <input
                      type="text"
                      className="form-control form-control-custom border-start-0 ps-1"
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" class="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><Mail size={18} className="text-secondary" /></span>
                    <input
                      type="email"
                      className="form-control form-control-custom border-start-0 ps-1"
                      id="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" class="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><Lock size={18} className="text-secondary" /></span>
                    <input
                      type="password"
                      className="form-control form-control-custom border-start-0 ps-1"
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="role" class="form-label fw-semibold">Register As</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><UserCheck size={18} className="text-secondary" /></span>
                    <select
                      className="form-select form-control-custom border-start-0 ps-1"
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="student">Student / Job Seeker</option>
                      <option value="recruiter">Recruiter</option>
                    </select>
                  </div>
                  {role === 'recruiter' && (
                    <div className="form-text text-warning mt-2 small">
                      <i className="bi bi-info-circle-fill me-1"></i>
                      Recruiter accounts must be approved by an Admin before job postings can go live.
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary-custom w-100 py-2.5 mb-3 fw-semibold">
                  Register
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-muted">Already have an account? </span>
                <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                  Login here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
