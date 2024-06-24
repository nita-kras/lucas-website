// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';
import Info from './Info';

const App = () => {
  return (
    <Router basename="/lucas-website">
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;