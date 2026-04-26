import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane, Calendar, Star, Compass, Search, Heart, LogOut,
  Download, Bell, X, AlertTriangle, CheckCircle, Clock,
  RefreshCw, MapPin, ChevronRight
} from 'lucide-react';
import { generateETicket } from '../utils/generateTicket';
import { getNotifications, addNotification, markAsRead, markAllRead, clearNotification } from '../utils/notificationUtils';
import SearchTab from './SearchTab';
import './UserDashboard.css';

// ── Mock Destinations ─────────────────────────────────────────────────────────
export const MOCK_DESTINATIONS = [
  { id: 1, name: 'Santorini, Greece',      image: 'https://picsum.photos/id/1047/600/400', price: '₹95,000',   rating: 4.8, duration: '5 Days', tag: 'Popular'   },
  { id: 2, name: 'Bali, Indonesia',         image: 'https://picsum.photos/id/1015/600/400', price: '₹70,000',   rating: 4.9, duration: '7 Days', tag: 'Trending'  },
  { id: 3, name: 'Kyoto, Japan',            image: 'https://picsum.photos/id/1043/600/400', price: '₹1,25,000', rating: 4.7, duration: '6 Days', tag: 'Cultural'  },
  { id: 4, name: 'Amalfi Coast, Italy',     image: 'https://picsum.photos/id/1040/600/400', price: '₹1,75,000', rating: 4.9, duration: '4 Days', tag: 'Luxury'    },
  { id: 5, name: 'Swiss Alps, Switzerland', image: 'https://picsum.photos/id/1036/600/400', price: '₹1,45,000', rating: 4.8, duration: '5 Days', tag: 'Adventure' },
  { id: 6, name: 'Maldives',                image: 'https://picsum.photos/id/1055/600/400', price: '₹2,05,000', rating: 5.0, duration: '7 Days', tag: 'Romantic'  },
];

// ── Itinerary Templates ───────────────────────────────────────────────────────
const ITIN_TEMPLATES = [
  { title: 'Arrival & Check-in',  emoji: '🛬', activities: ['Airport/station pickup', 'Hotel check-in & orientation', 'Welcome briefing & travel tips', 'Welcome dinner at local restaurant'] },
  { title: 'City Exploration',    emoji: '🗺️', activities: ['Breakfast at hotel', 'Guided sightseeing tour', 'Landmark & monument visits', 'Shopping at local market'] },
  { title: 'Cultural Immersion',  emoji: '🎭', activities: ['Traditional breakfast experience', 'Heritage site & museum tour', 'Local craft workshop', 'Folk music evening'] },
  { title: 'Nature & Adventure',  emoji: '🌿', activities: ['Early morning nature walk', 'Scenic viewpoint photography', 'Outdoor picnic lunch', 'Sunset relaxation'] },
  { title: 'Leisure & Wellness',  emoji: '🧘', activities: ['Relaxed morning & spa session', 'Pool/beach leisure', 'Optional half-day excursion', 'Fine dining dinner'] },
  { title: 'Day Excursion',       emoji: '🚌', activities: ['Full-day excursion to nearby attraction', 'Countryside/island tour', 'Street food tasting', 'Souvenir shopping'] },
  { title: 'Departure Day',       emoji: '🛫', activities: ['Hotel checkout & luggage', 'Last-minute sightseeing', 'Transfer to airport/station', 'Farewell & journey home'] },
];

function buildItinerary(booking) {
  const days = parseInt(booking.duration) || 5;
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    ...ITIN_TEMPLATES[Math.min(i, ITIN_TEMPLATES.length - 1)],
  }));
}

// ── Refund Policy ─────────────────────────────────────────────────────────────
function calcRefund(booking) {
  const days = Math.ceil((new Date(booking.checkIn) - new Date()) / 86400000);
  if (days >= 7)  return { pct: 90, policy: '90% refund — cancelled 7+ days before trip', days };
  if (days >= 3)  return { pct: 50, policy: '50% refund — cancelled 3–6 days before trip', days };
  return            { pct: 20, policy: '20% refund — cancelled within 72 hours',          days };
}

// ── Relative Time ─────────────────────────────────────────────────────────────
function relTime(iso) {
  const m = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Notification icon ─────────────────────────────────────────────────────────
const NotifIcon = ({ type }) => {
  if (type === 'success') return <CheckCircle size={16} />;
  if (type === 'warning') return <Clock size={16} />;
  if (type === 'error')   return <AlertTriangle size={16} />;
  if (type === 'refund')  return <RefreshCw size={16} />;
  return <Bell size={16} />;
};

// ═════════════════════════════════════════════════════════════════════════════
const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser]             = useState(null);
  const [activeTab, setActiveTab]   = useState('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [favorites, setFavorites]   = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
  const [bookings, setBookings]     = useState(() => JSON.parse(localStorage.getItem('bookings')  || '[]'));
  const [notifications, setNotifs]  = useState(() => getNotifications());
  const [itinBooking, setItinBooking]   = useState(null);  // itinerary modal
  const [cancelTarget, setCancelTarget] = useState(null);  // cancel modal
  const [cancelDone, setCancelDone]     = useState(false);

  const activeBookings    = bookings.filter(b => b.status !== 'cancelled');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const unread            = notifications.filter(n => !n.read).length;
  const favDests          = MOCK_DESTINATIONS.filter(d => favorites.includes(d.id));
  const categories        = ['All', 'Popular', 'Trending', 'Cultural', 'Luxury', 'Adventure', 'Romantic'];
  const filtered          = MOCK_DESTINATIONS.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeFilter === 'All' || d.tag === activeFilter)
  );

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const ud    = localStorage.getItem('user');
    if (!token || !ud) { navigate('/login'); return; }
    try { setUser(JSON.parse(ud)); } catch { navigate('/login'); }
  }, [navigate]);

  // Upcoming trip reminders (fires once per booking)
  useEffect(() => {
    bookings.filter(b => b.status !== 'cancelled').forEach(b => {
      const days = Math.ceil((new Date(b.checkIn) - new Date()) / 86400000);
      if (days >= 0 && days <= 3) {
        const key = `notif_trip_${b.bookingId}`;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, '1');
          const msg = days === 0 ? 'starts today!' : `starts in ${days} day${days > 1 ? 's' : ''}!`;
          setNotifs(addNotification('warning', 'Upcoming Trip Reminder', `Your trip to ${b.name} ${msg} Get ready!`));
        }
      }
    });
  }, [bookings]);

  const toggleFavorite = id => {
    const upd = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(upd);
    localStorage.setItem('favorites', JSON.stringify(upd));
  };

  const openCancel = b => { setCancelDone(false); setCancelTarget(b); };
  const closeCancel = () => { setCancelTarget(null); setCancelDone(false); };

  const confirmCancel = () => {
    const { pct } = calcRefund(cancelTarget);
    const refundAmt = Math.round(cancelTarget.total * pct / 100);
    const upd = bookings.map(b =>
      b.bookingId === cancelTarget.bookingId
        ? { ...b, status: 'cancelled', refundAmount: refundAmt, refundStatus: 'Processing', cancelledAt: new Date().toISOString() }
        : b
    );
    setBookings(upd);
    localStorage.setItem('bookings', JSON.stringify(upd));
    addNotification('error',  'Booking Cancelled', `Your trip to ${cancelTarget.name} has been cancelled.`);
    addNotification('refund', 'Refund Initiated',  `Rs. ${refundAmt.toLocaleString('en-IN')} will be refunded within 5–7 business days.`);
    setNotifs(getNotifications());
    setCancelDone(true);
  };

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };

  const handleDownloadTicket = (booking) => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    generateETicket(booking, u);
  };

  if (!user) return null;

  // ── Sidebar tabs config ──────────────────────────────────────────────────
  const tabs = [
    { id: 'discover',      icon: <Compass size={20} />,  label: 'Discover' },
    { id: 'search',        icon: <Search size={20} />,   label: 'Search' },
    { id: 'bookings',      icon: <Calendar size={20} />, label: 'My Bookings' },
    { id: 'notifications', icon: <Bell size={20} />,     label: 'Notifications', badge: unread },
    { id: 'favorites',     icon: <Heart size={20} />,    label: 'Favorites' },
  ];

  return (
    <div className="dashboard-container">

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <div className="dashboard-sidebar">
        <div className="sidebar-brand">
          <Plane size={32} className="brand-icon" />
          <span>VentureVibe</span>
        </div>

        <div className="sidebar-menu">
          {tabs.map(t => (
            <button key={t.id} className={`menu-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.icon} {t.label}
              {t.badge > 0 && <span className="notif-badge">{t.badge}</span>}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="user-details"><h4>{user.name || 'Traveler'}</h4><p>{user.email}</p></div>
          </div>
          <button className="logout-btn" onClick={handleLogout}><LogOut size={18} /> Logout</button>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main className="dashboard-main">
        <header className="main-header">
          <div>
            <h1>Welcome back, {user.name?.split(' ')[0] || 'Traveler'}! 🌍</h1>
            <p>Ready for your next adventure?</p>
          </div>
          <div className="header-actions">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search destinations..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </header>

        {/* ── SEARCH ────────────────────────────────────────────────── */}
        {activeTab === 'search' && (
          <div className="content-area animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem' }}>Search Flights & Hotels</h2>
            <SearchTab onBookHotel={(hotel, checkIn, checkOut, rooms) =>
              navigate('/book-hotel', { state: { hotel, checkIn, checkOut, rooms } })
            } />
          </div>
        )}

        {/* ── DISCOVER ──────────────────────────────────────────────── */}
        {activeTab === 'discover' && (
          <div className="content-area animate-fade-in">
            <div className="section-title"><h2>Trending Destinations</h2></div>
            <div className="filter-widgets">
              {categories.map(cat => (
                <button key={cat} className={`filter-chip ${activeFilter === cat ? 'active' : ''}`} onClick={() => setActiveFilter(cat)}>{cat}</button>
              ))}
            </div>
            <div className="destinations-grid">
              {filtered.length > 0 ? filtered.map(dest => (
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
                      <div className="rating"><Star size={14} className="star-icon" /> {dest.rating}</div>
                    </div>
                    <div className="card-details"><span className="duration"><Calendar size={14} /> {dest.duration}</span></div>
                    <div className="card-footer">
                      <div className="price"><span className="amount">{dest.price}</span><span className="unit">/ person</span></div>
                      <button className="book-btn" onClick={() => navigate('/book/' + dest.id)}>Book Now</button>
                    </div>
                  </div>
                </div>
              )) : <div className="no-results">No destinations match your search or filter.</div>}
            </div>
          </div>
        )}

        {/* ── MY BOOKINGS ───────────────────────────────────────────── */}
        {activeTab === 'bookings' && (
          <div className="content-area animate-fade-in">
            <h2>My Bookings</h2>

            {/* Active Bookings */}
            {activeBookings.length > 0 && (
              <>
                <p className="bookings-sub">Active Trips ({activeBookings.length})</p>
                <div className="destinations-grid">
                  {activeBookings.map((b, i) => (
                    <div key={i} className="destination-card glass-card">
                      <div className="card-image-wrapper">
                        <img src={b.image} alt={b.name} className="card-image" />
                        <span className="tag" style={{ background: '#22c55e' }}>Confirmed</span>
                      </div>
                      <div className="card-content">
                        <div className="card-header"><h3 style={{ fontSize: '1.1rem' }}>{b.name}</h3></div>
                        <div className="card-details">
                          <span className="duration"><Calendar size={14} /> {b.checkIn} → {b.checkOut}</span>
                          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            <span><strong>Transport:</strong> <span style={{ textTransform: 'capitalize' }}>{b.vehicle}</span></span>
                            <span><strong>Guests:</strong> {b.guests}</span>
                          </div>
                        </div>
                        <div className="card-footer" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div className="price">
                            <span className="amount">₹{b.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <button className="btn-outline btn-itin" onClick={() => setItinBooking(b)}>
                              <ChevronRight size={13} /> Itinerary
                            </button>
                            <button className="btn-outline btn-ticket" onClick={() => handleDownloadTicket(b)}>
                              <Download size={13} /> E-Ticket
                            </button>
                            <button className="btn-outline btn-cancel" onClick={() => openCancel(b)}>Cancel</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Cancelled Bookings */}
            {cancelledBookings.length > 0 && (
              <>
                <p className="bookings-sub" style={{ marginTop: '2rem' }}>Cancelled Trips ({cancelledBookings.length})</p>
                <div className="destinations-grid">
                  {cancelledBookings.map((b, i) => (
                    <div key={i} className="destination-card glass-card cancelled-card">
                      <div className="card-image-wrapper">
                        <img src={b.image} alt={b.name} className="card-image" style={{ filter: 'grayscale(60%)' }} />
                        <span className="tag" style={{ background: '#ef4444' }}>Cancelled</span>
                      </div>
                      <div className="card-content">
                        <div className="card-header"><h3 style={{ fontSize: '1.1rem', opacity: 0.7 }}>{b.name}</h3></div>
                        <div className="card-details">
                          <span className="duration"><Calendar size={14} /> {b.checkIn} → {b.checkOut}</span>
                        </div>
                        <div className="refund-status-box">
                          <div className="refund-row">
                            <span>Refund Amount</span>
                            <strong style={{ color: '#4ade80' }}>₹{(b.refundAmount || 0).toLocaleString('en-IN')}</strong>
                          </div>
                          <div className="refund-row">
                            <span>Refund Status</span>
                            <span className="refund-badge processing"><RefreshCw size={11} /> {b.refundStatus}</span>
                          </div>
                          <div className="refund-row">
                            <span>Estimated</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>5–7 business days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeBookings.length === 0 && cancelledBookings.length === 0 && (
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

        {/* ── NOTIFICATIONS ─────────────────────────────────────────── */}
        {activeTab === 'notifications' && (
          <div className="content-area animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Notifications {unread > 0 && <span className="notif-count-label">{unread} unread</span>}</h2>
              {notifications.length > 0 && (
                <button className="btn-outline" style={{ fontSize: '0.82rem', padding: '0.4rem 1rem' }} onClick={() => setNotifs(markAllRead())}>
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={64} className="empty-icon" />
                <h3>No notifications yet</h3>
                <p>Book a trip to see your travel alerts here.</p>
              </div>
            ) : (
              <div className="notif-list">
                {notifications.map(n => (
                  <div key={n.id} className={`notif-item notif-${n.type} ${n.read ? 'read' : 'unread'}`} onClick={() => setNotifs(markAsRead(n.id))}>
                    <div className="notif-icon-wrap"><NotifIcon type={n.type} /></div>
                    <div className="notif-body">
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-msg">{n.message}</div>
                      <div className="notif-time">{relTime(n.timestamp)}</div>
                    </div>
                    {!n.read && <span className="notif-dot" />}
                    <button className="notif-close" onClick={e => { e.stopPropagation(); setNotifs(clearNotification(n.id)); }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── FAVORITES ─────────────────────────────────────────────── */}
        {activeTab === 'favorites' && (
          <div className="content-area animate-fade-in">
            <h2>Saved Favorites</h2>
            {favDests.length > 0 ? (
              <div className="destinations-grid">
                {favDests.map(dest => (
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
                        <div className="rating"><Star size={14} className="star-icon" /> {dest.rating}</div>
                      </div>
                      <div className="card-details"><span className="duration"><Calendar size={14} /> {dest.duration}</span></div>
                      <div className="card-footer">
                        <div className="price"><span className="amount">{dest.price}</span><span className="unit">/ person</span></div>
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

      {/* ── ITINERARY MODAL ───────────────────────────────────────── */}
      {itinBooking && (
        <div className="modal-overlay" onClick={() => setItinBooking(null)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>📋 Itinerary</h3>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{itinBooking.name} · {itinBooking.duration}</p>
              </div>
              <button className="modal-close" onClick={() => setItinBooking(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="itin-trip-info">
                <span><MapPin size={14} /> {itinBooking.name}</span>
                <span><Calendar size={14} /> {itinBooking.checkIn} → {itinBooking.checkOut}</span>
                <span>Transport: <strong style={{ textTransform: 'capitalize' }}>{itinBooking.vehicle}</strong></span>
              </div>
              <div className="itin-days">
                {buildItinerary(itinBooking).map(day => (
                  <div key={day.day} className="itin-day-card">
                    <div className="itin-day-header">
                      <span className="itin-day-badge">Day {day.day}</span>
                      <span className="itin-day-emoji">{day.emoji}</span>
                      <span className="itin-day-title">{day.title}</span>
                    </div>
                    <ul className="itin-activities">
                      {day.activities.map((act, ai) => (
                        <li key={ai}><ChevronRight size={12} className="itin-bullet" />{act}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CANCEL MODAL ──────────────────────────────────────────── */}
      {cancelTarget && (
        <div className="modal-overlay" onClick={closeCancel}>
          <div className="modal-panel modal-sm" onClick={e => e.stopPropagation()}>
            {!cancelDone ? (
              <>
                <div className="modal-header">
                  <h3><AlertTriangle size={18} style={{ color: '#f59e0b', marginRight: 8 }} />Cancel Booking</h3>
                  <button className="modal-close" onClick={closeCancel}><X size={20} /></button>
                </div>
                <div className="modal-body">
                  <p style={{ color: 'var(--text-muted)' }}>You are about to cancel your trip to:</p>
                  <div className="cancel-dest-name">{cancelTarget.name}</div>
                  <div className="cancel-dates"><Calendar size={14} /> {cancelTarget.checkIn} → {cancelTarget.checkOut}</div>

                  {(() => {
                    const { pct, policy } = calcRefund(cancelTarget);
                    const refundAmt = Math.round(cancelTarget.total * pct / 100);
                    return (
                      <div className="refund-policy-box">
                        <div className="rp-row"><span>Total Paid</span><strong>₹{cancelTarget.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong></div>
                        <div className="rp-row"><span>Refund ({pct}%)</span><strong style={{ color: '#4ade80' }}>₹{refundAmt.toLocaleString('en-IN')}</strong></div>
                        <div className="rp-policy"><AlertTriangle size={12} /> {policy}</div>
                        <div className="rp-timeline">Refund credited within 5–7 business days.</div>
                      </div>
                    );
                  })()}

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="btn-keep" onClick={closeCancel}>Keep Booking</button>
                    <button className="btn-confirm-cancel" onClick={confirmCancel}>Yes, Cancel Trip</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="modal-body" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
                <CheckCircle size={52} style={{ color: '#4ade80', margin: '0 auto 1rem' }} />
                <h3 style={{ color: '#fff', margin: '0 0 0.5rem' }}>Cancellation Confirmed</h3>
                <p style={{ color: 'var(--text-muted)' }}>Your refund is being processed and will be credited within 5–7 business days.</p>
                <button className="btn-keep" style={{ width: '100%', marginTop: '1.5rem' }} onClick={closeCancel}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;
