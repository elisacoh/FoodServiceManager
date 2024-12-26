import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Inventory } from '../../types';

interface AddInventoryModalProps {
  ingredients: string[];
  onSubmit: (data: Inventory[]) => void;
  onClose: () => void;
}

export function AddInventoryModal({ ingredients, onSubmit, onClose }: AddInventoryModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inventoryData = ingredients.map(ingredient => ({
      date,
      ingredient,
      stockRemaining: quantities[ingredient] || 0
    }));
    onSubmit(inventoryData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Inventory</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Ingredients</h4>
            {ingredients.map((ingredient) => (
              <div key={ingredient} className="flex items-center gap-4">
                <span className="text-sm text-gray-700 w-48">{ingredient}</span>
                <input
                  type="number"
                  min="0"
                  value={quantities[ingredient] || ''}
                  onChange={(e) => setQuantities(prev => ({
                    ...prev,
                    [ingredient]: parseFloat(e.target.value) || 0
                  }))}
                  className="w-24 px-2 py-1 border rounded"
                  placeholder="0"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
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
              Save Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}