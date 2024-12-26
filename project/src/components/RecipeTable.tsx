import React, { useState } from 'react';
import { Recipe, Order } from '../types';
import { RecipeForm } from './RecipeForm';
import { RecipeList } from './RecipeList';
import { RecipeImport } from './Recipe/RecipeImport';
import { Plus } from 'lucide-react';

interface RecipeTableProps {
  recipes: Recipe[];
  orders: Order[];
  ingredientPrices: Record<string, number>;
  quantities: Record<string, { min: number; max: number; current: number }>;
  fixedIngredients: Record<string, boolean>;
  onQuantityChange: (id: string, value: number) => void;
  onRangeChange: (id: string, min: number, max: number) => void;
  onToggleFixed: (id: string, isFixed: boolean) => void;
  onAddRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
}

export function RecipeTable({ 
  recipes, 
  orders,
  ingredientPrices,
  quantities,
  fixedIngredients,
  onQuantityChange,
  onRangeChange,
  onToggleFixed,
  onAddRecipe, 
  onEditRecipe, 
  onDeleteRecipe,
}: RecipeTableProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe>();

  const handleImportRecipes = (importedRecipes: Recipe[]) => {
    importedRecipes.forEach(recipe => {
      onAddRecipe(recipe);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recipes</h2>
        <div className="flex gap-2">
          <RecipeImport onImport={handleImportRecipes} />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Recipe
          </button>
        </div>
      </div>

      <RecipeList
        recipes={recipes}
        quantities={quantities}
        fixedIngredients={fixedIngredients}
        ingredientPrices={ingredientPrices}
        onQuantityChange={onQuantityChange}
        onRangeChange={onRangeChange}
        onToggleFixed={onToggleFixed}
        onEdit={(recipe) => {
          setEditingRecipe(recipe);
          setShowForm(true);
        }}
        onDelete={onDeleteRecipe}
      />

      {showForm && (
        <RecipeForm
          onSubmit={(recipe) => {
            if (editingRecipe) {
              onEditRecipe(recipe);
            } else {
              onAddRecipe(recipe);
            }
            setShowForm(false);
            setEditingRecipe(undefined);
          }}
          onClose={() => {
            setShowForm(false);
            setEditingRecipe(undefined);
          }}
          initialRecipe={editingRecipe}
        />
      )}
    </div>
  );
}