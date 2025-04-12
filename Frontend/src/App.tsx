import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing'; // Make sure the file exists and is correctly named
import ReportLostItem from './pages/ReportLostItem';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/reportlostitem" element={<ReportLostItem />} />
      </Routes>
    </Router>
  );
}


export default App;
