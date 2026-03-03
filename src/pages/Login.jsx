import React from 'react';
import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

const Login = () => {
    return (
        <div className="login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <img
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80"
                alt="Login background"
                className="hero-bg"
                style={{ filter: 'brightness(0.4) contrast(1.1)' }}
            />

            <div className="glass-card form-container" style={{ width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Plane size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
                    <h2 style={{ fontSize: '2rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Login to continue your journey.</p>
                </div>

                <form>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="Enter your email" required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" required />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        <label style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#" style={{ color: 'var(--accent)' }}>Forgot Password?</a>
                    </div>
                    <button className="btn-primary" style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem' }}>
                        Login
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: '600' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
