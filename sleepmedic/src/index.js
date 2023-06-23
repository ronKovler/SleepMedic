import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LoginPage from './Components/LoginPage'
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from 'react-auth-kit';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
