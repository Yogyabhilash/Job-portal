import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, FileText, Save, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [updating, setUpdating] = useState(false);

  // Initialize fields on load or when user state changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setUpdating(true);

    try {
      await updateProfile({
        name,
        email,
        phone,
        bio,
      });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4 rounded-3 bg-white">
            <div className="card-body">
              
              <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <User size={28} className="text-primary" />
                  <h2 className="fw-bold mb-0">Your Profile</h2>
                </div>
                {user?.role === 'recruiter' && (
                  <div>
                    {user.isVerified ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1 py-2 px-3 fs-7">
                        <ShieldCheck size={14} /> Verified Recruiter
                      </span>
                    ) : (
                      <span className="badge bg-warning-subtle text-warning border border-warning-subtle d-inline-flex align-items-center gap-1 py-2 px-3 fs-7">
                        <AlertCircle size={14} /> Pending Admin Verification
                      </span>
                    )}
                  </div>
                )}
                {user?.role === 'student' && (
                  <span className="badge bg-primary text-uppercase py-2 px-3 fs-7">Candidate Account</span>
                )}
              </div>

              {successMsg && (
                <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
                  <CheckCircle2 size={18} /> {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                  <AlertCircle size={18} /> {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><User size={18} className="text-secondary" /></span>
                    <input
                      type="text"
                      className="form-control form-control-custom border-start-0 ps-1"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><Mail size={18} className="text-secondary" /></span>
                    <input
                      type="email"
                      className="form-control form-control-custom border-start-0 ps-1"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label fw-semibold">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><Phone size={18} className="text-secondary" /></span>
                    <input
                      type="text"
                      className="form-control form-control-custom border-start-0 ps-1"
                      id="phone"
                      placeholder="e.g. 555-123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="bio" className="form-label fw-semibold">Short Bio / Profile Summary</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 align-items-start pt-2.5"><FileText size={18} className="text-secondary" /></span>
                    <textarea
                      className="form-control form-control-custom border-start-0 ps-1"
                      id="bio"
                      rows="4"
                      placeholder="Share a brief overview of your background, experience, or what you are looking for..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  disabled={updating}
                >
                  <Save size={18} />
                  {updating ? 'Saving changes...' : 'Save Profile Settings'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
