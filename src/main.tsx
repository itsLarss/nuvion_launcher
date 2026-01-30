import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './App.css'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

export default defineConfig({
    plugins: [react()],
})
