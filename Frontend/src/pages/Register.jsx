// src/pages/Register.jsx
import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import './Register.css'

const Register = () => {
  const [form, setForm] = useState({
    company_name: '',
    address: '',
    phone: '',
    username: '',
    password: '',
  })

  const navigate = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await api.post('register/', {
        company_name: form.company_name,
        company_address: form.address,
        company_phone: form.phone,
        username: form.username,
        password: form.password,
      })

      alert('✅ Company registered successfully. You can now log in.')
      navigate('/login')
    } catch (error) {
      console.error(error)
      alert('❌ Registration failed.')
    }
  }

  return (
    <div className="pro-register-container">
      <div className="pro-register-card">
        <h2>Register Company</h2>
        <form onSubmit={handleSubmit}>
          <label>Company Name</label>
          <input name="company_name" placeholder="Acme Inc." onChange={handleChange} required />

          <label>Address</label>
          <input name="address" placeholder="123 Main St" onChange={handleChange} required />

          <label>Phone</label>
          <input name="phone" placeholder="+1 123 456 7890" onChange={handleChange} required />

          <label>Username</label>
          <input name="username" placeholder="admin_user" onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  )
}

export default Register
