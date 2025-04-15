import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const root = document.getElementById("root");
if (!root) {
  throw Error("There must be an element with the root id.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
