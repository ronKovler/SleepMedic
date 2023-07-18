import logo from '../sleep_logo_purp.svg';
import "./Welcome.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import LoginPage from './LoginPage'
import React from 'react';
import theme from '../theme';
import { height } from '@mui/system';




function Welcome() {
  let navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [t, i18n] = useTranslation("global");
  
  useEffect (() => {
    //Check if Language has been choosen
    if (localStorage.getItem("i18nextLang") == null) {
      localStorage.setItem("i18nextLang", "en")
      i18n.changeLanguage("en");
      setSelectedLanguage("English");
    }
    
    //Sets Language based on localStorage "variable"
    i18n.changeLanguage(localStorage.getItem("i18nextLang"));
    if (Object.is(localStorage.getItem("i18nextLang"), "en")) {
      setSelectedLanguage("English");
    } else if (Object.is(localStorage.getItem("i18nextLang"), "es")) {
      setSelectedLanguage("Spanish");
    }

    //Checks if user is logged in and redirects
    const cookies = getCookiesDict();
    if (cookies._auth != null) {
      navigate("/home")
    }
  }, []);

  function getCookiesDict() {
    let cookies = document.cookie.split("; ");
    let cookiesDict = cookies.map(cookie => cookie.split('=')).reduce((acc, [key, ...val]) => {
        acc[key] = val.join('=');
        return acc;
    }, {});
    console.log(cookiesDict._auth);
    return cookiesDict;
  }

  const handleGetStarted = (e) => {
    e.preventDefault();
    // Open Lagnuage Preference
    setStarted(true);
    console.log("Get Started...");
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLang", lang);
    if (Object.is("es", lang)) {
      setSelectedLanguage("Spanish")
    } else if (Object.is("en", lang)) {
      setSelectedLanguage("English");
    }
  };

  return (
 
    <div className="sleep-medic-container">
      {/*Welcome Message - Getting Started*/}
      <Grid container spacing={0} justify='center' alignItems='center'>
        <Grid item xs={8}>
            <h1 style={{fontSize: "2.5rem", color: '#d8d3e3'}}>{t("welcome.title")}</h1>
            <img src={logo} alt="Sleep-Medic Logo" className="logo" style={{height: 400, width:400}}/>
            <p style={{fontSize: "1.25rem", color: '#d8d3e3'}}>{t("welcome.subscript")}</p>
        </Grid>
        <Grid item xs={2} >
          {/*Language Select*/}
            <div className="LanguageSelect-form">
              <div className="language-list" >
              <h2>{t("welcome.language")}</h2>
                <div onClick={(e) => handleLanguageChange('en')}>
                  {Object.is("English", selectedLanguage) ? <>✅ {t("welcome.english")}</> : <>{t("welcome.english")}</>}
                </div>
                <br/>
                <div onClick={(e) => handleLanguageChange('es')}>
                  {Object.is("Spanish", selectedLanguage) ? <>✅ {t("welcome.spanish")}</> : <>{t("welcome.spanish")}</>}
                </div>
                <br/>
                <div onClick={(e) => handleLanguageChange('French')}>
                  {Object.is("French", selectedLanguage) ? "✅ French" : "French"}
                </div>
                {/* Add more language options here */}
              </div>
              <br/>
              <Button variant="contained" color="primary" onClick={(e) => navigate("/login")}>{t("welcome.next")}</Button>
            </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Welcome;
