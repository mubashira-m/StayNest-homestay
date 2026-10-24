import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import './DestinationCard.css';

export default function DestinationCard({ destination }) {
  return (
    <Link 
      to={`/explore?destination=${encodeURIComponent(destination.name)}`} 
      className="destination-card"
    >
      <div className="destination-media">
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="destination-img" 
          loading="lazy" 
        />
        <div className="destination-gradient"></div>
        <span className="destination-tag">{destination.tag}</span>
      </div>

      <div className="destination-content">
        <div className="destination-text-group">
          <span className="destination-state">
            <MapPin size={13} />
            {destination.state}
          </span>
          <h3 className="destination-name">{destination.name}</h3>
          <p className="destination-properties-count">
            {destination.propertiesCount} Handpicked Stays
          </p>
        </div>

        <div className="destination-action-btn" aria-label={`Explore ${destination.name}`}>
          <ArrowUpRight size={18} />
        </div>
      </div>
    </Link>
  );
}
