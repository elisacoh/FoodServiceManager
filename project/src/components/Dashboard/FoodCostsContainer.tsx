import React from 'react';
import { Recipe } from '../../types';
import { calculateRecipePrice } from '../../utils/pricing';
import { FoodCostCard } from './FoodCostCard';
import { Settings } from 'lucide-react';

interface FoodCostsContainerProps {
  recipes: Recipe[];
  ingredientPrices: Record<string, number>;
  quantities: Record<string, { min: number; max: number; current: number }>;
  onUpdateRecipe?: (recipe: Recipe) => void;
}

export function FoodCostsContainer({
  recipes,
  ingredientPrices,
  quantities,
  onUpdateRecipe
}: FoodCostsContainerProps) {
  // Calculate average food cost
  const averageFoodCost = recipes.length > 0
    ? recipes.reduce((sum, recipe) => {
        const currentQuantities = Object.fromEntries(
          recipe.ingredients.map(ing => [
            ing.id,
            quantities[ing.id]?.current ?? ing.quantity
          ])
        );
        const cost = calculateRecipePrice(recipe, ingredientPrices, currentQuantities);
        return sum + (cost / recipe.salePrice) * 100;
      }, 0) / recipes.length
    : 0;

  // Calculate general food cost (weighted average based on sales volume)
  // This is a placeholder - you can implement your own logic
  const generalFoodCost = recipes.length > 0
    ? recipes.reduce((sum, recipe) => {
        const currentQuantities = Object.fromEntries(
          recipe.ingredients.map(ing => [
            ing.id,
            quantities[ing.id]?.current ?? ing.quantity
          ])
        );
        const cost = calculateRecipePrice(recipe, ingredientPrices, currentQuantities);
        // You can add your own weighting factor here based on sales volume
        const weight = 1; // Example: replace with actual sales volume
        return sum + (cost / recipe.salePrice * 100 * weight);
      }, 0) / recipes.length
    : 0;

  const getFoodCostColor = (percentage: number) => {
    if (percentage <= 30) return 'text-green-600';
    if (percentage <= 35) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Food Costs</h2>
        <div className="flex gap-4">
          <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${getFoodCostColor(generalFoodCost)} bg-opacity-10`}>
            <span className="font-medium">General Food Cost:</span>
            <span>{generalFoodCost.toFixed(1)}%</span>
            <button
              className="ml-2 text-gray-400 hover:text-gray-600"
              title="Configure general food cost calculation"
            >
              <Settings size={16} />
            </button>
          </div>
          <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${getFoodCostColor(averageFoodCost)} bg-opacity-10`}>
            <span className="font-medium">Average Food Cost:</span>
            <span>{averageFoodCost.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <FoodCostCard
            key={recipe.id}
            recipe={recipe}
            ingredientPrices={ingredientPrices}
            quantities={quantities}
            onUpdateRecipe={onUpdateRecipe}
          />
        ))}
      </div>
    </div>
  );
}