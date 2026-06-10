import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      const fromPath = location.state?.from?.pathname || '/';
      navigate(fromPath, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card gateway-card border-0 shadow w-100 p-4" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <Link className="text-decoration-none fs-2 fw-bolder font-headings d-inline-flex align-items-center mb-2 gap-2" to="/">
            <img src="/logo.png" alt="Gateway Store Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            <div>
              <span className="text-blue">Gateway</span>
              <span className="text-orange ms-1">Store</span>
            </div>
          </Link>
          <p className="text-muted fs-7 mb-0">Sign in to manage orders, wishlist and shopping carts</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 fs-7 py-2 px-3 mb-4" role="alert">
            <FiAlertCircle className="flex-shrink-0" size={16} />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {/* Email field */}
          <div>
            <label className="form-label fw-bold text-dark fs-7">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><FiMail size={16} /></span>
              <input
                type="email"
                className="form-control gateway-input border-start-0 ps-0 fs-7"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label fw-bold text-dark fs-7 mb-0">Password</label>
              <a href="#" className="text-blue fs-7 text-decoration-none fw-semibold">Forgot?</a>
            </div>
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

          {/* Remember Me */}
          <div className="form-check my-1">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberLoginCheck"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label text-muted fs-7" htmlFor="rememberLoginCheck">
              Remember me on this browser
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-gateway-primary py-3 rounded-pill fw-bold font-headings mt-2"
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>


        <div className="text-center mt-4 pt-2 border-top border-light">
          <p className="text-muted fs-7 mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange fw-bold text-decoration-none">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
