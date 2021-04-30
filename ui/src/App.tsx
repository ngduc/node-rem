import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getLoginData } from './utils/apiUtil';
import { Dropdown } from './components/base';

import { Login } from './components/Login/Login';
import { Home } from './components/Home/Home';
import ItemView from './components/ItemView/ItemView';

function App() {
  const [loggedInEmail, setLoggedInEmail] = React.useState('');

  const refreshEmail = () => {
    const { userEmail } = getLoginData();
    setLoggedInEmail(userEmail);
  };

  React.useEffect(() => {
    refreshEmail();
  }, []);

  const onClickSignOut = () => {
    localStorage.removeItem('ld');
    window.location.href = '/'; // TODO: use routing
  };
  return (
    <>
      <header className="bg-blue-200 px-5 p-1 flex justify-between items-center">
        <div>Node-REM - UI Example</div>
        <Dropdown label={loggedInEmail}>
          <div onClick={onClickSignOut} style={{ width: 150 }}>
            Sign out
          </div>
        </Dropdown>
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<Login onLogin={refreshEmail} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/item/:itemId" element={<ItemView />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
