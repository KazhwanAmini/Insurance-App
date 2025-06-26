// src/App.js
import React from 'react';
import CompanyList from './components/CompanyList';
import './App.css';

function App() {
  return (
    <div className="container">
      <h1>Insurance Agent Dashboard</h1>
      <CompanyList />
    </div>
  );
}

export default App;
