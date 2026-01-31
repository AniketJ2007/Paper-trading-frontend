import { useState,useEffect } from 'react'
function WatchlistEntry({Content,symbol}:{Content:string,symbol:string}) {
    const[isEditable,setisEditable]=useState<boolean>(false)
    const[todoMsg,settodoMsg]=useState<string>(Content)
    const editTodo=async()=>{
        
        try {
          const response: any = await fetch(
            "http://localhost:3000/api/v1/stock/updatewatchlists",
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body:JSON.stringify({symbol,notes:todoMsg})
            },
          );
    
          if (!response.ok) throw new Error("Failed to update watchlists");
          const data = await response.json();
          console.log(data.message);
        } catch (error) {
          console.error(error);
        } 
        setisEditable(false)
    }
    const deleteTodo=async()=>{
        
        try {
          const response: any = await fetch(
            "http://localhost:3000/api/v1/stock/deletefromwatchlists",
            {
              method: "DELETE",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body:JSON.stringify({symbol})
            },
          );
    
          if (!response.ok) throw new Error("Failed to delete watchlists");
          const data = await response.json();
          console.log(data.message);
        } catch (error) {
          console.error(error);
        } 
        setisEditable(false)
    }
    useEffect(() => {
    settodoMsg(Content);
}, [Content]);
  return (
    <div
     className={`flex items-center rounded-lg gap-x-3 border h-15 border-gray-700 
      px-3 py-1.5 mt-5 mb-5 shadow-sm text-white bg-gray-800 overflow-auto no-scrollbar`}
    >
      <input type="text"
       readOnly={true}
       value={symbol}
      />
      <textarea
       className={`outline-none w-full min-w-50 bg-transparent rounded-lg text-white resize-none 
          ${isEditable ? "border border-blue-500 p-1" : "border-transparent cursor-default"} 
          max-h-30 overflow-y-auto no-scrollbar scrollbar-thumb-gray-600`}
        value={todoMsg}
        readOnly={!isEditable}
        onChange={(e)=>settodoMsg(e.target.value)}
      />
      <button
        className='inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50'
        onClick={() => {
            if (isEditable) {
                editTodo()
            }else setisEditable((prev) => !prev)
        }}
        >{isEditable ? "📁": "✏️"}</button>
        <button
        className='inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0'
        onClick={() => deleteTodo()}
        >❌</button>
    </div>
  )
}

export default WatchlistEntry