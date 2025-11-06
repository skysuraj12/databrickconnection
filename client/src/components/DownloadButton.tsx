import React from 'react';
import * as XLSX from 'xlsx';

interface DownloadButtonProps {
  data: any[];
  filename?: string;
  sheetName?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  data,
  filename = 'table-data',
  sheetName = 'Sheet1'
}) => {
  const downloadExcel = () => {
    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Convert data to worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      
      // Generate Excel file and trigger download
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  };

  return (
    <button
      onClick={downloadExcel}
      className="download-button"
      title="Download as Excel"
    >
      Download Excel
    </button>
  );
};

export default DownloadButton;