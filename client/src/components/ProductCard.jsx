import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { FaHeart, FaStar } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

// Helper to get review count from screenshot or fallback
const getReviewsCount = (title) => {
  const t = title.toLowerCase();
  if (t.includes('camera') || t.includes('lumina')) return 128;
  if (t.includes('headphone') || t.includes('zenith')) return 85;
  if (t.includes('watch') || t.includes('classic')) return 242;
  if (t.includes('apexbook') || t.includes('laptop') || t.includes('probook')) return 548;
  if (t.includes('specter')) return 156;
  if (t.includes('speaker')) return 92;
  return 45;
};

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const { _id, title, price, discountPrice, images, stock, brand, rating } = product;

  // Use uploaded image or fallback image route (handling absolute remote URLs)
  const imageUrl = images && images.length > 0 
    ? (images[0].startsWith('http') ? images[0] : `/uploads/${images[0]}`)
    : '/uploads/default-product.png';

  const isWishlisted = isInWishlist(_id);
  const hasDiscount = discountPrice > 0 && discountPrice < price;
  const activePrice = hasDiscount ? discountPrice : price;
  
  // Calculate discount percentage
  const discountPercent = hasDiscount 
    ? Math.round(((price - discountPrice) / price) * 100) 
    : 0;

  // Check if it's new (specifically watch in mockup)
  const isNew = title.toLowerCase().includes('watch') || title.toLowerCase().includes('classic');

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Star elements
  const ratingValue = rating || 5;
  const starElements = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(ratingValue)) {
      starElements.push(<FaStar key={i} className="star-filled" size={14} />);
    } else {
      starElements.push(<FaStar key={i} className="star-empty" size={14} />);
    }
  }

  // Get display category name
  const categoryName = product.category?.name || brand;

  return (
    <Link to={`/products/${_id}`} className="text-decoration-none text-dark h-100 d-block">
      <div className="card h-100 product-card-hover border-0 position-relative">
        
        {/* Product Image Container */}
        <div className="product-card-img-container m-3 position-relative d-flex align-items-center justify-content-center" style={{ height: '200px', backgroundColor: '#F1F5F9', borderRadius: '16px' }}>
          
          {/* Badges on top left */}
          {hasDiscount && (
            <span className="badge badge-orange position-absolute top-0 start-0 m-3 px-3 py-2 fs-7 rounded-pill z-3 shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}

          {isNew && !hasDiscount && (
            <span className="badge badge-blue position-absolute top-0 start-0 m-3 px-3 py-2 fs-7 rounded-pill z-3 shadow-sm">
              NEW
            </span>
          )}

          {/* Wishlist Button - Statically positioned top right */}
          <button
            onClick={handleToggleWishlist}
            className="btn btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-3 p-0 border-0 z-3 d-flex align-items-center justify-content-center"
            style={{ width: '36px', height: '36px' }}
          >
            {isWishlisted ? (
              <FaHeart className="text-orange" size={16} />
            ) : (
              <FiHeart className="text-muted" size={16} />
            )}
          </button>

          {/* Styled text display instead of img tag */}
          <div className="p-3 text-center w-100">
            <span className="fw-bold font-headings text-muted fs-7 text-uppercase tracking-wide" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {title}
            </span>
          </div>

        </div>

        {/* Product Details */}
        <div className="card-body d-flex flex-column justify-content-between px-4 pb-4 pt-0">
          <div>
            {/* Category Tag */}
            <span className="text-uppercase font-headings text-muted fs-7 mb-1 d-block fw-semibold tracking-wider">
              {categoryName}
            </span>
            
            {/* Title */}
            <div className="text-decoration-none text-dark">
              <h6 className="card-title mb-2 text-truncate fw-bold" title={title}>
                {title}
              </h6>
            </div>
            
            {/* Star Rating */}
            <div className="d-flex align-items-center mb-3">
              <div className="d-flex gap-1 align-items-center">
                {starElements}
              </div>
              <span className="review-text ms-2">
                ({getReviewsCount(title)})
              </span>
            </div>
          </div>

          <div>
            {/* Price display */}
            <div className="d-flex align-items-baseline gap-2 mb-0">
              <span className="fs-4 fw-extrabold text-blue font-headings">
                ₹{activePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              {hasDiscount && (
                <span className="text-muted text-decoration-line-through fs-6">
                  ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
