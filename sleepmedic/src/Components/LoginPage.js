import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { TextField }  from "@mui/material/";
import { useSignIn } from 'react-auth-kit';
import axios from "axios";
import "./LoginPage.css";
import { Button } from '@mui/material';
import { styled } from '@mui/system';
import { Alert } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    // Handle login logic here
    var headers = {
      "Access-Control-Allow-Origin": "http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/",
      "Content-Type": 'application/json; charset=utf-8',
    }
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
        <Button variant="contained" color="primary" onClick={(e) => handleLogin(e)}>Login</Button>
        <Link to="/createaccount">Or create an account</Link>
      </form>
    </div>
  );
}

export default Login;