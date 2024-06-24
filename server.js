// server.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/works', async (req, res) => {
  try {
    const worksDir = path.join(__dirname, 'public', 'works');
    const folders = await fs.readdir(worksDir);
    
    const works = await Promise.all(folders.map(async (folder, index) => {
      const folderPath = path.join(worksDir, folder);
      const files = await fs.readdir(folderPath);
      const imageFile = files.find(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
      
      if (imageFile) {
        return {
          id: index + 1,
          image: `/works/${folder}/${imageFile}`
        };
      }
      return null;
    }));

    res.json(works.filter(work => work !== null));
  } catch (error) {
    console.error('Error reading works directory:', error);
    res.status(500).json({ error: 'Unable to fetch works' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});