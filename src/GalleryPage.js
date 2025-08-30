import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Card, CardActionArea } from '@mui/material';
import './GalleryPage.css';

const GalleryPage = () => {
  const [works, setWorks] = useState([]);
  const [titleMapping, setTitleMapping] = useState({}); // State for title mappings
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch title mapping file
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

  useEffect(() => {
    const folderNames = ['a_thousand_deaths_2025','hidden_away_2025','weed_drawing_','ilatd_tshirts_','clown_2024','stare_2024','mother_and_child_2024', 'lets_fuck_2024', 'crash_landed_2024', 'chain_2024_', 'light_the_way_2024', 'unfinished_crash_2024', 'warhammer_2024', 'the_mystery_of_the_blood-bath_bath_house_2024', 'iron_man_tshirts_', 'touch_is_love_2024','ring_', 'name_2023', 'refined_slag_2023', 'acceleration_2023', 'your_mood_swings_are_giving_me_whiplash_2023', 'ball_and_socket_2023', '100_2023', 'my_perfect_desires_2023', 'you_&_i_2023', 'ive_lived_2022', 'the_sentient_oil_spoke_2022', 'perfect_synthesis_2022', 'synthesis_2022', 'insert_me,_a_perfect_coupling_2022','fever_2022', 'my_feelings_inside_','sweet_',  'shredding_out_of_me_2021'];
    const worksData = folderNames.map((folder, index) => ({
      id: index + 1,
      folder,
      thumbnail: `${process.env.PUBLIC_URL}/works/worksThumbnails/${folder}/image1.jpg`,
      formattedFolderName: titleMapping[folder] || folder.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    }));
    setWorks(worksData);
  }, [titleMapping]); // Ensure this useEffect runs after titleMapping is set

  const handleCardClick = (folder) => {
    navigate(`/folder/${folder}`);
  };

  return (
    <div className="homepage">
      <div className="topbar">
      <Link to="/" className="topbar-logo-link">
  <img src={`${process.env.PUBLIC_URL}/NameLogo.jpg`} alt="Logo" className="topbar-logo" />
</Link>

        <Link to="/info" className="topbar-button info-button">Info</Link>
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
  );
};

export default GalleryPage;
