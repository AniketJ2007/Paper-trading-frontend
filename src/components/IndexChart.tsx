import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, LineSeries } from "lightweight-charts";

function IndexChart({ data , change}: { data: any[],change:number }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize chart once
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
      color: change > 0 ? '#00FF00' : '#FF0000',
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
      console.log('Setting data:', data.slice(0, 3)); // Debug: check first 3 items
      
      seriesRef.current.setData(data);
      chartRef.current?.timeScale().fitContent();
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load chart data');
      console.error('Error setting data:', err);
      setLoading(false);
    }
  }, [data]);

  return (
    <div className="bg-black rounded-lg shadow-lg p-6">
      {loading && (
        <div className="text-white text-center py-8">Loading chart data...</div>
      )}

      {error && (
        <div className="text-red-500 text-center py-8">{error}</div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="text-white text-center py-8">No data available</div>
      )}

      <div ref={chartContainerRef} style={{ minHeight: '400px' }} />
    </div>
  );
}

export default IndexChart;