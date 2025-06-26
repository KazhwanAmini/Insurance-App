import React, { useState } from 'react';
import CompanyList from './components/CompanyList';
import LoginForm from './components/LoginForm';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('access')
  );

  const handleLogin = () => setIsLoggedIn(true);

  return (
    <div className="container">
      <h1>Insurance App</h1>
      {isLoggedIn ? <CompanyList /> : <LoginForm onLogin={handleLogin} />}
    </div>
  );
}

export default App;
