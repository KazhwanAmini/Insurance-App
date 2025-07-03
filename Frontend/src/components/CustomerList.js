// src/pages/CustomerList.jsx
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../api'
import './CustomerList.css'

const fetchCustomers = async () => {
  const { data } = await api.get('customers/')
  return data
}

const fetchPolicies = async () => {
  const { data } = await api.get('policies/')
  return data
}

export default function CustomerList() {
  const queryClient = useQueryClient()
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    national_id: '',
    birth_date: '',
    address: '',
  })

  const [policyForm, setPolicyForm] = useState({
    policy_type: 'Car',
    start_date: '',
    end_date: '',
    details: '',
    payment_amount: '',
  })

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  })

  const { data: policies } = useQuery({
    queryKey: ['policies'],
    queryFn: fetchPolicies,
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`customers/${id}/`),
    onSuccess: () => queryClient.invalidateQueries(['customers']),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`customers/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers'])
      setEditingCustomer(null)
    },
  })

  const addPolicyMutation = useMutation({
    mutationFn: (data) => api.post('policies/', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['policies'])
      setShowPolicyModal(false)
      setPolicyForm({
        policy_type: 'Car',
        start_date: '',
        end_date: '',
        details: '',
        payment_amount: '',
      })
    },
  })

  const handleEditClick = (customer) => {
    setEditingCustomer(customer)
    setForm({
      full_name: customer.full_name,
      phone: customer.phone,
      national_id: customer.national_id,
      birth_date: customer.birth_date,
      address: customer.address || '',
    })
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleUpdate = (e) => {
    e.preventDefault()
    updateMutation.mutate({ id: editingCustomer.id, data: form })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteMutation.mutate(id)
    }
  }

  const handlePolicyChange = (e) =>
    setPolicyForm({ ...policyForm, [e.target.name]: e.target.value })

  const handleAddPolicy = (e) => {
    e.preventDefault()
    addPolicyMutation.mutate({ ...policyForm, customer: selectedCustomerId })
  }

  const openPolicyModal = (customerId) => {
    setSelectedCustomerId(customerId)
    setShowPolicyModal(true)
  }

  const closeModals = () => {
    setEditingCustomer(null)
    setShowPolicyModal(false)
  }

  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === 'Escape') closeModals()
    }
    document.addEventListener('keydown', escHandler)
    return () => document.removeEventListener('keydown', escHandler)
  }, [])

  if (isLoading) return <p className="loading-text">Loading customers...</p>
  if (!customers) return <p className="empty-text">No customers found.</p>

  return (
    <div className="customer-list-container">
      <div className="customer-header">
        <h2>Your Customers</h2>
        <Link className="add-button" to="/add-customer">➕ Add Customer</Link>
      </div>

      <div className="customer-cards">
        {customers.map((c) => {
          const customerPolicies = policies?.filter(p => p.customer === c.id) || []

          return (
            <div key={c.id} className="customer-card">
              <p><strong>Name:</strong> {c.full_name}</p>
              <p><strong>Phone:</strong> {c.phone}</p>
              <p><strong>National ID:</strong> {c.national_id}</p>
              <p><strong>Birth Date:</strong> {c.birth_date}</p>
              <p><strong>Address:</strong> {c.address}</p>

              <div className="customer-actions">
                <button className="policy-button" onClick={() => openPolicyModal(c.id)}>
                  ➕ Add Policy
                </button>
                <button className="edit-button" onClick={() => handleEditClick(c)}>
                  ✏️ Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(c.id)}>
                  🗑️ Delete
                </button>
              </div>

              {customerPolicies.length > 0 && (
                <div className="policy-list">
                  <p><strong>Policies:</strong></p>
                  <ul>
                    {customerPolicies.map(p => (
                      <li key={p.id}>
                        {p.policy_type} → {p.start_date} to {p.end_date} (${p.payment_amount})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Edit Modal */}
      {editingCustomer && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Customer</h3>
            <form onSubmit={handleUpdate} className="modal-form-grid">
              <div>
                <label>Full Name</label>
                <input name="full_name" value={form.full_name} onChange={handleChange} required />
              </div>
              <div>
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div>
                <label>National ID</label>
                <input name="national_id" value={form.national_id} onChange={handleChange} required />
              </div>
              <div>
                <label>Birth Date</label>
                <input name="birth_date" type="date" value={form.birth_date} onChange={handleChange} required />
              </div>
              <div className="full-width">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="modal-actions full-width">
                <button type="submit" className="edit-btn" disabled={updateMutation.isLoading}>
                  {updateMutation.isLoading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="delete-btn" onClick={closeModals}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Policy Modal */}
      {showPolicyModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Policy</h3>
            <form onSubmit={handleAddPolicy} className="modal-form-grid">
              <div>
                <label>Policy Type</label>
                <select name="policy_type" value={policyForm.policy_type} onChange={handlePolicyChange} required>
                  <option value="Car">Car</option>
                  <option value="Life">Life</option>
                </select>
              </div>
              <div>
                <label>Start Date</label>
                <input type="date" name="start_date" value={policyForm.start_date} onChange={handlePolicyChange} required />
              </div>
              <div>
                <label>End Date</label>
                <input type="date" name="end_date" value={policyForm.end_date} onChange={handlePolicyChange} required />
              </div>
              <div>
                <label>Payment ($)</label>
                <input name="payment_amount" value={policyForm.payment_amount} onChange={handlePolicyChange} required />
              </div>
              <div className="full-width">
                <label>Details</label>
                <input name="details" value={policyForm.details} onChange={handlePolicyChange} required />
              </div>
              <div className="modal-actions full-width">
                <button type="submit" className="edit-btn">
                  Save Policy
                </button>
                <button type="button" className="delete-btn" onClick={closeModals}>
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
