import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  Compass, 
  ArrowRight, 
  Award, 
  Coffee, 
  Trees, 
  MapPin, 
  Star 
} from 'lucide-react';
import SearchBox from '../components/SearchBox';
import HomestayCard from '../components/HomestayCard';
import DestinationCard from '../components/DestinationCard';
import ReviewCard from '../components/ReviewCard';
import { destinations } from '../data/destinations';
import { reviews } from '../data/reviews';
import { api } from '../services/api';
import './Home.css';

export default function Home() {
  const [popularHomestays, setPopularHomestays] = useState([]);
  const [recommendedHomestays, setRecommendedHomestays] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStays = async () => {
      setLoading(true);
      try {
        const allStays = await api.getHomestays();
        setPopularHomestays(allStays.slice(0, 4));
        setRecommendedHomestays(allStays);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStays();
  }, []);

  const categories = [
    'All',
    'Mountain Villas',
    'Plantation Stays',
    'Backwater Retreats',
    'Beach Cottages',
    'Heritage Homes'
  ];

  const filteredRecommended = activeCategory === 'All' 
    ? recommendedHomestays.slice(2, 6) 
    : recommendedHomestays.filter(s => s.category === activeCategory);

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-background-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85" 
            alt="Scenic mountain homestay in mist" 
            className="hero-bg-img"
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge animate-fade-in">
              <Sparkles size={16} />
              <span>Handpicked Nature Sanctuaries</span>
            </div>
            <h1 className="hero-title animate-fade-in">
              Stay Somewhere Beautiful
            </h1>
            <p className="hero-subtitle animate-fade-in">
              Discover peaceful homestays, cozy mountain villas, and unforgettable experiences curated for slow, intentional travel.
            </p>
          </div>

          {/* Search Box integrated in hero */}
          <div className="hero-search-wrapper animate-fade-in">
            <SearchBox />
          </div>

          {/* Quick trust highlights underneath search */}
          <div className="hero-trust-row">
            <div className="hero-trust-item">
              <ShieldCheck size={18} className="trust-icon" />
              <span>100% Verified Stays</span>
            </div>
            <div className="hero-trust-item">
              <HeartHandshake size={18} className="trust-icon" />
              <span>Superhost Hospitality</span>
            </div>
            <div className="hero-trust-item">
              <Coffee size={18} className="trust-icon" />
              <span>Complimentary Breakfast</span>
            </div>
            <div className="hero-trust-item">
              <Trees size={18} className="trust-icon" />
              <span>Rooted in Nature</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR HOMESTAYS SECTION */}
      <section className="section popular-section">
        <div className="container">
          <div className="section-head-split">
            <div>
              <span className="section-badge">Traveler Favorites</span>
              <h2 className="section-title">Popular Homestays</h2>
              <p className="section-subtitle">
                Our most-loved sanctuaries, renowned for exceptional views, comforting hospitality, and five-star reviews.
              </p>
            </div>
            <Link to="/explore" className="btn btn-secondary explore-more-btn">
              <span>View All Properties</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="cards-loading-grid">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="card-skeleton"></div>
              ))}
            </div>
          ) : (
            <div className="homestays-grid">
              {popularHomestays.map((homestay) => (
                <HomestayCard key={homestay.id} homestay={homestay} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. EXPLORE DESTINATIONS SECTION */}
      <section id="destinations" className="section destinations-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Inspiring Escapes</span>
            <h2 className="section-title">Explore Destinations</h2>
            <p className="section-subtitle">
              From the mist-draped peaks of Wayanad and Munnar to serene Alleppey backwaters and sunset cliffs of Varkala.
            </p>
          </div>

          <div className="destinations-grid">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. RECOMMENDED FOR YOU (WITH CATEGORY PILLS) */}
      <section className="section recommended-section">
        <div className="container">
          <div className="section-head-center">
            <span className="section-badge">Curated Collections</span>
            <h2 className="section-title">Recommended for You</h2>
            <p className="section-subtitle">
              Tailored escapes designed around your favorite style of relaxation.
            </p>

            {/* Category Filter Pills */}
            <div className="category-filter-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="homestays-grid">
            {filteredRecommended.map((homestay) => (
              <HomestayCard key={homestay.id} homestay={homestay} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="section why-choose-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">The StayNest Difference</span>
            <h2 className="section-title">Why Choose StayNest?</h2>
            <p className="section-subtitle">
              We reject the sterile, cookie-cutter hotel room in favor of soul-nourishing homes that connect you to local lands and people.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Trees size={28} />
              </div>
              <h3 className="feature-title">Handpicked in Nature</h3>
              <p className="feature-desc">
                Every property is nestled in scenic landscapes — overlooking cloud valleys, spice plantations, quiet streams, or cliffside seas.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <HeartHandshake size={28} />
              </div>
              <h3 className="feature-title">Verified Warm Hosts</h3>
              <p className="feature-desc">
                Meet passionate local families, retired planters, and naturalists eager to welcome you with heartfelt care and authentic local cuisine.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Award size={28} />
              </div>
              <h3 className="feature-title">Transparent & Best Rate</h3>
              <p className="feature-desc">
                Direct community pricing without inflated commissions. Clear breakdown of fees and complimentary home-cooked breakfast.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Compass size={28} />
              </div>
              <h3 className="feature-title">24/7 Journey Concierge</h3>
              <p className="feature-desc">
                From route guidance across ghat roads to secret plantation walks, our dedicated travel support team is with you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GUEST REVIEWS SECTION */}
      <section className="section reviews-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Guest Stories</span>
            <h2 className="section-title">Loved by Travelers Across the World</h2>
            <p className="section-subtitle">
              Hear what our community of slow wanderers, families, and remote creatives have to say about their stays.
            </p>
          </div>

          <div className="reviews-grid">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-content">
              <span className="cta-badge">Join Our Sanctuary</span>
              <h2 className="cta-title">Ready for Your Slow Mountain Escape?</h2>
              <p className="cta-desc">
                Leave the hustle behind. Book a tranquil homestay where birdsong replaces alarms and warm tea awaits your arrival.
              </p>
              <div className="cta-actions">
                <Link to="/explore" className="btn btn-primary btn-lg">
                  <span>Explore All Stays</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Join StayNest Free
                </Link>
              </div>
            </div>

            <div className="cta-graphic">
              <img 
                src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80" 
                alt="Homestay balcony view" 
                className="cta-img"
              />
              <div className="cta-stat-pill">
                <Star size={16} className="star-icon" />
                <div>
                  <strong>4.92 / 5.0</strong>
                  <span>Average Traveler Satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
