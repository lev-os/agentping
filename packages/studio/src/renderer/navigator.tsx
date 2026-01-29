import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigator } from './components/Navigator';
import './styles/global.css';
import './components/ui/ui.css';
import './components/Navigator.css';
import { initializeTheme } from './styles/themeConfig';

// Initialize theme system before rendering
initializeTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Navigator />
    </React.StrictMode>
);
