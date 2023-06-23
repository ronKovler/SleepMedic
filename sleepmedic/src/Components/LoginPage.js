import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField }  from "@mui/material/";
import { AuthProvider } from 'react-auth-kit';
import { useSignIn } from 'react-auth-kit';
import axios from "axios";
import "./LoginPage.css";
import { valueToPercent } from '@mui/base';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useSignIn();
  const handleLogin = async (e) => {
    e.preventDefault();
    // Handle login logic here
    
    try {
      
      let res = await axios.post("ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/", {
        email: email,
        password: password
      });

      signIn({
        token: res.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: {email: email}
      })

    } catch (err) {
      console.log("LOGIN BACKEND CALL FAILED");
    }


    console.log('Logging in...');
  };


  return (
    <div className="sleep-medic-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Log in to Sleep-Medic</h1>
        <label htmlFor="email">Email:</label>
        <TextField
          type="email"
          id="email"
          value={email}
          label="Username" 
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
          style={{width: "70%", height: "4%"}}
        />
        <br/>
        <label htmlFor="password">Password:</label>
        <TextField
          type="password"
          id="password"
          value={password}
          label="Password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
          style={{width: "70%", height: "4%"}}
        />
        <br/>
        <button type="submit" className="login">Login</button>
        <Link to="/createaccount" style={{color: "gold"}}>Or create an account</Link>
        <br/>
        <Link to="/homepage" style={{color: "gold"}}>Temporary link to homepage</Link>
      </form>
    </div>
  );
}

export default Login;
