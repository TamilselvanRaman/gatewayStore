import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';

const Wishlist = () => {
  const { wishlist, loading, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-blue" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleMoveToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart
    await addToCart(product, 1);
    // Remove from wishlist
    await toggleWishlist(product);
  };

  return (
    <div className="container py-5 animate-fade-in">
      <h2 className="fw-bold font-headings mb-4">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-light shadow-sm">
          <FiHeart className="text-muted mb-3" size={56} />
          <h4 className="fw-bold font-headings text-dark">Your Wishlist is Empty</h4>
          <p className="text-muted fs-6 mx-auto mb-4" style={{ maxWidth: '400px' }}>
            You haven't saved any items to your wishlist yet. Browse our products and tap the heart icon on any deal to save it here.
          </p>
          <Link to="/products" className="btn btn-gateway-primary px-4 rounded-pill">
            Explore Store Catalog
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {wishlist.map((product) => {
            const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
            const activePrice = hasDiscount ? product.discountPrice : product.price;

            return (
              <div key={product._id} className="col-12 col-md-6 col-lg-3">
                <div className="card h-100 gateway-card border-0 position-relative">
                  {/* Remove Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="btn btn-light rounded-circle shadow-sm position-absolute top-3 end-3 p-2 border-0 z-3"
                    style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Remove from Wishlist"
                  >
                    <FiTrash2 className="text-danger" size={16} />
                  </button>

                  {/* Image */}
                  <Link to={`/products/${product._id}`} className="text-decoration-none">
                    <div className="d-flex align-items-center justify-content-center p-3 bg-light rounded-top text-center" style={{ height: '180px' }}>
                      <span className="fw-extrabold text-muted fs-7 text-uppercase tracking-wider">
                        {product.title}
                      </span>
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="card-body d-flex flex-column justify-content-between p-3">
                    <div>
                      <span className="text-uppercase text-orange fw-bold fs-8 font-headings mb-1 d-block">{product.brand}</span>
                      <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
                        <h6 className="card-title fw-bold mb-2 text-truncate" style={{ height: '38px', overflow: 'hidden' }}>{product.title}</h6>
                      </Link>
                    </div>

                    <div>
                      {/* Price */}
                      <div className="d-flex align-items-baseline gap-2 mb-3">
                        <span className="fs-5 fw-bold text-blue font-headings">₹{activePrice.toLocaleString('en-IN')}</span>
                        {hasDiscount && (
                          <span className="text-muted text-decoration-line-through fs-7">₹{product.price.toLocaleString('en-IN')}</span>
                        )}
                      </div>

                      {/* Move to Cart */}
                      {product.stock > 0 ? (
                        <button
                          onClick={(e) => handleMoveToCart(e, product)}
                          className="btn btn-gateway-primary btn-sm w-100 py-2 rounded-pill d-flex align-items-center justify-content-center gap-1 fs-7 fw-bold"
                        >
                          <FiShoppingCart size={14} />
                          Move to Cart
                        </button>
                      ) : (
                        <button className="btn btn-secondary btn-sm w-100 py-2 rounded-pill fs-7" disabled>
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
