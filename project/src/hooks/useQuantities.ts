import { useState, useEffect } from 'react';
import { Ingredient, Recipe } from '../types';

interface QuantityState {
  min: number;
  max: number;
  current: number;
}

export function useQuantities(ingredients: Ingredient[]) {
  const [quantities, setQuantities] = useState<Record<string, QuantityState>>({});
  const [fixedIngredients, setFixedIngredients] = useState<Record<string, boolean>>({});

  // Initialize or update quantities when ingredients change
  useEffect(() => {
    const newQuantities: Record<string, QuantityState> = {};
    ingredients.forEach(ing => {
      if (!quantities[ing.id]) {
        newQuantities[ing.id] = {
          min: ing.minQuantity || ing.quantity * 0.8,
          max: ing.maxQuantity || ing.quantity * 1.2,
          current: ing.quantity
        };
      }
    });
    
    if (Object.keys(newQuantities).length > 0) {
      setQuantities(prev => ({ ...prev, ...newQuantities }));
    }
  }, [ingredients]);

  const handleQuantityChange = (id: string, value: number) => {
    setQuantities(prev => {
      const current = prev[id];
      if (!current) return prev;
      
      return {
        ...prev,
        [id]: {
          ...current,
          current: Math.min(Math.max(value, current.min), current.max)
        }
      };
    });
  };

  const handleRangeChange = (id: string, min: number, max: number) => {
    setQuantities(prev => {
      const current = prev[id];
      if (!current) return prev;

      const newMin = Math.max(0, min);
      const newMax = Math.max(newMin, max);
      
      return {
        ...prev,
        [id]: {
          min: newMin,
          max: newMax,
          current: Math.min(Math.max(current.current, newMin), newMax)
        }
      };
    });
  };

  const handleToggleFixed = (id: string, isFixed: boolean) => {
    setFixedIngredients(prev => ({ ...prev, [id]: isFixed }));
  };

  const updateRecipeQuantities = (recipe: Recipe) => {
    const updatedQuantities = { ...quantities };
    recipe.ingredients.forEach(ingredient => {
      updatedQuantities[ingredient.id] = {
        min: ingredient.minQuantity || ingredient.quantity * 0.8,
        max: ingredient.maxQuantity || ingredient.quantity * 1.2,
        current: ingredient.quantity
      };
    });
    setQuantities(updatedQuantities);
  };

  return {
    quantities,
    fixedIngredients,
    handleQuantityChange,
    handleRangeChange,
    handleToggleFixed,
    updateRecipeQuantities
  };
}