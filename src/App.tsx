import { Route, Routes } from "react-router";
import { ServicesPage } from "./pages/ServicesPage";
import { CustomerPage } from "./pages/CustomerPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ServicesPage />} />
      <Route path="/seus-dados" element={<CustomerPage />} />
    </Routes>
  );
}

export default App;
