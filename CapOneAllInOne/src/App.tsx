import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import "./App.css";
import Accounts from "./routes/Accounts/Accounts";
import Stocks from "./routes/Stocks/Stocks";
import Analytics from "./routes/Analytics";
import Groups from "./routes/Groups/Groups";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div>
      <main>
        <Routes>
          <Route path="/Accounts" element={<Accounts />} />
          <Route path="/Stocks" element={<Stocks />} />
          <Route path="/" element={<Home />} />
          <Route path="/Analytics" element={<Analytics />} />
          <Route path="/Groups" element={<Groups />} />
        </Routes>
      </main>
      <Navbar />
    </div>
  );
}

export default App;
