// src/services/types.ts
export interface IngredientCalculation {
  ingredientId: string;
  ingredientName: string;
  currentQuantity: number;
  suggestedQuantity: number;
  minRequired: number;
  maxAllowed: number;
  reason: string;
}

export interface CalculationOptions {
  startDate: Date;
  endDate: Date;
  safetyStockDays: number;
  minStockPercentage: number;
}
