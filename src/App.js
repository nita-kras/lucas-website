import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';
import Info from './Info';
import FolderView from './FolderView';
import GalleryPage from './GalleryPage';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} /> {/* New homepage with one image */}
          <Route path="/gallery" element={<GalleryPage />} /> {/* The gallery page */}
          <Route path="/info" element={<Info />} />
          <Route path="/folder/:folderName" element={<FolderView />} />
          <Route path="*" element={<Homepage />} /> {/* Catch-all for 404 */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
