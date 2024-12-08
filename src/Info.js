import React from 'react';
import { Link } from 'react-router-dom';
import './Info.css';
import { useNavigate } from 'react-router-dom';


const Info = () => {
  const navigate = useNavigate();
  return (
    <div className="info-page">
      <div className="topbar">
  <div></div> {/* Add this empty div to create space on the left */}
  <img 
    src={`${process.env.PUBLIC_URL}/markyMarkIcon.png`} 
    alt="Logo" 
    className="topbar-logo" 
    onClick={() => navigate('/gallery')}
    style={{ cursor: 'pointer' }}
  />
  <Link to="/gallery" className="topbar-button gallery-button">
    Works
  </Link>
</div>
      <div className="info-content">
        <h1>HELLO INFO WORLD</h1>
      </div>
    </div>
  );
};

export default Info;
