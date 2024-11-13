// src/GalleryPage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Card, CardMedia, CardActionArea } from '@mui/material';
import './Homepage.css';
import './GalleryPage.css';

const GalleryPage = () => {
  const [works, setWorks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorks = async () => {
      const folderNames = ['acceleration_2023', 'ball_and_socket_2023', '100_2023', 'crash_landed_2024'];
      const worksData = folderNames.map((folder, index) => ({
        id: index + 1,
        folder,
        image: `${process.env.PUBLIC_URL}/works/${folder}/image1.jpg`,
      }));
      setWorks(worksData);
    };

    fetchWorks();
  }, []);

  const handleCardClick = (folder) => {
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
                    height="350"
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

export default GalleryPage;
