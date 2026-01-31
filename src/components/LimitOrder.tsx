import { useState } from "react";

function LimitOrder({symbol,currentPrice}:{symbol:string,currentPrice:number}) {
    const [side, setSide] = useState('BUY'); 
  const [quantity, setQuantity] = useState('');
  const [targetPrice, setTargetPrice] = useState(currentPrice || '');
    const LimitOrder = async () => {
    try {
      const response: any = await fetch(
        "http://localhost:3000/api/v1/stock/limitorder",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({stock_name:symbol,type:side,quantity:quantity,target_price:targetPrice})
        },
      );

      if (!response.ok) throw new Error("Failed to sell");
      const data = await response.json();
      
      console.log(data.message);
    } catch (error) {
      console.error(error);
    } 
  };
  

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (!quantity || !targetPrice) return;
    LimitOrder()
  };

  return (
    <div className="w-full max-w-xs p-4 bg-gray-900 text-white font-sans shadow-xl">
      <h3 className="text-lg font-semibold mb-4 text-zinc-100">Limit Order</h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex p-1 bg-zinc-800 rounded-md">
          <button
            type="button"
            onClick={() => setSide('BUY')}
            className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${
              side === 'BUY' 
                ? 'bg-emerald-500 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setSide('SELL')}
            className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${
              side === 'SELL' 
                ? 'bg-rose-500 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sell
          </button>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Quantity
          </label>
          <div className="relative">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Target Price
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>
        <button
          type="submit"
          className={`w-full mt-2 py-3 rounded-md font-bold text-sm uppercase tracking-tight transition-all active:scale-[0.98] ${
            side === 'BUY' 
              ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20' 
              : 'bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20'
          }`}
        >
          Place {side} Order
        </button>
      </form>
    </div>
  );
}

export default LimitOrder