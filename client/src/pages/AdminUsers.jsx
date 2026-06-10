import { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiUserX, FiCheck } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to load user accounts list', err);
    }
  };

  useEffect(() => {
    const fetchInit = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };
    fetchInit();
  }, []);

  const handleToggleBlock = async (userId, blockState, userName) => {
    const action = blockState ? 'unblock' : 'block';
    if (window.confirm(`Are you sure you want to ${action} user "${userName}"?`)) {
      try {
        setSuccessMsg('');
        const res = await api.put(`/auth/users/${userId}/block`);
        if (res.data.success) {
          setSuccessMsg(`User "${userName}" has been ${blockState ? 'unblocked' : 'blocked'} successfully.`);
          

          setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
        }
      } catch (err) {
        console.error('Failed to toggle block status', err);
        setSuccessMsg(err.response?.data?.message || `Failed to ${action} user.`);
      }
    }
  };

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="row">
        
        {}
        <div className="col-12 col-md-3 col-lg-2 mb-4 mb-md-0">
          <Sidebar />
        </div>

        {}
        <div className="col-12 col-md-9 col-lg-10">
          
          <div className="mb-4">
            <h2 className="fw-bold font-headings mb-1 text-dark">Client Management</h2>
            <p className="text-muted fs-7">Audit user registrations, monitor profile details, and block/unblock customer logins</p>
          </div>

          {successMsg && (
            <div className="alert alert-info py-2 px-3 rounded-3 fs-7 mb-4 d-flex align-items-center gap-2">
              <FiCheck /> <span>{successMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-blue" role="status">
                <span className="visually-hidden">Loading users...</span>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-5 bg-white border rounded-4">
              <p className="text-muted italic mb-0 fs-7">No users registered in system.</p>
            </div>
          ) : (
            <div className="gateway-card bg-white border-0 shadow-sm p-4">
              <div className="table-responsive">
                <table className="table align-middle fs-7">
                  <thead>
                    <tr className="text-muted border-bottom uppercase fs-8">
                      <th>Name</th>
                      <th>Email Address</th>
                      <th>Phone Number</th>
                      <th>System Role</th>
                      <th>Registered Date</th>
                      <th>Account Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item) => (
                      <tr key={item._id} className="border-bottom border-light">
                        <td className="fw-bold text-dark">{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>
                          <span className={`badge px-2 py-1 rounded-pill fs-8 fw-semibold ${item.role === 'admin' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                            {item.role}
                          </span>
                        </td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td>
                          {item.isBlocked ? (
                            <span className="badge bg-danger text-white rounded-pill px-2 py-1">Blocked</span>
                          ) : (
                            <span className="badge bg-success text-white rounded-pill px-2 py-1">Active</span>
                          )}
                        </td>
                        <td>
                          {item.role === 'admin' ? (
                            <span className="text-muted fs-8">Admin Protect</span>
                          ) : (
                            <button
                              onClick={() => handleToggleBlock(item._id, item.isBlocked, item.name)}
                              className={`btn btn-sm d-flex align-items-center gap-1 py-1 px-3 rounded-pill fw-semibold ${
                                item.isBlocked ? 'btn-outline-success' : 'btn-outline-danger'
                              }`}
                              style={{ fontSize: '11px' }}
                            >
                              {item.isBlocked ? (
                                <>
                                  <FiUserCheck /> Unblock
                                </>
                              ) : (
                                <>
                                  <FiUserX /> Block Account
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AdminUsers;