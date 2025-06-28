// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">Insurance App</div>
      <nav className="nav">
        <Link to="/">Home</Link>
        {!token && <Link to="/login">Login</Link>}
        {token && <button onClick={handleLogout}>Logout</button>}
      </nav>
    </header>
  );
};

export default Header;
