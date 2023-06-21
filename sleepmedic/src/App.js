import logo from './logo.svg';
import './App.css';
import {Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage'
import CreateAccount from './Components/CreatePage';
import Welcome from './Components/Welcome';
import Home from './Components/home/Home';
import Navbar from './Components/navbar/Navbar';

import React from 'react';



function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/createaccount" element={<CreateAccount/>} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
