// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';
import Info from './Info';
import FolderView from './FolderView';
import GalleryPage from './GalleryPage';

const App = () => {
  return (
    <Router basename="/lucas-website">
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />         {/* New homepage with one image */}
          <Route path="/gallery" element={<GalleryPage />} /> {/* The gallery page */}
          <Route path="/info" element={<Info />} />
          <Route path="/folder/:folderName" element={<FolderView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
