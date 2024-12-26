import React, { useRef, useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { importCSVFiles } from '../utils/csv/importer';
import { ImportResult } from '../utils/csv/types';
import { parseInventoryCSV } from '../utils/csv/parsers/inventoryParser';

interface DataImportProps {
  onImport: (type: 'orders' | 'sales' | 'inventory', data: any[]) => void;
}

export function DataImport({ onImport }: DataImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<ImportResult[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'orders' | 'sales' | 'inventory') => {
    const files = event.target.files;
    if (!files?.length) return;

    setImportStatus([]); // Reset status
    
    const data = await importCSVFiles(
      files,
      parseInventoryCSV,
      (result) => setImportStatus(prev => [...prev, result])
    );

    if (data.length > 0) {
      onImport(type, data);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Clear status after 5 seconds
    setTimeout(() => setImportStatus([]), 5000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {(['orders', 'sales', 'inventory'] as const).map((type) => (
          <div key={type} className="flex-1">
            <label
              htmlFor={`${type}-upload`}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500 capitalize">
                  Import {type}
                </p>
                <p className="text-xs text-gray-500">
                  Select multiple CSV files
                </p>
              </div>
              <input
                id={`${type}-upload`}
                type="file"
                accept=".csv"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e, type)}
                ref={fileInputRef}
              />
            </label>
          </div>
        ))}
      </div>

      {/* Import Status */}
      {importStatus.length > 0 && (
        <div className="space-y-2">
          {importStatus.map((status, index) => (
            <div 
              key={index}
              className={`flex items-center gap-2 text-sm ${
                status.success ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status.success ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{status.fileName}: {status.success ? 'Imported successfully' : status.error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}