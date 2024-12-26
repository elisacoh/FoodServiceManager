import React from 'react';
import { Inventory } from '../../types';
import { formatDate } from '../../utils/dates';

interface InventoryTableProps {
  inventory: Inventory[];
}

export function InventoryTable({ inventory }: InventoryTableProps) {
  // Sort and group inventory by date
  const sortedInventory = [...inventory].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const groupedInventory = sortedInventory.reduce((groups: Record<string, Inventory[]>, item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ingredient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(groupedInventory).map(([date, items]) => (
            <React.Fragment key={date}>
              {/* Date header row */}
              <tr className="bg-gray-50">
                <td
                  colSpan={3}
                  className="px-6 py-3 text-sm font-medium text-gray-900"
                >
                  {formatDate(date)}
                </td>
              </tr>
              {/* Inventory items for this date */}
              {items.map((item, index) => (
                <tr key={`${date}-${item.ingredient}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Empty cell since date is in header */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.ingredient}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.stockRemaining}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          {inventory.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                No inventory data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}