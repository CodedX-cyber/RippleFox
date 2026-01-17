import React from 'react';

const LoadingSplash = () => (
  <div className="loading-overlay" role="status" aria-live="polite">
    <div className="loading-ripple">
      <div className="ripple-ring ripple-ring-one" />
      <div className="ripple-ring ripple-ring-two" />
      <div className="ripple-ring ripple-ring-three" />
      <div className="drop drop-one" />
      <div className="drop drop-two" />
      <div className="drop drop-three" />
      <p className="loading-text">Ripple Fox</p>
      <p className="loading-subtext">Loading...</p>
    </div>
  </div>
);

export default LoadingSplash;
