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
import {I18nextProvider} from "react-i18next";
import i18next from 'i18next';
import global_en from "./Translation/en/global.json"
import global_es from "./Translation/es/global.json"



i18next.init({
    interpolation: {escapeValue: true},
    lng: "en",
    resources: {
      en: {
        global: global_en,
      },
      es: {
        global: global_es,
      },
    },
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <BrowserRouter>
          <I18nextProvider i18n={i18next}>
            <App />
          </I18nextProvider>
        </BrowserRouter>
      </AuthProvider>
    
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
