import React, { useState } from 'react';
import { Check, Lock, Unlock } from 'lucide-react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  onMakeFixed: () => void;
  onMakeVariable: () => void;
  unit: string;
  isVariable: boolean;
}

export function Slider({ min, max, value, onChange, onMakeFixed, onMakeVariable, unit, isVariable }: SliderProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (newValue: number) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleValidate = () => {
    onMakeFixed();
  };

  return (
    <div className="flex items-center gap-4 w-96">
      <div className="flex-1">
        <input
          type="range"
          min={min}
          max={max}
          value={localValue}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-blue-200"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min} {unit}</span>
          <span>{max} {unit}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={localValue}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-20 px-2 py-1 border rounded"
          min={min}
          max={max}
        />
        <span className="text-sm text-gray-700 w-8">{unit}</span>
      </div>

      {isVariable ? (
        <button
          onClick={handleValidate}
          className="p-1 text-green-600 hover:text-green-700"
          title="Make fixed"
        >
          <Check size={20} />
        </button>
      ) : (
        <button
          onClick={onMakeVariable}
          className="p-1 text-blue-600 hover:text-blue-700"
          title="Make variable"
        >
          <Unlock size={20} />
        </button>
      )}
    </div>
  );
}