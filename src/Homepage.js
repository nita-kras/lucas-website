// src/Homepage.js and src/Info.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="topbar">
        <Link to="/" className="topbar-button">Home</Link>
        <Link to="/info" className="topbar-button">Info</Link>
      </div>
      <div className="content">
        <h1>HELLO WORLD</h1>
      </div>
    </div>
  );
};

export default Homepage;