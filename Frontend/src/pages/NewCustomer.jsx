import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

const NewCustomer = () => {
  const [form, setForm] = useState({
    full_name: '',
    national_id: '',
    address: '',
    phone: '',
    birth_date:null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/customers/', form);
      alert('Customer created!');
      navigate('/customers');
    } catch (err) {
      console.error(err);
      alert('Error creating customer');
    }
  };

  return (
    <div>
      <h2>Add New Customer</h2>
      <form onSubmit={handleSubmit}>
        <input name="full_name" placeholder="Full Name" onChange={handleChange} required />
        <input name="national_id" placeholder="National ID" onChange={handleChange} required />
        <input name="address" placeholder="Address" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <input name="birth_date" type="date" onChange={handleChange} required />
        <button type="submit">Create</button>   
      </form>
    </div>
  );
};

export default NewCustomer;
