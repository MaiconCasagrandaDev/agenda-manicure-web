import { Route, Routes } from "react-router";
import { ServicesPage } from "./pages/ServicesPage";
import { DateTimePage } from "./pages/DateTimePage";
import { CustomerPage } from "./pages/CustomerPage";
import { ReceiptPage } from "./pages/ReceiptPage";
import { LoginPage } from "./pages/admin/LoginPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { PendingPage } from "./pages/admin/PendingPage";
import { AgendaPage } from "./pages/admin/AgendaPage";
import { BlocksPage } from "./pages/admin/BlocksPage";

function App() {
  return (
    <Routes>
      {/* Cliente */}
      <Route path="/" element={<ServicesPage />} />
      <Route path="/horario" element={<DateTimePage />} />
      <Route path="/seus-dados" element={<CustomerPage />} />
      <Route path="/pedido-recebido" element={<ReceiptPage />} />

      {/* Painel da manicure */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<PendingPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="bloqueios" element={<BlocksPage />} />
      </Route>
    </Routes>
  );
}

export default App;