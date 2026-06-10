import { useContext, useState } from 'react';
import { FiUser, FiMapPin, FiLock, FiPlusCircle, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, saveAddress, deleteAddress } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSuccessMsg, setPwdSuccessMsg] = useState('');
  const [pwdErrorMsg, setPwdErrorMsg] = useState('');

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [addrSuccessMsg, setAddrSuccessMsg] = useState('');
  const [addrErrorMsg, setAddrErrorMsg] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    if (!name || !phone) {
      setProfileErrorMsg('Please fill in Name and Phone.');
      return;
    }

    const res = await updateProfile({ name, phone });
    if (res.success) {
      setProfileSuccessMsg('Profile details updated successfully.');
    } else {
      setProfileErrorMsg(res.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdSuccessMsg('');
    setPwdErrorMsg('');

    if (!newPassword || !confirmPassword) {
      setPwdErrorMsg('Please fill in password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPwdErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdErrorMsg('Passwords do not match.');
      return;
    }

    const res = await updateProfile({ password: newPassword });
    if (res.success) {
      setPwdSuccessMsg('Password updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPwdErrorMsg(res.message);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddrSuccessMsg('');
    setAddrErrorMsg('');

    if (!street || !city || !stateVal || !zipCode) {
      setAddrErrorMsg('Please fill in all address fields.');
      return;
    }

    const res = await saveAddress({ street, city, state: stateVal, zipCode });
    if (res.success) {
      setAddrSuccessMsg('Address added successfully.');

      setStreet('');
      setCity('');
      setStateVal('');
      setZipCode('');
      setShowAddressForm(false);
    } else {
      setAddrErrorMsg(res.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Delete this address?')) {
      const res = await deleteAddress(addressId);
      if (res.success) {
        setAddrSuccessMsg('Address deleted successfully.');
      } else {
        setAddrErrorMsg(res.message);
      }
    }
  };

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row g-4">
        
        {}
        <div className="col-lg-4">
          <div className="gateway-card p-4 bg-white border-0 shadow-sm text-center mb-4">
            <div className="bg-light p-4 rounded-circle d-inline-block text-blue mb-3" style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiUser size={48} />
            </div>
            <h4 className="fw-bold font-headings mb-1 text-dark">{user?.name}</h4>
            <p className="text-muted fs-7 mb-3">{user?.email}</p>
            <span className="badge badge-blue px-3 py-2 rounded-pill fs-8 fw-semibold text-capitalize">{user?.role} Account</span>
          </div>

          {}
          <div className="gateway-card p-4 bg-white border-0 shadow-sm">
            <h5 className="fw-bold font-headings mb-3 text-dark">Profile Shortcuts</h5>
            <div className="d-flex flex-column gap-2 fs-7">
              <a href="/orders" className="text-blue text-decoration-none py-1 border-bottom d-block">Track My Order History</a>
              <a href="/wishlist" className="text-orange text-decoration-none py-1 border-bottom d-block">Manage My Wishlist</a>
              <a href="/cart" className="text-blue text-decoration-none py-1 d-block font-weight-bold">View My Cart</a>
            </div>
          </div>
        </div>

        {}
        <div className="col-lg-8">
          
          {}
          <div className="gateway-card p-4 bg-white border-0 shadow-sm mb-4">
            <h4 className="fw-bold font-headings mb-4 text-dark d-flex align-items-center gap-2">
              <FiUser className="text-blue" />
              Personal Information
            </h4>

            {profileSuccessMsg && (
              <div className="alert alert-success py-2 px-3 rounded-3 fs-7 mb-4 d-flex align-items-center gap-2">
                <FiCheckCircle /> <span>{profileSuccessMsg}</span>
              </div>
            )}
            {profileErrorMsg && <div className="alert alert-danger py-2 px-3 rounded-3 fs-7 mb-4">{profileErrorMsg}</div>}

            <form onSubmit={handleUpdateProfile} className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark fs-7">Full Name</label>
                <input type="text" className="form-control gateway-input bg-light fs-7" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark fs-7">Phone Number</label>
                <input type="text" className="form-control gateway-input bg-light fs-7" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-gateway-primary rounded-pill px-4 fs-7 py-2 mt-2">
                  Update Profile Details
                </button>
              </div>
            </form>
          </div>

          {}
          <div className="gateway-card p-4 bg-white border-0 shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold font-headings mb-0 text-dark d-flex align-items-center gap-2">
                <FiMapPin className="text-blue" />
                Shipping Addresses
              </h4>
              <button onClick={() => setShowAddressForm(!showAddressForm)} className="btn btn-sm btn-link text-blue text-decoration-none fw-bold p-0 d-flex align-items-center gap-1">
                <FiPlusCircle /> Add Address
              </button>
            </div>

            {addrSuccessMsg && (
              <div className="alert alert-success py-2 px-3 rounded-3 fs-7 mb-3 d-flex align-items-center gap-2">
                <FiCheckCircle /> <span>{addrSuccessMsg}</span>
              </div>
            )}
            {addrErrorMsg && <div className="alert alert-danger py-2 px-3 rounded-3 fs-7 mb-3">{addrErrorMsg}</div>}

            {}
            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="row g-3 bg-light p-3 rounded-3 mb-4 animate-fade-in">
                <div className="col-12">
                  <label className="form-label fw-bold text-dark fs-7">Street Name / Building</label>
                  <input type="text" className="form-control gateway-input bg-white fs-7" value={street} onChange={(e) => setStreet(e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark fs-7">City</label>
                  <input type="text" className="form-control gateway-input bg-white fs-7" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold text-dark fs-7">State</label>
                  <input type="text" className="form-control gateway-input bg-white fs-7" value={stateVal} onChange={(e) => setStateVal(e.target.value)} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold text-dark fs-7">Zip Code</label>
                  <input type="text" className="form-control gateway-input bg-white fs-7" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                </div>
                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-gateway-primary btn-sm rounded-pill px-3 py-2 fs-7">Save Address</button>
                  <button type="button" onClick={() => setShowAddressForm(false)} className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2 fs-7">Cancel</button>
                </div>
              </form>
            )}

            {}
            {user?.address && user.address.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {user.address.map((addr) => (
                  <div key={addr._id} className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <div className="fs-7">
                      <p className="mb-0 fw-semibold text-dark">{addr.street}</p>
                      <span className="text-muted">{addr.city}, {addr.state} - {addr.zipCode}</span>
                    </div>
                    <button onClick={() => handleDeleteAddress(addr._id)} className="btn btn-outline-danger btn-sm border-0 rounded-circle p-2" title="Delete Address">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0 fs-7 italic">No shipping addresses saved yet. Use the add address button above.</p>
            )}
          </div>

          {}
          <div className="gateway-card p-4 bg-white border-0 shadow-sm">
            <h4 className="fw-bold font-headings mb-4 text-dark d-flex align-items-center gap-2">
              <FiLock className="text-blue" />
              Change Password
            </h4>

            {pwdSuccessMsg && (
              <div className="alert alert-success py-2 px-3 rounded-3 fs-7 mb-4 d-flex align-items-center gap-2">
                <FiCheckCircle /> <span>{pwdSuccessMsg}</span>
              </div>
            )}
            {pwdErrorMsg && <div className="alert alert-danger py-2 px-3 rounded-3 fs-7 mb-4">{pwdErrorMsg}</div>}

            <form onSubmit={handleChangePassword} className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark fs-7">New Password (6+ characters)</label>
                <input type="password" className="form-control gateway-input bg-light fs-7" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark fs-7">Confirm New Password</label>
                <input type="password" className="form-control gateway-input bg-light fs-7" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-gateway-secondary rounded-pill px-4 fs-7 py-2 mt-2">
                  Update Security Password
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;