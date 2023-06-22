import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { AuthProvider } from 'react-auth-kit';
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
        var values = {
            "firstName":firstname, 
            "lastName":lastname,
            "email": email,
            "password": password,
            "birthday": birth,
            "sex": sex
        }

        var jsonString = JSON.stringify(values);
        var json = JSON.parse(jsonString);
        console.log(json);
        try {
            let res = await axios.post("http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/api/account/create_account", {
                json,
            },
            { headers: {
                "Access-Control-Allow-Origin": "http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/",
                "Content-Type": 'application/json; charset=utf-8',
            }});
        } catch (err) {
            console.log("ACCOUNT CREATE FAILED BACKEND CALL");
        }
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
                    <input type="text" value={firstname} onChange={(e) => setFirstName(e.target.value)} placeholder='First Name'/>
                    &nbsp;
                    <input type="text" value={lastname} onChange={(e) => setLastName(e.target.value)} placeholder='Last Name'/>
                    &nbsp;
                    <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} placeholder='Birthdate'/>
                    &nbsp;
                    <input type="text" value={sex} onChange={(e) => setSex(e.target.value)} placeholder='M/F/O'/>
                    &nbsp;
                </div>
                <br/><br/><br/>
                <div>
                    <h3>Please answer the follwing to the best of your knowledge.</h3>
                    <h4>On average:</h4>
                    How many hours do you sleep each night? &nbsp;
                    <input type="text" value={firstname} onChange={(e) => setFirstName(e.target.value)}/>
                    <br/>
                    How many times do you wake up each night? &nbsp;
                    <input type="text" value={firstname} onChange={(e) => setFirstName(e.target.value)}/>
                    <br/>
                    How long do you spend trying to fall asleep? &nbsp;
                    <input type="text" value={firstname} onChange={(e) => setFirstName(e.target.value)}/>
                    <br/>
                    What time do you go to bed? &nbsp;
                    <input type="text" value={firstname} onChange={(e) => setFirstName(e.target.value)}/>
                    <br/>
                    What time do you wake up? &nbsp;
                    <input type="text" value={firstname} onChange={(e) => setFirstName(e.target.value)}/>
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
                color="secondary"
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
                color="secondary"
                />
                <br/>
                <label style={{color:"white"}}>Confirm Password:</label>
                {Object.is(confirmation, password) ? <TextField
                type="password"
                id="confirmPassword"
                label="Confirm Password" 
                variant="outlined"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                style={{ width: "70%", height: "4%" }}
                color="secondary"
                /> : <TextField
                type="password"
                error
                id="confirmPassword"
                label="Confirm Password" 
                variant="outlined"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                style={{ width: "70%", height: "4%" }}
                color="secondary"
                helperText="These passwords do not match!"
                />}
                <br/>

                <br />
                <Button type="submit" variant="contained" color="primary">Create Account</Button>
                <Link to="/login" style={{ color: "white" }}>Or log in to an existing account</Link>
            </form>
        </div>}
        </div>
    );
    }

    export default CreateAccount;
