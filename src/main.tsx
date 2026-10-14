import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource-variable/manrope/wght.css";
import "./index.scss";
import ErrorBoundary from "./components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
