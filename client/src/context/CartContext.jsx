import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      if (user) {
        try {
          const res = await api.get('/cart');
          setCart(res.data.data);
        } catch (error) {
          console.error('Error fetching cart from server', error);
        }
      } else {

        const localCart = localStorage.getItem('gateway_guest_cart');
        setCart(localCart ? JSON.parse(localCart) : { products: [] });
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
        setCart(res.data.data);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to add item to cart'
        };
      }
    } else {

      const newCart = { ...cart };
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
        setCart(res.data.data);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to update quantity'
        };
      }
    } else {

      const newCart = { ...cart };
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
        setCart(res.data.data);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to remove item'
        };
      }
    } else {

      const newCart = { ...cart };
      newCart.products = newCart.products.filter(
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

  const cartItemCount = cart.products.reduce((acc, item) => acc + item.quantity, 0);
  
  const cartSubtotal = cart.products.reduce((acc, item) => {
    const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
    return acc + price * item.quantity;
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