import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('staynest_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [1, 3];
      }
    }
    return [1, 3]; // Default saved favorites
  });

  useEffect(() => {
    localStorage.setItem('staynest_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (homestayId) => {
    const id = Number(homestayId);
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isInWishlist = (homestayId) => {
    return wishlist.includes(Number(homestayId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
