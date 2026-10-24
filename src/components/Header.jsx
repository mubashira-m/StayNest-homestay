import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  User, 
  Menu, 
  X, 
  Search, 
  Home as HomeIcon, 
  Compass, 
  MapPin, 
  Info, 
  PhoneCall, 
  PlusCircle, 
  Calendar,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import './Header.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="container header-container">
          {/* Logo */}
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon-wrapper">
              <svg viewBox="0 0 36 36" fill="none" className="logo-svg">
                <rect width="36" height="36" rx="10" fill="#1B3B2B" />
                <path d="M18 8L7 18H11V30H25V18H29L18 8Z" fill="#FAF7F2" />
                <circle cx="18" cy="22" r="3.5" fill="#C47444" />
              </svg>
            </div>
            <div className="logo-text-group">
              <span className="brand-name">StayNest</span>
              <span className="brand-tagline">Peaceful Homestays</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Home
            </NavLink>
            <NavLink to="/explore" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Explore
            </NavLink>
            <a href="/#destinations" className="nav-link" onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}>
              Destinations
            </a>
            <button className="nav-link nav-btn" onClick={() => setShowAboutModal(true)}>
              About
            </button>
            <button className="nav-link nav-btn" onClick={() => setShowContactModal(true)}>
              Contact
            </button>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="header-actions">
            {/* Quick Explore / Search Link */}
            <Link to="/explore" className="action-icon-btn" title="Explore Stays">
              <Search size={20} />
            </Link>

            {/* Wishlist Link with Badge */}
            <Link to="/profile" className="action-icon-btn wishlist-icon-btn" title="My Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="icon-badge">{wishlist.length}</span>
              )}
            </Link>

            {/* User Dropdown or Login Button */}
            {user ? (
              <div className="user-menu-wrapper">
                <button 
                  className="user-profile-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                >
                  <img src={user.avatar} alt={user.name} className="user-avatar-small" />
                  <span className="user-name-label">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`dropdown-arrow ${userDropdownOpen ? 'open' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown-menu">
                    <div className="user-dropdown-header">
                      <p className="user-full-name">{user.name}</p>
                      <p className="user-email-text">{user.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link 
                      to="/profile" 
                      className="dropdown-item" 
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User size={16} />
                      Profile & Wishlist
                    </Link>
                    <Link 
                      to="/bookings" 
                      className="dropdown-item" 
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Calendar size={16} />
                      My Bookings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-secondary btn-sm header-login-btn">
                <User size={16} />
                Sign In
              </Link>
            )}

            {/* List Your Property CTA */}
            <button 
              className="btn btn-primary btn-sm list-property-btn"
              onClick={() => setShowListModal(true)}
            >
              <PlusCircle size={16} />
              List Property
            </button>

            {/* Mobile Hamburger Button */}
            <button 
              className="mobile-hamburger-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-drawer-header">
            <span className="drawer-title">StayNest Menu</span>
            <button className="close-drawer-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={22} />
            </button>
          </div>
          <div className="mobile-nav-links">
            <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <HomeIcon size={18} />
              Home
            </Link>
            <Link to="/explore" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <Compass size={18} />
              Explore All Homestays
            </Link>
            <a 
              href="/#destinations" 
              className="mobile-nav-link" 
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <MapPin size={18} />
              Popular Destinations
            </a>
            <button 
              className="mobile-nav-link text-left" 
              onClick={() => {
                setMobileMenuOpen(false);
                setShowAboutModal(true);
              }}
            >
              <Info size={18} />
              About StayNest
            </button>
            <button 
              className="mobile-nav-link text-left" 
              onClick={() => {
                setMobileMenuOpen(false);
                setShowContactModal(true);
              }}
            >
              <PhoneCall size={18} />
              Host & Guest Support
            </button>
          </div>

          <div className="mobile-drawer-footer">
            {user ? (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <img src={user.avatar} alt={user.name} className="user-avatar-small" />
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
                <div className="mobile-user-actions">
                  <Link to="/profile" className="btn btn-secondary btn-sm" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/bookings" className="btn btn-secondary btn-sm" onClick={() => setMobileMenuOpen(false)}>
                    Bookings
                  </Link>
                  <button className="btn btn-sm text-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-actions">
                <Link to="/login" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                  Create Account
                </Link>
              </div>
            )}

            <button 
              className="btn btn-accent w-full mt-3"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowListModal(true);
              }}
            >
              <PlusCircle size={18} />
              List Your Property
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="mobile-backdrop" onClick={() => setMobileMenuOpen(false)}></div>
        )}
      </header>

      {/* List Your Property Modal */}
      {showListModal && (
        <div className="modal-backdrop" onClick={() => setShowListModal(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowListModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <div className="modal-icon-badge">🏡</div>
              <h3>List Your Homestay on StayNest</h3>
              <p>Turn your beautiful home into an unforgettable sanctuary for mindful travelers.</p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for your interest! Our homestay curator team will contact you within 24 hours to schedule a verification visit.");
              setShowListModal(false);
            }}>
              <div className="form-group">
                <label>Property Name</label>
                <input type="text" placeholder="e.g. Hilltop Cardamom Chalet" required />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Destination / City</label>
                  <input type="text" placeholder="e.g. Wayanad, Munnar" required />
                </div>
                <div className="form-group">
                  <label>Property Type</label>
                  <select defaultValue="Mountain Villa">
                    <option value="Mountain Villa">Mountain Villa</option>
                    <option value="Plantation Stay">Plantation Stay</option>
                    <option value="Heritage Home">Heritage Home</option>
                    <option value="Backwater Retreat">Backwater Retreat</option>
                    <option value="Beach Cottage">Beach Cottage</option>
                  </select>
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Host Full Name</label>
                  <input type="text" placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label>Phone / WhatsApp</label>
                  <input type="tel" placeholder="+91 98765 00000" required />
                </div>
              </div>
              <div className="form-group">
                <label>Expected Price per Night (₹)</label>
                <input type="number" placeholder="e.g. 4000" required />
              </div>
              <button type="submit" className="btn btn-primary w-full mt-2">
                Submit Listing Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="modal-backdrop" onClick={() => setShowAboutModal(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAboutModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <div className="modal-icon-badge">🍃</div>
              <h3>About StayNest</h3>
              <p>Curated homestays rooted in nature, warm hosts, and slow travel.</p>
            </div>
            <div className="modal-body-text">
              <p>
                StayNest was born from a simple belief: the best travel experiences do not happen in sterile hotel rooms, but around warm hearths, home-cooked breakfasts, and quiet verandahs overlooking mist-clad valleys.
              </p>
              <p>
                Every homestay in our handpicked collection is verified personally by our curators for warmth, authenticity, cleanliness, and ecological harmony.
              </p>
              <div className="about-stats-row">
                <div className="stat-box">
                  <strong>120+</strong>
                  <span>Verified Stays</span>
                </div>
                <div className="stat-box">
                  <strong>98%</strong>
                  <span>Superhost Rating</span>
                </div>
                <div className="stat-box">
                  <strong>15k+</strong>
                  <span>Peaceful Trips</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Support Modal */}
      {showContactModal && (
        <div className="modal-backdrop" onClick={() => setShowContactModal(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowContactModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <div className="modal-icon-badge">🌿</div>
              <h3>StayNest Concierge & Support</h3>
              <p>We are here 24/7 to assist with your journey and stays.</p>
            </div>
            <div className="contact-info-list">
              <div className="contact-item">
                <PhoneCall size={20} className="contact-icon" />
                <div>
                  <strong>Direct Helpline</strong>
                  <p>+91 (0484) 289-STAY / +91 94000 12345</p>
                </div>
              </div>
              <div className="contact-item">
                <Info size={20} className="contact-icon" />
                <div>
                  <strong>Email Concierge</strong>
                  <p>concierge@staynest.com</p>
                </div>
              </div>
              <div className="contact-item">
                <MapPin size={20} className="contact-icon" />
                <div>
                  <strong>Headquarters</strong>
                  <p>StayNest Travel Labs, Fort Kochi, Kerala 682001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
