import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>Welcome to Databricks Data Explorer</h1>
      <p>View and explore your database tables with ease.</p>
      <button
        className="view-tables-button"
        onClick={() => navigate('/tables')}
      >
        View Tables
      </button>
    </div>
  );
};

export default HomePage;