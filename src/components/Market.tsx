import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HoldingList from "./HoldingList";
function Market() {
  const navigate = useNavigate();
  const [data, setdata] = useState<any>(null);
  const [selectedStock, setSelectedStock] = useState(null); 
  const [query, setQuery] = useState("");

  async function callApi() {
    if (!query) return;
    try {
      const resp: any = await fetch(
        `${import.meta.env.VITE_NODE_URL}/api/v1/stock/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ symbol: query || "" }),
        },
      );

      if (!resp.ok) {
        throw new Error("Failed to fetch data");
      }
      console.log(resp);

      const Data = await resp.json();
      console.log(Data.data);
      setdata(Data);
    } catch (error) {
      console.log(error);
    } 
  }
  interface SearchStock {
    exchange: string;
    shortname: string;
    quoteType: string;
    symbol: string;
    index: string;
    score: number;
    typeDisp: string;
    longname: string;
    exchDisp: string;
    sector: string;
    sectorDisp: string;
    industry: string;
    industryDisp: string;
    dispSecIndFlag: boolean;
    isYahooFinance: boolean;
  }
  let filteredStocks: any[] = [];
  useEffect(() => {
    const app = async () => {
      await callApi();
    };
    const timer = setTimeout(() => {
      app();
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  filteredStocks =
    query === ""
      ? data?.data
      : data?.data.filter((stock: SearchStock) => {
          return stock.shortname.toLowerCase();
        });
  const handleClick = async (syb: string) => {
    console.log(syb);

    try {
      navigate(`/stock/${syb}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex justify-center">
        <div className="text-white relative w-72 h-100">
          <h1 className="text-white text-xl text-center mb-2">Search</h1>
          <Combobox
            value={selectedStock}
            onChange={(stock: any) => {
              setSelectedStock(stock);
              if (!stock || !stock.symbol) return;
              console.log(stock.symbol);
              console.log(stock.symbol.split(".")[0]);
              handleClick(stock.symbol.split(".")[0]);
            }}
          >
            <div className="relative mb-5">
              <ComboboxInput
                className="w-full border p-2 text-white rounded-lg pl-10"
                aria-label="Assignee"
                displayValue={(stock: SearchStock) => stock?.shortname}
                onChange={(event) => setQuery(event.target.value)}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="gray"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            <ComboboxOptions
              anchor="bottom"
              className="w-(var(--input-width)) border bg-white text-black empty:invisible z-50 max-h-60 overflow-auto"
            >
              {filteredStocks &&
                filteredStocks.map((stock: SearchStock) => (
                  <ComboboxOption
                    onClick={() => handleClick(stock.symbol)}
                    key={stock.symbol}
                    value={stock}
                    className="data-focus:bg-blue-100 cursor-pointer p-2 border-b last:border-b-0 min-w-100"
                  >
                    <div className="flex justify-between w-full">
                      <span className="font-bold w-1/3 text-left">
                        {stock.shortname}
                      </span>
                      <span className="text-gray-500 w-1/3 text-center">
                        {stock.exchange}
                      </span>
                    </div>
                  </ComboboxOption>
                ))}
            </ComboboxOptions>
          </Combobox>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <HoldingList />
      </div>
    </>
  );
}
export default Market;
