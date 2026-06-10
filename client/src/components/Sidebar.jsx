import { NavLink } from 'react-router-dom';
import { FiGrid, FiBox, FiFolder, FiShoppingBag, FiUsers, FiPercent, FiArrowLeft } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <div className="admin-sidebar d-flex flex-column h-100 py-4 shadow-sm">
      <div className="px-4 mb-4">
        <h6 className="text-uppercase text-muted fw-bold font-headings fs-7 tracking-wider">Management Control</h6>
      </div>

      <div className="nav flex-column mb-auto">
        <NavLink 
          to="/admin/products" 
          className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
        >
          <FiBox size={18} />
          <span>Products</span>
        </NavLink>

        <NavLink 
          to="/admin/categories" 
          className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
        >
          <FiFolder size={18} />
          <span>Categories</span>
        </NavLink>

        <NavLink 
          to="/admin/orders" 
          className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
        >
          <FiShoppingBag size={18} />
          <span>Orders</span>
        </NavLink>

        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
        >
          <FiUsers size={18} />
          <span>Customers</span>
        </NavLink>
      </div>

      <div className="px-3 mt-4 border-top pt-4">
        <NavLink to="/" className="btn btn-outline-secondary w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 py-2 fs-7 fw-semibold">
          <FiArrowLeft size={16} />
          Storefront
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;