// src/Homepage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Card, CardMedia, CardActionArea } from '@mui/material';
import './Homepage.css';

const Homepage = () => {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch('/api/works');
        if (!response.ok) {
          throw new Error('Failed to fetch works');
        }
        const data = await response.json();
        console.log('Fetched works:', data);  // Add this line
        setWorks(data);
      } catch (error) {
        console.error('Error fetching works:', error);
      }
    };

    fetchWorks();
  }, []);

  console.log('Rendering works:', works);  // Add this line

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