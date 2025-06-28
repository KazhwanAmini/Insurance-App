import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    company_name: '',
    address: '',
    phone: '',
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const companyRes = await api.post('companies/', {
        name: form.company_name,
        address: form.address,
        phone: form.phone,
      });

      const userRes = await api.post('users/', {
        username: form.username,
        password: form.password,
        company: companyRes.data.id,
      });

      alert('Company registered! You can now log in.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Registration failed.');
    }
  };

  return (
    <div>
      <h2>Register a Company</h2>
      <form onSubmit={handleSubmit}>
        <input name="company_name" placeholder="Company Name" onChange={handleChange} required />
        <input name="address" placeholder="Address" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
