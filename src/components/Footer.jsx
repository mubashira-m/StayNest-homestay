import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Heart,
  CheckCircle2
} from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="footer-newsletter-banner">
        <div className="container">
          <div className="newsletter-card">
            <div className="newsletter-text">
              <span className="newsletter-badge">Stay Inspired</span>
              <h3 className="newsletter-title">Subscribe to the StayNest Travel Journal</h3>
              <p className="newsletter-desc">
                Receive secret hill retreats, seasonal harvest guides, and exclusive homestay member perks.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="newsletter-form">
              {subscribed ? (
                <div className="newsletter-success">
                  <CheckCircle2 size={20} />
                  <span>Welcome to the circle! Check your inbox for our slow travel guide.</span>
                </div>
              ) : (
                <div className="newsletter-input-group">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-submit-btn">
                    <span>Subscribe</span>
                    <Send size={16} />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container footer-main">
        <div className="footer-grid">
          {/* Brand Info Column */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">
                <svg viewBox="0 0 36 36" fill="none">
                  <rect width="36" height="36" rx="10" fill="#2D5A43" />
                  <path d="M18 8L7 18H11V30H25V18H29L18 8Z" fill="#FAF7F2" />
                  <circle cx="18" cy="22" r="3.5" fill="#C47444" />
                </svg>
              </div>
              <span className="footer-brand-name">StayNest</span>
            </Link>
            <p className="footer-about">
              StayNest connects discerning travelers with soulful, verified homestays across India’s most scenic hills, plantations, and coastal sanctuaries. Rooted in community, nature, and heartfelt hospitality.
            </p>
            <div className="footer-social-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Column: Company */}
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links-list">
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/explore">Our Homestays</Link></li>
              <li><a href="#destinations">Destinations</a></li>
              <li><a href="#careers" onClick={(e) => { e.preventDefault(); alert("We are expanding our host curation team! Send your resume to careers@staynest.com"); }}>Careers</a></li>
              <li><a href="#press" onClick={(e) => { e.preventDefault(); alert("Featured in Conde Nast Traveller, NatGeo, & Outlook."); }}>Press & Stories</a></li>
            </ul>
          </div>

          {/* Column: Explore */}
          <div className="footer-col">
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-links-list">
              <li><Link to="/explore?destination=Wayanad">Wayanad Homestays</Link></li>
              <li><Link to="/explore?destination=Munnar">Munnar Tea Estates</Link></li>
              <li><Link to="/explore?destination=Vagamon">Vagamon Meadows</Link></li>
              <li><Link to="/explore?destination=Alleppey">Alleppey Backwaters</Link></li>
              <li><Link to="/explore?destination=Varkala">Varkala Ocean Cliffs</Link></li>
            </ul>
          </div>

          {/* Column: Support */}
          <div className="footer-col">
            <h4 className="footer-col-title">Support</h4>
            <ul className="footer-links-list">
              <li><a href="#help" onClick={(e) => { e.preventDefault(); alert("Our 24/7 helpline is available at +91 (0484) 289-STAY"); }}>Help Center</a></li>
              <li><a href="#cancellation" onClick={(e) => { e.preventDefault(); alert("100% refund available up to 48 hours prior to check-in for all flexible bookings."); }}>Cancellation Policy</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("StayNest strictly safeguards user privacy and encrypted booking transactions."); }}>Privacy Policy</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert("Standard homestay etiquette, verified identification, and respectful community rules apply."); }}>Terms & Conditions</a></li>
              <li><Link to="/bookings">Manage My Bookings</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom / Copyright */}
        <div className="footer-bottom">
          <p className="copyright-text">
            © 2026 StayNest. All rights reserved.
          </p>
          <p className="made-with-love">
            Crafted with <Heart size={14} className="heart-icon-inline" /> for mindful travel and community-first hospitality.
          </p>
        </div>
      </div>
    </footer>
  );
}
