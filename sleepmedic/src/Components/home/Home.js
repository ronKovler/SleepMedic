/*
 *  Home page for Sleep Medic app
 */
import dayjs from 'dayjs';
import * as React from 'react';
import axios from "axios";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Navbar from '../navbar/Navbar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createTheme, styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



const FIELDS_SPECIFICATION = `
Fields Explanation: 
Fall asleep is the time you take to fall asleep.
Restlessness is the level of restless you felt when you decide to sleep.
Sleep duration is the amount of time you take for a continous sleep.
Woke up time is the total count of you wake up in the middle of the night.
`;

function getCurrentWeek() {
    let now = new Date();
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

function getCookiesDict() {
    let cookies = document.cookie.split("; ");
    let cookiesDict = cookies.map(cookie => cookie.split('=')).reduce((acc, [key, ...val]) => {
        acc[key] = val.join('=');
        return acc;
    }, {});
    return cookiesDict;
}

function getGetHeaders() {
    const cookies = getCookiesDict();
    const headers = {
        "Access-Control-Allow-Origin": "http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/",
        "Authorization":'Bearer ' + cookies._auth
    };
    return headers; 
}

function getPostHeaders() {
    const cookies = getCookiesDict();
    const headers = {
        "Access-Control-Allow-Origin": "http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/",
        "Content-Type": 'application/json; charset=utf-8',
        "Authorization":'Bearer ' + cookies._auth
    };
    return headers;
}

export default function Home() {
    // Control of popup sleep record window
    const[recordOpen, setRecordOpen] = React.useState(false);
    
    // User data
    // INFO
    const[username, setUsername] = React.useState('User Name');
    // AVG STATISTICS
    const[avgFallTime, setAvgFallTime] = React.useState('0');
    const[avgQuality, setAvgQuality] = React.useState('0');
    const[avgHoursSlept, setAvgHoursSlept] = React.useState('0');
    const[avgWakeTime, setAvgWakeTime] = React.useState('0');
    const[avgDownTime, setAvgDownTime] = React.useState('00:00:00');
    const[avgUpTime, setAvgUpTime] = React.useState('00:00:00'); 
    const[avgSleepTime, setAvgSleepTime] = React.useState('');
    const[avgAwakeTime, setAvgAwakeTime] = React.useState('');
    const[avgEfficiency, setAvgEfficiency] = React.useState('');

    // New record data
    // Date
    const today = dayjs();
    const[recordDate, setRecordDate] = React.useState(today);

    const[fallAsleepTime, setFallAsleepTime] = React.useState(0); //Falltime
    const[restlessness, setRestlessness] = React.useState(0); //Quality
    const[sleepDuration, setSleepDuration] = React.useState(0); // SleeptTime
    const[wokeUpCount, setWokeUpCount] = React.useState(0); //WakeTime
    const[dream, setDreams] = React.useState(false); // DELETE
    const[bedTimeHelper, setBedTimeHelper] = React.useState(today.set('hour', 8).set('minute',  30).set('second', 0)); //downTime
    const[upTimeHelper, setUpTimeHelper] = React.useState(today.set('hour', 23).set('minute',  30).set('second', 0)); //upTime
    const[awakeTime, setAwakeTime] = React.useState('');

    const handleRestlessnessChange = (e, value) => {
        setRestlessness(value);
    };

    async function getData() {
        const headers = getGetHeaders();
        
        try {
            // Get user name
            let res = await axios.get("http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/api/home/info", {headers});
            let name = res.data.firstName + ' ' + res.data.lastName;
            setUsername(name);

            // Get user average sleep data
            res = await axios.get("http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/api/home/average", {headers});
            console.log(res);
            // setAvgFallTime(res.data.fallTime);
            // setAvgQuality(res.data.restlessness);
            // setAvgHoursSlept(res.data.sleepTime);
            // setAvgWakeTime(res.data.wakeUpCount);
            // setAvgDownTime(res.data.downTime);
            // setAvgUpTime(res.data.upTime);
        }
        catch (err) {
            console.log("Failed to retrieve name.");
        }
    }

    function formateDate(day) {
        let monthFix = day.get('month') + 1; 
        return `${day.get('year')}-${monthFix.toString().padStart(2, '0')}-${day.get('date').toString().padStart(2, '0')}`;
    }

    function formatRecord() {
        let monthFix = recordDate.get('month') + 1; 
        const f_date = `${recordDate.get('year')}-${monthFix.toString().padStart(2, '0')}-${recordDate.get('date').toString().padStart(2, '0')}`;
        const f_bedTime = `${bedTimeHelper.get('hour').toString().padStart(2, '0')}:${bedTimeHelper.get('minute').toString().padStart(2, '0')}:00`;
        const f_upTime = `${upTimeHelper.get('hour').toString().padStart(2, '0')}:${upTimeHelper.get('minute').toString().padStart(2, '0')}:00`;
        console.log(f_bedTime);

        return { 
            date: f_date,
            fallTime: fallAsleepTime,
            sleepTime: sleepDuration,
            wakeTime: wokeUpCount,
            downTime: f_bedTime,
            upTime: f_upTime,
            quality: restlessness,
            awakeTime: 30,
        };
    }

    const handleSubmit = async (e) => {
        const headers = getPostHeaders();

        if (recordDate > today) {
            alert('You cannot record future data. Please try again.');
            setRecordOpen(false);
            resetInput();
            return;
        }

        try {
            let record = formatRecord();
            let res = await axios.post("http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/api/home/create_record", record, {headers});
        }
        catch (err) {
            alert("Already recorded!");
            console.log('Failed to create record.');
        }
        setRecordOpen(false);
        resetInput();
    }

    // Auto loading
    React.useEffect(() => {
        getData();
    }, []);

    
    // Popup window handlers
    function resetInput() {
        setRecordDate(today);
        setFallAsleepTime(0);
        setRestlessness(0);
        setSleepDuration(0);
        setWokeUpCount(0);
        setDreams(false);
    }
    const handleClickOpen = () => {
        setRecordOpen(true);
    };
    const handleClose = () => {
        setRecordOpen(false);
        resetInput();
    };


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
                                {getCurrentWeek()}
                            </Typography>
                            <Grid container columns={2}>
                                <Grid item xs={1}>
                                    <Typography variant='body' component='div' textAlign='left' paddingLeft='20pt' paddingBottom='10pt'>
                                        Time spent falling asleep: <br/>
                                        Restlessness: <br/>
                                        Time spent sleeping: <br/>
                                        Woke up in the night: <br/>
                                        Went to bed at: <br/>
                                        Woke up at: <br/>
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography variant='body' component='div' textAlign='left' paddingLeft='20pt' paddingBottom='10pt'>
                                        {avgFallTime}<br/>
                                        {avgQuality}<br/>
                                        {avgHoursSlept}<br/>
                                        {avgWakeTime}<br/>
                                        {avgDownTime}<br/>
                                        {avgUpTime}<br/>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Box display="flex" alignItems="center" justifyContent="center" paddingBottom='10pt'>
                                <Button href="/statistics" endIcon={<LegendToggleIcon/>}>View Insights</Button>
                            </Box>
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
                <DialogTitle>
                    <Grid container columns={2} justify='flex-end' alignItems='center'>
                        <Grid item xs={1}>New Record</Grid>
                        <Grid item xs={1}>
                        <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                            <Tooltip title={FIELDS_SPECIFICATION} arrow>
                                <IconButton size='small'><InfoIcon/></IconButton>
                            </Tooltip>
                        </Box>
                        </Grid>
                    </Grid>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>To record new sleep, please enter your daily sleep data below.</DialogContentText>

                    {/* Date Picker */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date"
                                    value={recordDate}
                                    onChange={(newDate) => setRecordDate(newDate)}
                                />
                        </LocalizationProvider>
                    </FormControl>
                    
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

                    {/* Work Up Count Input */}
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

                    {/* Bed Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker label="Bed Time" value={bedTimeHelper} onChange={(newTime) => setBedTimeHelper(newTime)}/>
                        </LocalizationProvider>
                    </FormControl>

                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker label="Up Time" value={upTimeHelper} onChange={(newTime) => setUpTimeHelper(newTime)}/>
                        </LocalizationProvider>
                    </FormControl>

                    {/* Restlessness Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        {/* <InputLabel>Restlessness</InputLabel>
                        <OutlinedInput
                            value={restlessness}
                            label="restlessness"
                            onChange = {(e)=>
                                setRestlessness(e.target.value)}
                            type="text"
                        /> */}
                        <Grid container columns={2} justify='flex-end' alignItems='center'>
                            <Grid item xs={1}>
                                <Box>
                                    Restlessness
                                </Box>
                            </Grid>
                            <Grid item xs={1}>
                            <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                                <Slider aria-label="Restless" value={restlessness} onChange={handleRestlessnessChange} valueLabelDisplay="auto"
                                step={1} marks min={0} max={10}/>
                            </Box>
                            </Grid>
                        </Grid>
                    </FormControl>

                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <Grid container columns={2} justify='flex-end' alignItems='center'>
                            <Grid item xs={1}>
                                <Box>
                                    Dreams
                                </Box>
                            </Grid>
                            <Grid item xs={1}>
                            <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                                <Checkbox checked={dream} onChange={(e)=>{setDreams(e.target.checked)}}/>
                            </Box>
                            </Grid>
                        </Grid>
                       
                    </FormControl>

                    {/* Submit/Cancel */}
                    <Grid container columns={2}>
                        <Grid item xs={1}>
                            <Button sx={{marginTop: '20pt', color: '#674747'}} onClick={handleSubmit}>Submit</Button>
                            <Button sx={{marginTop: '20pt', color: '#674747'}} onClick={() => {
                                console.log(recordDate);
                                console.log(today);
                                console.log(recordDate > today);
                                }
                                }>TEST</Button>
                        </Grid>
                        <Grid item xs={1}>
                            <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                                <Button sx={{marginTop: '20pt', color: 'red'}} onClick={handleClose} variant=''>Cancel</Button>
                            </Box>
                        </Grid>
                    </Grid>

                </DialogContent>
            </Dialog>

        </Box>
    )
}