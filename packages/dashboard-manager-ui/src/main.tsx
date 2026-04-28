import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import '@kingly/ui/styles'
import './tailwind-sources.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
