import logo from '../sleep_logo_purp.svg';
import "./Welcome.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Button, Grid, Paper, Box, Typography} from '@mui/material';
import { useEffect, useState } from 'react';
import LoginPage from './LoginPage'
import React from 'react';
import theme from '../theme';
import { height } from '@mui/system';
import { isMobile } from 'react-device-detect';




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
      <Box  sx={{
                   /*#3E4464 10px, #57618E, #717AA8 45%,  #3E4464 10px */
        background: 'repeating-radial-gradient(circle at -10% -10%, #717AA8 10px, #57618E, #3E4464 50% )',
        animation: 'animazione 13s ease-in-out infinite alternate-reverse',
    
        height: '100vh' ,
        width: '100vw',
        overflowX: 'hidden',
       
        display: 'flex', // Enable flexbox layout
        justifyContent: 'center', // Horizontally center the content
        alignItems: 'center', // Vertically center the content
        
      }}>
     
      {/*Welcome Message - Getting Started*/}
      <Grid container columns={1}  direction="column" alignItems="center">
        <Grid item xs paddingBottom={isMobile? 1 : 8}>
          <Typography variant="h4" component="div"
            sx={{flexGrow: 1,
                fontWeight: 'bold',
                color: '#d8d3e3', 
                paddingTop: '10px',
                paddingBottom: '10px',
                textAlign: 'center'}}>
              {t("welcome.title")} 
          </Typography>
          
        </Grid>
        
        <Grid container columnSpacing={isMobile ? 2 : -50} rowSpacing={2} direction={isMobile ? 'column' : 'row'} justifyContent="center" alignItems="center">
          
            <Grid item xs textAlign={'center'} >
              <Box display='flex' justifyContent="center" alignItems="center" >
                <img src={logo} alt="Sleep-Medic Logo" style={{ minWidth: isMobile? 200 : 320, height: "auto"}}/>
              </Box>
            </Grid>
        
          <Grid item xs textAlign={'center'} paddingBottom={isMobile? 1 : 5}>
            <Box display='flex' justifyContent="center" alignItems="center">
              <Paper sx={{backgroundColor: '#D9D3E4',  minWidth: isMobile ? '90%' : 250, padding: 2}} square={false} elevation={3} style={{textAlign: 'center'}}>  
              
                <Typography variant="h5" component="div"
                  sx={{flexGrow: 1,
                  color: 'black', 
                  fontWeight: 'bold',
                  paddingTop: '10px',
                  paddingBottom: '0px',
                  textAlign: 'center'}}>
                  {t("welcome.language")} 
                </Typography>
                
                <Button sx={{
                  textTransform: 'none', 
                  width:'60%', 
                  fontWeight: Object.is("English", selectedLanguage) ? 'bold' : 'regular'
                  }} 
                  variant={'uncontained'} 
                  onClick={() => handleLanguageChange('en')} >
                  {t("welcome.english")}
                </Button><br/>

                <Button sx={{
                  textTransform: 'none', 
                  width:'60%', 
                  fontWeight: Object.is("Spanish", selectedLanguage) ? 'bold' : 'regular'
                  }} 
                  variant={'uncontained'} 
                  onClick={() => handleLanguageChange('es')} >
                  {t("welcome.spanish")}
                </Button><br/>

                <Button sx={{
                  textTransform: 'none', 
                  width:'60%', 
                  fontWeight: Object.is("French", selectedLanguage) ? 'bold' : 'regular'
                  }} 
                  variant={'uncontained'} onClick={() => handleLanguageChange('French')} >
                  {"French"} {/* Add more language options here */}
                </Button><br/>

                <Button sx={{width: '55%'}} variant="contained" color="primary" onClick={(e) => navigate("/login")}>
                  {t("welcome.next")}
                </Button>
              </Paper>
            </Box>
          </Grid>
          
        </Grid>
    
        
        <Grid item xs >
          <Box display='flex' justifyContent="center" alignItems="center" >
          <Typography variant="h6" component="div" width={'95%'}
            sx={{flexGrow: 1,
                color: '#d8d3e3', 
                
                textAlign: 'center'}}>
              {t("welcome.subscript")} 
          </Typography>
          </Box>
      
        </Grid>
      </Grid>
     </Box>
  );
}

export default Welcome;
