import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { TextField, SimpleDialog }  from "@mui/material/";
import { useSignIn } from 'react-auth-kit';
import axios from "axios";
import "./LoginPage.css";
import { Typography, FormControl, OutlinedInput, InputLabel, Paper, Box, Button, Alert, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';
import logo from '../sleep_logo_purp.svg';
import { isMobile } from 'react-device-detect';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [logoSize, setLogoSize] = useState('100%');
  const [t, i18n] = useTranslation("global");

  useEffect (() => {
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

  var headers = {
    "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
    "Content-Type": 'application/json; charset=utf-8',
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    // Handle login logic here
    var loginInfo = {
        email: email,
        password: password,
        rememberMe: rememberMe,
    }
    
    try {
      let res = await axios.post("https://api.sleepmedic.me:8443/account/auth/login",  loginInfo , {headers});

      if (Object.is(res.data.token,"-1")) {
        console.log("Login Failed");
        setError(true);
        return;
      }
      if (rememberMe == false){
        signIn({
          token: res.data.token,
          expiresIn: 240,
          tokenType: "Bearer",
          authState: {}
        })
      } else {
        signIn({
          token: res.data.token,
          expiresIn: 10080,
          tokenType: "Bearer",
          authState: {}
        })
      }
      console.log(res.data);
      navigate("/home");
    } catch (err) {
      console.log("LOGIN BACKEND CALL FAILED");
      setError(true);
      return;
    }


    console.log('Logging in...');
  };

  //Forgot Password
  const [open, setOpen] = useState(false);
  const [openFin, setOpenFin] = useState(false);
  const [remail, setREmail] = useState('');
  const [birth, setBirth] = useState('');

  const handleForgotPassword = async (e) => {
    var resetInfo = {
        email: remail,
        birthday: birth,
    }
    try {
      let res = await axios.patch("https://api.sleepmedic.me:8443/account/auth/reset_password", resetInfo, {headers});
      
    } catch (err) {
      console.log("Reset Password Failed");
      setOpen(false);
      setOpenFin(true);
      setBirth("");
      setREmail("");
      return;
    }
    setOpen(false);
    setOpenFin(true);
    setBirth("");
    setREmail("");
  }

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
      <Paper sx={{backgroundColor: '#D9D3E4',  width: isMobile ? '300px' : '350px', padding: 2, borderRadius: '1rem'}} square={false} elevation={3} style={{textAlign: 'center'}}> 
        <img onMouseOut={() => setLogoSize('100%')} onMouseOver={() => {setLogoSize('120%')}} onClick={() => navigate('/')} src={logo} title='Back to Language Select' alt="Sleep-Medic Logo" style={{height: "8rem", width: "auto", scale: logoSize}}/>
       
        <Typography variant="h4" component="div"
            sx={{flexGrow: 1,
                fontWeight: 'bold',
                color: '#black', 
              
                textAlign: 'center'}}>
              {t("login.title")} 
          </Typography>
        {error && <Alert severity="error" sx={{color: "red", fontSize: "0.85rem"}}><strong>Username/Password was entered incorrectly!</strong></Alert>}
        
        <FormControl sx={{width: '80%', marginTop: '10pt'}}>
          <InputLabel>{t("login.email")}</InputLabel>
          <OutlinedInput
            type="email"
            id="email"
            color="secondary"
            value={email}
            label={t("login.email")}
            sx={{ background: 'white', input: { color: 'black' }}}
            onChange = {(e)=>
                setEmail(e.target.value)}
                 
          />
        </FormControl>
        
        <FormControl sx={{width: '80%', marginTop: '20pt'}}>
          <InputLabel>{t("login.password")}</InputLabel>
          <OutlinedInput
            type="password"
            id="password"
            color="secondary"
            value={password}
            label={t("login.password")}
            sx={{ background: 'white', input: { color: 'black' }  }} 
            onChange = {(e)=>
                setPassword(e.target.value)}
                
          />
        </FormControl>
        
        <Box display="flex" alignItems="center" justifyContent="center" padding='0px'>
          {t("login.remember-me")}<Checkbox onClick={()=>setRememberMe(!rememberMe)}/> 
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" padding='0px'>
          <Button type="submit" variant="contained" color="primary" onClick={(e) => handleLogin(e)}>{t("login.login")}</Button>
        </Box>
        
       
        <Box display="flex" alignItems="center" justifyContent="center" padding='0px'>
          <Button style={{color: "white"}} onClick={() => setOpen(true)}>{t("login.forgot-password.title")}</Button>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" padding='0px'>
          <Link to="/createaccount" style={{color: "white"}}>{t("login.or-create")}</Link>
        </Box>
        
        <Dialog open={open} onClose={() => setOpen(false)}
        PaperProps={{style: {backgroundColor:'#D9D3E4'}}}>
          <DialogTitle>{t("login.forgot-password.title")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
            {t("login.forgot-password.instructions")}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label={t("login.forgot-password.email")}
              type="email"
              value={remail}
              onChange={(e) => setREmail(e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="birthday"
              label={t("login.forgot-password.dob")}
              type="date"
              fullWidth
              variant="standard"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' onClick={() => setOpen(false)}>{t("login.forgot-password.cancel")}</Button>
            <Button variant='contained' onClick={(e) => handleForgotPassword(e)}>{t("login.forgot-password.recover")}</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openFin}
        >
          <DialogTitle>{t("login.forgot-password.thank-you")}</DialogTitle>
          <DialogContent>
              <DialogContentText>
              {t("login.forgot-password.final-message")}
              </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenFin(false)}>{t("login.forgot-password.confirm")}</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
    
  );
}

export default Login;