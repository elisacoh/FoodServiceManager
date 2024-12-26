import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Inventory } from '../../types';
import { processFiles, parseInventoryCSV } from '../../utils/csvParser';

interface InventoryImportProps {
  onImport: (inventory: Inventory[]) => void;
}

export function InventoryImport({ onImport }: InventoryImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const inventory = await processFiles(files, parseInventoryCSV);
    
    if (inventory.length > 0) {
      onImport(inventory);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-md flex items-center gap-2">
      <Upload size={20} />
      Import Inventory
      <span className="text-xs text-gray-500">(Multiple files)</span>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
    </label>
  );
}