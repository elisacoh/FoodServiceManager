import React from 'react';
import { Download } from 'lucide-react';
import { Recipe, Order, Sale, Inventory } from '../../types';

interface SuggestedOrdersProps {
  recipes: Recipe[];
  orders: Order[];
  sales: Sale[];
  inventory: Inventory[];
}

export function SuggestedOrdersSection({ recipes, orders, sales, inventory }: SuggestedOrdersProps) {
  const handleExportCSV = () => {
    // Placeholder for suggested orders logic
    const suggestedOrders = [
      { ingredient: 'Sample Ingredient', suggestedQuantity: 100, reason: 'Low stock' }
    ];

    // Create CSV content
    const headers = ['Ingredient', 'Suggested Quantity', 'Reason'];
    const csvContent = [
      headers.join(','),
      ...suggestedOrders.map(order => 
        [order.ingredient, order.suggestedQuantity, order.reason].join(',')
      )
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suggested-orders-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Suggested Orders</h2>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <Download size={20} />
          Export Suggestions
        </button>
      </div>
      
      <div className="text-center text-gray-500 py-8">
        <p>Order suggestions will be implemented based on:</p>
        <ul className="list-disc list-inside mt-2 text-left max-w-md mx-auto">
          <li>Current inventory levels</li>
          <li>Historical sales data</li>
          <li>Upcoming recipe requirements</li>
          <li>Minimum stock thresholds</li>
        </ul>
      </div>
    </div>
  );
}