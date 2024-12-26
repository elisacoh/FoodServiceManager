// src/services/CalculationService.ts
import { Recipe, Sale, Order, Inventory } from '../types';
import { IngredientCalculation, CalculationOptions } from './types';
import { addDays, subDays, isWithinInterval } from 'date-fns';

export class CalculationService {
  constructor(
    private recipes: Recipe[],
    private sales: Sale[],
    private orders: Order[],
    private inventory: Inventory[]
  ) {}

  /**
   * Calculate suggested quantities for all ingredients
   * @param options Calculation options
   * @returns Array of calculations for each ingredient
   */
  calculateIngredientQuantities(options: CalculationOptions): IngredientCalculation[] {
    // Get unique ingredients from recipes
    const ingredients = this.getUniqueIngredients();
    
    return ingredients.map(ingredient => {
      // Get historical usage
      const historicalUsage = this.calculateHistoricalUsage(ingredient.name, options);
      
      // Get current stock
      const currentStock = this.getCurrentStock(ingredient.name);
      
      // Calculate projected usage
      const projectedUsage = this.calculateProjectedUsage(
        ingredient.name,
        historicalUsage,
        options
      );

      // Calculate suggested quantity
      const suggested = this.calculateSuggestedQuantity(
        currentStock,
        projectedUsage,
        options
      );

      return {
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        currentQuantity: currentStock,
        suggestedQuantity: suggested.quantity,
        minRequired: suggested.min,
        maxAllowed: suggested.max,
        reason: suggested.reason
      };
    });
  }

  // Add your calculation methods here
  private calculateHistoricalUsage(
    ingredientName: string,
    options: CalculationOptions
  ): number {
    // TODO: Implement your historical usage calculation
    // This should analyze past sales and ingredient usage
    return 0;
  }

  private calculateProjectedUsage(
    ingredientName: string,
    historicalUsage: number,
    options: CalculationOptions
  ): number {
    // TODO: Implement your projected usage calculation
    // This should consider trends and seasonality
    return 0;
  }

  private calculateSuggestedQuantity(
    currentStock: number,
    projectedUsage: number,
    options: CalculationOptions
  ): {
    quantity: number;
    min: number;
    max: number;
    reason: string;
  } {
    // TODO: Implement your quantity suggestion logic
    // This should balance stock levels and projected needs
    return {
      quantity: 0,
      min: 0,
      max: 0,
      reason: 'Calculation pending'
    };
  }

  private getCurrentStock(ingredientName: string): number {
    // Get most recent inventory entry
    const latestInventory = this.inventory
      .filter(inv => inv.ingredient === ingredientName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return latestInventory?.stockRemaining || 0;
  }

  private getUniqueIngredients(): Array<{ id: string; name: string }> {
    const ingredients = new Map<string, { id: string; name: string }>();
    
    this.recipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        if (!ingredients.has(ing.name)) {
          ingredients.set(ing.name, { id: ing.id, name: ing.name });
        }
      });
    });

    return Array.from(ingredients.values());
  }
}
