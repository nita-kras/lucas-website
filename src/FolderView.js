// src/FolderView.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Box, Card, CardMedia, CardActionArea } from '@mui/material';
import './FolderView.css';

const FolderView = () => {
  const { folderName } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      // Assume the folder contains image1.png, image2.png, image3.png, etc.
      const imageCount = 5; // Adjust this number based on your needs
      const imagesData = Array.from({ length: imageCount }, (_, index) => ({
        id: index + 1,
        image: `${process.env.PUBLIC_URL}/works/${folderName}/image${index + 1}.png`,
      }));

      console.log('Images data:', imagesData); // Debugging log
      setImages(imagesData);
    };

    fetchImages();
  }, [folderName]);

  return (
    <div className="folder-view">
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          {images.map((img) => (
            <Grid item xs={12} sm={6} md={4} key={img.id}>
              <Card>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={img.image}
                    alt={`Image ${img.id}`}
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

export default FolderView;
