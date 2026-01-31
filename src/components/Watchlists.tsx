import { useState, useEffect } from "react";
import WatchlistEntry from "./WatchlistEntry";
function Watchlists() {
  const [Loading, setLoading] = useState<any>(false);
  const [Data,setData]=useState<string>("")
  const [symbol,setsymbol]=useState<string>("")
  const [WatchList, setWatchList] = useState<any>([]);
  const [isVisisble,setisVisisble]=useState<boolean>(false)
  const getWatchlists = async () => {
    try {
      setLoading(true);
      const response: any = await fetch(
        "http://localhost:3000/api/v1/stock/getwatchlists",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setWatchList(data.watchlists);
      console.log(data.watchlists);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const addTolists = async () => {
    try {
      setLoading(true);
      const response: any = await fetch(
        "http://localhost:3000/api/v1/stock/addtowatchlists",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({symbol,notes:Data})
        },
      );

      if (!response.ok) throw new Error("Failed to add to watchlist");
      const data = await response.json();
      
      console.log(data.message);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setisVisisble(false)
    }
  };
  useEffect(() => {
    getWatchlists();
    console.log(WatchList);
  }, []);
  return (
    <>
      <div className="flex flex-col gap-5 items-center min-h-screen mt-3">
        
        <div className="flex gap-4 items-center">
          <h3 className="text-white text-2xl font-bold pl-2 border-l-4 border-blue-500 text-center leading-none">
            Watchlists
          </h3>
          <button className="text-2xl text-white border-4 border-blue-600 p-3 rounded-lg 
           text-center hover:bg-blue-800"
            onClick={()=>setisVisisble(true)}
           >
            +
          </button>
        </div>
        {isVisisble && ( 
        <div>
          <div className="flex flex-col gap-4 justify-center items-center text-lg">
            <input
              placeholder="Add Symbol"
              type="text"
              onChange={(e) => {
                setsymbol(e.target.value);
              }}
              value={symbol}
              className="h-10 w-120 p-1 border-blue-500 border-4 overflow-hidden outline-none rounded-l-lg text-white"
            />
            <input
              placeholder="Add Notes"
              type="text"
              onChange={(e) => {
                setData(e.target.value);
              }}
              value={Data}
              className="h-10 w-120 p-1 border-blue-500 border-4 overflow-hidden outline-none rounded-l-lg text-white"
            />
            <button
              className="h-10 w-25 bg-green-400 rounded-lg"
              onClick={addTolists}
            >
              Add
            </button>
          </div>
        </div>
        )}
        <div>
          {WatchList.map((entry: any) => (
            <WatchlistEntry Content={entry.notes} symbol={entry.symbol} />
          ))}
        </div>
      </div>
    </>
  );
}
export default Watchlists;
