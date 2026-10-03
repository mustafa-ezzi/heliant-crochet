import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AccountProvider } from "./lib/account";
import { BagProvider } from "./lib/bag";
import "./styles/heliant.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BagProvider>
      <AccountProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AccountProvider>
    </BagProvider>
  </StrictMode>,
);
