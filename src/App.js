// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';
import Info from './Info';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
