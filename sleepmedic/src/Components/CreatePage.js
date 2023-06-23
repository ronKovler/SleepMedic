import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Select } from '@mui/material';
import axios from 'axios';
import { AuthProvider } from 'react-auth-kit';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import "./CreatePage.css";

function CreateAccount() {
    //First Part
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [next, setNext] = useState(false);
    const [matchCheck, setMatchCheck] = useState(false);
    var attempts = 0;

    //Second Part (Account Details)
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [birth, setBirth] = useState('');
    const [sex, setSex] = useState('');

    const handleCreateAccount = (e) => {
        e.preventDefault();
        // Handle create account logic here
        attempts++;
        if (!Object.is(password, "")) {
            setNext(true);
        }
        console.log('Creating account...');
    };

    const handleConfirmData = async (e) => {
        let res = await axios.post("ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/account/create_account", {
            firstName:firstname, 
            lastName:lastname,
            email: email,
            password: password,
            birthday: birth,
            sex: sex,
        });

        /*if(res){
            alert("success");
            
            let res = await axios.post("http://localhost:3001/loadspace", {
                
            });

        }*/
    }
    return (
        <div> {next ? 
        <div className="sleep-medic-container">
            <h1>Account Details</h1>
            <div className='account-details-box'>
                <br/>
                <br/>
                <div className='account-details'>
                    &nbsp;
                    <input type="text" value={firstname} onChange={(e) => setFirstName(e.targetValue)} placeholder='First Name'/>
                    &nbsp;
                    <input type="text" value={lastname} onChange={(e) => setLastName(e.targetValue)} placeholder='Last Name'/>
                    &nbsp;
                    <input type="date" value={birth} onChange={(e) => setBirth(e.targetValue)} placeholder='Birthdate'/>
                    &nbsp;
                    <input type="text" value={sex} onChange={(e) => setSex(e.targetValue)} placeholder='M/F/O'/>
                    &nbsp;
                </div>
                <br/><br/><br/>
                <div>
                    <h3>Please answer the following to the best of your knowledge.</h3>
                    <h4>On average:</h4>
                    How many hours do you sleep each night? &nbsp;
                    <input type="text" value={firstname} onChange={(e) => setFirstName(e.targetValue)}/>
                    <br/>
                    How many times do you wake up each night? &nbsp;
                    <input type="text" value={firstname} onChange={(e) => setFirstName(e.targetValue)}/>
                    <br/>
                    How long do you spend trying to fall asleep? &nbsp;
                    <input type="text" value={firstname} onChange={(e) => setFirstName(e.targetValue)}/>
                    <br/>
                    What time do you go to bed? &nbsp;
                    <input type="text" value={firstname} onChange={(e) => setFirstName(e.targetValue)}/>
                    <br/>
                    What time do you wake up? &nbsp;
                    <input type="text" value={firstname} onChange={(e) => setFirstName(e.targetValue)}/>
                    <button onClick={(e) => handleConfirmData(e)}>Submit</button>
                </div>
                <br/>
            </div>
        </div>
        :
        <div className="sleep-medic-container">
            <form className="create-form" onSubmit={handleCreateAccount}>
                <h1>Create an Account on Sleep-Medic</h1>
                <label htmlFor="email">Email:</label>
                <TextField
                type="email"
                id="email"
                value={email}
                label="Email" 
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "70%", height: "4%" }}
                />
                <br /> <br/>
                <label htmlFor="password">Password:</label>
                <TextField
                type="password"
                id="password"
                value={password}
                label="Password" 
                variant="outlined"
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "70%", height: "4%" }}
                />
                <br/>
                <label htmlFor="password">Confirm Password:</label>
                <TextField
                type="password"
                id="password"
                label="Confirm Password" 
                variant="outlined"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                style={{ width: "70%", height: "4%" }}
                />
                <br/>
                <div>
                    {Object.is(confirmation, password) ? <div style={{color: "green", backgroundColor: "black"}}>Passwords Match</div>: <div style={{color: "red", backgroundColor: "black"}}>Passwords do not Match</div>}
                </div>
                <br />
                <button type="submit" className="createAccount">Create Account</button>
                <Link to="/login" style={{ color: "gold" }}>Or log in to an existing account</Link>
            </form>
        </div>}
        </div>
    );
    }

    export default CreateAccount;
