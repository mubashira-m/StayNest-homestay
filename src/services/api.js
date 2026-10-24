import axios from 'axios';
import { homestays as defaultHomestays } from '../data/homestays';

// Configure Axios client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.staynest.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT auth token when available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('staynest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Simulated latency helper for local state
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Local Storage helpers for state persistence
const getStoredBookings = () => {
  const data = localStorage.getItem('staynest_bookings');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  // Initial sample bookings
  const sampleBookings = [
    {
      id: 'SN-784102',
      homestayId: 1,
      property: defaultHomestays[0],
      guestName: 'Ananya Verma',
      email: 'ananya.travels@example.com',
      phone: '+91 98765 43210',
      checkIn: '2026-11-15',
      checkOut: '2026-11-18',
      guests: 2,
      nights: 3,
      pricePerNight: 3500,
      cleaningFee: 500,
      serviceFee: 850,
      totalAmount: 11850,
      status: 'Confirmed',
      specialRequests: 'Upper floor room with valley view please.',
      createdAt: '2026-10-18T14:30:00Z'
    },
    {
      id: 'SN-639201',
      homestayId: 2,
      property: defaultHomestays[1],
      guestName: 'Ananya Verma',
      email: 'ananya.travels@example.com',
      phone: '+91 98765 43210',
      checkIn: '2026-09-02',
      checkOut: '2026-09-05',
      guests: 4,
      nights: 3,
      pricePerNight: 4800,
      cleaningFee: 650,
      serviceFee: 1150,
      totalAmount: 16200,
      status: 'Completed',
      specialRequests: 'Early breakfast before tea plantation walk.',
      createdAt: '2026-08-20T10:15:00Z'
    }
  ];
  localStorage.setItem('staynest_bookings', JSON.stringify(sampleBookings));
  return sampleBookings;
};

// ==========================================
// API Methods (Backend-Ready with Local Fallback)
// ==========================================

export const api = {
  // 1. GET /homestays
  getHomestays: async (filters = {}) => {
    try {
      // If a real backend server is running, use it:
      // const response = await apiClient.get('/homestays', { params: filters });
      // return response.data;
      throw new Error('Using local data adapter');
    } catch {
      await delay(250);
      let list = [...defaultHomestays];

      if (filters.destination && filters.destination !== 'All') {
        const dest = filters.destination.toLowerCase();
        list = list.filter((item) =>
          item.destination.toLowerCase().includes(dest) ||
          item.location.toLowerCase().includes(dest)
        );
      }

      if (filters.category && filters.category !== 'All') {
        list = list.filter((item) => item.category === filters.category);
      }

      if (filters.maxPrice) {
        list = list.filter((item) => item.price <= Number(filters.maxPrice));
      }

      if (filters.guests) {
        list = list.filter((item) => item.guests >= Number(filters.guests));
      }

      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter((item) =>
          item.name.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }

      if (filters.sortBy) {
        if (filters.sortBy === 'price-low') {
          list.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === 'price-high') {
          list.sort((a, b) => b.price - a.price);
        } else if (filters.sortBy === 'rating') {
          list.sort((a, b) => b.rating - a.rating);
        }
      }

      return list;
    }
  },

  // 2. GET /homestays/:id
  getHomestayById: async (id) => {
    try {
      // const response = await apiClient.get(`/homestays/${id}`);
      // return response.data;
      throw new Error('Using local data adapter');
    } catch {
      await delay(200);
      const stay = defaultHomestays.find((item) => item.id === Number(id));
      if (!stay) throw new Error('Homestay not found');
      return stay;
    }
  },

  // 3. POST /bookings
  createBooking: async (bookingData) => {
    try {
      // const response = await apiClient.post('/bookings', bookingData);
      // return response.data;
      throw new Error('Using local data adapter');
    } catch {
      await delay(400);
      const bookings = getStoredBookings();
      const newBooking = {
        id: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        status: 'Confirmed',
        ...bookingData,
      };
      const updated = [newBooking, ...bookings];
      localStorage.setItem('staynest_bookings', JSON.stringify(updated));
      return newBooking;
    }
  },

  // 4. GET /bookings/:userId
  getUserBookings: async (userId = 'guest') => {
    try {
      // const response = await apiClient.get(`/bookings/${userId}`);
      // return response.data;
      throw new Error('Using local data adapter');
    } catch {
      await delay(250);
      return getStoredBookings();
    }
  },

  // 5. Cancel booking
  cancelBooking: async (bookingId) => {
    try {
      // const response = await apiClient.patch(`/bookings/${bookingId}/cancel`);
      // return response.data;
      throw new Error('Using local data adapter');
    } catch {
      await delay(300);
      const bookings = getStoredBookings();
      const updated = bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'Cancelled' } : b
      );
      localStorage.setItem('staynest_bookings', JSON.stringify(updated));
      return { success: true, bookingId };
    }
  },

  // 6. POST /auth/login
  login: async (credentials) => {
    try {
      // const response = await apiClient.post('/auth/login', credentials);
      // return response.data;
      throw new Error('Using local adapter');
    } catch {
      await delay(350);
      const mockUser = {
        id: 'usr_101',
        name: credentials.email.split('@')[0].replace('.', ' ') || 'Ananya Verma',
        email: credentials.email,
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        role: 'traveler',
        memberSince: 'March 2024'
      };
      localStorage.setItem('staynest_token', 'mock_token_staynest_xyz');
      localStorage.setItem('staynest_user', JSON.stringify(mockUser));
      return mockUser;
    }
  },

  // 7. POST /auth/register
  register: async (userData) => {
    try {
      // const response = await apiClient.post('/auth/register', userData);
      // return response.data;
      throw new Error('Using local adapter');
    } catch {
      await delay(400);
      const newUser = {
        id: `usr_${Date.now()}`,
        name: userData.fullName || 'Traveler',
        email: userData.email,
        phone: userData.phone || '+91 98765 00000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        role: 'traveler',
        memberSince: 'October 2026'
      };
      localStorage.setItem('staynest_token', 'mock_token_staynest_xyz');
      localStorage.setItem('staynest_user', JSON.stringify(newUser));
      return newUser;
    }
  },

  // 8. PUT /users/:id
  updateUserProfile: async (userId, data) => {
    try {
      // const response = await apiClient.put(`/users/${userId}`, data);
      // return response.data;
      throw new Error('Using local adapter');
    } catch {
      await delay(300);
      const currentUser = JSON.parse(localStorage.getItem('staynest_user') || '{}');
      const updated = { ...currentUser, ...data };
      localStorage.setItem('staynest_user', JSON.stringify(updated));
      return updated;
    }
  }
};

export default apiClient;
