// src/components/Header.js
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'
import { useTranslation } from 'react-i18next'

const Header = () => {
  const { i18n } = useTranslation()
  const token = localStorage.getItem('access')
  const navigate = useNavigate()

  const handleLogout = () => {
  localStorage.clear() // Clears all keys in localStorage
  navigate('/login')
}

//  const toggleLanguage = () => {
//     const newLang = i18n.language === 'fa' ? 'en' : 'fa'
//     i18n.changeLanguage(newLang)

//     // Change page direction
//     document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr'
//   }
const { t } = useTranslation()
  return (
    <header className="pro-header">
      <div className="pro-header-left">
        <Link className="pro-logo-text" to="/">{t('home')}</Link>
      </div>
      <nav className="pro-nav">
        {!token && <Link to="/register">{t('signup')}</Link>}
        {!token && <Link to="/login">{t('login')}</Link>}
        {token && (
          <button className="logout-btn" onClick={handleLogout}>
            {t('logout')}
          </button>
        )}
        {/* <button onClick={toggleLanguage} className="lang-toggle-btn">
        {i18n.language === 'fa' ? 'English' : 'فارسی'}
      </button> */}
      </nav>
    </header>
  )
}

export default Header
