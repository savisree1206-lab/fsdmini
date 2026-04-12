import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, User, Shield, Eye, EyeOff, AlertCircle, CheckCircle, MapPin } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('user'); // 'user' | 'admin'
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const endpoint =
      tab === 'admin'
        ? 'http://localhost:5000/api/admin/login'
        : 'http://localhost:5000/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, role: tab }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess(`Welcome back, ${data.user.name || 'Admin'}!`);
        setTimeout(() => {
          let target = '/user-dashboard';             
          if (tab === 'admin') target = '/admin-dashboard';
          if (tab === 'guide') target = '/guide-dashboard';
          navigate(target);
        }, 1000);
      }
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-orb orb1" />
        <div className="login-bg-orb orb2" />
        <div className="login-bg-orb orb3" />
      </div>

      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <Plane size={36} strokeWidth={1.5} />
          </div>
          <h1>TravelLink</h1>
          <p>Sign in to your account</p>
        </div>

        {/* Tab Switcher */}
        <div className="login-tabs">
          <button
            className={`login-tab ${tab === 'user' ? 'active' : ''}`}
            onClick={() => { setTab('user'); setError(''); setSuccess(''); setForm({ email: '', password: '' }); }}
          >
            <User size={16} />
            User Login
          </button>
          <button
            className={`login-tab ${tab === 'guide' ? 'active' : ''}`}
            onClick={() => { setTab('guide'); setError(''); setSuccess(''); setForm({ email: '', password: '' }); }}
          >
            <MapPin size={16} />
            Guide Login
          </button>
          <button
            className={`login-tab ${tab === 'admin' ? 'active' : ''}`}
            onClick={() => { setTab('admin'); setError(''); setSuccess(''); setForm({ email: '', password: '' }); }}
          >
            <Shield size={16} />
            Admin Login
          </button>
        </div>

        {/* Role badge */}
        <div className={`role-badge ${tab === 'admin' ? 'admin' : tab === 'guide' ? 'guide' : 'user'}`}>
          {tab === 'admin' ? (
            <><Shield size={14} /> Admin Portal — Restricted Access</>
          ) : tab === 'guide' ? (
            <><MapPin size={14} /> Guide Portal — Manage Tours</>
          ) : (
            <><User size={14} /> User Portal — Book & Manage Travel</>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="login-alert error">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {success && (
          <div className="login-alert success">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder={tab === 'admin' ? 'admin@travellink.com' : tab === 'guide' ? 'guide@example.com' : 'you@example.com'}
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="pwd-wrapper">
              <input
                type={showPwd ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pwd-toggle"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`login-btn ${tab === 'admin' ? 'admin-btn' : tab === 'guide' ? 'guide-btn' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              tab === 'admin' ? 'Sign In as Admin' : tab === 'guide' ? 'Sign In as Guide' : 'Sign In'
            )}
          </button>
        </form>

        {/* Footer links — only show for users */}
        {tab === 'user' && (
          <p className="login-footer">
            Don't have an account?{' '}
            <Link to="/signup">Create one free</Link>
          </p>
        )}
        {tab === 'admin' && (
          <p className="login-footer admin-note">
            Admin access is restricted. Contact your system administrator.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
