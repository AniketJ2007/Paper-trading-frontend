import { useLocation, useParams } from "react-router-dom";
import StockChart from "./StockChart";
function StockPage() {
  const { stockName } = useParams();
  const location = useLocation();
  const { change } = location.state || { price: 0, change: "+0.00%" };

  return (
    <>
      <div className="text-white flex flex-col gap-5 mt-5">
        {/* <div
          className={`text-3xl ml-10 ${change > 0 ? "text-green-500" : "text-red-500"}`}
        >
          {stockName?.toLocaleUpperCase()} {change+'%'}
        </div> */}
        <StockChart symbol={stockName || ""} change={change} />
      </div>
    </>
  );
}
export default StockPage;
