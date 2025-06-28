import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import CustomerList from './components/CustomerList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('access')
  );


  if (!isLoggedIn) return <LoginForm onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <CustomerList />
      {/* You can add CompanyList or PolicyList here too */}
    </div>
  );
}

export default App;
