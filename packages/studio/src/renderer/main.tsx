import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './components/ui/ui.css';
import { initializeTheme } from './styles/themeConfig';

// Initialize theme system before rendering
initializeTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
