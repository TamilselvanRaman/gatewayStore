import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';

const Checkout = () => {
  const { user, saveAddress } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cart.products || cart.products.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const stateSummary = location.state || {};
  const subtotal = stateSummary.subtotal || 0;
  const discount = stateSummary.discount || 0;
  const shipping = stateSummary.shipping || 0;
  const total = stateSummary.total || 0;

  const [selectedAddressId, setSelectedAddressId] = useState(user?.address?.[0]?._id || 'new');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newStateVal, setNewStateVal] = useState('');
  const [newZipCode, setNewZipCode] = useState('');
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [addrError, setAddrError] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [payError, setPayError] = useState('');

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handlePlaceOrder = async () => {
    setAddrError('');
    setPayError('');

    if (selectedAddressId === 'new') {
      if (!newStreet || !newCity || !newStateVal || !newZipCode) {
        setAddrError('Please fill in all shipping fields.');
        const element = document.getElementById('shipping-section');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    if (paymentMethod === 'Card') {
      if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
        setPayError('Please fill in all credit card details.');
        const element = document.getElementById('payment-section');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    setIsPlacingOrder(true);
    try {

      let finalAddress = {};
      if (selectedAddressId !== 'new') {
        const savedAddr = user.address.find((addr) => addr._id === selectedAddressId);
        finalAddress = {
          name: user.name,
          phone: user.phone,
          street: savedAddr.street,
          city: savedAddr.city,
          state: savedAddr.state,
          zipCode: savedAddr.zipCode,
          country: savedAddr.country
        };
      } else {
        finalAddress = {
          name: user.name,
          phone: user.phone,
          street: newStreet,
          city: newCity,
          state: newStateVal,
          zipCode: newZipCode,
          country: 'India'
        };

        if (saveToProfile) {
          try {
            await saveAddress({
              street: newStreet,
              city: newCity,
              state: newStateVal,
              zipCode: newZipCode
            });
          } catch (err) {
            console.error('Failed to auto-save address to profile', err);
          }
        }
      }

      const orderProducts = cart.products.map((item) => ({
        product: item.product._id,
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price
      }));

      const orderData = {
        products: orderProducts,
        address: finalAddress,
        paymentMethod,
        totalAmount: total
      };

      const res = await api.post('/orders', orderData);
      

      setOrderSuccess(res.data.data);
      clearCart();
    } catch (error) {
      console.error('Checkout failed', error);
      setPayError(error.response?.data?.message || 'Failed to submit order. Please check card or connection.');
      const element = document.getElementById('payment-section');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container py-5 text-center animate-fade-in">
        <div className="card gateway-card border-0 shadow p-5 mx-auto w-100" style={{ maxWidth: '600px' }}>
          <FiCheckCircle className="text-success mb-3" size={72} />
          <h2 className="fw-bold font-headings text-success mb-2">Order Confirmed!</h2>
          <p className="text-muted mb-4 fs-6">
            Thank you for purchasing with Gateway Store. Your order has been placed successfully. Tracking ID is: <strong>{orderSuccess.trackingNumber}</strong>
          </p>
          <div className="bg-light p-3 rounded-3 mb-4 text-start fs-7">
            <h6 className="fw-bold font-headings border-bottom pb-2 mb-2">Delivery Address</h6>
            <p className="mb-1"><strong>Receiver:</strong> {orderSuccess.address.name}</p>
            <p className="mb-1"><strong>Phone:</strong> {orderSuccess.address.phone}</p>
            <p className="mb-0"><strong>Address:</strong> {orderSuccess.address.street}, {orderSuccess.address.city}, {orderSuccess.address.state} - {orderSuccess.address.zipCode}</p>
          </div>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <Link to="/orders" className="btn btn-gateway-primary px-4 rounded-pill">
              My Order History
            </Link>
            <Link to="/products" className="btn btn-gateway-outline px-4 rounded-pill">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 animate-fade-in">
      <h2 className="fw-bold font-headings mb-4 pb-2 border-bottom">Secure Checkout</h2>

      <div className="row g-4">
        
        {}
        <div className="col-lg-8">
          <div className="gateway-card p-4 p-md-5 bg-white border-0 shadow-sm d-flex flex-column gap-4">
            
            {}
            <div id="shipping-section">
              {addrError && (
                <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 fs-7 py-2 mb-4">
                  <FiAlertCircle size={16} /> <span>{addrError}</span>
                </div>
              )}

              {}
              {user?.address && user.address.length > 0 && (
                <div className="mb-4">
                  <label className="form-label fw-bold text-dark fs-7 mb-2">Select Shipping Address</label>
                  <div className="d-flex flex-column gap-3">
                    {user.address.map((addr) => (
                      <div 
                        key={addr._id} 
                        className={`p-3 border rounded-3 cursor-pointer transition ${selectedAddressId === addr._id ? 'border-primary bg-light' : 'border-light-subtle'}`} 
                        onClick={() => setSelectedAddressId(addr._id)}
                      >
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="selectedAddr" checked={selectedAddressId === addr._id} readOnly />
                          <label className="form-check-label fw-semibold text-dark fs-7">
                            {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                          </label>
                        </div>
                      </div>
                    ))}
                    <div 
                      className={`p-3 border rounded-3 cursor-pointer transition ${selectedAddressId === 'new' ? 'border-primary bg-light' : 'border-light-subtle'}`} 
                      onClick={() => setSelectedAddressId('new')}
                    >
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="selectedAddr" checked={selectedAddressId === 'new'} readOnly />
                        <label className="form-check-label fw-semibold text-dark fs-7">Ship to a new address</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {}
              {(selectedAddressId === 'new' || !user?.address || user.address.length === 0) && (
                <div className="row g-3 animate-fade-in">
                  <div className="col-12">
                    <label className="form-label fw-bold text-dark fs-7">Street / Apartment Details</label>
                    <input type="text" className="form-control gateway-input bg-light fs-7" placeholder="Apt 4B, Tech Street 123" value={newStreet} onChange={(e) => setNewStreet(e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-dark fs-7">City</label>
                    <input type="text" className="form-control gateway-input bg-light fs-7" placeholder="Coimbatore" value={newCity} onChange={(e) => setNewCity(e.target.value)} required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold text-dark fs-7">State</label>
                    <input type="text" className="form-control gateway-input bg-light fs-7" placeholder="Tamil Nadu" value={newStateVal} onChange={(e) => setNewStateVal(e.target.value)} required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold text-dark fs-7">Zip Code</label>
                    <input type="text" className="form-control gateway-input bg-light fs-7" placeholder="641045" value={newZipCode} onChange={(e) => setNewZipCode(e.target.value)} required />
                  </div>
                  {user && (
                    <div className="col-12">
                      <div className="form-check mt-2">
                        <input type="checkbox" className="form-check-input" id="saveAddrCheck" checked={saveToProfile} onChange={(e) => setSaveToProfile(e.target.checked)} />
                        <label className="form-check-label text-muted fs-7" htmlFor="saveAddrCheck">
                          Save this address to my profile info for future shopping
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <hr className="my-2 text-muted-subtle" />

            {}
            <div id="payment-section">
              {payError && (
                <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 fs-7 py-2 mb-4">
                  <FiAlertCircle size={16} /> <span>{payError}</span>
                </div>
              )}

              {}
              <div className="d-flex flex-column gap-3">
                {}
                <div 
                  className={`p-3 border rounded-3 cursor-pointer transition ${paymentMethod === 'COD' ? 'border-primary bg-light' : 'border-light-subtle'}`} 
                  onClick={() => setPaymentMethod('COD')}
                >
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="payMethod" checked={paymentMethod === 'COD'} readOnly />
                    <label className="form-check-label fw-bold text-dark fs-7">Cash on Delivery (COD)</label>
                    <p className="text-muted mb-0 fs-8 ms-1 mt-1">Pay with cash upon package delivery.</p>
                  </div>
                </div>

                {}
                <div 
                  className={`p-3 border rounded-3 cursor-pointer transition ${paymentMethod === 'Card' ? 'border-primary bg-light' : 'border-light-subtle'}`} 
                  onClick={() => setPaymentMethod('Card')}
                >
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="payMethod" checked={paymentMethod === 'Card'} readOnly />
                    <label className="form-check-label fw-bold text-dark fs-7">Online Credit / Debit Card (Mock Sandbox)</label>
                  </div>

                  {paymentMethod === 'Card' && (
                    <div className="row g-3 mt-3 border-top pt-3 animate-fade-in">
                      <div className="col-12">
                        <label className="form-label fw-bold fs-7 text-dark">Cardholder Name</label>
                        <input type="text" className="form-control gateway-input bg-white fs-7" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold fs-7 text-dark">Card Number</label>
                        <input type="text" className="form-control gateway-input bg-white fs-7" placeholder="1234 5678 9101 1121" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-bold fs-7 text-dark">Expiry (MM/YY)</label>
                        <input type="text" className="form-control gateway-input bg-white fs-7" placeholder="12/28" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} required />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-bold fs-7 text-dark">CVV Code</label>
                        <input type="password" className="form-control gateway-input bg-white fs-7" placeholder="•••" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} required />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr className="my-2 text-muted-subtle" />

            {}
            <div>
              <button 
                onClick={handlePlaceOrder} 
                className="btn btn-gateway-secondary w-100 py-3 rounded-pill fw-bold font-headings fs-6"
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? 'Completing Order...' : 'Confirm & Place Order'}
              </button>
            </div>

          </div>
        </div>

        {}
        <div className="col-lg-4">
          <div className="gateway-card p-4 bg-white border-0 shadow-sm position-sticky" style={{ top: '100px' }}>
            <h5 className="fw-bold font-headings mb-4 border-bottom pb-2">Checkout Details</h5>
            
            {}
            <div className="d-flex flex-column gap-3 mb-4" style={{ maxHeight: '220px', overflowY: 'auto' }}>
              {cart.products.map((item) => {
                const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
                return (
                  <div key={item.product._id} className="d-flex gap-2 align-items-center">
                    <div 
                      className="bg-light rounded-2 p-1 d-flex align-items-center justify-content-center text-uppercase text-muted fw-bold fs-8" 
                      style={{ width: '45px', height: '45px', flexShrink: 0 }}
                    >
                      {item.product.title.substring(0, 2)}
                    </div>
                    <div className="flex-grow-1 text-truncate fs-8">
                      <p className="fw-bold mb-0 text-dark text-truncate">{item.product.title}</p>
                      <span className="text-muted">₹{price.toLocaleString('en-IN')} x {item.quantity}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {}
            <div className="d-flex flex-column gap-2 mb-2 fs-7 text-muted border-top pt-3">
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="d-flex justify-content-between text-success">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="d-flex justify-content-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <hr className="my-1" />
              <div className="d-flex justify-content-between align-items-center fw-bold text-dark fs-6 mt-1">
                <span>Order Total</span>
                <span className="text-blue font-headings fs-5">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;