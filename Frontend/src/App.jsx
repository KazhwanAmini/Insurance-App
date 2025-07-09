  // src/App.js
  import React from 'react';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import Header from './components/Header';
  import Home from './pages/Home';
  import Login from './pages/Login';
  import Register from './pages/Register';
  import Dashboard from './pages/Dashboard';
  import Companies from './pages/Companies';
  import Customers from './pages/Customers';
  import NewCustomer from './pages/NewCustomer';
  import NewPolicy from './pages/NewPolicy';
  import PolicyListPage from './pages/PolicyListPage'

  function App() {
    return (
      <Router>  
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/add-customer" element={<NewCustomer />} />
          <Route path="/add-policy" element={<NewPolicy />} />
          <Route path="/policies/:id" element={<PolicyListPage />} />
        </Routes>
      </Router>
    );
  }

  export default App;
