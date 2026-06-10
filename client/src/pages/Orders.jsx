import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import api from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/myorders');
      setOrders(res.data.data);
    } catch (error) {
      console.error('Error fetching customer orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  return (
    <div className="container py-5 animate-fade-in">
      <h2 className="fw-bold font-headings mb-4">My Orders</h2>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-blue" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-light shadow-sm">
          <FiShoppingBag className="text-muted mb-3" size={56} />
          <h4 className="fw-bold font-headings text-dark">No Orders Yet</h4>
          <p className="text-muted fs-6 mx-auto mb-4" style={{ maxWidth: '400px' }}>
            You haven't placed any orders with Gateway Store yet. Shop our premium electronics and checkout!
          </p>
          <Link to="/products" className="btn btn-gateway-primary px-4 rounded-pill">
            Explore Store Catalog
          </Link>
        </div>
      ) : (
        <div className="mx-auto" style={{ maxWidth: '800px' }}>
          <div className="d-flex flex-column gap-3">
            {orders.map((order) => (
              <div 
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)}
                className="gateway-card p-4 bg-white border border-light-subtle cursor-pointer hover-shadow transition d-flex justify-content-between align-items-center rounded-3"
              >
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="fw-bold font-headings text-dark fs-6">Tracking ID: {order.trackingNumber}</span>
                    <span className={`badge px-3 py-1 rounded-pill fs-8 fw-semibold ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="fs-7 text-muted">
                    <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="mx-2">|</span>
                    <span>Total: <strong className="text-dark">₹{order.totalAmount.toLocaleString('en-IN')}</strong></span>
                    <span className="mx-2">|</span>
                    <span>{order.products.length} {order.products.length === 1 ? 'item' : 'items'}</span>
                  </div>
                </div>

                <div className="text-blue">
                  <FiArrowRight size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;