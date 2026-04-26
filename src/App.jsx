import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Plane, MapPin, Phone, Info, User, LogIn, Menu, X } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import BookingPage from './pages/BookingPage';
import HotelBookingPage from './pages/HotelBookingPage';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Don't render Navbar on standalone dashboard/booking pages
  const hideRoutes = ['/user-dashboard', '/book', '/book-hotel'];
  if (hideRoutes.some(path => location.pathname.startsWith(path))) return null;

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="container nav-content">
        <Link to="/" className="logo">
          <Plane className="inline-block mr-2" style={{ color: 'var(--accent)' }} />
          <span>VentureVibe</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
          <div className="auth-btns">
            <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Login</Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  const hideRoutes = ['/user-dashboard', '/book'];
  if (hideRoutes.some(path => location.pathname.startsWith(path))) return null;

  return (
    <footer>
      <div className="container">
        <div className="logo" style={{ marginBottom: '1rem' }}>VentureVibe</div>
        <p>&copy; 2026 VentureVibe. Explore the world with style.</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <a href="#" className="nav-link">Instagram</a>
          <a href="#" className="nav-link">Twitter</a>
          <a href="#" className="nav-link">Facebook</a>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/book-hotel" element={<HotelBookingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
