import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Box, Typography, Grid, Paper } from '@mui/material';
import { isMobile } from 'react-device-detect';

import logo from '../sleep_logo_purp.svg';
import LoginPage from './LoginPage';

function Welcome() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [t, i18n] = useTranslation('global');

  // Check and set initial language preference
  useEffect(() => {
    const defaultLanguage = 'en';
    const storedLanguage = localStorage.getItem('i18nextLang') || defaultLanguage;

    i18n.changeLanguage(storedLanguage);
    setSelectedLanguage(storedLanguage === 'en' ? 'English' : 'Spanish');
    
    // Redirect if user is logged in
    const cookies = getCookiesDict();
    if (cookies._auth != null) {
      navigate('/home');
    }
  }, []);

  // Extract cookies into a dictionary
  function getCookiesDict() {
    let cookies = document.cookie.split('; ');
    let cookiesDict = cookies.map(cookie => cookie.split('=')).reduce((acc, [key, ...val]) => {
      acc[key] = val.join('=');
      return acc;
    }, {});
    console.log(cookiesDict._auth);
    return cookiesDict;
  }

  // Handle 'Get Started' button click event
  const handleGetStarted = (e) => {
    e.preventDefault();
    //Go to Login Page
    console.log('Get Started...');
  };

  // Handle language change
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLang', lang);
    setSelectedLanguage(lang === 'en' ? 'English' : 'Spanish');
  };

  return (
    <Box
      sx={{
        /*#3E4464 10px, #57618E, #717AA8 45%,  #3E4464 10px */
        background: 'repeating-radial-gradient(circle at -10% -10%, #717AA8 10px, #57618E, #3E4464 50% )',
        animation: 'animazione 13s ease-in-out infinite alternate-reverse',
        height: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid container columns={1} direction="column" alignItems="center">
        <Grid item xs paddingBottom={isMobile ? 1 : '5%'}>
          <Typography
            variant="h4"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              color: '#d8d3e3',
              paddingTop: '10px',
              paddingBottom: '10px',
              textAlign: 'center',
            }}
          >
            {t('welcome.title')}
          </Typography>
        </Grid>

        <Grid container columnSpacing={isMobile ? 2 : -50} rowSpacing={2} direction={isMobile ? 'column' : 'row'} justifyContent="center" alignItems="center">
          <Grid item xs textAlign="center">
            <Box display="flex" justifyContent="center" alignItems="center">
              <img src={logo} alt="Sleep-Medic Logo" style={{ minWidth: isMobile ? 200 : 320, height: 'auto' }} />
            </Box>
          </Grid>

          <Grid item xs textAlign="center" paddingBottom={isMobile ? 1 : '2%'}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Paper sx={{ backgroundColor: '#D9D3E4', minWidth: isMobile ? '90%' : 250, padding: 2 }} square={false} elevation={3} style={{ textAlign: 'center' }}>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    flexGrow: 1,
                    color: '#677085',
                    fontWeight: 'bold',
                    paddingTop: '10px',
                    paddingBottom: '0px',
                    textAlign: 'center',
                  }}
                >
                  {t('welcome.language')}
                </Typography>

                {/* Language buttons */}
                <Button
                  sx={{
                    textTransform: 'none',
                    width: '60%',
                    color: selectedLanguage === 'English' ? 'black' : '#81899c',
                    fontSize: '1.2rem',
                    fontWeight: selectedLanguage === 'English' ? 'bold' : 'regular',
                  }}
                  variant="uncontained"
                  onClick={() => handleLanguageChange('en')}
                >
                  {t('welcome.english')}
                </Button>
                <br />

                <Button
                  sx={{
                    textTransform: 'none',
                    width: '60%',
                    color: selectedLanguage === 'Spanish' ? 'black' : '#81899c',
                    fontSize: '1.2rem',
                    fontWeight: selectedLanguage === 'Spanish' ? 'bold' : 'regular',
                  }}
                  variant="uncontained"
                  onClick={() => handleLanguageChange('es')}
                >
                  {t('welcome.spanish')}
                </Button>
                <br />

                {/* Next button */}
                <Button sx={{ width: '55%' }} variant="contained" color="primary" onClick={() => navigate('/login')}>
                  {t('welcome.next')}
                </Button>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        <Grid item xs>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography
              variant="h6"
              component="div"
              width="95%"
              sx={{
                flexGrow: 1,
                color: '#d8d3e3',
                textAlign: 'center',
              }}
            >
              {t('welcome.subscript')}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Welcome;
