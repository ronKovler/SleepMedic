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
import Pagination from '@mui/material/Pagination';
//import TextField from '@material-ui/core/TextField';
import TextField from '@mui/material/TextField'; // Add this line
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createTheme, styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';

const calendarTheme = createTheme({
    palette: {
        text: {
            primary: '#ffffff',
            secondary: '#ffffff',
        },
    }
});


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
        "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
        "Authorization":'Bearer ' + cookies._auth
    };
    return headers; 
}

function getPostHeaders() {
    const cookies = getCookiesDict();
    const headers = {
        "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
        "Content-Type": 'application/json; charset=utf-8',
        "Authorization":'Bearer ' + cookies._auth
    };
    return headers;
}

var headers = {
    "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
    "Content-Type": 'application/json; charset=utf-8',
}


function makeBooleanCheckbox(title, value, onChangeFunction) {
    return (
        <FormControl sx={{width: '100%', marginTop: '20pt'}}>
            <Grid container columns={2} justify='flex-end' alignItems='center'>
                <Grid item xs={1}>
                    <Box>
                        {title}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                    <Checkbox checked={value} onChange={(e)=>{onChangeFunction(e.target.checked)}}/>
                </Box>
                </Grid>
            </Grid>
        </FormControl>
    )
}

const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


export default function Home() {
    const navigate = useNavigate();
    // Control of popup sleep record window
    const[recordOpen, setRecordOpen] = React.useState(false);
    const [isNewRecord, setIsNewRecord] = React.useState(true);
    const [page, setPage] = React.useState(1);
    const handlePageChange = (event, value) => {
        setPage(value);
    };
    
    // User data
    // INFO
    const[username, setUsername] = React.useState('User Name');
    // AVG STATISTICS
    const[avgFallTime, setAvgFallTime] = React.useState('0');
    const[avgQuality, setAvgQuality] = React.useState('0');
    const[avgWakeTime, setAvgWakeTime] = React.useState('00:00');
    const[avgDownTime, setAvgDownTime] = React.useState('00:00');
    const[avgUpTime, setAvgUpTime] = React.useState('00:00'); 
    const[avgSleepTime, setAvgSleepTime] = React.useState('00:00');
    const[avgAwakeTime, setAvgAwakeTime] = React.useState('0');
    const[avgEfficiency, setAvgEfficiency] = React.useState('0');
    const[effAdvice, setEffAdvice] = React.useState('Your sleep efficiency is far from 90%, we recommend to keep your efficiency close to 90%.');
    const[avgHoursSlept, setAvgHoursSlept] = React.useState(0.0);

    function makeBooleanCheckbox(title, value, onChangeFunction) {
        return (
            <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                <Grid container columns={2} justify='flex-end' alignItems='center'>
                    <Grid item xs={1}>
                        <Box>
                            {title}
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                    <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                        <Checkbox checked={value} onChange={(e)=>{onChangeFunction(e.target.checked)}}/>
                    </Box>
                    </Grid>
                </Grid>
                {value && title === "Did you have any dreams?" && (
                    <TextField
                      style={{ textAlign: 'left', marginTop: '10pt' }}
                      //label="If so, feel free to jot some notes"
                      multiline
                      rows={2}
                      value={dreams}
                      onChange={(e) => setDreams(e.target.value)}
                    />
                  )}
            </FormControl>
        )
    }

    // New record data
    // Date
    const today = dayjs();
    const[recordDate, setRecordDate] = React.useState(today);
    // Integer
    const[quality, setQuality] = React.useState(0); 
    const[fallTime, setFallTime] = React.useState(0); 
    const[awakeTime, setAwakeTime] = React.useState(0);
    // Time
    const[downTime, setDownTime] = React.useState(today.set('hour', 22).set('minute',  30).set('second', 0)); 
    const[sleepTime, setSleepTime] = React.useState(today.set('hour', 23).set('minute',  30).set('second', 0));
    const[wakeTime, setWakeTime] = React.useState(today.set('hour', 8).set('minute',  30).set('second', 0));
    const[upTime, setUpTime] = React.useState(today.set('hour', 9).set('minute',  30).set('second', 0));
    // Boolean
    const[physicalActivity, setPhysicalActivity] = React.useState(false);
    const[naps, setNaps] = React.useState(false);
    const[caffeineConsumption, setCaffeineConsumption] = React.useState(false);
    const[alcoholConsumption, setAlcoholConsumption] = React.useState(false);
    const[electronics, setElectronics] = React.useState(false);
    const[difficultStayingAsleep, setDifficultStayingAsleep] = React.useState(false);
    const[difficultFallingAsleep, setDifficultFallingAsleep] = React.useState(false);
    const[racingThoughts, setRacingThoughts] = React.useState(false);
    // String: Dream & Description
    const[dreams, setDreams] = React.useState("");
    const[dreamsCB, setDreamsCB] = React.useState(false);


    // Record update
    const[monthRecords, setMonthRecords] = React.useState([]);
    const[editMode, setEditMode] = React.useState(false);
    const[recordId, setRecordID] = React.useState(0);

    function RecordedDays(props) {
        const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
      
        let isSelected =
          !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

        var f_date = `${day.get('year')}-${(day.get('month') + 1).toString().padStart(2, '0')}-${day.get('date').toString().padStart(2, '0')}`;
        if (monthRecords.includes(f_date)) {
            isSelected = true;
        }
        else {
            isSelected = false;
        }
      
        return (
          <Badge
            key={props.day.toString()}
            overlap="circular"
            badgeContent={isSelected ? '😴' : undefined}
          >
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
          </Badge>
        );
    }

    const handleRestlessnessChange = (e, value) => {
        setQuality(value);
    };

    /*
    * This is meant for getData() only rn, make sure you check what its taking in in getData()
    */
    function getFormattedTime(time) {
        time = time.slice(0, 5);
        let hours = parseInt(time.slice(0, 2), 10);
        let remainder = time.slice(2);
        if (hours > 22) {
            hours -= 12;
            return hours + remainder + " PM";
        } else if (hours > 12) {
            hours -= 12;
            return "0" + hours + remainder + " PM";
        } else if (hours > 9) {
            return hours + remainder + " AM";
        }
        return "0" +hours + remainder + " AM";
    }

    async function getData() {
        const headers = getGetHeaders();
        
        try {
            // Get user name
            let res = await axios.get("https://api.sleepmedic.me:8443/home/info", {headers});
            let name = res.data.firstName + ' ' + res.data.lastName;
            setUsername(name);

            // Get user average sleep data
            res = await axios.get("https://api.sleepmedic.me:8443/home/average", {headers});
            console.log(res.data);
            setAvgFallTime(res.data.fallTime + " min");
            setAvgAwakeTime(res.data.awakeTime + " min");
            setAvgQuality(res.data.quality);
            setAvgDownTime(getFormattedTime(res.data.downTime));
            setAvgSleepTime(getFormattedTime(res.data.sleepTime));
            setAvgWakeTime(getFormattedTime(res.data.wakeTime));
            setAvgUpTime(getFormattedTime(res.data.upTime));
            setAvgEfficiency(res.data.efficiency);
            setAvgHoursSlept(res.data.hoursSlept + " hrs");

            if (Math.abs(res.data.efficiency * 100 - 90) < 3) {
                setEffAdvice("Great work! Keep good sleep!");
            }
            const date = new Date();
            let currentDate = date.toISOString().slice(0, 10);
            console.log(currentDate);
            res = await axios.get("https://api.sleepmedic.me:8443/home/calendar/" + currentDate, {headers});
            setMonthRecords(res.data);
            //console.log(res.data);
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
        // TODO: add the boolean & String values to the record, format them as needed
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
            //sleep journal data below (qualitative)
            physicalActivity: physicalActivity,
            naps: naps,
            caffeineConsumption: caffeineConsumption,
            alcoholConsumption: alcoholConsumption,
            electronics: electronics,
            difficultStayingAsleep: difficultStayingAsleep,
            difficultFallingAsleep: difficultFallingAsleep,
            racingThoughts: racingThoughts,
            dreams: dreams
        };
    }

    const DreamTextField = ({ value }) => {
      return (
        <TextField
          style={{ textAlign: 'left' }}
          label="Message Field" // Updated prop name
          multiline
          rows={2}
          value={value}
          onChange={(e) => {}}
        />
      );
    };

//handleOnChange function for dream checkbox. Render textfield based on box state.
    const handleOnChangeDreamCB = (checked) => {
        setDreamsCB(checked);
        if (!checked) {
            setDreams(""); // Clear the dreams text field content if the checkbox is unchecked
        }
    };

    const handleSubmit = async (e) => {
        const headers = getPostHeaders();

        // if (recordDate > today) {
        //     alert('You cannot record future data. Please try again.');
        //     setRecordOpen(false);
        //     resetInput();
        //     return;
        // }

        //add a flag/indicator for edit vs create new record.
        if (editMode) {
            try {
                let record = formatRecord();
                let res = await axios.patch("https://api.sleepmedic.me:8443/home/update_record/" + recordId, record, {headers});
            }
            catch (err2) {
                console.log("Failed to update record.");
            }
        }
        else {
            try {
                let record = formatRecord();
                let res = await axios.post("https://api.sleepmedic.me:8443/home/create_record", record, {headers});
            }
            catch (err) {
                alert("Already recorded!");
                console.log('Failed to create record.');
            }
        }
        /*try {
            let record = formatRecord();
            let res = await axios.post("https://api.sleepmedic.me:8443/home/create_record", record, {headers});
        }
        catch (err) {
            alert("Already recorded!");
            console.log('Failed to create record.');
        }*/
        setRecordOpen(false);
        setEditMode(false);
        resetInput();
        getData(); // Reload averages and calendar incase update/create changes them.
    }

    // Auto loading
    React.useEffect(() => {
        //Check if not logged in and redirect.
        const cookies = getCookiesDict();
        if (cookies._auth == null) {
            navigate("/")
        }
        //Get Data
        getData();
    }, []);

    
    // Popup window handlers
    function resetInput() {
        // TODO: reset all booleans to default values (false), String to empty string
        setPage(1);
        setRecordDate(today);
        setQuality(0);
        setFallTime(0);
        setAwakeTime(0);
        setDownTime(today.set('hour', 22).set('minute',  30).set('second', 0));
        setSleepTime(today.set('hour', 23).set('minute',  30).set('second', 0));
        setWakeTime(today.set('hour', 8).set('minute',  30).set('second', 0));
        setUpTime(today.set('hour', 9).set('minute',  30).set('second', 0));
        setDifficultFallingAsleep(false);
        setDifficultStayingAsleep(false);
        setPhysicalActivity(false);
        setNaps(false);
        setAlcoholConsumption(false);
        setCaffeineConsumption(false);
        setElectronics(false);
        setRacingThoughts(false);
        setDreamsCB(false);
        setDreams("");
    }
    const handleClickOpen = () => {
        setIsNewRecord(true);
        setRecordOpen(true);
    };
    const handleClose = () => {
        setRecordOpen(false);
        setEditMode(false);
        resetInput();
    };

    const handleNewCalendarDates = async (newMonthClicked) => {
        console.log('Selected day', newMonthClicked.$d)
        const formattedDate = dayjs(newMonthClicked.$d).format('YYYY-MM-DD');
        const headers  = getGetHeaders();

        let res = await axios.get("https://api.sleepmedic.me:8443/home/calendar/" + formattedDate, {headers});
        setMonthRecords(res.data);
    }

    const handleOpenEditForm = async (dayClicked) => {
        console.log('Selected day', dayClicked.$d)
        const formattedDate = dayjs(dayClicked.$d).format('YYYY-MM-DD');
        console.log('Formatted date', formattedDate);
        const headers = getGetHeaders();
        if (!monthRecords.includes(formattedDate)) {
            alert('No record found for the date ' + formattedDate);
            return;
        }
        setRecordOpen(true);
        setEditMode(true);
        //console.log(res.data);
        try {
            let res = await axios.get("https://api.sleepmedic.me:8443/home/view_record/" + formattedDate, {headers});
            console.log(res.data);
            setRecordID(res.data.recordID);

            //set the calendar field
            setRecordDate(dayClicked);

            // Set the time fields
            setFallTime(res.data.fallTime);
            setAwakeTime(res.data.awakeTime);
            //set time picker fields
            setDownTime(dayjs(res.data.downTime, 'HH:mm'));
            setSleepTime(dayjs(res.data.sleepTime, 'HH:mm'));
            setWakeTime(dayjs(res.data.wakeTime, 'HH:mm'));
            setUpTime(dayjs(res.data.upTime, 'HH:mm'));

            //set the quality slider
            setQuality(res.data.quality);

            //set the boolean fields - journal data
            setPhysicalActivity(res.data.physicalActivity);

            setNaps(res.data.naps);

            setCaffeineConsumption(res.data.caffeineConsumption);

            setAlcoholConsumption(res.data.alcoholConsumption);
            setElectronics(res.data.electronics);
            setDifficultStayingAsleep(res.data.difficultStayingAsleep);
            setDifficultFallingAsleep(res.data.difficultFallingAsleep);
            setRacingThoughts(res.data.racingThoughts);

            setDreams(res.data.dreams);
            if ((dreams === null) || (dreams === undefined)) {
                setDreamsCB(false);
            }
            else setDreamsCB(true);
            console.log("dreams:", dreams);
        }
        catch (err) {
            console.log("ERROR");
        }
    };

    function CircularProgressWithLabel(props) {
        return (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} size="8rem" thickness={6}/>
            <Box sx={{top: 0,left: 0,bottom: 0,right: 0,position: 'absolute',display: 'flex',alignItems: 'center',justifyContent: 'center',}}>
              <Typography variant="h5" component="div" color="text.secondary" fontWeight='bold'>
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
        <Box sx={{backgroundColor: "#57618E", height: '200vh' }}>
            <Navbar/>
            <Grid container spacing={2} columns={2} sx={{margin: 0}}>
                {/* LEFT PANEL */}
                <Grid item xs={1}>
                <Grid container space={2} columns={1}>
                    {/* Username Display */}
                    <Grid item xs={1}>
                        <Paper elevation={3} sx={{backgroundColor: '#7293A0'}}>
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
                        <Paper elevation={3} sx={{backgroundColor: '#D9D3E4'}}>
                            <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold'>
                                7-Day Averages
                            </Typography>
                            {/* <Typography variant='h6' component='div' textAlign='center'>
                                {getCurrentWeek()}
                            </Typography> */}
                            <Grid container columns={2}>
                                <Grid item xs={1}>
                                    <Typography variant='body' component='div' textAlign='left' paddingLeft='20pt' paddingBottom='10pt' color='black' fontSize='16pt'>
                                        Time spent falling asleep: <br/>
                                        Time spent awake in the night: <br/>
                                        Quality: <br/>
                                        Hours slept: <br/>
                                        Got into bed at: <br/>
                                        Fell asleep at: <br/>
                                        Woke up at: <br/>
                                        Got out of bed at: <br/>
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography variant='body' component='div' textAlign='left' paddingLeft='20pt' paddingBottom='10pt' color='black' fontSize='16pt'>
                                        {avgFallTime}<br/>
                                        {avgAwakeTime}<br/>
                                        {avgQuality}<br/>
                                        {avgHoursSlept}<br />
                                        {avgDownTime}<br/>
                                        {avgSleepTime}<br/>
                                        {avgWakeTime}<br/>
                                        {avgUpTime}<br/>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Box display="flex" alignItems="center" justifyContent="center" paddingBottom='10pt'>
                                <Button href="/statistics" endIcon={<LegendToggleIcon/>} variant='contained'>View Insights</Button>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={1} sx={{marginTop: '20pt'}}>
                        <Paper elevation={3} sx={{paddingBottom: '20pt', backgroundColor: '#D9D3E4'}}>
                            <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold' paddingBottom='10pt'>
                            7-Day Efficiency
                            </Typography>
                            <Grid container columns={3} alignItems="center">
                                <Grid item xs={1} paddingLeft='10pt'>
                                    <CircularProgressWithLabel value={avgEfficiency * 100}/>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant='body' component='div' textAlign='left' paddingBottom='10pt' color='black' fontSize='16pt'>
                                        {effAdvice}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Weekly Advices */}
                    <Grid item xs={1} sx={{marginTop: '20pt'}}>
                        <Paper elevation={3} sx={{backgroundColor: '#D9D3E4'}}>
                            <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold'>
                                Weekly Advices
                            </Typography>
                            <Typography variant='body' component='div' textAlign='left' paddingTop='10pt' paddingLeft='20pt' paddingBottom='10pt' color='black' fontSize='16pt'>
                                I already want to take a nap tomorrow.
                            </Typography>
                        </Paper>
                    </Grid>
                    

                    {/* Create New Record Button */}
                    <Grid item xs={1} justifyContent='center' display='flex' marginTop='20pt'>
                        {/* TODO: add event listener to create  */}
                        <Button variant='contained' endIcon={<AddCircleOutlineIcon/>} onClick={handleClickOpen}>New Record</Button>
                        {/* <Button variant='contained' onClick={
                            () => console.log(monthRecords)
                        }>TEST</Button> */}
                    </Grid>

                </Grid>
                </Grid>

                {/* RIGHT PANEL CALENDAR */}
                <Grid item xs={1}>
                    <Paper elevation={3} sx={{width: '90%'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar 
                                size='lg'
                                views={['day']} 
                                onChange={(e) => {
                                    console.log(monthRecords);
                                    setIsNewRecord(false);
                                    handleOpenEditForm(e);
                                }}
                                onMonthChange={(e) => {
                                    handleNewCalendarDates(e);
                                }}
                                slots={{day: RecordedDays,}}
                            />
                        </LocalizationProvider>      
                    </Paper>      
                </Grid>

            </Grid>

            {/* Record Popup window */}
            <Dialog open={recordOpen} onClose={handleClose}>
                <DialogTitle>
                    <Grid container columns={2} justify='flex-end' alignItems='center'>
                        <Grid item xs={1}>
                            {isNewRecord ? "New Record" : "Edit Record"}
                        </Grid>
                        <Grid item xs={1}>
                        <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                            <Tooltip title={FIELDS_SPECIFICATION} arrow>
                                <IconButton size='small'><InfoIcon/></IconButton>
                            </Tooltip>
                        </Box>
                        </Grid>
                    </Grid>
                </DialogTitle>
                
                {
                    page === 1 ?
                    <DialogContent>
                    <DialogContentText>{isNewRecord? "To record new sleep" : "To update sleep record"}, please enter your daily sleep data below.</DialogContentText>

                    {/* Date Picker */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {isNewRecord ? 
                                    <DatePicker label="Date" value={recordDate} onChange={(newDate) => setRecordDate(newDate)}/>
                                    :
                                    <DatePicker label="Date" value={recordDate} onChange={(newDate) => setRecordDate(newDate)} readOnly/>
                                }
                        </LocalizationProvider>
                    </FormControl>

                    {/* Sleep Duration Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <InputLabel>How long did it take to fall asleep? (min)</InputLabel>
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
                        <InputLabel>Did you wake up in the night? If so, for how long? (min)</InputLabel>
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
                            <TimePicker label="What time did you get into bed? " value={downTime} onChange={(newTime) => setDownTime(newTime)}/>
                        </LocalizationProvider>
                    </FormControl>

                    {/* Sleep Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker label="What time did you fall asleep?" value={sleepTime} onChange={(newTime) => setSleepTime(newTime)}/>
                        </LocalizationProvider>
                    </FormControl>

                    {/* Wake Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker label="What time did you wake up?" value={wakeTime} onChange={(newTime) => setWakeTime(newTime)}/>
                        </LocalizationProvider>
                    </FormControl>

                    {/* Up Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker label="What time did you get out of bed?" value={upTime} onChange={(newTime) => setUpTime(newTime)}/>
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
                            {/* <Button sx={{marginTop: '20pt', color: '#674747'}} onClick={handleSubmit}>Submit</Button> */}
                            <Button sx={{marginTop: '20pt', color: 'red'}} onClick={handleClose} variant=''>Cancel</Button>
                        </Grid>
                        
                    </Grid>

                </DialogContent>
                :
                <DialogContent>
                    <DialogContentText>To record new sleep, please enter your daily sleep data below.</DialogContentText>
                    {makeBooleanCheckbox("Did you engage in any physical activity today?", physicalActivity, setPhysicalActivity)}
                    {makeBooleanCheckbox("Did you have any naps during the day?", naps, setNaps)}
                    {makeBooleanCheckbox("Did you consume alcohol less than 6 hours before bedtime?", alcoholConsumption, setAlcoholConsumption)}
                    {makeBooleanCheckbox("Did you consume caffeine less than 6 hours before bedtime?", caffeineConsumption, setCaffeineConsumption)}
                    {makeBooleanCheckbox("Did you use a phone, tablet, or similar device in bed?", electronics, setElectronics)}
                    {makeBooleanCheckbox("Did you have any difficulty falling asleep?", difficultFallingAsleep, setDifficultFallingAsleep)}
                    {makeBooleanCheckbox("Did you have any difficulty staying asleep?", difficultStayingAsleep, setDifficultStayingAsleep)}
                    {makeBooleanCheckbox("Did you have any racing thoughts while in bed?", racingThoughts, setRacingThoughts)}
                    {makeBooleanCheckbox("Did you have any dreams?", dreamsCB, handleOnChangeDreamCB)}

                    <Grid container columns={2}>
                        <Grid item xs={1}>
                            {/* <Button sx={{marginTop: '20pt', color: '#674747'}} onClick={handleSubmit}>Submit</Button> */}
                            <Button sx={{marginTop: '20pt', color: 'red'}} onClick={handleClose} variant=''>Cancel</Button>
                        </Grid>
                        <Grid item xs={1}>
                            <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                                <Button sx={{marginTop: '20pt', color: '#674747'}} onClick={handleSubmit}>
                                    {isNewRecord ? "Submit" : "Update"}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                }

                <Box alignContent='center' justify="center" display="flex" marginBottom='10pt'>
                    <Pagination count={2} page={page} onChange={handlePageChange} sx={{margin: 'auto'}}/>
                </Box>
                
            </Dialog>

        </Box>
    )
}