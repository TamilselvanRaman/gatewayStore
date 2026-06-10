import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register, user } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const fromPath = location.state?.from?.pathname || '/';
      navigate(fromPath, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !phone || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    const result = await register(name, email, phone, password);
    setSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="card gateway-card border-0 shadow w-100 p-4" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <Link className="text-decoration-none fs-2 fw-bolder font-headings d-inline-flex align-items-center mb-2 gap-2" to="/">
            <img src="/logo.png" alt="Gateway Store Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            <div>
              <span className="text-blue">Gateway</span>
              <span className="text-orange ms-1">Store</span>
            </div>
          </Link>
          <p className="text-muted fs-7 mb-0">Create your user account to track orders and save wishlists</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 fs-7 py-2 px-3 mb-4" role="alert">
            <FiAlertCircle className="flex-shrink-0" size={16} />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {/* Name */}
          <div>
            <label className="form-label fw-bold text-dark fs-7">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><FiUser size={16} /></span>
              <input
                type="text"
                className="form-control gateway-input border-start-0 ps-0 fs-7"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="form-label fw-bold text-dark fs-7">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><FiMail size={16} /></span>
              <input
                type="email"
                className="form-control gateway-input border-start-0 ps-0 fs-7"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="form-label fw-bold text-dark fs-7">Phone Number</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><FiPhone size={16} /></span>
              <input
                type="tel"
                className="form-control gateway-input border-start-0 ps-0 fs-7"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="form-label fw-bold text-dark fs-7">Password (6+ chars)</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><FiLock size={16} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control gateway-input border-start-0 border-end-0 ps-0 fs-7"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-group-text bg-light border-start-0 text-muted border-0"
                onClick={() => setShowPassword(!showPassword)}
                style={{ outline: 'none' }}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-gateway-primary py-3 rounded-pill fw-bold font-headings mt-2"
            disabled={submitting}
          >
            {submitting ? 'Registering Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-4 pt-2 border-top border-light">
          <p className="text-muted fs-7 mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-blue fw-bold text-decoration-none">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
