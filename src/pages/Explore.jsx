import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  Search, 
  MapPin, 
  Users, 
  X, 
  RotateCcw, 
  Check, 
  ChevronDown 
} from 'lucide-react';
import HomestayCard from '../components/HomestayCard';
import { api } from '../services/api';
import './Explore.css';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL or defaults
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('destination') || 'All');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [maxPrice, setMaxPrice] = useState(6000);
  const [selectedGuests, setSelectedGuests] = useState(searchParams.get('guests') || 'Any');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data states
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state if URL searchParams change
  useEffect(() => {
    const dest = searchParams.get('destination');
    if (dest) setSelectedLocation(dest);
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const g = searchParams.get('guests');
    if (g) setSelectedGuests(g);
  }, [searchParams]);

  useEffect(() => {
    const fetchStays = async () => {
      setLoading(true);
      try {
        const data = await api.getHomestays();
        setHomestays(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStays();
  }, []);

  const categories = [
    'All',
    'Mountain Villas',
    'Plantation Stays',
    'Backwater Retreats',
    'Beach Cottages',
    'Heritage Homes'
  ];

  const locations = [
    'All',
    'Wayanad',
    'Munnar',
    'Vagamon',
    'Thekkady',
    'Alleppey',
    'Varkala',
    'Coorg',
    'Kodaikanal'
  ];

  const amenityOptions = [
    'WiFi',
    'Parking',
    'Breakfast',
    'Mountain View',
    'Swimming Pool',
    'Garden',
    'Kitchen',
    'Air Conditioning',
    'Pet Friendly'
  ];

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setSelectedLocation('All');
    setSelectedCategory('All');
    setMaxPrice(6000);
    setSelectedGuests('Any');
    setSelectedAmenities([]);
    setSearchTerm('');
    setSortBy('recommended');
    setSearchParams({});
  };

  // Filtered & Sorted homestays
  const filteredHomestays = useMemo(() => {
    let result = [...homestays];

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(stay => 
        stay.name.toLowerCase().includes(q) ||
        stay.location.toLowerCase().includes(q) ||
        stay.shortDescription.toLowerCase().includes(q)
      );
    }

    // Location filter
    if (selectedLocation !== 'All') {
      const loc = selectedLocation.toLowerCase();
      result = result.filter(stay => 
        stay.destination.toLowerCase().includes(loc) ||
        stay.location.toLowerCase().includes(loc)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(stay => stay.category === selectedCategory);
    }

    // Guests filter
    if (selectedGuests !== 'Any') {
      result = result.filter(stay => stay.guests >= Number(selectedGuests));
    }

    // Price filter
    result = result.filter(stay => stay.price <= maxPrice);

    // Amenities filter
    if (selectedAmenities.length > 0) {
      result = result.filter(stay => 
        selectedAmenities.every(a => stay.amenities?.includes(a))
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [homestays, searchTerm, selectedLocation, selectedCategory, maxPrice, selectedGuests, selectedAmenities, sortBy]);

  const activeFiltersCount = 
    (selectedLocation !== 'All' ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedGuests !== 'Any' ? 1 : 0) +
    (maxPrice < 6000 ? 1 : 0) +
    selectedAmenities.length +
    (searchTerm ? 1 : 0);

  return (
    <div className="explore-page">
      {/* Top Banner */}
      <div className="explore-hero-banner">
        <div className="container">
          <div className="explore-header-text">
            <span className="section-badge">All Available Properties</span>
            <h1>Explore Peaceful Homestays</h1>
            <p>From misty cardamom hills to tranquil backwaters, find your perfect nature haven.</p>
          </div>

          {/* Search Bar */}
          <div className="explore-search-bar">
            <Search size={20} className="search-icon-inside" />
            <input
              type="text"
              placeholder="Search by property name, location, or experience..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="explore-search-input"
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container explore-container">
        {/* Mobile Filter Toggle Button */}
        <div className="mobile-filter-bar">
          <button 
            className="btn btn-secondary mobile-filter-btn"
            onClick={() => setMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={18} />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          <div className="sort-wrapper-mobile">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="explore-layout">
          {/* Sidebar Filters */}
          <aside className={`explore-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-header">
              <div className="sidebar-title-group">
                <SlidersHorizontal size={20} className="filter-icon" />
                <h3>Filters</h3>
              </div>
              <div className="sidebar-actions">
                {activeFiltersCount > 0 && (
                  <button className="reset-btn" onClick={resetFilters} title="Reset all filters">
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </button>
                )}
                <button 
                  className="close-sidebar-btn" 
                  onClick={() => setMobileFilterOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Filter: Location */}
            <div className="filter-group">
              <label className="filter-label">
                <MapPin size={16} />
                Destination / Region
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="filter-select"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === 'All' ? 'All Destinations' : `${loc}, Kerala / South`}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter: Category */}
            <div className="filter-group">
              <label className="filter-label">Experience Type</label>
              <div className="category-options-list">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-category-item ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Price Range */}
            <div className="filter-group">
              <div className="filter-label-row">
                <label className="filter-label">Max Price per Night</label>
                <span className="price-display">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="2500"
                max="6000"
                step="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-slider-limits">
                <span>₹2,500</span>
                <span>₹6,000+</span>
              </div>
            </div>

            {/* Filter: Guests */}
            <div className="filter-group">
              <label className="filter-label">
                <Users size={16} />
                Minimum Guests
              </label>
              <div className="guests-pill-group">
                {['Any', '1', '2', '4', '6'].map(g => (
                  <button
                    key={g}
                    className={`guest-pill ${selectedGuests === g ? 'active' : ''}`}
                    onClick={() => setSelectedGuests(g)}
                  >
                    {g === 'Any' ? 'Any' : `${g}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Amenities */}
            <div className="filter-group">
              <label className="filter-label">Amenities</label>
              <div className="amenities-checkbox-list">
                {amenityOptions.map(amenity => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <label key={amenity} className="amenity-checkbox-label">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAmenity(amenity)}
                        className="amenity-checkbox"
                      />
                      <span className="checkbox-custom"></span>
                      <span className="amenity-text">{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Mobile Apply Button */}
            <div className="mobile-apply-footer">
              <button 
                className="btn btn-primary w-full"
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters ({filteredHomestays.length} Stays)
              </button>
            </div>
          </aside>

          {/* Results Main Section */}
          <main className="explore-main">
            {/* Results Header Bar */}
            <div className="results-top-bar">
              <div className="results-count-group">
                <span className="results-count">
                  Showing <strong>{filteredHomestays.length}</strong> {filteredHomestays.length === 1 ? 'homestay' : 'homestays'}
                </span>
                {activeFiltersCount > 0 && (
                  <span className="active-filters-indicator">
                    • {activeFiltersCount} filters active
                  </span>
                )}
              </div>

              {/* Desktop Sort Dropdown */}
              <div className="sort-wrapper-desktop">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated (Highest Reviews)</option>
                </select>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFiltersCount > 0 && (
              <div className="filter-chips-row">
                {selectedLocation !== 'All' && (
                  <span className="filter-chip">
                    Location: {selectedLocation}
                    <X size={14} onClick={() => setSelectedLocation('All')} />
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="filter-chip">
                    Type: {selectedCategory}
                    <X size={14} onClick={() => setSelectedCategory('All')} />
                  </span>
                )}
                {selectedGuests !== 'Any' && (
                  <span className="filter-chip">
                    Guests: {selectedGuests}+
                    <X size={14} onClick={() => setSelectedGuests('Any')} />
                  </span>
                )}
                {maxPrice < 6000 && (
                  <span className="filter-chip">
                    Under ₹{maxPrice.toLocaleString('en-IN')}
                    <X size={14} onClick={() => setMaxPrice(6000)} />
                  </span>
                )}
                {selectedAmenities.map(a => (
                  <span key={a} className="filter-chip">
                    {a}
                    <X size={14} onClick={() => toggleAmenity(a)} />
                  </span>
                ))}
                <button className="clear-all-chips-btn" onClick={resetFilters}>
                  Clear All
                </button>
              </div>
            )}

            {/* Cards Grid or Empty State */}
            {loading ? (
              <div className="homestays-grid">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="card-skeleton"></div>
                ))}
              </div>
            ) : filteredHomestays.length > 0 ? (
              <div className="homestays-grid">
                {filteredHomestays.map(homestay => (
                  <HomestayCard key={homestay.id} homestay={homestay} />
                ))}
              </div>
            ) : (
              <div className="empty-results-box animate-fade-in">
                <div className="empty-icon-circle">🏡</div>
                <h3>No homestays match your selected filters</h3>
                <p>Try widening your price range, clearing amenities, or picking all destinations.</p>
                <button className="btn btn-primary mt-3" onClick={resetFilters}>
                  <RotateCcw size={16} />
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
