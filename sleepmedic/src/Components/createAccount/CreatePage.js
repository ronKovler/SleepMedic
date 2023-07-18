import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Select, Alert, AlertTitle } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import { useSignIn } from 'react-auth-kit';
import OutlinedInput from '@mui/material/OutlinedInput';
import "./CreatePage.css";
import logo from '../../sleep_logo_purp.svg';

function CreateAccount() {
    //First Part
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [next, setNext] = useState(false);
    const [confirmError, setConfirmError] = useState(true);
    const [emailFree, setEmailFree] = useState(true);
    const [complexError, setComplexError] = useState(false);
    const [t, i18n] = useTranslation("global");
    var headers = {
        "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
    }


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

    function checkvalidpassword(str) {
        
        if (password.length < 8){
            console.log("wrong format of password");
            return false;
        }
        var hasUpperCase = /[A-Z]/.test(password);
        var hasLowerCase = /[a-z]/.test(password);
        var hasNumbers = /\d/.test(password);
        var hasNonalphas = /\W/.test(password);
        if (hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas < 4) 
        {
            console.log("wrong format of password");
            return false;
        }
        console.log("nicepassword!: " + password);
         return true;
    } 
    const checkMatch = (e) => {
        if (Object.is(confirmation, password)) {
            setConfirmError(true);
        } else {
            setConfirmError(false);
        }
    }

    const checkEmail = async (e) => {
        let res = await axios.get("https://api.sleepmedic.me:8443/account/auth/check_email/" + email, headers)

        setEmailFree(res.data);
    }

    //Second Part (Account Details)
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [birth, setBirth] = useState('');
    const [sex, setSex] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    const signIn = useSignIn();

    const [q1, setQ1] = useState("");
    const [q2, setQ2] = useState("");
    const [q3, setQ3] = useState("");
    const [q4, setQ4] = useState("");
    const [q5, setQ5] = useState("");


    const handleCreateAccount = (e) => {
        e.preventDefault();
        // Handle create account logic here
        if (emailFree){
            if(checkvalidpassword(password)){
                if (confirmError){
                    setNext(true);
                    return;
                }
            } else{
                setComplexError(true);
                return;
            }
        } 
    };

    const handleConfirmData = async (e) => {
        const values = {
            firstName:firstname, 
            lastName:lastname,
            email: email,
            password: password,
            birthday: birth,
            sex: sex,
            phone: phone,
        }

        var stringify = JSON.stringify(values);
        console.log(stringify);
        var headers = {
            "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
            "Content-Type": 'application/json; charset=utf-8',
        }
        try {
            let res = await axios.post("https://api.sleepmedic.me:8443/account/auth/create_account", stringify, {headers})


            if(res){
                alert("success");
                
                console.log('Creating account & Logging In');
                var loginInfo = {
                    email: email,
                    password: password,
                }
                try {
                  let res = await axios.post("https://api.sleepmedic.me:8443/account/auth/login",  loginInfo , {headers});
            
            
                  if (Object.is(res.data.token,"-1")) {
                    console.log("Login Failed");
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
                  return;
                }
    
            }
        } catch (err) {
            console.log(err.response);
        }
        
    }
    return (
        <div> {next ?
        <div className="sleep-medic-container">
            <div className='account-details-box'>
                <h1>Account Details</h1>
                <div className='account-details'>

                    &nbsp;
                    <TextField sx={{ input: { color: 'white' }, fieldset: { borderColor: "white" }  }} variant="outlined" required color="secondary" type="text" value={firstname} onChange={(e) => setFirstName(e.target.value)} placeholder='First Name'/>
                    &nbsp;
                    <TextField sx={{ input: { color: 'white' }, fieldset: { borderColor: "white" }  }} required color="secondary" type="text" value={lastname} onChange={(e) => setLastName(e.target.value)} placeholder='Last Name'/>
                    &nbsp;
                    <TextField sx={{ input: { color: 'white' }, fieldset: { borderColor: "white" }  }} required color="secondary" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} placeholder='Birthdate'/>
                    &nbsp;
                    <FormControl required sx={{m: 0, minWidth: 100 }}>
                    <InputLabel sx={{ color: 'white'}} color="secondary" id="sex-label">Sex</InputLabel>
                    <Select
                        labelId="Sex"
                        required
                        id="demo-simple-select-helper"
                        value={sex}
                        label="Sex"
                        onChange={(e) => setSex(e.target.value)}
                        color="secondary"
                        sx={{ color: 'white', fieldset: { borderColor: "white" } }}
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"M"}>Male</MenuItem>
                        <MenuItem value={"F"}>Female</MenuItem>
                        <MenuItem value={"O"}>Other</MenuItem>
                    </Select>
                    </FormControl>
                    &nbsp;
                </div>
                <br/><br/>
                <div>
                    <h3>Please answer the following to the best of your knowledge.</h3>
                    <h4>On average:</h4>
                    
                    How many hours do you sleep each night? &nbsp;
                    <select value={q1} onChange={(e) => setQ1(e.target.value)} style={{width: "5rem"}}>
                        <option selected value={""}>None</option>
                        <option value={"3-4"}>3-4 Hours</option>
                        <option value={"5-6"}>5-6 Hours</option>
                        <option value={"7-8"}>7-8 Hours</option>
                        <option value={"9+"}>9+ Hours</option>
                    </select>
                    
                    <br/>
                    How many times do you wake up each night? &nbsp;
                    <select value={q2} onChange={(e) => setQ2(e.target.value)} style={{width: "5rem"}}>
                        <option selected value={""}>None</option>
                        <option value={"1"}>1</option>
                        <option value={"2"}>2</option>
                        <option value={"3"}>3</option>
                        <option value={"4+"}>4+</option>
                    </select>
                    <br/>
                    How long do you spend trying to fall asleep? &nbsp;
                    <select value={q3} onChange={(e) => setQ3(e.target.value)} style={{width: "5rem"}}>
                        <option selected value={""}>None</option>
                        <option value={"30-1"}>30 to an Hour</option>
                        <option value={"1-2"}>1-2 Hours</option>
                        <option value={"3-4"}>3-4 Hours</option>
                        <option value={"4+"}>4+ Hours</option>
                    </select>
                    <br/>
                    What time do you go to bed? &nbsp;
                    <select value={q4} onChange={(e) => setQ4(e.target.value)} style={{maxWidth: "7rem"}}>
                        <option selected value={""}>None</option>
                        <option value={"8pm"}>8pm</option>
                        <option value={"9-10pm"}>9-10pm</option>
                        <option value={"11-12am"}>11-12am</option>
                        <option value={"1am+"}>1am or Later</option>
                    </select>
                    <br/>
                    What time do you wake up? &nbsp;
                    <select value={q5} onChange={(e) => setQ5(e.target.value)} style={{maxWidth: "7rem"}}>
                        <option selected value={""}>None</option>
                        <option value={"5am"}> 5am</option>
                        <option value={"6-7am"}>6-7am</option>
                        <option value={"8-9am"}>8-9am</option>
                        <option value={"10-11am"}>10-11am</option>
                        <option value={"12pm+"}>12pm or Later</option>
                    </select>
                    <br/>
                    <br/>
                    <Button variant="contained" onClick={(e) => handleConfirmData(e)}>Submit</Button>
                </div>
                <br/>
            </div>
        </div>
        :
        <div className="sleep-medic-container">
            <form className="create-form" onSubmit={handleCreateAccount}>
                <img src={logo} alt="Sleep-Medic Logo" className="logo" />
                <h1 style={{maxWidth: "22rem"}}>Create an Account</h1>
                <label style={{fontWeight: "bold"}} htmlFor="email">Phone #:</label>
                <TextField 
                type="tel" 
                id="number"
                value={phone}
                style={{width: "70%", height: "4%"}}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(XXX)-XXX-XXXX"
                sx={{ input: {color: "black" }, fieldset: {borderColor: "white"}}}
                color="secondary"
                required
                />
                <br/><br/>
                <label style={{fontWeight: "bold"}} htmlFor="email">Email:</label>
                {emailFree ? <TextField
                type="email"
                id="email"
                value={email}
                placeholder="Email"
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "70%", height: "4%" }}
                onBlur={e => checkEmail(e)}
                sx={{ input: { color: 'black' }, fieldset: { borderColor: "white" }  }}
                color="secondary"
                required
                /> : <TextField
                type="email"
                id="email"
                error
                value={email}
                placeholder="Email"
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "70%", height: "4%" }}
                helperText="This email is already being used!"
                onBlur={e => checkEmail(e)}
                sx={{ input: { color: 'white' }, fieldset: { borderColor: "white" }  }}
                color="secondary"
                required
                />}
                <br/><br/>
                {complexError && <Alert severity="info">
                    <AlertTitle><strong>Password Not Complex Enough</strong></AlertTitle>
                    Please make sure your password is <br/>
                    <strong> - is longer than 8 characters</strong> <br/>
                    <strong> - contains an UpperCase Letter</strong> <br/>
                    <strong> - contains an LowerCase Letter</strong> <br/>
                    <strong> - contains a Number</strong> <br/>
                    <strong> - contains a Complex Character (ex. !@#$%&)</strong> 
                </Alert>}
                <label style={{fontWeight: "bold"}} htmlFor="password">Password:</label>
                <TextField
                type="password"
                id="password"
                value={password}
                placeholder="Password"
                variant="outlined"
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "70%", height: "4%" }}
                sx={{ input: { color: 'black' }, fieldset: { borderColor: "white" }  }}
                color="secondary"
                required
                />
                <br/><br/>
                <label style={{fontWeight: "bold"}}>Confirm Password:</label>
                {confirmError ? <TextField
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password" 
                variant="outlined"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                style={{ width: "70%", height: "4%" }}
                sx={{ input: { color: 'black' }, fieldset: { borderColor: "white" }  }}
                color="secondary"
                onBlur={(e) => checkMatch(e)}
                required
                /> : <TextField
                type="password"
                error
                id="confirmPassword"
                placeholder="Confirm Password" 
                variant="outlined"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                style={{ width: "70%", height: "4%" }}
                sx={{ input: { color: 'white' }, fieldset: { borderColor: "white" }  }}
                color="secondary"
                helperText="These passwords do not match!"
                onBlur={(e) => checkMatch(e)}
                required
                />}
                <br/>

                <br />
                <Button type="submit" variant="contained" color="primary">Create Account</Button>
                <Link to="/login">Or log in to an existing account</Link>
            </form>
        </div>}
        </div>
    );
    }

    export default CreateAccount;