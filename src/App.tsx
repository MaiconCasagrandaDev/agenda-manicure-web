import { Route, Routes } from "react-router";
import { ServicesPage } from "./pages/ServicesPage";
import { CustomerPage } from "./pages/CustomerPage";
import { LoginPage } from "./pages/admin/LoginPage";
import { AdminHomePage } from "./pages/admin/AdminHomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ServicesPage />} />
      <Route path="/seus-dados" element={<CustomerPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminHomePage />} />
    </Routes>
  );
}

export default App;
