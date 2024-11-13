import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Box, Card, CardMedia, CardActionArea, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';  // For close icon on the modal
import './FolderView.css';

const FolderView = () => {
  const { folderName } = useParams();
  const [images, setImages] = useState([]);
  const [openModal, setOpenModal] = useState(false);  // State to control modal visibility
  const [selectedImage, setSelectedImage] = useState(''); // State to store the selected image

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Fetch the images.json file from the folder
        const response = await fetch(`${process.env.PUBLIC_URL}/works/worksLarge/${folderName}/images.json`);
        
        if (!response.ok) {
          throw new Error('Could not fetch image data');
        }

        // Parse the JSON data
        const imagesData = await response.json();

        // Format the images to build the correct image URL for worksLarge
        const formattedImages = imagesData.map(img => ({
          id: img.id,
          image: `${process.env.PUBLIC_URL}/works/worksLarge/${folderName}/${img[folderName]}`
        }));

        setImages(formattedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [folderName]);

  // Function to open the modal with the selected image
  const handleImageClick = (image) => {
    setSelectedImage(image); // Set the selected image
    setOpenModal(true); // Open the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(''); // Clear the selected image when modal is closed
  };

  return (
    <div className="folder-view">
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          {images.map((img) => (
            <Grid item xs={12} sm={6} md={4} key={img.id}>
              <Card>
                <CardActionArea onClick={() => handleImageClick(img.image)}>
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

      {/* Modal to display enlarged image */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <IconButton edge="end" color="inherit" onClick={handleCloseModal} aria-label="close" sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img
            src={selectedImage}
            alt="Selected"
            style={{ width: '100%', height: 'auto' }}
          />
        </DialogContent>
        <DialogActions>
          <button onClick={handleCloseModal}>Close</button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FolderView;
