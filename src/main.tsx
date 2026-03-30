import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { NuqsAdapter } from "nuqs/adapters/react";
import App from "./App";
import "@/i18n/configs";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NuqsAdapter>
      <App />
    </NuqsAdapter>
  </StrictMode>,
);
