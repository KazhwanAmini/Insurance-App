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
        <h2>ثبت شرکت</h2>
        <form onSubmit={handleSubmit}>
          <label>نام شرکت</label>
          <input name="company_name" placeholder="نام شرکت" onChange={handleChange} required />

          <label>آدرس</label>
          <input name="address" placeholder="آدرس" onChange={handleChange} required />

          <label>شماره تلفن</label>
          <input name="phone" placeholder="شماره تلفن" onChange={handleChange} required />

          <label>نام کاربری</label>
          <input name="username" placeholder="نام کاربری" onChange={handleChange} required />

          <label>رمز</label>
          <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />

          <button type="submit">ساخت حساب</button>
        </form>
      </div>
    </div>
  )
}

export default Register
