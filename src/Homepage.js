// src/Homepage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Card, CardMedia, CardActionArea } from '@mui/material';
import './Homepage.css';

const Homepage = () => {
  const [works, setWorks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorks = async () => {
      // Manually maintain the list of folder names
      const folderNames = ['acceleration','ball_and_socket_joint','bracket','crash_landed','flag','haunted_house','insert_me_a_perfect_coupling', 'lets_fuck', 'mother_and_child', 'synthesis_installation', 'twighlight_drawing','twighlight_monitor'];

      // Construct the works data
      const worksData = folderNames.map((folder, index) => ({
        id: index + 1,
        folder,
        image: `${process.env.PUBLIC_URL}/works/${folder}/image1.png`, // Adjust the extension to .png
      }));

      console.log('Works data:', worksData); // Debugging log
      setWorks(worksData);
    };

    fetchWorks();
  }, []);

  const handleCardClick = (folder) => {
    console.log('Navigating to folder:', folder); // Debugging log
    navigate(`/folder/${folder}`);
  };

  return (
    <div className="homepage">
      <div className="topbar">
        <Link to="/" className="topbar-button">Home</Link>
        <Link to="/info" className="topbar-button">Info</Link>
      </div>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          {works.map((work) => (
            <Grid item xs={12} sm={6} md={4} key={work.id}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(work.folder)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={work.image}
                    alt={`Work ${work.id}`}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Homepage;
