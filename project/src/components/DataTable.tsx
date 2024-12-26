import React from 'react';
import { Upload, Plus, Pencil, Trash2 } from 'lucide-react';
import { Column } from '../types/components';
import { formatDate } from '../utils/dates';

interface DataTableProps {
  title: string;
  data: any[];
  columns: Column[];
  onImport: (data: any[]) => void;
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

export function DataTable({ 
  title, 
  data, 
  columns, 
  onImport, 
  onAdd,
  onEdit,
  onDelete 
}: DataTableProps) {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const rows = text.split('\n');
    const headers = rows[0].split(',');
    
    const parsedData = rows.slice(1)
      .filter(row => row.trim())
      .map(row => {
        const values = row.split(',');
        return headers.reduce((obj: any, header, index) => {
          const value = values[index]?.trim() ?? '';
          obj[header.trim()] = value;
          return obj;
        }, {});
      });

    onImport(parsedData);
    event.target.value = '';
  };

  const formatValue = (key: string, value: any) => {
    if (typeof value === 'undefined' || value === null) return '';
    
    if (key === 'date') return new Date(value).toLocaleDateString();
    if (key === 'pricePerUnit' || key === 'total') {
      return `$${Number(value).toFixed(2)}`;
    }
    if (typeof value === 'number') return value.toString();
    return value;
  };

  // Sort data by date in descending order
  const sortedData = [...data].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group data by date
  const groupedData = sortedData.reduce((groups: Record<string, any[]>, item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-md flex items-center gap-2">
            <Upload size={20} />
            Import CSV
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Add New
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(groupedData).map(([date, items], groupIndex) => (
              <React.Fragment key={date}>
                {/* Date header row */}
                <tr className="bg-gray-50">
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-3 text-sm font-medium text-gray-900"
                  >
                    {formatDate(date)}
                  </td>
                </tr>
                {/* Data rows for this date */}
                {items.map((item, index) => (
                  <tr key={`${date}-${index}`} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatValue(column.key, item[column.key])}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}