import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { TextField }  from "@mui/material/";
import { useSignIn } from 'react-auth-kit';
import axios from "axios";
import "./LoginPage.css";
import { Button } from '@mui/material';
import { styled } from '@mui/system';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useSignIn();
  const navigate = useNavigate(); 
  const handleLogin = async (e) => {
    e.preventDefault();
    // Handle login logic here
    var headers = {
      "Access-Control-Allow-Origin": "http://localhost:8080/",
      "Content-Type": 'application/json; charset=utf-8',
    }
    var loginInfo = {
        email: email,
        password: password,
    }
    try {
      let res = await axios.post("http://localhost:8080/api/account/login",  loginInfo , {headers});


      if (Object.is(res.data.token,"-1")) {
        console.log("Login Failed");
      }
      signIn({
        token: res.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: {email: email}
      })
      
      console.log(res.data);
      navigate("/home");
    } catch (err) {
      console.log("LOGIN BACKEND CALL FAILED");
    }


    console.log('Logging in...');
  };
  //Styled MUI
  const StyledButton = styled(Button)(() => ({
    
  }));

  const StyledTextField = styled(TextField)(() => ({
    
  }));


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
          color="secondary"
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
          color="secondary"
          style={{width: "70%", height: "4%"}}
        />
        <br/>
        <Button variant="contained" color="primary" onClick={(e) => handleLogin(e)}>Login</Button>
        <Link to="/createaccount" style={{color: "white"}}>Or create an account</Link>
      </form>
    </div>
  );
}

export default Login;