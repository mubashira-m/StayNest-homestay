import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, Eye, EyeOff, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy');
      return;
    }

    const res = await register({ fullName, email, phone, password });
    if (res.success) {
      navigate('/profile');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card">
          {/* Left / Side Visual Showcase */}
          <div className="auth-visual-side">
            <img 
              src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1000&q=80" 
              alt="Homestay balcony in Wayanad" 
              className="auth-bg-img"
            />
            <div className="auth-visual-overlay"></div>
            <div className="auth-visual-content">
              <span className="auth-visual-badge">
                <Sparkles size={14} />
                Join the Community
              </span>
              <h2>Travel slow, stay somewhere genuine</h2>
              <p>Create an account to unlock member discounts, message local hosts, and save your dream retreats.</p>
            </div>
          </div>

          {/* Right Form Side */}
          <div className="auth-form-side">
            <div className="auth-header">
              <h1 className="auth-title">Create an Account</h1>
              <p className="auth-subtitle">Join thousands of travelers choosing slow, peaceful homestays.</p>
            </div>

            {error && <div className="auth-error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ananya Verma"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Email Address *</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <div className="input-with-icon">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Password *</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm Password *</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-remember-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span>I agree to StayNest Terms of Service & Privacy Policy</span>
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full auth-submit-btn"
                disabled={loading}
              >
                <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </button>

              <div className="auth-footer-switch">
                <span>Already have an account?</span>
                <Link to="/login" className="switch-link">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
