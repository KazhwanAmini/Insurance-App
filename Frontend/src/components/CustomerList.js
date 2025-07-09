import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import './CustomerList.css'
import { useTranslation } from 'react-i18next';
import { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import {DateTimeInput, DateTimeInputSimple, DateInput, DateInputSimple} from 'react-hichestan-datetimepicker';

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
  const navigate = useNavigate()
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    national_id: '',
    birth_date: '',
    address: '',
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    updateMutation.mutate({ id: editingCustomer.id, data: form })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteMutation.mutate(id)
    }
  }

const { t } = useTranslation()

  const handleCloseModal = () => setEditingCustomer(null)

  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === 'Escape') handleCloseModal()
    }
    document.addEventListener('keydown', escHandler)
    return () => document.removeEventListener('keydown', escHandler)
  }, [])

  if (isLoading) return <p className="loading-text">Loading customers...</p>
  if (!customers) return <p className="empty-text">No customers found.</p>

  return (
    <div className="customer-list-container">
      <div className="customer-header">
        <h2>{t('your_customers')}</h2>
        <button className="add-button" onClick={() => navigate('/add-customer')}>
          ➕ {t('add_customer')}
        </button>
      </div>

      <div className="customer-cards">
        {customers.map((c) => {
          const customerPolicies = policies?.filter(p => p.customer === c.id) || []
          return (
            <div key={c.id} className="customer-card">
              <p><strong>{t('name')} :</strong> {c.full_name}</p>
              <p><strong>{t('phone')} :</strong> {c.phone}</p>
              <p><strong>{t('national_id')} :</strong> {c.national_id}</p>
              <p><strong>{t('birth_date')}  :</strong>
                  {c.birth_date ? new DateObject(c.birth_date).convert(persian).format("YYYY/MM/DD") : '-'}</p>
              <p><strong>{t('address')} :</strong> {c.address}</p>
              <p><strong>{t('policy_count')} :</strong> {customerPolicies.length}</p>

              <div className="customer-actions">
                <button className="view-policy-button" onClick={() => navigate(`/policies/${c.id}`)}>
                  📄 {t('view_policies')}
                </button>
                <button className="edit-button" onClick={() => handleEditClick(c)}>
                  ✏️ {t('edit')}
                </button>
                <button className="delete-button" onClick={() => handleDelete(c.id)}>
                  🗑️ {t('delete')}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {editingCustomer && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Customer</h3>
            <form onSubmit={handleUpdate} className="modal-form-grid">
              <div>
                <label>{t('full_name')}</label>
                <input name="full_name" value={form.full_name} onChange={handleChange} required />
              </div>
              <div>
                <label>{t('phone')}</label>
                <input name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div>
                <label>{t('national_id')}</label>
                <input name="national_id" value={form.national_id} onChange={handleChange} required />
              </div>
              <div>
                <label>{t('birth_date')}</label>
                <DateTimeInput value={form.birth_date} name={'birth_date'} onChange={handleChange} />                
                {/* <input name="birth_date" type="date" value={form.birth_date} onChange={handleChange} required /> */}
              </div>
              <div className="full-width">
                <label>{t('add_customer')}</label>
                <input name="address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="modal-actions full-width">
                <button type="submit" className="edit-btn" disabled={updateMutation.isLoading}>
                   {t('save')}
                </button>
                <button type="button" className="delete-btn" onClick={handleCloseModal}>
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
