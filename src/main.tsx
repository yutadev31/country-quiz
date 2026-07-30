import { NuqsAdapter } from "nuqs/adapters/react";
import { StrictMode } from "react";

import "./global.css";
import { createRoot } from "react-dom/client";

import App from "./App";
import "@/i18n/configs";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
    </StrictMode>,
  );
}
