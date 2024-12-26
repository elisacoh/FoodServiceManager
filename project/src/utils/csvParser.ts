import { Recipe, Inventory } from '../types';

export interface CSVRow {
  [key: string]: string;
}

export function parseCSV(text: string): CSVRow[] {
  const rows = text.split('\n').filter(row => row.trim());
  const headers = rows[0].split(',').map(h => h.trim());
  
  return rows.slice(1).map(row => {
    const values = row.split(',').map(v => v.trim());
    return headers.reduce((obj: CSVRow, header, index) => {
      obj[header] = values[index] || '';
      return obj;
    }, {});
  });
}

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

export function parseInventoryCSV(rows: CSVRow[]): Inventory[] {
  return rows.map(row => ({
    date: row.date,
    ingredient: row.ingredient,
    stockRemaining: parseFloat(row.stockRemaining) || 0
  }));
}

export async function processFiles(files: FileList, parser: (rows: CSVRow[]) => any[]): Promise<any[]> {
  const allData: any[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const text = await files[i].text();
      const rows = parseCSV(text);
      const data = parser(rows);
      allData.push(...data);
    } catch (error) {
      console.error(`Error processing file ${files[i].name}:`, error);
    }
  }

  return allData;
}