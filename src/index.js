import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";

const root = document.getElementById("root");

const consoleError = console.error;
console.error = (...args) => {
  if (/findDOMNode is deprecated/.test(args[0])) {
    return;
  }
  consoleError(...args);
};

const appRoot = ReactDOM.createRoot(root);
appRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
