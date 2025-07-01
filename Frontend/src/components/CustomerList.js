import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api';

const fetchCustomers = async () => {
  const { data } = await api.get('customers/');
  return data;
};

export default function CustomerList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading customers</p>;
  // if (!data || data.length === 0) return <p>No customers found.</p>;

  return (
    <div>
      <h2>Your Customers</h2>
      {data.map(c => (
        <div key={c.id} className="card">
         <p><strong>Name:</strong> {c.full_name}</p>
          <p><strong>Phone:</strong> {c.phone}</p>
          <p><strong>National ID:</strong> {c.national_id}</p>
          <p><strong>Birth Date :</strong> {c.birth_date}</p>
        </div>
      ))}
      <Link to="/add-customer">➕ Add Customer</Link>
      <Link to="/add-policy">➕ Add Policy</Link>
    </div>
  );
}
