import React from 'react';
import { Lock, Unlock } from 'lucide-react';

interface QuantityControlProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  isFixed: boolean;
  onChange: (value: number) => void;
  onRangeChange: (min: number, max: number) => void;
  onToggleFixed: () => void;
}

export function QuantityControl({
  value,
  min,
  max,
  unit,
  isFixed,
  onChange,
  onRangeChange,
  onToggleFixed
}: QuantityControlProps) {
  const handleMinChange = (newMin: number) => {
    if (newMin >= 0 && newMin <= max) {
      onRangeChange(newMin, max);
    }
  };

  const handleMaxChange = (newMax: number) => {
    if (newMax >= min) {
      onRangeChange(min, newMax);
    }
  };

  const handleValueChange = (newValue: number) => {
    onChange(Math.min(Math.max(newValue, min), max));
  };

  return (
    <div className="flex items-center gap-4">
      {!isFixed ? (
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={min}
            min={0}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="w-20 px-2 py-1 border rounded"
            placeholder="Min"
          />
          <div className="flex flex-col items-center">
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={(e) => handleValueChange(Number(e.target.value))}
              className="w-32 h-2 rounded-lg appearance-none cursor-pointer bg-blue-200"
            />
            <span className="text-xs text-gray-500 mt-1">
              Current: {value} {unit}
            </span>
          </div>
          <input
            type="number"
            value={max}
            min={min}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="w-20 px-2 py-1 border rounded"
            placeholder="Max"
          />
        </div>
      ) : (
        <input
          type="number"
          value={value}
          min={0}
          onChange={(e) => handleValueChange(Number(e.target.value))}
          className="w-20 px-2 py-1 border rounded"
        />
      )}
      <span className="text-sm text-gray-700 w-8">{unit}</span>
      <button
        onClick={onToggleFixed}
        className="p-1 text-blue-600 hover:text-blue-700"
        title={isFixed ? "Make variable" : "Make fixed"}
      >
        {isFixed ? <Lock size={20} /> : <Unlock size={20} />}
      </button>
    </div>
  );
}