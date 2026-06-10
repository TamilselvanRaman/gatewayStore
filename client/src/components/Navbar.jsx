import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiUser, FiSearch, FiLogOut, FiSettings } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import api from '../utils/api';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { cartItemCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Error fetching categories in Navbar', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('search') || '');
  }, [location.search]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light glass-navbar sticky-top py-3">
      <div className="container">
        {}
        <Link className="navbar-brand fs-3 fw-bolder font-headings d-flex align-items-center gap-2" to="/">
          <img src="/logo.png" alt="Gateway Store Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
          <div>
            <span className="text-blue">Gateway</span>
            <span className="text-orange ms-1">Store</span>
          </div>
        </Link>

        {}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#gatewayNavbarContent"
          aria-controls="gatewayNavbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {}
        <div className="collapse navbar-collapse" id="gatewayNavbarContent">
          
          {}
          <form onSubmit={handleSearchSubmit} className="ms-lg-auto me-lg-4 my-2 my-lg-0" style={{ width: '100%', maxWidth: '380px' }}>
            <div className="input-group position-relative">
              <input
                type="text"
                className="form-control border-0 rounded-pill ps-4 pe-5"
                style={{ 
                  height: '40px', 
                  fontSize: '0.85rem',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                  backgroundColor: '#F1F5F9'
                }}
                placeholder="Search premium products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="btn position-absolute end-0 top-50 translate-middle-y border-0 text-muted p-0 me-3 d-flex align-items-center justify-content-center"
                style={{ zIndex: 5, backgroundColor: 'transparent' }}
              >
                <FiSearch size={16} className="text-blue" />
              </button>
            </div>
          </form>

          {}
          <ul className="navbar-nav mb-2 mb-lg-0 gap-2 gap-lg-3">
            <li className="nav-item">
              <Link className={`nav-link fw-semibold ${location.pathname === '/products' ? 'text-blue' : ''}`} to="/products">
                Products
              </Link>
            </li>

          </ul>

          <hr className="d-lg-none my-3 text-muted" />

          {}
          <div className="d-flex align-items-center gap-3 ms-lg-4">
            {}
            <Link to="/wishlist" className="btn btn-light position-relative p-2 rounded-circle border-0 text-muted" title="Wishlist">
              <FiHeart size={20} />
              {wishlist.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-orange">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {}
            <Link to="/cart" className="btn btn-light position-relative p-2 rounded-circle border-0 text-muted" title="Cart">
              <FiShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-blue">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-light d-flex align-items-center gap-2 p-2 border-0 dropdown-toggle rounded-pill"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FiUser size={18} className="text-blue" />
                  <span className="fw-semibold text-truncate d-none d-md-inline" style={{ maxWidth: '80px' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow rounded-3 p-2 mt-2" style={{ minWidth: '200px' }}>
                  <li className="px-3 py-2 border-bottom mb-2">
                    <p className="fw-bold text-dark mb-0 text-truncate">{user.name}</p>
                    <small className="text-muted text-truncate d-block">{user.email}</small>
                  </li>
                  
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item rounded text-blue d-flex align-items-center gap-2" to="/admin/dashboard">
                        <FiSettings size={16} />
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item rounded d-flex align-items-center gap-2" to="/profile">
                      <FiUser size={16} />
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded d-flex align-items-center gap-2" to="/orders">
                      <FiShoppingCart size={16} />
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button onClick={logout} className="dropdown-item rounded text-danger d-flex align-items-center gap-2">
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-gateway-primary py-2 px-4 rounded-pill">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;