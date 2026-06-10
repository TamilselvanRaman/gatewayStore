import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiSearch, FiRefreshCw } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { SkeletonLoader } from '../components/SkeletonLoader';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states (controlled inputs)
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');
  
  // Pagination info
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when URL parameters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = {};
        
        const search = searchParams.get('search');
        if (search) queryParams.search = search;
        
        const category = searchParams.get('category');
        if (category) queryParams.category = category;
        
        const minP = searchParams.get('minPrice');
        if (minP) queryParams.minPrice = minP;
        
        const maxP = searchParams.get('maxPrice');
        if (maxP) queryParams.maxPrice = maxP;
        
        const rat = searchParams.get('rating');
        if (rat) queryParams.rating = rat;
        
        const sort = searchParams.get('sort');
        if (sort) queryParams.sort = sort;
        
        const page = searchParams.get('page');
        if (page) queryParams.page = page;

        queryParams.limit = 6; // Set display page limit to 6

        const res = await api.get('/products', { params: queryParams });
        setProducts(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setCurrentPage(res.data.pagination.currentPage);
        setTotalProductsCount(res.data.pagination.totalProducts);
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Sync inputs when searchParams changes (e.g. from navbar clicks)
  useEffect(() => {
    setSearchVal(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setMinRating(searchParams.get('rating') || '');
    setSortOption(searchParams.get('sort') || 'newest');
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  const applyFilters = (updates = {}) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Update or clear params
    const getVal = (key, stateVal) => updates.hasOwnProperty(key) ? updates[key] : stateVal;

    const s = getVal('search', searchVal);
    if (s) newParams.set('search', s); else newParams.delete('search');

    const c = getVal('category', selectedCategory);
    if (c) newParams.set('category', c); else newParams.delete('category');

    const minP = getVal('minPrice', minPrice);
    if (minP) newParams.set('minPrice', minP); else newParams.delete('minPrice');

    const maxP = getVal('maxPrice', maxPrice);
    if (maxP) newParams.set('maxPrice', maxP); else newParams.delete('maxPrice');

    const r = getVal('rating', minRating);
    if (r) newParams.set('rating', r); else newParams.delete('rating');

    const sort = getVal('sort', sortOption);
    if (sort) newParams.set('sort', sort); else newParams.delete('sort');

    // Reset page to 1 on filter application unless page is explicitly updated
    const pageNum = updates.hasOwnProperty('page') ? updates['page'] : 1;
    newParams.set('page', pageNum);

    setSearchParams(newParams);
  };

  const handleClearAll = () => {
    setSearchVal('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSortOption('newest');
    setSearchParams(new URLSearchParams({ page: 1 }));
  };

  const handlePageChange = (pageNum) => {
    applyFilters({ page: pageNum });
  };

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row">
        
        {/* Left Filter Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="gateway-card p-4 bg-white border-0 shadow-sm position-sticky" style={{ top: '100px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold font-headings mb-0 d-flex align-items-center gap-2">
                <FiFilter className="text-blue" />
                Filters
              </h5>
              <button onClick={handleClearAll} className="btn btn-sm btn-link text-orange text-decoration-none fw-semibold p-0">
                Clear All
              </button>
            </div>



            {/* Categories */}
            <div className="mb-4">
              <label className="form-label fw-semibold fs-7 text-muted uppercase">Category</label>
              <select
                className="form-select gateway-input bg-light fs-7"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  applyFilters({ category: e.target.value });
                }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-4">
              <label className="form-label fw-semibold fs-7 text-muted uppercase">Price Range (₹)</label>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  className="form-control gateway-input bg-light fs-7 p-2"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-muted fs-7">to</span>
                <input
                  type="number"
                  className="form-control gateway-input bg-light fs-7 p-2"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button 
                onClick={() => applyFilters()} 
                className="btn btn-gateway-primary w-100 btn-sm rounded-pill mt-3 fs-7 py-2"
              >
                Apply Range
              </button>
            </div>



          </div>
        </div>

        {/* Right Catalog Grid */}
        <div className="col-lg-9">
          {/* Top Info and Sorting Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
            <div>
              <h4 className="fw-bold font-headings mb-1">E-Commerce Shop</h4>
              <p className="text-muted mb-0 fs-7">Showing <strong>{products.length}</strong> of <strong>{totalProductsCount}</strong> products</p>
            </div>


          </div>

          {/* Grid Products content */}
          {loading ? (
            <SkeletonLoader type="grid" count={6} />
          ) : products.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-light">
              <FiRefreshCw className="text-muted mb-3 animate-spin" size={48} />
              <h5 className="fw-bold font-headings">No Products Found</h5>
              <p className="text-muted fs-7">Try resetting your filter parameters or search queries.</p>
              <button onClick={handleClearAll} className="btn btn-gateway-primary rounded-pill px-4 btn-sm mt-2">
                Reset Storefront
              </button>
            </div>
          ) : (
            <>
              <div className="row g-4 mb-5">
                {products.map((prod) => (
                  <div key={prod._id} className="col-12 col-md-6 col-lg-4">
                    <ProductCard product={prod} />
                  </div>
                ))}
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-5">
                  <ul className="pagination gap-2 border-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        className="page-link rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm bg-white text-dark"
                        style={{ width: '40px', height: '40px' }}
                      >
                        &laquo;
                      </button>
                    </li>
                    
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <li key={idx + 1} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                        <button 
                          onClick={() => handlePageChange(idx + 1)} 
                          className={`page-link rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm ${currentPage === idx + 1 ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                          style={{ width: '40px', height: '40px' }}
                        >
                          {idx + 1}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        className="page-link rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm bg-white text-dark"
                        style={{ width: '40px', height: '40px' }}
                      >
                        &raquo;
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default Products;
