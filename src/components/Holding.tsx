import { useNavigate } from "react-router-dom";
interface Sttk{
  name: string;
  price: number;
  boughtprice:number;
  change?: string;
}
function Holding({
  name,
  price,
  boughtprice,
  change = "0.00%",
}: Sttk) {
    change = ((( price - boughtprice ) / boughtprice )*100).toFixed(2)
  const isPositive = change.startsWith("+") || !change.startsWith("-");
  const changeColor = isPositive ? "text-green-500" : "text-red-500";
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/stock/${name}`, {
      state: {
        change,
      },
    });
  };
  return (
    <div
      onClick={handleClick}
      className="bg-gray-600 hover:bg-gray-400 border border-gray-200 rounded-lg shadow-sm flex justify-between gap-2.5 items-center px-4 py-4 mx-3 my-2 transition-all duration-200 hover:shadow-md w-100 min-w-0"
    >
      <div className="text-lg font-semibold text-gray-800">{name}</div>
      <div className="flex gap-8 items-center">
        <div className={`text-lg font-medium ${changeColor} text-gray-900`}>
          ₹{price.toLocaleString()}
        </div>
        <div className={`text-lg font-medium text-gray-900`}>
          ₹{boughtprice.toLocaleString()}
        </div>
        <div
          className={`text-sm font-semibold ${changeColor} bg-opacity-10 px-3 py-1 rounded-full ${isPositive ? "bg-green-100" : "bg-red-100"}`}
        >
          {change + '%'}
        </div>
      </div>
    </div>
  );
}
export default Holding;
