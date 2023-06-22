import logo from './logo.svg';
import './App.css';
import {Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage'
import CreateAccount from './Components/CreatePage';
import Welcome from './Components/Welcome'
import { createTheme, colors, ThemeProvider } from '@mui/material';
import React from 'react';

function App() {
  return (
      <div>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/createaccount" element={<CreateAccount/>} />
        </Routes>
      </div>
  );
}

export default App;
