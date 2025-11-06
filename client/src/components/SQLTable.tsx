import React, { useEffect, useState } from 'react';
import { runSQL } from '../api';

interface SQLTableProps {
  query: string;                // Required SQL query
  title?: string;              // Optional table title
  pageSize?: number;           // Optional page size (default: 10)
  autoExecute?: boolean;       // Optional auto-execute flag (default: true)
}

interface Column {
  key: string;
  label: string;
}

const SQLTable: React.FC<SQLTableProps> = ({
  query,
  title,
  pageSize = 10,
  autoExecute = true
}) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const executeQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await runSQL(query);
      setData(result.rows || []);
      
      // Extract columns from the first row
      if (result.rows && result.rows.length > 0) {
        const cols = Object.keys(result.rows[0]).map(key => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1)
        }));
        setColumns(cols);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to execute query');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoExecute) {
      executeQuery();
    }
  }, [query]); // Re-run when query changes

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div className="sql-table" style={{ margin: '20px 0' }}>
      {title && <h2>{title}</h2>}
      
      {!autoExecute && (
        <button 
          onClick={executeQuery}
          style={{
            padding: '8px 16px',
            marginBottom: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Execute Query
        </button>
      )}

      {loading && <div>Loading...</div>}
      
      {error && (
        <div style={{ color: 'red', marginBottom: '16px' }}>
          Error: {error}
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              border: '1px solid #ddd'
            }}>
              <thead>
                <tr>
                  {columns.map(column => (
                    <th key={column.key} style={{
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '2px solid #dee2e6',
                      textAlign: 'left'
                    }}>
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, rowIndex) => (
                  <tr key={rowIndex} style={{
                    backgroundColor: rowIndex % 2 === 0 ? 'white' : '#f8f9fa'
                  }}>
                    {columns.map(column => (
                      <td key={column.key} style={{
                        padding: '12px',
                        borderBottom: '1px solid #dee2e6'
                      }}>
                        {String(row[column.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ 
              marginTop: '16px',
              display: 'flex',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                style={{
                  padding: '4px 8px',
                  cursor: currentPage === 0 ? 'default' : 'pointer',
                  opacity: currentPage === 0 ? 0.5 : 1
                }}
              >
                Previous
              </button>
              <span style={{ padding: '4px 8px' }}>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                style={{
                  padding: '4px 8px',
                  cursor: currentPage === totalPages - 1 ? 'default' : 'pointer',
                  opacity: currentPage === totalPages - 1 ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SQLTable;