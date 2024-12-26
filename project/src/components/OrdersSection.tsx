import React, { useState } from 'react';
import { DataSection } from './DataSection';
import { IngredientPriceManager } from './IngredientPriceManager';
import { SuggestedOrdersSection } from './Orders/SuggestedOrdersSection';
import { Settings } from 'lucide-react';
import { Order, Recipe, Sale, Inventory } from '../types';

interface OrdersSectionProps {
  orders: Order[];
  recipes: Recipe[];
  sales: Sale[];
  inventory: Inventory[];
  ingredientPrices: Record<string, number>;
  onImport: (data: Order[]) => void;
  onAdd: (data: Order) => void;
  onEdit: (data: Order) => void;
  onDelete: (data: Order) => void;
  onUpdateIngredientPrices: (prices: Record<string, number>) => void;
}

export function OrdersSection({
  orders,
  recipes,
  sales,
  inventory,
  ingredientPrices,
  onImport,
  onAdd,
  onEdit,
  onDelete,
  onUpdateIngredientPrices
}: OrdersSectionProps) {
  const [showPriceManager, setShowPriceManager] = useState(false);
  
  const allIngredients = Array.from(
    new Set(recipes.flatMap(r => r.ingredients.map(i => i.name)))
  );

  const handleAddOrder = (data: Order) => {
    const price = ingredientPrices[data.ingredient] || 0;
    const orderWithPrice = {
      ...data,
      id: crypto.randomUUID(),
      pricePerUnit: price,
      total: data.quantityOrdered * price
    };
    onAdd(orderWithPrice);
  };

  const handleEditOrder = (data: Order) => {
    const price = ingredientPrices[data.ingredient] || 0;
    const orderWithPrice = {
      ...data,
      pricePerUnit: price,
      total: data.quantityOrdered * price
    };
    onEdit(orderWithPrice);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowPriceManager(true)}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
        >
          <Settings size={20} />
          Manage Ingredient Prices
        </button>
      </div>

      <DataSection
        title="Orders"
        data={orders}
        columns={[
          { key: 'date', label: 'Date' },
          { key: 'ingredient', label: 'Ingredient' },
          { key: 'quantityOrdered', label: 'Quantity' },
          { key: 'pricePerUnit', label: 'Price/Unit' },
          { key: 'total', label: 'Total' },
        ]}
        fields={[
          { key: 'date', label: 'Date', type: 'date' },
          { key: 'ingredient', label: 'Ingredient', type: 'select', options: allIngredients.map(name => ({ value: name, label: name })) },
          { key: 'quantityOrdered', label: 'Quantity', type: 'number' },
        ]}
        onImport={onImport}
        onAdd={handleAddOrder}
        onEdit={handleEditOrder}
        onDelete={onDelete}
        ingredientPrices={ingredientPrices}
      />

      <SuggestedOrdersSection
        recipes={recipes}
        orders={orders}
        sales={sales}
        inventory={inventory}
      />

      {showPriceManager && (
        <IngredientPriceManager
          ingredients={allIngredients}
          currentPrices={ingredientPrices}
          onUpdatePrices={onUpdateIngredientPrices}
          onClose={() => setShowPriceManager(false)}
        />
      )}
    </div>
  );
}