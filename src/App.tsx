import { Route, Routes } from "react-router";
import { ServicesPage } from "./pages/ServicesPage";
import { CustomerPage } from "./pages/CustomerPage";
import { LoginPage } from "./pages/admin/LoginPage";
import { AdminHomePage } from "./pages/admin/AdminHomePage";
import { DateTimePage } from "./pages/DateTimePage";
import { ReceiptPage } from "./pages/ReceiptPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ServicesPage />} />
      <Route path="/horario" element={<DateTimePage />} />
      <Route path="/seus-dados" element={<CustomerPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminHomePage />} />
      <Route path="/pedido-recebido" element={<ReceiptPage />} />
    </Routes>
  );
}

export default App;
