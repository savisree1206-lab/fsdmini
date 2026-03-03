import React from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';

const spots = [
    {
        id: 1,
        name: 'Bali, Indonesia',
        desc: 'Tropical paradise with lush jungles and pristine beaches.',
        price: '$1,200',
        img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        rating: 4.9
    },
    {
        id: 2,
        name: 'Santorini, Greece',
        desc: 'Breathtaking white buildings overlooking the Aegean Sea.',
        price: '$2,500',
        img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
        rating: 4.8
    },
    {
        id: 3,
        name: 'Swiss Alps, Switzerland',
        desc: 'Snow-capped peaks and cozy mountain retreats.',
        price: '$2,100',
        img: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=800&q=80',
        rating: 5.0
    },
    {
        id: 4,
        name: 'Kyoto, Japan',
        desc: 'Ancient temples and stunning cherry blossom gardens.',
        price: '$1,800',
        img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        rating: 4.7
    }
];

const Home = () => {
    return (
        <div className="home-page">
            <header className="hero">
                <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
                    alt="Travel Hero"
                    className="hero-bg"
                />
                <div className="container hero-content">
                    <h1>Explore The Unexplored</h1>
                    <p>Discover hidden gems and create unforgettable memories with our curated travel experiences.</p>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <button className="btn-primary">Book Your Trip</button>
                        <button className="btn-outline">Learn More</button>
                    </div>
                </div>
            </header>

            <section className="featured-spots">
                <div className="container">
                    <div className="section-title">
                        <h2>Amazing Spots For You</h2>
                        <p>Handpicked destinations that will take your breath away.</p>
                    </div>

                    <div className="spots-grid">
                        {spots.map(spot => (
                            <div key={spot.id} className="glass-card spot-card">
                                <img src={spot.img} alt={spot.name} className="spot-img" />
                                <div className="spot-info">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <h3>{spot.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24' }}>
                                            <Star size={16} fill="#fbbf24" />
                                            <span>{spot.rating}</span>
                                        </div>
                                    </div>
                                    <p style={{ marginBottom: '1.5rem' }}>{spot.desc}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>{spot.price}</span>
                                        <button className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}>
                                            Book Now <ArrowRight size={14} className="inline-block ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cta-section" style={{ background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Ready for your next adventure?</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto 3rem', color: 'var(--text-muted)' }}>
                        Join thousands of travelers who have found their dream destinations with VentureVibe.
                    </p>
                    <button className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>Get Started Today</button>
                </div>
            </section>
        </div>
    );
};

export default Home;
