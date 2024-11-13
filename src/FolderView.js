import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './FolderView.css';

const FolderView = () => {
  const { folderName } = useParams();
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomX, setZoomX] = useState('50%');
  const [zoomY, setZoomY] = useState('50%');

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
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, [folderName]);

  const handleNextImage = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  const handlePreviousImage = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  const handleThumbnailClick = (index) => setCurrentIndex(index);

  const handleZoomToggle = (e) => {
    if (!zoomed) {
      const rect = e.target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomX(`${x}%`);
      setZoomY(`${y}%`);
    }
    setZoomed((prevZoomed) => !prevZoomed);
  };

  const folderNames = ['acceleration_2023', 'ball_and_socket_2023', '100_2023', 'crash_landed_2024'];

  return (
    <div className="folder-view">
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

      <div className="carousel-container">
        {images.length === 0 ? (
          <div>Loading images...</div>
        ) : (
          <div className="carousel-content">
            {/* Carousel Image */}
            <div className="carousel-image-wrapper">
              <img
                src={images[currentIndex]?.image}
                alt="Selected"
                className={`carousel-image ${zoomed ? 'zoomed-image' : 'non-zoomed-image'}`}
                onClick={handleZoomToggle}
                style={{
                  transformOrigin: `${zoomX} ${zoomY}`,
                  transform: zoomed ? 'scale(2)' : 'scale(1)',
                }}
              />

              {/* Navigation Arrows */}
              <div className="arrow arrow-left" onClick={handlePreviousImage}></div>
              <div className="arrow arrow-right" onClick={handleNextImage}></div>
            </div>

            {/* Description with folder name */}
            <div className="image-description">
              <h2>{formattedFolderName}</h2>
              <p>{images[currentIndex]?.description}</p>
            </div>
          </div>
        )}

        {/* Thumbnails */}
        <div className="thumbnails-container">
          {images.map((img, index) => (
            <img
              key={img.id}
              src={img.thumbnail}
              alt={`Thumbnail ${index}`}
              onClick={() => handleThumbnailClick(index)}
              className={`thumbnail ${index === currentIndex ? 'selected' : ''}`}
              style={{ width: '20%', height: 'auto', cursor: 'pointer', margin: '5px' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FolderView;
