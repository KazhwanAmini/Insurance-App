// src/pages/NewCustomer.jsx
import React, { useState } from 'react'
import axios from '../api'
import { useNavigate } from 'react-router-dom'
import './NewCustomer.css'

const NewCustomer = () => {
  const [form, setForm] = useState({
    full_name: '',
    national_id: '',
    address: '',
    phone: '',
    birth_date: '',
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/customers/', form)
      alert('✅ Customer created successfully!')
      navigate('/customers')
    } catch (err) {
      console.error(err)
      alert('❌ Failed to create customer.')
    }
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Add New Customer</h2>
        <form onSubmit={handleSubmit}>
          <input name="full_name" placeholder="Full Name" onChange={handleChange} required />
          <input name="national_id" placeholder="National ID" onChange={handleChange} required />
          <input name="address" placeholder="Address" onChange={handleChange} required />
          <input name="phone" placeholder="Phone" onChange={handleChange} required />
          <input name="birth_date" type="date" onChange={handleChange} required />
          <button type="submit">Create Customer</button>
        </form>
      </div>
    </div>
  )
}

export default NewCustomer
