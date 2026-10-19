import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { BookingProvider } from "./booking/BookingProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <BookingProvider>
        <App />
      </BookingProvider>
    </BrowserRouter>
  </StrictMode>,
);
