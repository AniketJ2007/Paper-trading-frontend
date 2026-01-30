import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./components/Login.tsx";
import Market from "./components/Market";
import Watchlists from "./components/Watchlists";
import Home from "./components/Home";
import StockPage from "./components/StockPage.tsx";
import SignUp from "./components/SignUp.tsx";
import IndiceChart from "./components/IndiceChart.tsx";
import Profile from "./components/Profile.tsx";
function App() {
  return (
    <>
    <div>
     <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/market" element={<Market />} />
        <Route path="/watchlists" element={<Watchlists />} />
        <Route path="/stock/:stockName" element={<StockPage />} />
        <Route path="/indice/:indexName" element={<IndiceChart />} />
        <Route path="/" element={<Home />} /> 
      </Routes>
    </BrowserRouter>
    </div>
    </>
  );
}

export default App;
