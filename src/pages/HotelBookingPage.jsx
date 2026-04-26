import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Calendar, Users, CreditCard, ShieldCheck, Download, CheckCircle } from 'lucide-react';
import { addNotification } from '../utils/notificationUtils';
import { generateETicket } from '../utils/generateTicket';
import './BookingPage.css'; // reuse same styles

const HotelBookingPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { hotel, checkIn: preCheckIn, checkOut: preCheckOut, rooms: preRooms } = location.state || {};

  const [user, setUser]           = useState(null);
  const [checkIn, setCheckIn]     = useState(preCheckIn  || '');
  const [checkOut, setCheckOut]   = useState(preCheckOut || '');
  const [rooms, setRooms]         = useState(preRooms    || 1);
  const [guests, setGuests]       = useState(1);
  const [payMethod, setPayMethod] = useState('card');
  const [loading, setLoading]     = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { navigate('/login'); return; }
    setUser(JSON.parse(u));
    if (!hotel) navigate('/user-dashboard');
  }, [navigate, hotel]);

  if (!hotel || !user) return null;

  // Calculate nights & total
  const nights = (checkIn && checkOut)
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 1;
  const total = hotel.price * rooms * nights;

  const handleBook = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const bookingId = Date.now();
      const newBooking = {
        bookingId,
        type:      'hotel',
        name:      hotel.name,
        image:     hotel.img,
        city:      hotel.city,
        stars:     hotel.stars,
        amenities: hotel.amenities,
        checkIn,
        checkOut,
        nights,
        rooms,
        guests,
        total,
        vehicle:   'N/A',
        guide:     'none',
        duration:  `${nights} Night${nights > 1 ? 's' : ''}`,
        tag:       `${hotel.stars}★ Hotel`,
        status:    'confirmed',
      };

      const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
      existing.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(existing));

      addNotification(
        'success',
        'Hotel Booking Confirmed!',
        `Your stay at ${hotel.name}, ${hotel.city} (${checkIn} → ${checkOut}) is confirmed. Booking ID: #${bookingId}`
      );

      setLoading(false);
      setConfirmed(newBooking);
    }, 1500);
  };

  const handleDownloadTicket = () => {
    generateETicket(confirmed, user);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="booking-page">
        <div className="booking-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <div className="success-card" style={{ textAlign: 'center' }}>
            <div className="success-icon"><CheckCircle size={56} /></div>
            <h2 className="success-title">Booking Confirmed!</h2>
            <p className="success-subtitle">Your hotel stay has been successfully booked.</p>

            <div className="ticket-summary">
              <div className="ticket-row"><span>Hotel</span><strong>{confirmed.name}</strong></div>
              <div className="ticket-row"><span>City</span><strong>{confirmed.city}</strong></div>
              <div className="ticket-row"><span>Check-in</span><strong>{confirmed.checkIn}</strong></div>
              <div className="ticket-row"><span>Check-out</span><strong>{confirmed.checkOut}</strong></div>
              <div className="ticket-row"><span>Nights</span><strong>{confirmed.nights}</strong></div>
              <div className="ticket-row"><span>Rooms</span><strong>{confirmed.rooms}</strong></div>
              <div className="ticket-row ticket-total">
                <span>Total Paid</span>
                <strong>₹{confirmed.total.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <button className="download-ticket-btn" onClick={handleDownloadTicket}>
              <Download size={18} /> Download E-Ticket (PDF)
            </button>

            <button
              onClick={() => navigate('/user-dashboard')}
              style={{ marginTop: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', borderRadius: '0.75rem', padding: '0.75rem 2rem', cursor: 'pointer', width: '100%', fontFamily: 'inherit', fontSize: '0.95rem' }}
            >
              Go to My Bookings
            </button>
            <p className="redirect-note">Check your bookings in the dashboard anytime.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Booking form ────────────────────────────────────────────────────────────
  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Back */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back to Search
        </button>

        <div className="booking-grid">
          {/* ── Left: Hotel Details ── */}
          <div className="destination-details">
            <div className="destination-image-wrap">
              <img src={hotel.img} alt={hotel.name} className="destination-image" />
              <div className="destination-overlay">
                <span className="destination-badge">{hotel.stars}★ Hotel</span>
              </div>
            </div>

            <div className="destination-info">
              <h2>{hotel.name}</h2>
              <div className="destination-meta">
                <span><MapPin size={14} /> {hotel.city}</span>
                <span style={{ display:'flex', alignItems:'center', gap:'4px', color:'#f59e0b' }}>
                  <Star size={14} fill="#f59e0b" /> {hotel.rating}
                </span>
              </div>

              <div className="destination-tags" style={{ marginTop:'1rem', display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                {hotel.amenities.map(a => (
                  <span key={a} style={{ background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)', color:'#818cf8', padding:'0.3rem 0.75rem', borderRadius:'999px', fontSize:'0.8rem' }}>{a}</span>
                ))}
              </div>

              <div className="price-breakdown" style={{ marginTop:'1.5rem' }}>
                <div className="price-item">
                  <span>Price per night</span>
                  <strong>₹{hotel.price.toLocaleString('en-IN')}</strong>
                </div>
                <div className="price-item">
                  <span>Rooms × Nights</span>
                  <strong>{rooms} × {nights}</strong>
                </div>
                <div className="price-item price-total">
                  <span>Total</span>
                  <strong>₹{total.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Booking Form ── */}
          <div className="booking-form-section">
            <h3 className="form-title"><CreditCard size={20} /> Complete Your Booking</h3>

            <div className="form-group">
              <label><Calendar size={15} /> Check-in Date</label>
              <input
                type="date"
                className="form-input"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setCheckIn(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><Calendar size={15} /> Check-out Date</label>
              <input
                type="date"
                className="form-input"
                value={checkOut}
                min={checkIn || new Date().toISOString().split('T')[0]}
                onChange={e => setCheckOut(e.target.value)}
              />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div className="form-group">
                <label><Users size={15} /> Rooms</label>
                <select className="form-input" value={rooms} onChange={e => setRooms(Number(e.target.value))}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Room{n>1?'s':''}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label><Users size={15} /> Guests</label>
                <select className="form-input" value={guests} onChange={e => setGuests(Number(e.target.value))}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label><CreditCard size={15} /> Payment Method</label>
              <div className="payment-options">
                {['card','upi','netbanking'].map(m => (
                  <button
                    key={m}
                    className={`payment-option ${payMethod === m ? 'selected' : ''}`}
                    onClick={() => setPayMethod(m)}
                  >
                    {m === 'card' ? '💳 Credit/Debit Card' : m === 'upi' ? '📱 UPI' : '🏦 Net Banking'}
                  </button>
                ))}
              </div>
            </div>

            <div className="booking-summary-box">
              <div className="summary-row"><span>Hotel</span><strong>{hotel.name}</strong></div>
              <div className="summary-row"><span>Check-in</span><strong>{checkIn || '—'}</strong></div>
              <div className="summary-row"><span>Check-out</span><strong>{checkOut || '—'}</strong></div>
              <div className="summary-row"><span>Duration</span><strong>{nights} night{nights>1?'s':''}</strong></div>
              <div className="summary-row"><span>Rooms</span><strong>{rooms}</strong></div>
              <div className="summary-row summary-total">
                <span>Total</span><strong>₹{total.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="trust-badges">
              <span><ShieldCheck size={14} /> Secure Payment</span>
              <span><ShieldCheck size={14} /> Instant Confirmation</span>
              <span><ShieldCheck size={14} /> Free Cancellation</span>
            </div>

            <button className="confirm-btn" onClick={handleBook} disabled={loading}>
              {loading ? 'Processing...' : `Confirm & Pay ₹${total.toLocaleString('en-IN')}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingPage;
