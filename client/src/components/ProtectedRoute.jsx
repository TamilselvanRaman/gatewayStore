import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-blue" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {

    const redirectPath = location.pathname.startsWith('/admin') ? '/admin/login' : '/user/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {

    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;