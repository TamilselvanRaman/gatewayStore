import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiUser, FiMapPin, FiCreditCard, FiPackage,
  FiCheckCircle, FiAlertCircle, FiClock, FiTruck, FiXCircle, FiSave
} from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await api.get(`/orders/${id}`);
        const ord = res.data.data;
        setOrder(ord);
        setOrderStatus(ord.orderStatus);
        setPaymentStatus(ord.paymentStatus);
      } catch (err) {
        console.error('Failed to load admin order detail', err);
        setErrorMsg(err.response?.data?.message || 'Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUpdateMsg('');
    setUpdateError('');
    try {
      const res = await api.put(`/orders/${id}`, { orderStatus, paymentStatus });
      if (res.data.success) {
        setOrder(prev => ({ ...prev, orderStatus, paymentStatus }));
        setUpdateMsg('Order statuses updated successfully!');
        setTimeout(() => setUpdateMsg(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update order status', err);
      setUpdateError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      Pending:    { cls: 'bg-warning text-dark', icon: <FiClock size={12} /> },
      Processing: { cls: 'bg-info text-dark',    icon: <FiAlertCircle size={12} /> },
      Shipped:    { cls: 'bg-primary text-white', icon: <FiTruck size={12} /> },
      Delivered:  { cls: 'bg-success text-white', icon: <FiCheckCircle size={12} /> },
      Cancelled:  { cls: 'bg-danger text-white',  icon: <FiXCircle size={12} /> },
    };
    return map[status] || { cls: 'bg-secondary text-white', icon: null };
  };

  const getPaymentBadge = (status) => {
    const map = {
      Pending:  'bg-warning text-dark',
      Paid:     'bg-success text-white',
      Failed:   'bg-danger text-white',
      Refunded: 'bg-info text-dark',
    };
    return map[status] || 'bg-secondary text-white';
  };

  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStep = steps.indexOf(order?.orderStatus);

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12 col-md-3 col-lg-2 mb-4 mb-md-0"><Sidebar /></div>
          <div className="col-12 col-md-9 col-lg-10 d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }} />
              <p className="text-muted mt-3 fs-7">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12 col-md-3 col-lg-2 mb-4 mb-md-0"><Sidebar /></div>
          <div className="col-12 col-md-9 col-lg-10 d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
              <FiAlertCircle size={48} className="text-danger mb-3" />
              <h5 className="fw-bold text-dark">Order Not Found</h5>
              <p className="text-muted fs-7">{errorMsg || 'This order could not be retrieved.'}</p>
              <button onClick={() => navigate('/admin/orders')} className="btn btn-outline-primary rounded-pill px-4 fs-7">
                ← Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { icon: statusIcon, cls: statusCls } = getStatusBadge(order.orderStatus);

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="row">

        {}
        <div className="col-12 col-md-3 col-lg-2 mb-4 mb-md-0">
          <Sidebar />
        </div>

        {}
        <div className="col-12 col-md-9 col-lg-10">

          {}
          <div className="mb-4">
            <button
              onClick={() => navigate('/admin/orders')}
              className="btn btn-link text-muted text-decoration-none fw-semibold d-inline-flex align-items-center gap-2 mb-3 p-0"
            >
              <FiArrowLeft /> Back to Orders
            </button>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
              <div>
                <h2 className="fw-bold font-headings mb-1 text-dark">Order Details</h2>
                <p className="text-muted fs-7 mb-0">
                  Tracking ID: <strong className="text-dark">{order.trackingNumber}</strong>
                  <span className="mx-2 text-muted">·</span>
                  Placed on <strong>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </p>
              </div>
              <div className="text-sm-end">
                <div className="fw-bold font-headings fs-3 text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</div>
                <span className={`badge rounded-pill px-3 py-2 fs-8 fw-semibold d-inline-flex align-items-center gap-1 ${statusCls}`}>
                  {statusIcon} {order.orderStatus}
                </span>
              </div>
            </div>
          </div>

          {}
          {updateMsg && (
            <div className="alert alert-success py-2 px-3 rounded-3 fs-7 mb-4 d-flex align-items-center gap-2">
              <FiCheckCircle /> <span>{updateMsg}</span>
            </div>
          )}
          {updateError && (
            <div className="alert alert-danger py-2 px-3 rounded-3 fs-7 mb-4">{updateError}</div>
          )}

          {}
          {order.orderStatus !== 'Cancelled' && (
            <div className="gateway-card bg-white border-0 shadow-sm p-4 mb-4">
              <h6 className="fw-bold font-headings text-muted mb-4 fs-8 text-uppercase">Order Timeline</h6>
              <div className="d-flex align-items-center position-relative">
                {}
                <div className="position-absolute" style={{ top: '22px', left: '5%', right: '5%', height: '3px', background: '#e9ecef', zIndex: 0 }} />
                <div
                  className="position-absolute"
                  style={{
                    top: '22px', left: '5%',
                    width: currentStep >= 0 ? `${(currentStep / 3) * 90}%` : '0%',
                    height: '3px', background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                    zIndex: 1, transition: 'width 0.5s ease'
                  }}
                />
                {steps.map((step, idx) => {
                  const done = currentStep >= idx;
                  const active = currentStep === idx;
                  return (
                    <div key={step} className="text-center z-2 position-relative" style={{ flex: 1 }}>
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold ${done ? 'bg-primary text-white shadow' : 'bg-white text-muted border border-secondary-subtle'}`}
                        style={{ width: '44px', height: '44px', fontSize: '14px', border: done ? 'none' : '2px solid #dee2e6', transition: 'all 0.3s', boxShadow: active ? '0 0 0 4px rgba(59,130,246,0.2)' : '' }}
                      >
                        {done ? <FiCheckCircle size={18} /> : idx + 1}
                      </div>
                      <div className={`fs-8 fw-semibold ${done ? 'text-primary' : 'text-muted'}`}>{step}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {order.orderStatus === 'Cancelled' && (
            <div className="alert alert-danger rounded-3 p-3 fs-7 mb-4 d-flex align-items-center gap-2">
              <FiXCircle size={20} className="flex-shrink-0" />
              <span>This order has been <strong>cancelled</strong>. Payment status: <strong>{order.paymentStatus}</strong>.</span>
            </div>
          )}

          <div className="row g-4">

            {}
            <div className="col-lg-8">

              {}
              <div className="gateway-card bg-white border-0 shadow-sm p-4 mb-4">
                <h5 className="fw-bold font-headings text-dark mb-4 d-flex align-items-center gap-2">
                  <FiPackage className="text-primary" /> Items Purchased
                </h5>
                <div className="d-flex flex-column gap-3">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="d-flex align-items-center justify-content-between py-3 border-bottom border-light">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold fs-7"
                          style={{ width: '48px', height: '48px', flexShrink: 0 }}
                        >
                          {item.title.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold text-dark fs-7">{item.title}</div>
                          <div className="text-muted fs-8">Unit: ₹{item.price.toLocaleString('en-IN')} × {item.quantity}</div>
                        </div>
                      </div>
                      <div className="fw-bold text-primary fs-6">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
                {}
                <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                  <span className="text-muted fs-7">Order Total</span>
                  <span className="fw-bold text-dark font-headings fs-5">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {}
              <div className="gateway-card bg-white border-0 shadow-sm p-4 mb-4">
                <h5 className="fw-bold font-headings text-dark mb-4 d-flex align-items-center gap-2">
                  <FiUser className="text-primary" /> Customer Record
                </h5>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <div className="text-muted fs-8 mb-1 text-uppercase fw-bold">Full Name</div>
                      <div className="fw-bold text-dark">{order.user?.name || 'Guest User'}</div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <div className="text-muted fs-8 mb-1 text-uppercase fw-bold">Email Address</div>
                      <div className="fw-bold text-dark text-truncate">{order.user?.email || '—'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="gateway-card bg-white border-0 shadow-sm p-4">
                <h5 className="fw-bold font-headings text-dark mb-4 d-flex align-items-center gap-2">
                  <FiMapPin className="text-primary" /> Delivery Address
                </h5>
                <div className="p-4 bg-light rounded-3 border-start border-primary border-4">
                  <p className="mb-1 fw-bold text-dark fs-6">{order.address.name}</p>
                  <p className="mb-1 text-muted fs-7">📞 {order.address.phone}</p>
                  <p className="mb-0 text-muted fs-7">
                    {order.address.street}, {order.address.city},<br />
                    {order.address.state} — {order.address.zipCode}
                  </p>
                </div>
              </div>

            </div>

            {}
            <div className="col-lg-4">

              {}
              <div className="gateway-card bg-white border-0 shadow-sm p-4 mb-4">
                <h5 className="fw-bold font-headings text-dark mb-4 d-flex align-items-center gap-2">
                  <FiCreditCard className="text-primary" /> Payment Info
                </h5>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                    <span className="text-muted fs-7">Method</span>
                    <span className="fw-bold text-dark fs-7">{order.paymentMethod}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                    <span className="text-muted fs-7">Payment Status</span>
                    <span className={`badge rounded-pill px-3 py-2 fs-8 fw-semibold ${getPaymentBadge(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span className="text-muted fs-7">Order Status</span>
                    <span className={`badge rounded-pill px-3 py-2 fs-8 fw-semibold d-inline-flex align-items-center gap-1 ${statusCls}`}>
                      {statusIcon} {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {}
              <div className="gateway-card bg-white border-0 shadow-sm p-4" style={{ position: 'sticky', top: '100px' }}>
                <h5 className="fw-bold font-headings text-dark mb-1">Update Status</h5>
                <p className="text-muted fs-8 mb-4">Modify order & payment statuses</p>

                <form onSubmit={handleSaveStatus} className="d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fw-bold text-dark fs-7 mb-1">Order Status</label>
                    <select
                      className="form-select gateway-input bg-light fs-7 py-2"
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                      disabled={order.orderStatus === 'Cancelled'}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled" disabled>Cancelled (System Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label fw-bold text-dark fs-7 mb-1">Payment Status</label>
                    <select
                      className="form-select gateway-input bg-light fs-7 py-2"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={saving || order.orderStatus === 'Cancelled'}
                    className="btn btn-gateway-primary rounded-pill py-2 fs-7 fw-bold d-flex align-items-center justify-content-center gap-2 w-100 mt-1"
                  >
                    {saving ? (
                      <><span className="spinner-border spinner-border-sm" /> Saving...</>
                    ) : (
                      <><FiSave size={15} /> Save Changes</>
                    )}
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;