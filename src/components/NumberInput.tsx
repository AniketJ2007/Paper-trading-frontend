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
    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-32">
      <button
        type="button"
        onClick={handleDecrease}
        className="w-10 h-10 bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition flex justify-center items-center cursor-pointer"
        aria-label="Decrease value"
      >
        <span className="text-xl font-medium">−</span>
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        className="text-green-500 text-xl w-full h-10 text-center border-x border-gray-300 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none min-w-25"
      />
      <button
        type="button"
        onClick={handleIncrease}
        className="w-10 h-15 bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition flex justify-center items-center cursor-pointer"
        aria-label="Increase value"
      >
        <span className="text-xl font-medium">+</span>
      </button>
    </div>
  );
};

export default NumberInput;