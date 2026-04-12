import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, MapPin, Calendar, Star, Compass, Filter, Search, Heart, LogOut } from 'lucide-react';
import './UserDashboard.css';

export const MOCK_DESTINATIONS = [
  {
    id: 1,
    name: 'Santorini, Greece',
    image: 'https://picsum.photos/id/1047/600/400',
    price: '₹95,000',
    rating: 4.8,
    duration: '5 Days',
    tag: 'Popular'
  },
  {
    id: 2,
    name: 'Bali, Indonesia',
    image: 'https://picsum.photos/id/1015/600/400',
    price: '₹70,000',
    rating: 4.9,
    duration: '7 Days',
    tag: 'Trending'
  },
  {
    id: 3,
    name: 'Kyoto, Japan',
    image: 'https://picsum.photos/id/1043/600/400',
    price: '₹1,25,000',
    rating: 4.7,
    duration: '6 Days',
    tag: 'Cultural'
  },
  {
    id: 4,
    name: 'Amalfi Coast, Italy',
    image: 'https://picsum.photos/id/1040/600/400',
    price: '₹1,75,000',
    rating: 4.9,
    duration: '4 Days',
    tag: 'Luxury'
  },
  {
    id: 5,
    name: 'Swiss Alps, Switzerland',
    image: 'https://picsum.photos/id/1036/600/400',
    price: '₹1,45,000',
    rating: 4.8,
    duration: '5 Days',
    tag: 'Adventure'
  },
  {
    id: 6,
    name: 'Maldives',
    image: 'https://picsum.photos/id/1055/600/400',
    price: '₹2,05,000',
    rating: 5.0,
    duration: '7 Days',
    tag: 'Romantic'
  }
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('discover'); // discover, bookings, favorites
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
  const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem('bookings') || '[]'));

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      const updatedBookings = bookings.filter(b => b.bookingId !== bookingId);
      setBookings(updatedBookings);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    }
  };

  const favoriteDestinations = MOCK_DESTINATIONS.filter(dest => favorites.includes(dest.id));

  const categories = ['All', 'Popular', 'Trending', 'Cultural', 'Luxury', 'Adventure', 'Romantic'];

  const filteredDestinations = MOCK_DESTINATIONS.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || dest.tag === activeFilter;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null; // Or a beautiful loading spinner

  return (
    <div className="dashboard-container">
      {/* Sidebar / Top Navigation (Responsive) */}
      <div className="dashboard-sidebar">
        <div className="sidebar-brand">
          <Plane size={32} className="brand-icon" />
          <span>VentureVibe</span>
        </div>
        
        <div className="sidebar-menu">
          <button 
            className={`menu-btn ${activeTab === 'discover' ? 'active' : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            <Compass size={20} /> Discover
          </button>
          <button 
            className={`menu-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={20} /> My Bookings
          </button>
          <button 
            className={`menu-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart size={20} /> Favorites
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="user-details">
              <h4>{user.name || 'Traveler'}</h4>
              <p>{user.email}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="main-header">
          <div>
            <h1>Welcome back, {user.name?.split(' ')[0] || 'Traveler'}! 🌍</h1>
            <p>Ready for your next adventure?</p>
          </div>
          <div className="header-actions">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search destinations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        {activeTab === 'discover' && (
          <div className="content-area animate-fade-in">
            <div className="section-title">
              <h2>Trending Destinations</h2>
            </div>

            {/* Filter Widgets */}
            <div className="filter-widgets">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`filter-chip ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="destinations-grid">
              {filteredDestinations.length > 0 ? filteredDestinations.map((dest) => (
                <div key={dest.id} className="destination-card glass-card">
                  <div className="card-image-wrapper">
                    <img src={dest.image} alt={dest.name} className="card-image" />
                    <span className="tag">{dest.tag}</span>
                    <button className="favorite-btn" onClick={() => toggleFavorite(dest.id)}>
                      <Heart size={18} fill={favorites.includes(dest.id) ? '#ef4444' : 'none'} color={favorites.includes(dest.id) ? '#ef4444' : 'currentColor'} />
                    </button>
                  </div>
                  <div className="card-content">
                    <div className="card-header">
                      <h3>{dest.name}</h3>
                      <div className="rating">
                        <Star size={14} className="star-icon" /> {dest.rating}
                      </div>
                    </div>
                    <div className="card-details">
                      <span className="duration"><Calendar size={14} /> {dest.duration}</span>
                    </div>
                    <div className="card-footer">
                      <div className="price">
                        <span className="amount">{dest.price}</span>
                        <span className="unit">/ person</span>
                      </div>
                      <button className="book-btn" onClick={() => navigate('/book/' + dest.id)}>Book Now</button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="no-results">No destinations match your search or filter.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="content-area animate-fade-in">
            <h2>Your Bookings</h2>
            {bookings.length > 0 ? (
              <div className="destinations-grid">
                {bookings.map((booking, idx) => (
                  <div key={idx} className="destination-card glass-card">
                    <div className="card-image-wrapper">
                      <img src={booking.image} alt={booking.name} className="card-image" />
                      <span className="tag" style={{ background: '#22c55e' }}>Confirmed</span>
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <h3 style={{ fontSize: '1.2rem' }}>{booking.name}</h3>
                      </div>
                      <div className="card-details">
                        <span className="duration" style={{ color: 'var(--text-muted)' }}><Calendar size={14} /> {booking.checkIn} to {booking.checkOut}</span>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <span><strong>Transport:</strong> <span style={{ textTransform: 'capitalize' }}>{booking.vehicle}</span></span>
                          <span><strong>Guide:</strong> <span style={{ textTransform: 'capitalize' }}>{booking.guide}</span></span>
                        </div>
                      </div>
                      <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="price">
                          <span className="amount">₹{booking.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                          <span className="unit">/ {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                        </div>
                        <button 
                          className="btn-outline" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)' }}
                          onClick={() => handleCancelBooking(booking.bookingId)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Calendar size={64} className="empty-icon" />
                <h3>No upcoming trips yet!</h3>
                <p>Explore our destinations and start planning your next getaway.</p>
                <button className="btn-primary" onClick={() => setActiveTab('discover')} style={{ padding: '0.8rem 2rem', marginTop: '1rem' }}>
                  Explore Destinations
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="content-area animate-fade-in">
            <h2>Saved Favorites</h2>
            {favoriteDestinations.length > 0 ? (
              <div className="destinations-grid">
                {favoriteDestinations.map((dest) => (
                  <div key={dest.id} className="destination-card glass-card">
                    <div className="card-image-wrapper">
                      <img src={dest.image} alt={dest.name} className="card-image" />
                      <span className="tag">{dest.tag}</span>
                      <button className="favorite-btn" onClick={() => toggleFavorite(dest.id)}>
                        <Heart size={18} fill="#ef4444" color="#ef4444" />
                      </button>
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <h3>{dest.name}</h3>
                        <div className="rating">
                          <Star size={14} className="star-icon" /> {dest.rating}
                        </div>
                      </div>
                      <div className="card-details">
                        <span className="duration"><Calendar size={14} /> {dest.duration}</span>
                      </div>
                      <div className="card-footer">
                        <div className="price">
                          <span className="amount">{dest.price}</span>
                          <span className="unit">/ person</span>
                        </div>
                        <button className="book-btn" onClick={() => navigate('/book/' + dest.id)}>Book Now</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Heart size={64} className="empty-icon" />
                <h3>Your wishlist is empty</h3>
                <p>Save your favorite spots to easily find them later.</p>
                <button className="btn-primary" onClick={() => setActiveTab('discover')} style={{ padding: '0.8rem 2rem', marginTop: '1rem' }}>
                  Discover Places
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
