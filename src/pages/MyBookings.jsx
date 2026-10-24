import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  ArrowRight, 
  AlertTriangle,
  Download,
  X
} from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import './MyBookings.css';

export default function MyBookings() {
  const { bookings, loading, cancelBooking } = useBookings();
  const [activeStatus, setActiveStatus] = useState('All');
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const statuses = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

  const filteredBookings = activeStatus === 'All'
    ? bookings
    : bookings.filter(b => b.status === activeStatus);

  const handleCancelClick = async (id) => {
    if (window.confirm("Are you sure you wish to cancel this reservation? Free refund applies up to 48 hours prior to check-in.")) {
      setCancellingId(id);
      await cancelBooking(id);
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="badge-status confirmed">
            <CheckCircle size={12} />
            Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="badge-status pending">
            <Clock size={12} />
            Pending Review
          </span>
        );
      case 'Completed':
        return (
          <span className="badge-status completed">
            <CheckCircle size={12} />
            Completed Stay
          </span>
        );
      case 'Cancelled':
        return (
          <span className="badge-status cancelled">
            <XCircle size={12} />
            Cancelled
          </span>
        );
      default:
        return <span className="badge-status">{status}</span>;
    }
  };

  return (
    <div className="my-bookings-page">
      <div className="container">
        {/* Header */}
        <div className="bookings-header-row">
          <div>
            <span className="section-badge">Travel Ledger</span>
            <h1 className="bookings-page-title">My Bookings</h1>
            <p className="bookings-subtitle">
              Manage your confirmed escapes, upcoming dates, and stay receipts.
            </p>
          </div>

          <Link to="/explore" className="btn btn-primary">
            <span>Book Another Sanctuary</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="status-tabs-row">
          {statuses.map(st => {
            const count = st === 'All' 
              ? bookings.length 
              : bookings.filter(b => b.status === st).length;
            return (
              <button
                key={st}
                className={`status-tab-btn ${activeStatus === st ? 'active' : ''}`}
                onClick={() => setActiveStatus(st)}
              >
                <span>{st}</span>
                <span className="tab-count-pill">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="bookings-loading">
            <div className="card-skeleton" style={{ height: '220px', marginBottom: '1.5rem' }}></div>
            <div className="card-skeleton" style={{ height: '220px' }}></div>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="bookings-cards-list">
            {filteredBookings.map((b) => (
              <div key={b.id} className="booking-card-item">
                {/* Media Image */}
                <div className="booking-item-media">
                  <img 
                    src={b.property?.image || 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=600&q=80'} 
                    alt={b.property?.name || 'Homestay'} 
                    className="booking-item-img"
                  />
                  <div className="booking-item-badge">
                    {getStatusBadge(b.status)}
                  </div>
                </div>

                {/* Content info */}
                <div className="booking-item-content">
                  <div className="booking-item-top">
                    <div className="ref-group">
                      <span className="booking-ref-tag">Ref: #{b.id}</span>
                      <span className="booking-date-booked">Booked on {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    <div className="booking-price-badge">
                      <span className="price-label">Total Amount</span>
                      <strong>₹{b.totalAmount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <h3 className="booking-property-title">
                    <Link to={`/homestay/${b.homestayId || b.property?.id}`}>
                      {b.property?.name || 'Mountain Sanctuary'}
                    </Link>
                  </h3>

                  <p className="booking-property-location">
                    <MapPin size={15} />
                    {b.property?.location || 'Wayanad, Kerala'}
                  </p>

                  {/* Dates & Guests Grid */}
                  <div className="booking-specs-grid">
                    <div className="spec-block">
                      <span className="spec-label">
                        <Calendar size={14} />
                        Check-in
                      </span>
                      <strong>{b.checkIn}</strong>
                    </div>
                    <div className="spec-block">
                      <span className="spec-label">
                        <Calendar size={14} />
                        Check-out
                      </span>
                      <strong>{b.checkOut}</strong>
                    </div>
                    <div className="spec-block">
                      <span className="spec-label">
                        <Users size={14} />
                        Guests
                      </span>
                      <strong>{b.guests} Guests ({b.nights || 1} nights)</strong>
                    </div>
                    <div className="spec-block">
                      <span className="spec-label">Primary Guest</span>
                      <strong>{b.guestName}</strong>
                    </div>
                  </div>

                  {b.specialRequests && (
                    <div className="booking-notes">
                      <span>Note for host:</span> "{b.specialRequests}"
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="booking-item-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedBookingForReceipt(b)}
                    >
                      <FileText size={15} />
                      View Voucher
                    </button>

                    <Link 
                      to={`/homestay/${b.homestayId || b.property?.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      View Property
                    </Link>

                    {b.status === 'Confirmed' && (
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleCancelClick(b.id)}
                        disabled={cancellingId === b.id}
                      >
                        {cancellingId === b.id ? 'Cancelling...' : 'Cancel Reservation'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-bookings-box animate-fade-in">
            <div className="empty-bookings-icon">🎒</div>
            <h3>No bookings found in this category</h3>
            <p>You haven't placed any {activeStatus !== 'All' ? activeStatus.toLowerCase() : ''} bookings yet.</p>
            <Link to="/explore" className="btn btn-primary mt-3">
              Explore Available Stays
            </Link>
          </div>
        )}
      </div>

      {/* Voucher / Receipt Modal */}
      {selectedBookingForReceipt && (
        <div className="modal-backdrop" onClick={() => setSelectedBookingForReceipt(null)}>
          <div className="modal-content receipt-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedBookingForReceipt(null)}>
              <X size={20} />
            </button>

            <div className="receipt-header">
              <div className="receipt-brand">
                <span className="brand-name">StayNest</span>
                <span className="brand-tagline">Official Booking Voucher</span>
              </div>
              <div className="receipt-ref-badge">
                #{selectedBookingForReceipt.id}
              </div>
            </div>

            <div className="receipt-body">
              <div className="receipt-property-row">
                <img 
                  src={selectedBookingForReceipt.property?.image} 
                  alt={selectedBookingForReceipt.property?.name} 
                  className="receipt-thumb" 
                />
                <div>
                  <h4>{selectedBookingForReceipt.property?.name}</h4>
                  <p>{selectedBookingForReceipt.property?.location}</p>
                  <div className="receipt-status-line">
                    Status: {getStatusBadge(selectedBookingForReceipt.status)}
                  </div>
                </div>
              </div>

              <div className="receipt-details-table">
                <div className="receipt-row">
                  <span>Guest Name:</span>
                  <strong>{selectedBookingForReceipt.guestName}</strong>
                </div>
                <div className="receipt-row">
                  <span>Email:</span>
                  <strong>{selectedBookingForReceipt.email}</strong>
                </div>
                <div className="receipt-row">
                  <span>Phone:</span>
                  <strong>{selectedBookingForReceipt.phone}</strong>
                </div>
                <div className="receipt-row">
                  <span>Check-in Date:</span>
                  <strong>{selectedBookingForReceipt.checkIn} (2:00 PM onwards)</strong>
                </div>
                <div className="receipt-row">
                  <span>Check-out Date:</span>
                  <strong>{selectedBookingForReceipt.checkOut} (Until 11:00 AM)</strong>
                </div>
                <div className="receipt-row">
                  <span>Guests:</span>
                  <strong>{selectedBookingForReceipt.guests} Guests</strong>
                </div>
                <div className="receipt-divider"></div>
                <div className="receipt-row total-row">
                  <span>Total Amount Paid:</span>
                  <strong>₹{selectedBookingForReceipt.totalAmount.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="receipt-footer-notes">
                <p>Please present this digital confirmation or government ID upon arrival at the homestay. For route directions or host assistance, reach StayNest 24/7 Concierge.</p>
              </div>

              <div className="receipt-actions">
                <button 
                  className="btn btn-primary w-full"
                  onClick={() => {
                    window.print();
                  }}
                >
                  <Download size={16} />
                  Print / Download PDF Voucher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
