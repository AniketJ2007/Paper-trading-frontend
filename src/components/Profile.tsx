import { useEffect, useState } from "react";

function Profile() {
  const [Loading, setLoading] = useState<any>(false);
  const [user, setuser] = useState<any>({});
  const [transactions, setTransactions] = useState<any>([]);
  const getData = async () => {
    try {
      setLoading(true);
      const response: any = await fetch(
        "http://localhost:3000/api/v1/auth/getuser",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch user");
      const data = await response.json();
      await setuser(data.user);
      console.log(data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const getTransactions = async () => {
    try {
      setLoading(true);
      const response: any = await fetch(
        "http://localhost:3000/api/v1/stock/gettransactions",
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
      setTransactions(data.transactions);
      console.log(data.transactions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
    getTransactions();
    console.log(user);
    console.log(transactions);
  }, []);
  return (
        <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center gap-10">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-gray-700">
                <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-4 font-semibold text-center">Account Details</h2>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Name</span>
                        <span className="text-white text-lg font-medium">{user.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Email</span>
                        <span className="text-white text-lg font-medium">{user.email}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span className="text-gray-400">Wallet Balance</span>
                        <span className="text-green-400 text-2xl font-bold">₹{user.balance}</span>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-2xl">
                <h3 className="text-white text-2xl font-bold mb-6 pl-2 border-l-4 border-blue-500">
                    Recent Transactions
                </h3>

                <div className="flex flex-col gap-3">
                    {transactions && transactions.length > 0 ? (
                        transactions.map((trans: any) => {
                            const isBuy = trans.type?.toLowerCase() === 'buy';
                            
                            return (
                                <div 
                                    className="bg-gray-800 p-4 rounded-xl flex items-center justify-between shadow-md hover:bg-gray-750 transition-colors border border-gray-700"
                                >
                                    <div className="flex flex-col w-1/3 text-left">
                                        <span className="text-gray-400 text-xs uppercase">Symbol</span>
                                        <span className="text-white text-xl font-bold tracking-wide">
                                            {trans.symbol}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center w-1/3 gap-1">
                                        <div className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            isBuy 
                                                ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                                                : 'bg-red-900/30 text-red-400 border border-red-500/30'
                                        }`}>
                                            {trans.type}
                                        </div>
                                        <span className="text-white text-lg font-medium">
                                            ₹{trans.price ? Number(trans.price).toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end w-1/3">
                                        <span className="text-gray-400 text-xs uppercase">Quantity</span>
                                        <span className="text-white text-lg">
                                            {trans.quantity} <span className="text-gray-500 text-sm">sh</span>
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-gray-500 text-center italic mt-4">
                            No transactions found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}




export default Profile;
