import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Card, CardActionArea } from '@mui/material';
import './Homepage.css';

const Homepage = () => {
  const [showGallery, setShowGallery] = useState(false);  // State to control whether the gallery is shown
  const [works, setWorks] = useState([]);
  const [titleMapping, setTitleMapping] = useState({}); // State for title mappings
  const navigate = useNavigate();

  useEffect(() => {
    if (showGallery) {
      // Fetch title mapping file when the gallery is shown
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
    }
  }, [showGallery]);

  useEffect(() => {
    if (showGallery) {
      const folderNames = ['mother_and_child_2024', 'lets_fuck_2024', 'crash_landed_2024', 'light_the_way_2024', 'unfinished_crash_2024', 'warhammer_2024', 'the_mystery_of_the_blood-bath_bath_house_2024', 'name_2023', 'acceleration_2023', 'your_mood_swings_are_giving_me_whiplash_2023', 'ball_and_socket_2023', '100_2023', 'you_&_i_2023', 'ive_lived_2022', 'the_sentient_oil_spoke_2022', 'perfect_synthesis_2022', 'synthesis_2022', 'insert_me,_a_perfect_coupling_2022', 'fever_2022'];
      const worksData = folderNames.map((folder, index) => ({
        id: index + 1,
        folder,
        thumbnail: `${process.env.PUBLIC_URL}/works/worksThumbnails/${folder}/image1.jpg`,
        formattedFolderName: titleMapping[folder] || folder.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
      }));
      setWorks(worksData);
    }
  }, [titleMapping, showGallery]);

  const handleImageClick = () => {
    setShowGallery(true); // Show the gallery after clicking the logo
    navigate('/gallery', { replace: true }); // Navigate to /gallery and replace the history entry
  };

  const handleCardClick = (folder) => {
    navigate(`/folder/${folder}`);
  };

  return (
    <div className="homepage">
      {!showGallery ? (
        // Show the logo initially
        <div className="content">
          <img
            src={`${process.env.PUBLIC_URL}/markyMarkIcon.png`}
            alt="Click to Enter Gallery"
            onClick={handleImageClick}
            className="logo-image"
          />
        </div>
      ) : (
        // Show the gallery after clicking the logo
        <div className="gallery-page">
          <div className="topbar">
            <img src={`${process.env.PUBLIC_URL}/markyMarkIcon.png`} alt="Logo" className="topbar-logo" />
            <button className="topbar-button info-button" onClick={() => navigate('/info')}>Info</button>
          </div>
          <Box className="grid-container" sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {works.map((work) => (
                <Grid item xs={12} sm={6} md={4} key={work.id}>
                  <Card sx={{ boxShadow: 'none', borderRadius: 0 }}>
                    <CardActionArea onClick={() => handleCardClick(work.folder)}>
                      <div className="card-container">
                        <img
                          src={work.thumbnail}
                          alt={`Work ${work.id}`}
                          className="card-image"
                        />
                        <div className="card-overlay">
                          {work.formattedFolderName} {/* Display name on hover */}
                        </div>
                      </div>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Homepage;
