import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { isAuthenticated } from './API/User';
import { BrowserRouter } from 'react-router-dom';

async function start() {
    ReactDOM.render(
        <React.StrictMode>
            <BrowserRouter>
                <App isAuthenticated={await isAuthenticated()} />
            </BrowserRouter>
        </React.StrictMode>,
        document.getElementById('root')
    );
}

start();

reportWebVitals();
