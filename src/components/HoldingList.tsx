import { useState, useEffect } from "react"
// Assuming you have a component named Holding
import Holding from "./Holding" 

interface HoldingData {
  stock_name: string;
  quantity: number;
  buy_price: number; 
  name?: string;
  currentPrice?: number; 
  [key: string]: any;
}

function HoldingList() {
    const [holdings, setHoldings] = useState<HoldingData[]>([])
    const [_prices, setPrices] = useState<HoldingData[]>([])
    const [loading, setLoading] = useState(false)
    async function getHoldings() {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_NODE_URL}/api/v1/stock/getholdings`, {
                method: 'GET',
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) throw new Error("Failed to fetch holdings")
            
            const data = await response.json()
            setHoldings(data.holdings)
            if(data.holdings.length > 0) {
                callApi(data.holdings)
            }

        } catch (error) {
            console.error(error)
        }
    }

    async function callApi(currentHoldings: HoldingData[]) {
        try {
            const symbolsForApi = currentHoldings.map(h => {
                return h.stock_name.endsWith('.NS') ? h.stock_name : `${h.stock_name}.NS`
            }).join(',')
            
            const response = await fetch(`${import.meta.env.VITE_NODE_URL}/api/v1/stock/getquote?symbols=${symbolsForApi}`, {
                method: 'GET',
                credentials: 'include' 
            })

            const pricesData = await response.json() 
            setPrices(pricesData)
            
            
        } catch (error) {
            console.error("Failed to fetch quotes", error)
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getHoldings()
    }, [])
    useEffect(() => {
    const symbolsString = holdings.map(h => h.stock_name).join(',');
    
    if(symbolsString) callApi(holdings);
    }, [holdings.length]);
    {
        loading && (<div className="text-red text-2xl text-center"> Loading..</div>)
    }
    return (
        <>
        <div className="flex flex-col gap-4">
            <h2 className="text-white text-center text-2xl">Your Holdings</h2>
            {loading && <div className="text-blue-400 text-xl text-center">Loading data...</div>}

            {!loading && holdings.map((holding, index) => {
                
                const symbolKey = holding.stock_name.endsWith('.NS') 
                    ? holding.stock_name 
                    : `${holding.stock_name}.NS`;
                
                const liveData = _prices[symbolKey as any];
                return (
                    <Holding 
                        key={index}
                        name={holding.stock_name} 
                        price={liveData?.price || 0} 
                        boughtprice={holding.buy_price} 
                        quantity={holding.quantity}
                    />
                );
            })}
        </div>
        </>
    )
}

export default HoldingList