import React, { useRef, useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Recipe } from '../../types';
import { importCSVFiles } from '../../utils/csv/importer';
import { ImportResult } from '../../utils/csv/types';
import { parseRecipeCSV } from '../../utils/csv/parsers/recipeParser';

interface RecipeImportProps {
  onImport: (recipes: Recipe[]) => void;
}

export function RecipeImport({ onImport }: RecipeImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<ImportResult[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setImportStatus([]); // Reset status

    const recipes = await importCSVFiles(
      files,
      parseRecipeCSV,
      (result) => setImportStatus(prev => [...prev, result])
    );
    
    if (recipes.length > 0) {
      onImport(recipes);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }

    // Clear status after 5 seconds
    setTimeout(() => setImportStatus([]), 5000);
  };

  return (
    <div>
      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-md flex items-center gap-2">
        <Upload size={20} />
        Import Recipes
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

      {/* Import Status */}
      {importStatus.length > 0 && (
        <div className="absolute mt-2 space-y-2">
          {importStatus.map((status, index) => (
            <div 
              key={index}
              className={`flex items-center gap-2 text-sm ${
                status.success ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status.success ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{status.fileName}: {status.success ? 'Imported successfully' : status.error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}