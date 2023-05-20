import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { FavsProvider } from './context/FavsContext';
import { LikedProvider } from './context/LikedContext';
import { ThemeProvider } from './context/ThemeContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <LikedProvider>
        <FavsProvider>
          <ThemeProvider>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </ThemeProvider>
        </FavsProvider>
      </LikedProvider>
    </AuthProvider>
  </BrowserRouter>
);

