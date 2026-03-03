import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="contact-page">
            <header className="hero" style={{ height: '50vh' }}>
                <img
                    src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1920&q=80"
                    alt="Contact Us"
                    className="hero-bg"
                />
                <div className="container hero-content">
                    <h1>Get In Touch</h1>
                    <p>Have questions? We're here to help you plan your next big adventure.</p>
                </div>
            </header>

            <section className="contact-section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem' }}>
                        <div className="contact-info">
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Contact Information</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                    <div className="glass-card" style={{ padding: '1rem', borderRadius: '1rem' }}>
                                        <Mail size={24} style={{ color: 'var(--accent)' }} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>Email Us</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>hello@venturevibe.com</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                    <div className="glass-card" style={{ padding: '1rem', borderRadius: '1rem' }}>
                                        <Phone size={24} style={{ color: 'var(--accent)' }} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>Call Us</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>+1 (555) 000-Travel</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                    <div className="glass-card" style={{ padding: '1rem', borderRadius: '1rem' }}>
                                        <MapPin size={24} style={{ color: 'var(--accent)' }} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>Visit Us</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>123 Explorer Way, Adventure City, AC 98765</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card form-container" style={{ margin: '0' }}>
                            <form>
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <input type="text" placeholder="John Doe" />
                                </div>
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <input type="email" placeholder="john@example.com" />
                                </div>
                                <div className="input-group">
                                    <label>Message</label>
                                    <textarea rows="5" placeholder="Tell us about your travel plans..."></textarea>
                                </div>
                                <button className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                    Send Message <Send size={18} className="inline-block ml-2" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
