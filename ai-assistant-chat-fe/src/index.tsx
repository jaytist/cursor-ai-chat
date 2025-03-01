import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Sample from "./Sample";
import NewSample from "./NewSample";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <NewSample />
  </React.StrictMode>
);

reportWebVitals();
