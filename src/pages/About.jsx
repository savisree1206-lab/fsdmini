import React from 'react';
import { Shield, Globe, Clock, Heart } from 'lucide-react';

const About = () => {
    return (
        <div className="about-page">
            <header className="hero" style={{ height: '50vh' }}>
                <img
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80"
                    alt="About Us"
                    className="hero-bg"
                />
                <div className="container hero-content">
                    <h1>Our Story</h1>
                    <p>We are dedicated to making travel accessible, beautiful, and unforgettable.</p>
                </div>
            </header>

            <section className="about-content">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Travel with Confidence</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                                Founded in 2020, VentureVibe started with a simple mission: to help people see the world in its purest form. We believe that travel is not just about visiting places, but about the experiences that change us.
                            </p>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.8' }}>
                                Our team of travel enthusiasts works tirelessly to curate the best destinations and ensure your journey is smooth from start to finish.
                            </p>
                            <button className="btn-primary">Learn Our Process</button>
                        </div>
                        <div className="glass-card" style={{ padding: '2rem', overflow: 'hidden' }}>
                            <img
                                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80"
                                alt="Travel team"
                                style={{ width: '100%', borderRadius: '1rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '6rem' }}>
                        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                            <Globe style={{ color: 'var(--accent)', marginBottom: '1rem' }} size={40} />
                            <h3>Global Network</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Access to over 500+ destinations worldwide.</p>
                        </div>
                        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                            <Shield style={{ color: 'var(--accent)', marginBottom: '1rem' }} size={40} />
                            <h3>Secure Booking</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your data and payments are always protected.</p>
                        </div>
                        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                            <Clock style={{ color: 'var(--accent)', marginBottom: '1rem' }} size={40} />
                            <h3>24/7 Support</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>We're here for you at any time, anywhere.</p>
                        </div>
                        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                            <Heart style={{ color: 'var(--accent)', marginBottom: '1rem' }} size={40} />
                            <h3>Passionate Team</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Travelers serving fellow travelers.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
