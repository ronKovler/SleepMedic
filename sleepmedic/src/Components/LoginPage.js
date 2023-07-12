import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { TextField }  from "@mui/material/";
import { useSignIn } from 'react-auth-kit';
import axios from "axios";
import "./LoginPage.css";
import { Button, Alert, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';




function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [t, i18n] = useTranslation("global");

  useEffect (() => {
    i18n.changeLanguage(localStorage.getItem("i18nextLang"));
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
    "Access-Control-Allow-Origin": "http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/",
    "Content-Type": 'application/json; charset=utf-8',
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    // Handle login logic here
    var loginInfo = {
        email: email,
        password: password,
    }
    try {
      let res = await axios.post("http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/api/account/auth/login",  loginInfo , {headers});

      if (Object.is(res.data.token,"-1")) {
        console.log("Login Failed");
        setError(true);
        return;
      }
      signIn({
        token: res.data.token,
        expiresIn: 240,
        tokenType: "Bearer",
        authState: {email: email}
      })
      
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
  const [remail, setREmail] = useState('');
  const [birth, setBirth] = useState('');

  const handleForgotPassword = async (e) => {
    var resetInfo = {
        email: remail,
        birthday: birth,
    }
    try {
      let res = await axios.patch("http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/api/account/auth/reset_password", resetInfo, {headers});

      
    } catch (err) {
      console.log("Reset Password Failed");
      return;
    }
  }

  return (
    <div className="sleep-medic-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Log in to Sleep-Medic</h1>
        {error && <Alert severity="error" sx={{color: "red", fontSize: "0.85rem"}}><strong>Username/Password was Entered Incorrectly!</strong></Alert>}
        <label style={{fontWeight: "bold"}} htmlFor="email">Email:</label>
        <TextField
          type="email"
          id="email"
          value={email}
          placeholder="Username" 
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
          color="secondary"
          style={{width: "70%", height: "4%"}}
          sx={{ input: { color: 'black' }, fieldset: { borderColor: "white" }  }}
          required
        />
        <br/>
        <br/>
        <label style={{fontWeight: "bold"}} htmlFor="password">Password:</label>
        <TextField
          type="password"
          id="password"
          value={password}
          placeholder="Password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
          color="secondary"
          style={{width: "70%", height: "4%"}}
          sx={{ input: { color: 'black' }, fieldset: { borderColor: "white" }  }}
          required
        />
        <br/><br/>
        <Button style={{color: "white"}} onClick={() => setOpen(true)}>Forgot Password</Button>
        <Button variant="contained" color="primary" onClick={(e) => handleLogin(e)}>Login</Button>
        <Link to="/createaccount" style={{color: "white"}}>Or create an account</Link>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the email and your birthday associated with your account to initiate the password recovery process.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              value={remail}
              onChange={(e) => setREmail(e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="birthday"
              label="Birthday"
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
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={(e) => handleForgotPassword(e)}>Recover Password</Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}

export default Login;