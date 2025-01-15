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
          src={`${process.env.PUBLIC_URL}/NameLogo.jpg`} 
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
        <div className="info-text">
          {/* Education Section */}
          <p><strong>EDUCATION:</strong></p>
          <p>BA (HONS), GOLDSMITHS UNIVERSITY, TO GRADUATE IN 2026</p>
          <p>DISTINCTION, FOUNDATION DIPLOMA, KINGSTON UNIVERSITY</p>

          {/* Space between Education and Past Employment */}
          <div className="space-between"></div>

          {/* Past Employment Section */}
          <p><strong>PAST EMPLOYMENT:</strong></p>
          <ul className="employment-list">
          <li><a href="https://paulinapiipponen.com" target="_blank" rel="noopener noreferrer">Paulina Piipponen</a></li>
          <li><a href="https://www.phoebeshakespeare.com" target="_blank" rel="noopener noreferrer">Phoebe Shakespeare</a></li>
          <li><a href="https://www.lisajahovic.com" target="_blank" rel="noopener noreferrer">Lisa Jahovic</a></li>
            <li><a href="https://www.thesetstylist.com" target="_blank" rel="noopener noreferrer">Lee Flude</a></li>
            <li><a href="https://www.timur-celikdag.com/#all" target="_blank" rel="noopener noreferrer">Timur Celikdag</a></li>
            <li><a href="https://samuelpidgen.com" target="_blank" rel="noopener noreferrer">Samuel Pidgeon</a></li>
            <li><a href="https://www.elena-isolini.com" target="_blank" rel="noopener noreferrer">Elena Isolini</a></li>
            <li><a href="http://renway.net" target="_blank" rel="noopener noreferrer">Carbon Way</a></li>
            <li><a href="https://www.archbronze.com" target="_blank" rel="noopener noreferrer">Arch Bronze</a></li>
            <li><a href="https://www.pep-ltd.co.uk" target="_blank" rel="noopener noreferrer">PEP</a></li>
            <li><a href="http://www.taoh.es" target="_blank" rel="noopener noreferrer">Taoh Motorecambios</a></li>
            <li><a href="https://www.speters.co.uk/sourcing-production" target="_blank" rel="noopener noreferrer">Stuart Peters</a></li>
            <li><a href="https://www.paulsmith.com/uk/discover" target="_blank" rel="noopener noreferrer">Paul Smith</a></li>
            <li><a href="https://thefootsoldiers.com" target="_blank" rel="noopener noreferrer">The Foot Soldiers</a></li>
          </ul>

          {/* Email Section */}
          <p><strong>EMAIL:</strong></p>
          <p>
            <a href="mailto:kastaberna@gmail.com" className="email-link">kastaberna@gmail.com</a>
          </p>

          {/* Additional Text */}
          <p 
  className="credits"
  style={{ fontSize: '14px', marginTop: '30px' }}
>
  <a href="mailto:nk.nitakrasniqi@gmail.com" style={{ color: '#e872c5', textDecoration: 'none' }}>
    Website made by Nita Krasniqi
  </a>
</p>


        </div>
      </div>
    </div>
  );
};



export default Info;
