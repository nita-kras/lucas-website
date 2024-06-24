// src/Homepage.js
import React from 'react';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="topbar">
        <button className="topbar-button">Home</button>
        <button className="topbar-button">Info</button>
      </div>
      <div className="content">
        <h1>HELLO WORLD</h1>
      </div>
    </div>
  );
};

export default Homepage;
