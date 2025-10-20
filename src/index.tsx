import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error("Root element not found");
} else {
  createRoot(rootEl).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}
