import React from 'react'
import ReactDOM from 'react-dom/client'
import { ArweaveWalletKit } from "arweave-wallet-kit";
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ArweaveWalletKit
      config={{
        permissions: ["ACCESS_PUBLIC_KEY"]
      }}
      theme={{
        accent: { r: 200, g: 200, b: 200 },
        radius: "minimal",
      }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </HashRouter>
    </ArweaveWalletKit>
  </React.StrictMode>,
)
