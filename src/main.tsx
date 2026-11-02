import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./noir-chrome.css";
import "./iphone-compat.css";

createRoot(document.getElementById("root")!).render(<App />);
