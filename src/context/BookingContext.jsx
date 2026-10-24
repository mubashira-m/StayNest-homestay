import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getUserBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const addBooking = async (bookingData) => {
    try {
      const newBooking = await api.createBooking(bookingData);
      setBookings((prev) => [newBooking, ...prev]);
      return { success: true, booking: newBooking };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await api.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        addBooking,
        cancelBooking,
        refreshBookings: fetchBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);
