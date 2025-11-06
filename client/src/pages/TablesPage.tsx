import React, { useState } from 'react';
import SQLTable from '../components/SQLTable';

const TablesPage: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // List of available tables
  const tables = [
    { name: 'employees', query: 'SELECT * FROM workspace.demo_db.employees' },
    { name: 'departments', query: 'SELECT * FROM workspace.demo_db.department' },

    // Add more tables as needed
  ];

  return (
    <div className="tables-page">
      <h1>Database Tables</h1>
      
      <div className="table-buttons" style={{ marginBottom: '20px' }}>
        {tables.map((table) => (
          <button
            key={table.name}
            onClick={() => setSelectedTable(table.name)}
            style={{
              margin: '0 10px 10px 0',
              padding: '8px 16px',
              backgroundColor: selectedTable === table.name ? '#007bff' : '#f8f9fa',
              color: selectedTable === table.name ? 'white' : 'black',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {table.name}
          </button>
        ))}
      </div>

      {selectedTable && (
        <div className="table-container">
          <h2>{selectedTable}</h2>
          <SQLTable
            query={tables.find(t => t.name === selectedTable)?.query || ''}
            title={selectedTable?.charAt(0).toUpperCase() + selectedTable?.slice(1)}
            pageSize={10}
            autoExecute={true}
          />
        </div>
      )}
    </div>
  );
};

export default TablesPage;