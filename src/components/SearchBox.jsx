import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import './SearchBox.css';

export default function SearchBox({ initialLocation = '', initialGuests = '2', compact = false }) {
  const [location, setLocation] = useState(initialLocation);
  const [checkIn, setCheckIn] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const next = new Date();
    next.setDate(next.getDate() + 4);
    return next.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(initialGuests);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location && location !== 'All') params.set('destination', location);
    if (guests) params.set('guests', guests);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);

    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className={`search-box-wrapper ${compact ? 'search-box-compact' : ''}`}>
      <form onSubmit={handleSearch} className="search-form">
        {/* Location Field */}
        <div className="search-field">
          <div className="search-field-icon">
            <MapPin size={20} />
          </div>
          <div className="search-field-content">
            <label htmlFor="search-location">Location</label>
            <select
              id="search-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="search-select"
            >
              <option value="">Where are you escaping?</option>
              <option value="Wayanad">Wayanad, Kerala</option>
              <option value="Munnar">Munnar, Kerala</option>
              <option value="Vagamon">Vagamon, Kerala</option>
              <option value="Thekkady">Thekkady, Kerala</option>
              <option value="Alleppey">Alleppey, Kerala</option>
              <option value="Varkala">Varkala, Kerala</option>
              <option value="Coorg">Coorg, Karnataka</option>
              <option value="Kodaikanal">Kodaikanal, Tamil Nadu</option>
            </select>
          </div>
        </div>

        <div className="search-divider"></div>

        {/* Check-In Field */}
        <div className="search-field">
          <div className="search-field-icon">
            <Calendar size={20} />
          </div>
          <div className="search-field-content">
            <label htmlFor="search-checkin">Check-in</label>
            <input
              id="search-checkin"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="search-input"
            />
          </div>
        </div>

        <div className="search-divider"></div>

        {/* Check-Out Field */}
        <div className="search-field">
          <div className="search-field-icon">
            <Calendar size={20} />
          </div>
          <div className="search-field-content">
            <label htmlFor="search-checkout">Check-out</label>
            <input
              id="search-checkout"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              className="search-input"
            />
          </div>
        </div>

        <div className="search-divider"></div>

        {/* Guests Field */}
        <div className="search-field">
          <div className="search-field-icon">
            <Users size={20} />
          </div>
          <div className="search-field-content">
            <label htmlFor="search-guests">Guests</label>
            <select
              id="search-guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="search-select"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests (Couple / Pair)</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests (Family / Friends)</option>
              <option value="6">6+ Guests (Large Group)</option>
            </select>
          </div>
        </div>

        {/* Submit Search Button */}
        <div className="search-submit-col">
          <button type="submit" className="search-btn" aria-label="Search Homestays">
            <Search size={20} />
            <span className="search-btn-text">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}
