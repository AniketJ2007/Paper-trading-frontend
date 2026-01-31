import React from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1 
}) => {

  const handleDecrease = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleIncrease = () => {
    const newValue = value + step;
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= min && val <= max) {
      onChange(val);
    }
  };

  return (

  <div className="flex items-center w-72 h-16 bg-slate-900 rounded-full overflow-hidden select-none">
    
    <button className="h-full w-20 flex items-center justify-center bg-slate-100 text-slate-400 hover:bg-slate-800 
      hover:text-white transition-colors"
       onClick={handleDecrease}
      >
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
      </svg>
    </button>

    <div className="flex-1 flex items-center justify-center">
        <input 
          type="number"
          value={value}
          onChange={handleChange}
          className="w-full bg-transparent text-center text-3xl font-mono text-emerald-400 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

    <button className="h-full w-20 flex items-center justify-center bg-slate-100 
      text-slate-900 transition-colors hover:bg-slate-800"
       onClick={handleIncrease}
      >
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>

  </div>

  );
};

export default NumberInput;