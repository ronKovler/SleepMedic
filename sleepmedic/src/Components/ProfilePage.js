import "./ProfilePage.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import {TextField, Button, Alert, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText  } from "@mui/material/";
import axios from "axios";
import { useState } from 'react';
import React from 'react';
import {useCookies} from "react-cookie";


//Shaun
function OpenProfilePage() {
    //implement logic for collecting parameters
    const [open, setOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [complexError, setComplexError] = useState(false);
    const [confirmError, setConfirmError] = useState(false);
    const [cookies, setCookies, removeCookies] = useCookies("_auth");

    function getCookiesDict() {
        let cookies = document.cookie.split("; ");
        let cookiesDict = cookies.map(cookie => cookie.split('=')).reduce((acc, [key, ...val]) => {
            acc[key] = val.join('=');
            return acc;
        }, {});
        console.log(cookiesDict._auth);
        return cookiesDict;
    }

    const handlePasswordChange = async (e) => {
        if(checkvalidpassword(newPassword)){
            if (!checkMatch){      
                return;
            } 
        } else{
            setComplexError(true);
            return;
        }
        var cookies = getCookiesDict();
        console.log(cookies._auth);
        var headers = {
            "Access-Control-Allow-Origin": "http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/",
            "Content-Type": 'application/json; charset=utf-8',
            "Authorization":'Bearer ' + cookies._auth,
        }
        var password = { 
            password: newPassword,
        }
        try {
            console.log("hi");
            let res = await axios.patch("http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/api/account/update_password", password, {headers});
            console.log(res.data.token);
            setCookies("_auth", res.data.token);
        } catch(err) {
            return;
        }
        setOpen(false);
    }

    function checkvalidpassword(str) {
        if (newPassword.length < 8){
            console.log("wrong format of password");
            return false;
        }
        var hasUpperCase = /[A-Z]/.test(newPassword);
        var hasLowerCase = /[a-z]/.test(newPassword);
        var hasNumbers = /\d/.test(newPassword);
        var hasNonalphas = /\W/.test(newPassword);
        if (hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas < 4) 
        {
            console.log("wrong format of password");
            return false;
        }
        console.log("nicepassword!: " + newPassword);
         return true;
    } 

    const checkMatch = (e) => {
        if (Object.is(confirmNewPassword, newPassword)) {
            setConfirmError(true);
            console.log("ouch")
            return true;
        } else {
            setConfirmError(false);
            return false;
        }
    }

    //Delete Account

    const deleteAccount = async (e) => {
        try {
            var cookies = getCookiesDict();
            console.log(cookies._auth);
            var headers = {
                "Access-Control-Allow-Origin": "http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/",
                "Content-Type": 'application/json; charset=utf-8',
                "Authorization":'Bearer ' + cookies._auth,
            }
            let res = await axios.delete("http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/api/account/delete_account", {headers});
            console.log(res.data.token);

        } catch(err) {
            return;
        }
    }

    
    return (
        <div className="sleep-medic-container">
            <div className="profile-page-form">
                <h1>User Profile</h1>
                
                <Link to="/editgoal">
                    <Button variant="contained">Edit Your Goals</Button>
                </Link>

                <Link to="/home">
                    <Button variant="contained">Home</Button>
                </Link>

                <Button variant="contained" onClick={(e) => setOpen(true)}>Change Password</Button>

                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        Please enter your new password.
                        </DialogContentText>
                        <TextField
                        autoFocus
                        margin="dense"
                        id="new-password"
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={newPassword}
                        required
                        onChange={(e) => setNewPassword(e.target.value)}
                        />
                        {confirmError ? 
                        <TextField
                        autoFocus
                        margin="dense"
                        id="new-password"
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        /> : <TextField
                        error
                        autoFocus
                        margin="dense"
                        id="new-password"
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        helperText="Passwords do not Match!"
                        />
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={(e) => handlePasswordChange(e)}>Change Password</Button>
                    </DialogActions>
                </Dialog>


                <Button onClick={(e)=>deleteAccount(e)}>Delete Account</Button>
            </div>
        </div>
    );
}

export default OpenProfilePage;