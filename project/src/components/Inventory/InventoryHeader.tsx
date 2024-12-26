import React from 'react';
import { format } from 'date-fns';

interface InventoryHeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onSave: () => void;
}

export function InventoryHeader({ selectedDate, onDateChange, onSave }: InventoryHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
      <div className="flex gap-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <button
          onClick={onSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Save Inventory
        </button>
      </div>
    </div>
  );
}