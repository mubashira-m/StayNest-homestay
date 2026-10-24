import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Calendar, 
  Users, 
  CreditCard, 
  QrCode, 
  Banknote, 
  CheckCircle2, 
  MapPin, 
  Star, 
  Lock,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import './Booking.css';

export default function Booking() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBooking } = useBookings();

  const [homestay, setHomestay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Form Fields
  const [guestName, setGuestName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [checkIn, setCheckIn] = useState(() => {
    const fromParam = searchParams.get('checkIn');
    if (fromParam) return fromParam;
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const fromParam = searchParams.get('checkOut');
    if (fromParam) return fromParam;
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    const loadStay = async () => {
      setLoading(true);
      try {
        const data = await api.getHomestayById(id);
        setHomestay(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStay();
    window.scrollTo(0, 0);
  }, [id]);

  // Update with user context if user logs in or profile changes
  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.name);
      if (!email) setEmail(user.email);
      if (!phone) setPhone(user.phone);
    }
  }, [user]);

  // Pricing calculations
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const s = new Date(checkIn);
    const e = new Date(checkOut);
    const diffDays = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const pricePerNight = homestay ? homestay.price : 3500;
  const basePrice = pricePerNight * nights;
  const cleaningFee = 500;
  const serviceFee = Math.round(basePrice * 0.08);
  const totalAmount = basePrice + cleaningFee + serviceFee;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const bookingPayload = {
      homestayId: Number(id),
      property: homestay,
      guestName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      nights,
      pricePerNight,
      cleaningFee,
      serviceFee,
      totalAmount,
      specialRequests,
      paymentMethod,
      paymentStatus: paymentMethod === 'pay_later' ? 'Pay on Arrival' : 'Paid Online'
    };

    const res = await addBooking(bookingPayload);
    setSubmitting(false);

    if (res.success) {
      setBookingSuccess(res.booking);
    } else {
      alert('Could not complete booking: ' + res.error);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h2>Loading your sanctuary details...</h2>
      </div>
    );
  }

  if (!homestay) {
    return (
      <div className="container py-5 text-center">
        <h2>Homestay Not Found</h2>
        <Link to="/explore" className="btn btn-primary mt-3">
          Explore Stays
        </Link>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="booking-top-nav">
          <Link to={`/homestay/${homestay.id}`} className="back-link">
            <ArrowLeft size={16} />
            <span>Back to property details</span>
          </Link>
          <div className="booking-security-badge">
            <Lock size={15} />
            <span>256-Bit SSL Encrypted Booking</span>
          </div>
        </div>

        <h1 className="booking-page-title">Confirm Your Reservation</h1>

        <div className="booking-page-grid">
          {/* LEFT: Guest Details & Payment Form */}
          <div className="booking-form-col">
            <form onSubmit={handleBookingSubmit} className="booking-main-form">
              {/* Step 1: Guest Information */}
              <div className="form-card-block">
                <div className="form-block-header">
                  <span className="step-number">1</span>
                  <h3>Guest Information</h3>
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter primary guest full name"
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yourname@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile / WhatsApp Phone *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Trip Dates & Guest Count */}
              <div className="form-card-block">
                <div className="form-block-header">
                  <span className="step-number">2</span>
                  <h3>Stay Dates & Guests</h3>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Check-in Date *</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Check-out Date *</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Number of Guests *</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    {[...Array(homestay.guests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Guest' : 'Guests'} (Max {homestay.guests})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Special Requests or Dietary Preferences (Optional)</label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Vegetarian food, late arrival estimate, celebrating anniversary, etc."
                  />
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="form-card-block">
                <div className="form-block-header">
                  <span className="step-number">3</span>
                  <h3>Choose Payment Mode</h3>
                </div>

                <div className="payment-options-grid">
                  <label className={`payment-option-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <CreditCard size={22} className="payment-icon" />
                    <div className="payment-label-group">
                      <strong>Credit / Debit Card</strong>
                      <span>Visa, MasterCard, RuPay</span>
                    </div>
                  </label>

                  <label className={`payment-option-card ${paymentMethod === 'upi' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                    />
                    <QrCode size={22} className="payment-icon" />
                    <div className="payment-label-group">
                      <strong>Instant UPI / QR</strong>
                      <span>Google Pay, PhonePe, Paytm</span>
                    </div>
                  </label>

                  <label className={`payment-option-card ${paymentMethod === 'pay_later' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pay_later"
                      checked={paymentMethod === 'pay_later'}
                      onChange={() => setPaymentMethod('pay_later')}
                    />
                    <Banknote size={22} className="payment-icon" />
                    <div className="payment-label-group">
                      <strong>Pay at Homestay</strong>
                      <span>Zero advance payment today</span>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="card-mock-fields animate-fade-in">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input type="text" placeholder="4532 •••• •••• 8821" defaultValue="4532 8920 1204 8821" />
                    </div>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input type="text" placeholder="MM/YY" defaultValue="08/28" />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input type="password" placeholder="•••" defaultValue="542" maxLength={4} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-full confirm-booking-btn"
                disabled={submitting}
              >
                {submitting ? 'Confirming Your Reservation...' : `Confirm Booking • ₹${totalAmount.toLocaleString('en-IN')}`}
              </button>

              <p className="booking-terms-note">
                By selecting the button above, you agree to the StayNest Guest Policies, House Rules, and Host Cancellation Terms.
              </p>
            </form>
          </div>

          {/* RIGHT: Property Summary & Price Breakdown */}
          <aside className="booking-summary-col">
            <div className="booking-summary-card">
              <h3 className="summary-card-title">Reservation Summary</h3>

              {/* Property Card Snippet */}
              <div className="summary-property-snippet">
                <img src={homestay.image} alt={homestay.name} className="summary-thumb" />
                <div className="summary-property-info">
                  <span className="summary-category">{homestay.category}</span>
                  <h4 className="summary-name">{homestay.name}</h4>
                  <p className="summary-location">
                    <MapPin size={14} />
                    {homestay.location}
                  </p>
                  <div className="summary-rating">
                    <Star size={13} className="star-icon" />
                    <strong>{homestay.rating}</strong>
                    <span>({homestay.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="summary-divider"></div>

              {/* Booking Details List */}
              <div className="summary-trip-details">
                <div className="trip-detail-row">
                  <span className="trip-label">
                    <Calendar size={16} />
                    Dates
                  </span>
                  <span className="trip-value">
                    {checkIn} to {checkOut} ({nights} {nights === 1 ? 'night' : 'nights'})
                  </span>
                </div>
                <div className="trip-detail-row">
                  <span className="trip-label">
                    <Users size={16} />
                    Guests
                  </span>
                  <span className="trip-value">{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                </div>
              </div>

              <div className="summary-divider"></div>

              {/* Price Calculation */}
              <div className="summary-price-calc">
                <h4 className="price-calc-heading">Price Details</h4>
                <div className="price-calc-row">
                  <span>₹{pricePerNight.toLocaleString('en-IN')} × {nights} nights</span>
                  <span>₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="price-calc-row">
                  <span>Cleaning & linen fee</span>
                  <span>₹{cleaningFee}</span>
                </div>
                <div className="price-calc-row">
                  <span>StayNest service & support fee</span>
                  <span>₹{serviceFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="price-calc-total">
                  <strong>Total Amount (INR)</strong>
                  <strong className="total-highlight">₹{totalAmount.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Reassurance badge */}
              <div className="summary-reassurance">
                <ShieldCheck size={20} className="reassurance-icon" />
                <div>
                  <strong>StayNest Host Protection Guarantee</strong>
                  <p>Your reservation is directly guaranteed by our local curator team.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Booking Confirmation Success Modal */}
      {bookingSuccess && (
        <div className="modal-backdrop">
          <div className="modal-content booking-success-modal animate-fade-in">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={54} className="success-check-icon" />
            </div>

            <h2>Reservation Confirmed!</h2>
            <p className="success-subtitle">
              Your stay at <strong>{bookingSuccess.property.name}</strong> is booked and confirmed.
            </p>

            <div className="booking-ref-box">
              <span>Booking Reference ID</span>
              <strong>{bookingSuccess.id}</strong>
            </div>

            <div className="success-booking-summary">
              <div className="success-summary-item">
                <span>Check-in:</span>
                <strong>{bookingSuccess.checkIn}</strong>
              </div>
              <div className="success-summary-item">
                <span>Check-out:</span>
                <strong>{bookingSuccess.checkOut}</strong>
              </div>
              <div className="success-summary-item">
                <span>Guests:</span>
                <strong>{bookingSuccess.guests} Guests</strong>
              </div>
              <div className="success-summary-item">
                <span>Total Paid:</span>
                <strong>₹{bookingSuccess.totalAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <p className="success-instructions">
              A booking confirmation voucher and host directions have been sent to <strong>{bookingSuccess.email}</strong>.
            </p>

            <div className="success-actions">
              <Link to="/bookings" className="btn btn-primary w-full">
                View My Bookings
              </Link>
              <Link to="/" className="btn btn-secondary w-full">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
