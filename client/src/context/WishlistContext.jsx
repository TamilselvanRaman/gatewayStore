import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      if (user) {
        try {
          const res = await api.get('/wishlist');
          setWishlist(res.data.data);
        } catch (error) {
          console.error('Error fetching wishlist from server', error);
        }
      } else {

        const localWishlist = localStorage.getItem('gateway_guest_wishlist');
        setWishlist(localWishlist ? JSON.parse(localWishlist) : []);
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
        setWishlist(res.data.data);
        return { success: true, isAdded: res.data.message.includes('Added') };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to update wishlist'
        };
      }
    } else {

      const isAlreadyInWishlist = wishlist.some((item) => item._id === product._id);
      let newWishlist = [];
      let isAdded = false;

      if (isAlreadyInWishlist) {
        newWishlist = wishlist.filter((item) => item._id !== product._id);
      } else {
        newWishlist = [...wishlist, product];
        isAdded = true;
      }

      saveGuestWishlist(newWishlist);
      return { success: true, isAdded };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};