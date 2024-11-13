// src/Homepage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate('/gallery'); // Navigate to the gallery page on click
  };

  return (
    <div className="homepage">
      <div className="content">
        <img
          src={`${process.env.PUBLIC_URL}/markyMarkIcon.png`} // Path to the image you want to show
          alt="Click to Enter Gallery"
          onClick={handleImageClick}
          style={{ cursor: 'pointer', width: '100%', maxWidth: '600px', height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default Homepage;
