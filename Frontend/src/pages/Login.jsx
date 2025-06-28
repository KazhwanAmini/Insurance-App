import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('token/', credentials);
    localStorage.setItem('access', res.data.access);
    localStorage.setItem('refresh', res.data.refresh);

    const userRes = await api.get('me/');
    const isSuperuser = userRes.data.is_superuser;

    if (isSuperuser) {
      navigate('/companies');
    } else {
      navigate('/customers');
    }
  } catch (err) {
    alert('Invalid credentials');
  }
};

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
