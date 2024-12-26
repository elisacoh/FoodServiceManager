import React, { useState } from 'react';
import { RecipeTable } from './components/RecipeTable';
import { DataSection } from './components/DataSection';
import { OrdersSection } from './components/OrdersSection';
import { InventorySection } from './components/Inventory/InventorySection';
import { DashboardView } from './components/Dashboard/DashboardView';
import { Tabs } from './components/Tabs';
import { TabPanel } from './components/TabPanel';
import { Recipe, Order, Sale, Inventory } from './types';
import { useQuantities } from './hooks/useQuantities';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [ingredientPrices, setIngredientPrices] = useState<Record<string, number>>({});

  const {
    quantities,
    fixedIngredients,
    handleQuantityChange,
    handleRangeChange,
    handleToggleFixed,
    updateRecipeQuantities
  } = useQuantities(recipes.flatMap(r => r.ingredients));

  const handleAddRecipe = (recipe: Recipe) => {
    setRecipes([...recipes, recipe]);
  };

  const handleEditRecipe = (updatedRecipe: Recipe) => {
    setRecipes(recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
    // Update quantities state to match the new recipe quantities
    updateRecipeQuantities(updatedRecipe);
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  const handleSaveInventory = (newInventory: Inventory[]) => {
    setInventory([...inventory, ...newInventory]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Recipe Manager</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <TabPanel value="dashboard" activeTab={activeTab}>
            <DashboardView
              recipes={recipes}
              ingredientPrices={ingredientPrices}
              quantities={quantities}
              onUpdateRecipe={handleEditRecipe}
            />
          </TabPanel>

          <TabPanel value="recipes" activeTab={activeTab}>
            <RecipeTable
              recipes={recipes}
              orders={orders}
              ingredientPrices={ingredientPrices}
              quantities={quantities}
              fixedIngredients={fixedIngredients}
              onQuantityChange={handleQuantityChange}
              onRangeChange={handleRangeChange}
              onToggleFixed={handleToggleFixed}
              onAddRecipe={handleAddRecipe}
              onEditRecipe={handleEditRecipe}
              onDeleteRecipe={handleDeleteRecipe}
            />
          </TabPanel>

          <TabPanel value="sales" activeTab={activeTab}>
            <DataSection
              title="Sales"
              data={sales}
              columns={[
                { key: 'date', label: 'Date' },
                { key: 'recipe', label: 'Recipe' },
                { key: 'quantitySold', label: 'Quantity' },
                { key: 'pricePerUnit', label: 'Price/Unit' },
                { key: 'total', label: 'Total' },
              ]}
              fields={[
                { key: 'date', label: 'Date', type: 'date' },
                { key: 'recipe', label: 'Recipe', type: 'select', options: recipes.map(r => ({ value: r.name, label: r.name })) },
                { key: 'quantitySold', label: 'Quantity', type: 'number' },
              ]}
              onImport={setSales}
              onAdd={(data) => setSales([...sales, data])}
              onEdit={(updatedSale) => setSales(sales.map(s => s.id === updatedSale.id ? updatedSale : s))}
              onDelete={(saleToDelete) => setSales(sales.filter(s => s.id !== saleToDelete.id))}
              recipes={recipes}
            />
          </TabPanel>

          <TabPanel value="orders" activeTab={activeTab}>
            <OrdersSection
              orders={orders}
              recipes={recipes}
              sales={sales}
              inventory={inventory}
              ingredientPrices={ingredientPrices}
              onImport={setOrders}
              onAdd={(data) => setOrders([...orders, data])}
              onEdit={(updatedOrder) => setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o))}
              onDelete={(orderToDelete) => setOrders(orders.filter(o => o.id !== orderToDelete.id))}
              onUpdateIngredientPrices={setIngredientPrices}
            />
          </TabPanel>

          <TabPanel value="inventory" activeTab={activeTab}>
            <InventorySection
              recipes={recipes}
              inventory={inventory}
              onSave={handleSaveInventory}
            />
          </TabPanel>
        </div>
      </main>
    </div>
  );
}