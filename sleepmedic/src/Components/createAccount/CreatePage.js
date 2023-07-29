import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormHelperText, Grid, Box, TextField, Button, Select, Alert, AlertTitle, Paper, Typography } from '@mui/material';
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
import {isMobile} from 'react-device-detect';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';

function CreateAccount() {
    const [logoSize, setLogoSize] = useState('100%');
    //First Part
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [next, setNext] = useState(false);
    const [confirmError, setConfirmError] = useState(true);
    const [emailFree, setEmailFree] = useState(true);
    const [emailError, setEmailError] = useState(true);
    const [phoneFree, setPhoneFree] = useState(true);
    const [phoneError, setPhoneError] = useState(true);
    const [complexError, setComplexError] = useState(true);
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
            setComplexError(false);
            return false;
        }
        var hasUpperCase = /[A-Z]/.test(password);
        var hasLowerCase = /[a-z]/.test(password);
        var hasNumbers = /\d/.test(password);
        var hasNonalphas = /\W/.test(password);
        if (hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas < 4) 
        {
            console.log("wrong format of password");
            setComplexError(false);
            return false;
        }
        console.log("nicepassword!: " + password);
        setComplexError(true);
        return true;
    } 
    const checkMatch = (e) => {
        
        if (Object.is(confirmation, password)) {
            setConfirmError(true);
            if (password.length > 0) {
                checkvalidpassword(password)
            }
            
        } else {
            setConfirmError(false);
        }
    }

    const checkEmail = async (e) => {
        if (email.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(email)) {
                setEmailError(true);
                let res = await axios.get("https://api.sleepmedic.me:8443/account/auth/check_email/" + email, headers)
                setEmailFree(res.data);
            } else {
                setEmailError(false);
                setEmailFree(true)
            }
        } else {
            setEmailError(false);
            setEmailFree(true);
        }
    }

    const checkPhone = async (e) => {
        console.log(phone);
        if (phone.length < 10 || phone === '') {
            setPhoneError(false);
            setPhoneFree(true)
        } else {
            setPhoneError(true);
            let res = await axios.get("https://api.sleepmedic.me:8443/account/auth/check_phone/" + phone, headers)
            setPhoneFree(res.data);
        }
        
    }

    const checkFirst = async(e) => {
        if (firstname.length < 1) {
            setFirstError(false);
        } else {
            setFirstError(true);
        }
    }
    const checkLast = async(e) => {
        if (lastname.length < 1) {
            setLastError(false);
        } else {
            setLastError(true);
        }
    }

    const checkBirth = async(e) => {
        if (birth === '') {
            setBirthError(false);
        } else {
            const timestamp = Date.parse(birth);
            const twelveYearInMilliseconds = 12 * 365 * 24 * 60 * 60 * 1000;
            const difference = Date.now() - timestamp;
            
            if (!isNaN(timestamp) && difference > twelveYearInMilliseconds) {
                setBirthError(true);
            } else {
                setBirthError(false);
            }
        }
        
    }

    const checkSex = async(e) => {
        if (sex === '') {
            setSexError(false);
        } else {
            setSexError(true)
        }
    }

    //Second Part (Account Details)
    const [firstname, setFirstName] = useState('');
    const [firstError, setFirstError] = useState(true);
    const [lastname, setLastName] = useState('');
    const [lastError, setLastError] = useState(true);
    const [birth, setBirth] = useState('');
    const [birthError, setBirthError] = useState(true);
    const [sex, setSex] = useState('');
    const [sexError, setSexError] = useState(true);
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
            <Paper sx={{backgroundColor: '#D9D3E4',  minWidth: isMobile ? '300px' : '400px', maxWidth: isMobile ? '350px' : '500px', padding: 2, borderRadius: '1rem'}} square={false} elevation={3} style={{textAlign: 'center'}}> 
                <img onMouseOut={() => setLogoSize('100%')} onMouseOver={() => {setLogoSize('120%')}} onClick={() => navigate('/')} src={logo} title='Back to Language Select' alt="Sleep-Medic Logo" style={{height: "8rem", width: "auto", scale: logoSize}}/>
       
                <Typography variant="h4" component="div"
                sx={{flexGrow: 1,
                fontWeight: 'bold',
                color: '#black', 
                textAlign: 'center'}}>
                    Create an Account
                </Typography>
                        
                {next ? (
                <Grid container direction={'column'}>
                    <Grid container direction={'row'}>
                        <Grid item xs>
                            <FormControl 
                            error={!firstError}
                            sx={{width: '95%', marginTop: '10pt'}}>
                                <InputLabel>First Name</InputLabel>
                                <OutlinedInput
                                    
                                    type="text"
                                    
                                    color="secondary"
                                    value={firstname}
                                    label='Email' //todo add translation
                                    sx={{ background: 'white', input: { color: 'black' }}}
                                    onChange = {(e)=>
                                        setFirstName(e.target.value)}  
                                    onBlur={e => checkFirst(e)}
                                />
                                <FormHelperText>{firstError ? null: 'Enter your first name'}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <FormControl 
                            error={!lastError}
                            sx={{width: '95%', marginTop: '10pt'}}>
                                <InputLabel>Last Name</InputLabel>
                                <OutlinedInput
                                    
                                    type="text"
                                    
                                    color="secondary"
                                    value={lastname}
                                    label='Email' //todo add translation
                                    sx={{ background: 'white', input: { color: 'black' }}}
                                    onChange = {(e)=>
                                        setLastName(e.target.value)}  
                                    onBlur={e => checkLast(e)}
                                />
                                <FormHelperText>{lastError ? null: 'Enter your last name'}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container direction={'row'}>
                        <Grid item xs>
                            <FormControl 
                            error={!birthError}
                            sx={{width: '95%', marginTop: '10pt'}}>
                                <InputLabel shrink={true}>Birthdate</InputLabel>
                                <OutlinedInput
                                    
                                    type="date"
                                    
                                    color="secondary"
                                    value={birth}
                                    label='' //todo add translation
                                    sx={{ background: 'white', input: { color: 'black' }}}
                                    onChange = {(e)=>
                                        setBirth(e.target.value)}  
                                    onBlur={e => checkBirth(e)}
                                />
                                <FormHelperText>{birthError ? null: 'Enter a valid birthdate'}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <FormControl 
                            error={!sexError}
                            sx={{width: '95%', marginTop: '10pt'}}>
                                <InputLabel sx={{ color: 'black'}} color="secondary" id="sex-label">Sex</InputLabel>
                                <Select
                                    labelId="Sex"
                                    required
                                    id="demo-simple-select-helper"
                                    value={sex}
                                    label="Sex"
                                    onChange={(e) => {setSex(e.target.value); checkSex(e.target.value)}}
                                    onBlur={(e) => checkSex(e.target.value)}
                                    color="secondary"
                                    sx={{ background: 'white', input: { color: 'black' }}}
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={"M"}>Male</MenuItem>
                                    <MenuItem value={"F"}>Female</MenuItem>
                                    <MenuItem value={"O"}>Other</MenuItem>
                                </Select>
                                <FormHelperText>{sexError ? null: 'Select your sex'}</FormHelperText>
                            </FormControl>
                        </Grid>                
                    </Grid>
                    <Typography 
                    variant="h6" 
                    fontWeight={'bold'}
                    paddingTop={'10px'}
                    component="div" 
                    width={'95%'}
                    sx={{flexGrow: 1,color: 'black', textAlign: 'center'}}>
                        Please answer the following to the best of your knowledge.
                    </Typography>

                    <Typography 
                    variant="h7" 
                    fontWeight={'bold'}
                    component="div" 
                    width={'95%'}
                    sx={{flexGrow: 1,color: 'black', textAlign: 'center'}}>
                        On average:
                    </Typography>
                    
                    
                        
                    <Typography 
                    variant="h7" 
                    component="div" 
                    width={'95%'}
                    sx={{flexGrow: 1,color: 'black'}}>
                        How many hours do you sleep each night? 
                        <select value={q1} onChange={(e) => setQ1(e.target.value)} style={{width: "5rem"}}>
                        <option selected value={""}>None</option>
                        <option value={"3-4"}>3-4 Hours</option>
                        <option value={"5-6"}>5-6 Hours</option>
                        <option value={"7-8"}>7-8 Hours</option>
                        <option value={"9+"}>9+ Hours</option>
                    </select> 
                    </Typography>

                    <Typography 
                    variant="h7" 
                    component="div" 
                    width={'95%'}
                    sx={{flexGrow: 1,color: 'black'}}>
                        How many times do you wake up each night? 
                        <select value={q1} onChange={(e) => setQ1(e.target.value)} style={{width: "5rem"}}>
                            <option selected value={""}>None</option>
                            <option value={"3-4"}>3-4 Hours</option>
                            <option value={"5-6"}>5-6 Hours</option>
                            <option value={"7-8"}>7-8 Hours</option>
                            <option value={"9+"}>9+ Hours</option>
                        </select> 
                    </Typography>

                    <Typography 
                    variant="h7" 
                    component="div" 
                    width={'95%'}
                    sx={{flexGrow: 1,color: 'black'}}>
                        How long do you spend trying to fall asleep?
                        <select value={q3} onChange={(e) => setQ3(e.target.value)} style={{width: "5rem"}}>
                            <option selected value={""}>None</option>
                            <option value={"30-1"}>30 to an Hour</option>
                            <option value={"1-2"}>1-2 Hours</option>
                            <option value={"3-4"}>3-4 Hours</option>
                            <option value={"4+"}>4+ Hours</option>
                        </select>
                    </Typography>

                    <Typography 
                    variant="h7" 
                    component="div" 
                    width={'95%'}
                    sx={{flexGrow: 1,color: 'black'}}>
                        What time do you go to bed?
                        <select value={q4} onChange={(e) => setQ4(e.target.value)} style={{maxWidth: "7rem"}}>
                            <option selected value={""}>None</option>
                            <option value={"8pm"}>8pm</option>
                            <option value={"9-10pm"}>9-10pm</option>
                            <option value={"11-12am"}>11-12am</option>
                            <option value={"1am+"}>1am or Later</option>
                        </select>
                    </Typography>
                        
                    <Typography 
                    variant="h7" 
                    component="div" 
                    width={'95%'}
                    sx={{flexGrow: 1,color: 'black'}}>
                        What time do you wake up?
                        <select value={q5} onChange={(e) => setQ5(e.target.value)} style={{maxWidth: "7rem"}}>
                            <option selected value={""}>None</option>
                            <option value={"5am"}> 5am</option>
                            <option value={"6-7am"}>6-7am</option>
                            <option value={"8-9am"}>8-9am</option>
                            <option value={"10-11am"}>10-11am</option>
                            <option value={"12pm+"}>12pm or Later</option>
                        </select>
                    </Typography>
                                      
                    <Box display="flex" alignItems="center" justifyContent="center" paddingTop='10px'>
                        <Button endIcon={<PersonAddAltOutlinedIcon/>} onClick={(e) => {
                            checkFirst(e);
                            checkLast(e);
                            checkBirth(e);
                            checkSex(e);
                            if (firstError && lastError && birthError && sexError) {
                                handleConfirmData(e)
                            }
                        } } //todo add translation
            
                        type="submit" variant="contained" color="primary">
                            Create Account 
                        </Button>
                    </Box>
                        
                </Grid>

            ) : (
                <Grid container direction={'column'}>
                    
                    <Grid item xs>
                        <FormControl 
                        error={(!phoneFree || !phoneError)} 
                        sx={{width: '80%', marginTop: '10pt'}}
                        >
                            <InputLabel>Phone Number</InputLabel>
                            <OutlinedInput
                                type="tel"
                                id="number"
                                color="secondary"
                                
                                value={phone}
                                label='Phone Number' //todo add translation
                                sx={{ background: 'white', input: { color: 'black' }}}
                                inputProps={{
                                    maxLength: 10,
                                  }}
                                onChange = {(e)=> {
                                    let p = e.target.value.replace(/\D/g, '').slice(0, 10)
                                    setPhone(p);
                                }}  
                                onBlur={e => {
                                    checkPhone(e);
                                }}
                            />
                            <FormHelperText>{phoneFree ? null: 'This phone number already being used!'}</FormHelperText>
                            <FormHelperText>{phoneError ? null: 'This phone number is invalid'}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs>
                        <FormControl 
                        error={(!emailFree || !emailError)}
                        sx={{width: '80%', marginTop: '10pt'}}>
                            <InputLabel>Email</InputLabel>
                            <OutlinedInput
                                
                                type="email"
                                id="email"
                                color="secondary"
                                value={email}
                                label='Email' //todo add translation
                                sx={{ background: 'white', input: { color: 'black' }}}
                                onChange = {(e)=>
                                    setEmail(e.target.value)}  
                                onBlur={e => checkEmail(e)}
                            />
                            <FormHelperText>{emailFree ? null: 'This email is already being used!'}</FormHelperText>
                            <FormHelperText>{emailError ? null: 'This email is invalid'}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs>
                        <FormControl 
                        error={(!confirmError || !complexError)}
                        sx={{width: '80%', marginTop: '10pt'}}>
                            <InputLabel>Password</InputLabel>
                            <OutlinedInput
                                type="password"
                                id="password"
                                color="secondary"
                                value={password}
                                label='Password' //todo add translation
                                sx={{ background: 'white', input: { color: 'black' }}}
                                onChange = {(e)=>
                                    setPassword(e.target.value)}  
                                onBlur={e => checkMatch(e)}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs>
                        <FormControl 
                        error={(!confirmError || !complexError)}
                        sx={{width: '80%', marginTop: '10pt'}}>
                            <InputLabel> Confirm Password</InputLabel>
                            <OutlinedInput
                                type="password"
                                id="confirmPassword"
                                color="secondary"
                                value={confirmation}
                                label='Confirm Password' //todo add translation
                                sx={{ background: 'white', input: { color: 'black' }}}
                                onChange = {(e)=>
                                    setConfirmation(e.target.value)}  
                                onBlur={e => checkMatch(e)}
                            />
                            <FormHelperText>{confirmError ? null: 'These passwords do not match!'}</FormHelperText>
                            <FormHelperText>{complexError ? null: <Typography textAlign={'center'}>
                            Ensure your password is more than 8 characters long 
                            and contains a lower & Upper case letter, number, and special character (ex. !@#$%&)
                        </Typography>}</FormHelperText>
                        </FormControl>
                    </Grid>
                    
                    <Box display="flex" alignItems="center" justifyContent="center" padding='10px'>
                        <Button endIcon={<ArrowForwardOutlinedIcon/>} onClick={(e) => {
                            checkEmail(e);
                            checkPhone(e);
                            checkMatch(e);
                            if (emailFree && phoneFree && emailError && phoneError && confirmError && complexError) {
                                setNext(true);
                            }
                        }}  //todo add translation
                        type="submit" variant="contained" color="primary">
                            Continue 
                        </Button>
                    </Box>
                    
                    <Link to="/login">Or login to an existing account</Link>
                
                </Grid>
                
            )}
            </Paper>
        </Box>
    );
}
    export default CreateAccount;