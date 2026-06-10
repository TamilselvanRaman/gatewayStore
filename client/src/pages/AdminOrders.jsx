import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiClock, FiTruck, FiCheckCircle, FiXCircle, FiAlertCircle, FiChevronRight } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get('/orders');
        setOrders(res.data.data);
      } catch (err) {
        console.error('Failed to load admin orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pending':    return { cls: 'bg-warning text-dark',  icon: <FiClock size={12} /> };
      case 'Processing': return { cls: 'bg-info text-dark',     icon: <FiAlertCircle size={12} /> };
      case 'Shipped':    return { cls: 'bg-primary text-white', icon: <FiTruck size={12} /> };
      case 'Delivered':  return { cls: 'bg-success text-white', icon: <FiCheckCircle size={12} /> };
      case 'Cancelled':  return { cls: 'bg-danger text-white',  icon: <FiXCircle size={12} /> };
      default:           return { cls: 'bg-secondary text-white', icon: null };
    }
  };

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="row">
        <div className="col-12 col-md-3 col-lg-2 mb-4 mb-md-0">
          <Sidebar />
        </div>
        <div className="col-12 col-md-9 col-lg-10">

          <div className="mb-4">
            <h2 className="fw-bold font-headings mb-1 text-dark">Order Administration</h2>
            <p className="text-muted fs-7 mb-0">Click any order to view full details, update statuses, and manage fulfillment</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
                <span className="visually-hidden">Loading orders...</span>
              </div>
              <p className="text-muted mt-3 fs-7">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5 bg-white border rounded-4 shadow-sm">
              <FiShoppingBag size={56} className="text-muted mb-3" />
              <h5 className="fw-bold font-headings text-dark">No Orders Yet</h5>
              <p className="text-muted fs-7 mb-0">No orders have been placed in the system.</p>
            </div>
          ) : (
            <div className="gateway-card bg-white border-0 shadow-sm p-4">
              <div className="table-responsive">
                <table className="table align-middle fs-7 mb-0">
                  <thead>
                    <tr className="text-muted border-bottom fs-8 text-uppercase">
                      <th className="py-3">Track ID</th>
                      <th className="py-3">Customer</th>
                      <th className="py-3">Items</th>
                      <th className="py-3">Total Amount</th>
                      <th className="py-3">Order Status</th>
                      <th className="py-3">Payment</th>
                      <th className="py-3">Date</th>
                      <th className="py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => {
                      const { cls, icon } = getStatusConfig(ord.orderStatus);
                      return (
                        <tr
                          key={ord._id}
                          onClick={() => navigate(`/admin/orders/${ord._id}`)}
                          className="border-bottom border-light"
                          style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                          onMouseLeave={e => e.currentTarget.style.background = ''}
                        >
                          <td className="py-3">
                            <span className="fw-bold text-dark font-monospace fs-8">{ord.trackingNumber}</span>
                          </td>
                          <td className="py-3">
                            <div className="fw-semibold text-dark">{ord.user?.name || 'Guest User'}</div>
                            <div className="text-muted fs-8 text-truncate" style={{ maxWidth: '140px' }}>{ord.user?.email || '—'}</div>
                          </td>
                          <td className="py-3">
                            <span className="badge bg-light text-dark border fs-8 fw-semibold">
                              {ord.products?.length || 0} item{ord.products?.length !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="fw-bold text-primary fs-6">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                          </td>
                          <td className="py-3">
                            <span className={`badge rounded-pill px-3 py-2 fs-8 fw-semibold d-inline-flex align-items-center gap-1 ${cls}`}>
                              {icon} {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`badge rounded-pill px-3 py-2 fs-8 fw-semibold ${
                              ord.paymentStatus === 'Paid' ? 'bg-success text-white' :
                              ord.paymentStatus === 'Failed' ? 'bg-danger text-white' :
                              ord.paymentStatus === 'Refunded' ? 'bg-info text-dark' :
                              'bg-warning text-dark'
                            }`}>
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 text-muted text-nowrap">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center justify-content-end gap-1 text-muted">
                              <span className="fs-8">View</span>
                              <FiChevronRight size={16} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 pt-2 border-top text-muted fs-8">
                {orders.length} order{orders.length !== 1 ? 's' : ''} total
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminOrders;