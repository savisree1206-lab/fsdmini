import React from 'react';
import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

const Signup = () => {
    return (
        <div className="signup-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
                alt="Signup background"
                className="hero-bg"
                style={{ filter: 'brightness(0.5)' }}
            />

            <div className="glass-card form-container" style={{ width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Plane size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
                    <h2 style={{ fontSize: '2rem' }}>Join the Adventure</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Create your account to start booking.</p>
                </div>

                <form>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="Enter your full name" required />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="Enter your email" required />
                    </div>
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input type="tel" placeholder="Enter your phone number" required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" placeholder="Create a password" required />
                    </div>
                    <button className="btn-primary" style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem' }}>
                        Create Account
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '600' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
