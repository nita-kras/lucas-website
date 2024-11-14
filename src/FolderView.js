import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './FolderView.css';

const FolderView = () => {
  const { folderName } = useParams();
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLargeImageView, setIsLargeImageView] = useState(false);
  const [titleMapping, setTitleMapping] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTitleMapping = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/workTitles.json`);
        const data = await response.json();
        setTitleMapping(data);
      } catch (error) {
        console.error("Error loading title mappings:", error);
      }
    };
    fetchTitleMapping();
  }, []);

  // Retrieve the folder title from the title mapping or fall back to the folder name (formatted)
  const formattedFolderName = titleMapping[folderName] || folderName.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  const workDate = folderName.split('_').pop();

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
    setIsLargeImageView((prev) => !prev); 
  };

  // Define folder names without the year suffix
  const folderNames = ['acceleration_2023', 'ball_and_socket_2023', '100_2023', 'crash_landed_2024'];

  // Format folder names for the folder list
  const formattedFolderNames = folderNames.map((folder) => {
    // Strip the date from the folder name and map it to the title
    const folderBaseName = folder.split('_')[0]; // get the part before the date
    return titleMapping[folderBaseName] || folderBaseName.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  });

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

  // Function to format description with line breaks
  const formatDescription = (description) => {
    if (!description) {
      return <p>No description available</p>;
    }

    return description.split("\n").map((str, index) => (
      <p key={index}>{str}</p>
    ));
  };

  return (
    <div className="folder-view-page">
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
          <>
            <div className="left-section">
              <div className="folder-list">
                <ul>
                  {formattedFolderNames.map((folder, index) => (
                    <li key={index}>
                      <Link to={`/folder/${folderNames[index]}`} className="folder-link">
                        {folder}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="folder-navigation-buttons">
                <button className="folder-nav-button prev-work" onClick={handlePrevWork} disabled={folderNames.indexOf(folderName) === 0}>Prev Work</button>
                <button className="folder-nav-button next-work" onClick={handleNextWork} disabled={folderNames.indexOf(folderName) === folderNames.length - 1}>Next Work</button>
              </div>
            </div>

            <div className="center-section">
              <div className="carousel-container">
                {images.length === 0 ? (
                  <div>Loading images...</div>
                ) : (
                  <div className="carousel-content">
                    <div className="carousel-image-wrapper">
                      <div className="arrow arrow-left" onClick={handlePreviousImage} />
                      <img src={images[currentIndex]?.image} alt="Selected" className="carousel-image" onClick={handleImageClick} />
                      <div className="arrow arrow-right" onClick={handleNextImage} />
                    </div>
                    <div className="thumbnails-container">
                      {images.map((img, index) => (
                        <img key={img.id} src={img.thumbnail} alt={`Thumbnail ${index}`} onClick={() => handleThumbnailClick(index)} className={`thumbnail ${index === currentIndex ? 'selected' : ''}`} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="image-description">
                <h2>
                  {formattedFolderName} <span className="work-date">({workDate})</span>
                </h2>
                <div>{formatDescription(images[currentIndex]?.description)}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FolderView;
