import React from "react";
import ReactDOM from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// Soft UI Dashboard React Context Provider
import { SoftUIControllerProvider } from "./context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MemoryRouter>
    <SoftUIControllerProvider>
      <App />
    </SoftUIControllerProvider>
  </MemoryRouter>
);
