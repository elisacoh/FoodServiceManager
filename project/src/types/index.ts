export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  salePrice: number; // Price we sell the recipe for
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  isVariable: boolean;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface Order {
  date: string;
  ingredient: string;
  quantityOrdered: number;
  pricePerUnit: number;
  total: number;
}

export interface Sale {
  date: string;
  recipe: string;
  quantitySold: number;
  pricePerUnit: number;
  total: number;
}

export interface Inventory {
  date: string;
  ingredient: string;
  stockRemaining: number;
}