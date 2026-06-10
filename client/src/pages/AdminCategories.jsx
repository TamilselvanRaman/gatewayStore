import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiFolder } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState(null);
  
  // Status message
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    const fetchInit = async () => {
      setLoading(true);
      await fetchCategories();
      setLoading(false);
    };
    fetchInit();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEditClick = (cat) => {
    setEditCategoryId(cat._id);
    setName(cat.name);
    setFile(null);
    setStatusMsg('');
    setErrorMsg('');
  };

  const handleCancelEdit = () => {
    setEditCategoryId(null);
    setName('');
    setFile(null);
    setStatusMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setErrorMsg('');

    if (!name) {
      setErrorMsg('Please enter category name.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (file) {
      formData.append('image', file);
    }

    try {
      let res;
      if (editCategoryId) {
        // Edit Category
        res = await api.put(`/categories/${editCategoryId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create Category
        res = await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success) {
        setStatusMsg(`Category ${editCategoryId ? 'updated' : 'created'} successfully!`);
        setName('');
        setFile(null);
        setEditCategoryId(null);
        fetchCategories(); // Refresh list
      }
    } catch (err) {
      console.error('Category form submission error', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit category information.');
    }
  };

  const handleDeleteCategory = async (id, catName) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      setStatusMsg('');
      setErrorMsg('');
      try {
        const res = await api.delete(`/categories/${id}`);
        if (res.data.success) {
          setStatusMsg('Category deleted successfully.');
          fetchCategories();
        }
      } catch (err) {
        console.error('Failed to delete category', err);
        setErrorMsg(err.response?.data?.message || 'Error deleting category.');
      }
    }
  };

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="row">
        
        {/* Sidebar */}
        <div className="col-12 col-md-3 col-lg-2 mb-4 mb-md-0">
          <Sidebar />
        </div>

        {/* Content */}
        <div className="col-12 col-md-9 col-lg-10">
          
          <div className="mb-4">
            <h2 className="fw-bold font-headings mb-1 text-dark">Category Administration</h2>
            <p className="text-muted fs-7">Manage organization classifications and icons/images</p>
          </div>

          {statusMsg && (
            <div className="alert alert-success py-2 px-3 rounded-3 fs-7 mb-4 d-flex align-items-center gap-2">
              <FiCheck /> <span>{statusMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="alert alert-danger py-2 px-3 rounded-3 fs-7 mb-4 d-flex align-items-center gap-2">
              <FiX /> <span>{errorMsg}</span>
            </div>
          )}

          <div className="row g-4">
            
            {/* Left: Creator / Editor Form */}
            <div className="col-lg-4">
              <div className="gateway-card p-4 bg-white border-0 shadow-sm">
                <h5 className="fw-bold font-headings mb-4 text-dark border-bottom pb-2 d-flex align-items-center gap-2">
                  <FiFolder className="text-blue" />
                  {editCategoryId ? 'Update Category' : 'Create Category'}
                </h5>

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  {/* Category Name */}
                  <div>
                    <label className="form-label fw-bold text-dark fs-7">Category Name *</label>
                    <input
                      type="text"
                      className="form-control gateway-input bg-light fs-7"
                      placeholder="e.g. Smart Wearables"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Icon/Image File */}
                  <div>
                    <label className="form-label fw-bold text-dark fs-7">Category Banner Image</label>
                    <input
                      type="file"
                      className="form-control gateway-input bg-light fs-7"
                      onChange={handleFileChange}
                      accept="image/*"
                      required={!editCategoryId} // Required only on creation
                    />
                    <small className="text-muted mt-1 d-block fs-8">Select an icon or category image to display.</small>
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-2 mt-2 pt-2 border-top">
                    <button type="submit" className="btn btn-gateway-primary btn-sm rounded-pill px-3 py-2 fs-7 flex-grow-1">
                      {editCategoryId ? 'Save Changes' : 'Create Category'}
                    </button>
                    {editCategoryId && (
                      <button type="button" onClick={handleCancelEdit} className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2 fs-7">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Category Table */}
            <div className="col-lg-8">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-blue" role="status">
                    <span className="visually-hidden">Loading categories...</span>
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-5 bg-white border rounded-4">
                  <p className="text-muted italic mb-0 fs-7">No categories found in system database.</p>
                </div>
              ) : (
                <div className="gateway-card bg-white border-0 shadow-sm p-4">
                  <div className="table-responsive">
                    <table className="table align-middle fs-7">
                      <thead>
                        <tr className="text-muted border-bottom uppercase fs-8">
                          <th>Image Icon</th>
                          <th>Category Name</th>
                          <th>Created At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat) => (
                          <tr key={cat._id} className="border-bottom border-light">
                            <td>
                              <div className="bg-light rounded p-1 d-flex align-items-center justify-content-center text-uppercase text-muted fw-bold fs-8" style={{ width: '40px', height: '40px' }}>
                                {cat.name.substring(0, 2)}
                              </div>
                            </td>
                            <td className="fw-bold text-dark">{cat.name}</td>
                            <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button onClick={() => handleEditClick(cat)} className="btn btn-outline-primary btn-sm border-0 rounded-circle p-2" title="Edit Category">
                                  <FiEdit2 size={14} />
                                </button>
                                <button onClick={() => handleDeleteCategory(cat._id, cat.name)} className="btn btn-outline-danger btn-sm border-0 rounded-circle p-2" title="Delete Category">
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
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

      </div>
    </div>
  );
};

export default AdminCategories;
