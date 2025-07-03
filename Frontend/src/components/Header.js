// src/components/Header.js
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const token = localStorage.getItem('access')
  const navigate = useNavigate()

  const handleLogout = () => {
  localStorage.clear() // Clears all keys in localStorage
  navigate('/login')
}

  return (
    <header className="pro-header">
      <div className="pro-header-left">
        <Link className="pro-logo-text" to="/">Home</Link>
      </div>
      <nav className="pro-nav">
        {!token && <Link to="/register">Sign Up</Link>}
        {!token && <Link to="/login">Login</Link>}
        {token && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  )
}

export default Header
