import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppComparison from "./App.comparison.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppComparison />
  </StrictMode>,
);