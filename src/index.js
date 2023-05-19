import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { FavsProvider } from './context/FavsContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <FavsProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </FavsProvider>
    </AuthProvider>
  </BrowserRouter>
);

