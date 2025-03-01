import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ErrorProvider } from "./contexts/ErrorContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ErrorProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ErrorProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

reportWebVitals();
