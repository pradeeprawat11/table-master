import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from "./Components/Home/Home";
import Menu from "./Components/Menu/Menu";
import Payment from './Components/Payment/Payment';
import OrderPlaced from './Components/OrderPlaced/OrderPlaced';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='menu' element={<Menu />} />
          <Route path='payment' element={<Payment />} />
          <Route path='orderPlaced' element={<OrderPlaced />} />
          <Route path='*' element={<Home />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
