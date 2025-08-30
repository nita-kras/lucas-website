import React, { useEffect, useState, useCallback, useRef } from 'react';
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

  const canSwipeRef = useRef(true);
  const swipeTimeoutRef = useRef(null);

  const navigate = useNavigate();

  const resetSwipeCapability = useCallback(() => {
    canSwipeRef.current = true;
  }, []);

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
        const formattedImages = imagesData.map((img) => {
          const isVideo = img.type === "video";
          const fileName = img[folderName];
          return {
            id: img.id,
            type: isVideo ? "video" : "image",
            image: `${process.env.PUBLIC_URL}/works/worksLarge/${folderName}/${fileName}`,
            thumbnail: isVideo
              ? `${process.env.PUBLIC_URL}/works/worksThumbnails/${folderName}/${img.thumbnail}`
              : `${process.env.PUBLIC_URL}/works/worksThumbnails/${folderName}/${fileName}`,
            description: img.description || "No description available",
            materials: img.materials || "No materials listed",
          };
        });
        
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
      onDragStart: () => {
        // Reset any previous timeout
        if (swipeTimeoutRef.current) {
          clearTimeout(swipeTimeoutRef.current);
        }
      },
      onDrag: ({ movement: [mx], direction: [xDir], cancel, intentional }) => {
        // Only trigger if swipe is allowed, intentional, and meets threshold
        if (
          canSwipeRef.current && 
          intentional && 
          Math.abs(mx) > 50  // Increased threshold to prevent accidental swipes
        ) {
          // Prevent further swipes immediately
          canSwipeRef.current = false;

          // Perform the swipe
          xDir > 0 ? handlePreviousImage() : handleNextImage();

          // Set a timeout to re-enable swiping
          swipeTimeoutRef.current = setTimeout(resetSwipeCapability, 300);

          // Cancel the gesture to prevent multiple triggers
          cancel();
        }
      },
      onDragEnd: () => {
        // Ensure swipe capability is reset
        if (swipeTimeoutRef.current) {
          clearTimeout(swipeTimeoutRef.current);
        }
        swipeTimeoutRef.current = setTimeout(resetSwipeCapability, 300);
      }
    },
    {
      drag: {
        axis: 'x',
        threshold: 10,
        preventDefault: true,
        touchAction: 'none'
      },
    }
  );


  const handleNextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % images.length;
      if (newIndex >= thumbnailStartIndex + 3) setThumbnailStartIndex(newIndex - 2);
      return newIndex;
    });
  }, [images.length, thumbnailStartIndex]);

  const handlePreviousImage = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + images.length) % images.length;
      if (newIndex <= thumbnailStartIndex) setThumbnailStartIndex(Math.max(newIndex - 1, 0));
      return newIndex;
    });
  }, [images.length, thumbnailStartIndex]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isLargeImageView) {
        setIsLargeImageView(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isLargeImageView]);
  

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    if (index >= thumbnailStartIndex + 3) {
      setThumbnailStartIndex(index - 2); // Adjust start if clicking far right thumbnail
    } else if (index <= thumbnailStartIndex) {
      setThumbnailStartIndex(Math.max(index - 1, 0)); // Adjust start if clicking far left thumbnail
    }
  };

  const handleImageClick = () => {
    if (images[currentIndex]?.type !== 'video') {
      setIsLargeImageView((prev) => !prev);
    }
  };
  

  const folderNames = [  
    'a_thousand_deaths_2025',
    'hidden_away_2025',
    'weed_drawing_',
    'ilatd_tshirts_',
    'clown_2024',
    'stare_2024',
    'mother_and_child_2024',
    'lets_fuck_2024',
    'crash_landed_2024',
    'chain_2024_',
    'light_the_way_2024',
    'unfinished_crash_2024',
    'warhammer_2024',
    'the_mystery_of_the_blood-bath_bath_house_2024',
    'iron_man_tshirts_',
    'touch_is_love_2024',
    'ring_',
    'name_2023',
    'refined_slag_2023',
    'acceleration_2023',
    'your_mood_swings_are_giving_me_whiplash_2023',
    'ball_and_socket_2023',
    '100_2023',
    'my_perfect_desires_2023',
    'you_&_i_2023',
    'ive_lived_2022',
    'the_sentient_oil_spoke_2022',
    'perfect_synthesis_2022',
    'synthesis_2022',
    'insert_me,_a_perfect_coupling_2022',
    'fever_2022',
    'my_feelings_inside_','sweet_', 
    'shredding_out_of_me_2021',];
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

    return description.split("\n").map((str, index) => {
      // Handle credits formatting - check if line contains role and name
      if (str.includes('\t') && str.startsWith('- ')) {
        const parts = str.split('\t');
        const role = parts[0]; // e.g., "- Written & Directed"
        const name = parts[parts.length - 1]; // Last part is the name
        
        return (
          <p key={index} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.2em 0' }}>
            <span>{role}</span>
            <span>{name}</span>
          </p>
        );
      }
      
      // Handle actor names and production assistants (lines that don't start with -)
      if (str.trim() && !str.startsWith('-') && index > 2) {
        return (
          <p key={index} style={{ textAlign: 'right', margin: '0.2em 0', paddingRight: '0' }}>
            {str.replace(/\t/g, '')}
          </p>
        );
      }
      
      // Regular paragraphs
      return <p key={index} style={{ margin: '0.5em 0' }}>{str.replace(/\t/g, '')}</p>;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isLargeImageView) {
        switch(event.key) {
          case 'ArrowRight':
            event.preventDefault();
            handleNextImage();
            break;
          case 'ArrowLeft':
            event.preventDefault();
            handlePreviousImage();
            break;
          default:
            // No action for other keys
            break;
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isLargeImageView, 
    images, 
    currentIndex, 
    thumbnailStartIndex, 
    handleNextImage,  // Add these two
    handlePreviousImage  // to resolve the second warning
  ]);

  return (
    <div className="folder-view-page">
    {!isLargeImageView && (
      <div className="topbar">
      <div className="logo-container">
        <img 
          src={`${process.env.PUBLIC_URL}/NameLogo.jpg`} 
          alt="Logo" 
          className="topbar-logo" 
          onClick={() => navigate('/gallery')}
          style={{ cursor: 'pointer' }} 
        />
      </div>
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
            {images.filter(img => img.type !== "video").map((img) => (
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
        <Link 
          to={`/folder/${folderNames[index]}`} 
          className={`folder-link ${folderNames[index] === folderName ? 'active' : ''}`}
        >
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
                    {images[currentIndex]?.type === "video" ? (
                      <video
                        src={images[currentIndex].image}
                        poster={images[currentIndex].thumbnail}
                        className="carousel-image"
                        controls
                        preload="metadata"
                        style={{ 
                          objectFit: 'contain'
                        }}
                        // No onClick here to prevent enlargement
                      />
                    ) : (
                      <img
                        src={images[currentIndex]?.image}
                        alt="Selected"
                        className="carousel-image"
                        onClick={handleImageClick}
                      />
                    )}
                    <div className="arrow arrow-right" onClick={handleNextImage} />
                  </div>
                  {images[currentIndex]?.type !== "video" && (
                    <p className="click-to-enlarge">Click image to expand</p>
                  )}

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
                      disabled={folderNames.indexOf(folderNames.length - 1)}
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