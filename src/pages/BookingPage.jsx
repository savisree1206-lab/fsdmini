import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_DESTINATIONS } from './UserDashboard';
import { ArrowLeft, Star, MapPin, Calendar, CreditCard, ShieldCheck, Download, Ticket } from 'lucide-react';
import { generateETicket } from '../utils/generateTicket';
import { addNotification } from '../utils/notificationUtils';
import './BookingPage.css';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [destination, setDestination] = useState(null);
    const [guests, setGuests] = useState(1);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guide, setGuide] = useState('none');
    const [vehicle, setVehicle] = useState('flight');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    useEffect(() => {
        const dest = MOCK_DESTINATIONS.find(d => d.id === parseInt(id));
        if (dest) setDestination(dest);
        else navigate('/user-dashboard'); // If not found, go back
    }, [id, navigate]);

    if (!destination) return null;

    const basePrice = parseInt(destination.price.replace('₹', '').replace(/,/g, ''));
    
    let guideCost = 0;
    if (guide === 'local') guideCost = 2000 * guests;
    if (guide === 'premium') guideCost = 5000 * guests;

    let vehicleCost = 0;
    if (vehicle === 'flight') vehicleCost = 10000 * guests;
    if (vehicle === 'train') vehicleCost = 3000 * guests;
    if (vehicle === 'car') vehicleCost = 5000;
    if (vehicle === 'bus') vehicleCost = 2000 * guests;

    const subTotal = (basePrice * guests) + guideCost + vehicleCost;
    const taxes = subTotal * 0.1;
    const finalTotal = subTotal + taxes;

    const handleConfirmBooking = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate an API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            
            // Generate Booking Record and save to local storage
            const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            const newBooking = {
                ...destination,
                bookingId: Date.now(),
                guests,
                checkIn,
                checkOut,
                guide,
                vehicle,
                total: finalTotal
            };
            existingBookings.push(newBooking);
            localStorage.setItem('bookings', JSON.stringify(existingBookings));
            setConfirmedBooking(newBooking);
            addNotification('success', 'Booking Confirmed!', `Your trip to ${newBooking.name} (${newBooking.checkIn} → ${newBooking.checkOut}) is confirmed. Booking ID: #${newBooking.bookingId}`);

            setTimeout(() => {
                navigate('/user-dashboard'); 
            }, 12000);
        }, 1500);
    };

    const handleDownloadTicket = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        generateETicket(confirmedBooking, user);
    };

    if (success && confirmedBooking) {
        return (
            <div className="booking-success-page">
                <div className="success-card glass-card">
                    <div className="success-icon-wrapper">
                        <ShieldCheck size={48} className="success-icon" />
                    </div>
                    <h2>🎉 Booking Confirmed!</h2>
                    <p>Your trip to <strong>{confirmedBooking.name}</strong> is all set.</p>

                    {/* Booking Summary */}
                    <div className="ticket-summary">
                        <div className="ticket-row">
                            <span>Booking ID</span>
                            <strong>#{confirmedBooking.bookingId}</strong>
                        </div>
                        <div className="ticket-row">
                            <span>Check-in</span>
                            <strong>{confirmedBooking.checkIn}</strong>
                        </div>
                        <div className="ticket-row">
                            <span>Check-out</span>
                            <strong>{confirmedBooking.checkOut}</strong>
                        </div>
                        <div className="ticket-row">
                            <span>Guests</span>
                            <strong>{confirmedBooking.guests}</strong>
                        </div>
                        <div className="ticket-row">
                            <span>Transport</span>
                            <strong style={{ textTransform: 'capitalize' }}>{confirmedBooking.vehicle}</strong>
                        </div>
                        <div className="ticket-row ticket-total">
                            <span>Total Paid</span>
                            <strong>₹{confirmedBooking.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
                        </div>
                    </div>

                    {/* Download Button */}
                    <button className="download-ticket-btn" onClick={handleDownloadTicket}>
                        <Download size={18} />
                        Download E-Ticket (PDF)
                    </button>

                    <p className="redirect-note">Redirecting to dashboard in a few seconds...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <div className="booking-header-img" style={{ backgroundImage: `url(${destination.image})` }}>
                <div className="booking-overlay"></div>
                <button className="back-btn" onClick={() => navigate('/user-dashboard')}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                <div className="booking-hero-content">
                    <span className="booking-tag">{destination.tag}</span>
                    <h1>{destination.name}</h1>
                    <div className="booking-meta">
                        <span><Star size={16} className="star-icon" /> {destination.rating} Rating</span>
                        <span><MapPin size={16} /> Premium Location</span>
                        <span><Calendar size={16} /> {destination.duration} Trip</span>
                    </div>
                </div>
            </div>

            <div className="booking-content container">
                <div className="booking-grid">
                    <div className="booking-details-form">
                        <FragmentoForm />
                        <h2 className="section-title">Configure Your Trip</h2>
                        <form className="trip-form" onSubmit={handleConfirmBooking}>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Check-in Date</label>
                                    <input type="date" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label>Check-out Date</label>
                                    <input type="date" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                                </div>
                            </div>
                            
                            <div className="form-row" style={{ marginBottom: '1rem' }}>
                                <div className="input-group">
                                    <label>Tour Guide</label>
                                    <select value={guide} onChange={(e) => setGuide(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', marginTop: '0.5rem' }}>
                                        <option value="none" style={{ color: 'black' }}>No Guide Needed</option>
                                        <option value="local" style={{ color: 'black' }}>Local Expert Guide</option>
                                        <option value="premium" style={{ color: 'black' }}>Premium Private Guide</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Vehicle Type</label>
                                    <select value={vehicle} onChange={(e) => setVehicle(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', marginTop: '0.5rem' }}>
                                        <option value="flight" style={{ color: 'black' }}>Flight</option>
                                        <option value="train" style={{ color: 'black' }}>Train</option>
                                        <option value="car" style={{ color: 'black' }}>Rental Car</option>
                                        <option value="bus" style={{ color: 'black' }}>Luxury Bus</option>
                                        <option value="none" style={{ color: 'black' }}>Self-Arranged Transport</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>Number of Guests</label>
                                    <div className="guest-selector">
                                        <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))}>-</button>
                                        <span>{guests}</span>
                                        <button type="button" onClick={() => setGuests(Math.min(10, guests + 1))}>+</button>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Special Requests (Optional)</label>
                                    <input type="text" placeholder="e.g. Vegetarian meals" />
                                </div>
                            </div>

                            <hr className="divider" />
                            
                            <h3 className="sub-title">Payment Method</h3>
                            <div className="payment-options">
                                <label className="payment-radio">
                                    <input type="radio" name="payment" defaultChecked />
                                    <CreditCard size={18} /> Credit Card
                                </label>
                                <label className="payment-radio">
                                    <input type="radio" name="payment" />
                                    PayPal
                                </label>
                            </div>

                            <div className="input-group cc-details">
                                <label>Card Number</label>
                                <input type="text" placeholder="XXXX XXXX XXXX XXXX" required />
                                <div className="form-row" style={{ marginTop: '1rem' }}>
                                    <input type="text" placeholder="MM/YY" required style={{ width: '48%' }} />
                                    <input type="text" placeholder="CVC" required style={{ width: '48%' }} />
                                </div>
                            </div>

                            <button type="submit" className="confirm-btn" disabled={loading}>
                                {loading ? <span className="spinner" /> : 'Confirm & Pay'}
                            </button>
                        </form>
                    </div>

                    <div className="booking-summary-sidebar">
                        <div className="summary-card glass-card">
                            <h3>Price Summary</h3>
                            <div className="summary-row">
                                <span>{destination.price} x {guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                                <span>₹{(basePrice * guests).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                            </div>
                            {guideCost > 0 && (
                                <div className="summary-row">
                                    <span style={{ textTransform: 'capitalize' }}>{guide} Guide</span>
                                    <span>₹{guideCost.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            {vehicleCost > 0 && (
                                <div className="summary-row">
                                    <span style={{ textTransform: 'capitalize' }}>{vehicle} Transport</span>
                                    <span>₹{vehicleCost.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="summary-row">
                                <span>Taxes & Fees (10%)</span>
                                <span>₹{taxes.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                            </div>
                            <hr className="divider" />
                            <div className="summary-total">
                                <span>Total</span>
                                <span>₹{finalTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                            </div>
                            
                            <div className="guarantee">
                                <ShieldCheck size={20} className="shield-icon" />
                                <div>
                                    <h4>Secure Booking</h4>
                                    <p>Your payment information is encrypted and securely processed.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FragmentoForm = () => null; // Dummy to prevent error if needed

export default BookingPage;
