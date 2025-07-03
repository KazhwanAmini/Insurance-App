// src/pages/Dashboard.jsx
import './Dashboard.css'

function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back 👋</h1>
        <p>Your insurance panel overview</p>
      </header>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Customers</h3>
          <p>48</p>
        </div>
        <div className="dashboard-card">
          <h3>Total Policies</h3>
          <p>125</p>
        </div>
        <div className="dashboard-card">
          <h3>Expiring This Week</h3>
          <p>7</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
