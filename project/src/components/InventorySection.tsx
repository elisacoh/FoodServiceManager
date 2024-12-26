import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Recipe, Inventory } from '../types';
import { InventoryModal } from './Inventory/InventoryModal';
import { InventoryTable } from './Inventory/InventoryTable';

interface InventorySectionProps {
  recipes: Recipe[];
  inventory: Inventory[];
  onSave: (inventoryData: Inventory[]) => void;
}

export function InventorySection({ recipes, inventory, onSave }: InventorySectionProps) {
  const [showModal, setShowModal] = useState(false);
  
  const ingredients = Array.from(
    new Set(recipes.flatMap(r => r.ingredients.map(i => i.name)))
  ).sort();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Inventory
        </button>
      </div>

      <InventoryTable inventory={inventory} />

      {showModal && (
        <InventoryModal
          ingredients={ingredients}
          onSubmit={onSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}