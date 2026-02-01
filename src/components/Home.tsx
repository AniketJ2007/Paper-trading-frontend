import { useEffect, useState } from "react";
import FrontList from "./FrontList";
import IndexChart from "./IndexChart";
import NFrontList from "./NFrontList";
async function fetchdata() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_NODE_URL}/api/v1/stock/getfront`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function Home() {
  const [gainers, setGainers] = useState<any[]>([]);
  const [losers, setLosers] = useState<any[]>([]);
  const [indexs, setIndexs] = useState<any[]>([]);
  const [NIFTY, setNIFTY] = useState<any[]>([]);
  const [SENSEX, setSENSEX] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [Nchnage, setNchange] = useState<number>(0);
  const [Bchnage, setBchange] = useState<number>(0);

 
  const Indices:any=["NIFTY 50",
    "SENSEX", 
    "INDIA VIX",
    "NIFTY BANK",
    "NIFTY 100", 
    "NIFTY 200", 
    "NIFTY 500", 
    "NIFTY MIDCAP 50", 
    "NIFTY MIDCAP 100", 
    "NIFTY NEXT 50",
    "NIFTY AUTO", 
    "NIFTY ENERGY", 
    "NIFTY FIN SERVICE", 
    "NIFTY FMCG", 
    "NIFTY INFRA", 
     "NIFTY IT", 
    "NIFTY MEDIA", 
    "NIFTY METAL", 
    "NIFTY PHARMA",
    "NIFTY PSU BANK", 
    "NIFTY REALTY", 
    "NIFTY MID SELECT", 
    "NIFTY SMALLCAP 100"]
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchdata();

      if (data && data.gainer) {
        const formattedGainers = data.gainer.map((s: any) => ({
          name: s.symbol,
          price: s.ltp,
          change: `+${s.perChange}`,
        }));
        const formattedLosers = data.loser.map((s: any) => ({
          name: s.symbol,
          price: s.ltp,
          change: `${s.perChange}`,
        }));
        const formattedIndices = data.indices.map((s: any) => ({
          name: s.indexSymbol,
          price: s.last,
          change: `${String(s.percentChange)}`,
        })).filter((s:any) => Indices.includes(s.name))
        
        const formattedGraphdataN = data.graphs.nifty
          .map((s: any) => ({
            value: parseFloat(s["Open_^NSEI"]),
            time: Math.floor(new Date(s.Datetime).getTime() / 1000),
          }))
          .filter((item: any) => !isNaN(item.time) && !isNaN(item.value))
          .sort((a: any, b: any) => a.time - b.time);

        const formattedGraphdataB = data.graphs.sensex
          .map((s: any) => ({
            value: parseFloat(s["Open_^BSESN"]),
            time: Math.floor(new Date(s.Datetime).getTime() / 1000),
          }))
          .filter((item: any) => !isNaN(item.time) && !isNaN(item.value))
          .sort((a: any, b: any) => a.time - b.time);
        console.log(formattedGraphdataB);
        console.log(formattedGraphdataN);
        setNchange(
          ((Number(
            data.graphs.nifty[data.graphs.nifty.length - 1]["Close_^NSEI"],
          ) -
            Number(data.graphs.nifty[0]["Open_^NSEI"])) /
            Number(data.graphs.nifty[0]["Open_^NSEI"])) *
            100,
        );
        setBchange(
          ((Number(
            data.graphs.nifty[data.graphs.sensex.length - 1]["Close_^BSESN"],
          ) -
            Number(data.graphs.sensex[0]["Open_^BSESN"])) /
            Number(data.graphs.sensex[0]["Open_^BSESN"])) *
            100,
        );
        setGainers(formattedGainers);
        setLosers(formattedLosers);
        setIndexs(formattedIndices);
        setNIFTY(formattedGraphdataN);
        setSENSEX(formattedGraphdataB);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="text-2xl text-center text-white">{`NIFTY50` + ` ${Nchnage.toFixed(2)}`+"%"}</div>
        <div className="ml-5">
          <IndexChart data={NIFTY} change={Nchnage} />
        </div>
        <div className="text-2xl text-center text-white">{`SENSEX` + ` ${Nchnage.toFixed(2)}`+"%"}</div>
        <div className="ml-5">
          <IndexChart data={SENSEX} change={Bchnage} />
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-col gap-2 ml-5 mt-5 mr-2 relative z-50 w-120">
          <p className="text-2xl text-center mb-4 text-white mr-14">
            Top Gainers
          </p>
          <FrontList items={gainers} />
        </div>
        <div className="flex flex-col gap-2 ml-5 mt-5 mr-5 relative z-50 w-120">
          <p className="text-2xl text-center mb-4 text-white mr-14">
            Top Losers
          </p>
          <FrontList items={losers} />
        </div>
        <div className="flex flex-col gap-2 ml-5 mt-5 mr-5 relative z-50 w-120">
          <p className="text-2xl text-center mb-4 text-white mr-14">Indices</p>
          <NFrontList items={indexs} />
        </div>
      </div>
      <div className="w-100">Test</div>
    </>
  );
}

export default Home;
