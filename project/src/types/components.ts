export interface Column {
  key: string;
  label: string;
}

export interface Field {
  key: string;
  label: string;
  type: string;
  options?: { value: string; label: string; }[];
}

export interface PriceManagerProps {
  ingredients: string[];
  currentPrices: Record<string, number>;
  onUpdatePrices: (prices: Record<string, number>) => void;
  onClose: () => void;
}