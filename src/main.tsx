import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error(
    'root element not found — check index.html for <div id="root">'
  );
} else {
  createRoot(rootEl).render(<App />);
}
