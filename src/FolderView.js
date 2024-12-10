import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGesture } from 'react-use-gesture';
import './FolderView.css';


const FolderView = () => {
  const { folderName } = useParams();
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLargeImageView, setIsLargeImageView] = useState(false);
  const [titleMapping, setTitleMapping] = useState({});
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

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
          materials: img.materials || "No materials listed",
        }));
        setImages(formattedImages);
        setCurrentIndex(0);
        setThumbnailStartIndex(0);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, [folderName]);

  const carouselGesture = useGesture(
    {
        onDrag: ({ movement: [mx], direction: [xDir], cancel }) => {
            if (Math.abs(mx) > 50) {
                xDir > 0 ? handlePreviousImage() : handleNextImage();
                cancel();
            }
        },
    },
    {
        drag: {
            axis: 'x',
            threshold: 20, // Reducing threshold for faster swipe recognition
            preventDefault: true,
        },
    }
);


  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % images.length;
      if (newIndex >= thumbnailStartIndex + 3) setThumbnailStartIndex(newIndex - 2); // Shift right
      return newIndex;
    });
  };

  const handlePreviousImage = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + images.length) % images.length;
      if (newIndex <= thumbnailStartIndex) setThumbnailStartIndex(Math.max(newIndex - 1, 0)); // Shift left
      return newIndex;
    });
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    if (index >= thumbnailStartIndex + 3) {
      setThumbnailStartIndex(index - 2); // Adjust start if clicking far right thumbnail
    } else if (index <= thumbnailStartIndex) {
      setThumbnailStartIndex(Math.max(index - 1, 0)); // Adjust start if clicking far left thumbnail
    }
  };

  const handleImageClick = () => {
    setIsLargeImageView((prev) => !prev); 
  };

  const folderNames = ['mother_and_child_2024', 'lets_fuck_2024', 'crash_landed_2024', 'light_the_way_2024', 'unfinished_crash_2024', 'warhammer_2024', 'the_mystery_of_the_blood-bath_bath_house_2024', 'name_2023', 'acceleration_2023', 'your_mood_swings_are_giving_me_whiplash_2023', 'ball_and_socket_2023', '100_2023', 'you_&_i_2023', 'ive_lived_2022', 'the_sentient_oil_spoke_2022', 'perfect_synthesis_2022', 'synthesis_2022', 'insert_me,_a_perfect_coupling_2022', 'fever_2022'];
  const formattedFolderNames = folderNames.map((folder) => titleMapping[folder] || folder.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()));

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
        <div></div>
        <img 
          src={`${process.env.PUBLIC_URL}/NameLogo.jpg`} 
          alt="Logo" 
          className="topbar-logo" 
          onClick={() => navigate('/gallery')}
          style={{ cursor: 'pointer' }} 
        />
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
                {formattedFolderNames.map((folderTitle, index) => (
                  <li key={index}>
                    <Link to={`/folder/${folderNames[index]}`} className="folder-link">
                      {folderTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="folder-navigation-buttons">
              <button 
                className="folder-nav-button prev-work" 
                onClick={handlePrevWork} 
                disabled={folderNames.indexOf(folderName) === 0}
              >
                Prev Work
              </button>
              <button 
                className="folder-nav-button next-work" 
                onClick={handleNextWork} 
                disabled={folderNames.indexOf(folderName) === folderNames.length - 1}
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
                  <div 
                    className="carousel-image-wrapper" 
                    {...carouselGesture()}
                  >
                    <div className="arrow arrow-left" onClick={handlePreviousImage} />
                    <img
                      src={images[currentIndex]?.image}
                      alt="Selected"
                      className="carousel-image"
                      onClick={handleImageClick}
                    />
                    <div className="arrow arrow-right" onClick={handleNextImage} />
                  </div>
                  <p className="click-to-enlarge">Click to expand</p>

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

                  {/* Navigation buttons now have the same styling as in the left section */}
                  <div className="folder-navigation-buttons">
                    <button 
                      className="folder-nav-button prev-work" 
                      onClick={handlePrevWork} 
                      disabled={folderNames.indexOf(folderName) === 0}
                    >
                      Prev Work
                    </button>
                    <button 
                      className="folder-nav-button next-work" 
                      onClick={handleNextWork} 
                      disabled={folderNames.indexOf(folderName) === folderNames.length - 1}
                    >
                      Next Work
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="image-description">
              <h2>{formattedFolderName}</h2>
              <p className="work-date">{workDate}</p>
              <p className="material-info">{images[currentIndex]?.materials}</p>
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