// src/components/CompanyList.js
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import './CompanyList.css'

const fetchCompanies = async () => {
  const { data } = await api.get('/companies/')
  return data
}

function CompanyList() {
  const queryClient = useQueryClient()
  const [editingCompany, setEditingCompany] = useState(null)
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone_number: '',
    service_expiration: '',
  })

  const { data, error, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/companies/${id}/`),
    onSuccess: () => queryClient.invalidateQueries(['companies']),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => await api.put(`/companies/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['companies'])
      setEditingCompany(null)
    },
  })

  const handleEditClick = (company) => {
    setEditingCompany(company)
    setForm({
      name: company.name,
      address: company.address,
      phone_number: company.phone_number,
      service_expiration: company.service_expiration,
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    updateMutation.mutate({ id: editingCompany.id, data: form })
  }

  const today = new Date()
  const sortedCompanies = [...(data || [])].sort(
    (a, b) => new Date(a.service_expiration) - new Date(b.service_expiration)
  )

  if (isLoading) return <p>Loading companies...</p>
  if (error) return <p>Error loading companies.</p>

  return (
    <div className="company-container">
      <h2 className="page-title">All Companies</h2>
      {sortedCompanies.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No companies found.</p>
      ) : (
        <table className="company-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCompanies.map((company) => {
              const isExpired = new Date(company.service_expiration) < today
              return (
                <tr key={company.id} className={isExpired ? 'expired' : 'valid'}>
                  <td>{company.name}</td>
                  <td>{company.phone_number}</td>
                  <td>{company.address}</td>
                  <td>{company.service_expiration}</td>
                  <td>
                    <button onClick={() => handleEditClick(company)}>Edit</button>
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {editingCompany && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Company</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-grid">
                <div>
                  <label>Company Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Phone Number</label>
                  <input
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    required
                  />
                </div>
                
              </div>
              <div>
                <div>
                  <label>Service Expiration</label>
                  <input
                    name="service_expiration"
                    type="date"
                    value={form.service_expiration}
                    onChange={handleChange}
                    required
                  />
                </div>
                <label>Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="edit-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => setEditingCompany(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyList
