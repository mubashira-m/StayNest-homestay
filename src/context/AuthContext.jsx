import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('staynest_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default demo user for instant smooth experience
    return {
      id: 'usr_101',
      name: 'Ananya Verma',
      email: 'ananya.travels@example.com',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: 'traveler',
      memberSince: 'March 2024',
      bio: 'Nature enthusiast, remote designer, and weekend wanderer exploring cozy homestays across India.'
    };
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('staynest_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('staynest_user');
      localStorage.removeItem('staynest_token');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await api.login({ email, password });
      setUser(loggedUser);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const registered = await api.register(userData);
      setUser(registered);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    try {
      const updated = await api.updateUserProfile(user?.id, updates);
      setUser(updated);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
