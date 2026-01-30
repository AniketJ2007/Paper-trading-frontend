import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, LineSeries } from "lightweight-charts";
import { useLocation, useParams } from "react-router-dom";
function IndiceChart() {
  const { indexName } = useParams();
  const safeNmae = indexName || "NIFTY 50";
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const loaction = useLocation();
  const seriesRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { change } = loaction.state || { price: 0, change: "+0.00%" };
  const [data, setdata] = useState<any>(null);

  console.log(safeNmae);

  const INDICES_MAP = new Map([
    ["NIFTY 50", "^NSEI"],
    ["SENSEX", "^BSESN"],
    ["INDIA VIX", "^INDIAVIX"],
    ["NIFTY BANK", "^NSEBANK"],
    ["NIFTY 100", "^CNX100"],
    ["NIFTY 200", "^CNX200"],
    ["NIFTY 500", "^CRSLDX"],
    ["NIFTY MIDCAP 50", "^NSEMDCP50"],
    ["NIFTY MIDCAP 100", "^NIFTY_MIDCAP_100.NS"],
    ["NIFTY NEXT 50", "JUNIORBEES.NS"],
    ["NIFTY AUTO", "^CNXAUTO"],
    ["NIFTY ENERGY", "^CNXENERGY"],
    ["NIFTY FIN SERVICE", "^NIFTY_FIN_SERVICE.NS"],
    ["NIFTY FMCG", "^CNXFMCG"],
    ["NIFTY INFRA", "^CNXINFRA"],
    ["NIFTY IT", "^CNXIT"],
    ["NIFTY MEDIA", "^CNXMEDIA"],
    ["NIFTY METAL", "^CNXMETAL"],
    ["NIFTY PHARMA", "^CNXPHARMA"],
    ["NIFTY PSU BANK", "^CNXPSUBANK"],
    ["NIFTY REALTY", "^CNXREALTY"],
    ["NIFTY MID SELECT", "NIFTY_MID_SELECT.NS"],
    ["NIFTY SMALLCAP 100", "^SML100CASE.NS"],
  ]);
  const fetchData = async () => {
    const resp: any = await fetch(`http://127.0.0.1:5000/api/indexgraph`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: INDICES_MAP.get(safeNmae) }),
    });

    if (!resp.ok) {
      throw new Error("Failed to fetch data");
    }
    console.log(resp);

    const Data = await resp.json();
    console.log(Data);

    const formattedGraphdata = Data.data
      .map((s: any) => ({
        value: parseFloat(s[`Open_${INDICES_MAP.get(safeNmae)}`]),
        time: Math.floor(new Date(s.Datetime).getTime() / 1000),
      }))
      .filter((item: any) => !isNaN(item.time) && !isNaN(item.value))
      .sort((a: any, b: any) => a.time - b.time);

    setdata(formattedGraphdata);
    console.log(formattedGraphdata);
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
      color: change > 0 ? "#00FF00" : "#FF0000",
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
    fetchData();
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // Update chart data when data prop changes
  useEffect(() => {
    if (!seriesRef.current || !data || data.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Setting data:", data.slice(0, 3)); // Debug: check first 3 items
      seriesRef.current.setData(data);
      chartRef.current?.timeScale().fitContent();

      setLoading(false);
    } catch (err) {
      setError("Failed to load chart data");
      console.error("Error setting data:", err);
      setLoading(false);
    }
  }, [data]);

  return (
    <div className="bg-black rounded-lg shadow-lg p-6">
      {loading && (
        <div className="text-white text-center py-8">Loading chart data...</div>
      )}

      {error && <div className="text-red-500 text-center py-8">{error}</div>}

      <div
        className={`text-3xl ml-10 ${change > 0 ? "text-green-500" : "text-red-500"} text-center mb-10`}
      >
        {safeNmae?.toLocaleUpperCase()} {change + "%"}
      </div>

      <div ref={chartContainerRef} style={{ minHeight: "400px" }} />
    </div>
  );
}

export default IndiceChart;
