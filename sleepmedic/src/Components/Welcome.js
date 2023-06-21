import logo from '../logo.svg';
import "./Welcome.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import LoginPage from './LoginPage'
import React from 'react';




function Welcome() {
  let navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleGetStarted = (e) => {
    e.preventDefault();
    // Open Lagnuage Preference
    setStarted(true);
    console.log("Get Started...");
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e);
  };

  return (
    <div className="sleep-medic-container">

      {/*Welcome Message - Getting Started*/}
      {!started &&
      (<div>
      <h1>Welcome to Sleep-Medic</h1>
      <img src={logo} alt="Sleep-Medic Logo" className="logo" />
      <p>Achieve better sleep and improve your well-being with Sleep-Medic App.</p>
      <br/>
      <button onClick={(e) => handleGetStarted(e)} className="btn btn-primary">Get Started</button>
      </div>)
      }

      {/*Language Select*/}
      {started && (
        <div>
          <div className="LanguageSelect-form">
            <label htmlFor="language">Select Language:</label>
            <div className="language-list">
              <div onClick={(e) => handleLanguageChange('English')}>
                {Object.is("English", selectedLanguage) ? "✅ English" : "English"}
              </div>
              <br/>
              <div onClick={(e) => handleLanguageChange('Spanish')}>
                {Object.is("Spanish", selectedLanguage) ? "✅ Spanish" : "Spanish"}
              </div>
              <br/>
              <div onClick={(e) => handleLanguageChange('French')}>
                {Object.is("French", selectedLanguage) ? "✅ French" : "French"}
              </div>
              {/* Add more language options here */}
            </div>
            <button className="btn" onClick={(e) => navigate("/login")}>Next</button>

            {/* TESTING ONLY */}
            <button className="btn" onClick={(e) => navigate("/home")}>Home</button> 
          </div>
        </div>
      )}
      
    </div>
  );
}

export default Welcome;
