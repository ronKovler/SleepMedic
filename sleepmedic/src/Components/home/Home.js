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
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';




import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createTheme, styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const MARKS = [
    {value: 1, label: <SentimentVeryDissatisfiedIcon/>},
    {value: 2, label: <SentimentDissatisfiedIcon/>},
    {value: 3, label: <SentimentNeutralIcon/>},
    {value: 4, label: <SentimentSatisfiedIcon/>},
    {value: 5, label: <SentimentVerySatisfiedIcon/>},
]

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
    const[avgWakeTime, setAvgWakeTime] = React.useState('00:00:00');
    const[avgDownTime, setAvgDownTime] = React.useState('00:00:00');
    const[avgUpTime, setAvgUpTime] = React.useState('00:00:00'); 
    const[avgSleepTime, setAvgSleepTime] = React.useState('00:00:00');
    const[avgAwakeTime, setAvgAwakeTime] = React.useState('0');
    const[avgEfficiency, setAvgEfficiency] = React.useState('0');
    const[effAdvice, setEffAdvice] = React.useState('Your sleep efficiency is far from 90%, we recommend to keep your efficiency close to 90%.');
    const[avgHoursSlept, setAvgHoursSlept] = React.useState(0.0);


    // New record data
    // Date
    const today = dayjs();
    const[recordDate, setRecordDate] = React.useState(today);
    const[quality, setQuality] = React.useState(0); 
    const[fallTime, setFallTime] = React.useState(0); 
    const[awakeTime, setAwakeTime] = React.useState(0);
    
    const[downTime, setDownTime] = React.useState(today.set('hour', 22).set('minute',  30).set('second', 0)); // TIME 
    const[sleepTime, setSleepTime] = React.useState(today.set('hour', 23).set('minute',  30).set('second', 0)); // TIME
    const[wakeTime, setWakeTime] = React.useState(today.set('hour', 8).set('minute',  30).set('second', 0)); // TIME
    const[upTime, setUpTime] = React.useState(today.set('hour', 9).set('minute',  30).set('second', 0)); // TIME
    

    const handleRestlessnessChange = (e, value) => {
        setQuality(value);
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
            console.log(res.data);
            setAvgFallTime(res.data.fallTime);
            setAvgAwakeTime(res.data.awakeTime);
            setAvgQuality(res.data.quality);
            setAvgDownTime(res.data.downTime);
            setAvgSleepTime(res.data.sleepTime);
            setAvgWakeTime(res.data.wakeTime);
            setAvgUpTime(res.data.upTime);
            setAvgEfficiency(res.data.efficiency);
            setAvgHoursSlept(res.data.hoursSlept);

            if (Math.abs(res.data.efficiency * 100 - 90) < 3) {
                setEffAdvice("Great work! Keep good sleep!");
            }
        }
        catch (err) {
            console.log("Failed to retrieve data.");
        }
    }

    function formateDate(day) {
        let monthFix = day.get('month') + 1; 
        return `${day.get('year')}-${monthFix.toString().padStart(2, '0')}-${day.get('date').toString().padStart(2, '0')}`;
    }

    function formatRecord() {
        let monthFix = recordDate.get('month') + 1; 
        const f_date = `${recordDate.get('year')}-${monthFix.toString().padStart(2, '0')}-${recordDate.get('date').toString().padStart(2, '0')}`;
        const f_downTime = `${downTime.get('hour').toString().padStart(2, '0')}:${downTime.get('minute').toString().padStart(2, '0')}:00`;
        const f_sleepTime = `${sleepTime.get('hour').toString().padStart(2, '0')}:${sleepTime.get('minute').toString().padStart(2, '0')}:00`;
        const f_wakeTime = `${wakeTime.get('hour').toString().padStart(2, '0')}:${wakeTime.get('minute').toString().padStart(2, '0')}:00`;
        const f_upTime = `${upTime.get('hour').toString().padStart(2, '0')}:${upTime.get('minute').toString().padStart(2, '0')}:00`;
        
        console.log(f_downTime);

        return { 
            date: f_date,
            sleepTime: f_sleepTime,
            wakeTime: f_wakeTime,
            quality: quality,
            downTime: f_downTime,
            fallTime: parseInt(fallTime),
            awakeTime: parseInt(awakeTime),
            upTime: f_upTime,
        };
    }

    const handleSubmit = async (e) => {
        const headers = getPostHeaders();

        // if (recordDate > today) {
        //     alert('You cannot record future data. Please try again.');
        //     setRecordOpen(false);
        //     resetInput();
        //     return;
        // }

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
        setQuality(0);
        setFallTime(0);
        setAwakeTime(0);
        setDownTime(today.set('hour', 22).set('minute',  30).set('second', 0));
        setSleepTime(today.set('hour', 23).set('minute',  30).set('second', 0));
        setWakeTime(today.set('hour', 8).set('minute',  30).set('second', 0));
        setUpTime(today.set('hour', 9).set('minute',  30).set('second', 0));
    }
    const handleClickOpen = () => {
        setRecordOpen(true);
    };
    const handleClose = () => {
        setRecordOpen(false);
        resetInput();
    };

    function CircularProgressWithLabel(props) {
        return (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} size="8rem"/>
            <Box sx={{top: 0,left: 0,bottom: 0,right: 0,position: 'absolute',display: 'flex',alignItems: 'center',justifyContent: 'center',}}>
              <Typography variant="h6" component="div" color="text.secondary">
                {`${props.value.toFixed(1)}%`}
              </Typography>
            </Box>
          </Box>
        );
    }

    CircularProgressWithLabel.propTypes = {
        value: PropTypes.number.isRequired,
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
                                        Time awake during the night: <br/>
                                        Quality: <br/>
                                        Hours slept: <br/>
                                        Time get into bed: <br/>
                                        Time fell asleep: <br/>
                                        Time wake up: <br/>
                                        Time get out bed: <br/>
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography variant='body' component='div' textAlign='left' paddingLeft='20pt' paddingBottom='10pt'>
                                        {avgFallTime}<br/>
                                        {avgAwakeTime}<br/>
                                        {avgQuality}<br/>
                                        {avgHoursSlept.toFixed(2)}<br />
                                        {avgDownTime}<br/>
                                        {avgSleepTime}<br/>
                                        {avgWakeTime}<br/>
                                        {avgUpTime}<br/>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Box display="flex" alignItems="center" justifyContent="center" paddingBottom='10pt'>
                                <Button href="/statistics" endIcon={<LegendToggleIcon/>}>View Insights</Button>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={1} sx={{marginTop: '20pt'}}>
                        <Paper elevation={3} sx={{paddingBottom: '20pt'}}>
                            <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold' paddingBottom='10pt'>
                                Weekly Efficiency
                            </Typography>
                            <Grid container columns={3} alignItems="center">
                                <Grid item xs={1} paddingLeft='10pt'>
                                    <CircularProgressWithLabel value={avgEfficiency * 100}/>
                                </Grid>
                                <Grid item xs={2}>
                                    {effAdvice}
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

                    {/* Sleep Duration Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <InputLabel>Fall Time</InputLabel>
                        <OutlinedInput
                            value={fallTime}
                            label="fallTime"
                            onChange = {(e)=>
                                setFallTime(e.target.value)}
                            type="text"
                        />
                    </FormControl>

                    {/* Awake Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <InputLabel>Awake Time</InputLabel>
                        <OutlinedInput
                            value={awakeTime}
                            label="wokeUpCount"
                            onChange = {(e)=>
                                setAwakeTime(e.target.value)}
                            type="text"
                        />
                    </FormControl>

                    {/* Down Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker label="Down Time" value={downTime} onChange={(newTime) => setDownTime(newTime)}/>
                        </LocalizationProvider>
                    </FormControl>

                    {/* Sleep Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker label="Sleep Time" value={sleepTime} onChange={(newTime) => setSleepTime(newTime)}/>
                        </LocalizationProvider>
                    </FormControl>

                    {/* Wake Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker label="Wake Time" value={wakeTime} onChange={(newTime) => setWakeTime(newTime)}/>
                        </LocalizationProvider>
                    </FormControl>

                    {/* Up Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker label="Up Time" value={upTime} onChange={(newTime) => setUpTime(newTime)}/>
                        </LocalizationProvider>
                    </FormControl>

                    {/* Restlessness Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <Grid container columns={2} justify='flex-end' alignItems='center'>
                            <Grid item xs={1}>
                                <Box>
                                    Quality
                                </Box>
                            </Grid>
                            <Grid item xs={1}>
                            <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                                <Slider aria-label="Restless" value={quality} onChange={handleRestlessnessChange}
                                step={1} marks={MARKS} min={1} max={5} />
                            </Box>
                            </Grid>
                        </Grid>
                    </FormControl>

                    {/* Submit/Cancel */}
                    <Grid container columns={2}>
                        <Grid item xs={1}>
                            <Button sx={{marginTop: '20pt', color: '#674747'}} onClick={handleSubmit}>Submit</Button>
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