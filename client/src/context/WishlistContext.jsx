import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const safeSetWishlist = (data) => {
    setWishlist(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      if (user) {
        try {
          const res = await api.get('/wishlist');
          safeSetWishlist(res.data.data);
        } catch (error) {
          console.error('Error fetching wishlist from server', error);
          setWishlist([]);
        }
      } else {
        const localWishlist = localStorage.getItem('gateway_guest_wishlist');
        try {
          safeSetWishlist(localWishlist ? JSON.parse(localWishlist) : []);
        } catch {
          setWishlist([]);
        }
      }
      setLoading(false);
    };
    fetchWishlist();
  }, [user]);

  const saveGuestWishlist = (newWishlist) => {
    localStorage.setItem('gateway_guest_wishlist', JSON.stringify(newWishlist));
    setWishlist(newWishlist);
  };

  const toggleWishlist = async (product) => {
    if (user) {
      try {
        const res = await api.post('/wishlist', { productId: product._id });
        safeSetWishlist(res.data.data);
        return { success: true, isAdded: res.data.message?.includes('Added') };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to update wishlist'
        };
      }
    } else {
      const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
      const isAlreadyInWishlist = safeWishlist.some((item) => item._id === product._id);
      let newWishlist = [];
      let isAdded = false;
      if (isAlreadyInWishlist) {
        newWishlist = safeWishlist.filter((item) => item._id !== product._id);
      } else {
        newWishlist = [...safeWishlist, product];
        isAdded = true;
      }
      saveGuestWishlist(newWishlist);
      return { success: true, isAdded };
    }
  };

  const isInWishlist = (productId) => {
    return Array.isArray(wishlist) && wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist: Array.isArray(wishlist) ? wishlist : [],
        loading,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};