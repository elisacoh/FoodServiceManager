import { CSVRow } from '../types';
import { Recipe } from '../../../types';

export function parseRecipeCSV(rows: CSVRow[]): Recipe[] {
  const recipes: Recipe[] = [];
  let currentRecipe: Partial<Recipe> | null = null;

  rows.forEach(row => {
    if (row.recipeName) {
      if (currentRecipe?.name && currentRecipe.ingredients?.length > 0) {
        recipes.push(currentRecipe as Recipe);
      }
      
      currentRecipe = {
        id: crypto.randomUUID(),
        name: row.recipeName,
        salePrice: parseFloat(row.salePrice) || 0,
        ingredients: []
      };
    }

    if (currentRecipe && row.ingredientName) {
      currentRecipe.ingredients.push({
        id: crypto.randomUUID(),
        name: row.ingredientName,
        quantity: parseFloat(row.quantity) || 0,
        unit: row.unit || '',
        isVariable: row.isVariable?.toLowerCase() === 'true'
      });
    }
  });

  if (currentRecipe?.name && currentRecipe.ingredients?.length > 0) {
    recipes.push(currentRecipe as Recipe);
  }

  return recipes;
}