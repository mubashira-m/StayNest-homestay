import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import './ReviewCard.css';

export default function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-author-group">
          <img src={review.avatar} alt={review.name} className="review-avatar" />
          <div className="review-author-details">
            <div className="author-name-row">
              <h4 className="review-author-name">{review.name}</h4>
              {review.verified && (
                <span className="verified-badge" title="Verified Guest">
                  <CheckCircle size={14} />
                  Verified
                </span>
              )}
            </div>
            <p className="review-location">{review.location}</p>
          </div>
        </div>

        <Quote size={24} className="review-quote-icon" />
      </div>

      <div className="review-rating-row">
        <div className="stars-row">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} size={15} className="star-filled" />
          ))}
        </div>
        <span className="review-date">{review.date}</span>
      </div>

      <p className="review-text">"{review.text}"</p>

      {review.stay && (
        <div className="review-stay-tag">
          <span>Stayed at: </span>
          <strong>{review.stay}</strong>
        </div>
      )}
    </div>
  );
}
