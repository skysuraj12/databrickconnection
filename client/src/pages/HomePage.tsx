import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Databricks Data Explorer</h1>
      <p>View and explore your database tables with ease.</p>
      
      <button
        onClick={() => navigate('/tables')}
        style={{
          padding: '12px 24px',
          fontSize: '18px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        View Tables
      </button>
    </div>
  );
};

export default HomePage;