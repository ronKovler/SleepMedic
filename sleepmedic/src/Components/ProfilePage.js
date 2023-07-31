import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import {TextField, Button, Alert, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Grid, Paper} from "@mui/material/";
import axios from "axios";
import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from "react-router-dom";
import {useCookies} from "react-cookie";
import { useSignOut, useSignIn } from "react-auth-kit";

import "./ProfilePage.css";
import { Padding } from '@mui/icons-material';


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

import DeleteIcon from '@mui/icons-material/Delete';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import Navbar from './navbar/Navbar';
import Box from '@mui/material/Box';
import {isMobile} from 'react-device-detect';
import NotificationAddOutlinedIcon from '@mui/icons-material/NotificationAddOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useTranslation } from 'react-i18next';


//Shaun
function OpenProfilePage() {
    //implement logic for collecting parameters
    const [newPassword, setNewPassword] = useState('');
    const [t, i18n] = useTranslation("global");
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [complexError, setComplexError] = useState(false);
    const [confirmError, setConfirmError] = useState(false);
    const [changeFin, setChangeFin] = useState(false);
    const [reminderData, setReminderData] = useState([]);
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

    function getFormattedTime(time) {
        console.log("got time: " + time)
        time = time.slice(0, 5);
        let hours = parseInt(time.slice(0, 2), 10);
        let remainder = time.slice(2);
        if (hours > 21) {
            hours -= 12;
            return hours + remainder + ' PM';
        } else if (hours > 12) {
            hours -= 12;
            return "0" + hours + remainder + ' PM';
        } else if (hours > 9) {
            return hours + remainder + ' AM';
        } else if (hours === 0) {
            return '12' + remainder + ' AM';
        }
        return "0" + hours + remainder + ' AM';
    }

    function ReminderList() {

        
        

        const handleDelete = async (reminderID) => {
            var cookies = getCookiesDict();
            console.log(cookies._auth);
            var headers = {
                "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
                "Content-Type": 'application/json; charset=utf-8',
                "Authorization":'Bearer ' + cookies._auth,
            }
            try {
              // Send a delete request to your server
              await axios.delete(`https://api.sleepmedic.me:8443/reminder/delete/${reminderID}`, {headers});
              // If the delete request is successful, update the listData state
              setReminderData((prevReminderData) =>
                prevReminderData.filter((item) => item.reminderID !== reminderID)
              );
            } catch (error) {
              console.error('Error deleting record:', error);
            }
        };

        return reminderData.length === 0 ? (
            <Typography 
            variant='h6'
            sx={{flexGrow: 1,
                color: 'black', 
                
                textAlign: 'center'}}
            >
                {t("profile.noReminders")}
            </Typography>
        ) : (
            <List dense={'dense'}>
              {reminderData.map((item) => (
                <ListItem key={item.reminderID} secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(item.reminderID)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: '#717AA8' }}>
                        {item.carrier === null ? (
                            <EmailOutlinedIcon />
                        ) : (
                            <SmsOutlinedIcon/>
                        )}

                      
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={getFormattedTime(item.triggerTime) + ' - ' + (item.message === 1 ? t("profile.bedtimeReminder") : t("profile.sleepHygieneReminder"))}
                    secondary={item.triggerDays}
                  />
                </ListItem>
              ))}
            </List>
          );
        
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

    const handleExportData = async () => {
        var cookies = getCookiesDict();
        let headers = {
            "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
            "Content-Type": 'application/json; charset=utf-8',
            "Authorization":'Bearer ' + cookies._auth,
        }
        try {
          let res = await axios.get('https://api.sleepmedic.me:8443/account/export_data', {headers});
          // Process the response or update state with the data
          console.log(res.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    

    async function getReminders() {
        var cookies = getCookiesDict();
        let headers = {
            "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
            "Content-Type": 'application/json; charset=utf-8',
            "Authorization":'Bearer ' + cookies._auth,
        }
        try {
            let res = await axios.get("https://api.sleepmedic.me:8443/reminder/view_reminders", {headers});
            console.log(res);
           
            setReminderData(res.data);
        }
        catch (err) {
            console.log('Failed to get reminders.');
        }
    }
    function getCookiesDict() {
        let cookies = document.cookie.split("; ");
        let cookiesDict = cookies.map(cookie => cookie.split('=')).reduce((acc, [key, ...val]) => {
            acc[key] = val.join('=');
            return acc;
        }, {});
        return cookiesDict;
    }

    useEffect(() => {
        const cookies = getCookiesDict();
        if (cookies._auth == null) {
            navigate("/")
        }
        getReminders();
    }, []);

    return (
        <Box  sx={{
            /*#3E4464 10px, #57618E, #717AA8 45%,  #3E4464 10px */
        background: 'repeating-radial-gradient(circle at -10% -10%, #717AA8 10px, #57618E, #3E4464 50% )',
        animation: 'animazione 13s ease-in-out infinite alternate-reverse',

        height: '100vh' ,
        width: '100vw',
        overflowX: 'hidden',
        overflowY: 'auto'

        
        }}>
            <Navbar />
            <Grid container spacing={2} columns={1} sx={{margin: 0, paddingRight: 4, paddingTop: 0, justifyContent: 'center', alignContent: 'center'}}>
                <Grid item sx>
                    <Paper elevation={3} sx={{backgroundColor: '#7293A0', minWidth: isMobile ? '100%' : 320}}>
                        <Typography
                        variant="h4" 
                        component="div"
                        sx={{flexGrow: 1,
                            fontWeight: 'bold',
                            color: 'white', 
                            padding: '10px',
                            textAlign: 'center'}}
                            >
                            {t("profile.account&Details")}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2} columns={3} direction={'row'} sx={{margin: 0, paddingRight: 4, paddingTop: 0, justifyContent: 'center', alignContent: 'center'}}>
                
                <Grid item xs={1} sx={{minWidth: isMobile ? '100%' : 320}}>
                    <Paper elevation={3} sx={{backgroundColor: '#D9D3E4', minWidth: isMobile ? '100%' : 320}}> 
                        <Typography
                        variant="h5" 
                        component="div"
                        sx={{flexGrow: 1,
                            fontWeight: 'bold',
                            color: 'black', 
                            paddingTop: '10px',
                            textAlign: 'center'}}>
                            {t("profile.reminders")}
                        </Typography>   
                        <ReminderList/>
                
                        <Box display="flex" alignItems="center" justifyContent="center" padding='10px'>
                            <Button sx={{width:'210px'}} onClick={() => navigate('/createreminder')} endIcon={<NotificationAddOutlinedIcon/>} variant="contained">{t("profile.createReminder")}</Button>
                        </Box>
                           
                    </Paper>
                </Grid>
                <Grid item xs >
                    <Grid container spacing={2} direction={'column'}>
                        <Grid item xs>
                            <Paper elevation={3} sx={{backgroundColor: '#D9D3E4', minWidth: isMobile ? 300 : 320}}>
                        
                                <Typography
                                variant="h5" 
                                component="div"
                                sx={{flexGrow: 1,
                                    fontWeight: 'bold',
                                    color: 'black', 
                                    paddingTop: '10px',
                                    textAlign: 'center'}}>
                                    {t("profile.dataExport")}
                                </Typography> 
                                <Typography
                                variant="h6" 
                                component="div"
                                sx={{flexGrow: 1,
                                    color: 'black', 
                                    textAlign: 'center'}}>
                                    {t("profile.exportPrompt")}
                                </Typography> 
                                <Box display="flex" alignItems="center" justifyContent="center" padding='10px'>
                                    <Button sx={{width:'210px'}} onClick={handleExportData} variant="contained" endIcon={<IosShareOutlinedIcon/>}>{t("profile.exportButton")}</Button>
                                </Box>
                            </Paper> 
                        </Grid>
                        <Grid item xs> 
                            <Paper elevation={3} sx={{backgroundColor: '#D9D3E4', minWidth: isMobile ? 300 : 320}}>
                                <Typography
                                variant="h5" 
                                component="div"
                                sx={{flexGrow: 1,
                                    fontWeight: 'bold',
                                    color: 'black', 
                                    paddingTop: '10px',
                                    textAlign: 'center'}}>
                                    {t("profile.accountDetails")}
                                </Typography> 
                                <Typography
                                variant="h6" 
                                component="div"
                                sx={{flexGrow: 1,
                                    color: 'black', 
                                    textAlign: 'center'}}>
                                    {t("profile.accountDetailsPrompt")}
                                </Typography> 

                                <Box display="flex" alignItems="center" justifyContent="center" padding='10px'>
                                    {/* Change Password */}
                                    <Button sx={{width:'210px'}} variant="contained" onClick={(e) => setOpen(true)} endIcon={<EditOutlinedIcon/>}>{t("profile.changePasswordButton")}</Button>
                                </Box>
                            </Paper>  
                        </Grid>
                        <Grid item xs>
                            <Paper elevation={3} sx={{backgroundColor: '#D9D3E4', minWidth: isMobile ? 300 : 320}}>
                                <Typography
                                variant="h6" 
                                component="div"
                                sx={{flexGrow: 1,
                                    color: 'black', 
                                    paddingTop: '10px',
                                    textAlign: 'center'}}>
                                    {t("profile.deletePrompt")}
                                </Typography> 
                                <Box display="flex" alignItems="center" justifyContent="center" padding='0px'>
                                    {/* Delete Account */}
                                    <Button onClick={()=>setOpenDel(true)} sx={{color:'#c41104' }}endIcon={<DeleteForeverOutlinedIcon/>}>{t("profile.deleteAccountButton")}</Button>
                                </Box>

                            
                                


                                <Dialog open={open} onClose={() => setOpen(false)} 
                                PaperProps={{style: {backgroundColor:'#D9D3E4'}}}>
                                    {changeFin ? <div><DialogTitle>{t("profile.passwordReset.title")}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            {t("profile.passwordReset.prompt")}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={(e) => closeChangeConfirm(e)}>{t("profile.passwordReset.continueButton")}</Button>
                                    </DialogActions></div> : <div><DialogTitle>{t("profile.passwordReset.changePassword")}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            {t("profile.passwordReset.prompt")}
                                        </DialogContentText>
                                        <TextField
                                        autoFocus
                                        margin="dense"
                                        id="new-password"
                                        label={t("profile.passwordReset.newPassword")}
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
                                        label={t("profile.passwordReset.confirmNewPassword")}
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
                                        <Button variant={'outlined'} onClick={() => setOpen(false)}>{t("profile.passwordReset.cancel")}</Button>
                                        <Button variant={'contained'} onClick={(e) => handlePasswordChange(e)}>{t("profile.passwordReset.changePasswordButton")}</Button>
                                    </DialogActions></div>}
                                </Dialog>

                                

                                <Dialog
                                open={openDel}
                                PaperProps={{style: {backgroundColor:'#D9D3E4'}}}
                                >
                                    <DialogTitle textAlign={'center'} fontWeight={'bold'}>
                                        {t("profile.deleteAccount.confirm")}
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText textAlign={'center'} fontWeight={'bold'}>
                                        {t("profile.deleteAccount.confirmPrompt1")} <br/> {t("profile.deleteAccount.confirmPrompt2")}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions justifyContent={'center'} alignContent={'center'}>
                                        <Button variant='contained' textAlign={'left'} onClick={() => setOpenDel(false)}>{t("profile.deleteAccount.cancel")}</Button>
                                        {/* <Box display="flex" alignItems="center" justifyContent="center" padding='10px'> */}
                                        
                                            <Button variant='contained' sx={{color:'white', backgroundColor:'#c41104' }} onClick={(e)=>deleteAccount(e)}>{t("profile.deleteAccount.deleteConfirm")}</Button>
                                        {/* </Box> */}
                                        
                                    </DialogActions>
                                </Dialog>
                            </Paper>
                        </Grid>
                    </Grid>
                     
                    
                    
                </Grid>
                
            </Grid>
        </Box>
       
    );
}

export default OpenProfilePage;