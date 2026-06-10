import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiTag, FiCheckCircle } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, cartSubtotal, cartItemCount } = useContext(CartContext);
  
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0); // in Rupees
  const [couponError, setCouponError] = useState('');

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-blue" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    
    // Mock coupon code check
    if (couponCode.toUpperCase() === 'GATEWAY20') {
      const discount = Math.round(cartSubtotal * 0.2); // 20% discount
      setCouponDiscount(discount);
      setCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code. Try GATEWAY20');
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponError('');
  };

  // Shipping logic
  const shippingCharge = cartSubtotal > 999 || cartSubtotal === 0 ? 0 : 99;
  const finalTotal = cartSubtotal - couponDiscount + shippingCharge;

  const handleProceedToCheckout = () => {
    // Navigate to checkout and pass total info
    navigate('/checkout', {
      state: {
        subtotal: cartSubtotal,
        discount: couponDiscount,
        shipping: shippingCharge,
        total: finalTotal,
        couponCode: couponApplied ? couponCode.toUpperCase() : ''
      }
    });
  };

  return (
    <div className="container py-5 animate-fade-in">
      <h2 className="fw-bold font-headings mb-4">Shopping Cart</h2>

      {cart.products.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-light shadow-sm">
          <FiShoppingBag className="text-muted mb-3" size={56} />
          <h4 className="fw-bold font-headings text-dark">Your Cart is Empty</h4>
          <p className="text-muted fs-6 mx-auto mb-4" style={{ maxWidth: '400px' }}>
            It looks like you haven't added any products to your cart yet. Explore our premium electronics collections and deals.
          </p>
          <Link to="/products" className="btn btn-gateway-primary px-4 rounded-pill">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          
          {/* Cart Products List */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-3">
              {cart.products.map((item) => {
                const { product, quantity } = item;
                const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
                const activePrice = hasDiscount ? product.discountPrice : product.price;
                const totalItemPrice = activePrice * quantity;

                return (
                  <div key={product._id} className="gateway-card p-3 bg-white border-0 shadow-sm d-flex flex-column flex-sm-row align-items-center gap-3">
                    {/* Image */}
                    <div className="d-flex align-items-center justify-content-center bg-light rounded-3 p-2" style={{ width: '90px', height: '90px', flexShrink: 0 }}>
                      <span className="fw-extrabold text-muted fs-5 text-uppercase">
                        {product.title.substring(0, 2)}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex-grow-1 text-center text-sm-start">
                      <span className="text-uppercase text-orange fw-bold fs-8 font-headings">{product.brand}</span>
                      <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
                        <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: '280px' }}>{product.title}</h6>
                      </Link>
                      <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-2 fs-7">
                        <span className="fw-bold text-blue">₹{activePrice.toLocaleString('en-IN')}</span>
                        {hasDiscount && (
                          <span className="text-muted text-decoration-line-through">₹{product.price.toLocaleString('en-IN')}</span>
                        )}
                        <span className="text-muted">x {quantity}</span>
                      </div>
                    </div>

                    {/* Quantity selectors */}
                    <div className="d-flex align-items-center gap-2">
                      <div className="input-group input-group-sm" style={{ width: '90px' }}>
                        <button 
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          className="btn btn-outline-secondary py-1" 
                          type="button"
                          disabled={quantity <= 1}
                        >-</button>
                        <input type="text" className="form-control text-center py-1 bg-white fs-7" value={quantity} readOnly />
                        <button 
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          className="btn btn-outline-secondary py-1" 
                          type="button"
                          disabled={quantity >= product.stock}
                        >+</button>
                      </div>
                    </div>

                    {/* Total Price & Delete */}
                    <div className="d-flex align-items-center gap-3 justify-content-between w-100 w-sm-auto">
                      <span className="fw-bold text-dark font-headings fs-6 text-nowrap">₹{totalItemPrice.toLocaleString('en-IN')}</span>
                      <button 
                        onClick={() => removeFromCart(product._id)}
                        className="btn btn-outline-danger btn-sm rounded-circle p-2 border-0"
                        title="Remove from Cart"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Checkout Summary Panel */}
          <div className="col-lg-4">
            <div className="gateway-card p-4 bg-white border-0 shadow-sm">
              <h5 className="fw-bold font-headings mb-4 border-bottom pb-2">Order Summary</h5>

              {/* Prices list */}
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex justify-content-between fs-7 text-muted">
                  <span>Subtotal ({cartItemCount} items)</span>
                  <span className="fw-semibold text-dark">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="d-flex justify-content-between fs-7 text-success">
                    <span>Discount (20% Code)</span>
                    <span className="fw-semibold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between fs-7 text-muted">
                  <span>Shipping Charges</span>
                  <span className="fw-semibold text-dark">
                    {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                  </span>
                </div>

                <hr className="my-1 text-muted" />

                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-dark fs-6">Estimated Total</span>
                  <span className="fw-bold text-blue font-headings fs-4">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>



              {/* Action */}
              <button 
                onClick={handleProceedToCheckout}
                className="btn btn-gateway-primary w-100 py-3 rounded-pill fw-bold font-headings"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
