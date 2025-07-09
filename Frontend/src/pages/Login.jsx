import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('token/', credentials)
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)

      const userRes = await api.get('me/')
      const isSuperuser = userRes.data.is_superuser

      navigate(isSuperuser ? '/companies' : '/customers')
    } catch (err) {
      alert('Invalid credentials')
    }
  }

  return (
    <div className="pro-login-container">
      <div className="pro-login-card">
        <div className="logo-area">
          <span className="app-logo">🛡️</span>
          <h2 className="app-title">پورتال بیمه نامه ها</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <label>نام کاربری</label>
          <input
            name="username"
            placeholder="نام کاربری خود را وارد کنید"
            onChange={handleChange}
            required
          />
          <label>رمز</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />

          </div>
          <button type="submit">ورود</button>
        </form>
        <div className="footer-note">
          © {new Date().getFullYear()}  کلیه حقوق محفوظ است.
        </div>
      </div>
    </div>
  )
}

export default Login
