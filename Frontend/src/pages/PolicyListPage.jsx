import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import './PolicyListPage.css'
import { useTranslation } from 'react-i18next'
import { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import DatePicker from "react-multi-date-picker"
import persian_fa from "react-date-object/locales/persian_fa"

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
  const { t } = useTranslation()

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

  const formatForBackend = (persianDate) => {
    if (!persianDate) return ''
    const date = new DateObject(persianDate).convert(persian, 'gregorian')
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
  }

  const parseBackendDate = (gregorianDate) => {
    if (!gregorianDate) return null
    try {
      return new DateObject(gregorianDate).convert(persian)
    } catch (e) {
      console.error("Error parsing date:", gregorianDate, e)
      return null
    }
  }

  const formatDateForDisplay = (gregorianDate) => {
    if (!gregorianDate) return '-'
    try {
      const dateObj = new DateObject(gregorianDate)
      if (isNaN(dateObj.year)) {
        const persianDate = new DateObject(gregorianDate)
        return persianDate.format("YYYY/M/D")
      }
      return dateObj.convert(persian).format("YYYY/M/D")
    } catch (e) {
      console.error("Error formatting date:", gregorianDate, e)
      return gregorianDate
    }
  }

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/policies/${id}/`),
    onSuccess: () => queryClient.invalidateQueries(['policies']),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/policies/${id}/`, {
      ...data,
      start_date: formatForBackend(data.start_date),
      end_date: formatForBackend(data.end_date)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['policies'])
      setEditingPolicy(null)
    },
  })

  const addMutation = useMutation({
    mutationFn: (data) => api.post('/policies/', {
      ...data,
      start_date: formatForBackend(data.start_date),
      end_date: formatForBackend(data.end_date),
      customer: parseInt(id)
    }),
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
      start_date: parseBackendDate(policy.start_date),
      end_date: parseBackendDate(policy.end_date),
      payment_amount: policy.payment_amount,
      details: policy.details,
    })
  }

  const handleDelete = (id) => {
    if (window.confirm(t('confirm_delete_policy'))) {
      deleteMutation.mutate(id)
    }
  }

  if (loadingPolicies || loadingCustomers) return <p style={{ textAlign: 'center' }}>{t('loading')}</p>
  if (!customer) return <p style={{ textAlign: 'center' }}>{t('customer_not_found')}</p>

  return (
    <div className="policy-list-page">
      <h2>{t('policy')} های {customer.full_name}</h2>

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
                <td>{formatDateForDisplay(policy.start_date)}</td>
                <td>{formatDateForDisplay(policy.end_date)}</td>
                <td>${policy.payment_amount}</td>
                <td>{policy.details}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(policy)}>
                    {t('edit')}
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(policy.id)}>
                    {t('delete')}
                  </button>
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
                updateMutation.mutate({ 
                  id: editingPolicy.id, 
                  data: { 
                    ...editForm, 
                    customer: parseInt(id),
                    start_date: editForm.start_date,
                    end_date: editForm.end_date
                  } 
                })
              }}
              className="modal-form-grid"
            >
              <div>
                <label>{t('type')}</label>
                <select 
                  name="policy_type" 
                  value={editForm.policy_type} 
                  onChange={(e) => setEditForm({ ...editForm, policy_type: e.target.value })}
                >
                  <option value="Car">{t('car')}</option>
                  <option value="Life">{t('life')}</option>
                </select>
              </div>
              <div>
                <label>{t('start_date')}</label>
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="top-right"
                  value={editForm.start_date}
                  onChange={(date) => setEditForm({ ...editForm, start_date: date })}
                  format="YYYY/MM/DD"
                  required
                />
              </div>
              <div>
                <label>{t('end_date')}</label>
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="top-right"
                  value={editForm.end_date}
                  onChange={(date) => setEditForm({ ...editForm, end_date: date })}
                  format="YYYY/MM/DD"
                  required
                />
              </div>
              <div>
                <label>{t('payment')}</label>
                <input 
                  type="number" 
                  name="payment_amount" 
                  value={editForm.payment_amount} 
                  onChange={(e) => setEditForm({ ...editForm, payment_amount: e.target.value })} 
                  required 
                />
              </div>
              <div className="full-width">
                <label>{t('details')}</label>
                <input 
                  name="details" 
                  value={editForm.details} 
                  onChange={(e) => setEditForm({ ...editForm, details: e.target.value })} 
                />
              </div>
              <div className="modal-actions full-width">
                <button type="submit" className="edit-btn" disabled={updateMutation.isLoading}>
                  {updateMutation.isLoading ? t('saving') : t('save')}
                </button>
                <button type="button" onClick={() => setEditingPolicy(null)}>
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
  
      {/* Add Policy Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('add_policy')}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                addMutation.mutate({ 
                  ...newPolicy, 
                  customer: parseInt(id),
                  start_date: newPolicy.start_date,
                  end_date: newPolicy.end_date
                })
              }}
              className="modal-form-grid"
            >
              <div>
                <label>{t('type')}</label>
                <select 
                  name="policy_type" 
                  value={newPolicy.policy_type} 
                  onChange={(e) => setNewPolicy({ ...newPolicy, policy_type: e.target.value })}
                >
                  <option value="Car">{t('car')}</option>
                  <option value="Life">{t('life')}</option>
                </select>
              </div>
              <div>
                <label>{t('start_date')}</label>
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="top-right"
                  value={newPolicy.start_date}
                  onChange={(date) => setNewPolicy({ ...newPolicy, start_date: date })}
                  format="YYYY/MM/DD"
                  required
                />
              </div>
              <div>
                <label>{t('end_date')}</label>
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="top-right"
                  value={newPolicy.end_date}
                  onChange={(date) => setNewPolicy({ ...newPolicy, end_date: date })}
                  format="YYYY/MM/DD"
                  required
                />
              </div>
              <div>
                <label>{t('payment')}</label>
                <input 
                  type="number" 
                  name="payment_amount" 
                  value={newPolicy.payment_amount} 
                  onChange={(e) => setNewPolicy({ ...newPolicy, payment_amount: e.target.value })} 
                  required 
                />
              </div>
              <div className="full-width">
                <label>{t('details')}</label>
                <input 
                  name="details" 
                  value={newPolicy.details} 
                  onChange={(e) => setNewPolicy({ ...newPolicy, details: e.target.value })} 
                />
              </div>
              <div className="modal-actions full-width">
                <button type="submit" className="edit-btn" disabled={addMutation.isLoading}>
                  {addMutation.isLoading ? t('saving') : t('save')}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)}>
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}