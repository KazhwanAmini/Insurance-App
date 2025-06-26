// src/components/CompanyList.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';

const fetchCompanies = async () => {
  const { data } = await api.get('http://localhost:8000/api/companies/');
  return data;
};

function CompanyList() {
  const { data, error, isLoading } = useQuery({
  queryKey: ['companies'],
  queryFn: fetchCompanies,
});

    if (isLoading) return <p>Loading...</p>;
if (error) return <p>Error loading companies</p>;
if (!data) return <p>No data available</p>;

return (
  <div>
    <h2>Companies</h2>
    {data.map(company => (
      <div key={company.id} className="card">
        <p><strong>Name:</strong> {company.name}</p>
        <p><strong>Phone:</strong> {company.phone_number}</p>
        <p><strong>Expires:</strong> {company.service_expiration}</p>
      </div>
    ))}
  </div>
);
}

export default CompanyList;
