import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (e) {
  console.error("CRITICAL RENDER ERROR:", e)
  document.body.innerHTML = `<div style="color:white; text-align:center; padding-top: 50px;">CRITICAL ERROR: ${e.message}</div>`
}