import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <div className="container text-center text-md-start">
        <div className="row text-center text-md-start">
          <div className="col-md-6 mt-3 text-center text-md-start">
            <Link className="text-decoration-none fs-3 fw-bolder font-headings d-flex align-items-center mb-3 justify-content-center justify-content-md-start gap-2" to="/">
              <img src="/logo.png" alt="Gateway Store Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
              <div>
                <span className="text-blue">Gateway</span>
                <span className="text-orange ms-1">Store</span>
              </div>
            </Link>
            <p className="text-white-50" style={{ fontSize: '14px', lineHeight: '24px' }}>
              Your ultimate destination for premium quality tech gadgets, smart devices, and accessories. Empowering your digital workspace.
            </p>
            <div className="d-flex gap-3 mt-4 justify-content-center justify-content-md-start">
              <a href="#" className="text-white-50 hover-text-blue" style={{ transition: 'color 0.3s' }}><FiFacebook size={20} /></a>
              <a href="#" className="text-white-50 hover-text-blue" style={{ transition: 'color 0.3s' }}><FiTwitter size={20} /></a>
              <a href="#" className="text-white-50 hover-text-blue" style={{ transition: 'color 0.3s' }}><FiInstagram size={20} /></a>
              <a href="#" className="text-white-50 hover-text-blue" style={{ transition: 'color 0.3s' }}><FiLinkedin size={20} /></a>
            </div>
          </div>
          <div className="col-md-6 mt-3 text-center text-md-start d-flex flex-column align-items-center align-items-md-end justify-content-center">
            <div style={{ maxWidth: '300px' }}>
              <h5 className="text-uppercase mb-4 font-headings fw-bold text-orange text-center text-md-start">Get In Touch</h5>
              <p className="text-white-50 fs-7 d-flex align-items-start gap-2 text-start">
                <FiMapPin className="text-blue mt-1 flex-shrink-0" size={18} /> 
                <span>6, Sree Kumaran Layout, Ramanathapuram, Coimbatore, TN - 641045</span>
              </p>
              <p className="text-white-50 fs-7 d-flex align-items-center gap-2 text-start">
                <FiPhone className="text-blue flex-shrink-0" size={16} /> 
                <span>+91 98425 21101</span>
              </p>
              <p className="text-white-50 fs-7 d-flex align-items-center gap-2 text-truncate text-start">
                <FiMail className="text-blue flex-shrink-0" size={16} /> 
                <span>info@gatewaysoftware.in</span>
              </p>
            </div>
          </div>
        </div>
        <hr className="mt-4 text-white-50" style={{ opacity: 0.2 }} />
      </div>
    </footer>
  );
};

export default Footer;