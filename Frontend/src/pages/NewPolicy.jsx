import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

const NewPolicy = () => {
  const [form, setForm] = useState({
    customer: '',
    policy_type: '',
    start_date: '',
    end_date: '',
    description: '',
    amount_paid: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { t } = useTranslation()

  return (
    <div>
      <h2>Add New Policy</h2>
      <form>
        <input name="customer" placeholder="Customer ID" onChange={handleChange} required />
        <input name="policy_type" placeholder="Policy Type" onChange={handleChange} required />
        <input name="start_date" type="date" onChange={handleChange} required />
        <input name="end_date" type="date" onChange={handleChange} required />
        <input name="description" placeholder="Description" onChange={handleChange} required />
        <input name="amount_paid" placeholder="Amount Paid" onChange={handleChange} required />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default NewPolicy;
