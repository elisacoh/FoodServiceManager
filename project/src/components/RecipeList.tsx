import React from 'react';
import { Recipe } from '../types';
import { QuantityControl } from './QuantityControl';
import { Edit, Trash2 } from 'lucide-react';
import { calculateRecipePrice, calculateProfit } from '../utils/pricing';

interface RecipeListProps {
  recipes: Recipe[];
  quantities: Record<string, { min: number; max: number; current: number; }>;
  fixedIngredients: Record<string, boolean>;
  ingredientPrices: Record<string, number>;
  onQuantityChange: (id: string, value: number) => void;
  onRangeChange: (id: string, min: number, max: number) => void;
  onToggleFixed: (id: string, isFixed: boolean) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export function RecipeList({
  recipes,
  quantities,
  fixedIngredients,
  ingredientPrices,
  onQuantityChange,
  onRangeChange,
  onToggleFixed,
  onEdit,
  onDelete
}: RecipeListProps) {
  const getIngredientQuantity = (ingredientId: string, defaultQuantity: number) => {
    return quantities[ingredientId]?.current ?? defaultQuantity;
  };

  const getIngredientRange = (ingredient: Recipe['ingredients'][0]) => {
    return quantities[ingredient.id] || {
      min: ingredient.minQuantity || ingredient.quantity * 0.8,
      max: ingredient.maxQuantity || ingredient.quantity * 1.2,
      current: ingredient.quantity
    };
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recipe Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ingredients
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cost
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sale Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {recipes.map((recipe) => {
            const currentQuantities = Object.fromEntries(
              recipe.ingredients.map(ing => [
                ing.id,
                getIngredientQuantity(ing.id, ing.quantity)
              ])
            );
            const cost = calculateRecipePrice(recipe, ingredientPrices, currentQuantities);
            const profit = calculateProfit(recipe, cost);

            return (
              <tr key={recipe.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{recipe.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-4">
                    {recipe.ingredients.map((ingredient) => {
                      const range = getIngredientRange(ingredient);
                      return (
                        <div key={ingredient.id} className="flex items-center gap-4">
                          <span className="text-sm text-gray-500 w-32">
                            {ingredient.name}
                            <span className="text-xs text-gray-400 block">
                              ${ingredientPrices[ingredient.name] || 0}/{ingredient.unit}
                            </span>
                          </span>
                          <QuantityControl
                            value={range.current}
                            min={range.min}
                            max={range.max}
                            unit={ingredient.unit}
                            isFixed={fixedIngredients[ingredient.id] ?? !ingredient.isVariable}
                            onChange={(value) => onQuantityChange(ingredient.id, value)}
                            onRangeChange={(min, max) => onRangeChange(ingredient.id, min, max)}
                            onToggleFixed={() => onToggleFixed(ingredient.id, !fixedIngredients[ingredient.id])}
                          />
                        </div>
                      );
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${cost.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${recipe.salePrice.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${profit.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(recipe)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(recipe.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}