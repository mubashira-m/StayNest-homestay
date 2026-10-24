import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Users, 
  BedDouble, 
  Bath, 
  ShieldCheck, 
  Calendar, 
  Wifi, 
  Car, 
  Coffee, 
  Waves, 
  Wind, 
  UtensilsCrossed, 
  Mountain, 
  Trees, 
  PawPrint, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowLeft,
  X,
  MessageSquarePlus,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import './HomestayDetails.css';

// Amenity icon mapping
const amenityIcons = {
  WiFi: <Wifi size={20} />,
  Parking: <Car size={20} />,
  Breakfast: <Coffee size={20} />,
  'Swimming Pool': <Waves size={20} />,
  'Air Conditioning': <Wind size={20} />,
  Kitchen: <UtensilsCrossed size={20} />,
  'Mountain View': <Mountain size={20} />,
  Garden: <Trees size={20} />,
  'Pet Friendly': <PawPrint size={20} />
};

export default function HomestayDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [homestay, setHomestay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);

  // Booking Card State
  const [checkIn, setCheckIn] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const next = new Date();
    next.setDate(next.getDate() + 5);
    return next.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(2);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [userReviews, setUserReviews] = useState([
    {
      id: 'rev_1',
      name: 'Pooja Hegde',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      date: 'September 2025',
      text: 'One of the most restorative escapes we have ever had. The birdsong at dawn and the home-cooked breakfast made it feel like visiting dear family.'
    },
    {
      id: 'rev_2',
      name: 'Arun & Meera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      date: 'August 2025',
      text: 'Impeccable cleanliness, sparkling views, and the host went out of their way to guide us on secret mountain walks. Highly recommended!'
    }
  ]);

  useEffect(() => {
    const fetchStay = async () => {
      setLoading(true);
      try {
        const data = await api.getHomestayById(id);
        setHomestay(data);
        if (data.guests) setGuests(Math.min(2, data.guests));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStay();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="details-skeleton-header"></div>
        <div className="details-skeleton-gallery"></div>
      </div>
    );
  }

  if (!homestay) {
    return (
      <div className="container py-5 text-center">
        <h2>Homestay Not Found</h2>
        <p>The sanctuary you are looking for may have been moved or unlisted.</p>
        <Link to="/explore" className="btn btn-primary mt-3">
          Explore Other Stays
        </Link>
      </div>
    );
  }

  // Calculate nights & pricing
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const basePrice = homestay.price * nights;
  const cleaningFee = 500;
  const serviceFee = Math.round(basePrice * 0.08);
  const totalAmount = basePrice + cleaningFee + serviceFee;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  const handleReserve = () => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: guests.toString(),
      nights: nights.toString()
    });
    navigate(`/booking/${homestay.id}?${params.toString()}`);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (reviewText && reviewName) {
      const newRev = {
        id: `rev_${Date.now()}`,
        name: reviewName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: Number(reviewRating),
        date: 'Just now',
        text: reviewText
      };
      setUserReviews([newRev, ...userReviews]);
      setReviewText('');
      setReviewName('');
      setShowReviewModal(false);
      alert('Thank you for sharing your experience!');
    }
  };

  const isFavorited = isInWishlist(homestay.id);

  return (
    <div className="homestay-details-page">
      <div className="container">
        {/* Navigation Breadcrumb & Back */}
        <div className="details-top-nav">
          <Link to="/explore" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to explore</span>
          </Link>
          <div className="details-action-buttons">
            <button className="share-btn" onClick={handleShare} title="Share Property">
              <Share2 size={18} />
              <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button 
              className={`details-wishlist-btn ${isFavorited ? 'active' : ''}`}
              onClick={() => toggleWishlist(homestay.id)}
            >
              <Heart size={18} fill={isFavorited ? '#D32F2F' : 'none'} color={isFavorited ? '#D32F2F' : 'currentColor'} />
              <span>{isFavorited ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Title & Metadata Row */}
        <div className="details-header-meta">
          <div className="header-badge-row">
            {homestay.badge && <span className="property-badge">{homestay.badge}</span>}
            <span className="property-category">{homestay.category}</span>
          </div>
          <h1 className="details-property-title">{homestay.name}</h1>
          <div className="details-subhead-row">
            <div className="details-rating-badge">
              <Star size={16} className="star-icon" />
              <strong>{homestay.rating}</strong>
              <span className="reviews-link">({homestay.reviewCount + userReviews.length - 2} reviews)</span>
            </div>
            <span className="dot-divider">•</span>
            <div className="details-location-text">
              <MapPin size={16} className="location-icon" />
              <span>{homestay.location}</span>
            </div>
          </div>
        </div>

        {/* 1. LARGE IMAGE GALLERY */}
        <div className="gallery-container">
          <div className="gallery-grid">
            <div className="gallery-main-item" onClick={() => { setActivePhotoIndex(0); setShowGalleryModal(true); }}>
              <img src={homestay.gallery[0] || homestay.image} alt={homestay.name} className="gallery-img" />
            </div>
            <div className="gallery-sub-grid">
              {(homestay.gallery.slice(1, 5).length ? homestay.gallery.slice(1, 5) : [homestay.image]).map((img, idx) => (
                <div 
                  key={idx} 
                  className="gallery-sub-item" 
                  onClick={() => { setActivePhotoIndex(idx + 1); setShowGalleryModal(true); }}
                >
                  <img src={img} alt={`${homestay.name} view ${idx + 2}`} className="gallery-img" />
                </div>
              ))}
            </div>
          </div>
          <button className="view-all-photos-btn" onClick={() => setShowGalleryModal(true)}>
            <span>View All Photos ({homestay.gallery?.length || 5})</span>
          </button>
        </div>

        {/* Two-Column Details Layout */}
        <div className="details-main-layout">
          {/* LEFT COLUMN: Property Content */}
          <div className="details-content-column">
            {/* Quick Property Stats */}
            <div className="property-quick-stats">
              <div className="stat-pill">
                <Users size={18} />
                <span>{homestay.guests} Max Guests</span>
              </div>
              <div className="stat-pill">
                <BedDouble size={18} />
                <span>{homestay.bedrooms} Bedrooms ({homestay.beds} Beds)</span>
              </div>
              <div className="stat-pill">
                <Bath size={18} />
                <span>{homestay.bathrooms} Private Baths</span>
              </div>
              <div className="stat-pill">
                <Sparkles size={18} />
                <span>Self Check-in Available</span>
              </div>
            </div>

            <div className="details-divider"></div>

            {/* Host Banner */}
            <div className="host-profile-card">
              <img src={homestay.host.avatar} alt={homestay.host.name} className="host-avatar" />
              <div className="host-info">
                <div className="host-title-row">
                  <h3>Hosted by {homestay.host.name}</h3>
                  {homestay.host.superhost && (
                    <span className="superhost-badge" title="Superhost">
                      <ShieldCheck size={14} />
                      Superhost
                    </span>
                  )}
                </div>
                <p className="host-meta">
                  {homestay.host.joined} • Response rate: {homestay.host.responseRate} ({homestay.host.responseTime})
                </p>
                <p className="host-bio">"{homestay.host.bio}"</p>
              </div>
            </div>

            <div className="details-divider"></div>

            {/* Description */}
            <div className="details-section">
              <h2 className="details-section-title">About this peaceful sanctuary</h2>
              <p className="details-description-text">{homestay.description}</p>
              <div className="staynest-guarantee-box">
                <Sparkles size={20} className="guarantee-icon" />
                <div>
                  <strong>The StayNest Peace Guarantee</strong>
                  <p>Every homestay verified for serene natural surroundings, strict cleanliness, and genuine family warmth.</p>
                </div>
              </div>
            </div>

            <div className="details-divider"></div>

            {/* Amenities Section */}
            <div className="details-section">
              <h2 className="details-section-title">What this homestay offers</h2>
              <div className="amenities-grid-display">
                {homestay.amenities.map((amenity) => (
                  <div key={amenity} className="amenity-item-card">
                    <div className="amenity-icon-box">
                      {amenityIcons[amenity] || <Sparkles size={20} />}
                    </div>
                    <span className="amenity-name">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="details-divider"></div>

            {/* House Rules & Safety */}
            <div className="details-section">
              <h2 className="details-section-title">House Rules & Safety Information</h2>
              <div className="rules-grid">
                <div className="rules-card">
                  <h4>
                    <Clock size={16} />
                    Check-in & Etiquette
                  </h4>
                  <ul>
                    {homestay.houseRules?.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>

                <div className="rules-card">
                  <h4>
                    <AlertCircle size={16} />
                    Safety & Property
                  </h4>
                  <ul>
                    {homestay.safety?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="details-divider"></div>

            {/* Reviews Section */}
            <div className="details-section reviews-details-section">
              <div className="reviews-section-header">
                <div className="rating-large-group">
                  <Star size={24} className="star-icon" />
                  <h2>{homestay.rating} · {homestay.reviewCount + userReviews.length - 2} Reviews</h2>
                </div>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowReviewModal(true)}
                >
                  <MessageSquarePlus size={16} />
                  Write a Review
                </button>
              </div>

              <div className="reviews-list-grid">
                {userReviews.map((rev) => (
                  <div key={rev.id} className="review-item-box">
                    <div className="review-user-row">
                      <img src={rev.avatar} alt={rev.name} className="review-user-img" />
                      <div>
                        <strong>{rev.name}</strong>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                    <div className="review-stars-inline">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} className="star-filled" />
                      ))}
                    </div>
                    <p className="review-item-text">"{rev.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Booking Card */}
          <aside className="details-booking-column">
            <div className="sticky-booking-card">
              <div className="booking-card-header">
                <div className="booking-price-header">
                  <span className="price-val">₹{homestay.price.toLocaleString('en-IN')}</span>
                  <span className="price-unit">/ night</span>
                </div>
                <div className="booking-rating-inline">
                  <Star size={14} className="star-icon" />
                  <strong>{homestay.rating}</strong>
                  <span>({homestay.reviewCount})</span>
                </div>
              </div>

              {/* Booking Inputs Box */}
              <div className="booking-inputs-table">
                <div className="booking-input-dates">
                  <div className="booking-cell">
                    <label>CHECK-IN</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="booking-cell">
                    <label>CHECK-OUT</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn}
                    />
                  </div>
                </div>
                <div className="booking-cell guests-cell">
                  <label>GUESTS</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    {[...Array(homestay.guests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reserve Now Button */}
              <button 
                className="btn btn-primary w-full booking-submit-btn"
                onClick={handleReserve}
              >
                Reserve Now
              </button>
              <p className="no-charge-text">You won’t be charged yet</p>

              {/* Price Calculation breakdown */}
              <div className="price-breakdown-list">
                <div className="breakdown-item">
                  <span>₹{homestay.price.toLocaleString('en-IN')} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span>₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="breakdown-item">
                  <span>Cleaning & linen fee</span>
                  <span>₹{cleaningFee}</span>
                </div>
                <div className="breakdown-item">
                  <span>StayNest service & support fee</span>
                  <span>₹{serviceFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="breakdown-divider"></div>
                <div className="breakdown-total">
                  <strong>Total (all inclusive)</strong>
                  <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Trust Callout */}
              <div className="booking-card-perks">
                <div className="perk-item">
                  <CheckCircle size={15} className="perk-icon" />
                  <span>Free cancellation up to 48 hours prior</span>
                </div>
                <div className="perk-item">
                  <Coffee size={15} className="perk-icon" />
                  <span>Organic Kerala breakfast included</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Full Photo Gallery Modal */}
      {showGalleryModal && (
        <div className="photo-modal-backdrop" onClick={() => setShowGalleryModal(false)}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="photo-modal-close" onClick={() => setShowGalleryModal(false)}>
              <X size={24} />
            </button>
            <div className="photo-viewer-header">
              <h3>{homestay.name}</h3>
              <span>Photo {activePhotoIndex + 1} of {homestay.gallery.length}</span>
            </div>
            <div className="photo-large-view">
              <img 
                src={homestay.gallery[activePhotoIndex]} 
                alt={`${homestay.name} preview`} 
                className="modal-active-img"
              />
            </div>
            <div className="photo-thumbnails-row">
              {homestay.gallery.map((img, i) => (
                <div 
                  key={i} 
                  className={`thumbnail-box ${activePhotoIndex === i ? 'active' : ''}`}
                  onClick={() => setActivePhotoIndex(i)}
                >
                  <img src={img} alt="thumbnail" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div className="modal-backdrop" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowReviewModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <div className="modal-icon-badge">✨</div>
              <h3>Write a Review</h3>
              <p>Share your stay experience at {homestay.name}</p>
            </div>
            <form onSubmit={handleAddReview}>
              <div className="form-group">
                <label>Your Name</label>
                <input 
                  type="text" 
                  value={reviewName} 
                  onChange={(e) => setReviewName(e.target.value)} 
                  placeholder="e.g. Priya Sharma" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <select 
                  value={reviewRating} 
                  onChange={(e) => setReviewRating(e.target.value)}
                >
                  <option value="5">★★★★★ 5 - Exceptional Sanctuary</option>
                  <option value="4">★★★★☆ 4 - Wonderful Experience</option>
                  <option value="3">★★★☆☆ 3 - Average Stay</option>
                </select>
              </div>
              <div className="form-group">
                <label>Your Review & Memories</label>
                <textarea 
                  rows={4}
                  value={reviewText} 
                  onChange={(e) => setReviewText(e.target.value)} 
                  placeholder="What made this homestay special? How was the host, the view, and the food?"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full mt-2">
                <Send size={16} />
                Publish Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
