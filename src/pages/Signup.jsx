import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, AlertCircle, CheckCircle } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
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

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed. Please try again.');
            } else {
                setSuccess(data.message || 'Account created successfully! Redirecting...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch {
            setError('Cannot connect to server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <style>
                {`
                    .signup-page input::placeholder {
                        color: rgba(255, 255, 255, 0.7) !important;
                    }
                `}
            </style>
            <img
                src="https://picsum.photos/id/1036/1920/1080"
                alt="Signup background"
                className="hero-bg"
                style={{ filter: 'brightness(0.5)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1  }}
            />

            <div className="glass-card form-container" style={{ width: '100%', maxWidth: '450px', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'white' }}>
                    <Plane size={48} style={{ color: '#fff', margin: '0 auto 1rem' }} />
                    <h2 style={{ fontSize: '2rem', margin: 0 }}>Join the Adventure</h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0.5rem 0' }}>Create your account to start booking.</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', border: '1px solid rgba(255,0,0,0.2)' }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}
                {success && (
                    <div style={{ background: 'rgba(0,255,0,0.1)', color: '#51cf66', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', border: '1px solid rgba(0,255,0,0.2)' }}>
                        <CheckCircle size={16} /> {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: 'white', marginBottom: '0.5rem' }}>Full Name</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" required style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }} />
                    </div>
                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: 'white', marginBottom: '0.5rem' }}>Email Address</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }} />
                    </div>
                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: 'white', marginBottom: '0.5rem' }}>Phone Number</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your phone number" required style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }} />
                    </div>
                    <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: 'white', marginBottom: '0.5rem' }}>Password</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create a password" required style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }} />
                    </div>
                    <button type="submit" disabled={loading} style={{ width: '100%', boxSizing: 'border-box', padding: '1rem', marginBottom: '1.5rem', background: '#fff', color: '#000', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
                    Already have an account? <Link to="/login" style={{ color: '#fff', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
