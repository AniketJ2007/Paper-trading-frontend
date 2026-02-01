import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, LineSeries } from "lightweight-charts";
import NumberInput from "./NumberInput";
import LimitOrder from "./LimitOrder";
import { useNavigate } from "react-router-dom";
type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y";

async function callApi(symbol: string, interval: string) {
  const req = {
    body: {
      symbol: symbol,
      interval: interval,
    },
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_NODE_URL}/api/v1/stock/stockdata`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("Error calling API:", error);
    return [];
  }
}
const isNSEOpen = () => {
  const now = new Date();
  const istTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  
  const day = istTime.getDay();
  if (day === 6 || day === 0) return false;

  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentMinutes = hours * 60 + minutes;
  
  const marketOpen = 9 * 60 + 15;
  const marketClose = 15 * 60 + 30;

  return currentMinutes >= marketOpen && currentMinutes <= marketClose;
};
function StockChart({ symbol, change }: { symbol: string; change: number }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const [activeRange, setActiveRange] = useState<TimeRange>("1D");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [Data, setData] = useState<any>();
  const [buy, setbuy] = useState<number>(0);
  const [sell, setsell] = useState<number>(0);
  const [actualChange, setActualChange] = useState<any>(change);
  const [message,setmessage]=useState<any>("")
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const navigate=useNavigate()
  const Buy = async () => {
    try {
      if(!isLoggedIn){
        navigate('/login')
        return
       }
       if(!isNSEOpen()){
        setmessage("Market is closed try later")
        setbuy(0)
        return
       }
       
      const response: any = await fetch(
        `${import.meta.env.VITE_NODE_URL}/api/v1/stock/buynormal`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({stock_name:symbol,quantity:buy,curr_price:Data.regularMarketPrice})
        },
      );

      if (!response.ok) throw new Error("Failed to buy");
      const data = await response.json();
      
      console.log(data.message);
      setbuy(0)
    } catch (error) {
      console.error(error);
    } 
  };
  const Sell = async () => {
    try {
      if(!isLoggedIn){
        navigate('/login')
        return
       }
      if(!isNSEOpen()){
        setmessage("Market is closed try later")
        setsell(0)
        return
       }

      const response: any = await fetch(
        `${import.meta.env.VITE_NODE_URL}/api/v1/stock/sellnormal`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({stock_name:symbol,quantity:sell,curr_price:Data.regularMarketPrice})
        },
      );

      if (!response.ok) throw new Error("Failed to sell");
      const data = await response.json();
      
      console.log(data.message);
      setsell(0)
    } catch (error:any) {
      console.error(error);
      if(error.message){
        setmessage(error.message)
      }
    } 
  };
  

  const fetcdata = async () => {
    const data = await callApi(symbol, "1D");
    setData(data.chart.meta);
    setTimeout(() => {
      console.log(loading)
    }, 3000);
    const meta = data.chart.meta;
    console.log(change);

    if (parseFloat(actualChange) === 0) {
      const currentPrice = meta.regularMarketPrice;
      const prevClose = meta.previousClose;
      console.log(currentPrice);
      console.log(prevClose);

      if (prevClose && prevClose !== 0) {
        const calculatedChange = ((currentPrice - prevClose) / prevClose) * 100;
        setActualChange(Number(calculatedChange.toFixed(2)));
      }
      console.log(actualChange);
    }
  };
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "black" },
        textColor: "#ffffff",
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: "#444444" },
        horzLines: { color: "#444444" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#e0e0e0",
      },
      rightPriceScale: {
        borderColor: "#e0e0e0",
        textColor: "#ffffff",
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: parseFloat(actualChange) > 0 ? "#00FF00" : "#FF0000",
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = lineSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    fetcdata();
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!seriesRef.current) return;

      setLoading(true);
      setError(null);

      try {
        const data = await callApi(symbol, activeRange);
        seriesRef.current.setData(data.data);
        chartRef.current?.timeScale().fitContent();
      } catch (err) {
        setError("Failed to load chart data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
        console.log(Data);
      }
    };

    fetchData();
  }, [activeRange, symbol]);

  const ranges: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y"];

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`text-3xl ml-10 ${Number(actualChange) > 0 ? "text-green-500" : "text-red-500"}`}
      >
        {symbol?.toLocaleUpperCase()} {actualChange + "%"}
      </div>
      <div className="bg-black rounded-lg shadow-lg p-6">
        <div className="flex gap-2 mb-4">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {range}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-white text-center py-8">
            Loading chart data...
          </div>
        )}

        {error && <div className="text-red-500 text-center py-8">{error}</div>}

        <div ref={chartContainerRef} />
      </div>
      {!loading && (
        <div className="flex flex-col gap-7 mb-5">
          <div className="flex justify-between text-2xl text-white ml-15 mr-15 border-white">
            <div className="bg-gray-950 p-4 rounded-xl shadow-md hover:bg-gray-750 border border-gray-700 w-140 text-center">Company Name:{Data.longName}</div>
            <div className="bg-gray-950 p-4 rounded-xl shadow-md hover:bg-gray-750 border border-gray-700 w-140 text-center">Previous Close:{Data.previousClose}</div>
          </div>
          <div className="flex justify-between text-2xl text-white ml-15 mr-15 border-white">
            <div className="bg-gray-950 p-4 rounded-xl shadow-md hover:bg-gray-750 border border-gray-700 w-140 text-center">Daily High:{Data.regularMarketDayHigh}</div>
            <div className="bg-gray-950 p-4 rounded-xl shadow-md hover:bg-gray-750 border border-gray-700 w-140 text-center">Daily Low:{Data.regularMarketDayLow}</div>
          </div>
          <div className="flex justify-between text-2xl text-white ml-15 mr-15">
            <div className="bg-gray-950 p-4 rounded-xl shadow-md hover:bg-gray-750 border border-gray-700 w-140 text-center">Yearly High:{Data.fiftyTwoWeekHigh}</div>
            <div className="bg-gray-950 p-4 rounded-xl shadow-md hover:bg-gray-750 border border-gray-700 w-140 text-center">Yearly Low:{Data.fiftyTwoWeekLow}</div>
          </div>
          <div className="flex justify-between text-2xl text-white ml-15 mr-15">
            <div className="bg-gray-950 p-4 rounded-xl shadow-md hover:bg-gray-750 border border-gray-700 w-140 text-center">Volume:{Data.regularMarketVolume}</div>
            <div className="bg-gray-950 p-4 rounded-xl shadow-md hover:bg-gray-750 border border-gray-700 w-140 text-center">Exchange:{Data.exchangeName}</div>
          </div>
          <div className="flex justify-between text-2xl text-white ml-15 mr-15">
            <div className="flex items-center justify-center gap-4 p-4 rounded-xl shadow-md border-gray-700 w-140 text-center">
              <NumberInput value={buy} min={0} max={50} onChange={setbuy} />
              <button
                className="hover:bg-green-600 rounded-lg p-3"
                  onClick={Buy}
              >
                Buy
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 p-4 rounded-xl shadow-md border-gray-700 w-140 text-center">
              <NumberInput value={sell} min={0} max={50} onChange={setsell} />
              <button
                className="hover:bg-red-600 rounded-lg p-3"
                    onClick={Sell}
              >
                Sell
              </button>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <LimitOrder symbol={symbol} currentPrice={Data.regularMarketPrice}/>
          </div>
          <div className="text-center text-2xl text-red-600">
            {message}
          </div>
        </div>
      )}
    </div>
  );
}

export default StockChart;
