import React from "react";
import ReactDOM from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { SoftUIControllerProvider } from "./context";
import { UserControllerProvider } from "./context/user";
import SnackbarProvider from 'react-simple-snackbar'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MemoryRouter>
    <SnackbarProvider>
      <SoftUIControllerProvider>
        <UserControllerProvider>
          <App />
        </UserControllerProvider>
      </SoftUIControllerProvider>
    </SnackbarProvider>
  </MemoryRouter>
);
