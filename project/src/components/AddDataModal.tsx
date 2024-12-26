import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Field {
  key: string;
  label: string;
  type: string;
  options?: { value: string; label: string; }[];
}

interface AddDataModalProps {
  title: string;
  fields: Field[];
  initialData?: any;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export function AddDataModal({ title, fields, initialData, onSubmit, onClose }: AddDataModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      const initialFormData: Record<string, string> = {};
      fields.forEach(field => {
        const value = initialData[field.key];
        if (field.type === 'date' && value) {
          // Convert date to YYYY-MM-DD format for input
          const date = new Date(value);
          initialFormData[field.key] = date.toISOString().split('T')[0];
        } else {
          initialFormData[field.key] = value?.toString() || '';
        }
      });
      setFormData(initialFormData);
    }
  }, [initialData, fields]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  required
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  required
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}