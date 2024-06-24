// src/Homepage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Card, CardMedia, CardActionArea } from '@mui/material';
import './Homepage.css';

const Homepage = () => {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    // This is a placeholder function. You'll need to implement the actual logic to fetch the images.
    const fetchWorks = async () => {
      // Simulate fetching works from the 'works' folder
      const worksData = [
        { id: 1, image: '/works/folder1/image1.jpg' },
        { id: 2, image: '/works/folder2/image1.jpg' },
        { id: 3, image: '/works/folder3/image1.jpg' },
        // Add more items as needed
      ];
      setWorks(worksData);
    };

    fetchWorks();
  }, []);

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
                <CardActionArea>
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