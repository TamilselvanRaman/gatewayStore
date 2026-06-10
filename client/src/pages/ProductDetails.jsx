import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { FaHeart, FaStar } from 'react-icons/fa';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
        setRelated(res.data.related || []);
        if (res.data.data.images && res.data.data.images.length > 0) {
          setActiveImage(res.data.data.images[0]);
        }
      } catch (err) {
        console.error('Error fetching product details', err);
        setErrorMsg('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
    setQuantity(1);
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-blue" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (errorMsg || !product) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block p-4 rounded-4" role="alert">
          <h5 className="alert-heading fw-bold font-headings">Product Not Found</h5>
          <p className="mb-0">{errorMsg || 'The requested product could not be located.'}</p>
          <Link to="/products" className="btn btn-outline-danger mt-3 rounded-pill btn-sm">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const { title, description, price, discountPrice, images, stock, brand, rating, category } = product;

  const isWishlisted = isInWishlist(product._id);
  const hasDiscount = discountPrice > 0 && discountPrice < price;
  const activePrice = hasDiscount ? discountPrice : price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const handleQtyChange = (val) => {
    if (val >= 1 && val <= stock) {
      setQuantity(val);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    navigate('/cart');
  };

  const getStockStatus = () => {
    if (stock === 0) return { label: 'Out of Stock', class: 'bg-danger text-white' };
    if (stock <= 5) return { label: `Low Stock (Only ${stock} left)`, class: 'bg-warning text-dark' };
    return { label: `In Stock (${stock} available)`, class: 'bg-success text-white' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="container py-5 animate-fade-in">
      {}
      <Link to="/products" className="btn btn-link text-muted text-decoration-none fw-semibold d-inline-flex align-items-center gap-2 mb-4">
        <FiArrowLeft /> Back to Catalog
      </Link>

      <div className="row g-5 mb-5">
        {}
        <div className="col-lg-6">
          <div className="gateway-card p-3 bg-white border-0 shadow-sm d-flex flex-column gap-3 h-100 justify-content-center">
            {}
            <div className="d-flex align-items-center justify-content-center bg-light rounded-3 p-5" style={{ minHeight: '400px' }}>
              <span className="fw-bold font-headings text-muted fs-4 text-uppercase text-center px-4 leading-relaxed">
                {title}
              </span>
            </div>
          </div>
        </div>

        {}
        <div className="col-lg-6">
          <div className="gateway-card p-4 p-md-5 bg-white border-0 shadow-sm rounded-4 h-100">
            <div className="d-flex flex-column h-100 justify-content-between">
              <div>
                {}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-uppercase text-orange fw-bold font-headings fs-6">{brand}</span>
                  <span className="badge bg-light text-muted border px-3 py-2 rounded-pill fs-7">{category?.name}</span>
                </div>

                {}
                <h1 className="fw-bold font-headings mb-3 fs-2">{title}</h1>

                {}
                <div className="d-flex align-items-center mb-4">
                  <div className="text-warning d-flex align-items-center gap-1">
                    <FaStar size={18} />
                    <span className="text-dark fw-bold fs-5 ms-1">{rating ? rating.toFixed(1) : '5.0'}</span>
                  </div>
                  <span className="text-muted ms-3 fs-7">| Verified Customer Reviews</span>
                </div>

                {}
                <div className="mb-4">
                  <span className={`badge px-3 py-2 rounded-pill fw-semibold fs-7 ${stockStatus.class}`}>
                    {stockStatus.label}
                  </span>
                </div>

                <hr className="my-4 text-muted" />

                {}
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <h2 className="fw-bold text-blue font-headings fs-1 mb-0">₹{activePrice.toLocaleString('en-IN')}</h2>
                    {hasDiscount && (
                      <>
                        <h4 className="text-muted text-decoration-line-through font-headings mb-0">₹{price.toLocaleString('en-IN')}</h4>
                        <span className="badge badge-orange px-3 py-2 rounded-pill fs-7 fw-bold">-{discountPercent}% OFF</span>
                      </>
                    )}
                  </div>
                </div>

                {}
                <div className="mb-4">
                  <h5 className="fw-bold font-headings mb-2">Product Overview</h5>
                  <p className="text-muted fs-6 leading-relaxed mb-0">{description}</p>
                </div>

                {}
                <div className="mb-4">
                  <h5 className="fw-bold font-headings mb-2">Specifications</h5>
                  <div className="gateway-card bg-light p-3 border-0 rounded-3">
                    <div className="row g-2 fs-7">
                       <div className="col-4 text-muted">Warranty</div>
                       <div className="col-8 fw-semibold text-dark">12 Months Tech Warranty</div>
                       <div className="col-4 text-muted">Brand Sourcing</div>
                       <div className="col-8 fw-semibold text-dark">100% Genuine Certified</div>
                       <div className="col-4 text-muted">Warehouse Loc</div>
                       <div className="col-8 fw-semibold text-dark">Coimbatore Hub, IN</div>
                    </div>
                  </div>
                </div>

                {stock > 0 && (
                  
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <span className="fw-bold text-dark fs-6">Quantity:</span>
                    <div className="input-group" style={{ width: '130px' }}>
                      <button onClick={() => handleQtyChange(quantity - 1)} className="btn btn-outline-secondary border-end-0 py-2" type="button">-</button>
                      <input type="text" className="form-control text-center py-2 border-start-0 border-end-0 bg-white" value={quantity} readOnly />
                      <button onClick={() => handleQtyChange(quantity + 1)} className="btn btn-outline-secondary border-start-0 py-2" type="button">+</button>
                    </div>
                  </div>
                )}
              </div>

              {}
              <div className="d-flex flex-column flex-sm-row gap-3 pt-3">
                {stock > 0 ? (
                  <>
                    <button 
                      onClick={handleAddToCart}
                      className="btn btn-gateway-primary py-3 px-4 rounded-pill fs-6 fw-bold flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                    >
                      <FiShoppingCart size={20} />
                      Add to Cart
                    </button>
                    <button 
                      onClick={handleBuyNow}
                      className="btn btn-gateway-secondary py-3 px-4 rounded-pill fs-6 fw-bold flex-grow-1"
                    >
                      Buy It Now
                    </button>
                  </>
                ) : (
                  <button className="btn btn-secondary w-100 py-3 rounded-pill" disabled>
                    Out Of Stock
                  </button>
                )}

                {}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="btn btn-outline-secondary rounded-pill p-3 border-2 d-flex align-items-center justify-content-center"
                  style={{ width: '56px', height: '56px' }}
                  title="Add to Wishlist"
                >
                  {isWishlisted ? (
                    <FaHeart className="text-orange" size={24} />
                  ) : (
                    <FiHeart className="text-muted" size={24} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      {related.length > 0 && (
        <div className="mt-5 pt-5 border-top border-light">
          <h3 className="fw-bold font-headings mb-4">You May Also Like</h3>
          <div className="row g-4">
            {related.map((prod) => (
              <div key={prod._id} className="col-12 col-md-6 col-lg-3">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;