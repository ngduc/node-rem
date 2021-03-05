import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login/Login';
import { Home } from './components/Home/Home';
import ItemView from './components/ItemView/ItemView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/item/:itemId" element={<ItemView />} />
      </Routes>
    </Router>
  );
}

export default App;
