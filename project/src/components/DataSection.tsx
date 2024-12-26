import React, { useState } from 'react';
import { DataTable } from './DataTable';
import { AddDataModal } from './AddDataModal';
import { Column, Field } from '../types/components';
import { calculateSaleTotal, getRecipePriceByName } from '../utils/pricing';
import { Recipe } from '../types';

interface DataSectionProps {
  title: string;
  data: any[];
  columns: Column[];
  fields: Field[];
  onImport: (data: any[]) => void;
  onAdd: (data: any) => void;
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
  ingredientPrices?: Record<string, number>;
  recipes?: Recipe[];
}

export function DataSection({ 
  title, 
  data, 
  columns, 
  fields, 
  onImport, 
  onAdd,
  onEdit,
  onDelete,
  ingredientPrices = {},
  recipes = []
}: DataSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const processFormData = (formData: any) => {
    const processedData = { ...formData };

    if (title === 'Orders') {
      const price = ingredientPrices[formData.ingredient] || 0;
      processedData.pricePerUnit = price;
      processedData.total = formData.quantityOrdered * price;
    } else if (title === 'Sales') {
      const pricePerUnit = getRecipePriceByName(formData.recipe, recipes);
      processedData.pricePerUnit = pricePerUnit;
      processedData.total = calculateSaleTotal(
        Number(formData.quantitySold),
        pricePerUnit
      );
    }

    // Ensure numeric fields are properly converted
    ['quantityOrdered', 'quantitySold', 'pricePerUnit', 'stockRemaining'].forEach(field => {
      if (field in processedData) {
        processedData[field] = Number(processedData[field]);
      }
    });

    return processedData;
  };

  const handleSubmit = (formData: any) => {
    const processedData = processFormData(formData);
    
    if (editingItem) {
      onEdit({ ...editingItem, ...processedData });
    } else {
      onAdd(processedData);
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: any) => {
    if (confirm('Are you sure you want to delete this item?')) {
      onDelete(item);
    }
  };

  // Filter out price/unit field for sales and orders since it's derived
  const filteredFields = fields.filter(f => {
    if (title === 'Sales' && f.key === 'pricePerUnit') return false;
    if (title === 'Orders' && f.key === 'pricePerUnit') return false;
    return true;
  });

  return (
    <>
      <DataTable
        title={title}
        data={data}
        columns={columns}
        onImport={onImport}
        onAdd={() => {
          setEditingItem(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {isModalOpen && (
        <AddDataModal
          title={editingItem ? `Edit ${title}` : `Add ${title}`}
          fields={filteredFields}
          initialData={editingItem}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </>
  );
}