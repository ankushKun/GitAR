import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { ArweaveWebWallet, type State, type AppInfo } from 'arweave-wallet-connector'
import App from './App.tsx'
import Profile from './pages/profile.tsx'
import Browse from './pages/browse.tsx'
import About from './pages/about.tsx'
import './index.css'

const state: State = { url: 'arweave.app', showIframe: false, usePopup: false, requirePopup: false, keepPopup: false, connected: false }
const appInfo: AppInfo = {
  name: "GitAR",
  logo: 'https://jfbeats.github.io/ArweaveWalletConnector/placeholder.svg'
}

const wallet = new ArweaveWebWallet(appInfo, { state })

wallet.on('connect', () => {
  console.log('connected')
  localStorage.setItem("address", wallet.address as string)
  // emit a custom event to let the app know that the wallet has connected
  const event = new CustomEvent('WalletConnected')
  window.dispatchEvent(event)
})

wallet.on('disconnect', () => {
  console.log('disconnected')
  localStorage.removeItem("address")
  // emit a custom event to let the app know that the wallet has disconnected
  const event = new CustomEvent('WalletDisconnected')
  window.dispatchEvent(event)
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App wallet={wallet} />} />
        <Route path="/profile" element={<Profile wallet={wallet} />} />
        <Route path="/browse" element={<Browse wallet={wallet} />} />
        <Route path="/about" element={<About wallet={wallet} />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)
