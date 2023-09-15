import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from "./Components/Home/Home";
import Menu from "./Components/Menu/Menu";
import Payment from './Components/Payment/Payment';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='menu' element={<Menu />} />
          <Route path='payment' element={<Payment />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
