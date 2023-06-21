import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField }  from "@mui/material/";
import "./LoginPage.css";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
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
      </form>
    </div>
  );
}

export default Login;
