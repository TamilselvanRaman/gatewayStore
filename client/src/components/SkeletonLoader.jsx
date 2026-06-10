import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="card gateway-card h-100 border-0 shadow-sm" style={{ minHeight: '380px' }}>
      <div 
        className="placeholder-glow w-100" 
        style={{ height: '220px', backgroundColor: '#e2e8f0', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      >
        <span className="placeholder col-12 h-100"></span>
      </div>
      <div className="card-body">
        <h5 className="placeholder-glow card-title">
          <span className="placeholder col-6"></span>
        </h5>
        <p className="placeholder-glow card-text">
          <span className="placeholder col-8"></span>
          <span className="placeholder col-4"></span>
        </p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="placeholder col-4 bg-secondary py-3 rounded"></span>
          <span className="placeholder col-5 bg-primary py-3 rounded"></span>
        </div>
      </div>
    </div>
  );
};

export const SkeletonLoader = ({ type = 'grid', count = 6 }) => {
  if (type === 'grid') {
    return (
      <div className="row g-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="col-12 col-md-6 col-lg-4">
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="placeholder-glow my-3">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="mb-4">
            <span className="placeholder col-4 h3 d-block mb-2"></span>
            <span className="placeholder col-12 d-block mb-1"></span>
            <span className="placeholder col-10 d-block mb-1"></span>
            <span className="placeholder col-8 d-block"></span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};