import { Recipe } from '../types';

export const calculateRecipePrice = (
  recipe: Recipe,
  ingredientPrices: Record<string, number>,
  currentQuantities: Record<string, number>
): number => {
  return recipe.ingredients.reduce((total, ingredient) => {
    const price = ingredientPrices[ingredient.name] || 0;
    const quantity = currentQuantities[ingredient.id] || ingredient.quantity;
    return total + (quantity * price);
  }, 0);
};

export const calculateSaleTotal = (
  quantitySold: number,
  pricePerUnit: number
): number => {
  return quantitySold * pricePerUnit;
};

export const calculateProfit = (
  recipe: Recipe,
  cost: number
): number => {
  return recipe.salePrice - cost;
};

export const getRecipePriceByName = (
  recipeName: string,
  recipes: Recipe[]
): number => {
  const recipe = recipes.find(r => r.name === recipeName);
  return recipe?.salePrice || 0;
};