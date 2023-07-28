import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import {TextField, Button, Alert, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Grid} from "@mui/material/";
import axios from "axios";
import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Navbar from './navbar/Navbar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useNavigate } from "react-router-dom";
import {useCookies} from "react-cookie";
import { useSignOut, useSignIn } from "react-auth-kit";

import "./ProfilePage.css";
import { Padding } from '@mui/icons-material';


//Shaun
function OpenProfilePage() {
    //implement logic for collecting parameters
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [complexError, setComplexError] = useState(false);
    const [confirmError, setConfirmError] = useState(false);
    const [changeFin, setChangeFin] = useState(false);
    const signIn = useSignIn();
    const logOut = useSignOut();
    const navigate = useNavigate();

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
            "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
            "Content-Type": 'application/json; charset=utf-8',
            "Authorization":'Bearer ' + cookies._auth,
        }
        var password = { 
            password: newPassword,
        }
        try {
            console.log("hi");
            let res = await axios.patch("https://api.sleepmedic.me:8443/account/update_password", password, {headers});
            console.log(res.data.token);
            signIn({
                token: res.data.token,
                expiresIn: 240,
                tokenType: "Bearer",
                authState: {}
            })
        } catch(err) {
            return;
        }
        setChangeFin(true);
    }

    const closeChangeConfirm = (e) => {
        setOpen(false);
        setConfirmNewPassword("");
        setNewPassword("");
        setChangeFin(false);
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
                "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
                "Content-Type": 'application/json; charset=utf-8',
                "Authorization":'Bearer ' + cookies._auth,
            }
            let res = await axios.delete("https://api.sleepmedic.me:8443/account/delete_account", {headers});
            console.log(res.data.token);
            setOpenDel(false);

        } catch(err) {
            setOpenDel(false);
            return;
        }
        
        logOut();
        setTimeout(() => { // simulate a delay
            navigate("/login");
        }, 300);
    }

    
    return (
        <div className="profile-page-container" >
            
            <Grid container spacing={2}>
                <Grid item xs={0.5}></Grid>
                <Grid item xs={7}>
                <div className="profile-page-form">
                    <h1>User Profile</h1>
                </div>
                </Grid>
            </Grid>
            <div className="profile-page-form">
                <Link to="/createreminder">
                    <Button variant="contained">Create A Reminder</Button>
                </Link>
                <Link to="/home">
                    <Button variant="contained">Home</Button>
                </Link>

                {/* Change Password */}
                <Button variant="contained" onClick={(e) => setOpen(true)}>Change Password</Button>
                <Dialog open={open} onClose={() => setOpen(false)}>
                    {changeFin ? <div><DialogTitle>Password Reset!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Continue enjoying our app.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e) => closeChangeConfirm(e)}>Continue</Button>
                    </DialogActions></div> : <div><DialogTitle>Change Password</DialogTitle>
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
                        onBlur={e => checkMatch(e)}
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
                        onBlur={e => checkMatch(e)}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        helperText="Passwords do not Match!"
                        />
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={(e) => handlePasswordChange(e)}>Change Password</Button>
                    </DialogActions></div>}
                </Dialog>

                {/* Delete Account */}
                <Button onClick={()=>setOpenDel(true)}>Delete Account</Button>

                <Dialog
                open={openDel}
                >
                    <DialogTitle>Delete Account Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete your SleepMedic Account?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e)=>deleteAccount(e)}>Yes, please delete account</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default OpenProfilePage;