import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Recipe, Ingredient } from '../types';

interface RecipeFormProps {
  onSubmit: (recipe: Recipe) => void;
  onClose: () => void;
  initialRecipe?: Recipe;
}

export function RecipeForm({ onSubmit, onClose, initialRecipe }: RecipeFormProps) {
  const [name, setName] = useState(initialRecipe?.name || '');
  const [salePrice, setSalePrice] = useState(initialRecipe?.salePrice || 0);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialRecipe?.ingredients || []
  );

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        id: crypto.randomUUID(),
        name: '',
        quantity: 0,
        unit: '',
        isVariable: false,
      },
    ]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const handleIngredientChange = (id: string, updates: Partial<Ingredient>) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, ...updates } : ing
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialRecipe?.id || crypto.randomUUID(),
      name,
      salePrice,
      ingredients,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {initialRecipe ? 'Edit Recipe' : 'Add New Recipe'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipe Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sale Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium">Ingredients</h4>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Plus size={20} />
                Add Ingredient
              </button>
            </div>

            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) =>
                      handleIngredientChange(ingredient.id, { name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      handleIngredientChange(ingredient.id, {
                        quantity: Number(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div className="w-24">
                  <input
                    type="text"
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) =>
                      handleIngredientChange(ingredient.id, { unit: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={ingredient.isVariable}
                      onChange={(e) =>
                        handleIngredientChange(ingredient.id, {
                          isVariable: e.target.checked,
                          minQuantity: e.target.checked ? ingredient.quantity : undefined,
                          maxQuantity: e.target.checked ? ingredient.quantity * 1.5 : undefined,
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Variable</span>
                  </label>
                </div>
                {ingredient.isVariable && (
                  <>
                    <div className="w-24">
                      <input
                        type="number"
                        placeholder="Min"
                        value={ingredient.minQuantity}
                        onChange={(e) =>
                          handleIngredientChange(ingredient.id, {
                            minQuantity: Number(e.target.value),
                          })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        placeholder="Max"
                        value={ingredient.maxQuantity}
                        onChange={(e) =>
                          handleIngredientChange(ingredient.id, {
                            maxQuantity: Number(e.target.value),
                          })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialRecipe ? 'Update Recipe' : 'Add Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}