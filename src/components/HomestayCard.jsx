import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin, ArrowRight, Users, BedDouble } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import './HomestayCard.css';

export default function HomestayCard({ homestay }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const isFavorite = isInWishlist(homestay.id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(homestay.id);
  };

  return (
    <div className="homestay-card" onClick={() => navigate(`/homestay/${homestay.id}`)}>
      {/* Image Container with Wishlist button & Badge */}
      <div className="homestay-card-media">
        <img 
          src={homestay.image} 
          alt={homestay.name} 
          className="homestay-card-img" 
          loading="lazy" 
        />
        <div className="media-overlay"></div>

        {/* Badge */}
        {homestay.badge && (
          <span className="card-badge">{homestay.badge}</span>
        )}

        {/* Wishlist Heart Button */}
        <button
          className={`wishlist-btn ${isFavorite ? 'favorited animate-heart-beat' : ''}`}
          onClick={handleHeartClick}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
          title={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={20} fill={isFavorite ? '#D32F2F' : 'none'} color={isFavorite ? '#D32F2F' : '#FAF7F2'} />
        </button>

        {/* Category Tag */}
        <span className="category-pill">{homestay.category}</span>
      </div>

      {/* Card Body */}
      <div className="homestay-card-body">
        {/* Location & Rating Header */}
        <div className="card-location-row">
          <span className="card-location">
            <MapPin size={15} className="location-icon" />
            {homestay.location}
          </span>
          <span className="card-rating">
            <Star size={15} className="star-icon" />
            <strong>{homestay.rating}</strong>
            <span className="rating-count">({homestay.reviewCount})</span>
          </span>
        </div>

        {/* Property Name */}
        <h3 className="card-title" title={homestay.name}>
          <Link to={`/homestay/${homestay.id}`}>{homestay.name}</Link>
        </h3>

        {/* Quick Specs */}
        <div className="card-specs">
          <span className="spec-item">
            <Users size={14} />
            {homestay.guests} guests
          </span>
          <span className="spec-dot">•</span>
          <span className="spec-item">
            <BedDouble size={14} />
            {homestay.bedrooms} beds
          </span>
        </div>

        {/* Short Description */}
        <p className="card-desc">
          {homestay.shortDescription}
        </p>

        {/* Footer with Price and View Details Button */}
        <div className="card-footer">
          <div className="card-price-group">
            <div className="price-tag">
              <span className="currency-symbol">₹</span>
              <span className="price-number">{homestay.price.toLocaleString('en-IN')}</span>
              <span className="price-period">/ night</span>
            </div>
            <span className="taxes-note">includes breakfast & taxes</span>
          </div>

          <Link to={`/homestay/${homestay.id}`} className="view-details-btn">
            <span>View Details</span>
            <ArrowRight size={16} className="btn-arrow" />
          </Link>
        </div>
      </div>
    </div>
  );
}
