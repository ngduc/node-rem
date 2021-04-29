import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getLoginData } from './utils/apiUtil';

import { Login } from './components/Login/Login';
import { Home } from './components/Home/Home';
import ItemView from './components/ItemView/ItemView';

function App() {
  const { userEmail } = getLoginData();
  return (
    <>
      <header className="bg-blue-200 px-5 p-3 flex justify-between items-center">
        <div>Node-REM - UI Example</div>
        <div>{userEmail}</div>
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/item/:itemId" element={<ItemView />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
