import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Card, CardActionArea } from '@mui/material';
import './GalleryPage.css';

const GalleryPage = () => {
  const [works, setWorks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const folderNames = ['acceleration_2023', 'ball_and_socket_2023', '100_2023', 'crash_landed_2024'];
    const worksData = folderNames.map((folder, index) => ({
      id: index + 1,
      folder,
      thumbnail: `${process.env.PUBLIC_URL}/works/worksThumbnails/${folder}/image1.jpg`,
      formattedFolderName: folder.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    }));
    setWorks(worksData);
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
      <Box className="grid-container" sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {works.map((work) => (
            <Grid item xs={12} sm={6} md={4} key={work.id}>
              <Card>
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
