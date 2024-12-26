import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ViewType = 'cost' | 'price' | 'profit';

interface RecipeCardViewProps {
  view: ViewType;
  cost: number;
  salePrice: number;
  profit: number;
  foodCostPercentage: number;
  onChangeView: (view: ViewType) => void;
}

export function RecipeCardView({ 
  view, 
  cost, 
  salePrice, 
  profit, 
  foodCostPercentage,
  onChangeView 
}: RecipeCardViewProps) {
  const views: ViewType[] = ['cost', 'price', 'profit'];
  const currentIndex = views.indexOf(view);

  const nextView = () => {
    const nextIndex = (currentIndex + 1) % views.length;
    onChangeView(views[nextIndex]);
  };

  const prevView = () => {
    const prevIndex = (currentIndex - 1 + views.length) % views.length;
    onChangeView(views[prevIndex]);
  };

  const getFoodCostColor = (percentage: number) => {
    if (percentage <= 30) return 'text-green-600';
    if (percentage <= 35) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center justify-between">
      <button onClick={prevView} className="text-gray-400 hover:text-gray-600">
        <ChevronLeft size={20} />
      </button>
      
      <div className="text-center">
        <div className="text-sm text-gray-500 mb-1 capitalize">{view}</div>
        {view === 'cost' && (
          <div>
            <div className="text-xl font-semibold">${cost.toFixed(2)}</div>
            <div className={`text-sm ${getFoodCostColor(foodCostPercentage)}`}>
              {foodCostPercentage.toFixed(1)}% Food Cost
            </div>
          </div>
        )}
        {view === 'price' && (
          <div>
            <div className="text-xl font-semibold">${salePrice.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Sale Price</div>
          </div>
        )}
        {view === 'profit' && (
          <div>
            <div className={`text-xl font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${profit.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Profit per Unit</div>
          </div>
        )}
      </div>

      <button onClick={nextView} className="text-gray-400 hover:text-gray-600">
        <ChevronRight size={20} />
      </button>
    </div>
  );
}