import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import App from "@/app.tsx";

const root = document.getElementById("root");
if (!root) {
  throw Error("There must be an element with the root id.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
