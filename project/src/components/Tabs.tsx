import React from 'react';
import { LayoutDashboard, Book, BarChart, ClipboardList, Package } from 'lucide-react';

interface Tab {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs: Tab[] = [
  { value: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { value: 'recipes', label: 'Recipes', icon: <Book size={20} /> },
  { value: 'sales', label: 'Sales', icon: <BarChart size={20} /> },
  { value: 'orders', label: 'Orders', icon: <ClipboardList size={20} /> },
  { value: 'inventory', label: 'Inventory', icon: <Package size={20} /> },
];

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === tab.value
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}