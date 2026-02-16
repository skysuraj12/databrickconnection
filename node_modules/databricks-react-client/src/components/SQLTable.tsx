import React, { useEffect, useState } from 'react';
import { runSQL } from '../api';
import DownloadButton from './DownloadButton';
import '../styles/SQLTable.css';

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
    <div className="sql-table">
      {title && <h2>{title}</h2>}
      
      {!autoExecute && (
        <button 
          onClick={executeQuery}
          className="execute-button"
          disabled={loading}
        >
          Execute Query
        </button>
      )}

      {loading && <div className="loading-message">Loading...</div>}
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <DownloadButton 
              data={data}
              filename={`${title || 'table-data'}-${new Date().toISOString().split('T')[0]}`}
            />
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map(column => (
                    <th key={column.key}>
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map(column => (
                      <td key={column.key}>
                        {String(row[column.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                className="pagination-button"
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
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