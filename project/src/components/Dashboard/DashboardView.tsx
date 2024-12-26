import React from 'react';
import { Recipe } from '../../types';
import { FoodCostsContainer } from './FoodCostsContainer';
import { LayoutGrid } from 'lucide-react';

interface DashboardViewProps {
  recipes: Recipe[];
  ingredientPrices: Record<string, number>;
  quantities: Record<string, { min: number; max: number; current: number }>;
  onUpdateRecipe: (recipe: Recipe) => void;
}

export function DashboardView({ 
  recipes, 
  ingredientPrices, 
  quantities,
  onUpdateRecipe 
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <LayoutGrid className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recipes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new recipe.
          </p>
        </div>
      ) : (
        <FoodCostsContainer
          recipes={recipes}
          ingredientPrices={ingredientPrices}
          quantities={quantities}
          onUpdateRecipe={onUpdateRecipe}
        />
      )}
    </div>
  );
}