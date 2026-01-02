import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Services from "./pages/services";
import OrderHistory from "./pages/orderHistory";
import OrganizationInfo from "./pages/aboutUs";
import MainPage from "./pages/index";
import Gallery from "./pages/gallery";
import Calculator from "./pages/calculator";
import Order from "./pages/order";
import ServiceDetail from "./pages/serviceDetail";
import "./firebase/firebase";
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/LoginForm';
import UserAccount from './pages/UserAccount';
import OrderAdmin from './pages/orderAdmin';
import OrderCalendar from './pages/orderCalendar';

function App() {
  
  return (
    
    <Router>
     

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/order" element={<Order />} />
        <Route path="/about" element={<OrganizationInfo />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/account" element={<UserAccount />} />
        <Route path="/orderAdmin" element={<OrderAdmin />} />
        <Route path="/orderCalendar" element={<OrderCalendar />} />
      </Routes>
      
    </Router>
  );
}

export default App;
