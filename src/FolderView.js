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
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null); // null = no track selected
  const audioRef = useRef(null);

  const tracks = [
    { title: "Dark State", file: "1_Dark_State.mp3", duration: "4:34" },
    { title: "Weaponised", file: "2_Weaponised.mp3", duration: "2:44" },
    { title: "Exiting the Dark Cave", file: "3_Exiting_the_dark_cave.mp3", duration: "2:15" },
    { title: "An Empty City", file: "4_An_empty_city.mp3", duration: "3:13" },
    { title: "Trying to Hide", file: "5_Trying_to_hide.mp3", duration: "4:09" }
  ];

  const handleTrackChange = (index) => {
    setCurrentTrackIndex(index);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  };

  const canSwipeRef = useRef(true);
  const swipeTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const resetSwipeCapability = useCallback(() => {
    canSwipeRef.current = true;
  }, []);

  const linkify = (text) => {
    if (!text) return text;
    return text.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  };

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
        if (swipeTimeoutRef.current) clearTimeout(swipeTimeoutRef.current);
      },
      onDrag: ({ movement: [mx], direction: [xDir], cancel, intentional }) => {
        if (canSwipeRef.current && intentional && Math.abs(mx) > 50) {
          canSwipeRef.current = false;
          xDir > 0 ? handlePreviousImage() : handleNextImage();
          swipeTimeoutRef.current = setTimeout(resetSwipeCapability, 300);
          cancel();
        }
      },
      onDragEnd: () => {
        if (swipeTimeoutRef.current) clearTimeout(swipeTimeoutRef.current);
        swipeTimeoutRef.current = setTimeout(resetSwipeCapability, 300);
      }
    },
    { drag: { axis: 'x', threshold: 10, preventDefault: true, touchAction: 'none' } }
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

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    if (index >= thumbnailStartIndex + 3) setThumbnailStartIndex(index - 2);
    else if (index <= thumbnailStartIndex) setThumbnailStartIndex(Math.max(index - 1, 0));
  };

  const handleImageClick = () => {
    if (images[currentIndex]?.type !== 'video') setIsLargeImageView((prev) => !prev);
  };

  const folderNames = [  
    'set_for_the_tension_held_2025',
    'a_thousand_deaths_2025',
    'hidden_away_2025',
    'weed_drawing_',
    'ilatd_tshirts_',
    'clown_2024',
    'stare_2024',
    'grim_reaper_2024',
    'mother_and_child_2024',
    'lets_fuck_2024',
    'crash_landed_2024',
    'chain_2024_',
    'light_the_way_2024',
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
    'shredding_out_of_me_2021',
  ];

  const formattedFolderNames = folderNames.map((folder) =>
    titleMapping[folder] || folder.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  );

  const handleNextWork = () => {
    const currentFolderIndex = folderNames.indexOf(folderName);
    if (currentFolderIndex < folderNames.length - 1) navigate(`/folder/${folderNames[currentFolderIndex + 1]}`);
  };

  const handlePrevWork = () => {
    const currentFolderIndex = folderNames.indexOf(folderName);
    if (currentFolderIndex > 0) navigate(`/folder/${folderNames[currentFolderIndex - 1]}`);
  };

  const formatDescription = (description) => {
    if (!description) return <p>No description available</p>;

    const splitIndex = description.search(/\n- /);
    const narrative = splitIndex >= 0 ? description.slice(0, splitIndex).trim() : description.trim();
    const creditsText = splitIndex >= 0 ? description.slice(splitIndex).trim() : '';

    return (
      <>
        <div className="description-section" style={{ marginBottom: '2em' }}>
          {narrative.split("\n").map((line, i) => (
            <p key={i}><span dangerouslySetInnerHTML={{ __html: linkify(line) }} /></p>
          ))}
        </div>

        {/* Soundtrack Section */}
        {folderName === "a_thousand_deaths_2025" && (
          <div className="soundtrack-section" style={{ marginBottom: '2em' }}>
            <div className="original-soundtrack">Original Soundtrack</div>

            {/* Main Player only visible if a track is selected */}
            {currentTrackIndex !== null && (
              <div className="main-player" style={{ marginTop: '1em', marginBottom: '1em' }}>
                <div className="player-header">{tracks[currentTrackIndex].title}</div>
                <div className="audio-wrapper">
                  <audio
                    ref={audioRef}
                    controls
                    controlsList="noplaybackrate noremoteplayback nodownload"
                    disablePictureInPicture
                    preload="metadata"
                    className="clean-audio"
                  >
                    <source
                      src={`${process.env.PUBLIC_URL}/works/worksLarge/a_thousand_deaths_2025/${tracks[currentTrackIndex].file}`}
                      type="audio/mpeg"
                    />
                  </audio>
                  <button
                    className="download-button"
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = `${process.env.PUBLIC_URL}/works/worksLarge/a_thousand_deaths_2025/${tracks[currentTrackIndex].file}`;
                      a.download = tracks[currentTrackIndex].file;
                      a.click();
                    }}
                    aria-label="Download"
                  >
                    ⬇
                  </button>
                </div>
              </div>
            )}

            <div className="tracklist">
              {tracks.map((track, index) => (
                <div
                  key={index}
                  className={`track ${index === currentTrackIndex ? "active" : ""}`}
                  onClick={() => handleTrackChange(index)}
                >
                  <span className="track-title">{index + 1}. {track.title}</span>
                  <span className="track-duration">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credits */}
        <div className="credits-section" style={{ marginTop: '2em' }}>
          {creditsText.split("\n").map((line, i) => {
            if (!line.trim()) return null;
            if (folderName === "a_thousand_deaths_2025" && (line.startsWith('- ') || line.startsWith('\t'))) {
  // Split ONLY on first tab group
  const [rolePart, namePart] = line.split(/\t+/);

  const role = rolePart.replace('- ', '').trim();

  return (
    <div key={i} className="credit-line">
      <span className="role" dangerouslySetInnerHTML={{ __html: linkify(role) }} />
      {namePart && (
        <div className="names">
          <div dangerouslySetInnerHTML={{ __html: linkify(namePart.trim()) }} />
        </div>
      )}
    </div>
  );
}

// Handle continuation lines (names under previous role)
if (line.startsWith('\t')) {
  return (
    <div key={i} className="credit-line continuation">
      <span className="role" /> 
      <div className="names">
        <div dangerouslySetInnerHTML={{ __html: linkify(line.trim()) }} />
      </div>
    </div>
  );
}
            return (
  <p key={i} style={{ margin: '0.2em 0' }}>
    <span dangerouslySetInnerHTML={{ __html: linkify(line.replace(/\t/g, '')) }} />
  </p>
);
          })}
        </div>
      </>
    );
  };

  return (
    <div className="folder-view-page">
      <div className="topbar">
  <div></div>

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
      <div className="folder-view">
        {/* Left Column */}
        {!isLargeImageView && (
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
        )}

        {/* Center Column */}
<div className={`center-section ${isLargeImageView ? "full-width" : ""}`}>
  
{isLargeImageView ? (
  <div className="expanded-scroll-view" onClick={handleImageClick}>
    
    <p className="click-to-exit">Click anywhere to exit</p>

    {images.map((img, index) => (
      img.type === "video" ? (
        <video
          key={index}
          src={img.image}
          controls
          className="expanded-media"
          onClick={(e) => e.stopPropagation()} // prevent exit when interacting
        />
      ) : (
        <img
          key={index}
          src={img.image}
          alt=""
          className="expanded-media"
        />
      )
    ))}

  </div>
) : (
    <>
      {/* NORMAL CAROUSEL */}
      <div className="carousel-container">
        {images.length === 0 ? (
          <div>Loading images...</div>
        ) : (
          <div className="carousel-content">
            <div className="carousel-image-wrapper" {...carouselGesture()}>
              <div className="arrow arrow-left" onClick={handlePreviousImage} />

              {images[currentIndex]?.type === "video" ? (
                <video
                  src={images[currentIndex].image}
                  poster={images[currentIndex].thumbnail}
                  className="carousel-image"
                  controls
                  preload="metadata"
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
          </div>
        )}
      </div>

      {/* DESCRIPTION */}
      <div className={`image-description ${folderName === "a_thousand_deaths_2025" ? "tight" : ""}`}>
        <h2>{formattedFolderName}</h2>
        <p className="work-date">{workDate}</p>
        <p className="material-info">{images[currentIndex]?.materials}</p>
        <div>{formatDescription(images[currentIndex]?.description)}</div>
      </div>
    </>
  )}
</div>
      </div>
    </div>
  );
};

export default FolderView;