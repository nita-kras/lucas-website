import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './FolderView.css';

const FolderView = () => {
  const { folderName } = useParams();
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLargeImageView, setIsLargeImageView] = useState(false); // New state to toggle between views

  const navigate = useNavigate(); // Initialize useNavigate

  const formattedFolderName = folderName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/works/worksLarge/${folderName}/images.json`);
        if (!response.ok) return;
        const imagesData = await response.json();
        const formattedImages = imagesData.map((img) => ({
          id: img.id,
          image: `${process.env.PUBLIC_URL}/works/worksLarge/${folderName}/${img[folderName]}`,
          thumbnail: `${process.env.PUBLIC_URL}/works/worksThumbnails/${folderName}/${img[folderName]}`,
          description: img.description || "No description available",
        }));
        setImages(formattedImages);
        setCurrentIndex(0);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, [folderName]);

  const handleNextImage = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  const handlePreviousImage = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  const handleThumbnailClick = (index) => setCurrentIndex(index);

  const handleImageClick = () => {
    setIsLargeImageView((prev) => !prev); // Toggle between views on large image click
  };

  const folderNames = ['acceleration_2023', 'ball_and_socket_2023', '100_2023', 'crash_landed_2024'];

  const handleNextWork = () => {
    const currentFolderIndex = folderNames.indexOf(folderName);
    if (currentFolderIndex < folderNames.length - 1) {
      navigate(`/folder/${folderNames[currentFolderIndex + 1]}`);
    }
  };

  const handlePrevWork = () => {
    const currentFolderIndex = folderNames.indexOf(folderName);
    if (currentFolderIndex > 0) {
      navigate(`/folder/${folderNames[currentFolderIndex - 1]}`);
    }
  };

  return (
    <div className="folder-view-page">
      {/* Conditionally render the top bar */}
      {!isLargeImageView && (
        <div className="topbar">
          <img src={`${process.env.PUBLIC_URL}/markyMarkIcon.png`} alt="Logo" className="topbar-logo" />
          <div className="button-group">
            <Link to="/gallery" className="topbar-button">Works</Link>
            <Link to="/info" className="topbar-button">Info</Link>
          </div>
        </div>
      )}

      <div className="folder-view">
        {isLargeImageView ? (
          // Large Image View: Hide left section and show all images vertically
          <div className="center-section full-width">
            <div className="large-image-container">
              {images.map((img) => (
                <img
                  key={img.id}
                  src={img.image}
                  alt={`Large view of ${img.id}`}
                  className="large-image"
                  onClick={handleImageClick}
                />
              ))}
            </div>
          </div>
        ) : (
          // Carousel View: Show left section and carousel
          <>
            <div className="left-section">
              <div className="folder-list">
                <ul>
                  {folderNames.map((folder) => (
                    <li key={folder}>
                      <Link to={`/folder/${folder}`} className="folder-link">
                        {folder.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next/Previous buttons */}
              <div className="folder-navigation-buttons">
                <button 
                  className="folder-nav-button prev-work" 
                  onClick={handlePrevWork}
                  disabled={folderNames.indexOf(folderName) === 0} // Disable if on the first work
                >
                  Prev Work
                </button>
                <button 
                  className="folder-nav-button next-work" 
                  onClick={handleNextWork}
                  disabled={folderNames.indexOf(folderName) === folderNames.length - 1} // Disable if on the last work
                >
                  Next Work
                </button>
              </div>
            </div>

            <div className="center-section">
              <div className="carousel-container">
                {images.length === 0 ? (
                  <div>Loading images...</div>
                ) : (
                  <div className="carousel-content">
                    <div className="carousel-image-wrapper">
                      {/* Add left and right arrow divs */}
                      <div
                        className="arrow arrow-left"
                        onClick={handlePreviousImage} // Click to go to previous image
                      />
                      <img
                        src={images[currentIndex]?.image}
                        alt="Selected"
                        className="carousel-image"
                        onClick={handleImageClick} // Toggle on image click
                      />
                      <div
                        className="arrow arrow-right"
                        onClick={handleNextImage} // Click to go to next image
                      />
                    </div>
                    <div className="thumbnails-container">
                      {images.map((img, index) => (
                        <img
                          key={img.id}
                          src={img.thumbnail}
                          alt={`Thumbnail ${index}`}
                          onClick={() => handleThumbnailClick(index)}
                          className={`thumbnail ${index === currentIndex ? 'selected' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="image-description">
                <h2>{formattedFolderName}</h2>
                <p>{images[currentIndex]?.description}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FolderView;
