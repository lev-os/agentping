import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@kingly/ui/theme/skynet.css';
import './styles/global.css';
import './styles/rams.css';
import './styles/ui-skills.css';
import './styles/theme-sofia.css';

document.documentElement.setAttribute('data-theme', 'dark');
document.body.setAttribute('data-theme', 'skynet');

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
