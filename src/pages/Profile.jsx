import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Heart, 
  Calendar, 
  LogOut, 
  Edit3, 
  Save, 
  ShieldCheck, 
  MapPin, 
  Trash2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useBookings } from '../context/BookingContext';
import { homestays } from '../data/homestays';
import HomestayCard from '../components/HomestayCard';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { bookings } = useBookings();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('wishlist'); // 'wishlist' | 'edit'

  // Edit form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setBio(user.bio || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h2>Please Sign In</h2>
        <p>You need to be logged in to view your profile and wishlist.</p>
        <Link to="/login" className="btn btn-primary mt-3">
          Sign In
        </Link>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateProfile({ name, email, phone, bio });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Find saved wishlist homestays
  const savedStays = homestays.filter(s => wishlist.includes(s.id));

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Card Header */}
        <div className="profile-hero-card">
          <div className="profile-hero-left">
            <img src={user.avatar} alt={user.name} className="profile-large-avatar" />
            <div className="profile-details">
              <div className="profile-name-row">
                <h2>{user.name}</h2>
                <span className="profile-badge">
                  <ShieldCheck size={14} />
                  Verified Traveler
                </span>
              </div>
              <p className="profile-bio-text">{user.bio || 'Passionate traveler exploring peaceful homestays.'}</p>
              <div className="profile-contact-meta">
                <span>
                  <Mail size={15} />
                  {user.email}
                </span>
                <span>
                  <Phone size={15} />
                  {user.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-hero-actions">
            <Link to="/bookings" className="btn btn-secondary profile-bookings-btn">
              <Calendar size={18} />
              <span>My Bookings ({bookings.length})</span>
            </Link>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Profile Stats Row */}
        <div className="profile-stats-grid">
          <div className="stat-card">
            <span className="stat-num">{bookings.length}</span>
            <span className="stat-desc">Total Trips</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{wishlist.length}</span>
            <span className="stat-desc">Saved Homestays</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">4</span>
            <span className="stat-desc">Destinations Explored</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">Member</span>
            <span className="stat-desc">Since {user.memberSince || '2024'}</span>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="profile-tabs-row">
          <button
            className={`profile-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <Heart size={18} />
            <span>My Wishlist ({savedStays.length})</span>
          </button>
          <button
            className={`profile-tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <Edit3 size={18} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Tab 1: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="wishlist-tab-content animate-fade-in">
            {savedStays.length > 0 ? (
              <div className="homestays-grid">
                {savedStays.map(stay => (
                  <HomestayCard key={stay.id} homestay={stay} />
                ))}
              </div>
            ) : (
              <div className="empty-wishlist-box">
                <div className="empty-heart-circle">♡</div>
                <h3>Your wishlist is empty</h3>
                <p>Explore our nature sanctuaries and tap the heart icon on properties you'd love to visit.</p>
                <Link to="/explore" className="btn btn-primary mt-3">
                  Explore Homestays
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Edit Profile */}
        {activeTab === 'edit' && (
          <div className="edit-profile-card animate-fade-in">
            <div className="edit-card-header">
              <h3>Personal Information</h3>
              <p>Update your public profile details and contact information.</p>
            </div>

            {saveSuccess && (
              <div className="save-success-banner">
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleUpdate} className="edit-profile-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location / City</label>
                  <input
                    type="text"
                    defaultValue="Bangalore, Karnataka"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>About You (Bio)</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell hosts about your travel style, passions, and favorite escapes..."
                />
              </div>

              <div className="edit-form-actions">
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
