import logo from './logo.svg';
import './App.css';
import {Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import CreateAccount from './Components/CreatePage';
import Welcome from './Components/Welcome';
import OpenHomePage from './Components/HomePage';
import OpenProfilePage from './Components/ProfilePage';
import EditGoal from './Components/EditGoalPage';
import CreateRem from './Components/CreateReminderPage';
import React from 'react';


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/createaccount" element={<CreateAccount/>} />
        <Route path="/homepage" element={<OpenHomePage>} />
        <Route path="/profilepage" element={<OpenProfilePage>} />
        <Route path="/editgoal" element={<EditGoal/>} />
        <Route path="/createreminder" element={<CreateRem/>} />

      </Routes>
    </div>
  );
}

export default App;
