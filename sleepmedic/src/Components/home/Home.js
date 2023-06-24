/*
 *  Home page for Sleep Medic app
 */
import dayjs from 'dayjs';
import * as React from 'react';
import axios from "axios";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Navbar from '../navbar/Navbar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createTheme, styled } from '@mui/material/styles';


// TODO: grab username from cookies
let username = "User Name";

// TODO: request avg from backend
let now = new Date();
let avgFallAsleepTime = 27.00; // minutes
let avgSleepDuration = 7.05;
let avgWokeUpCount = 2;
let avgBedTime = '11:45'; //TODO: temporarily, need to change
let avgUpTime = '07:28'; //TODO: temporarily, need to change


function getCurrentWeek() {
    // start of week (Sunday)
    let startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    // End of week (Saturday)
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
  
    function formatDate(date) {
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return `${month}/${day}`;
    }
    return `${formatDate(startOfWeek)}-${formatDate(endOfWeek)}`;
}

// TODO
function getCookiesDict() {
    let cookies = document.cookie.split("; ");
    let cookiesDict = cookies.map(cookie => cookie.split('=')).reduce((acc, [key, ...val]) => {
        acc[key] = val.join('=');
        return acc;
    }, {});
    return cookiesDict;
}

const getSleepData = async (e) => {
    const cookies = getCookiesDict();
    let test_tok = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrb3Yucm9uQG91dGxvb2suY29tIiwiaWF0IjoxNjg3NjM4NTM4LCJleHAiOjE2ODc2Mzg3Nzh9.z6T_zcdvo2NSy5UyDKiZNqfGRcgT_wNH2bRj0Or37Rk';
    
    var headers = {
        "Access-Control-Allow-Origin": "http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/",
        "Authorization":'Bearer ' + test_tok
    }

    try {
        let res = await axios.get("http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/api/home/info", {headers});
        console.log(res);
    }
    catch (err) {
        console.log("Failed to retrieve data.");
    }
}




export default function Home() {
    // Control of popup sleep record window
    const[recordOpen, setRecordOpen] = React.useState(false);
    const[fallAsleepTime, setFallAsleepTime] = React.useState('');
    const[sleepDuration, setSleepDuration] = React.useState('');
    const[wokeUpCount, setWokeUpCount] = React.useState('');
    const[bedTime, setBedTime] = React.useState('');
    const[upTime, setUpTime] = React.useState('');

    

    function resetInput() {
        setFallAsleepTime('');
        setSleepDuration('');
        setWokeUpCount('');
        setBedTime('');
        setUpTime('');
    }

    const handleClickOpen = () => {
        setRecordOpen(true);
    };
    const handleClose = () => {
        setRecordOpen(false);
        console.log(fallAsleepTime);
        resetInput();
    };


    const currentWeek = getCurrentWeek();

    return (
        <Box>
            <Navbar/>
            <Grid container spacing={2} columns={2} sx={{margin: 0}}>
                {/* LEFT PANEL */}
                <Grid item xs={1}>
                <Grid container space={2} columns={1}>
                    {/* Username Display */}
                    <Grid item xs={1}>
                        <Paper elevation={3} sx={{backgroundColor: '#ba000d'}}>
                            <Typography variant="h4" component="div"
                                        sx={{flexGrow: 1,
                                            fontWeight: 'bold',
                                            color: 'black', 
                                            paddingTop: '10px',
                                            paddingBottom: '10px',
                                            textAlign: 'center', color: 'white'}}>
                                {username} 
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Weekly Summary Statistics */}
                    <Grid item xs={1} sx={{marginTop: '20pt'}}>
                        <Paper elevation={3}>
                            <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold'>
                                Weekly Summary Statistics
                            </Typography>
                            <Typography variant='h6' component='div' textAlign='center'>
                                {currentWeek}
                            </Typography>
                            <Grid container columns={2}>
                                <Grid item xs={1}>
                                    <Typography variant='body' component='div' textAlign='left' paddingLeft='20pt' paddingBottom='10pt'>
                                        Time spent falling asleep: <br/>
                                        Time spent sleeping: <br/>
                                        Woke up in the night: <br/>
                                        Went to bed at: <br/>
                                        Woke up at: <br/>
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography variant='body' component='div' textAlign='left' paddingLeft='20pt' paddingBottom='20pt'>
                                        {avgFallAsleepTime}<br/>
                                        {avgSleepDuration}<br/>
                                        {avgWokeUpCount}<br/>
                                        {avgBedTime}<br/>
                                        {avgUpTime}<br/>
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>

                    {/* Weekly Advices */}
                    <Grid item xs={1} sx={{marginTop: '20pt'}}>
                        <Paper elevation={3}>
                            <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold'>
                                Weekly Advices
                            </Typography>
                            <Typography variant='body' component='div' textAlign='left' paddingTop='10pt' paddingLeft='20pt' paddingBottom='10pt'>
                                I already want to take a nap tomorrow.
                            </Typography>
                        </Paper>
                    </Grid>
                    

                    {/* Create New Record Button */}
                    <Grid item xs={1} justifyContent='center' display='flex' marginTop='20pt'>
                        {/* TODO: add event listener to create  */}
                        <Button variant='outlined' endIcon={<AddCircleOutlineIcon/>} onClick={handleClickOpen}>New Record</Button>
                        <Button onClick={(e) => getSleepData(e)}>Test get</Button>
                    </Grid>

                </Grid>
                </Grid>

                {/* RIGHT PANEL */}
                <Grid item xs={1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar views={['day']}/>
                    </LocalizationProvider>            
                </Grid>

            </Grid>

            {/* Record Popup window */}
            <Dialog open={recordOpen} onClose={handleClose}>
                <DialogTitle>New Record</DialogTitle>
                <DialogContent>
                    <DialogContentText>To record new sleep, please enter your daily sleep data below.</DialogContentText>
                    
                    {/* Fall Asleep Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <InputLabel>Fall asleep</InputLabel>
                        <OutlinedInput
                            value={fallAsleepTime}
                            label="fallAsleepTime"
                            onChange = {(e)=>
                                setFallAsleepTime(e.target.value)}
                            type="text"
                        />
                    </FormControl>

                    {/* Sleep Duration Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <InputLabel>Sleep Duration</InputLabel>
                        <OutlinedInput
                            value={sleepDuration}
                            label="sleepDuration"
                            onChange = {(e)=>
                                setSleepDuration(e.target.value)}
                            type="text"
                        />
                    </FormControl>

                    {/* Work Up Count */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <InputLabel>Woke Up Time</InputLabel>
                        <OutlinedInput
                            value={wokeUpCount}
                            label="wokeUpCount"
                            onChange = {(e)=>
                                setWokeUpCount(e.target.value)}
                            type="text"
                        />
                    </FormControl>

                    {/* Bed Time */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <InputLabel>Bed Time</InputLabel>
                        <OutlinedInput
                            value={bedTime}
                            label="wokeUpCount"
                            onChange = {(e)=>
                                setBedTime(e.target.value)}
                            type="text"
                        />
                    </FormControl>

                    {/* Up Time */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <InputLabel>Up Time</InputLabel>
                        <OutlinedInput
                            value={upTime}
                            label="wokeUpCount"
                            onChange = {(e)=>
                                setUpTime(e.target.value)}
                            type="text"
                        />
                    </FormControl>

                </DialogContent>
            </Dialog>

        </Box>
    )
}