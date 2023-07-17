import './App.css';
import {Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import CreateAccount from './Components/createAccount/CreatePage';

import Welcome from './Components/Welcome';
import Home from "./Components/home/Home"
import Statistics from "./Components/statistics/Statistic"
import { createTheme, colors, ThemeProvider } from '@mui/material';
import OpenProfilePage from './Components/ProfilePage';
import EditGoal from './Components/EditGoalPage';
import CreateRem from './Components/CreateReminderPage';
import OpenNotificationsPage from "./Components/NotificationsPage";
import React from 'react';
import theme from './theme';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/createaccount" element={<CreateAccount/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/profilepage" element={<OpenProfilePage/>} />
        <Route path="/editgoal" element={<EditGoal/>} />
        <Route path="/createreminder" element={<CreateRem/>} />
        <Route path="/notificationspage" element={<OpenNotificationsPage/>} />
        <Route path="/statistics" element={<Statistics/>} />
      </Routes>
    </div>
  );
}

export default App;
