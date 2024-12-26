import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Ingredient } from '../types';

interface IngredientPriceManagerProps {
  ingredients: string[];
  currentPrices: Record<string, number>;
  onUpdatePrices: (prices: Record<string, number>) => void;
  onClose: () => void;
}

export function IngredientPriceManager({ 
  ingredients, 
  currentPrices, 
  onUpdatePrices, 
  onClose 
}: IngredientPriceManagerProps) {
  const [prices, setPrices] = useState<Record<string, number>>(currentPrices);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePrices(prices);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Manage Ingredient Prices</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {ingredients.map((ingredient) => (
                <div key={ingredient} className="flex items-center gap-4">
                  <label className="flex-1 text-sm font-medium text-gray-700">
                    {ingredient}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={prices[ingredient] || 0}
                      onChange={(e) => setPrices({
                        ...prices,
                        [ingredient]: parseFloat(e.target.value)
                      })}
                      className="w-24 border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
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
              Save Prices
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}