import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import '@kingly/ui/theme/skynet.css'

document.documentElement.setAttribute('data-theme', 'skynet')
document.body.setAttribute('data-theme', 'skynet')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
