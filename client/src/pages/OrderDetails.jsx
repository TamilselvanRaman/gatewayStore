import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiTruck, FiClock, FiAlertCircle, FiXCircle, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import api from '../utils/api';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [cancelStatusMsg, setCancelStatusMsg] = useState('');

  const fetchOrderDetails = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.data);
    } catch (error) {
      console.error('Error fetching order details', error);
      setErrorMsg(error.response?.data?.message || 'Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        setCancelStatusMsg('');
        const res = await api.put(`/orders/${id}`, { orderStatus: 'Cancelled' });
        setOrder(prev => ({ ...prev, orderStatus: 'Cancelled', paymentStatus: 'Failed' }));
        setCancelStatusMsg('Order cancelled successfully.');
      } catch (err) {
        console.error('Failed to cancel order', err);
        setCancelStatusMsg(err.response?.data?.message || 'Failed to cancel order. Please contact support.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'Processing': return 'bg-info text-dark';
      case 'Shipped': return 'bg-primary text-white';
      case 'Delivered': return 'bg-success text-white';
      case 'Cancelled': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const getOrderStatusStep = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-blue" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block p-4 rounded-4" role="alert">
          <h5 className="alert-heading fw-bold font-headings">Order Not Found</h5>
          <p className="mb-0">{errorMsg || 'The requested order details could not be retrieved.'}</p>
          <Link to="/orders" className="btn btn-outline-danger mt-3 rounded-pill btn-sm">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 animate-fade-in">
      <Link to="/orders" className="btn btn-link text-muted text-decoration-none fw-semibold d-inline-flex align-items-center gap-2 mb-4">
        <FiArrowLeft /> Back to My Orders
      </Link>

      <div className="card gateway-card border-0 shadow p-4 p-md-5 mx-auto" style={{ maxWidth: '800px' }}>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start border-bottom pb-4 mb-4 gap-3">
          <div>
            <h3 className="fw-bold font-headings text-dark mb-1">Invoice Details</h3>
            <span className="text-muted fs-7">Tracking ID: <strong>{order.trackingNumber}</strong></span>
          </div>
          <div className="text-sm-end">
            <span className="fw-bold text-blue font-headings fs-4 d-block">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            <small className="text-muted fs-8">Placed on {new Date(order.createdAt).toLocaleDateString()}</small>
          </div>
        </div>

        {cancelStatusMsg && (
          <div className="alert alert-info rounded-3 py-2 px-3 fs-7 mb-4 d-flex align-items-center gap-2">
            <FiAlertCircle size={16} /> <span>{cancelStatusMsg}</span>
          </div>
        )}
        {order.orderStatus !== 'Cancelled' ? (
          <div className="mb-5 bg-light p-4 rounded-4 border border-light shadow-sm">
            <h6 className="fw-bold font-headings text-muted mb-4 fs-8 text-uppercase tracking-wider">Tracking Timeline</h6>
            <div className="d-flex justify-content-between position-relative fs-8 fw-bold">
              {['Pending', 'Processing', 'Shipped', 'Delivered'].map((stepName, idx) => {
                const stepIndex = getOrderStatusStep(order.orderStatus);
                const isDone = stepIndex >= idx;
                return (
                  <div key={stepName} className={`text-center z-1 ${isDone ? 'text-blue' : 'text-muted'}`} style={{ flex: 1 }}>
                    <span className={`d-flex align-items-center justify-content-center rounded-circle border mx-auto mb-2 ${isDone ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-muted border-secondary'}`} style={{ width: '28px', height: '28px', fontSize: '11px', transition: 'all 0.3s' }}>{idx + 1}</span>
                    {stepName}
                  </div>
                );
              })}
              <div className="position-absolute top-25 start-0 w-100 bg-secondary-subtle" style={{ height: '3px', zIndex: 0, transform: 'translateY(12px)', opacity: 0.5 }}></div>
            </div>
          </div>
        ) : (
          <div className="alert alert-danger rounded-3 p-3 fs-7 mb-5 d-flex align-items-center gap-2">
            <FiXCircle className="flex-shrink-0" size={20} />
            <span>This order has been cancelled. If any online payment was deducted, it will be refunded.</span>
          </div>
        )}
        <div className="mb-5">
          <h5 className="fw-bold font-headings text-dark mb-3">Items Purchased</h5>
          <div className="d-flex flex-column gap-3">
            {order.products.map((item, index) => (
              <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom border-light fs-6">
                <div>
                  <span className="text-dark fw-bold">{item.title}</span>
                  <div className="text-muted fs-7 mt-1">Unit Price: ₹{item.price.toLocaleString('en-IN')}</div>
                </div>
                <span className="text-blue fw-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')} <span className="text-muted fs-7 fw-normal">x {item.quantity}</span></span>
              </div>
            ))}
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <h5 className="fw-bold font-headings text-dark mb-3">Delivery Address</h5>
            <div className="p-4 bg-light rounded-4 border border-light h-100">
              <p className="mb-2 fw-bold text-dark fs-6">{order.address.name}</p>
              <p className="mb-2 text-muted fs-7"><strong>Phone:</strong> {order.address.phone}</p>
              <p className="mb-0 text-muted fs-7 leading-relaxed">{order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipCode}</p>
            </div>
          </div>
          <div className="col-md-6">
            <h5 className="fw-bold font-headings text-dark mb-3">Payment Info</h5>
            <div className="p-4 bg-light rounded-4 border border-light h-100 d-flex flex-column justify-content-between">
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between fs-7 border-bottom pb-2">
                  <span className="text-muted">Payment Method:</span>
                  <span className="fw-bold text-dark">{order.paymentMethod}</span>
                </div>
                <div className="d-flex justify-content-between fs-7 pt-1">
                  <span className="text-muted">Payment Status:</span>
                  <span className={`badge rounded-pill px-3 py-2 fw-semibold fs-8 ${order.paymentStatus === 'Paid' ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              {order.orderStatus === 'Pending' && (
                <button 
                  onClick={handleCancelOrder}
                  className="btn btn-outline-danger w-100 rounded-pill py-2.5 mt-4 fw-bold fs-7 d-flex align-items-center justify-content-center gap-2"
                >
                  <FiXCircle size={18} /> Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;