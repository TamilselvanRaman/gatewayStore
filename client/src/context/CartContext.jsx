import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(true);

  const safeSetCart = (data) => {
    if (data && Array.isArray(data.products)) {
      setCart(data);
    } else {
      setCart({ products: [] });
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      if (user) {
        try {
          const res = await api.get('/cart');
          safeSetCart(res.data.data);
        } catch (error) {
          console.error('Error fetching cart from server', error);
          setCart({ products: [] });
        }
      } else {
        const localCart = localStorage.getItem('gateway_guest_cart');
        try {
          safeSetCart(localCart ? JSON.parse(localCart) : { products: [] });
        } catch {
          setCart({ products: [] });
        }
      }
      setLoading(false);
    };
    fetchCart();
  }, [user]);

  const saveGuestCart = (newCart) => {
    localStorage.setItem('gateway_guest_cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        const res = await api.post('/cart', { productId: product._id, quantity });
        safeSetCart(res.data.data);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to add item to cart'
        };
      }
    } else {
      const newCart = { ...cart, products: [...(cart.products || [])] };
      const existingItemIndex = newCart.products.findIndex(
        (item) => item.product._id === product._id
      );
      if (existingItemIndex > -1) {
        newCart.products[existingItemIndex].quantity += Number(quantity);
      } else {
        newCart.products.push({ product, quantity: Number(quantity) });
      }
      saveGuestCart(newCart);
      return { success: true };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (user) {
      try {
        const res = await api.put(`/cart/${productId}`, { quantity });
        safeSetCart(res.data.data);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to update quantity'
        };
      }
    } else {
      const newCart = { ...cart, products: [...(cart.products || [])] };
      const existingItemIndex = newCart.products.findIndex(
        (item) => item.product._id === productId
      );
      if (existingItemIndex > -1) {
        newCart.products[existingItemIndex].quantity = Number(quantity);
        saveGuestCart(newCart);
      }
      return { success: true };
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const res = await api.delete(`/cart/${productId}`);
        safeSetCart(res.data.data);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to remove item'
        };
      }
    } else {
      const newCart = { ...cart };
      newCart.products = (newCart.products || []).filter(
        (item) => item.product._id !== productId
      );
      saveGuestCart(newCart);
      return { success: true };
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart');
        setCart({ products: [] });
      } catch (error) {
        console.error('Failed to clear cart on server', error);
      }
    } else {
      saveGuestCart({ products: [] });
    }
  };

  const products = cart?.products || [];

  const cartItemCount = products.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const cartSubtotal = products.reduce((acc, item) => {
    if (!item.product) return acc;
    const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
    return acc + (price || 0) * (item.quantity || 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        cartSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};