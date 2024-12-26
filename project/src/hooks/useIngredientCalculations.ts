// src/hooks/useIngredientCalculations.ts
import { useState, useEffect } from 'react';
import { Recipe, Sale, Order, Inventory } from '../types';
import { CalculationService } from '../services/CalculationService';
import { IngredientCalculation, CalculationOptions } from '../services/types';

export function useIngredientCalculations(
  recipes: Recipe[],
  sales: Sale[],
  orders: Order[],
  inventory: Inventory[]
) {
  const [calculations, setCalculations] = useState<IngredientCalculation[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateQuantities = async (options: CalculationOptions) => {
    setIsCalculating(true);
    try {
      const service = new CalculationService(recipes, sales, orders, inventory);
      const results = await service.calculateIngredientQuantities(options);
      setCalculations(results);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Recalculate when data changes
  useEffect(() => {
    calculateQuantities({
      startDate: subDays(new Date(), 30), // Last 30 days
      endDate: addDays(new Date(), 7),    // Next 7 days
      safetyStockDays: 7,
      minStockPercentage: 20
    });
  }, [recipes, sales, orders, inventory]);

  return {
    calculations,
    isCalculating,
    calculateQuantities
  };
}
