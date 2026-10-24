import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await login(email, password);
    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    const res = await login(demoEmail, demoPassword);
    if (res.success) {
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card">
          {/* Left / Side Visual Showcase */}
          <div className="auth-visual-side">
            <img 
              src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80" 
              alt="Homestay in the hills" 
              className="auth-bg-img"
            />
            <div className="auth-visual-overlay"></div>
            <div className="auth-visual-content">
              <span className="auth-visual-badge">
                <Sparkles size={14} />
                Welcome Back
              </span>
              <h2>Your next peaceful escape is waiting</h2>
              <p>Sign in to manage your reservations, save favorite stays, and explore verified hosts.</p>
            </div>
          </div>

          {/* Right Form Side */}
          <div className="auth-form-side">
            <div className="auth-header">
              <h1 className="auth-title">Welcome to StayNest</h1>
              <p className="auth-subtitle">Please enter your credentials to access your account.</p>
            </div>

            {error && <div className="auth-error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
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
                <div className="label-with-link">
                  <label>Password</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("A password reset link will be sent to your registered email address."); }} className="forgot-link">
                    Forgot password?
                  </a>
                </div>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-remember-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full auth-submit-btn"
                disabled={loading}
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight size={18} />
              </button>

              {/* Demo 1-Click Login Box */}
              <div className="demo-login-box">
                <span className="demo-box-label">Quick Testing Options:</span>
                <div className="demo-btns-row">
                  <button
                    type="button"
                    className="demo-account-btn"
                    onClick={() => handleDemoLogin('ananya.travels@example.com', 'demo123')}
                  >
                    Demo Traveler
                  </button>
                  <button
                    type="button"
                    className="demo-account-btn"
                    onClick={() => handleDemoLogin('mathew.host@example.com', 'host123')}
                  >
                    Demo Host
                  </button>
                </div>
              </div>

              <div className="auth-footer-switch">
                <span>Don't have an account yet?</span>
                <Link to="/register" className="switch-link">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
