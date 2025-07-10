import React, { useState } from 'react'
import axios from '../api'
import { useNavigate } from 'react-router-dom'
import './NewCustomer.css'
import { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import DatePicker from "react-multi-date-picker"
import persian_fa from "react-date-object/locales/persian_fa"

const NewCustomer = () => {
  const [form, setForm] = useState({
    full_name: '',
    national_id: '',
    address: '',
    phone: '',
    birth_date: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (change) => {
    if (change.target) {
      const { name, value } = change.target
      setForm(prev => ({ ...prev, [name]: value }))
    } else {
      setForm(prev => ({ ...prev, birth_date: change }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const date = new Date(form.birth_date);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    try {
      await axios.post('/customers/', {
        ...form,
        birth_date: formattedDate
      })
      alert('✅ مشتری با موفقیت ثبت شد!')
      navigate('/customers')
    } catch (err) {
      console.error(err)
      alert('❌ خطا در ثبت مشتری. لطفاً دوباره تلاش کنید.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/customers')
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>اضافه کردن مشتری جدید</h2>
        <form onSubmit={handleSubmit}>
          <input 
            name="full_name" 
            placeholder="نام و نام خانوادگی" 
            onChange={handleChange} 
            required 
          />
          <input 
            name="national_id" 
            placeholder="کد ملی" 
            onChange={handleChange} 
            required 
            maxLength="10"
            pattern="\d{10}"
            title="کد ملی باید 10 رقم باشد"
          />
          <input 
            name="address" 
            placeholder="آدرس" 
            onChange={handleChange} 
            required 
          />
          <input 
            name="phone" 
            placeholder="شماره تماس" 
            onChange={handleChange} 
            required 
            pattern="09\d{9}"
            title="شماره تماس باید با 09 شروع شده و 11 رقم باشد"
          />
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            calendarPosition="top-left"
            placeholder='تاریخ تولد'
            name="birth_date"
            value={form.birth_date}
            format="YYYY/MM/DD"
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'در حال ثبت...' : 'ثبت مشتری'}
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={handleCancel}
          >
            انصراف
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewCustomer