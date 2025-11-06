import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TablesPage from './pages/TablesPage'

export default function App() {
  return (
    <Router>
      <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
        <nav style={{ marginBottom: '20px' }}>
          <Link 
            to="/" 
            style={{ 
              marginRight: '20px',
              textDecoration: 'none',
              color: '#007bff'
            }}
          >
            Home
          </Link>
          <Link 
            to="/tables"
            style={{ 
              textDecoration: 'none',
              color: '#007bff'
            }}
          >
            Tables
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tables" element={<TablesPage />} />
        </Routes>
      </div>
    </Router>
  )}
