import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Homepage from '../pages/Homepage';

export default function MyRoute() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Homepage />}></Route>
      </Routes>
    </Router>
  );
}
