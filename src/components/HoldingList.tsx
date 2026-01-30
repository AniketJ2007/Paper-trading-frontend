import { useState, useEffect } from "react"
// Assuming you have a component named Holding
import Holding from "./Holding" 

interface HoldingData {
  stock_name: string;
  quantity: number;
  buy_price: number; 
  name?: string;
  currentPrice?: number; 
}

function HoldingList() {
    const [holdings, setHoldings] = useState<HoldingData[]>([])
    const [loading, setLoading] = useState(false)
    async function getHoldings() {
        try {
            setLoading(true)
            const response = await fetch('http://localhost:3000/api/v1/stock/getholdings', {
                method: 'GET',
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) throw new Error("Failed to fetch holdings")
            
            const data = await response.json()
            setHoldings(data.holdings)
            console.log(data);
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
            
            const response = await fetch(`http://localhost:3000/api/v1/stock/getquote?symbols=${symbolsForApi}`, {
                method: 'GET',
                credentials: 'include' 
            })

            const pricesData = await response.json() 
            console.log(pricesData)
            setHoldings(prevHoldings => prevHoldings.map(h => ({
                ...h,
                currentPrice: pricesData[h.stock_name + ".NS"]?.price || 0 
            })))
            console.log(holdings);
            
        } catch (error) {
            console.error("Failed to fetch quotes", error)
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getHoldings()
    }, [])
    {
        loading && (<div className="text-red text-2xl text-center"> Loading..</div>)
    }
    return (
        <>
        <div className="flex flex-col gap-4">
            <h2 className="text-white text-center text-2xl">Your Holdings</h2>
            {holdings.map((holding, index) => (
                <Holding 
                    key={index}
                    name={holding.stock_name} // Using symbol as name
                    price={holding.currentPrice || 0} // Live price
                    boughtprice={holding.buy_price} // Purchase price
                />
            ))}
        </div>
        </>
    )
}

export default HoldingList