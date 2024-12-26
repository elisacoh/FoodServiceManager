import { Recipe, Inventory } from '../types';

export const getUniqueIngredients = (recipes: Recipe[]): string[] => {
  return Array.from(
    new Set(recipes.flatMap(r => r.ingredients.map(i => i.name)))
  ).sort();
};

export const getExistingInventory = (
  inventory: Inventory[],
  date: string
): Inventory[] => {
  return inventory.filter(inv => inv.date === date);
};