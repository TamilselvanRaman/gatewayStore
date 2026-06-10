import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { SkeletonLoader } from '../components/SkeletonLoader';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const staticCategories = [
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1588449668365-d15e397f6787?q=80&w=400&auto=format&fit=crop',
      idName: 'Computing'
    },
    {
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop',
      link: '/products?search=Fashion'
    },
    {
      name: 'Footwear',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400&auto=format&fit=crop',
      link: '/products?search=Footwear'
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop',
      idName: 'Accessories'
    },
    {
      name: 'Home Decor',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=400&auto=format&fit=crop',
      link: '/products?search=Decor'
    },
    {
      name: 'Beauty',
      image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=400&auto=format&fit=crop',
      link: '/products?search=Beauty'
    }
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=12')
        ]);
        setCategories(categoriesRes.data.data);
        setAllProducts(productsRes.data.data);
      } catch (error) {
        console.error('Error fetching home page data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const getCategoryLink = (cat) => {
    if (cat.link) return cat.link;
    const matched = categories.find(
      (c) => c.name.toLowerCase() === cat.idName.toLowerCase()
    );
    return matched ? `/products?category=${matched._id}` : '/products';
  };

  const filteredProducts = allProducts.filter((prod) => {
    if (activeTab === 'all') return true;
    const catName = prod.category?.name?.toLowerCase() || '';
    if (activeTab === 'workstations') return catName === 'computing';
    if (activeTab === 'peripherals') return catName === 'accessories';
    if (activeTab === 'audio') return catName === 'audio';
    return true;
  });

  const getTabStyle = (tabId) => {
    const isActive = activeTab === tabId;
    return {
      backgroundColor: isActive ? '#1056EC' : '#ffffff',
      color: isActive ? '#ffffff' : '#4F5E7B',
      border: 'none',
      boxShadow: isActive ? '0 4px 14px rgba(16, 86, 236, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
      padding: '8px 24px',
      fontSize: '0.85rem',
      fontWeight: '600',
      borderRadius: '30px',
      transition: 'all 0.25s ease',
      cursor: 'pointer'
    };
  };

  return (
    <div className="animate-fade-in bg-white">
      <section className="container py-5 mt-3">
        <div className="d-flex justify-content-between align-items-baseline mb-4 pb-2">
          <div>
            <h2 className="fw-extrabold font-headings mb-1" style={{ color: '#1E293B', fontSize: '2rem' }}>
              Shop by Categories
            </h2>
            <p className="text-muted fs-6 mb-0">
              Explore our wide range of premium selections
            </p>
          </div>
          <Link 
            to="/products" 
            className="text-blue text-decoration-none fw-bold d-flex align-items-center gap-1 font-headings fs-6"
            style={{ transition: 'transform 0.2s ease' }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateX(4px)' }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateX(0)' }}
          >
            View All <FiChevronRight />
          </Link>
        </div>

        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-6 g-4">
          {staticCategories.map((cat, idx) => (
            <div key={idx} className="col">
              <Link to={getCategoryLink(cat)} className="text-decoration-none text-dark text-center d-block group">
                <div 
                  className="overflow-hidden mb-3 mx-auto shadow-sm" 
                  style={{ 
                    width: '100%', 
                    paddingTop: '100%',
                    position: 'relative', 
                    borderRadius: '24px', 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: '#F8FAFC'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(79, 125, 243, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.02)';
                  }}
                >
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 text-center">
                    <span className="fw-bold font-headings text-muted fs-7 text-uppercase tracking-wider">
                      {cat.name}
                    </span>
                  </div>
                </div>
                <span className="fw-bold font-headings text-dark fs-7 d-block mt-2">
                  {cat.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>
      <section className="py-5 mt-4" style={{ backgroundColor: '#F3F6FC', borderTop: '1px solid rgba(79, 125, 243, 0.05)' }}>
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3">
            <div>
              <h2 className="fw-extrabold font-headings mb-0" style={{ color: '#1E293B', fontSize: '2.25rem' }}>
                Trending Hardware
              </h2>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button 
                style={getTabStyle('all')} 
                onClick={() => setActiveTab('all')}
              >
                All Products
              </button>
              <button 
                style={getTabStyle('workstations')} 
                onClick={() => setActiveTab('workstations')}
              >
                Workstations
              </button>
              <button 
                style={getTabStyle('peripherals')} 
                onClick={() => setActiveTab('peripherals')}
              >
                Peripherals
              </button>
              <button 
                style={getTabStyle('audio')} 
                onClick={() => setActiveTab('audio')}
              >
                Audio
              </button>
            </div>
          </div>
          {loading ? (
            <SkeletonLoader type="grid" count={4} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="fw-bold font-headings text-muted">No products found in this category.</h5>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.slice(0, 8).map((prod) => (
                <div key={prod._id} className="col-12 col-md-6 col-lg-3">
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default Home;