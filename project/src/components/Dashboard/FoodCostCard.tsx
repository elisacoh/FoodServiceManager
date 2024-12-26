import React, { useState } from 'react';
import { Recipe } from '../../types';
import { calculateRecipePrice, calculateProfit } from '../../utils/pricing';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';

interface FoodCostCardProps {
  recipe: Recipe;
  ingredientPrices: Record<string, number>;
  quantities: Record<string, { min: number; max: number; current: number }>;
  onUpdateRecipe?: (recipe: Recipe) => void;
}

export function FoodCostCard({ 
  recipe, 
  ingredientPrices, 
  quantities,
  onUpdateRecipe
}: FoodCostCardProps) {
  const [showIngredients, setShowIngredients] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, number>>({});

  // Use quantities from the recipes tab for cost calculation
  const currentQuantities = Object.fromEntries(
    recipe.ingredients.map(ingredient => [
      ingredient.id,
      quantities[ingredient.id]?.current ?? ingredient.quantity
    ])
  );
  
  const cost = calculateRecipePrice(recipe, ingredientPrices, currentQuantities);
  const profit = calculateProfit(recipe, cost);
  const foodCostPercentage = (cost / recipe.salePrice) * 100;

  // Calculate preview values when modifying ingredients
  const previewQuantities = Object.fromEntries(
    recipe.ingredients.map(ingredient => [
      ingredient.id,
      pendingChanges[ingredient.id] ?? quantities[ingredient.id]?.current ?? ingredient.quantity
    ])
  );
  const previewCost = calculateRecipePrice(recipe, ingredientPrices, previewQuantities);
  const previewProfit = calculateProfit(recipe, previewCost);
  const previewFoodCost = (previewCost / recipe.salePrice) * 100;

  const getFoodCostColor = (percentage: number) => {
    if (percentage <= 30) return 'text-green-600';
    if (percentage <= 35) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleValidateChanges = () => {
    if (!onUpdateRecipe) return;

    // Create a new recipe object with updated quantities
    const updatedRecipe: Recipe = {
      ...recipe,
      ingredients: recipe.ingredients.map(ingredient => ({
        ...ingredient,
        quantity: pendingChanges[ingredient.id] ?? quantities[ingredient.id]?.current ?? ingredient.quantity
      }))
    };

    // Call the update function with the new recipe
    onUpdateRecipe(updatedRecipe);
    
    // Clear pending changes after update
    setPendingChanges({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{recipe.name}</h3>
      
      {/* Main Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Cost</div>
          <div className="text-xl font-semibold">${cost.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Price</div>
          <div className="text-xl font-semibold">${recipe.salePrice.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Profit</div>
          <div className={`text-xl font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${profit.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Food Cost */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Food Cost</span>
          <span className={`font-medium ${getFoodCostColor(foodCostPercentage)}`}>
            {foodCostPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getFoodCostColor(foodCostPercentage)}`}
            style={{ width: `${Math.min(foodCostPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Ingredients Toggle Button */}
      <button
        onClick={() => setShowIngredients(!showIngredients)}
        className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 py-2 border-t"
      >
        {showIngredients ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        {showIngredients ? 'Hide' : 'Show'} Ingredients
      </button>

      {/* Ingredients Section */}
      {showIngredients && (
        <div className="mt-4 space-y-4">
          {recipe.ingredients.map((ingredient) => (
            <div key={ingredient.id} className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-32">
                {ingredient.name}
                <span className="text-xs text-gray-400 block">
                  ${ingredientPrices[ingredient.name] || 0}/{ingredient.unit}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={pendingChanges[ingredient.id] ?? quantities[ingredient.id]?.current ?? ingredient.quantity}
                  onChange={(e) => setPendingChanges({
                    ...pendingChanges,
                    [ingredient.id]: parseFloat(e.target.value) || 0
                  })}
                  className="w-24 px-2 py-1 border rounded"
                />
                <span className="text-sm text-gray-700 w-8">{ingredient.unit}</span>
                {pendingChanges[ingredient.id] !== undefined && (
                  <button
                    onClick={() => {
                      const newChanges = { ...pendingChanges };
                      delete newChanges[ingredient.id];
                      setPendingChanges(newChanges);
                    }}
                    className="p-1 text-red-600 hover:text-red-700"
                    title="Cancel change"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {Object.keys(pendingChanges).length > 0 && (
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Preview Food Cost:</span>
                <span className={getFoodCostColor(previewFoodCost)}>
                  {previewFoodCost.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Preview Cost:</span>
                <span>${previewCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Preview Profit:</span>
                <span className={previewProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ${previewProfit.toFixed(2)}
                </span>
              </div>
              {onUpdateRecipe && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleValidateChanges}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    <Check size={16} />
                    Update Recipe
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}