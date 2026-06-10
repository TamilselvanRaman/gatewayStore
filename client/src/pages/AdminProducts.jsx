import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCheck, FiX } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const [showModal, setShowModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [rating, setRating] = useState('5');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deleteExistingImages, setDeleteExistingImages] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=100');
      setProducts(res.data.data);
    } catch (err) {
      console.error('Error fetching admin products list', err);
    }
  };

  useEffect(() => {
    const fetchInitData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    fetchInitData();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Error loading admin categories list', err);
    }
  };

  const handleOpenAddModal = () => {
    setEditProductId(null);
    setTitle('');
    setDescription('');
    setCategory(categories[0]?._id || '');
    setBrand('');
    setPrice('');
    setDiscountPrice('');
    setStock('');
    setRating('5');
    setSelectedFiles([]);
    setDeleteExistingImages(false);
    setSubmitError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditProductId(prod._id);
    setTitle(prod.title);
    setDescription(prod.description);
    setCategory(prod.category?._id || '');
    setBrand(prod.brand);
    setPrice(prod.price.toString());
    setDiscountPrice(prod.discountPrice?.toString() || '0');
    setStock(prod.stock.toString());
    setRating(prod.rating?.toString() || '5');
    setSelectedFiles([]);
    setDeleteExistingImages(false);
    setSubmitError('');
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessMsg('');

    if (!title || !description || !category || !brand || !price || !stock) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('price', price);
    formData.append('discountPrice', discountPrice || 0);
    formData.append('stock', stock);
    formData.append('rating', rating);

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }

    if (editProductId) {
      formData.append('deleteExistingImages', deleteExistingImages);
    }

    try {
      let res;
      if (editProductId) {

        res = await api.put(`/products/${editProductId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {

        res = await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success) {
        setSuccessMsg(`Product ${editProductId ? 'updated' : 'created'} successfully!`);
        setShowModal(false);
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to submit product form', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit product info.');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const res = await api.delete(`/products/${id}`);
        if (res.data.success) {
          setSuccessMsg('Product deleted successfully.');
          fetchProducts();
        }
      } catch (err) {
        console.error('Error deleting product', err);
        setSuccessMsg(err.response?.data?.message || 'Error deleting product.');
      }
    }
  };

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="row">
        <div className="col-12 col-md-3 col-lg-2 mb-4 mb-md-0">
          <Sidebar />
        </div>
        <div className="col-12 col-md-9 col-lg-10">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold font-headings mb-1 text-dark">Manage Products</h2>
              <p className="text-muted fs-7 mb-0">Create new listings, update stocks, modify prices, and delete entries</p>
            </div>
            <button onClick={handleOpenAddModal} className="btn btn-gateway-primary rounded-pill d-flex align-items-center gap-1 py-2 px-4 fs-7">
              <FiPlus /> Add Product
            </button>
          </div>

          {successMsg && (
            <div className="alert alert-success py-2 px-3 rounded-3 fs-7 mb-4 d-flex align-items-center gap-2">
              <FiCheck /> <span>{successMsg}</span>
            </div>
          )}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-blue" role="status">
                <span className="visually-hidden">Loading products...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 border">
              <p className="text-muted italic mb-0 fs-7">No products registered in system database.</p>
            </div>
          ) : (
            <div className="gateway-card bg-white border-0 shadow-sm p-4">
              <div className="table-responsive">
                <table className="table align-middle fs-7">
                  <thead>
                    <tr className="text-muted border-bottom uppercase fs-8">
                      <th>Item Image</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Brand</th>
                      <th>Base Price</th>
                      <th>Discount</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => {
                      const imagePath = prod.images && prod.images.length > 0 
                        ? (prod.images[0].startsWith('http') ? prod.images[0] : `/uploads/${prod.images[0]}`)
                        : '/uploads/default-product.png';
                      return (
                        <tr key={prod._id} className="border-bottom border-light">
                          <td>
                            <div className="bg-light rounded p-1 d-flex align-items-center justify-content-center text-uppercase text-muted fw-bold fs-8" style={{ width: '45px', height: '45px' }}>
                              {prod.title.substring(0, 2)}
                            </div>
                          </td>
                          <td className="fw-bold text-dark text-truncate" style={{ maxWidth: '180px' }}>{prod.title}</td>
                          <td>{prod.category?.name || 'Unassigned'}</td>
                          <td>{prod.brand}</td>
                          <td className="fw-bold">₹{prod.price.toLocaleString('en-IN')}</td>
                          <td>{prod.discountPrice > 0 ? `₹${prod.discountPrice.toLocaleString('en-IN')}` : '-'}</td>
                          <td>
                            <span className={`badge rounded-pill ${prod.stock <= 5 ? 'bg-danger text-white' : 'bg-success text-white'}`}>
                              {prod.stock}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button onClick={() => handleOpenEditModal(prod)} className="btn btn-outline-primary btn-sm border-0 rounded-circle p-2" title="Edit Product">
                                <FiEdit2 size={14} />
                              </button>
                              <button onClick={() => handleDeleteProduct(prod._id, prod.title)} className="btn btn-outline-danger btn-sm border-0 rounded-circle p-2" title="Delete Product">
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {showModal && (
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}>
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                  <div className="modal-header bg-dark text-white border-0 py-3 px-4">
                    <h5 className="modal-title fw-bold font-headings">{editProductId ? 'Edit Product Parameters' : 'Add New Product Listing'}</h5>
                  </div>

                  <form onSubmit={handleFormSubmit}>
                    <div className="modal-body p-4 bg-light" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                      
                      {submitError && (
                        <div className="alert alert-danger fs-7 py-2 mb-3">
                          {submitError}
                        </div>
                      )}

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-dark fs-7">Product Title *</label>
                          <input type="text" className="form-control gateway-input bg-white fs-7" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-dark fs-7">Brand *</label>
                          <input type="text" className="form-control gateway-input bg-white fs-7" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-dark fs-7">Category *</label>
                          <select className="form-select gateway-input bg-white fs-7" value={category} onChange={(e) => setCategory(e.target.value)} required>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-dark fs-7">Base Price (INR) *</label>
                          <input type="number" className="form-control gateway-input bg-white fs-7" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-bold text-dark fs-7">Discount Price (INR)</label>
                          <input type="number" className="form-control gateway-input bg-white fs-7" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-bold text-dark fs-7">Stock *</label>
                          <input type="number" className="form-control gateway-input bg-white fs-7" value={stock} onChange={(e) => setStock(e.target.value)} required />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-bold text-dark fs-7">Default Rating</label>
                          <input type="number" className="form-control gateway-input bg-white fs-7" min="1" max="5" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} />
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-bold text-dark fs-7">Description *</label>
                          <textarea className="form-control gateway-input bg-white fs-7" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-bold text-dark fs-7">Upload Images</label>
                          <input type="file" className="form-control gateway-input bg-white fs-7" multiple onChange={handleFileChange} accept="image/*" />
                          <small className="text-muted d-block mt-1">Select one or more product images to upload.</small>
                        </div>

                        {editProductId && (
                          <div className="col-12">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" id="deleteImagesCheck" checked={deleteExistingImages} onChange={(e) => setDeleteExistingImages(e.target.checked)} />
                              <label className="form-check-label text-danger fs-7" htmlFor="deleteImagesCheck">
                                Replace and delete all currently active images for this product
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    <div className="modal-footer bg-white border-0 py-3 px-4 d-flex gap-2 justify-content-end">
                      <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline-secondary rounded-pill px-4 fs-7 d-flex align-items-center gap-1">
                        <FiX size={14} /> Cancel
                      </button>
                      <button type="submit" className="btn btn-gateway-primary rounded-pill px-4 fs-7">
                        {editProductId ? 'Save Changes' : 'Create Product'}
                      </button>
                    </div>

                  </form>

                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AdminProducts;