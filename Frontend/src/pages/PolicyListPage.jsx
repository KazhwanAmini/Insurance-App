// src/pages/PolicyListPage.jsx
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import './PolicyListPage.css'
import { useTranslation,t } from 'react-i18next'
import { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';


const fetchPolicies = async () => {
  const { data } = await api.get('/policies/')
  return data
}

const fetchCustomers = async () => {
  const { data } = await api.get('/customers/')
  return data
}


export default function PolicyListPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data: policies, isLoading: loadingPolicies } = useQuery({
    queryKey: ['policies'],
    queryFn: fetchPolicies,
  })

  const { data: customers, isLoading: loadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  })

  const customer = customers?.find((c) => c.id === parseInt(id))
  const customerPolicies = policies?.filter((p) => p.customer === parseInt(id)) || []

  const { t } = useTranslation()


  const [editingPolicy, setEditingPolicy] = useState(null)
  const [editForm, setEditForm] = useState({
    policy_type: 'Car',
    start_date: '',
    end_date: '',
    payment_amount: '',
    details: '',
  })

  const [showAddModal, setShowAddModal] = useState(false)
  const [newPolicy, setNewPolicy] = useState({
    policy_type: 'Car',
    start_date: '',
    end_date: '',
    payment_amount: '',
    details: '',
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/policies/${id}/`),
    onSuccess: () => queryClient.invalidateQueries(['policies']),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/policies/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['policies'])
      setEditingPolicy(null)
    },
  })

  const addMutation = useMutation({
    mutationFn: (data) => api.post('/policies/', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['policies'])
      setShowAddModal(false)
      setNewPolicy({
        policy_type: 'Car',
        start_date: '',
        end_date: '',
        payment_amount: '',
        details: '',
      })
    },
  })

  const handleEditClick = (policy) => {
    setEditingPolicy(policy)
    setEditForm({
      policy_type: policy.policy_type,
      start_date: policy.start_date,
      end_date: policy.end_date,
      payment_amount: policy.payment_amount,
      details: policy.details,
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      deleteMutation.mutate(id)
    }
  }

  if (loadingPolicies || loadingCustomers) return <p style={{ textAlign: 'center' }}>Loading...</p>
  if (!customer) return <p style={{ textAlign: 'center' }}>Customer not found.</p>

  return (
    <div className="policy-list-page">
      <h2>{customer.full_name} {t('policy')}</h2>

      <div className="top-actions">
        <button className="add-policy-btn" onClick={() => setShowAddModal(true)}>
          ➕ {t('add_policy')}
        </button>
      </div>

      {customerPolicies.length === 0 ? (
        <p>{t('no_policy_found')}</p>
      ) : (
        <table className="policy-table">
          <thead>
            <tr>
              <th>{t('type')}</th>
              <th>{t('start_date')}</th>
              <th>{t('end_date')}</th>
              <th>{t('payment')}</th>
              <th>{t('details')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {customerPolicies.map((policy) => (
              <tr key={policy.id}>
                <td>{policy.policy_type}</td>
                <td>{policy.start_date ? new DateObject(policy.start_date).convert(persian).format("YYYY/MM/DD") : '-'}</td>
                <td>{policy.end_date ? new DateObject(policy.end_date).convert(persian).format("YYYY/MM/DD") : '-'}</td>
                <td>${policy.payment_amount}</td>
                <td>{policy.details}</td>
                <td>
                  <button onClick={() => handleEditClick(policy)}>{t('edit')}</button>
                  <button className="delete-btn" onClick={() => handleDelete(policy.id)}>{t('delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editingPolicy && (
        <div className="modal-overlay" onClick={() => setEditingPolicy(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('edit_policy')}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                updateMutation.mutate({ id: editingPolicy.id, data: { ...editForm, customer: parseInt(id) } })
              }}
              className="modal-form-grid"
            >
              <div>
                <label>{t('type')}</label>
                <select name="policy_type" value={editForm.policy_type} onChange={(e) => setEditForm({ ...editForm, policy_type: e.target.value })}>
                  <option value="Car">{t('car')}</option>
                  <option value="Life">{t('life')}</option>
                </select>
              </div>
              <div>
                <label>{t('start_date')}</label>
                <input type="date" name="start_date" value={editForm.start_date} onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })} required />
              </div>
              <div>
                <label>{t('end_date')}</label>
                <input type="date" name="end_date" value={editForm.end_date} onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })} required />
              </div>
              <div>
                <label>{t('payment')}</label>
                <input type="number" name="payment_amount" value={editForm.payment_amount} onChange={(e) => setEditForm({ ...editForm, payment_amount: e.target.value })} required />
              </div>
              <div className="full-width">
                <label>{t('details')}</label>
                <input name="details" value={editForm.details} onChange={(e) => setEditForm({ ...editForm, details: e.target.value })} />
              </div>
              <div className="modal-actions full-width">
                <button type="submit" className="edit-btn">{t('save')}</button>
                <button type="button" className="delete-btn" onClick={() => setEditingPolicy(null)}>{t('cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Policy Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Policy</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                addMutation.mutate({ ...newPolicy, customer: parseInt(id) })
              }}
              className="modal-form-grid"
            >
              <div>
                <label>{t('type')}</label>
                <select name="policy_type" value={newPolicy.policy_type} onChange={(e) => setNewPolicy({ ...newPolicy, policy_type: e.target.value })}>
                  <option value="Car">{t('car')}</option>
                  <option value="Life">{t('life')}</option>
                </select>
              </div>
              <div>
                <label>{t('start_date')}</label>
                <input type="date" name="start_date" value={newPolicy.start_date} onChange={(e) => setNewPolicy({ ...newPolicy, start_date: e.target.value })} required />
              </div>
              <div>
                <label>{t('end_date')}</label>
                <input type="date" name="end_date" value={newPolicy.end_date} onChange={(e) => setNewPolicy({ ...newPolicy, end_date: e.target.value })} required />
              </div>
              <div>
                <label>{t('payment')}</label>
                <input type="number" name="payment_amount" value={newPolicy.payment_amount} onChange={(e) => setNewPolicy({ ...newPolicy, payment_amount: e.target.value })} required />
              </div>
              <div className="full-width">
                <label>{t('details')}</label>
                <input name="details" value={newPolicy.details} onChange={(e) => setNewPolicy({ ...newPolicy, details: e.target.value })} />
              </div>
              <div className="modal-actions full-width">
                <button type="submit" className="edit-btn">{t('save')}</button>
                <button type="button" className="delete-btn" onClick={() => setShowAddModal(false)}>{t('cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
